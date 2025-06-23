
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';

interface InviteAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSendInvitation: (data: { email: string; permissions: string[] }) => void;
}

const InviteAdminModal: React.FC<InviteAdminModalProps> = ({
  isOpen,
  onClose,
  onSendInvitation
}) => {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  const availablePermissions = [
    { id: 'user_activities', label: 'User Activities Management', description: 'View and manage user activities (without totals)' },
    { id: 'content_moderation', label: 'Content Moderation', description: 'Moderate platform content and flagged reports' },
    { id: 'api_management', label: 'API Management', description: 'Manage API requests and documentation' },
    { id: 'integrations_use', label: 'System Integrations', description: 'Use system integrations (not install/remove)' },
    { id: 'notifications', label: 'Notifications', description: 'Access notifications and admin messages' },
    { id: 'helpdesk', label: 'Helpdesk Management', description: 'Edit and update helpdesk/FAQ sections' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter an email address",
        variant: "destructive"
      });
      return;
    }

    if (selectedPermissions.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one permission",
        variant: "destructive"
      });
      return;
    }

    onSendInvitation({ email, permissions: selectedPermissions });
    setEmail('');
    setSelectedPermissions([]);
    onClose();
  };

  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    if (checked) {
      setSelectedPermissions(prev => [...prev, permissionId]);
    } else {
      setSelectedPermissions(prev => prev.filter(id => id !== permissionId));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Invite Supportive Admin</DialogTitle>
          <DialogDescription>
            Send an invitation to join as a supportive administrator. The invitation will expire in 72 hours.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              required
            />
          </div>

          <div>
            <Label>Permissions</Label>
            <div className="space-y-3 mt-2">
              {availablePermissions.map((permission) => (
                <div key={permission.id} className="flex items-start space-x-3">
                  <Checkbox
                    id={permission.id}
                    checked={selectedPermissions.includes(permission.id)}
                    onCheckedChange={(checked) => 
                      handlePermissionChange(permission.id, checked as boolean)
                    }
                  />
                  <div className="grid gap-1.5 leading-none">
                    <Label htmlFor={permission.id} className="text-sm font-medium">
                      {permission.label}
                    </Label>
                    <p className="text-xs text-gray-500">
                      {permission.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Send Invitation
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default InviteAdminModal;
