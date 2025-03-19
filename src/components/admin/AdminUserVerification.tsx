
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BadgeCheck, X, UserX, UserCheck } from 'lucide-react';
import { UserVerification } from "@/components/admin";

const AdminUserVerification: React.FC = () => {
  const [verificationRequests, setVerificationRequests] = useState([
    { id: 1, userId: 'usr-123', username: 'creator_alex', requestDate: '2023-11-10', status: 'pending', verificationDocuments: ['id.jpg', 'selfie.jpg'] },
    { id: 2, userId: 'usr-456', username: 'jana_music', requestDate: '2023-11-09', status: 'approved', verificationDocuments: ['passport.jpg', 'creator_id.jpg'] },
    { id: 3, userId: 'usr-789', username: 'dance_mike', requestDate: '2023-11-08', status: 'rejected', verificationDocuments: ['drivers_license.jpg'] },
    { id: 4, userId: 'usr-101', username: 'fashion_sara', requestDate: '2023-11-07', status: 'pending', verificationDocuments: ['id_card.jpg', 'business_license.jpg'] },
  ]);

  // Handle approving a verification request
  const handleApprove = (id: number) => {
    setVerificationRequests(requests => 
      requests.map(request => 
        request.id === id ? { ...request, status: 'approved' } : request
      )
    );
  };
  
  // Handle rejecting a verification request
  const handleReject = (id: number) => {
    setVerificationRequests(requests => 
      requests.map(request => 
        request.id === id ? { ...request, status: 'rejected' } : request
      )
    );
  };

  // Status badge component with appropriate color
  const StatusBadge = ({ status }: { status: string }) => {
    let color = '';
    let icon = null;
    
    switch(status) {
      case 'approved':
        color = 'bg-green-100 text-green-800';
        icon = <BadgeCheck className="h-3 w-3 mr-1" />;
        break;
      case 'rejected':
        color = 'bg-red-100 text-red-800';
        icon = <X className="h-3 w-3 mr-1" />;
        break;
      case 'pending':
      default:
        color = 'bg-yellow-100 text-yellow-800';
        break;
    }
    
    return (
      <Badge className={`${color} flex items-center`}>
        {icon}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>User Verification Requests</CardTitle>
        </CardHeader>
        <CardContent>
          {verificationRequests.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Request Date</TableHead>
                  <TableHead>Documents</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {verificationRequests.map(request => (
                  <TableRow key={request.id}>
                    <TableCell>
                      <div className="font-medium">{request.username}</div>
                      <div className="text-sm text-gray-500">{request.userId}</div>
                    </TableCell>
                    <TableCell>{request.requestDate}</TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        {request.verificationDocuments.map((doc, index) => (
                          <div key={index} className="text-sm">
                            <a href="#" className="text-blue-600 hover:underline">
                              {doc}
                            </a>
                          </div>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={request.status} />
                    </TableCell>
                    <TableCell>
                      {request.status === 'pending' && (
                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="flex items-center text-green-600 border-green-600 hover:bg-green-50"
                            onClick={() => handleApprove(request.id)}
                          >
                            <UserCheck className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="flex items-center text-red-600 border-red-600 hover:bg-red-50"
                            onClick={() => handleReject(request.id)}
                          >
                            <UserX className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-6 text-gray-500">
              No verification requests found
            </div>
          )}
        </CardContent>
      </Card>
      
      <UserVerification />
    </div>
  );
};

export default AdminUserVerification;
