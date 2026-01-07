import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getCurrentUser } from '@/lib/auth';
import { databases, DATABASE_ID } from '@/lib/appwrite';
import { Query } from 'appwrite';

const RequireAdmin: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const user = await getCurrentUser();
        if (!mounted || !user) {
          if (mounted) {
            setIsAdmin(false);
            setLoading(false);
          }
          return;
        }

        // Check if user has admin role in user_roles collection
        const response = await databases.listDocuments(
          DATABASE_ID,
          'user_roles',
          [Query.equal('user_id', user.$id), Query.equal('role', 'admin')]
        );

        if (!mounted) return;
        setIsAdmin(response.documents.length > 0);
      } catch (error) {
        console.error('Admin check error:', error);
        if (!mounted) return;
        setIsAdmin(false);
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [location.pathname]);

  if (loading) {
    return (
      <div className="fixed inset-0 grid place-items-center bg-background/50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2" />
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default RequireAdmin;
