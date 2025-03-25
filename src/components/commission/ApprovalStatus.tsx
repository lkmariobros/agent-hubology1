
import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, AlertTriangle, FileText } from "lucide-react";
import { formatDate } from '@/utils/format';
import { useCommissionApproval } from '@/hooks/useCommissionApproval';

interface ApprovalStatusProps {
  transactionId: string;
}

const ApprovalStatusBadge = ({ status }: { status: string }) => {
  switch (status.toLowerCase()) {
    case 'pending':
      return (
        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
          <Clock className="w-3 h-3 mr-1" />
          Pending
        </Badge>
      );
    case 'approved':
      return (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          <CheckCircle className="w-3 h-3 mr-1" />
          Approved
        </Badge>
      );
    case 'rejected':
      return (
        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
          <AlertTriangle className="w-3 h-3 mr-1" />
          Rejected
        </Badge>
      );
    case 'ready_for_payment':
      return (
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          <FileText className="w-3 h-3 mr-1" />
          Ready for Payment
        </Badge>
      );
    case 'paid':
      return (
        <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
          <CheckCircle className="w-3 h-3 mr-1" />
          Paid
        </Badge>
      );
    default:
      return (
        <Badge variant="outline">
          {status}
        </Badge>
      );
  }
};

const ApprovalStatus: React.FC<ApprovalStatusProps> = ({ transactionId }) => {
  const [approvalData, setApprovalData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const commissionApproval = useCommissionApproval();
  
  useEffect(() => {
    const fetchApprovalData = async () => {
      setLoading(true);
      try {
        // Make API call to get approval data
        const data = await commissionApproval.getApprovalByTransactionId(
          transactionId, 
          { 
            includeTransaction: true,
            includeAgent: true,
            includeHistory: true
          }
        );
        
        setApprovalData(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching approval data:', err);
        setError('Failed to load approval data');
        setApprovalData(null);
      } finally {
        setLoading(false);
      }
    };
    
    if (transactionId) {
      fetchApprovalData();
    }
  }, [transactionId, commissionApproval]);
  
  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-4">
            <div className="animate-pulse flex space-x-4">
              <div className="flex-1 space-y-4 py-1">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (error || !approvalData) {
    return (
      <Card>
        <CardContent className="p-6">
          <CardDescription className="text-center py-4">
            {error || 'No approval information available for this transaction.'}
          </CardDescription>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader className="p-5">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold">Commission Approval Status</CardTitle>
          <ApprovalStatusBadge status={approvalData.status} />
        </div>
        <CardDescription>
          Submitted on {formatDate(approvalData.created_at)}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-5 pt-0 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-semibold text-muted-foreground mb-1">Transaction Value</h4>
            <p className="font-medium">${approvalData.property_transactions?.transaction_value?.toLocaleString() || 'N/A'}</p>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-muted-foreground mb-1">Commission Amount</h4>
            <p className="font-medium">${approvalData.property_transactions?.commission_amount?.toLocaleString() || 'N/A'}</p>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-muted-foreground mb-1">Property</h4>
            <p className="font-medium">{approvalData.property_transactions?.property?.title || 'N/A'}</p>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-muted-foreground mb-1">Agent</h4>
            <p className="font-medium">{approvalData.agent?.name || 'N/A'}</p>
          </div>
        </div>
        
        {approvalData.status !== 'Pending' && (
          <div className="mt-4 border-t pt-4">
            <h4 className="text-sm font-semibold mb-2">Approval History</h4>
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="bg-gray-100 p-2 rounded-full mr-3 mt-0.5">
                  <Clock className="h-4 w-4 text-gray-500" />
                </div>
                <div>
                  <p className="text-sm font-medium">Submitted for Approval</p>
                  <p className="text-xs text-muted-foreground">{formatDate(approvalData.created_at)}</p>
                </div>
              </div>
              
              {approvalData.status !== 'Pending' && (
                <div className="flex items-start">
                  <div className="bg-gray-100 p-2 rounded-full mr-3 mt-0.5">
                    {approvalData.status === 'Approved' ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      {approvalData.status === 'Approved' ? 'Approved' : 'Rejected'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(approvalData.reviewed_at || new Date())}
                    </p>
                    {approvalData.notes && (
                      <p className="text-xs mt-1 p-2 bg-gray-50 rounded-md">
                        Note: {approvalData.notes}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ApprovalStatus;
