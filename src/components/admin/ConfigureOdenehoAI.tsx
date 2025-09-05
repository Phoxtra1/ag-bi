
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Bot, Save, TestTube, Mic, Volume2 } from 'lucide-react';
import { getChatbaseConfig, setChatbaseConfig, sendMessageToChatbase } from '@/lib/chatbaseApi';
import { getOdenehoSettings, setOdenehoSettings } from '@/lib/odenehoSettings';
import { getOdenehoVoiceConfig, setOdenehoVoiceConfig } from '@/lib/odenehoVoiceConfig';
import { toast } from 'sonner';

const ConfigureOdenehoAI = () => {
  const [chatbaseConfig, setChatbaseConfigState] = useState(getChatbaseConfig());
  const [odenehoSettings, setOdenehoSettingsState] = useState(getOdenehoSettings());
  const [voiceConfig, setVoiceConfigState] = useState(getOdenehoVoiceConfig());
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

  const handleVoiceSave = () => {
    setOdenehoVoiceConfig(voiceConfig);
    toast.success('Voice configuration saved successfully!');
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
      {/* External API Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="w-6 h-6 text-blue-600" />
            External API Configuration
          </CardTitle>
          <CardDescription>
            Configure external Chatbase API and custom endpoints for Odeneho AI
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
            <Label>Activate Chatbase API</Label>
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

          <div className="space-y-2">
            <Label htmlFor="externalApiUrl">External API URL (Odeneho)</Label>
            <Input
              id="externalApiUrl"
              type="url"
              value={(chatbaseConfig as any).externalApiUrl || ''}
              onChange={(e) => 
                setChatbaseConfigState(prev => ({ ...prev, externalApiUrl: e.target.value }))
              }
              placeholder="https://api.your-odeneho-bot.com/v1/chat"
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

      {/* Voice & STT/TTS Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Volume2 className="w-6 h-6 text-green-600" />
            Voice & Streaming Configuration
          </CardTitle>
          <CardDescription>
            Configure ElevenLabs STT/TTS streaming for real-time voice interaction
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              checked={voiceConfig.enabled}
              onCheckedChange={(enabled) => 
                setVoiceConfigState(prev => ({ ...prev, enabled }))
              }
            />
            <Label>Enable Voice Capabilities</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              checked={voiceConfig.streaming}
              onCheckedChange={(streaming) => 
                setVoiceConfigState(prev => ({ ...prev, streaming }))
              }
            />
            <Label>Enable Streaming Mode (STT/TTS)</Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="elevenApiKey">ElevenLabs API Key</Label>
            <Input
              id="elevenApiKey"
              type="password"
              value={voiceConfig.elevenApiKey || ''}
              onChange={(e) => 
                setVoiceConfigState(prev => ({ ...prev, elevenApiKey: e.target.value }))
              }
              placeholder="Enter your ElevenLabs API key (XI_API_KEY)"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="agentId">ElevenLabs Agent ID (Optional)</Label>
            <Input
              id="agentId"
              value={voiceConfig.agentId || ''}
              onChange={(e) => 
                setVoiceConfigState(prev => ({ ...prev, agentId: e.target.value }))
              }
              placeholder="Enter ElevenLabs Conversational AI Agent ID"
            />
          </div>

          <Button onClick={handleVoiceSave} className="flex items-center gap-2">
            <Save className="w-4 h-4" />
            Save Voice Configuration
          </Button>
        </CardContent>
      </Card>

      {/* General AI Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Internal AI Configuration</CardTitle>
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
