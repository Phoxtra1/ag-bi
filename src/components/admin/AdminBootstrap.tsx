import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Loader2, Shield, CheckCircle, XCircle, AlertTriangle, Copy, RefreshCw } from "lucide-react";
import { account, databases, DATABASE_ID } from "@/lib/appwrite";
import { USER_ROLES_COLLECTION_ID } from "@/lib/adminAuth";
import { Query, ID } from "appwrite";
import { useToast } from "@/hooks/use-toast";

interface DiagnosticResult {
  check: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
  details?: string;
}

export default function AdminBootstrap() {
  const [isLoading, setIsLoading] = useState(false);
  const [isBootstrapping, setIsBootstrapping] = useState(false);
  const [diagnostics, setDiagnostics] = useState<DiagnosticResult[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [hasAdminRole, setHasAdminRole] = useState<boolean | null>(null);
  const [existingRoleDoc, setExistingRoleDoc] = useState<any>(null);
  const { toast } = useToast();

  const designatedAdminEmail = String(import.meta.env.VITE_ADMIN_EMAIL || '').trim().toLowerCase();

  const runDiagnostics = async () => {
    setIsLoading(true);
    setDiagnostics([]);
    const results: DiagnosticResult[] = [];

    try {
      // Check 1: User session
      let user = null;
      try {
        user = await account.get();
        setCurrentUser(user);
        results.push({
          check: 'User Session',
          status: 'pass',
          message: `Logged in as ${user.email}`,
          details: `User ID: ${user.$id}`
        });
      } catch (error: any) {
        results.push({
          check: 'User Session',
          status: 'fail',
          message: 'No active session',
          details: error.message
        });
        setDiagnostics(results);
        setIsLoading(false);
        return;
      }

      // Check 2: Designated admin email match
      if (designatedAdminEmail) {
        if (user.email.toLowerCase() === designatedAdminEmail) {
          results.push({
            check: 'Designated Admin Email',
            status: 'pass',
            message: 'Email matches VITE_ADMIN_EMAIL',
            details: designatedAdminEmail
          });
        } else {
          results.push({
            check: 'Designated Admin Email',
            status: 'warning',
            message: 'Email does not match VITE_ADMIN_EMAIL',
            details: `Expected: ${designatedAdminEmail}, Got: ${user.email}`
          });
        }
      } else {
        results.push({
          check: 'Designated Admin Email',
          status: 'warning',
          message: 'VITE_ADMIN_EMAIL not set in .env',
          details: 'Set this to designate the primary admin email'
        });
      }

      // Check 3: Database connection
      try {
        // Try to list from user_roles collection
        const rolesResponse = await databases.listDocuments(
          DATABASE_ID,
          USER_ROLES_COLLECTION_ID,
          [Query.equal('user_id', user.$id)]
        );
        
        if (rolesResponse.documents.length > 0) {
          const roleDoc = rolesResponse.documents[0];
          setExistingRoleDoc(roleDoc);
          const role = roleDoc.role;
          setHasAdminRole(role === 'admin');
          
          results.push({
            check: 'User Roles Collection',
            status: 'pass',
            message: `Collection readable. Found role: ${role}`,
            details: `Document ID: ${roleDoc.$id}`
          });
          
          if (role === 'admin') {
            results.push({
              check: 'Admin Role',
              status: 'pass',
              message: 'User has admin role!',
              details: 'You should be able to access /admin'
            });
          } else {
            results.push({
              check: 'Admin Role',
              status: 'warning',
              message: `User has "${role}" role, not "admin"`,
              details: 'Update the role field to "admin" in Appwrite'
            });
          }
        } else {
          setHasAdminRole(false);
          setExistingRoleDoc(null);
          results.push({
            check: 'User Roles Collection',
            status: 'warning',
            message: 'Collection readable but no role document found for this user',
            details: 'Use the Bootstrap button below to create one'
          });
        }
      } catch (error: any) {
        setHasAdminRole(false);
        results.push({
          check: 'User Roles Collection',
          status: 'fail',
          message: 'Cannot read user_roles collection',
          details: `Error: ${error.message}. Check collection permissions in Appwrite Console.`
        });
      }

      // Check 4: Can create documents (test write permission)
      results.push({
        check: 'Write Permission',
        status: 'warning',
        message: 'Write permission will be tested during bootstrap',
        details: 'Ensure "users" role has create/update permission on user_roles collection'
      });

    } catch (error: any) {
      results.push({
        check: 'General Error',
        status: 'fail',
        message: 'Diagnostic failed',
        details: error.message
      });
    }

    setDiagnostics(results);
    setIsLoading(false);
  };

  const bootstrapAdmin = async () => {
    if (!currentUser) {
      toast({
        title: "Not Logged In",
        description: "Please log in first",
        variant: "destructive"
      });
      return;
    }

    // Security check: only allow if email matches designated admin
    if (designatedAdminEmail && currentUser.email.toLowerCase() !== designatedAdminEmail) {
      toast({
        title: "Unauthorized",
        description: "Only the designated admin email can bootstrap. Check VITE_ADMIN_EMAIL.",
        variant: "destructive"
      });
      return;
    }

    setIsBootstrapping(true);

    try {
      if (existingRoleDoc) {
        // Update existing document
        await databases.updateDocument(
          DATABASE_ID,
          USER_ROLES_COLLECTION_ID,
          existingRoleDoc.$id,
          { role: 'admin' }
        );
        toast({
          title: "Admin Role Updated!",
          description: "Your role has been updated to admin. Refresh and try logging in again.",
        });
      } else {
        // Create new document
        await databases.createDocument(
          DATABASE_ID,
          USER_ROLES_COLLECTION_ID,
          ID.unique(),
          {
            user_id: currentUser.$id,
            role: 'admin'
          }
        );
        toast({
          title: "Admin Role Created!",
          description: "You now have admin privileges. Refresh and try logging in again.",
        });
      }

      // Re-run diagnostics
      await runDiagnostics();
    } catch (error: any) {
      console.error('Bootstrap error:', error);
      toast({
        title: "Bootstrap Failed",
        description: `Error: ${error.message}. Check collection permissions in Appwrite.`,
        variant: "destructive"
      });
    }

    setIsBootstrapping(false);
  };

  useEffect(() => {
    runDiagnostics();
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied!", description: "Text copied to clipboard" });
  };

  const getStatusIcon = (status: DiagnosticResult['status']) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'fail':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: DiagnosticResult['status']) => {
    switch (status) {
      case 'pass':
        return <Badge className="bg-green-100 text-green-800">Pass</Badge>;
      case 'fail':
        return <Badge variant="destructive">Fail</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-100 text-yellow-800">Warning</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-primary" />
              <div>
                <CardTitle>Admin Bootstrap Tool</CardTitle>
                <CardDescription>
                  Diagnose and fix admin role configuration issues
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button onClick={runDiagnostics} disabled={isLoading} variant="outline">
                {isLoading ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Running...</>
                ) : (
                  <><RefreshCw className="mr-2 h-4 w-4" /> Run Diagnostics</>
                )}
              </Button>
              
              {currentUser && hasAdminRole !== true && (
                <Button 
                  onClick={bootstrapAdmin} 
                  disabled={isBootstrapping || (!!designatedAdminEmail && currentUser?.email?.toLowerCase() !== designatedAdminEmail)}
                >
                  {isBootstrapping ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Bootstrapping...</>
                  ) : (
                    <><Shield className="mr-2 h-4 w-4" /> Bootstrap Admin Role</>
                  )}
                </Button>
              )}
            </div>

            {/* Current User Info */}
            {currentUser && (
              <Alert>
                <AlertTitle className="flex items-center gap-2">
                  Current User
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => copyToClipboard(currentUser.$id)}
                    className="h-6 px-2"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </AlertTitle>
                <AlertDescription className="mt-2 space-y-1">
                  <p><strong>Email:</strong> {currentUser.email}</p>
                  <p><strong>User ID:</strong> <code className="bg-muted px-1 rounded text-xs">{currentUser.$id}</code></p>
                  <p><strong>Name:</strong> {currentUser.name || 'Not set'}</p>
                </AlertDescription>
              </Alert>
            )}

            {/* Diagnostic Results */}
            <div className="space-y-3">
              <h3 className="font-semibold">Diagnostic Results</h3>
              {diagnostics.length === 0 && !isLoading && (
                <p className="text-muted-foreground">Click "Run Diagnostics" to check your setup</p>
              )}
              {diagnostics.map((result, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(result.status)}
                      <span className="font-medium">{result.check}</span>
                    </div>
                    {getStatusBadge(result.status)}
                  </div>
                  <p className="text-sm text-muted-foreground">{result.message}</p>
                  {result.details && (
                    <p className="text-xs bg-muted p-2 rounded font-mono">{result.details}</p>
                  )}
                </div>
              ))}
            </div>

            {/* Setup Instructions */}
            <Alert className="bg-blue-50 border-blue-200">
              <AlertTitle>Setup Checklist for Appwrite</AlertTitle>
              <AlertDescription className="mt-2 space-y-2 text-sm">
                <p><strong>1. Create user_roles collection</strong> with ID: <code className="bg-white px-1 rounded">user_roles</code></p>
                <p><strong>2. Add attributes:</strong></p>
                <ul className="list-disc list-inside ml-4">
                  <li><code>user_id</code> (String, required, 36 chars)</li>
                  <li><code>role</code> (String, required, 20 chars)</li>
                </ul>
                <p><strong>3. Set permissions:</strong></p>
                <ul className="list-disc list-inside ml-4">
                  <li>Read: <code>users</code> (so users can read their own role)</li>
                  <li>Create: <code>users</code> (for bootstrap, or only allow via server)</li>
                  <li>Update: <code>users</code> (optional)</li>
                </ul>
                <p><strong>4. Create index</strong> on <code>user_id</code> for faster queries</p>
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        <div className="text-center">
          <Button variant="link" onClick={() => window.location.href = '/login'}>
            ← Back to Login
          </Button>
        </div>
      </div>
    </div>
  );
}
