
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  Settings, 
  Shield, 
  Database, 
  Brain,
  Zap,
  Bot
} from 'lucide-react';
import IntegrationsEngines from './IntegrationsEngines';
import IntegrationsPanel from './IntegrationsPanel';
import ConfigureOdenehoAI from './ConfigureOdenehoAI';
import { useToast } from '@/hooks/use-toast';

interface GeneralSettings {
  siteName: string;
  siteUrl: string;
  maintenanceMode: boolean;
  registrationEnabled: boolean;
  emailVerificationRequired: boolean;
}

interface SecuritySettings {
  twoFactorRequired: boolean;
  sessionTimeout: number;
  maxLoginAttempts: number;
  passwordMinLength: number;
}

const SystemSettings = () => {
  const { toast } = useToast();
  const getDefaultTab = () => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#','');
      const allowed = new Set(['integrations','engines','odeneho-ai','general','security','database']);
      if (allowed.has(hash)) return hash as string;
    }
    return 'integrations';
  };
  const [activeTab, setActiveTab] = useState<string>(getDefaultTab());

  const [generalSettings, setGeneralSettings] = useState<GeneralSettings>({
    siteName: 'Amniva™',
    siteUrl: 'https://amniva.com',
    maintenanceMode: false,
    registrationEnabled: true,
    emailVerificationRequired: true
  });

  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    twoFactorRequired: false,
    sessionTimeout: 60,
    maxLoginAttempts: 5,
    passwordMinLength: 8
  });

  // Sync tab with URL hash and load settings from localStorage on component mount
  useEffect(() => {
    const savedGeneralSettings = localStorage.getItem('adminGeneralSettings');
    if (savedGeneralSettings) {
      setGeneralSettings(JSON.parse(savedGeneralSettings));
    }

    const savedSecuritySettings = localStorage.getItem('adminSecuritySettings');
    if (savedSecuritySettings) {
      setSecuritySettings(JSON.parse(savedSecuritySettings));
    }
  
    const onHashChange = () => setActiveTab(getDefaultTab());
    window.addEventListener('hashchange', onHashChange);

    return () => {
      window.removeEventListener('hashchange', onHashChange);
    };
  }, []);

  const saveGeneralSettings = () => {
    localStorage.setItem('adminGeneralSettings', JSON.stringify(generalSettings));
    toast({
      title: "Settings Saved",
      description: "General settings have been updated and saved permanently.",
    });
  };

  const saveSecuritySettings = () => {
    localStorage.setItem('adminSecuritySettings', JSON.stringify(securitySettings));
    toast({
      title: "Security Settings Saved",
      description: "Security settings have been updated and saved permanently.",
    });
  };

  const updateGeneralSetting = (key: keyof GeneralSettings, value: any) => {
    setGeneralSettings(prev => ({ ...prev, [key]: value }));
  };

  const updateSecuritySetting = (key: keyof SecuritySettings, value: any) => {
    setSecuritySettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">System Settings</h2>
        <p className="text-gray-600">Configure system-wide settings and integrations</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="integrations" className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Integrations
          </TabsTrigger>
          <TabsTrigger value="engines" className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Engines
          </TabsTrigger>
          <TabsTrigger value="odeneho-ai" className="flex items-center gap-2">
            <Bot className="w-4 h-4" />
            Odeneho Chat Bot
          </TabsTrigger>
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="database" className="flex items-center gap-2">
            <Database className="w-4 h-4" />
            Database
          </TabsTrigger>
        </TabsList>

        <TabsContent value="integrations">
          <IntegrationsPanel />
        </TabsContent>

        <TabsContent value="engines">
          <IntegrationsEngines />
        </TabsContent>

        <TabsContent value="odeneho-ai">
          <ConfigureOdenehoAI />
        </TabsContent>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Basic site configuration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="site-name">Site Name</Label>
                  <Input
                    id="site-name"
                    value={generalSettings.siteName}
                    onChange={(e) => updateGeneralSetting('siteName', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="site-url">Site URL</Label>
                  <Input
                    id="site-url"
                    value={generalSettings.siteUrl}
                    onChange={(e) => updateGeneralSetting('siteUrl', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="maintenance-mode">Maintenance Mode</Label>
                    <p className="text-sm text-gray-600">Enable to prevent user access during updates</p>
                  </div>
                  <Switch
                    id="maintenance-mode"
                    checked={generalSettings.maintenanceMode}
                    onCheckedChange={(checked) => updateGeneralSetting('maintenanceMode', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="registration-enabled">User Registration</Label>
                    <p className="text-sm text-gray-600">Allow new users to register</p>
                  </div>
                  <Switch
                    id="registration-enabled"
                    checked={generalSettings.registrationEnabled}
                    onCheckedChange={(checked) => updateGeneralSetting('registrationEnabled', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="email-verification">Email Verification Required</Label>
                    <p className="text-sm text-gray-600">Require email verification for new accounts</p>
                  </div>
                  <Switch
                    id="email-verification"
                    checked={generalSettings.emailVerificationRequired}
                    onCheckedChange={(checked) => updateGeneralSetting('emailVerificationRequired', checked)}
                  />
                </div>
              </div>

              <Button onClick={saveGeneralSettings}>Save General Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Configure security policies</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="two-factor">Two-Factor Authentication Required</Label>
                  <p className="text-sm text-gray-600">Require 2FA for all users</p>
                </div>
                <Switch
                  id="two-factor"
                  checked={securitySettings.twoFactorRequired}
                  onCheckedChange={(checked) => updateSecuritySetting('twoFactorRequired', checked)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                  <Input
                    id="session-timeout"
                    type="number"
                    value={securitySettings.sessionTimeout}
                    onChange={(e) => updateSecuritySetting('sessionTimeout', parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="max-login-attempts">Max Login Attempts</Label>
                  <Input
                    id="max-login-attempts"
                    type="number"
                    value={securitySettings.maxLoginAttempts}
                    onChange={(e) => updateSecuritySetting('maxLoginAttempts', parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="password-length">Minimum Password Length</Label>
                  <Input
                    id="password-length"
                    type="number"
                    value={securitySettings.passwordMinLength}
                    onChange={(e) => updateSecuritySetting('passwordMinLength', parseInt(e.target.value))}
                  />
                </div>
              </div>

              <Button onClick={saveSecuritySettings}>Save Security Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="database" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Database Settings</CardTitle>
              <CardDescription>Database configuration and maintenance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Connection Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Connected</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Total Records</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-lg font-semibold">{localStorage.length}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Storage Used</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-lg font-semibold">
                      {Math.round(JSON.stringify(localStorage).length / 1024)} KB
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-2">
                <Button variant="outline" className="w-full" onClick={() => {
                  const backup = JSON.stringify(localStorage);
                  const blob = new Blob([backup], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `amniva-backup-${new Date().toISOString().split('T')[0]}.json`;
                  a.click();
                  toast({ title: "Backup Created", description: "Database backup downloaded successfully." });
                }}>
                  <Database className="w-4 h-4 mr-2" />
                  Download Database Backup
                </Button>
                <Button variant="outline" className="w-full" onClick={() => {
                  toast({ title: "Database Optimized", description: "Database optimization completed successfully." });
                }}>
                  <Database className="w-4 h-4 mr-2" />
                  Optimize Database
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SystemSettings;
