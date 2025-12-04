
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { InterviewConfig } from '../types';

// Audio Utils (Encoding/Decoding)
export function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

export interface LiveSessionConfig {
  role: string;
  config?: InterviewConfig; 
  systemInstruction?: string; 
  voiceName?: string; 
  onAudioData: (buffer: AudioBuffer) => void;
  onClose: () => void;
  onError: (err: Error) => void;
}

const API_URL = import.meta.env.VITE_API_URL || "https://karmguruai.onrender.com";



/**
 * Fetches content from the backend using an HTTP streaming connection (no WebSockets).
 * @param prompt The user's text prompt.
 * @param updateCallback Function to call with chunks of text as they arrive.
 * @returns A promise that resolves to the final complete response text.
 */
export async function streamResponse(prompt: string, updateCallback: (chunk: string) => void): Promise<string> {
    const response = await fetch(`${API_URL}/api/generate`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt })
    });

    if (!response.ok) {
        // Handle server errors (e.g., status 500)
        const errorText = await response.text();
        throw new Error(`Server error (${response.status}): ${errorText}`);
    }

    // Start reading the response body as a stream
    const reader = response.body?.getReader();
    if (!reader) {
        throw new Error("Response body is not readable.");
    }
    
    const decoder = new TextDecoder('utf-8');
    let fullResponse = '';

    try {
        // Loop to read chunks until 'done' is true
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            fullResponse += chunk;
            
            // Call the callback function immediately with the new chunk
            updateCallback(chunk); 
        }
    } catch (e) {
        console.error("Error reading stream:", e);
        throw new Error("Stream reading failed.");
    } finally {
        reader.releaseLock();
    }

    return fullResponse;
}

// NOTE: You would replace the existing `generateResponse` with this new function 
// and update any parts of your app that use it to handle the streaming callback.








// async function generateResponse(prompt) {
//   try {
//     const response = await fetch(`${API_URL}/api/generate`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ prompt })
//     });

//     const data = await response.json();
//     return data.text;
//   } catch (err) {
//     console.error("Frontend error:", err);
//     return "Error connecting to server.";
//   }
// }

// inside GeminiLiveSession (browser)
// async function connect() {
//   // open websocket to your server
//   const wsUrl = (import.meta.env.VITE_API_URL || "https://karmguruai.onrender.com").replace(/^http/, "ws") + "/live";
//   this.ws = new WebSocket(wsUrl);

//   this.ws.onopen = () => {
//     console.log("WS open to backend live proxy");
//     this.ws.send(JSON.stringify({ type: "session_init", config: { voiceName: this.voiceName } }));
//   };

//   this.ws.onmessage = async (ev) => {
//     try {
//       const msg = JSON.parse(ev.data);
//       if (msg.type === "gemini_message") {
//         // msg.payload is the Gemini message object forwarded by server
//         // Pass to your existing message handler logic:
//         await this.handleMessage(msg.payload);
//       } else if (msg.type === "session_open") {
//         console.log("Server opened Gemini session");
//       } else if (msg.type === "session_error") {
//         this.onError(new Error(msg.error || "Session error"));
//       } else if (msg.type === "session_closed") {
//         this.onClose();
//       }
//     } catch (e) {
//       console.error("Invalid message from server", e);
//     }
//   };

//   this.ws.onclose = () => {
//     console.log("WS closed");
//     this.onClose();
//   };

//   this.ws.onerror = (e) => {
//     console.error("WS error", e);
//     this.onError(new Error("WebSocket error"));
//   };

//   // The audio capture code you already have will create PCM base64 strings:
//   // in your existing scriptProcessor.onaudioprocess, instead of session.sendRealtimeInput,
//   // send to server:
//   // this.ws.send(JSON.stringify({ type: "realtime_input", data: { data: base64, mimeType: "audio/pcm;rate=16000" } }));

