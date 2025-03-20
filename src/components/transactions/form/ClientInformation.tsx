
import React from 'react';
import { useTransactionForm } from '@/context/TransactionFormContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const ClientInformation: React.FC = () => {
  const { state, updateFormData } = useTransactionForm();
  const { formData, errors } = state;

  // Based on transaction type, we'll show different client fields
  const renderClientFields = () => {
    switch (formData.transactionType) {
      case 'Sale':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Buyer Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Buyer Information</h3>
              <div>
                <Label htmlFor="buyerName">Buyer Name</Label>
                <Input
                  id="buyerName"
                  value={formData.buyer?.name || ''}
                  onChange={(e) =>
                    updateFormData({
                      buyer: { ...formData.buyer, name: e.target.value },
                    })
                  }
                  placeholder="Enter buyer name"
                  className={errors.buyerName ? 'border-destructive' : ''}
                />
                {errors.buyerName && (
                  <p className="text-sm text-destructive mt-1">{errors.buyerName}</p>
                )}
              </div>

              <div>
                <Label htmlFor="buyerEmail">Buyer Email</Label>
                <Input
                  id="buyerEmail"
                  type="email"
                  value={formData.buyer?.email || ''}
                  onChange={(e) =>
                    updateFormData({
                      buyer: { ...formData.buyer, email: e.target.value },
                    })
                  }
                  placeholder="Enter buyer email"
                />
              </div>

              <div>
                <Label htmlFor="buyerPhone">Buyer Phone</Label>
                <Input
                  id="buyerPhone"
                  value={formData.buyer?.phone || ''}
                  onChange={(e) =>
                    updateFormData({
                      buyer: { ...formData.buyer, phone: e.target.value },
                    })
                  }
                  placeholder="Enter buyer phone number"
                />
              </div>

              <div>
                <Label htmlFor="buyerNotes">Notes about Buyer</Label>
                <Textarea
                  id="buyerNotes"
                  value={formData.buyer?.notes || ''}
                  onChange={(e) =>
                    updateFormData({
                      buyer: { ...formData.buyer, notes: e.target.value },
                    })
                  }
                  placeholder="Any additional notes about the buyer"
                  rows={3}
                />
              </div>
            </div>

            {/* Seller Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Seller Information</h3>
              <div>
                <Label htmlFor="sellerName">Seller Name</Label>
                <Input
                  id="sellerName"
                  value={formData.seller?.name || ''}
                  onChange={(e) =>
                    updateFormData({
                      seller: { ...formData.seller, name: e.target.value },
                    })
                  }
                  placeholder="Enter seller name"
                  className={errors.sellerName ? 'border-destructive' : ''}
                />
                {errors.sellerName && (
                  <p className="text-sm text-destructive mt-1">{errors.sellerName}</p>
                )}
              </div>

              <div>
                <Label htmlFor="sellerEmail">Seller Email</Label>
                <Input
                  id="sellerEmail"
                  type="email"
                  value={formData.seller?.email || ''}
                  onChange={(e) =>
                    updateFormData({
                      seller: { ...formData.seller, email: e.target.value },
                    })
                  }
                  placeholder="Enter seller email"
                />
              </div>

              <div>
                <Label htmlFor="sellerPhone">Seller Phone</Label>
                <Input
                  id="sellerPhone"
                  value={formData.seller?.phone || ''}
                  onChange={(e) =>
                    updateFormData({
                      seller: { ...formData.seller, phone: e.target.value },
                    })
                  }
                  placeholder="Enter seller phone number"
                />
              </div>

              <div>
                <Label htmlFor="sellerNotes">Notes about Seller</Label>
                <Textarea
                  id="sellerNotes"
                  value={formData.seller?.notes || ''}
                  onChange={(e) =>
                    updateFormData({
                      seller: { ...formData.seller, notes: e.target.value },
                    })
                  }
                  placeholder="Any additional notes about the seller"
                  rows={3}
                />
              </div>
            </div>
          </div>
        );

      case 'Rent':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tenant Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Tenant Information</h3>
              <div>
                <Label htmlFor="tenantName">Tenant Name</Label>
                <Input
                  id="tenantName"
                  value={formData.tenant?.name || ''}
                  onChange={(e) =>
                    updateFormData({
                      tenant: { ...formData.tenant, name: e.target.value },
                    })
                  }
                  placeholder="Enter tenant name"
                  className={errors.tenantName ? 'border-destructive' : ''}
                />
                {errors.tenantName && (
                  <p className="text-sm text-destructive mt-1">{errors.tenantName}</p>
                )}
              </div>

              <div>
                <Label htmlFor="tenantEmail">Tenant Email</Label>
                <Input
                  id="tenantEmail"
                  type="email"
                  value={formData.tenant?.email || ''}
                  onChange={(e) =>
                    updateFormData({
                      tenant: { ...formData.tenant, email: e.target.value },
                    })
                  }
                  placeholder="Enter tenant email"
                />
              </div>

              <div>
                <Label htmlFor="tenantPhone">Tenant Phone</Label>
                <Input
                  id="tenantPhone"
                  value={formData.tenant?.phone || ''}
                  onChange={(e) =>
                    updateFormData({
                      tenant: { ...formData.tenant, phone: e.target.value },
                    })
                  }
                  placeholder="Enter tenant phone number"
                />
              </div>

              <div>
                <Label htmlFor="tenantNotes">Notes about Tenant</Label>
                <Textarea
                  id="tenantNotes"
                  value={formData.tenant?.notes || ''}
                  onChange={(e) =>
                    updateFormData({
                      tenant: { ...formData.tenant, notes: e.target.value },
                    })
                  }
                  placeholder="Any additional notes about the tenant"
                  rows={3}
                />
              </div>
            </div>

            {/* Landlord Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Landlord Information</h3>
              <div>
                <Label htmlFor="landlordName">Landlord Name</Label>
                <Input
                  id="landlordName"
                  value={formData.landlord?.name || ''}
                  onChange={(e) =>
                    updateFormData({
                      landlord: { ...formData.landlord, name: e.target.value },
                    })
                  }
                  placeholder="Enter landlord name"
                  className={errors.landlordName ? 'border-destructive' : ''}
                />
                {errors.landlordName && (
                  <p className="text-sm text-destructive mt-1">{errors.landlordName}</p>
                )}
              </div>

              <div>
                <Label htmlFor="landlordEmail">Landlord Email</Label>
                <Input
                  id="landlordEmail"
                  type="email"
                  value={formData.landlord?.email || ''}
                  onChange={(e) =>
                    updateFormData({
                      landlord: { ...formData.landlord, email: e.target.value },
                    })
                  }
                  placeholder="Enter landlord email"
                />
              </div>

              <div>
                <Label htmlFor="landlordPhone">Landlord Phone</Label>
                <Input
                  id="landlordPhone"
                  value={formData.landlord?.phone || ''}
                  onChange={(e) =>
                    updateFormData({
                      landlord: { ...formData.landlord, phone: e.target.value },
                    })
                  }
                  placeholder="Enter landlord phone number"
                />
              </div>

              <div>
                <Label htmlFor="landlordNotes">Notes about Landlord</Label>
                <Textarea
                  id="landlordNotes"
                  value={formData.landlord?.notes || ''}
                  onChange={(e) =>
                    updateFormData({
                      landlord: { ...formData.landlord, notes: e.target.value },
                    })
                  }
                  placeholder="Any additional notes about the landlord"
                  rows={3}
                />
              </div>
            </div>
          </div>
        );

      case 'Primary':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Buyer Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Buyer Information</h3>
              <div>
                <Label htmlFor="buyerName">Buyer Name</Label>
                <Input
                  id="buyerName"
                  value={formData.buyer?.name || ''}
                  onChange={(e) =>
                    updateFormData({
                      buyer: { ...formData.buyer, name: e.target.value },
                    })
                  }
                  placeholder="Enter buyer name"
                  className={errors.buyerName ? 'border-destructive' : ''}
                />
                {errors.buyerName && (
                  <p className="text-sm text-destructive mt-1">{errors.buyerName}</p>
                )}
              </div>

              <div>
                <Label htmlFor="buyerEmail">Buyer Email</Label>
                <Input
                  id="buyerEmail"
                  type="email"
                  value={formData.buyer?.email || ''}
                  onChange={(e) =>
                    updateFormData({
                      buyer: { ...formData.buyer, email: e.target.value },
                    })
                  }
                  placeholder="Enter buyer email"
                />
              </div>

              <div>
                <Label htmlFor="buyerPhone">Buyer Phone</Label>
                <Input
                  id="buyerPhone"
                  value={formData.buyer?.phone || ''}
                  onChange={(e) =>
                    updateFormData({
                      buyer: { ...formData.buyer, phone: e.target.value },
                    })
                  }
                  placeholder="Enter buyer phone number"
                />
              </div>

              <div>
                <Label htmlFor="buyerNotes">Notes about Buyer</Label>
                <Textarea
                  id="buyerNotes"
                  value={formData.buyer?.notes || ''}
                  onChange={(e) =>
                    updateFormData({
                      buyer: { ...formData.buyer, notes: e.target.value },
                    })
                  }
                  placeholder="Any additional notes about the buyer"
                  rows={3}
                />
              </div>
            </div>

            {/* Developer Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Developer Information</h3>
              <div>
                <Label htmlFor="developerName">Developer Name</Label>
                <Input
                  id="developerName"
                  value={formData.developer?.name || ''}
                  onChange={(e) =>
                    updateFormData({
                      developer: { ...formData.developer, name: e.target.value },
                    })
                  }
                  placeholder="Enter developer name"
                  className={errors.developerName ? 'border-destructive' : ''}
                />
                {errors.developerName && (
                  <p className="text-sm text-destructive mt-1">{errors.developerName}</p>
                )}
              </div>

              <div>
                <Label htmlFor="developerEmail">Developer Email</Label>
                <Input
                  id="developerEmail"
                  type="email"
                  value={formData.developer?.email || ''}
                  onChange={(e) =>
                    updateFormData({
                      developer: { ...formData.developer, email: e.target.value },
                    })
                  }
                  placeholder="Enter developer email"
                />
              </div>

              <div>
                <Label htmlFor="developerPhone">Developer Phone</Label>
                <Input
                  id="developerPhone"
                  value={formData.developer?.phone || ''}
                  onChange={(e) =>
                    updateFormData({
                      developer: { ...formData.developer, phone: e.target.value },
                    })
                  }
                  placeholder="Enter developer phone number"
                />
              </div>

              <div>
                <Label htmlFor="developerNotes">Notes about Developer</Label>
                <Textarea
                  id="developerNotes"
                  value={formData.developer?.notes || ''}
                  onChange={(e) =>
                    updateFormData({
                      developer: { ...formData.developer, notes: e.target.value },
                    })
                  }
                  placeholder="Any additional notes about the developer"
                  rows={3}
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Client Information</h2>
      <p className="text-muted-foreground">
        Please enter the details of all parties involved in this {formData.transactionType.toLowerCase()} transaction.
      </p>

      {renderClientFields()}
    </div>
  );
};

export default ClientInformation;
