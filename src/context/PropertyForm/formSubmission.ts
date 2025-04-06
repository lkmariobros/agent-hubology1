
import { PropertyFormState } from "@/types/property-form";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { getOrCreatePropertyType, getOrCreateTransactionType, getOrCreatePropertyStatus } from "@/utils/propertyFormHelpers";

// Mock function for now
export const saveFormAsDraft = async (state: PropertyFormState) => {
  console.log("Saving form draft:", state);
  // In a real app, this would save to Supabase or local storage
  return Promise.resolve();
};

// This function will be called from the PropertyFormWrapper or other places
export const submitPropertyForm = async (state?: PropertyFormState) => {
  // If no state is passed, we'll assume it's being called from a component
  // that has access to the context already
  if (!state) {
    console.log("No state passed to submitPropertyForm, using context state");
    // The actual implementation would get the state from context
    return Promise.resolve();
  }
  
  const { formData, images, documents } = state;
  console.log("Submitting form:", { formData, images, documents });
  
  try {
    // Step 1: Create the property record
    const { data: propertyData, error: propertyError } = await supabase
      .from("enhanced_properties")
      .insert({
        title: formData.title,
        description: formData.description,
        property_type_id: await getPropertyTypeId(formData.propertyType),
        transaction_type_id: await getTransactionTypeId(formData.transactionType),
        status_id: await getStatusId(formData.status),
        featured: formData.featured,
        
        // Address fields
        street: formData.address?.street,
        city: formData.address?.city,
        state: formData.address?.state,
        zip: formData.address?.zip,
        country: formData.address?.country,
        
        // Financial fields
        price: formData.price || 0,
        rental_rate: formData.rentalRate || 0,
        
        // Property type specific fields
        bedrooms: formData.bedrooms,
        bathrooms: formData.bathrooms,
        built_up_area: formData.builtUpArea,
        furnishing_status: formData.furnishingStatus,
        floor_area: formData.floorArea,
        zoning_type: formData.zoningType,
        building_class: formData.buildingClass,
        land_area: formData.landArea,
        ceiling_height: formData.ceilingHeight,
        loading_bays: formData.loadingBays,
        power_capacity: formData.powerCapacity,
        land_size: formData.landSize,
        zoning: formData.zoning,
        road_frontage: formData.roadFrontage,
        topography: formData.topography,
        
        // Agent notes
        agent_notes: formData.agentNotes,
        
        // For primary market properties
        total_stock: formData.stock?.total,
        available_stock: formData.stock?.available,
        reserved_stock: formData.stock?.reserved,
        sold_stock: formData.stock?.sold,
      })
      .select("id")
      .single();
    
    if (propertyError) throw propertyError;
    
    const propertyId = propertyData.id;
    console.log("Property created with ID:", propertyId);
    
    // Step 2: Upload images to storage and create image records
    if (images && images.length > 0) {
      console.log(`Processing ${images.length} images for property ${propertyId}`);
      
      for (let i = 0; i < images.length; i++) {
        const image = images[i];
        console.log(`Processing image ${i+1}/${images.length}:`, image);
        
        try {
          let imageUrl = '';
          
          // If we have an actual file to upload
          if (image.file) {
            const fileExt = image.file.name.split('.').pop();
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
            const filePath = `${propertyId}/${fileName}`;
            
            console.log(`Uploading image to storage path: ${filePath}`);
            
            // Upload to storage
            const { data: uploadData, error: storageError } = await supabase.storage
              .from('property-images')
              .upload(filePath, image.file);
            
            if (storageError) {
              console.error("Error uploading image:", storageError);
              toast.error(`Failed to upload image ${i+1}. ${storageError.message}`);
              continue;
            }
            
            // Get public URL
            const { data: urlData } = supabase.storage
              .from('property-images')
              .getPublicUrl(filePath);
              
            imageUrl = urlData.publicUrl;
            console.log(`Image uploaded, public URL: ${imageUrl}`);
          } else if (image.url) {
            // If we already have a URL (e.g., from a previously uploaded image)
            imageUrl = image.url;
            console.log(`Using existing image URL: ${imageUrl}`);
          } else {
            console.warn(`Image ${i+1} has no file or URL`);
            continue;
          }
          
          // Create image record
          console.log(`Creating database record for image ${i+1}`);
          const { error: imageError } = await supabase.from('property_images')
            .insert({
              property_id: propertyId,
              storage_path: imageUrl,
              is_cover: image.isCover,
              display_order: image.displayOrder || i
            });
          
          if (imageError) {
            console.error("Error creating image record:", imageError);
            toast.error(`Failed to save image ${i+1} metadata. ${imageError.message}`);
          } else {
            console.log(`Successfully saved image ${i+1} record`);
          }
        } catch (imgError) {
          console.error(`Error processing image ${i+1}:`, imgError);
          toast.error(`An error occurred while processing image ${i+1}`);
        }
      }
    } else {
      console.log("No images to upload");
    }
    
    // Step 3: Save property features
    if (formData.propertyFeatures && formData.propertyFeatures.length > 0) {
      console.log(`Saving ${formData.propertyFeatures.length} property features`);
      
      const featuresData = formData.propertyFeatures.map(feature => ({
        property_id: propertyId,
        feature_name: feature,
        feature_category: 'General'
      }));
      
      const { error: featuresError } = await supabase.from('property_features').insert(featuresData);
      
      if (featuresError) {
        console.error("Error saving property features:", featuresError);
        toast.error(`Failed to save property features. ${featuresError.message}`);
      } else {
        console.log("Property features saved successfully");
      }
    }
    
    // Step 4: Save owner information if provided
    if (formData.owner && formData.owner.name) {
      console.log("Saving property owner information");
      
      const { error: ownerError } = await supabase.from('property_owners').insert({
        property_id: propertyId,
        name: formData.owner.name,
        email: formData.owner.email,
        phone: formData.owner.phone,
        address: formData.owner.address,
        company: formData.owner.company,
        notes: formData.owner.notes,
        is_primary_contact: formData.owner.isPrimaryContact !== false
      });
      
      if (ownerError) {
        console.error("Error saving property owner:", ownerError);
        toast.error(`Failed to save property owner information. ${ownerError.message}`);
      } else {
        console.log("Property owner saved successfully");
      }
    }
    
    // Step 5: Handle documents if needed
    if (documents && documents.length > 0) {
      console.log(`Processing ${documents.length} documents for property ${propertyId}`);
      
      for (let i = 0; i < documents.length; i++) {
        const doc = documents[i];
        
        try {
          if (doc.file) {
            const fileExt = doc.file.name.split('.').pop();
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
            const filePath = `${propertyId}/${fileName}`;
            
            // Upload document to storage
            const { error: docStorageError } = await supabase.storage
              .from('property-documents')
              .upload(filePath, doc.file);
            
            if (docStorageError) {
              console.error(`Error uploading document ${i+1}:`, docStorageError);
              continue;
            }
            
            // Get public URL
            const { data: docUrlData } = supabase.storage
              .from('property-documents')
              .getPublicUrl(filePath);
            
            // Create document record
            await supabase.from('property_documents').insert({
              property_id: propertyId,
              storage_path: docUrlData.publicUrl,
              name: doc.name,
              document_type: doc.documentType
            });
          }
        } catch (docError) {
          console.error(`Error processing document ${i+1}:`, docError);
        }
      }
    }
    
    return propertyId;
  } catch (error) {
    console.error("Error in property submission:", error);
    throw error;
  }
};

