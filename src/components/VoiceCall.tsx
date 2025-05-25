'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { startVoiceCall, endVoiceCall } from '@/lib/omnidim';

export function VoiceCall() {
  const [isCallActive, setIsCallActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const callStartTimeRef = useRef<number | null>(null);
  const callIdRef = useRef<string | null>(null);
  
  // WebRTC references
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const remoteStreamRef = useRef<MediaStream | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (isCallActive) {
        handleEndCall();
      }
    };
  }, [isCallActive]);

  // Format seconds to mm:ss
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const initializeWebRTC = async (rtcSessionId: string, iceServers: RTCIceServer[], answer: RTCSessionDescriptionInit) => {
    try {
      console.log('Initializing WebRTC connection...');
      
      // Get user media (microphone)
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: true,
        video: false 
      });
      localStreamRef.current = stream;
      
      // Create peer connection with the provided ICE servers
      const peerConnection = new RTCPeerConnection({ iceServers });
      peerConnectionRef.current = peerConnection;
      
      // Add local stream tracks to peer connection
      stream.getTracks().forEach(track => {
        peerConnection.addTrack(track, stream);
      });
      
      // Set up event handlers for the peer connection
      setupPeerConnectionEventHandlers(peerConnection);
      
      // Create and set local description (offer)
      const offer = await peerConnection.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: false
      });
      
      console.log('Created offer:', offer);
      await peerConnection.setLocalDescription(offer);
      
      // Wait for ICE gathering to complete
      await waitForIceGatheringComplete(peerConnection);
      
      // Send offer to server
      const response = await fetch('/api/call', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'offer',
          callId: callIdRef.current,
          offer: peerConnection.localDescription
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to send WebRTC offer');
      }
      
      const responseData = await response.json();
      
      if (!responseData.success) {
        throw new Error(responseData.error || 'Server error processing offer');
      }
      
      // Set remote description (answer from server)
      console.log('Setting remote description:', responseData.answer);
      await peerConnection.setRemoteDescription(new RTCSessionDescription(responseData.answer));
      
      console.log('WebRTC connection initialized successfully');
    } catch (err) {
      console.error('Error initializing WebRTC:', err);
      throw err;
    }
  };
  
  // Wait for ICE gathering to complete
  const waitForIceGatheringComplete = (pc: RTCPeerConnection) => {
    return new Promise<void>((resolve) => {
      if (pc.iceGatheringState === 'complete') {
        resolve();
        return;
      }
      
      const checkState = () => {
        if (pc.iceGatheringState === 'complete') {
          pc.removeEventListener('icegatheringstatechange', checkState);
          resolve();
        }
      };
      
      pc.addEventListener('icegatheringstatechange', checkState);
      
      // Timeout after 5 seconds
      setTimeout(() => {
        pc.removeEventListener('icegatheringstatechange', checkState);
        console.log('ICE gathering timed out, proceeding anyway');
        resolve();
      }, 5000);
    });
  };
  
  // Set up event handlers for the peer connection
  const setupPeerConnectionEventHandlers = (pc: RTCPeerConnection) => {
    // Handle incoming tracks (AI voice)
    pc.ontrack = (event) => {
      console.log('Received remote track', event.streams);
      remoteStreamRef.current = event.streams[0];
      if (audioRef.current) {
        audioRef.current.srcObject = event.streams[0];
      }
    };
    
    // Handle ICE candidates
    pc.onicecandidate = async (event) => {
      if (event.candidate) {
        console.log('New ICE candidate:', event.candidate);
        
        // Send ICE candidate to server
        try {
          await fetch('/api/call', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              action: 'ice',
              callId: callIdRef.current,
              iceCandidate: event.candidate
            }),
          });
        } catch (err) {
          console.error('Error sending ICE candidate:', err);
        }
      }
    };
    
    // Connection state change
    pc.onconnectionstatechange = () => {
      console.log('WebRTC connection state:', pc.connectionState);
      if (pc.connectionState === 'connected') {
        console.log('WebRTC connected successfully');
      } else if (pc.connectionState === 'disconnected' || 
                pc.connectionState === 'failed') {
        console.error('WebRTC connection failed or disconnected');
        handleEndCall();
      }
    };
    
    // ICE connection state change
    pc.oniceconnectionstatechange = () => {
      console.log('ICE connection state:', pc.iceConnectionState);
    };
    
    // Signaling state change
    pc.onsignalingstatechange = () => {
      console.log('Signaling state:', pc.signalingState);
    };
  };

  const handleStartCall = async () => {
    try {
      setIsConnecting(true);
      setError(null);
      
      const response = await startVoiceCall();
      
      if (response.success) {
        callIdRef.current = response.callId;
        
        // Initialize WebRTC
        await initializeWebRTC(
          response.rtcSessionId, 
          response.iceServers, 
          response.answer
        );
        
        setIsCallActive(true);
        callStartTimeRef.current = Date.now();
        
        // Start timer
        timerRef.current = setInterval(() => {
          if (callStartTimeRef.current) {
            const elapsed = Math.floor((Date.now() - callStartTimeRef.current) / 1000);
            setCallDuration(elapsed);
          }
        }, 1000);
      } else {
        throw new Error(response.error || 'Failed to start call');
      }
    } catch (err) {
      console.error('Error starting call:', err);
      setError(err instanceof Error ? err.message : 'Failed to start call');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleEndCall = async () => {
    try {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      
      // Close WebRTC connection
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
        peerConnectionRef.current = null;
      }
      
      // Stop local media tracks
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => {
          track.stop();
        });
        localStreamRef.current = null;
      }
      
      // Clear remote stream
      if (audioRef.current) {
        audioRef.current.srcObject = null;
      }
      remoteStreamRef.current = null;
      
      // End call on server
      if (callIdRef.current) {
        await endVoiceCall(callIdRef.current);
      }
      
      setIsCallActive(false);
      setCallDuration(0);
      callStartTimeRef.current = null;
      callIdRef.current = null;
    } catch (err) {
      console.error('Error ending call:', err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full bg-gradient-to-b from-green-50 to-white">
      <div className="w-full max-w-md p-6 bg-white rounded-2xl shadow-lg">
        {error ? (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            <p className="font-medium mb-1">Error</p>
            <p className="text-sm">{error}</p>
          </div>
        ) : null}
        
        <div className="flex flex-col items-center">
          <div className="w-32 h-32 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <div className={`w-24 h-24 rounded-full bg-green-600 flex items-center justify-center ${isCallActive ? 'animate-pulse' : ''}`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
            </div>
          </div>
          
          {isCallActive ? (
            <>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Call in progress</h2>
              <p className="text-gray-500 mb-4">Connected to Shoe Deals Assistant</p>
              <div className="text-2xl font-mono font-medium text-green-600 mb-6">
                {formatTime(callDuration)}
              </div>
              <div className="flex flex-col space-y-3 w-full">
                <Button 
                  onClick={handleEndCall}
                  className="bg-red-600 hover:bg-red-700 py-6 px-8 rounded-full"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                    <path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.42 19.42 0 0 1-3.33-2.67m-2.67-3.34a19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91"></path>
                    <line x1="23" y1="1" x2="1" y2="23"></line>
                  </svg>
                  End Call
                </Button>
                <p className="text-sm text-center text-gray-500">
                  Speak clearly and the AI assistant will respond
                </p>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Voice Assistant</h2>
              <p className="text-gray-500 mb-6">Get shoe recommendations by voice</p>
              <Button 
                onClick={handleStartCall}
                disabled={isConnecting}
                className="bg-green-600 hover:bg-green-700 py-6 px-8 rounded-full w-full"
              >
                {isConnecting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Connecting...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                    </svg>
                    Start Voice Call
                  </>
                )}
              </Button>
            </>
          )}
        </div>
      </div>
      
      {/* Hidden audio element to play the AI voice */}
      <audio ref={audioRef} autoPlay playsInline />
      
      {/* Tips section */}
      {!isCallActive && (
        <div className="mt-8 w-full max-w-md">
          <h3 className="text-lg font-medium text-gray-700 mb-3">Tips for voice interaction:</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600 mr-2 mt-0.5">
                <polyline points="9 11 12 14 22 4"></polyline>
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
              </svg>
              Speak clearly and mention your budget (e.g., "I'm looking for running shoes under $200")
            </li>
            <li className="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600 mr-2 mt-0.5">
                <polyline points="9 11 12 14 22 4"></polyline>
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
              </svg>
              You can specify style preferences like "casual", "athletic", or "formal"
            </li>
            <li className="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600 mr-2 mt-0.5">
                <polyline points="9 11 12 14 22 4"></polyline>
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
              </svg>
              Ask for specific details about any recommended shoes
            </li>
          </ul>
        </div>
      )}
    </div>
  );
} 