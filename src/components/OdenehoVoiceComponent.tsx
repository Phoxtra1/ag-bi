import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, VolumeX } from "lucide-react";
import { getOdenehoVoiceConfig } from "@/lib/odenehoVoiceConfig";
import { toast } from "sonner";
import { useConversation } from "@11labs/react";

const OdenehoVoiceComponent = () => {
  const [voiceConfig, setVoiceConfig] = useState(getOdenehoVoiceConfig());
  const [isListening, setIsListening] = useState(false);

  const conversation = useConversation({
    onConnect: () => {
      console.log("✅ Odeneho Voice connected to ElevenLabs");
      toast.success("Voice chat connected");
    },
    onDisconnect: () => {
      console.log("❌ Odeneho Voice disconnected");
      setIsListening(false);
      toast("Voice chat ended");
    },
    onMessage: (message) => {
      console.log("📩 Odeneho Voice message:", message);
      if (message.type === "response.audio") {
        console.log("🔊 AI is speaking...");
      }
    },
    onError: (error) => {
      console.error("⚠️ Odeneho Voice error:", error);
      toast.error("Voice error", { description: String(error) });
    },
  });

  // Refresh config when updated in admin
  useEffect(() => {
    const handleVoiceConfigUpdate = () => {
      setVoiceConfig(getOdenehoVoiceConfig());
    };
    window.addEventListener("odenehoVoiceConfigUpdated", handleVoiceConfigUpdate);
    return () => {
      window.removeEventListener("odenehoVoiceConfigUpdated", handleVoiceConfigUpdate);
    };
  }, []);

  const startVoiceMode = async () => {
    if (!voiceConfig.agentId || !voiceConfig.elevenApiKey) {
      toast.error("Voice not configured", {
        description:
          "Add ElevenLabs API Key and Agent ID in System Settings → Odeneho Chat Bot.",
      });
      try {
        window.open("/admin#odeneho-ai", "_self");
      } catch {}
      return;
    }

    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });

      const response = await fetch(
        `https://api.elevenlabs.io/v1/convai/conversation/get_signed_url?agent_id=${voiceConfig.agentId}`,
        {
          method: "GET",
          headers: { "xi-api-key": voiceConfig.elevenApiKey },
        }
      );

      if (!response.ok) throw new Error(`Failed to get signed URL: ${response.status}`);
      const data = await response.json();

      await conversation.startSession({ signedUrl: data.signed_url });

      setIsListening(true);
      toast.success("Voice mode started");
    } catch (error) {
      console.error("❌ Failed to start voice mode:", error);
      toast.error("Failed to start voice mode", { description: String(error) });
    }
  };

  const stopVoiceMode = async () => {
    try {
      if (conversation.status === "connected") {
        await conversation.endSession();
      }
      setIsListening(false);
      toast("Voice mode ended");
    } catch (err) {
      console.error("Error stopping voice mode:", err);
    }
  };

  const toggleMute = async () => {
    try {
      if (isListening) {
        await conversation.muteMic();
        setIsListening(false);
      } else {
        await conversation.unmuteMic();
        setIsListening(true);
      }
    } catch (err) {
      console.error("Mic toggle failed:", err);
    }
  };

  // --- RENDER ---
  return (
    <div className="fixed bottom-24 right-6 z-50">
      {conversation.status !== "connected" ? (
        <Button
          onClick={startVoiceMode}
          className="h-12 w-12 rounded-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg"
          title="Start Voice Chat"
        >
          <Mic className="w-6 h-6 text-white" />
        </Button>
      ) : (
        <div className="flex flex-col gap-2">
          {/* Mic Toggle */}
          <Button
            onClick={toggleMute}
            className={`h-12 w-12 rounded-full shadow-lg ${
              isListening
                ? "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 animate-pulse"
                : "bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800"
            }`}
            title={isListening ? "Mute Microphone" : "Unmute Microphone"}
          >
            {isListening ? (
              <Mic className="w-6 h-6 text-white" />
            ) : (
              <MicOff className="w-6 h-6 text-white" />
            )}
          </Button>

          {/* End Session */}
          <Button
            onClick={stopVoiceMode}
            variant="outline"
            className="h-10 w-12 rounded-full shadow-lg"
            title="End Voice Chat"
          >
            <VolumeX className="w-5 h-5" />
          </Button>

          {/* Speaking Indicator */}
          {conversation.isSpeaking && (
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-blue-500 rounded-full animate-pulse" />
          )}
        </div>
      )}
    </div>
  );
};

export default OdenehoVoiceComponent;
