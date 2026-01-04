import React, { useState, useEffect } from 'react';
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
  CheckCircle,
  Copy,
  Loader2,
  Mail
} from 'lucide-react';
import InviteAdminModal from './InviteAdminModal';
import UserRoleManagement from './UserRoleManagement';
import { useToast } from '@/hooks/use-toast';
import { 
  createAdminInvitation, 
  getPendingInvitations, 
  revokeAdminInvitation,
  getAdminSetupUrl,
  AdminInvitation as InvitationType
} from '@/lib/adminAuth';

const AdminInvitation: React.FC = () => {
  const { toast } = useToast();
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [invitations, setInvitations] = useState<InvitationType[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const [admins, setAdmins] = useState<any[]>([]);

  // Load invitations from database
  useEffect(() => {
    loadInvitations();
  }, []);

  const loadInvitations = async () => {
    setLoading(true);
    const data = await getPendingInvitations();
    setInvitations(data);
    setLoading(false);
  };

  const handleSendInvitation = async (inviteData: { email: string; permissions: string[] }) => {
    setSending(true);
    
    const invitation = await createAdminInvitation(
      inviteData.email,
      inviteData.permissions,
      'supportive'
    );
    
    if (invitation) {
      // Generate setup URL
      const setupUrl = getAdminSetupUrl(invitation.token);
      
      setInvitations(prev => [invitation, ...prev]);
      
      toast({
        title: "Invitation Created",
        description: (
          <div className="space-y-2">
            <p>Admin invitation created for {inviteData.email}</p>
            <p className="text-xs text-muted-foreground">
              Copy the setup link and send it securely to the admin.
            </p>
          </div>
        ),
      });
      
      // Copy setup URL to clipboard
      try {
        await navigator.clipboard.writeText(setupUrl);
        toast({
          title: "Setup Link Copied",
          description: "The secure setup link has been copied to your clipboard.",
        });
      } catch {
        // Clipboard failed, show the URL
        console.log('Setup URL:', setupUrl);
      }
    } else {
      toast({
        title: "Invitation Failed",
        description: "Could not create invitation. Please try again.",
        variant: "destructive"
      });
    }
    
    setSending(false);
  };

  const handleRevokeInvitation = async (invitationId: string) => {
    const success = await revokeAdminInvitation(invitationId);
    
    if (success) {
      setInvitations(prev => prev.filter(inv => inv.$id !== invitationId));
      toast({
        title: "Invitation Revoked",
        description: "The invitation has been revoked successfully.",
      });
    } else {
      toast({
        title: "Revoke Failed",
        description: "Could not revoke invitation. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleCopySetupLink = async (token: string) => {
    const url = getAdminSetupUrl(token);
    try {
      await navigator.clipboard.writeText(url);
      toast({
        title: "Link Copied",
        description: "Setup link copied to clipboard.",
      });
    } catch {
      toast({
        title: "Copy Failed",
        description: "Could not copy link. Please try again.",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-700', icon: Clock },
      accepted: { color: 'bg-green-100 text-green-700', icon: CheckCircle },
      expired: { color: 'bg-red-100 text-red-700', icon: AlertTriangle },
      revoked: { color: 'bg-gray-100 text-gray-700', icon: Ban }
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
    return role === 'admin' ? (
      <Badge className="bg-blue-100 text-blue-700">
        <ShieldCheck className="w-3 h-3 mr-1" />
        Admin
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
          <p className="text-gray-600">Pre-provision admin accounts with secure setup links</p>
        </div>
        <Button onClick={() => setShowInviteModal(true)} className="flex items-center gap-2" disabled={sending}>
          {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
          Invite Admin
        </Button>
      </div>

      {/* Security Notice */}
      <Card className="bg-amber-50 border-amber-200">
        <CardContent className="pt-4">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-amber-600 mt-0.5" />
            <div>
              <p className="font-medium text-amber-800">Secure Admin Provisioning</p>
              <p className="text-sm text-amber-700">
                Admin accounts are pre-provisioned with designated emails. Invited admins receive a one-time 
                secure setup link to create their password. They cannot register through the public signup flow.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

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
                    No administrators yet. Send an invitation to add one.
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
          <CardDescription>Track and manage admin invitations with secure setup links</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <Loader2 className="w-6 h-6 animate-spin mx-auto text-gray-400" />
              <p className="text-sm text-gray-500 mt-2">Loading invitations...</p>
            </div>
          ) : invitations.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Mail className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No pending invitations</p>
              <p className="text-sm">Click "Invite Admin" to send a secure setup link</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invitations.map((invitation) => (
                  <TableRow key={invitation.$id}>
                    <TableCell className="font-medium">{invitation.email}</TableCell>
                    <TableCell>{getRoleBadge(invitation.role)}</TableCell>
                    <TableCell>{getStatusBadge(invitation.status)}</TableCell>
                    <TableCell className="text-sm">
                      {new Date(invitation.expires_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {invitation.status === 'pending' && (
                          <>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleCopySetupLink(invitation.token)}
                              className="h-8"
                            >
                              <Copy className="h-3 w-3 mr-1" />
                              Copy Link
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => handleRevokeInvitation(invitation.$id!)}
                              className="text-red-600 hover:text-red-700 h-8"
                            >
                              Revoke
                            </Button>
                          </>
                        )}
                      </div>
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
