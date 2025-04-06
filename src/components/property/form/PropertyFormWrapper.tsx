import React, { useState, useEffect, useCallback } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { PropertyFormValues, propertyFormSchema } from "@/types";
import { PropertyFormContext } from '@/context/PropertyForm/PropertyFormContext';
import { saveFormAsDraft, submitPropertyForm } from "@/context/PropertyForm/formSubmission";
import { PropertyFormState } from '@/types/property-form';
import { supabase } from '@/lib/supabase';

interface PropertyFormWrapperProps {
  initialData?: PropertyFormValues;
  onSubmit: (data: PropertyFormValues) => Promise<void>;
  onSaveDraft?: (state: PropertyFormState) => Promise<void>;
  onCancel?: () => void;
  isSubmitting?: boolean;
  mode?: 'create' | 'edit';
}

const PropertyFormWrapper: React.FC<PropertyFormWrapperProps> = ({ 
  initialData, 
  onSubmit, 
  onSaveDraft,
  onCancel,
  isSubmitting,
  mode = 'create'
}) => {
  const [formData, setFormData] = useState<PropertyFormValues>(initialData || {
    title: '',
    description: '',
    propertyType: 'Residential',
    transactionType: 'Sale',
    status: 'Available',
    featured: false,
    address: {
      street: '',
      city: '',
      state: '',
      zip: '',
      country: 'USA'
    },
    price: 0,
    rentalRate: 0,
    bedrooms: 0,
    bathrooms: 0,
    builtUpArea: 0,
    furnishingStatus: 'Unfurnished',
    floorArea: 0,
    zoningType: '',
    buildingClass: '',
    landArea: 0,
    ceilingHeight: 0,
    loadingBays: 0,
    powerCapacity: 0,
    landSize: 0,
    zoning: '',
    roadFrontage: 0,
    topography: '',
    agentNotes: '',
    stock: {
      total: 0,
      available: 0,
      reserved: 0,
      sold: 0
    },
    propertyFeatures: [],
    owner: {
      name: '',
      email: '',
      phone: '',
      address: '',
      company: '',
      notes: '',
      isPrimaryContact: true
    },
    images: [],
    documents: []
  });
  const [images, setImages] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const navigate = useNavigate();
  
  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(propertyFormSchema),
    defaultValues: initialData,
    mode: "onChange"
  });
  
  // Check storage buckets on component mount
  useEffect(() => {
    const checkStorageBuckets = async () => {
      try {
        const { data: buckets, error } = await supabase.storage.listBuckets();
        
        if (error) {
          console.error("Error checking storage buckets:", error);
          return;
        }
        
        const propertyImagesBucketExists = buckets?.some(b => b.name === 'property-images');
        
        if (!propertyImagesBucketExists) {
          console.warn("Property-images bucket does not exist! Image uploads will fail.");
          toast.warning("Storage configuration issue: The required 'property-images' bucket is missing. Please set it up in Supabase dashboard.");
        } else {
          console.log("Property-images bucket verified successfully");
        }
      } catch (err) {
        console.error("Error checking storage configuration:", err);
      }
    };
    
    checkStorageBuckets();
  }, []);
  
  const addImage = useCallback((image: any) => {
    setImages(prevImages => [...prevImages, image]);
  }, []);
  
  const removeImage = useCallback((index: number) => {
    setImages(prevImages => {
      const newImages = [...prevImages];
      newImages.splice(index, 1);
      return newImages;
    });
  }, []);
  
  const setCoverImage = useCallback((index: number) => {
    setImages(prevImages => {
      return prevImages.map((img, i) => ({
        ...img,
        isCover: i === index
      }));
    });
  }, []);
  
  const updateImageStatus = useCallback((index: number, status: 'uploading' | 'success' | 'error', url: string = '') => {
    setImages(prevImages => {
      const newImages = [...prevImages];
      newImages[index] = {
        ...newImages[index],
        uploadStatus: status,
        url: url || newImages[index].url
      };
      return newImages;
    });
  }, []);
  
  const reorderImages = useCallback((fromIndex: number, toIndex: number) => {
    setImages(prevImages => {
      const newImages = [...prevImages];
      const element = newImages.splice(fromIndex, 1)[0];
      newImages.splice(toIndex, 0, element);
      return newImages;
    });
  }, []);
  
  const addDocument = useCallback((document: any) => {
    setDocuments(prevDocuments => [...prevDocuments, document]);
  }, []);
  
  const removeDocument = useCallback((index: number) => {
    setDocuments(prevDocuments => {
      const newDocuments = [...prevDocuments];
      newDocuments.splice(index, 1);
      return newDocuments;
    });
  }, []);
  
  const handleSaveDraft = async () => {
    try {
      const state: PropertyFormState = {
        formData: form.getValues(),
        images: images,
        documents: documents
      };
      
      if (onSaveDraft) {
        await onSaveDraft(state);
        toast.success("Draft saved successfully!");
      } else {
        await saveFormAsDraft(state);
        toast.info("Draft saved (mock function)");
      }
    } catch (error) {
      console.error("Error saving draft:", error);
      toast.error("Failed to save draft.");
    }
  };
  
  const handleSubmit = form.handleSubmit(async (data) => {
    try {
      const state: PropertyFormState = {
        formData: data,
        images: images,
        documents: documents
      };
      
      // Call the submitPropertyForm function from context
      if (onSubmit) {
        await onSubmit(data);
      } else {
        await submitPropertyForm(state);
      }
      
      toast.success("Property submitted successfully!");
      navigate('/properties');
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to submit property.");
    }
  });
  
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      navigate('/properties');
    }
  };
  
  const contextValue = {
    state: {
      formData: form.getValues(),
      images: images,
      documents: documents
    },
    form,
    addImage,
    removeImage,
    setCoverImage,
    updateImageStatus,
    reorderImages,
    addDocument,
    removeDocument,
  };
  
  return (
    <PropertyFormContext.Provider value={contextValue}>
      {React.Children.map(children => {
        return React.cloneElement(children as React.ReactElement, {
          onSubmit: handleSubmit,
          onSaveDraft: handleSaveDraft,
          onCancel: handleCancel,
          isSubmitting: isSubmitting,
          form: form
        });
      })}
    </PropertyFormContext.Provider>
  );
};

export default PropertyFormWrapper;
