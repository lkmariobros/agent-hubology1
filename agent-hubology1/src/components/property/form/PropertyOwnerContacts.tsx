
import React, { useState } from 'react';
import { usePropertyForm } from '@/context/PropertyForm';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, User, Phone, Mail, X } from 'lucide-react';
import { toast } from 'sonner';
import { OwnerContact } from '@/types/property-form';

const PropertyOwnerContacts = () => {
  const { state, updateFormData } = usePropertyForm();
  const { formData } = state;
  const { ownerContacts } = formData;
  
  const [newContact, setNewContact] = useState<Omit<OwnerContact, 'id'>>({
    name: '',
    role: '',
    phone: '',
    email: '',
  });
  
  const [showAddForm, setShowAddForm] = useState(false);
  
  const handleAddContact = () => {
    if (!newContact.name.trim()) {
      toast.error('Contact name is required');
      return;
    }
    
    if (newContact.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newContact.email)) {
      toast.error('Please enter a valid email address');
      return;
    }
    
    const updatedContacts = [
      ...ownerContacts,
      {
        ...newContact,
        id: `temp-${Date.now()}`, // This will be replaced with a real ID on the server
      },
    ];
    
    updateFormData({ ownerContacts: updatedContacts });
    setNewContact({ name: '', role: '', phone: '', email: '' });
    setShowAddForm(false);
    toast.success('Contact added successfully');
  };
  
  const handleRemoveContact = (index: number) => {
    const updatedContacts = [...ownerContacts];
    updatedContacts.splice(index, 1);
    updateFormData({ ownerContacts: updatedContacts });
    toast.success('Contact removed');
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewContact(prev => ({
      ...prev,
      [name]: value,
    }));
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Owner Contacts</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Add contact information for the property owners or relevant contacts.
        </p>
      </div>
      
      {/* Contact List */}
      <div className="space-y-3">
        {ownerContacts.length > 0 ? (
          <div className="grid gap-3">
            {ownerContacts.map((contact, index) => (
              <Card key={contact.id || index} className="p-4 bg-secondary/10">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      <span className="font-medium">{contact.name}</span>
                      {contact.role && (
                        <span className="text-sm text-muted-foreground ml-2">({contact.role})</span>
                      )}
                    </div>
                    {contact.phone && (
                      <div className="flex items-center text-sm">
                        <Phone className="h-3.5 w-3.5 mr-2" />
                        <span>{contact.phone}</span>
                      </div>
                    )}
                    {contact.email && (
                      <div className="flex items-center text-sm">
                        <Mail className="h-3.5 w-3.5 mr-2" />
                        <span>{contact.email}</span>
                      </div>
                    )}
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleRemoveContact(index)} 
                    className="h-8 w-8 text-destructive hover:text-destructive/90">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 bg-muted/20 rounded-lg">
            <User className="mx-auto h-10 w-10 text-muted-foreground opacity-30" />
            <p className="mt-2 text-sm text-muted-foreground">No contacts added yet</p>
          </div>
        )}
      </div>
      
      {/* Add Contact Form */}
      {showAddForm ? (
        <Card className="p-4 bg-muted/30">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-medium">Add Contact</h4>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setShowAddForm(false)} 
                className="h-7 w-7">
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name <span className="text-destructive">*</span></Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="John Smith"
                  value={newContact.name}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Input
                  id="role"
                  name="role"
                  placeholder="Owner, Tenant, etc."
                  value={newContact.role}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  placeholder="+60 12 345 6789"
                  value={newContact.phone}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="example@email.com"
                  value={newContact.email}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button
                type="button"
                onClick={handleAddContact}
                size="sm"
              >
                Add Contact
              </Button>
            </div>
          </div>
        </Card>
      ) : (
        <Button 
          variant="outline" 
          onClick={() => setShowAddForm(true)} 
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Contact
        </Button>
      )}
    </div>
  );
};

export default PropertyOwnerContacts;
