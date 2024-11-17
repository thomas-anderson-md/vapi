import React, { useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { LogOut } from 'lucide-react';

export default function Dashboard({ user }: { user: any }) {
  const cleanupRef = useRef<(() => void) | null>(null);
  const vapiInstanceRef = useRef<any>(null);

  useEffect(() => {
    const scriptId = 'vapi-widget';

    const initVapi = () => {
      if (!document.getElementById(scriptId)) {
        const script = document.createElement('script');
        script.id = scriptId;
        script.src = "https://cdn.jsdelivr.net/gh/VapiAI/html-script-tag@latest/dist/assets/index.js";
        script.defer = true;
        script.async = true;
        
        script.onload = () => {
          try {
            const instance = window.vapiSDK.run({
              apiKey: "d7fac2de-6470-4f4e-aeac-36b4fad12e67",
              assistant: "6998b41e-1936-4476-9048-5d6b997de059",
              config: {
                onEnd: () => {
                  const elements = document.querySelectorAll('[id^="vapi-"]');
                  elements.forEach(el => el.remove());
                  initVapi();
                }
              }
            });

            vapiInstanceRef.current = instance;
            
            instance.on('call-end', () => {
              console.log('Call has stopped');
            });
          } catch (error) {
            console.error('Failed to initialize Vapi:', error);
          }
        };
        
        document.body.appendChild(script);
      }
    };

    const cleanup = async () => {
      try {
        // Stop any active recording
        if (vapiInstanceRef.current?.stopRecording) {
          await vapiInstanceRef.current.stopRecording();
        }

        // Trigger call-end event
        if (vapiInstanceRef.current?.emit) {
          vapiInstanceRef.current.emit('call-end');
        }

        // Remove all Vapi elements
        const elements = document.querySelectorAll('[id^="vapi-"]');
        elements.forEach(el => el.remove());
        
        // Remove the script
        const script = document.getElementById(scriptId);
        if (script) {
          script.remove();
        }

        // Cleanup the instance
        if (vapiInstanceRef.current?.destroy) {
          vapiInstanceRef.current.destroy();
        }
        vapiInstanceRef.current = null;

        // Release microphone
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(track => track.stop());
      } catch (error) {
        console.error('Error during cleanup:', error);
      }
    };

    initVapi();
    cleanupRef.current = cleanup;
    return cleanup;
  }, []);

  const handleLogout = async () => {
    if (cleanupRef.current) {
      await cleanupRef.current();
    }
    await supabase.auth.signOut();
  };

  return (
    <div className="w-full">
      <div className="fixed top-4 right-4">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-200"
        >
          <LogOut className="h-5 w-5" />
          Sign Out
        </button>
      </div>
    </div>
  );
}