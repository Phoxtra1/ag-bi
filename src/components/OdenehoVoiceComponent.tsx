import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { getOdenehoVoiceConfig } from '@/lib/odenehoVoiceConfig';
import { getResolvedOdenehoSettings } from '@/lib/odenehoSettings';
import { useConversation } from '@11labs/react';

const OdenehoVoiceComponent = () => {
  const [voiceConfig, setVoiceConfig] = useState(getOdenehoVoiceConfig());
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isVoiceModeActive, setIsVoiceModeActive] = useState(false);

  const conversation = useConversation({
    onConnect: () => {
      console.log('Odeneho Voice: Connected to ElevenLabs');
    },
    onDisconnect: () => {
      console.log('Odeneho Voice: Disconnected');
      setIsVoiceModeActive(false);
      setIsListening(false);
      setIsSpeaking(false);
    },
    onMessage: (message) => {
      console.log('Odeneho Voice Message:', message);
    },
    onError: (error) => {
      console.error('Odeneho Voice Error:', error);
    },
  });

  useEffect(() => {
    const handleVoiceConfigUpdate = () => {
      setVoiceConfig(getOdenehoVoiceConfig());
    };

    window.addEventListener('odenehoVoiceConfigUpdated', handleVoiceConfigUpdate);
    return () => {
      window.removeEventListener('odenehoVoiceConfigUpdated', handleVoiceConfigUpdate);
    };
  }, []);

  const startVoiceMode = async () => {
    if (!voiceConfig.enabled || !voiceConfig.elevenApiKey) {
      console.warn('Voice mode not configured');
      return;
    }

    try {
      // Request microphone access
      await navigator.mediaDevices.getUserMedia({ audio: true });
      
      if (voiceConfig.agentId) {
        // Use ElevenLabs Conversational AI if agent ID provided
        await conversation.startSession({ agentId: voiceConfig.agentId });
      } else {
        // Use custom implementation
        console.log('Starting custom voice mode');
      }
      
      setIsVoiceModeActive(true);
      setIsListening(true);
    } catch (error) {
      console.error('Failed to start voice mode:', error);
    }
  };

  const stopVoiceMode = async () => {
    if (conversation.status === 'connected') {
      await conversation.endSession();
    }
    setIsVoiceModeActive(false);
    setIsListening(false);
    setIsSpeaking(false);
  };

  const toggleMute = () => {
    setIsListening(!isListening);
  };

  if (!voiceConfig.enabled) {
    return null;
  }

  return (
    <div className="fixed bottom-24 right-6 z-50">
      {!isVoiceModeActive ? (
        <Button
          onClick={startVoiceMode}
          className="h-12 w-12 rounded-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg"
          title="Start Voice Chat"
        >
          <Mic className="w-6 h-6 text-white" />
        </Button>
      ) : (
        <div className="flex flex-col gap-2">
          <Button
            onClick={toggleMute}
            className={`h-12 w-12 rounded-full shadow-lg ${
              isListening 
                ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 animate-pulse' 
                : 'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800'
            }`}
            title={isListening ? "Mute Microphone" : "Unmute Microphone"}
          >
            {isListening ? <Mic className="w-6 h-6 text-white" /> : <MicOff className="w-6 h-6 text-white" />}
          </Button>
          
          <Button
            onClick={stopVoiceMode}
            variant="outline"
            className="h-10 w-12 rounded-full shadow-lg"
            title="End Voice Chat"
          >
            <VolumeX className="w-5 h-5" />
          </Button>
          
          {conversation.isSpeaking && (
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-blue-500 rounded-full animate-pulse" />
          )}
        </div>
      )}
    </div>
  );
};

export default OdenehoVoiceComponent;