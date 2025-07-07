
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Lock, ExternalLink } from 'lucide-react';

interface ApiAccessGuardProps {
  children: React.ReactNode;
  userPlan?: 'free' | 'elite' | 'institutional';
  isOrganizationVerified?: boolean;
}

const ApiAccessGuard: React.FC<ApiAccessGuardProps> = ({ 
  children, 
  userPlan = 'free',
  isOrganizationVerified = false 
}) => {
  const hasApiAccess = userPlan === 'institutional' && isOrganizationVerified;

  if (hasApiAccess) {
    return <>{children}</>;
  }

  return (
    <Card className="border-2 border-orange-200 bg-orange-50">
      <CardContent className="p-8 text-center">
        <div className="mb-6">
          <Shield className="w-16 h-16 text-orange-500 mx-auto mb-4" />
          <Lock className="w-8 h-8 text-orange-600 mx-auto" />
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          API Access Restricted
        </h2>
        
        <div className="text-gray-700 mb-6 space-y-2">
          <p className="text-lg">
            API access is exclusively available to verified organizations with institutional subscriptions.
          </p>
          <p className="text-sm">
            Individual users cannot access API management features to prevent misuse and ensure platform integrity.
          </p>
        </div>

        <div className="bg-white rounded-lg p-4 mb-6 text-left">
          <h3 className="font-semibold text-gray-900 mb-2">To gain API access:</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Subscribe to an Institutional Plan</li>
            <li>• Submit organization verification documents</li>
            <li>• Wait for admin approval (5-7 business days)</li>
            <li>• Comply with API usage guidelines</li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild className="bg-orange-600 hover:bg-orange-700">
            <a href="/api-organizations">
              <ExternalLink className="w-4 h-4 mr-2" />
              Apply for API Access
            </a>
          </Button>
          <Button variant="outline" asChild>
            <a href="/pricing">View Institutional Plans</a>
          </Button>
        </div>

        <p className="text-xs text-gray-500 mt-4">
          Questions? Contact our support team for guidance on organization verification.
        </p>
      </CardContent>
    </Card>
  );
};

export default ApiAccessGuard;
