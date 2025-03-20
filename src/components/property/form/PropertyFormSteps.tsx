
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { PropertyFormValues } from '@/types';
import { propertySchema } from './validation';
import PropertyEssentialInfo from './PropertyEssentialInfo';
import PropertyDetailsInfo from './PropertyDetailsInfo';
import PropertyAddressInfo from './PropertyAddressInfo';
import PropertyMediaUpload from './PropertyMediaUpload';
import ProgressIndicator from './ProgressIndicator';

const PropertyFormSteps = () => {
  const navigate = useNavigate();
  const [propertyImages, setPropertyImages] = React.useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState("essential");

  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      title: '',
      description: '',
      price: 0,
      type: 'residential',
      subtype: 'Apartment',
      area: 0,
      bedrooms: 0,
      bathrooms: 0,
      features: [],
      status: 'available',
      address: {
        street: '',
        city: '',
        state: '',
        zip: '',
        country: 'USA'
      },
      images: []
    },
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setPropertyImages([...propertyImages, ...newFiles]);
      toast.success(`${newFiles.length} image(s) added`);
    }
  };

  const removeImage = (index: number) => {
    setPropertyImages(propertyImages.filter((_, i) => i !== index));
    toast.info('Image removed');
  };

  const onSubmit = async (data: PropertyFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Add the files to form data
      const formData = {
        ...data,
        images: propertyImages,
      };
      
      console.log('Property submitted:', formData);
      
      // Here you would normally send the data to your API
      toast.success('Property created successfully!');
      setTimeout(() => {
        navigate('/properties');
      }, 1500);
    } catch (error) {
      console.error('Error submitting property:', error);
      toast.error('Failed to create property. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextTab = () => {
    if (activeTab === "essential") setActiveTab("details");
    else if (activeTab === "details") setActiveTab("address");
    else if (activeTab === "address") setActiveTab("media");
  };

  const prevTab = () => {
    if (activeTab === "media") setActiveTab("address");
    else if (activeTab === "address") setActiveTab("details");
    else if (activeTab === "details") setActiveTab("essential");
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <ProgressIndicator activeTab={activeTab} />
      
      {activeTab === "essential" && (
        <PropertyEssentialInfo 
          form={form} 
          nextTab={nextTab} 
        />
      )}
      
      {activeTab === "details" && (
        <PropertyDetailsInfo 
          form={form} 
          nextTab={nextTab} 
          prevTab={prevTab} 
        />
      )}
      
      {activeTab === "address" && (
        <PropertyAddressInfo 
          form={form} 
          nextTab={nextTab} 
          prevTab={prevTab} 
        />
      )}
      
      {activeTab === "media" && (
        <PropertyMediaUpload 
          propertyImages={propertyImages}
          handleImageUpload={handleImageUpload}
          removeImage={removeImage}
          isSubmitting={isSubmitting}
          prevTab={prevTab}
          navigate={navigate}
        />
      )}
    </form>
  );
};

export default PropertyFormSteps;
