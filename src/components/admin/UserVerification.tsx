
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const UserVerification: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Verify User Identities</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-500">
          Use this interface to review user verification requests and manual identity checks.
        </p>
      </CardContent>
    </Card>
  );
};

export default UserVerification;
