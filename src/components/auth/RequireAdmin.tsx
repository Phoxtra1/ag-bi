import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getCurrentUser, getCurrentUserRole } from '@/lib/auth';

const RequireAdmin: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let mounted = true;
    
    const checkAdminRole = async () => {
      try {
        if (import.meta.env.DEV) {
          console.log('[RequireAdmin] Starting admin check...');
        }
        
        const user = await getCurrentUser();
        if (!mounted) return;
        
        if (!user) {
          if (import.meta.env.DEV) {
            console.log('[RequireAdmin] No user session found');
          }
          setIsAdmin(false);
          setLoading(false);
          return;
        }

        if (import.meta.env.DEV) {
          console.log('[RequireAdmin] User found:', user.$id);
        }

        // Check role in user_roles collection
        const role = await getCurrentUserRole(user.$id);
        
        if (!mounted) return;
        
        const hasAdminRole = role === 'admin';
        
        if (import.meta.env.DEV) {
          console.log('[RequireAdmin] Admin check result:', hasAdminRole);
        }
        
        setIsAdmin(hasAdminRole);
      } catch (error) {
        console.error('[RequireAdmin] Admin check error:', error);
        if (mounted) {
          setIsAdmin(false);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    checkAdminRole();
    
    return () => { mounted = false; };
  }, [location.pathname]);

  if (loading) {
    return (
      <div className="fixed inset-0 grid place-items-center bg-background/50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold text-foreground mb-2">Access Denied</h1>
          <p className="text-muted-foreground mb-4">You do not have permission to access this page.</p>
          <a href="/dashboard" className="text-primary hover:underline">
            Return to Dashboard
          </a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default RequireAdmin;

