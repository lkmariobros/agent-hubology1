
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { PropertyFormData, PropertyImage, PropertyDocument } from '@/types/property-form';

/**
 * Hook for managing property storage operations
 */
export function usePropertyStorage() {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  
  /**
   * Upload property images to Supabase storage
   */
  const uploadImages = async (propertyId: string, files: File[]) => {
    setIsUploading(true);
    setProgress(0);
    
    try {
      const results = [];
      let completed = 0;
      
      // Create storage bucket if it doesn't exist
      const { data: buckets } = await supabase.storage.listBuckets();
      if (!buckets?.find(b => b.name === 'property-images')) {
        await supabase.storage.createBucket('property-images', {
          public: true,
          fileSizeLimit: 10485760, // 10MB
          allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp']
        });
      }
      
      for (const file of files) {
        // Generate a unique filename
        const fileExt = file.name.split('.').pop();
        const fileName = `${propertyId}/${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `${fileName}`;
        
        // Upload the file
        const { data, error } = await supabase.storage
          .from('property-images')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          });
          
        if (error) {
          console.error('Error uploading file:', error);
          throw error;
        }
        
        // Get the public URL
        const { data: { publicUrl } } = supabase.storage
          .from('property-images')
          .getPublicUrl(filePath);
          
        // Insert into property_images table
        const { data: imageData, error: imageError } = await supabase
          .from('property_images')
          .insert({
            property_id: propertyId,
            storage_path: filePath,
            is_cover: results.length === 0, // First image is cover
            display_order: results.length
          })
          .select('id')
          .single();
          
        if (imageError) {
          console.error('Error saving image metadata:', imageError);
          throw imageError;
        }
        
        results.push({
          id: imageData.id,
          url: publicUrl,
          path: filePath,
          isCover: results.length === 0
        });
        
        // Update progress
        completed++;
        setProgress(Math.round((completed / files.length) * 100));
      }
      
      return results;
    } catch (error) {
      console.error('Error in uploadImages:', error);
      toast.error('Failed to upload images');
      throw error;
    } finally {
      setIsUploading(false);
    }
  };
  
  /**
   * Upload property documents to Supabase storage
   */
  const uploadDocuments = async (propertyId: string, files: File[], documentTypes: Record<string, string>) => {
    setIsUploading(true);
    setProgress(0);
    
    try {
      const results = [];
      let completed = 0;
      
      // Create storage bucket if it doesn't exist
      const { data: buckets } = await supabase.storage.listBuckets();
      if (!buckets?.find(b => b.name === 'property-documents')) {
        await supabase.storage.createBucket('property-documents', {
          public: false, // Documents are private
          fileSizeLimit: 52428800, // 50MB
          allowedMimeTypes: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
        });
      }
      
      for (const file of files) {
        // Generate a unique filename
        const fileExt = file.name.split('.').pop();
        const fileName = `${propertyId}/${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `${fileName}`;
        
        // Upload the file
        const { data, error } = await supabase.storage
          .from('property-documents')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          });
          
        if (error) {
          console.error('Error uploading document:', error);
          throw error;
        }
        
        // Insert into property_documents table
        const { data: docData, error: docError } = await supabase
          .from('property_documents')
          .insert({
            property_id: propertyId,
            storage_path: filePath,
            name: file.name,
            document_type: documentTypes[file.name] || 'Other'
          })
          .select('id')
          .single();
          
        if (docError) {
          console.error('Error saving document metadata:', docError);
          throw docError;
        }
        
        results.push({
          id: docData.id,
          name: file.name,
          path: filePath,
          type: documentTypes[file.name] || 'Other'
        });
        
        // Update progress
        completed++;
        setProgress(Math.round((completed / files.length) * 100));
      }
      
      return results;
    } catch (error) {
      console.error('Error in uploadDocuments:', error);
      toast.error('Failed to upload documents');
      throw error;
    } finally {
      setIsUploading(false);
    }
  };
  
  return {
    uploadImages,
    uploadDocuments,
    isUploading,
    progress
  };
}

/**
 * Hook for managing property CRUD operations
 */
