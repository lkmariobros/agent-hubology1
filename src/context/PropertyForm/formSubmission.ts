
import { PropertyFormState } from "@/types/property-form";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

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
        property_type_id: getPropertyTypeId(formData.propertyType),
        transaction_type_id: getTransactionTypeId(formData.transactionType),
        status_id: getStatusId(formData.status),
        featured: formData.featured,
        
        // Address fields
        street: formData.address.street,
        city: formData.address.city,
        state: formData.address.state,
        zip: formData.address.zip,
        country: formData.address.country,
        
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
      for (const image of images) {
        if (image.file) {
          const fileExt = image.file.name.split('.').pop();
          const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
          const filePath = `${propertyId}/${fileName}`;
          
          // Upload to storage
          const { error: storageError } = await supabase.storage
            .from('property-images')
            .upload(filePath, image.file);
          
          if (storageError) {
            console.error("Error uploading image:", storageError);
            continue;
          }
          
          // Get public URL
          const { data } = supabase.storage
            .from('property-images')
            .getPublicUrl(filePath);
          
          // Create image record
          await supabase.from('property_images')
            .insert({
              property_id: propertyId,
              storage_path: data.publicUrl,
              is_cover: image.isCover,
              display_order: image.displayOrder
            });
        }
      }
    }
    
    // Step 3: Save property features
    if (formData.propertyFeatures && formData.propertyFeatures.length > 0) {
      const featuresData = formData.propertyFeatures.map(feature => ({
        property_id: propertyId,
        feature_name: feature,
        feature_category: 'General'
      }));
      
      await supabase.from('property_features').insert(featuresData);
    }
    
    // Step 4: Save owner information if provided
    if (formData.owner && formData.owner.name) {
      await supabase.from('property_owners').insert({
        property_id: propertyId,
        name: formData.owner.name,
        email: formData.owner.email,
        phone: formData.owner.phone,
        address: formData.owner.address,
        company: formData.owner.company,
        notes: formData.owner.notes,
        is_primary_contact: formData.owner.isPrimaryContact
      });
    }
    
    // Step 5: Handle documents if needed
    if (documents && documents.length > 0) {
      // Similar logic to images
      console.log("Documents handling not implemented yet");
    }
    
    return propertyId;
  } catch (error) {
    console.error("Error in property submission:", error);
    throw error;
  }
};

// Helper functions for IDs - these would be fetched from the database in a real app
function getPropertyTypeId(type: string): string {
  const typeMap: Record<string, string> = {
    'Residential': 'f096705d-b0a5-402e-9f77-01c1d4f1a881',
    'Commercial': 'c8c5628c-72d8-4d57-9cf1-76723077ddba',
    'Industrial': 'ae6e8185-43a9-4bed-b097-9b2e833ce73a',
    'Land': 'd2133d2c-2a42-4ebc-b2ce-fa3c8686eed5'
  };
  return typeMap[type] || typeMap['Residential'];
}

function getTransactionTypeId(type: string): string {
  const typeMap: Record<string, string> = {
    'Sale': '1ed14504-2a59-4f05-927c-7c637cb54326',
    'Rent': 'f2a1be38-9ac0-4a27-b64b-085b5d418a3a',
    'Primary': '84c8e9f9-6f0c-478f-97e0-0e0c5dc5ffcc'
  };
  return typeMap[type] || typeMap['Sale'];
}

function getStatusId(status: string): string {
  const statusMap: Record<string, string> = {
    'Available': 'aa6b8f96-7f58-4e8d-a390-44c775ecb04c',
    'Under Contract': 'bb7d8f96-7f58-4e8d-a390-44c775ecb04c',
    'Sold': 'cc7d8f96-7f58-4e8d-a390-44c775ecb04c',
    'Off Market': 'dd7d8f96-7f58-4e8d-a390-44c775ecb04c',
    'Coming Soon': 'ee7d8f96-7f58-4e8d-a390-44c775ecb04c'
  };
  return statusMap[status] || statusMap['Available'];
}