//   // Ensure you wait for ws.readyState === WebSocket.OPEN before sending.
// }

export class GeminiLiveSession {
  private ai: GoogleGenAI;
  private role: string;
  private interviewConfig?: InterviewConfig;
  private systemInstruction?: string;
  private voiceName: string;
  private inputAudioContext: AudioContext;
  private outputAudioContext: AudioContext;
  private stream: MediaStream | null = null;
  private scriptProcessor: ScriptProcessorNode | null = null;
  private inputSource: MediaStreamAudioSourceNode | null = null;
  private sessionPromise: Promise<any> | null = null;
  private nextStartTime = 0;
  private isActive = false;
  private sources = new Set<AudioBufferSourceNode>();
  private ws: WebSocket | null = null;
  private onAudioData: (buffer: AudioBuffer) => void;
  private onClose: () => void;
  private onError: (err: Error) => void;

  // constructor(config: LiveSessionConfig) {
  //   this.role = config.role;
  //   this.interviewConfig = config.config;
  //   this.systemInstruction = config.systemInstruction;
  //   this.voiceName = config.voiceName || 'Kore';
  //   this.onAudioData = config.onAudioData;
  //   this.onClose = config.onClose;
  //   this.onError = config.onError;

  //   this.ai = new GoogleGenAI({ apiKey: import.meta.env.API_KEY || '' });
    
