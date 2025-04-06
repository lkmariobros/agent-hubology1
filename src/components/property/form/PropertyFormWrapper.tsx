
import React, { useState, useEffect, useCallback } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { PropertyFormValues } from "@/types";
import { propertySchema as propertyFormSchema } from "@/components/property/form/validation";
import { PropertyFormContext } from '@/context/PropertyForm/PropertyFormContext';
import { saveFormAsDraft, submitPropertyForm } from "@/context/PropertyForm/formSubmission";
import { PropertyFormState, PropertyFormData } from '@/types/property-form';
import { supabase } from '@/lib/supabase';

interface PropertyFormWrapperProps {
  initialData?: PropertyFormValues;
  onSubmit?: (data: PropertyFormValues) => Promise<void>;
  onSaveDraft?: (state: PropertyFormState) => Promise<void>;
  onCancel?: () => void;
  isSubmitting?: boolean;
  mode?: 'create' | 'edit';
  children?: React.ReactNode;
}

const PropertyFormWrapper: React.FC<PropertyFormWrapperProps> = ({ 
  initialData, 
  onSubmit, 
  onSaveDraft,
  onCancel,
  isSubmitting,
  mode = 'create',
  children
}) => {
  const [formData, setFormData] = useState<PropertyFormValues>(initialData || {
    title: '',
    description: '',
    propertyType: 'Residential',
    transactionType: 'Sale',
    status: 'Available',
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
    powerCapacity: '',
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
    features: [],
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
      const formValues = form.getValues();
      const state: PropertyFormState = {
        currentStep: 0,
        formData: {
          ...formValues,
          featured: false // Add missing property required by PropertyFormData
        } as unknown as PropertyFormData, // Cast to PropertyFormData
        images: images,
        documents: documents,
        isDirty: true,
        isSubmitting: false,
        lastSaved: null
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
        currentStep: 0,
        formData: {
          ...data,
          featured: false // Add missing property required by PropertyFormData
        } as unknown as PropertyFormData, // Cast to PropertyFormData
        images: images,
        documents: documents,
        isDirty: false,
        isSubmitting: true,
        lastSaved: new Date()
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
  
  // Create the necessary functions to match PropertyFormContextType interface
  const updateFormData = useCallback((data: Partial<PropertyFormData>) => {
    form.reset({ ...form.getValues(), ...data as any }, { keepValues: true });
  }, [form]);
  
  const updatePropertyType = useCallback((type: 'Residential' | 'Commercial' | 'Industrial' | 'Land') => {
    form.setValue('propertyType', type);
  }, [form]);
  
  const updateTransactionType = useCallback((type: 'Sale' | 'Rent' | 'Primary') => {
    form.setValue('transactionType', type);
  }, [form]);
  
  const nextStep = useCallback(() => {
    // Navigation logic - would be implemented in a real stepped form
    console.log("Move to next step");
  }, []);
  
  const prevStep = useCallback(() => {
    // Navigation logic - would be implemented in a real stepped form
    console.log("Move to previous step");
  }, []);
  
  const goToStep = useCallback((step: number) => {
    // Navigation logic - would be implemented in a real stepped form
    console.log("Go to step", step);
  }, []);
  
  const resetForm = useCallback(() => {
    form.reset();
    setImages([]);
    setDocuments([]);
  }, [form]);
  
  const contextValue = {
    state: {
      currentStep: 0,
      formData: form.getValues() as unknown as PropertyFormData,
      images: images,
      documents: documents,
      isDirty: form.formState.isDirty,
      isSubmitting: form.formState.isSubmitting,
      lastSaved: null
    },
    form,
    addImage,
    removeImage,
    setCoverImage,
    updateImageStatus,
    reorderImages,
    addDocument,
    removeDocument,
    updateFormData,
    updatePropertyType,
    updateTransactionType,
    nextStep,
    prevStep,
    goToStep,
    resetForm,
    saveForm: handleSaveDraft,
    submitForm: handleSubmit
  };
  
  return (
    <PropertyFormContext.Provider value={contextValue as any}>
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement, {
            onSubmit: handleSubmit,
            onSaveDraft: handleSaveDraft,
            onCancel: handleCancel,
            isSubmitting: isSubmitting,
            form: form
          });
        }
        return child;
      })}
    </PropertyFormContext.Provider>
  );
};

export default PropertyFormWrapper;
