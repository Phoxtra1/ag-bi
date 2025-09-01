
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Bot, Save, TestTube } from 'lucide-react';
import { getChatbaseConfig, setChatbaseConfig, sendMessageToChatbase } from '@/lib/chatbaseApi';
import { getOdenehoSettings, setOdenehoSettings } from '@/lib/odenehoSettings';
import { toast } from 'sonner';

const ConfigureOdenehoAI = () => {
  const [chatbaseConfig, setChatbaseConfigState] = useState(getChatbaseConfig());
  const [odenehoSettings, setOdenehoSettingsState] = useState(getOdenehoSettings());
  const [testMessage, setTestMessage] = useState('Hello, how are you?');
  const [testing, setTesting] = useState(false);

  const handleChatbaseSave = () => {
    setChatbaseConfig(chatbaseConfig);
    toast.success('Chatbase configuration saved successfully!');
  };

  const handleOdenehoSave = () => {
    setOdenehoSettings(odenehoSettings);
    toast.success('Odeneho AI settings saved successfully!');
  };

  const handleTestChatbase = async () => {
    if (!chatbaseConfig.enabled) {
      toast.error('Please enable Chatbase first');
      return;
    }

    setTesting(true);
    try {
      const response = await sendMessageToChatbase(testMessage);
      toast.success('Test successful! Response: ' + response.substring(0, 100) + '...');
    } catch (error) {
      toast.error('Test failed: ' + (error as Error).message);
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="w-6 h-6 text-blue-600" />
            Configure Odeneho AI - Chatbase Integration
          </CardTitle>
          <CardDescription>
            Configure Chatbase API to power Odeneho AI with external engine
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              checked={chatbaseConfig.enabled}
              onCheckedChange={(enabled) => 
                setChatbaseConfigState(prev => ({ ...prev, enabled }))
              }
            />
            <Label>Enable Chatbase API</Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="apiKey">Chatbase API Key</Label>
            <Input
              id="apiKey"
              type="password"
              value={chatbaseConfig.apiKey}
              onChange={(e) => 
                setChatbaseConfigState(prev => ({ ...prev, apiKey: e.target.value }))
              }
              placeholder="Enter your Chatbase API key"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="chatbotId">Chatbot ID</Label>
            <Input
              id="chatbotId"
              value={chatbaseConfig.chatbotId}
              onChange={(e) => 
                setChatbaseConfigState(prev => ({ ...prev, chatbotId: e.target.value }))
              }
              placeholder="Enter your Chatbot ID"
            />
          </div>

          <div className="flex gap-2">
            <Button onClick={handleChatbaseSave} className="flex items-center gap-2">
              <Save className="w-4 h-4" />
              Save Configuration
            </Button>
            
            <Button 
              variant="outline" 
              onClick={handleTestChatbase}
              disabled={testing || !chatbaseConfig.enabled}
              className="flex items-center gap-2"
            >
              <TestTube className="w-4 h-4" />
              {testing ? 'Testing...' : 'Test API'}
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="testMessage">Test Message</Label>
            <Input
              id="testMessage"
              value={testMessage}
              onChange={(e) => setTestMessage(e.target.value)}
              placeholder="Enter a test message"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Odeneho AI General Settings</CardTitle>
          <CardDescription>
            Configure general behavior and appearance of Odeneho AI
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              checked={odenehoSettings.primary ?? true}
              onCheckedChange={(primary) => 
                setOdenehoSettingsState(prev => ({ ...prev, primary }))
              }
            />
            <Label>Set as Primary AI Engine</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              checked={odenehoSettings.autoOpen ?? false}
              onCheckedChange={(autoOpen) => 
                setOdenehoSettingsState(prev => ({ ...prev, autoOpen }))
              }
            />
            <Label>Auto-open chat widget</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              checked={odenehoSettings.typingAnimation ?? true}
              onCheckedChange={(typingAnimation) => 
                setOdenehoSettingsState(prev => ({ ...prev, typingAnimation }))
              }
            />
            <Label>Enable typing animation</Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="greeting">Custom Greeting Message</Label>
            <Textarea
              id="greeting"
              value={odenehoSettings.greeting || ''}
              onChange={(e) => 
                setOdenehoSettingsState(prev => ({ ...prev, greeting: e.target.value }))
              }
              placeholder="Enter custom greeting message"
              rows={3}
            />
          </div>

          <Button onClick={handleOdenehoSave} className="flex items-center gap-2">
            <Save className="w-4 h-4" />
            Save Settings
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConfigureOdenehoAI;
