
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { 
  User, 
  CreditCard, 
  Receipt, 
  Settings, 
  Shield, 
  Bell,
  CheckCircle,
  Calendar
} from 'lucide-react';

const AccountManagement = () => {
  const { toast } = useToast();
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [show2FADialog, setShow2FADialog] = useState(false);
  const [showSessionDialog, setShowSessionDialog] = useState(false);
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [showPredictionDialog, setShowPredictionDialog] = useState(false);
  const [showBillingDialog, setShowBillingDialog] = useState(false);
  
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [predictionAlerts, setPredictionAlerts] = useState(true);
  const [billingNotifications, setBillingNotifications] = useState(true);

  const currentPlan = {
    name: 'Pro Plan',
    price: '€15/month',
    renewalDate: '2024-02-15',
    status: 'Active',
    features: ['Advanced Predictions', 'Priority Support', 'API Access (Limited)', 'Export Reports']
  };

  const billingHistory = [
    { id: 1, date: '2024-01-15', amount: '€15.00', status: 'Paid', invoice: 'INV-001' },
    { id: 2, date: '2023-12-15', amount: '€15.00', status: 'Paid', invoice: 'INV-002' },
    { id: 3, date: '2023-11-15', amount: '€15.00', status: 'Paid', invoice: 'INV-003' }
  ];

  const handlePasswordChange = () => {
    toast({
      title: "Password Updated",
      description: "Your password has been changed successfully.",
    });
    setShowPasswordDialog(false);
  };

  const handle2FAEnable = () => {
    toast({
      title: "Two-Factor Authentication Enabled",
      description: "2FA has been enabled for your account.",
    });
    setShow2FADialog(false);
  };

  const handleEmailNotificationSave = () => {
    toast({
      title: "Email Notifications Updated",
      description: "Your email notification preferences have been saved.",
    });
    setShowEmailDialog(false);
  };

  const handlePredictionAlertSave = () => {
    toast({
      title: "Prediction Alerts Updated", 
      description: "Your prediction alert settings have been saved.",
    });
    setShowPredictionDialog(false);
  };

  const handleBillingNotificationSave = () => {
    toast({
      title: "Billing Notifications Updated",
      description: "Your billing notification preferences have been saved.",
    });
    setShowBillingDialog(false);
  };

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
              <Link to="/pricing" className="flex-1">
                <Button className="w-full">Change Plan</Button>
              </Link>
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
              <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">Change</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Change Password</DialogTitle>
                    <DialogDescription>Enter your current password and choose a new one.</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Current Password</label>
                      <Input type="password" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">New Password</label>
                      <Input type="password" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Confirm New Password</label>
                      <Input type="password" />
                    </div>
                    <Button onClick={handlePasswordChange} className="w-full">Update Password</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h4 className="font-medium">Two-Factor Authentication</h4>
                <p className="text-sm text-gray-600">Add extra security to your account</p>
              </div>
              <Dialog open={show2FADialog} onOpenChange={setShow2FADialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">Enable</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Enable Two-Factor Authentication</DialogTitle>
                    <DialogDescription>Secure your account with two-factor authentication.</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium mb-2">Setup Instructions:</h4>
                      <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
                        <li>Download an authenticator app (Google Authenticator, Authy)</li>
                        <li>Scan the QR code with your authenticator app</li>
                        <li>Enter the 6-digit code from your app below</li>
                      </ol>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Verification Code</label>
                      <Input placeholder="Enter 6-digit code" maxLength={6} />
                    </div>
                    <Button onClick={handle2FAEnable} className="w-full">Enable 2FA</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h4 className="font-medium">Active Sessions</h4>
                <p className="text-sm text-gray-600">Manage device sessions</p>
              </div>
              <Dialog open={showSessionDialog} onOpenChange={setShowSessionDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">Manage</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Active Sessions</DialogTitle>
                    <DialogDescription>Manage your active device sessions.</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <h4 className="font-medium">Current Session</h4>
                          <p className="text-sm text-gray-600">Chrome on Windows • Active now</p>
                        </div>
                        <Badge className="bg-green-100 text-green-800">Current</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <h4 className="font-medium">Mobile Device</h4>
                          <p className="text-sm text-gray-600">Safari on iPhone • 2 hours ago</p>
                        </div>
                        <Button variant="outline" size="sm">Revoke</Button>
                      </div>
                    </div>
                    <Button variant="destructive" className="w-full">Sign Out All Other Sessions</Button>
                  </div>
                </DialogContent>
              </Dialog>
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
              <Dialog open={showEmailDialog} onOpenChange={setShowEmailDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">Configure</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Email Notification Settings</DialogTitle>
                    <DialogDescription>Configure your email notification preferences.</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Enable Email Notifications</h4>
                        <p className="text-sm text-gray-600">Receive general updates via email</p>
                      </div>
                      <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium">Email Frequency</h4>
                      <select className="w-full p-2 border rounded-md">
                        <option>Instant</option>
                        <option>Daily Digest</option>
                        <option>Weekly Summary</option>
                      </select>
                    </div>
                    <Button onClick={handleEmailNotificationSave} className="w-full">Save Email Settings</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Prediction Alerts</h4>
                <p className="text-sm text-gray-600">Get notified of new predictions</p>
              </div>
              <Dialog open={showPredictionDialog} onOpenChange={setShowPredictionDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">Settings</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Prediction Alert Settings</DialogTitle>
                    <DialogDescription>Configure when and how you receive prediction alerts.</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Enable Prediction Alerts</h4>
                        <p className="text-sm text-gray-600">Get notified when new predictions are available</p>
                      </div>
                      <Switch checked={predictionAlerts} onCheckedChange={setPredictionAlerts} />
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium">Alert Types</h4>
                      <div className="space-y-2">
                        <label className="flex items-center gap-2">
                          <input type="checkbox" defaultChecked />
                          <span className="text-sm">High Priority Predictions</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="checkbox" defaultChecked />
                          <span className="text-sm">Market Updates</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="checkbox" />
                          <span className="text-sm">Weekly Reports</span>
                        </label>
                      </div>
                    </div>
                    <Button onClick={handlePredictionAlertSave} className="w-full">Save Prediction Settings</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Billing Notifications</h4>
                <p className="text-sm text-gray-600">Payment and billing updates</p>
              </div>
              <Dialog open={showBillingDialog} onOpenChange={setShowBillingDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">Manage</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Billing Notification Settings</DialogTitle>
                    <DialogDescription>Manage your billing and payment notifications.</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Enable Billing Notifications</h4>
                        <p className="text-sm text-gray-600">Receive billing and payment updates</p>
                      </div>
                      <Switch checked={billingNotifications} onCheckedChange={setBillingNotifications} />
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium">Notification Types</h4>
                      <div className="space-y-2">
                        <label className="flex items-center gap-2">
                          <input type="checkbox" defaultChecked />
                          <span className="text-sm">Payment Confirmations</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="checkbox" defaultChecked />
                          <span className="text-sm">Billing Reminders</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="checkbox" defaultChecked />
                          <span className="text-sm">Invoice Generation</span>
                        </label>
                      </div>
                    </div>
                    <Button onClick={handleBillingNotificationSave} className="w-full">Save Billing Settings</Button>
                  </div>
                </DialogContent>
              </Dialog>
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
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
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
