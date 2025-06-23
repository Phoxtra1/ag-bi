
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Settings, 
  Shield, 
  Eye, 
  Clock,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Admin {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  lastLogin: string;
  joinedDate: string;
  permissions: string[];
}

interface UserRoleManagementProps {
  admins: Admin[];
  setAdmins: React.Dispatch<React.SetStateAction<Admin[]>>;
}

const UserRoleManagement: React.FC<UserRoleManagementProps> = ({ admins, setAdmins }) => {
  const { toast } = useToast();
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [showActivityModal, setShowActivityModal] = useState(false);

  const permissionLabels = {
    user_activities: 'User Activities Management',
    content_moderation: 'Content Moderation',
    api_management: 'API Management',
    integrations_use: 'System Integrations',
    notifications: 'Notifications',
    helpdesk: 'Helpdesk Management'
  };

  const mockActivityLogs = [
    { timestamp: '2024-01-20 14:30', action: 'Logged in', ip: '192.168.1.100' },
    { timestamp: '2024-01-20 13:45', action: 'Modified user permissions', ip: '192.168.1.100' },
    { timestamp: '2024-01-20 09:15', action: 'Reviewed content flags', ip: '192.168.1.100' },
    { timestamp: '2024-01-19 16:20', action: 'Updated API documentation', ip: '192.168.1.100' },
    { timestamp: '2024-01-19 11:30', action: 'Logged in', ip: '192.168.1.100' }
  ];

  const handlePermissionToggle = (adminId: number, permission: string, enabled: boolean) => {
    setAdmins(prev => prev.map(admin => {
      if (admin.id === adminId) {
        const newPermissions = enabled 
          ? [...admin.permissions, permission]
          : admin.permissions.filter(p => p !== permission);
        return { ...admin, permissions: newPermissions };
      }
      return admin;
    }));

    toast({
      title: "Permissions Updated",
      description: `${permission} access has been ${enabled ? 'granted' : 'revoked'}`,
    });
  };

  const openPermissionModal = (admin: Admin) => {
    setSelectedAdmin(admin);
    setShowPermissionModal(true);
  };

  const openActivityModal = (admin: Admin) => {
    setSelectedAdmin(admin);
    setShowActivityModal(true);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Role & Permission Management</CardTitle>
          <CardDescription>Configure access levels for supportive administrators</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {admins.filter(admin => admin.role === 'supportive').map((admin) => (
              <div key={admin.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div>
                      <h4 className="font-medium">{admin.name}</h4>
                      <p className="text-sm text-gray-500">{admin.email}</p>
                    </div>
                    <Badge className="bg-gray-100 text-gray-700">
                      <Shield className="w-3 h-3 mr-1" />
                      Supportive Admin
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => openPermissionModal(admin)}
                    >
                      <Settings className="w-4 h-4 mr-1" />
                      Permissions
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => openActivityModal(admin)}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Activity Logs
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {Object.entries(permissionLabels).map(([key, label]) => (
                    <div key={key} className="flex items-center justify-between p-2 border rounded">
                      <Label htmlFor={`${admin.id}-${key}`} className="text-xs">
                        {label}
                      </Label>
                      <Switch
                        id={`${admin.id}-${key}`}
                        checked={admin.permissions.includes(key)}
                        onCheckedChange={(checked) => handlePermissionToggle(admin.id, key, checked)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Permission Management Modal */}
      <Dialog open={showPermissionModal} onOpenChange={setShowPermissionModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Manage Permissions</DialogTitle>
            <DialogDescription>
              Configure access permissions for {selectedAdmin?.name}
            </DialogDescription>
          </DialogHeader>
          
          {selectedAdmin && (
            <div className="space-y-4">
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-yellow-600" />
                  <p className="text-sm text-yellow-800">
                    Supportive admins cannot access financial data, user totals, or owner-level settings.
                  </p>
                </div>
              </div>
              
              <div className="space-y-3">
                {Object.entries(permissionLabels).map(([key, label]) => (
                  <div key={key} className="flex items-center justify-between">
                    <Label htmlFor={`modal-${key}`} className="text-sm">
                      {label}
                    </Label>
                    <Switch
                      id={`modal-${key}`}
                      checked={selectedAdmin.permissions.includes(key)}
                      onCheckedChange={(checked) => handlePermissionToggle(selectedAdmin.id, key, checked)}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Activity Logs Modal */}
      <Dialog open={showActivityModal} onOpenChange={setShowActivityModal}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Activity Logs</DialogTitle>
            <DialogDescription>
              Recent activities for {selectedAdmin?.name}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {mockActivityLogs.map((log, index) => (
              <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                <div className="p-1 bg-blue-100 rounded">
                  <Clock className="w-3 h-3 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{log.action}</p>
                  <p className="text-xs text-gray-500">{log.timestamp} • IP: {log.ip}</p>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UserRoleManagement;
