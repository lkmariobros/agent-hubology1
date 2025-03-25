
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { PropertyFormData } from '@/types/property-form';

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
            title: data.basicInfo.title,
            description: data.basicInfo.description,
            property_type_id: data.basicInfo.propertyType,
            transaction_type_id: data.basicInfo.transactionType,
            price: data.basicInfo.price,
            rental_rate: data.basicInfo.rentalRate,
            status_id: data.basicInfo.status,
            featured: data.basicInfo.featured,
            // Address fields
            street: data.address.street,
            city: data.address.city,
            state: data.address.state,
            zip: data.address.zipCode,
            country: data.address.country,
            // Property details based on type
            bedrooms: data.details.bedrooms,
            bathrooms: data.details.bathrooms,
            built_up_area: data.details.builtUpArea,
            floor_area: data.details.floorArea,
            land_size: data.details.landSize,
            furnishing_status: data.details.furnishingStatus,
            // Commercial/industrial specific
            building_class: data.details.buildingClass,
            ceiling_height: data.details.ceilingHeight,
            loading_bays: data.details.loadingBays,
            power_capacity: data.details.powerCapacity,
            // Land specific
            zoning: data.details.zoning,
            zoning_type: data.details.zoningType,
            topography: data.details.topography,
            road_frontage: data.details.roadFrontage,
            // Agent notes
            agent_notes: data.notes.internalNotes,
            // Current user as agent
            agent_id: data.agentId || null
          })
          .select('id')
          .single();
          
        if (propertyError) {
          console.error('Error creating property:', propertyError);
          throw propertyError;
        }
        
        const propertyId = propertyData.id;
        
        // Step 2: Upload images if any
        if (data.media.images && data.media.images.length > 0) {
          const files = data.media.images.filter(img => img instanceof File) as File[];
          if (files.length > 0) {
            await uploadImages(propertyId, files);
          }
        }
        
        // Step 3: Upload documents if any
        if (data.media.documents && data.media.documents.length > 0) {
          const files = data.media.documents.filter(doc => doc instanceof File) as File[];
          const documentTypes = data.media.documentTypes || {};
          
          if (files.length > 0) {
            await uploadDocuments(propertyId, files, documentTypes);
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
        if (data.basicInfo) {
          const { basicInfo } = data;
          Object.assign(propertyData, {
            title: basicInfo.title,
            description: basicInfo.description,
            property_type_id: basicInfo.propertyType,
            transaction_type_id: basicInfo.transactionType,
            price: basicInfo.price,
            rental_rate: basicInfo.rentalRate,
            status_id: basicInfo.status,
            featured: basicInfo.featured
          });
        }
        
        // Address
        if (data.address) {
          const { address } = data;
          Object.assign(propertyData, {
            street: address.street,
            city: address.city,
            state: address.state,
            zip: address.zipCode,
            country: address.country
          });
        }
        
        // Details
        if (data.details) {
          const { details } = data;
          Object.assign(propertyData, {
            bedrooms: details.bedrooms,
            bathrooms: details.bathrooms,
            built_up_area: details.builtUpArea,
            floor_area: details.floorArea,
            land_size: details.landSize,
            furnishing_status: details.furnishingStatus,
            building_class: details.buildingClass,
            ceiling_height: details.ceilingHeight,
            loading_bays: details.loadingBays,
            power_capacity: details.powerCapacity,
            zoning: details.zoning,
            zoning_type: details.zoningType,
            topography: details.topography,
            road_frontage: details.roadFrontage
          });
        }
        
        // Notes
        if (data.notes) {
          Object.assign(propertyData, {
            agent_notes: data.notes.internalNotes
          });
        }
        
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
        
        // Handle media updates if needed
        if (data.media) {
          // Upload new images
          if (data.media.newImages && data.media.newImages.length > 0) {
            const files = data.media.newImages.filter(img => img instanceof File) as File[];
            if (files.length > 0) {
              await uploadImages(id, files);
            }
          }
          
          // Upload new documents
          if (data.media.newDocuments && data.media.newDocuments.length > 0) {
            const files = data.media.newDocuments.filter(doc => doc instanceof File) as File[];
            const documentTypes = data.media.documentTypes || {};
            
            if (files.length > 0) {
              await uploadDocuments(id, files, documentTypes);
            }
          }
          
          // Delete images if specified
          if (data.media.imagesToDelete && data.media.imagesToDelete.length > 0) {
            for (const imageId of data.media.imagesToDelete) {
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
          }
          
          // Delete documents if specified
          if (data.media.documentsToDelete && data.media.documentsToDelete.length > 0) {
            for (const docId of data.media.documentsToDelete) {
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
          }
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
