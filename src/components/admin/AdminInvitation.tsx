
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  UserPlus, 
  Shield, 
  ShieldCheck, 
  Clock, 
  Ban, 
  Eye,
  Settings,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import InviteAdminModal from './InviteAdminModal';
import UserRoleManagement from './UserRoleManagement';
import { useToast } from '@/hooks/use-toast';

const AdminInvitation: React.FC = () => {
  const { toast } = useToast();
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [invitations, setInvitations] = useState<any[]>([]);

  const [admins, setAdmins] = useState<any[]>([]);

  const handleSendInvitation = (inviteData: { email: string; permissions: string[] }) => {
    const newInvitation = {
      id: Date.now(),
      email: inviteData.email,
      status: 'pending',
      sentDate: new Date().toISOString().split('T')[0],
      expiresAt: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString().split('T')[0],
      role: 'supportive',
      permissions: inviteData.permissions
    };

    setInvitations(prev => [...prev, newInvitation]);
    toast({
      title: "Invitation Sent",
      description: `Admin invitation sent to ${inviteData.email}`,
    });
  };

  const handleRevokeInvitation = (invitationId: number) => {
    setInvitations(prev => prev.filter(inv => inv.id !== invitationId));
    toast({
      title: "Invitation Revoked",
      description: "The invitation has been revoked successfully.",
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-700', icon: Clock },
      accepted: { color: 'bg-green-100 text-green-700', icon: CheckCircle },
      expired: { color: 'bg-red-100 text-red-700', icon: AlertTriangle }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config?.icon || Clock;
    
    return (
      <Badge className={config?.color || 'bg-gray-100 text-gray-700'}>
        <Icon className="w-3 h-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getRoleBadge = (role: string) => {
    return role === 'owner' ? (
      <Badge className="bg-blue-100 text-blue-700">
        <ShieldCheck className="w-3 h-3 mr-1" />
        Owner
      </Badge>
    ) : (
      <Badge className="bg-gray-100 text-gray-700">
        <Shield className="w-3 h-3 mr-1" />
        Supportive
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Admin Management</h2>
          <p className="text-gray-600">Manage admin invitations and permissions</p>
        </div>
        <Button onClick={() => setShowInviteModal(true)} className="flex items-center gap-2">
          <UserPlus className="w-4 h-4" />
          Invite Admin
        </Button>
      </div>

      {/* Current Admins */}
      <Card>
        <CardHeader>
          <CardTitle>Current Administrators</CardTitle>
          <CardDescription>Manage existing admin accounts and permissions</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Admin</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {admins.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6 text-gray-500">
                    No administrators yet
                  </TableCell>
                </TableRow>
              ) : (
                admins.map((admin) => (
                  <TableRow key={admin.id}>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{admin.name}</span>
                        <span className="text-sm text-gray-500">{admin.email}</span>
                      </div>
                    </TableCell>
                    <TableCell>{getRoleBadge(admin.role)}</TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-700">
                        {admin.status.charAt(0).toUpperCase() + admin.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">{admin.lastLogin}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {admin.role !== 'owner' && (
                          <>
                            <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                              <Settings className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                            >
                              <Ban className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pending Invitations */}
      <Card>
        <CardHeader>
          <CardTitle>Pending Invitations</CardTitle>
          <CardDescription>Track and manage admin invitations</CardDescription>
        </CardHeader>
        <CardContent>
          {invitations.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No pending invitations
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Sent Date</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invitations.map((invitation) => (
                  <TableRow key={invitation.id}>
                    <TableCell className="font-medium">{invitation.email}</TableCell>
                    <TableCell>{getStatusBadge(invitation.status)}</TableCell>
                    <TableCell className="text-sm">{invitation.sentDate}</TableCell>
                    <TableCell className="text-sm">{invitation.expiresAt}</TableCell>
                    <TableCell>
                      {invitation.status === 'pending' && (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleRevokeInvitation(invitation.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          Revoke
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Role Management Component */}
      <UserRoleManagement admins={admins} setAdmins={setAdmins} />

      {/* Invite Modal */}
      <InviteAdminModal 
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        onSendInvitation={handleSendInvitation}
      />
    </div>
  );
};

export default AdminInvitation;