// Helper functions for IDs
async function getPropertyTypeId(type: string): Promise<string> {
  try {
    return await getOrCreatePropertyType(type);
  } catch (error) {
    console.error("Error getting property type ID:", error);
    return getDefaultPropertyTypeId(type);
  }
}

async function getTransactionTypeId(type: string): Promise<string> {
  try {
    return await getOrCreateTransactionType(type);
  } catch (error) {
    console.error("Error getting transaction type ID:", error);
    return getDefaultTransactionTypeId(type);
  }
}

async function getStatusId(status: string): Promise<string> {
  try {
    return await getOrCreatePropertyStatus(status);
  } catch (error) {
    console.error("Error getting status ID:", error);
    return getDefaultStatusId(status);
  }
}

// Fallback functions with default IDs
function getDefaultPropertyTypeId(type: string): string {
  const typeMap: Record<string, string> = {
    'Residential': 'f096705d-b0a5-402e-9f77-01c1d4f1a881',
    'Commercial': 'c8c5628c-72d8-4d57-9cf1-76723077ddba',
    'Industrial': 'ae6e8185-43a9-4bed-b097-9b2e833ce73a',
    'Land': 'd2133d2c-2a42-4ebc-b2ce-fa3c8686eed5'
  };
  return typeMap[type] || typeMap['Residential'];
}

function getDefaultTransactionTypeId(type: string): string {
  const typeMap: Record<string, string> = {
    'Sale': '1ed14504-2a59-4f05-927c-7c637cb54326',
    'Rent': 'f2a1be38-9ac0-4a27-b64b-085b5d418a3a',
    'Primary': '84c8e9f9-6f0c-478f-97e0-0e0c5dc5ffcc'
  };
  return typeMap[type] || typeMap['Sale'];
}

function getDefaultStatusId(status: string): string {
  const statusMap: Record<string, string> = {
    'Available': 'aa6b8f96-7f58-4e8d-a390-44c775ecb04c',
    'Under Contract': 'bb7d8f96-7f58-4e8d-a390-44c775ecb04c',
    'Sold': 'cc7d8f96-7f58-4e8d-a390-44c775ecb04c',
    'Off Market': 'dd7d8f96-7f58-4e8d-a390-44c775ecb04c',
    'Coming Soon': 'ee7d8f96-7f58-4e8d-a390-44c775ecb04c'
  };
  return statusMap[status] || statusMap['Available'];
}
