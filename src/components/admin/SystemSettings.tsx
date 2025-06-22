
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { 
  Settings, 
  Shield, 
  Database, 
  Server, 
  Mail, 
  Bell,
  Key,
  Globe,
  Zap,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

const SystemSettings = () => {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);
  const [autoBackup, setAutoBackup] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  return (
    <div className="space-y-6">
      {/* System Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">System Status</p>
                <p className="text-lg font-semibold text-green-600">Operational</p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Server Load</p>
                <p className="text-lg font-semibold">47%</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Server className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Database Health</p>
                <p className="text-lg font-semibold text-green-600">Excellent</p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <Database className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings size={20} />
            General Settings
          </CardTitle>
          <CardDescription>Configure platform-wide settings and preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Platform Name</label>
                <Input defaultValue="Amnova™ Platform" className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium">Support Email</label>
                <Input defaultValue="support@amnova.com" className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium">Max Users Per Organization</label>
                <Input defaultValue="100" type="number" className="mt-1" />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Default API Rate Limit</label>
                <Input defaultValue="1000" type="number" className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium">Session Timeout (minutes)</label>
                <Input defaultValue="60" type="number" className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium">Maximum File Upload Size (MB)</label>
                <Input defaultValue="50" type="number" className="mt-1" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell size={20} />
            Notification Settings
          </CardTitle>
          <CardDescription>Configure system alerts and notifications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Email Notifications</h4>
                <p className="text-sm text-gray-500">Send email alerts for important events</p>
              </div>
              <Switch 
                checked={emailNotifications} 
                onCheckedChange={setEmailNotifications}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">SMS Alerts</h4>
                <p className="text-sm text-gray-500">Send SMS for critical system alerts</p>
              </div>
              <Switch 
                checked={smsAlerts} 
                onCheckedChange={setSmsAlerts}
              />
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Alert Thresholds</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm">High CPU Usage (%)</label>
                  <Input defaultValue="80" type="number" className="mt-1" />
                </div>
                <div>
                  <label className="text-sm">Low Disk Space (%)</label>
                  <Input defaultValue="20" type="number" className="mt-1" />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield size={20} />
            Security Settings
          </CardTitle>
          <CardDescription>Configure security policies and authentication</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Two-Factor Authentication</h4>
                <p className="text-sm text-gray-500">Require 2FA for admin accounts</p>
              </div>
              <Badge className="bg-green-100 text-green-700">Enabled</Badge>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Password Policy</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm">Minimum Password Length</label>
                  <Input defaultValue="8" type="number" className="mt-1" />
                </div>
                <div>
                  <label className="text-sm">Password Expiry (days)</label>
                  <Input defaultValue="90" type="number" className="mt-1" />
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">API Security</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Rate Limiting</span>
                  <Badge className="bg-green-100 text-green-700">Active</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">IP Whitelisting</span>
                  <Badge className="bg-yellow-100 text-yellow-700">Optional</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Maintenance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap size={20} />
            System Maintenance
          </CardTitle>
          <CardDescription>Manage system backups and maintenance operations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Maintenance Mode</h4>
                <p className="text-sm text-gray-500">Put system in maintenance mode</p>
              </div>
              <Switch 
                checked={maintenanceMode} 
                onCheckedChange={setMaintenanceMode}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Automatic Backups</h4>
                <p className="text-sm text-gray-500">Daily database backups</p>
              </div>
              <Switch 
                checked={autoBackup} 
                onCheckedChange={setAutoBackup}
              />
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Manual Operations</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="flex items-center gap-2">
                  <Database size={16} />
                  Backup Database
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <Server size={16} />
                  Clear Cache
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <Globe size={16} />
                  Update System
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Settings */}
      <div className="flex justify-end gap-4">
        <Button variant="outline">Reset to Defaults</Button>
        <Button>Save All Settings</Button>
      </div>
    </div>
  );
};

export default SystemSettings;