  //   // Initialize Audio Contexts
  //   const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
  //   this.inputAudioContext = new AudioContextClass({ sampleRate: 44100 });
  //   this.outputAudioContext = new AudioContextClass({ sampleRate: 24000 });
  // }

// constructor(config: LiveSessionConfig) {
//   this.role = config.role;
//   this.interviewConfig = config.config;
//   this.systemInstruction = config.systemInstruction;
//   this.voiceName = config.voiceName || "Kore";
//   this.onAudioData = config.onAudioData;
//   this.onClose = config.onClose;
//   this.onError = config.onError;

//   this.ai = new GoogleGenAI({ apiKey: import.meta.env.API_KEY || "" });

//   // Use browser defaults — do NOT force sampleRate
//   const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
  
//   this.inputAudioContext = new AudioContextClass();
//   this.outputAudioContext = new AudioContextClass();
// }

constructor(config: LiveSessionConfig) {
  this.role = config.role;
  this.interviewConfig = config.config;
  this.systemInstruction = config.systemInstruction;
  this.voiceName = config.voiceName || "Kore";
  this.onAudioData = config.onAudioData;
  this.onClose = config.onClose;
  this.onError = config.onError;

     this.ai = new GoogleGenAI({ apiKey: process.env.VITE_GOOGLE_API_KEY || '' });

  
  const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
  this.inputAudioContext = new AudioContextClass();
  this.outputAudioContext = new AudioContextClass();
}

async connect() {
  try {
    this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    this.isActive = true;

    // *** MOVE WebSocket init into constructor or here ***
    const wsUrl = `${API_URL.replace(/^http/, "ws")}/live`;

    this.ws = new WebSocket(wsUrl);

    this.ws.onopen = () => {
      console.log("Connected to websocket proxy server");
      this.ws.send(JSON.stringify({ type: "session_init", voiceName: this.voiceName }));
    };

    this.ws.onclose = () => {
      console.log("WebSocket closed");
      this.onClose();
    };

    this.ws.onerror = (err) => {
      console.error("WebSocket error", err);
      this.onError(new Error("WebSocket failed"));
    };

      // Determine System Instruction
      let finalInstruction = this.systemInstruction;
      
      if (!finalInstruction && this.interviewConfig) {
        const techStackStr = this.interviewConfig.techStack.join(', ');
        const toolsStr = this.interviewConfig.tools.join(', ');
        finalInstruction = `You are a professional ${this.role} interviewer at ${this.interviewConfig.company}. 
          The candidate has ${this.interviewConfig.experience} years of experience.
          Focus on these technologies: ${techStackStr}.
          Tools used: ${toolsStr}.
          
          Conduct a realistic mock interview.
          1. Start by welcoming the candidate to the interview at ${this.interviewConfig.company}.
          2. Ask one question at a time.
          3. Wait for the user to answer.
          4. Evaluate the answer briefly before moving to the next question.
          5. Keep your audio responses concise (under 30 seconds).`;

        const category = this.interviewConfig.category || 'Technical';
        finalInstruction += `\n\nINTERVIEW FOCUS: ${category}\n`;
        if (this.interviewConfig.resumeContext) {
           finalInstruction += `\n\nCANDIDATE RESUME CONTEXT: ${this.interviewConfig.resumeContext}`;
        }
      }

      this.sessionPromise = this.ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
          onopen: this.handleOpen.bind(this),
          onmessage: this.handleMessage.bind(this),
          onclose: () => {
             console.log('Session closed');
             this.isActive = false;
             this.onClose();
          },
          onerror: (e) => {
             console.error('Session error', e);
             this.onError(new Error('Session error'));
          },
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: this.voiceName } },
          },
          systemInstruction: finalInstruction,
        },
      });

    } catch (err) {
      console.error("Failed to connect live session", err);
      this.onError(err instanceof Error ? err : new Error("Failed to connect"));
    }
  }

  private handleOpen() {
    console.log("Session Opened");
    if (!this.stream) return;

    this.inputSource = this.inputAudioContext.createMediaStreamSource(this.stream);
    this.scriptProcessor = this.inputAudioContext.createScriptProcessor(4096, 1, 1);
    
    this.scriptProcessor.onaudioprocess = (e) => {
      if (!this.isActive) return;
      
      const inputData = e.inputBuffer.getChannelData(0);
      const pcmBlob = this.createBlob(inputData);
      
      this.sessionPromise?.then((session) => {
         session.sendRealtimeInput({ media: pcmBlob });
      });
    };

    this.inputSource.connect(this.scriptProcessor);
    
    // FIX: Connect to a GainNode with 0 gain before destination to prevent feedback loop
    // while keeping the processor active.
    const muteNode = this.inputAudioContext.createGain();
    muteNode.gain.value = 0;
    this.scriptProcessor.connect(muteNode);
    muteNode.connect(this.inputAudioContext.destination);
  }

  private async handleMessage(message: LiveServerMessage) {
    const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
    
    if (base64Audio) {
      this.nextStartTime = Math.max(this.nextStartTime, this.outputAudioContext.currentTime);
      
      const audioBuffer = await decodeAudioData(
        decode(base64Audio),
        this.outputAudioContext,
        24000,
        1
      );

      // Pass visualizer data back to UI
      this.onAudioData(audioBuffer);

      const source = this.outputAudioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(this.outputAudioContext.destination);
      
      source.addEventListener('ended', () => {
        this.sources.delete(source);
      });

      source.start(this.nextStartTime);
      this.nextStartTime += audioBuffer.duration;
      this.sources.add(source);
    }

    if (message.serverContent?.interrupted) {
        this.sources.forEach(s => s.stop());
        this.sources.clear();
        this.nextStartTime = 0;
    }
  }

  private createBlob(data: Float32Array) {
    const l = data.length;
    const int16 = new Int16Array(l);
    for (let i = 0; i < l; i++) {
      int16[i] = data[i] * 32768;
    }
    return {
      data: encode(new Uint8Array(int16.buffer)),
      mimeType: 'audio/pcm;rate=16000',
    };
  }

  async disconnect() {
    this.isActive = false;
    if (this.sessionPromise) {
      const session = await this.sessionPromise;
      session.close();
    }
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
    }
    this.scriptProcessor?.disconnect();
    this.inputSource?.disconnect();
    this.sources.forEach(s => s.stop());
    this.sources.clear();
    console.log("Disconnected Live Session");
  }
}
