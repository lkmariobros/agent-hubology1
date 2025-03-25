
import { supabase } from '@/integrations/supabase/client';
import { PropertyFormState } from '@/types/property-form';
import { toast } from 'sonner';

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
    // 1. Upload images to Supabase Storage
    const uploadedImages = await Promise.all(
      state.images.map(async (image, index) => {
        if (image.file) {
          const fileExt = image.file.name.split('.').pop();
          const fileName = `${Date.now()}-${index}.${fileExt}`;
          const filePath = `properties/${fileName}`;
          
          const { data, error } = await supabase.storage
            .from('property-assets')
            .upload(filePath, image.file);
            
          if (error) throw error;
          
          return {
            ...image,
            url: filePath,
            displayOrder: index,
          };
        }
        return image;
      })
    );
    
    // 2. Upload documents to Supabase Storage
    const uploadedDocuments = await Promise.all(
      state.documents.map(async (document, index) => {
        if (document.file) {
          const fileExt = document.file.name.split('.').pop();
          const fileName = `${Date.now()}-${index}.${fileExt}`;
          const filePath = `documents/${fileName}`;
          
          const { data, error } = await supabase.storage
            .from('property-assets')
            .upload(filePath, document.file);
            
          if (error) throw error;
          
          return {
            ...document,
            url: filePath,
          };
        }
        return document;
      })
    );
    
    // 3. Get reference data IDs
    // Fetch property type ID
    const { data: propertyTypeData } = await supabase
      .from('property_types')
      .select('id')
      .eq('name', state.formData.propertyType)
      .single();
      
    // Fetch transaction type ID
    const { data: transactionTypeData } = await supabase
      .from('transaction_types')
      .select('id')
      .eq('name', state.formData.transactionType)
      .single();
      
    // Fetch status ID
    const { data: statusData } = await supabase
      .from('property_statuses')
      .select('id')
      .eq('name', state.formData.status)
      .single();
    
    // 4. Build property data object based on property type
    // Extract common fields
    const commonPropertyData = {
      title: state.formData.title,
      property_type_id: propertyTypeData?.id,
      transaction_type_id: transactionTypeData?.id,
      status_id: statusData?.id,
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
    
    // 5. Insert property into database
    const { data: propertyResult, error: propertyError } = await supabase
      .from('enhanced_properties')
      .insert(propertyData)
      .select()
      .single();
      
    if (propertyError) throw propertyError;
    
    // 6. Insert images
    if (uploadedImages.length > 0) {
      const imagesToInsert = uploadedImages.map((image) => ({
        property_id: propertyResult.id,
        storage_path: image.url,
        display_order: image.displayOrder,
        is_cover: image.isCover,
      }));
      
      const { error: imagesError } = await supabase
        .from('property_images')
        .insert(imagesToInsert);
        
      if (imagesError) throw imagesError;
    }
    
    // 7. Insert documents
    if (uploadedDocuments.length > 0) {
      const documentsToInsert = uploadedDocuments.map((doc) => ({
        property_id: propertyResult.id,
        name: doc.name,
        storage_path: doc.url,
        document_type: doc.documentType,
      }));
      
      const { error: documentsError } = await supabase
        .from('property_documents')
        .insert(documentsToInsert);
        
      if (documentsError) throw documentsError;
    }
    
    // 8. Insert owner contacts
    if (state.formData.ownerContacts.length > 0) {
      // In a real implementation, contacts would be inserted into a property_contacts table
      console.log('Inserting contacts:', state.formData.ownerContacts);
      
      // This is a placeholder for the actual implementation
      // which would insert into a dedicated contacts table
      /*
      const { error: contactsError } = await supabase
        .from('property_contacts')
        .insert(state.formData.ownerContacts.map(contact => ({
          property_id: propertyResult.id,
          name: contact.name,
          role: contact.role,
          phone: contact.phone,
          email: contact.email
        })));
        
      if (contactsError) throw contactsError;
      */
    }
    
    toast.success('Property listing created successfully!');
    return Promise.resolve();
  } catch (error) {
    console.error('Error submitting property:', error);
    toast.error('Failed to create property listing. Please try again.');
    return Promise.reject(error);
  }
};
