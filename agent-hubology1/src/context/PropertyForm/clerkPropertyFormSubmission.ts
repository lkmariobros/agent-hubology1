import { PropertyFormState, PropertyImage, PropertyDocument } from '@/types/property-form';
import { getSupabaseWithClerkToken } from '@/utils/supabaseHelpers';
import clerkPropertyFormHelpers from '@/utils/clerkPropertyFormHelpers';

/**
 * Creates a property with all associated data using Clerk JWT
 */
export const createProperty = async (
  state: PropertyFormState,
  getToken: () => Promise<string | null>,
  userId: string | null
) => {
  if (!userId) {
    throw new Error('User not authenticated');
  }
  
  try {
    console.log('[ClerkPropertyForm] Creating property with data:', state);
    
    // Get Supabase client with Clerk token
    const client = await getSupabaseWithClerkToken(getToken);
    
    // Step 1: Get IDs for the reference data
    const propertyTypeId = await clerkPropertyFormHelpers.getOrCreatePropertyType(state.property.propertyType, getToken);
    const transactionTypeId = await clerkPropertyFormHelpers.getOrCreateTransactionType(state.property.transactionType, getToken);
    const statusId = await clerkPropertyFormHelpers.getOrCreatePropertyStatus(state.property.status, getToken);
    
    // Step 2: Insert the main property record
    const { data: propertyData, error: propertyError } = await client
      .from('enhanced_properties')
      .insert({
        title: state.property.title,
        description: state.property.description,
        property_type_id: propertyTypeId,
        transaction_type_id: transactionTypeId,
        price: state.property.price,
        rental_rate: state.property.rentalRate,
        status_id: statusId,
        featured: state.property.featured,
        // Address fields
        street: state.property.address.street,
        city: state.property.address.city,
        state: state.property.address.state,
        zip: state.property.address.zip,
        country: state.property.address.country,
        // Property details
        bedrooms: state.property.bedrooms,
        bathrooms: state.property.bathrooms,
        built_up_area: state.property.builtUpArea,
        floor_area: state.property.floorArea,
        land_size: state.property.landSize,
        furnishing_status: state.property.furnishingStatus,
        building_class: state.property.buildingClass,
        ceiling_height: state.property.ceilingHeight,
        loading_bays: state.property.loadingBays,
        power_capacity: state.property.powerCapacity,
        zoning: state.property.zoning,
        zoning_type: state.property.zoningType,
        topography: state.property.topography,
        road_frontage: state.property.roadFrontage,
        // Agent info
        agent_notes: state.property.agentNotes,
        agent_id: userId,
        clerk_id: userId
      })
      .select('id')
      .single();
      
    if (propertyError) {
      console.error('[ClerkPropertyForm] Error creating property:', propertyError);
      throw propertyError;
    }
    
    const propertyId = propertyData.id;
    console.log(`[ClerkPropertyForm] Property created with ID: ${propertyId}`);
    
    // Step 3: Upload and associate images
    const imagePromises = state.images.map(async (image: PropertyImage, index: number) => {
      if (image.file) {
        try {
          // Ensure property-images bucket exists
          const { data: buckets } = await client.storage.listBuckets();
          if (!buckets?.find(b => b.name === 'property-images')) {
            console.log('[ClerkPropertyForm] Creating property-images bucket');
            await client.storage.createBucket('property-images', {
              public: true,
              fileSizeLimit: 10485760 // 10MB
            });
          }
          
          // Upload the image file
          const fileExt = image.file.name.split('.').pop();
          // Include clerk_id in path for RLS policies
          const filePath = `${userId}/${propertyId}/${Date.now()}-${index}.${fileExt}`;
          
          console.log(`[ClerkPropertyForm] Uploading image to ${filePath}`);
          const { error: uploadError } = await client.storage
            .from('property-images')
            .upload(filePath, image.file, {
              cacheControl: '3600',
              upsert: false
            });
            
          if (uploadError) {
            console.error('[ClerkPropertyForm] Error uploading image:', uploadError);
            return null;
          }
          
          // Get the public URL
          const { data: urlData } = client.storage
            .from('property-images')
            .getPublicUrl(filePath);
            
          // Insert record into property_images table
          const { error: imageInsertError } = await client
            .from('property_images')
            .insert({
              property_id: propertyId,
              storage_path: filePath,
              is_cover: index === 0, // First image is cover
              display_order: index,
              clerk_id: userId // Add clerk_id for RLS
            });
            
          if (imageInsertError) {
            console.error('[ClerkPropertyForm] Error saving image metadata:', imageInsertError);
            return null;
          }
          
          return urlData.publicUrl;
        } catch (error) {
          console.error('[ClerkPropertyForm] Error processing image:', error);
          return null;
        }
      }
      return null;
    });
    
    // Step 4: Upload and associate documents
    const documentPromises = state.documents.map(async (doc: PropertyDocument, index: number) => {
      if (doc.file) {
        try {
          // Ensure property-documents bucket exists
          const { data: buckets } = await client.storage.listBuckets();
          if (!buckets?.find(b => b.name === 'property-documents')) {
            console.log('[ClerkPropertyForm] Creating property-documents bucket');
            await client.storage.createBucket('property-documents', {
              public: false, // Documents are private
              fileSizeLimit: 52428800 // 50MB
            });
          }
          
          // Upload the document file
          const fileExt = doc.file.name.split('.').pop();
          // Include clerk_id in path for RLS policies
          const filePath = `${userId}/${propertyId}/${Date.now()}-${index}.${fileExt}`;
          
          console.log(`[ClerkPropertyForm] Uploading document to ${filePath}`);
          const { error: uploadError } = await client.storage
            .from('property-documents')
            .upload(filePath, doc.file, {
              cacheControl: '3600',
              upsert: false
            });
            
          if (uploadError) {
            console.error('[ClerkPropertyForm] Error uploading document:', uploadError);
            return null;
          }
          
          // Insert record into property_documents table
          const { error: docInsertError } = await client
            .from('property_documents')
            .insert({
              property_id: propertyId,
              name: doc.file.name,
              document_type: doc.documentType,
              storage_path: filePath,
              clerk_id: userId // Add clerk_id for RLS
            });
            
          if (docInsertError) {
            console.error('[ClerkPropertyForm] Error saving document metadata:', docInsertError);
            return null;
          }
          
          return filePath;
        } catch (error) {
          console.error('[ClerkPropertyForm] Error processing document:', error);
          return null;
        }
      }
      return null;
    });
    
    // Wait for all uploads to complete
    await Promise.all([...imagePromises, ...documentPromises]);
    
    console.log('[ClerkPropertyForm] Property creation complete with all associated data');
    return { propertyId, success: true };
  } catch (error) {
    console.error('[ClerkPropertyForm] Property creation failed:', error);
    throw error;
  }
};