export function usePropertyManagement() {
  const queryClient = useQueryClient();
  const { uploadImages, uploadDocuments } = usePropertyStorage();
  
  /**
   * Create a new property with full data
   */
  const createProperty = useMutation({
    mutationFn: async (data: PropertyFormData) => {
      console.log('Creating property with data:', data);
      
      try {
        // Step 1: Insert the property data
        const { data: propertyData, error: propertyError } = await supabase
          .from('enhanced_properties')
          .insert({
            title: data.title,
            description: data.description,
            property_type_id: data.propertyType,
            transaction_type_id: data.transactionType,
            price: data.price,
            rental_rate: data.rentalRate,
            status_id: data.status,
            featured: data.featured,
            // Address fields
            street: data.address.street,
            city: data.address.city,
            state: data.address.state,
            zip: data.address.zip,
            country: data.address.country,
            // Property details based on type
            bedrooms: data.bedrooms,
            bathrooms: data.bathrooms,
            built_up_area: data.builtUpArea,
            floor_area: data.floorArea,
            land_size: data.landSize,
            furnishing_status: data.furnishingStatus,
            // Commercial/industrial specific
            building_class: data.buildingClass,
            ceiling_height: data.ceilingHeight,
            loading_bays: data.loadingBays,
            power_capacity: data.powerCapacity,
            // Land specific
            zoning: data.zoning,
            zoning_type: data.zoningType,
            topography: data.topography,
            road_frontage: data.roadFrontage,
            // Agent notes
            agent_notes: data.agentNotes,
            // Current user as agent
            agent_id: (await supabase.auth.getUser()).data.user?.id
          })
          .select('id')
          .single();
          
        if (propertyError) {
          console.error('Error creating property:', propertyError);
          throw propertyError;
        }
        
        const propertyId = propertyData.id;
        
        // Step 2: Upload images if any
        if (data.images && data.images.length > 0) {
          const imagesToUpload = data.images
            .filter(img => img.file)
            .map(img => img.file as File);
            
          if (imagesToUpload.length > 0) {
            await uploadImages(propertyId, imagesToUpload);
          }
        }
        
        // Step 3: Upload documents if any
        if (data.documents && data.documents.length > 0) {
          const docsToUpload = data.documents
            .filter(doc => doc.file)
            .map(doc => doc.file as File);
            
          const documentTypes = Object.fromEntries(
            data.documents
              .filter(doc => doc.file)
              .map(doc => [doc.file?.name || '', doc.documentType])
          );
          
          if (docsToUpload.length > 0) {
            await uploadDocuments(propertyId, docsToUpload, documentTypes);
          }
        }
        
        return {
          success: true,
          propertyId,
          message: 'Property created successfully'
        };
      } catch (error) {
        console.error('Error in createProperty:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      toast.success('Property created successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to create property: ${error.message}`);
    }
  });
  
  /**
   * Update an existing property
   */
  const updateProperty = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<PropertyFormData> }) => {
      console.log('Updating property with ID:', id, data);
      
      try {
        // Extract property data for update
        const propertyData: any = {};
        
        // Basic info
        if (data.title !== undefined) propertyData.title = data.title;
        if (data.description !== undefined) propertyData.description = data.description;
        if (data.propertyType !== undefined) propertyData.property_type_id = data.propertyType;
        if (data.transactionType !== undefined) propertyData.transaction_type_id = data.transactionType;
        if (data.price !== undefined) propertyData.price = data.price;
        if (data.rentalRate !== undefined) propertyData.rental_rate = data.rentalRate;
        if (data.status !== undefined) propertyData.status_id = data.status;
        if (data.featured !== undefined) propertyData.featured = data.featured;
        
        // Address
        if (data.address) {
          const { address } = data;
          if (address.street !== undefined) propertyData.street = address.street;
          if (address.city !== undefined) propertyData.city = address.city;
          if (address.state !== undefined) propertyData.state = address.state;
          if (address.zip !== undefined) propertyData.zip = address.zip;
          if (address.country !== undefined) propertyData.country = address.country;
        }
        
        // Property specific fields
        if (data.bedrooms !== undefined) propertyData.bedrooms = data.bedrooms;
        if (data.bathrooms !== undefined) propertyData.bathrooms = data.bathrooms;
        if (data.builtUpArea !== undefined) propertyData.built_up_area = data.builtUpArea;
        if (data.floorArea !== undefined) propertyData.floor_area = data.floorArea;
        if (data.landSize !== undefined) propertyData.land_size = data.landSize;
        if (data.furnishingStatus !== undefined) propertyData.furnishing_status = data.furnishingStatus;
        if (data.buildingClass !== undefined) propertyData.building_class = data.buildingClass;
        if (data.ceilingHeight !== undefined) propertyData.ceiling_height = data.ceilingHeight;
        if (data.loadingBays !== undefined) propertyData.loading_bays = data.loadingBays;
        if (data.powerCapacity !== undefined) propertyData.power_capacity = data.powerCapacity;
        if (data.zoning !== undefined) propertyData.zoning = data.zoning;
        if (data.zoningType !== undefined) propertyData.zoning_type = data.zoningType;
        if (data.topography !== undefined) propertyData.topography = data.topography;
        if (data.roadFrontage !== undefined) propertyData.road_frontage = data.roadFrontage;
        
        // Notes
        if (data.agentNotes !== undefined) propertyData.agent_notes = data.agentNotes;
        
        // Always update the timestamp
        propertyData.updated_at = new Date().toISOString();
        
        // Update the property data
        const { error: updateError } = await supabase
          .from('enhanced_properties')
          .update(propertyData)
          .eq('id', id);
          
        if (updateError) {
          console.error('Error updating property:', updateError);
          throw updateError;
        }
        
        // Handle images/documents updates
        // New images to upload
        const imagesToUpload = data.images
          ?.filter(img => img.file && !img.id)
          .map(img => img.file as File) || [];
          
        if (imagesToUpload.length > 0) {
          await uploadImages(id, imagesToUpload);
        }
        
        // New documents to upload
        const documentsToUpload = data.documents
          ?.filter(doc => doc.file && !doc.id)
          .map(doc => doc.file as File) || [];
          
        if (documentsToUpload.length > 0) {
          const documentTypes = Object.fromEntries(
            data.documents
              ?.filter(doc => doc.file && !doc.id)
              .map(doc => [doc.file?.name || '', doc.documentType]) || []
          );
          
          await uploadDocuments(id, documentsToUpload, documentTypes);
        }
        
        // Images to delete
        const imagesToDelete = data.imagesToDelete || [];
        for (const imageId of imagesToDelete) {
          // First get the image to find its storage path
          const { data: imageData } = await supabase
            .from('property_images')
            .select('storage_path')
            .eq('id', imageId)
            .single();
            
          if (imageData?.storage_path) {
            // Delete the file from storage
            await supabase.storage
              .from('property-images')
              .remove([imageData.storage_path]);
          }
          
          // Delete the record
          await supabase
            .from('property_images')
            .delete()
            .eq('id', imageId);
        }
        
        // Documents to delete
        const documentsToDelete = data.documentsToDelete || [];
        for (const docId of documentsToDelete) {
          // First get the document to find its storage path
          const { data: docData } = await supabase
            .from('property_documents')
            .select('storage_path')
            .eq('id', docId)
            .single();
            
          if (docData?.storage_path) {
            // Delete the file from storage
            await supabase.storage
              .from('property-documents')
              .remove([docData.storage_path]);
          }
          
          // Delete the record
          await supabase
            .from('property_documents')
            .delete()
            .eq('id', docId);
        }
        
        return {
          success: true,
          propertyId: id,
          message: 'Property updated successfully'
        };
      } catch (error) {
        console.error('Error in updateProperty:', error);
        throw error;
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      queryClient.invalidateQueries({ queryKey: ['property', variables.id] });
      toast.success('Property updated successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to update property: ${error.message}`);
    }
  });
  
  /**
   * Delete a property and all associated data
   */
  const deleteProperty = useMutation({
    mutationFn: async (id: string) => {
      console.log('Deleting property with ID:', id);
      
      try {
        // Step 1: Get all images and documents to delete from storage
        const { data: images } = await supabase
          .from('property_images')
          .select('storage_path')
          .eq('property_id', id);
          
        const { data: documents } = await supabase
          .from('property_documents')
          .select('storage_path')
          .eq('property_id', id);
          
        // Step 2: Delete images from storage
        if (images && images.length > 0) {
          const imagePaths = images.map(img => img.storage_path);
          await supabase.storage
            .from('property-images')
            .remove(imagePaths);
        }
        
        // Step 3: Delete documents from storage
        if (documents && documents.length > 0) {
          const documentPaths = documents.map(doc => doc.storage_path);
          await supabase.storage
            .from('property-documents')
            .remove(documentPaths);
        }
        
        // Step 4: Delete the property (this will also delete associated records due to foreign key constraints)
        const { error } = await supabase
          .from('enhanced_properties')
          .delete()
          .eq('id', id);
          
        if (error) {
          console.error('Error deleting property:', error);
          throw error;
        }
        
        return {
          success: true,
          message: 'Property deleted successfully'
        };
      } catch (error) {
        console.error('Error in deleteProperty:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      toast.success('Property deleted successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to delete property: ${error.message}`);
    }
  });
  
  return {
    createProperty,
    updateProperty,
    deleteProperty
  };
}
