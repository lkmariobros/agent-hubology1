
import { supabase } from '@/lib/supabase';
import { PropertyFormState, PropertyFormData } from '@/types/property-form';
import { toast } from 'sonner';
import { propertyFormHelpers } from '@/utils/dbHelpers';
import { castParam } from '@/utils/supabaseHelpers';

// Save form as draft
export const saveFormAsDraft = async (state: PropertyFormState): Promise<void> => {
  try {
    // In a real implementation, this would save to local storage 
    // or to Supabase as a draft property
    console.log('Saving form data:', state.formData);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return Promise.resolve();
  } catch (error) {
    console.error('Error saving form:', error);
    return Promise.reject(error);
  }
};

// Submit form
export const submitPropertyForm = async (state: PropertyFormState): Promise<void> => {
  try {
    // 1. Make sure we have a user
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError || !userData.user) {
      toast.error('You must be logged in to submit a property');
      throw new Error('Authentication required');
    }
    
    const agentId = userData.user.id;
    
    // 2. Get reference data IDs using the helpers
    const propertyTypeId = await propertyFormHelpers.getOrCreatePropertyType(state.formData.propertyType);
    if (!propertyTypeId) throw new Error('Failed to process property type');
    
    const transactionTypeId = await propertyFormHelpers.getOrCreateTransactionType(state.formData.transactionType);
    if (!transactionTypeId) throw new Error('Failed to process transaction type');
    
    const statusId = await propertyFormHelpers.getOrCreatePropertyStatus(state.formData.status);
    if (!statusId) throw new Error('Failed to process status');
    
    // 3. Build property data object based on property type
    // Extract common fields
    const commonPropertyData = {
      title: state.formData.title,
      property_type_id: propertyTypeId,
      transaction_type_id: transactionTypeId,
      status_id: statusId,
      description: state.formData.description,
      price: state.formData.transactionType === 'Sale' ? state.formData.price : null,
      rental_rate: state.formData.transactionType === 'Rent' ? state.formData.rentalRate : null,
      featured: state.formData.featured,
      street: state.formData.address.street,
      city: state.formData.address.city,
      state: state.formData.address.state,
      zip: state.formData.address.zip,
      country: state.formData.address.country,
      agent_notes: state.formData.agentNotes,
      agent_id: agentId,
    };
    
    // Add type-specific fields
    let typeSpecificData = {};
    
    switch (state.formData.propertyType) {
      case 'Residential':
        typeSpecificData = {
          bedrooms: state.formData.bedrooms,
          bathrooms: state.formData.bathrooms,
          built_up_area: state.formData.builtUpArea,
          furnishing_status: state.formData.furnishingStatus,
        };
        break;
      case 'Commercial':
        typeSpecificData = {
          floor_area: state.formData.floorArea,
          zoning_type: state.formData.zoningType,
          building_class: state.formData.buildingClass,
        };
        break;
      case 'Industrial':
        typeSpecificData = {
          land_area: state.formData.landArea,
          ceiling_height: state.formData.ceilingHeight,
          loading_bays: state.formData.loadingBays,
          power_capacity: state.formData.powerCapacity,
        };
        break;
      case 'Land':
        typeSpecificData = {
          land_size: state.formData.landSize,
          zoning: state.formData.zoning,
          road_frontage: state.formData.roadFrontage,
          topography: state.formData.topography,
        };
        break;
    }
    
    // Combine common and type-specific data
    const propertyData = {
      ...commonPropertyData,
      ...typeSpecificData,
    };
    
    // 4. Insert property into database
    const propertyId = await propertyFormHelpers.createProperty(propertyData);
    if (!propertyId) throw new Error('Failed to create property');
    
    // 5. Upload and save images
    if (state.images.length > 0) {
      // Upload each image file
      const imagesToInsert = [];
      
      for (const [index, image] of state.images.entries()) {
        if (image.file) {
          try {
            // Generate file path
            const fileExt = image.file.name.split('.').pop();
            const fileName = `${propertyId}/${Date.now()}-${index}.${fileExt}`;
            
            // Upload the file
            const { data, error } = await supabase.storage
              .from('property-images')
              .upload(fileName, image.file, {
                cacheControl: '3600',
                upsert: false
              });
              
            if (error) throw error;
            
            // Get the public URL
            const { data: publicUrlData } = supabase.storage
              .from('property-images')
              .getPublicUrl(fileName);
              
            // Add to images to insert
            imagesToInsert.push({
              property_id: propertyId,
              storage_path: fileName,
              display_order: index,
              is_cover: image.isCover
            });
          } catch (uploadError) {
            console.error('Error uploading image:', uploadError);
            // Continue with other images
          }
        }
      }
      
      // Insert all image records
      if (imagesToInsert.length > 0) {
        const { error: imagesError } = await supabase
          .from('property_images')
          .insert(imagesToInsert as any);
          
        if (imagesError) {
          console.error('Error saving image metadata:', imagesError);
          // Continue with submission even if image metadata fails
        }
      }
    }
    
    // 6. Upload and save documents
    if (state.documents.length > 0) {
      // Upload each document file
      const documentsToInsert = [];
      
      for (const document of state.documents) {
        if (document.file) {
          try {
            // Generate file path
            const fileExt = document.file.name.split('.').pop();
            const fileName = `${propertyId}/${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
            
            // Upload the file
            const { data, error } = await supabase.storage
              .from('property-documents')
              .upload(fileName, document.file, {
                cacheControl: '3600',
                upsert: false
              });
              
            if (error) throw error;
            
            // Add to documents to insert
            documentsToInsert.push({
              property_id: propertyId,
              name: document.name,
              storage_path: fileName,
              document_type: document.documentType
            });
          } catch (uploadError) {
            console.error('Error uploading document:', uploadError);
            // Continue with other documents
          }
        }
      }
      
      // Insert all document records
      if (documentsToInsert.length > 0) {
        const { error: documentsError } = await supabase
          .from('property_documents')
          .insert(documentsToInsert as any);
          
        if (documentsError) {
          console.error('Error saving document metadata:', documentsError);
          // Continue with submission even if document metadata fails
        }
      }
    }
    
    toast.success('Property listing created successfully!');
    return Promise.resolve();
  } catch (error) {
    console.error('Error submitting property:', error);
    toast.error('Failed to create property listing. Please try again.');
    return Promise.reject(error);
  }
};
