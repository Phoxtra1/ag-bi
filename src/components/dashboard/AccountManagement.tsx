
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  User, 
  CreditCard, 
  Receipt, 
  Settings, 
  Shield, 
  Bell,
  CheckCircle,
  Calendar,
  DollarSign
} from 'lucide-react';

const AccountManagement = () => {
  const currentPlan = {
    name: 'Pro Plan',
    price: '$29/month',
    renewalDate: '2024-02-15',
    status: 'Active',
    features: ['Advanced Predictions', 'Priority Support', 'API Access (Limited)', 'Export Reports']
  };

  const billingHistory = [
    { id: 1, date: '2024-01-15', amount: '$29.00', status: 'Paid', invoice: 'INV-001' },
    { id: 2, date: '2023-12-15', amount: '$29.00', status: 'Paid', invoice: 'INV-002' },
    { id: 3, date: '2023-11-15', amount: '$29.00', status: 'Paid', invoice: 'INV-003' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Account Management</h2>
        <p className="text-gray-600">Manage your account settings, billing, and subscription</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current Plan */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Current Plan
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">{currentPlan.name}</h3>
                <p className="text-gray-600">{currentPlan.price}</p>
              </div>
              <Badge className="bg-green-100 text-green-800">
                <CheckCircle className="w-4 h-4 mr-1" />
                {currentPlan.status}
              </Badge>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">Plan Features:</h4>
              <ul className="space-y-1">
                {currentPlan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>Renews on {currentPlan.renewalDate}</span>
            </div>
            
            <div className="flex gap-2">
              <Button className="flex-1">Upgrade Plan</Button>
              <Button variant="outline">Change Plan</Button>
            </div>
          </CardContent>
        </Card>

        {/* Account Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Account Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <Input type="email" defaultValue="john.doe@example.com" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <Input defaultValue="John Doe" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Organization</label>
              <Input defaultValue="Tech Corp Inc." />
            </div>
            
            <Button className="w-full">Save Changes</Button>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Security Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h4 className="font-medium">Password</h4>
                <p className="text-sm text-gray-600">Last changed 2 months ago</p>
              </div>
              <Button variant="outline" size="sm">Change</Button>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h4 className="font-medium">Two-Factor Authentication</h4>
                <p className="text-sm text-gray-600">Add extra security to your account</p>
              </div>
              <Button variant="outline" size="sm">Enable</Button>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h4 className="font-medium">Active Sessions</h4>
                <p className="text-sm text-gray-600">Manage device sessions</p>
              </div>
              <Button variant="outline" size="sm">Manage</Button>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notification Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Email Notifications</h4>
                <p className="text-sm text-gray-600">Receive updates via email</p>
              </div>
              <Button variant="outline" size="sm">Configure</Button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Prediction Alerts</h4>
                <p className="text-sm text-gray-600">Get notified of new predictions</p>
              </div>
              <Button variant="outline" size="sm">Settings</Button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Billing Notifications</h4>
                <p className="text-sm text-gray-600">Payment and billing updates</p>
              </div>
              <Button variant="outline" size="sm">Manage</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Billing History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="w-5 h-5" />
            Billing History
          </CardTitle>
          <CardDescription>
            View and download your payment history and invoices
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {billingHistory.map((bill) => (
              <div key={bill.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-4">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium">{bill.amount}</p>
                    <p className="text-sm text-gray-600">{bill.date}</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">{bill.status}</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">{bill.invoice}</span>
                  <Button variant="ghost" size="sm">Download</Button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 pt-4 border-t">
            <Button variant="outline" className="w-full">
              View All Transactions
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountManagement;
