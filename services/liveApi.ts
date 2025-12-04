// ------------------------------------------------------
// CLEAN FRONTEND FILE (NO EXPOSED API KEY)
// ------------------------------------------------------

import { LiveServerMessage, Modality } from '@google/genai'; // Keep only needed types
import { InterviewConfig } from '../types';

// Utility Encoding/Decoding
export function decode(base64: string) {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < bytes.length; i++) bytes[i] = binaryString.charCodeAt(i);
  return bytes;
}

export function encode(bytes: Uint8Array) {
  return btoa(String.fromCharCode(...bytes));
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

  for (let c = 0; c < numChannels; c++) {
    const channelData = buffer.getChannelData(c);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + c] / 32768.0;
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
const WS_URL = API_URL.replace(/^http/, "ws") + "/live";

export class GeminiLiveSession {
  private role: string;
  private interviewConfig?: InterviewConfig;
  private systemInstruction?: string;
  private voiceName: string;
  private inputAudioContext: AudioContext;
  private outputAudioContext: AudioContext;

  private stream: MediaStream | null = null;
  private scriptProcessor: ScriptProcessorNode | null = null;
  private ws: WebSocket | null = null;

  private nextStartTime = 0;
  private isActive = false;
  private sources = new Set<AudioBufferSourceNode>();

  private onAudioData: (buffer: AudioBuffer) => void;
  private onClose: () => void;
  private onError: (err: Error) => void;

  constructor(config: LiveSessionConfig) {
    this.role = config.role;
    this.interviewConfig = config.config;
    this.systemInstruction = config.systemInstruction;
    this.voiceName = config.voiceName || "Kore";
    this.onAudioData = config.onAudioData;
    this.onClose = config.onClose;
    this.onError = config.onError;

    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    this.inputAudioContext = new AudioContextClass();
    this.outputAudioContext = new AudioContextClass();
  }

  async connect() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.isActive = true;

      this.ws = new WebSocket(WS_URL);

      this.ws.onopen = () => {
        console.log("🔗 Connected to backend WebSocket");
        this.ws?.send(JSON.stringify({
          type: "init",
          role: this.role,
          voiceName: this.voiceName,
          systemInstruction: this.systemInstruction,
          config: this.interviewConfig,
        }));
        this.startAudioStream();
      };

      this.ws.onerror = () => this.onError(new Error("WebSocket connection failed"));
      this.ws.onclose = () => this.onClose();

      this.ws.onmessage = async (ev) => {
        try {
          const msg = JSON.parse(ev.data);

          if (msg.type === "audio") {
            await this.playAudio(msg.data);
          }
        } catch (err) {
          console.error("WS Message Parse Error:", err);
        }
      };

    } catch (err) {
      console.error(err);
      this.onError(err instanceof Error ? err : new Error("Failed to start session"));
    }
  }

  startAudioStream() {
    if (!this.stream || !this.ws) return;

    const source = this.inputAudioContext.createMediaStreamSource(this.stream);
    this.scriptProcessor = this.inputAudioContext.createScriptProcessor(4096, 1, 1);

    this.scriptProcessor.onaudioprocess = (e) => {
      if (!this.isActive || this.ws?.readyState !== WebSocket.OPEN) return;
      const pcmBlob = this.createBlob(e.inputBuffer.getChannelData(0));
      this.ws.send(JSON.stringify({ type: "mic", data: pcmBlob }));
    };

    const muteNode = this.inputAudioContext.createGain();
    muteNode.gain.value = 0;

    source.connect(this.scriptProcessor);
    this.scriptProcessor.connect(muteNode);
    muteNode.connect(this.inputAudioContext.destination);
  }

  async playAudio(base64Audio: string) {
    const buffer = await decodeAudioData(decode(base64Audio), this.outputAudioContext, 24000, 1);

    this.onAudioData(buffer);

    const source = this.outputAudioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(this.outputAudioContext.destination);

    source.start(this.nextStartTime);
    this.nextStartTime += buffer.duration;
    this.sources.add(source);

    source.addEventListener("ended", () => this.sources.delete(source));
  }

  createBlob(data: Float32Array) {
    const clamped = new Int16Array(data.length);
    for (let i = 0; i < data.length; i++) clamped[i] = data[i] * 32767;
    return { data: encode(new Uint8Array(clamped.buffer)), mimeType: "audio/pcm;rate=16000" };
  }

  async disconnect() {
    this.isActive = false;
    this.ws?.close();
    this.stream?.getTracks().forEach(t => t.stop());
    this.scriptProcessor?.disconnect();
    this.sources.forEach(s => s.stop());
    this.sources.clear();
  }
}
