import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { PropertyFormData } from '@/types/property-form';
import clerkPropertyFormHelpers from '@/utils/clerkPropertyFormHelpers';
import { useAuth } from '@clerk/clerk-react';
import { getSupabaseWithClerkToken, handleSupabaseError } from '@/utils/supabaseHelpers';

/**
 * Hook for managing property storage operations with Clerk authentication
 */
export function useClerkPropertyStorage() {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { getToken, userId } = useAuth();
  
  /**
   * Upload property images to Supabase storage with Clerk auth
   */
  const uploadImages = async (propertyId: string, files: File[]) => {
    setIsUploading(true);
    setProgress(0);
    
    try {
      // Get Supabase client with Clerk token
      const client = await getSupabaseWithClerkToken(getToken);
      
      const results = [];
      let completed = 0;
      
      // Create storage bucket if it doesn't exist
      const { data: buckets } = await client.storage.listBuckets();
      if (!buckets?.find(b => b.name === 'property-images')) {
        await client.storage.createBucket('property-images', {
          public: true,
          fileSizeLimit: 10485760, // 10MB
          allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp']
        });
      }
      
      for (const file of files) {
        // Generate a unique filename with clerk_id in the path
        const fileExt = file.name.split('.').pop();
        // Include clerk_id in the path for RLS policies
        const fileName = `${userId}/${propertyId}/${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `${fileName}`;
        
        // Upload the file
        const { data, error } = await client.storage
          .from('property-images')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          });
          
        if (error) {
          throw error;
        }
        
        // Get the public URL
        const { data: { publicUrl } } = client.storage
          .from('property-images')
          .getPublicUrl(filePath);
          
        // Insert into property_images table
        const { data: imageData, error: imageError } = await client
          .from('property_images')
          .insert({
            property_id: propertyId,
            storage_path: filePath,
            is_cover: results.length === 0, // First image is cover
            display_order: results.length,
            clerk_id: userId // Add clerk_id for RLS
          })
          .select('id')
          .single();
          
        if (imageError) {
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
      return handleSupabaseError(error, 'uploadImages');
    } finally {
      setIsUploading(false);
    }
  };
  
  /**
   * Upload property documents to Supabase storage with Clerk auth
   */
  const uploadDocuments = async (propertyId: string, files: File[], documentTypes: Record<string, string>) => {
    setIsUploading(true);
    setProgress(0);
    
    try {
      // Get Supabase client with Clerk token
      const client = await getSupabaseWithClerkToken(getToken);
      
      const results = [];
      let completed = 0;
      
      // Create storage bucket if it doesn't exist
      const { data: buckets } = await client.storage.listBuckets();
      if (!buckets?.find(b => b.name === 'property-documents')) {
        await client.storage.createBucket('property-documents', {
          public: false, // Documents are private
          fileSizeLimit: 52428800, // 50MB
          allowedMimeTypes: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
        });
      }
      
      for (const file of files) {
        // Generate a unique filename with clerk_id in the path
        const fileExt = file.name.split('.').pop();
        // Include clerk_id in the path for RLS policies
        const fileName = `${userId}/${propertyId}/${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `${fileName}`;
        
        // Upload the file
        const { data, error } = await client.storage
          .from('property-documents')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          });
          
        if (error) {
          throw error;
        }
        
        // Insert into property_documents table
        const { data: docData, error: docError } = await client
          .from('property_documents')
          .insert({
            property_id: propertyId,
            storage_path: filePath,
            name: file.name,
            document_type: documentTypes[file.name] || 'Other',
            clerk_id: userId // Add clerk_id for RLS
          })
          .select('id')
          .single();
          
        if (docError) {
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
      return handleSupabaseError(error, 'uploadDocuments');
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
 * Hook for managing property CRUD operations with Clerk authentication
 */
export function useClerkPropertyManagement() {
  const queryClient = useQueryClient();
  const { uploadImages, uploadDocuments } = useClerkPropertyStorage();
  const { getToken, userId } = useAuth();
  
  /**
   * Create a new property with full data
   */
  const createProperty = useMutation({
    mutationFn: async (data: PropertyFormData) => {
      try {
        // Get Supabase client with Clerk token
        const client = await getSupabaseWithClerkToken(getToken);
        
        // Step 1: Get IDs for the reference data before inserting
        const propertyTypeId = await clerkPropertyFormHelpers.getOrCreatePropertyType(data.propertyType, getToken);
        const transactionTypeId = await clerkPropertyFormHelpers.getOrCreateTransactionType(data.transactionType, getToken);
        const statusId = await clerkPropertyFormHelpers.getOrCreatePropertyStatus(data.status, getToken);
        
        // Step 2: Insert the property data with the correct IDs
        const { data: propertyData, error: propertyError } = await client
          .from('enhanced_properties')
          .insert({
            title: data.title,
            description: data.description,
            property_type_id: propertyTypeId,
            transaction_type_id: transactionTypeId,
            price: data.price,
            rental_rate: data.rentalRate,
            status_id: statusId,
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
            // Use Clerk userId
            agent_id: userId,
            clerk_id: userId
          })
          .select('id')
          .single();
          
        if (propertyError) {
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
        return handleSupabaseError(error, 'createProperty');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clerk-properties'] });
      toast.success('Property created successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to create property: ${error.message}`);
    }
  });
  
  /**
   * Fetch properties with Clerk authentication
   */
  const fetchProperties = async () => {
    try {
      // Get Supabase client with Clerk token
      const client = await getSupabaseWithClerkToken(getToken);
      
      const { data, error } = await client
        .from('enhanced_properties')
        .select('id, title, city, state, status_id, price, clerk_id')
        .order('created_at', { ascending: false });
        
      if (error) {
        throw error;
      }
      
      return data;
    } catch (error) {
      return handleSupabaseError(error, 'fetchProperties');
    }
  };

  /**
   * Hook to get properties with Clerk authentication
   */
  const useClerkProperties = () => {
    return useQuery({
      queryKey: ['clerk-properties'],
      queryFn: fetchProperties
    });
  };
  
  return {
    createProperty,
    useClerkProperties
  };
}