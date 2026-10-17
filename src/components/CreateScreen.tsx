import React, { useState, useRef, useEffect } from 'react';
import {
  Camera,
  Upload,
  Film,
  Sparkles,
  ArrowLeft,
  Mic,
  MicOff,
  RefreshCw,
  Download,
  Square,
  Circle,
  AlertCircle,
  ShieldCheck,
  Code,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Radio
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ReelPost } from '../types';

type CreationMode = 'camera' | 'native_intent' | 'upload' | 'template';

export const CreateScreen: React.FC = () => {
  const { currentUser, addNewReel, setActiveTab, showToast } = useApp();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const nativeCameraInputRef = useRef<HTMLInputElement | null>(null);
  const liveVideoRef = useRef<HTMLVideoElement | null>(null);
  const recordedVideoRef = useRef<HTMLVideoElement | null>(null);

  const [mode, setMode] = useState<CreationMode>('camera');
  const [videoUrl, setVideoUrl] = useState<string>('/videos/reel-1.mp4');
  const [caption, setCaption] = useState<string>('');
  const [tags, setTags] = useState<string>('zinistag, motion, creative');
  const [audioTitle, setAudioTitle] = useState<string>('Original Audio');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Camera & Audio Recording state
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingTime, setRecordingTime] = useState<number>(0);
  const [hasRecordedBlob, setHasRecordedBlob] = useState<boolean>(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [activeFilter, setActiveFilter] = useState<string>('none');
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const [audioLevel, setAudioLevel] = useState<number>(0);
  const [showKotlinCode, setShowKotlinCode] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const kotlinSnippet = `private val REQUEST_CAMERA = 100

fun openCamera() {
    val intent = Intent(MediaStore.ACTION_VIDEO_CAPTURE)

    if (intent.resolveActivity(packageManager) != null) {
        startActivityForResult(intent, REQUEST_CAMERA)
    }
}`;

  const filters = [
    { id: 'none', name: 'Original', style: '' },
    { id: 'cyber', name: 'Cyberpunk', style: 'contrast(125%) saturate(150%) hue-rotate(15deg)' },
    { id: 'sunset', name: 'Sunset', style: 'sepia(30%) saturate(140%) contrast(110%)' },
    { id: 'noir', name: 'Noir', style: 'grayscale(100%) contrast(140%)' },
    { id: 'vintage', name: 'Vintage', style: 'sepia(50%) brightness(95%) contrast(90%)' }
  ];

  const sampleClips = [
    { label: 'Cyberpunk Neon', url: '/videos/reel-1.mp4' },
    { label: '3D Fluid Motion', url: '/videos/reel-2.mp4' },
    { label: 'Pacific Sunset', url: '/videos/reel-3.mp4' },
    { label: 'FPV Mist Valleys', url: '/videos/reel-4.mp4' },
    { label: 'Haute Couture', url: '/videos/reel-5.mp4' },
    { label: 'Liquid Cymatics', url: '/videos/reel-6.mp4' }
  ];

  // Listen for native Android video callback if running in WebView
  useEffect(() => {
    (window as unknown as { onNativeVideoRecorded?: (uri: string) => void }).onNativeVideoRecorded = (uri: string) => {
      setVideoUrl(uri);
      setHasRecordedBlob(true);
      showToast('Native Video Captured via REQUEST_CAMERA (100) 🎥');
    };

    return () => {
      delete (window as unknown as { onNativeVideoRecorded?: (uri: string) => void }).onNativeVideoRecorded;
    };
  }, [showToast]);

  // Initialize or update live camera stream
  const startCamera = async (currentFacing: 'user' | 'environment' = facingMode) => {
    stopCamera();
    setPermissionError(null);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera and microphone access not supported in this browser environment');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: currentFacing,
          width: { ideal: 720 },
          height: { ideal: 1280 }
        },
        audio: true
      });

      setMediaStream(stream);

      if (liveVideoRef.current) {
        liveVideoRef.current.srcObject = stream;
        liveVideoRef.current.play().catch(() => {});
      }

      // Audio analyzer for VU meter
      try {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const ctx = new AudioContextClass();
        const source = ctx.createMediaStreamSource(stream);
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 64;
        source.connect(analyser);

        audioContextRef.current = ctx;
        analyserRef.current = analyser;

        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        const updateLevel = () => {
          if (analyserRef.current) {
            analyserRef.current.getByteFrequencyData(dataArray);
            let sum = 0;
            for (let i = 0; i < dataArray.length; i++) {
              sum += dataArray[i];
            }
            const avg = sum / dataArray.length;
            setAudioLevel(Math.min(100, Math.round((avg / 128) * 100)));
            animFrameRef.current = requestAnimationFrame(updateLevel);
          }
        };
        updateLevel();
      } catch (err) {
        console.warn('Audio analyzer error:', err);
      }
    } catch (err) {
      console.error('Permission error:', err);
      setPermissionError(
        'Permissions required: CAMERA & RECORD_AUDIO. Please allow device access or use native intent.'
      );
    }
  };

  const stopCamera = () => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
      analyserRef.current = null;
    }
    if (mediaStream) {
      mediaStream.getTracks().forEach((track) => track.stop());
      setMediaStream(null);
    }
    if (liveVideoRef.current) {
      liveVideoRef.current.srcObject = null;
    }
  };

  useEffect(() => {
    if (mode === 'camera' && !hasRecordedBlob) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [mode, facingMode, hasRecordedBlob]);

  const toggleCameraFacing = () => {
    const nextFacing = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(nextFacing);
    startCamera(nextFacing);
    showToast(`Switched to ${nextFacing === 'user' ? 'Front' : 'Back'} Camera 🔄`);
  };

  const toggleMute = () => {
    if (mediaStream) {
      const audioTracks = mediaStream.getAudioTracks();
      const willMute = !isMuted;
      audioTracks.forEach((t) => (t.enabled = !willMute));
      setIsMuted(willMute);
      showToast(willMute ? 'Microphone muted 🔇' : 'Microphone enabled 🎙️');
    }
  };

  const startRecording = () => {
    if (!mediaStream) return;
    recordedChunksRef.current = [];
    setRecordingTime(0);

    try {
      const mimeTypes = ['video/webm;codecs=vp9,opus', 'video/webm', 'video/mp4'];
      let selectedMime = '';
      for (const m of mimeTypes) {
        if (MediaRecorder.isTypeSupported(m)) {
          selectedMime = m;
          break;
        }
      }

      const recorder = new MediaRecorder(mediaStream, selectedMime ? { mimeType: selectedMime } : undefined);

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          recordedChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: selectedMime || 'video/webm' });
        const url = URL.createObjectURL(blob);
        setVideoUrl(url);
        setHasRecordedBlob(true);
        stopCamera();
        showToast('Reel recorded! Preview ready 🎬');
      };

      mediaRecorderRef.current = recorder;
      recorder.start(100);
      setIsRecording(true);

      timerIntervalRef.current = window.setInterval(() => {
        setRecordingTime((prev) => {
          if (prev >= 60) {
            stopRecording();
            return 60;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (err) {
      console.error('Recording start failed:', err);
      showToast('Could not start recording on this device');
    }
  };

  const stopRecording = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  };

  const handleRetake = () => {
    setHasRecordedBlob(false);
    startCamera();
  };

  const handleSaveToDevice = () => {
    if (!videoUrl) return;
    const a = document.createElement('a');
    a.href = videoUrl;
    a.download = `zinistag_reel_${Date.now()}.mp4`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showToast('Saved to device storage! 📥 (WRITE_EXTERNAL_STORAGE)');
  };

  // Launch Android Native MediaStore.ACTION_VIDEO_CAPTURE (REQUEST_CAMERA = 100)
  const triggerNativeCameraIntent = () => {
    const androidBridge = (window as unknown as { Android?: { openCamera?: () => void } }).Android;
    if (androidBridge && typeof androidBridge.openCamera === 'function') {
      showToast('Calling Android openCamera() -> Intent(ACTION_VIDEO_CAPTURE, REQUEST_CAMERA = 100) 📲');
      androidBridge.openCamera();
      return;
    }

    if (nativeCameraInputRef.current) {
      showToast('Launching Android MediaStore.ACTION_VIDEO_CAPTURE intent (code 100) 🎬');
      nativeCameraInputRef.current.click();
    }
  };

  const handleNativeVideoCaptured = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setVideoUrl(url);
      setHasRecordedBlob(true);
      showToast('Video received from native camera intent! (REQUEST_CAMERA = 100) 📸');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setVideoUrl(url);
      setMode('upload');
      setHasRecordedBlob(true);
      showToast('Video clip loaded successfully! 📹');
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard?.writeText(kotlinSnippet);
    setCopiedCode(true);
    showToast('Kotlin intent snippet copied! 📋');
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!caption.trim()) {
      showToast('Please enter a caption for your reel');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const parsedTags = tags
        .split(',')
        .map((t) => t.trim().replace(/^#/, ''))
        .filter(Boolean);

      const newPost: ReelPost = {
        id: `reel_${Date.now()}`,
        videoUrl,
        caption: caption.trim(),
        creator: currentUser,
        likes: 1,
        commentsCount: 0,
        sharesCount: 0,
        tags: parsedTags.length > 0 ? parsedTags : ['zinistag', 'creator'],
        audio: {
          id: `a_${Date.now()}`,
          title: audioTitle.trim() || 'Original Sound',
          artist: currentUser.name,
          cover: currentUser.avatar
        },
        isLiked: true,
        isSaved: false,
        createdAt: 'Just now'
      };

      addNewReel(newPost);
      setIsSubmitting(false);
    }, 400);
  };

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full h-full bg-zinc-950 text-white overflow-y-auto pb-24 select-none">
      {/* Hidden HTML5 Native Capture Input for Android MediaStore.ACTION_VIDEO_CAPTURE */}
      <input
        ref={nativeCameraInputRef}
        type="file"
        accept="video/*"
        capture="environment"
        className="hidden"
        onChange={handleNativeVideoCaptured}
      />

      <input
        ref={fileInputRef}
        type="file"
        accept="video/*"
        className="hidden"
        onChange={handleFileUpload}
      />

      {/* Top Header */}
      <div className="sticky top-0 z-30 bg-zinc-950/90 backdrop-blur-md px-4 py-3 border-b border-white/10 flex items-center justify-between">
        <button
          onClick={() => setActiveTab('reels')}
          className="p-1 rounded-full text-zinc-400 hover:text-white cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="text-center">
          <h2 className="text-sm font-black tracking-wider uppercase font-['Outfit']">
            Create Reel
          </h2>
          <span className="text-[10px] text-cyan-400 font-mono">REQUEST_CAMERA = 100</span>
        </div>
        <button
          onClick={() => setShowKotlinCode(!showKotlinCode)}
          className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
            showKotlinCode
              ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30'
              : 'text-zinc-400 border-white/10 hover:text-white'
          }`}
          title="View Android Kotlin Camera Intent"
        >
          <Code className="w-4 h-4" />
        </button>
      </div>

      <div className="max-w-md mx-auto p-4 space-y-4">
        {/* Kotlin Intent Card (Toggleable) */}
        {showKotlinCode && (
          <div className="bg-zinc-900 border border-cyan-500/30 rounded-2xl p-3.5 space-y-2.5 shadow-xl animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                  <Code className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="font-bold text-xs text-white">Android Kotlin Video Intent</span>
                  <span className="block text-[10px] text-zinc-400 font-mono">REQUEST_CAMERA: 100</span>
                </div>
              </div>
              <button
                onClick={handleCopyCode}
                className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-white text-[10px] font-medium flex items-center gap-1 cursor-pointer transition-colors"
              >
                {copiedCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedCode ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <pre className="p-2.5 rounded-xl bg-black text-[11px] font-mono text-cyan-300 overflow-x-auto border border-white/10 leading-relaxed">
              {kotlinSnippet}
            </pre>

            <div className="flex items-center justify-between text-[10px] text-zinc-400 border-t border-white/5 pt-2">
              <span>Target: <strong className="text-zinc-200">MediaStore.ACTION_VIDEO_CAPTURE</strong></span>
              <a
                href="/MainActivity.kt"
                download="MainActivity.kt"
                className="text-cyan-400 hover:underline font-mono"
              >
                MainActivity.kt 📥
              </a>
            </div>
          </div>
        )}

        {/* Creation Modes Tabs */}
        <div className="grid grid-cols-4 gap-1 bg-zinc-900/90 p-1 rounded-xl border border-white/10 text-[11px]">
          <button
            onClick={() => {
              setMode('camera');
              setHasRecordedBlob(false);
            }}
            className={`py-2 rounded-lg font-bold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
              mode === 'camera' && !hasRecordedBlob
                ? 'bg-cyan-500 text-zinc-950 shadow-md shadow-cyan-500/20'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Studio</span>
          </button>

          <button
            onClick={() => {
              setMode('native_intent');
              triggerNativeCameraIntent();
            }}
            className={`py-2 rounded-lg font-bold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
              mode === 'native_intent'
                ? 'bg-cyan-500 text-zinc-950 shadow-md shadow-cyan-500/20'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Radio className="w-3.5 h-3.5 text-pink-400" />
            <span>Native 100</span>
          </button>

          <button
            onClick={() => {
              setMode('upload');
              fileInputRef.current?.click();
            }}
            className={`py-2 rounded-lg font-bold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
              mode === 'upload'
                ? 'bg-cyan-500 text-zinc-950 shadow-md shadow-cyan-500/20'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload</span>
          </button>

          <button
            onClick={() => {
              setMode('template');
              setHasRecordedBlob(true);
            }}
            className={`py-2 rounded-lg font-bold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
              mode === 'template'
                ? 'bg-cyan-500 text-zinc-950 shadow-md shadow-cyan-500/20'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            <span>Clips</span>
          </button>
        </div>

        {/* Native Android Intent Quick Launcher Bar */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-pink-500/15 via-purple-500/15 to-cyan-500/15 border border-pink-500/30">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center border border-pink-500/30 shrink-0">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>openCamera() Intent</span>
                <span className="px-1.5 py-0.2 rounded bg-pink-500/30 text-pink-300 font-mono text-[9px]">
                  #100
                </span>
              </div>
              <div className="text-[10px] text-zinc-400 font-mono truncate max-w-[190px]">
                MediaStore.ACTION_VIDEO_CAPTURE
              </div>
            </div>
          </div>
          <button
            onClick={triggerNativeCameraIntent}
            className="px-3 py-1.5 rounded-xl bg-pink-500 hover:bg-pink-400 text-white font-bold text-xs transition-colors flex items-center gap-1 cursor-pointer shadow-lg shadow-pink-500/20 shrink-0"
          >
            <span>Launch Intent</span>
          </button>
        </div>

        {/* Permissions Badge Indicator */}
        <div className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[10px] text-zinc-300">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>CAMERA • RECORD_AUDIO • WRITE_EXTERNAL_STORAGE</span>
          </div>
          <span className="text-emerald-400 font-mono font-bold">READY</span>
        </div>

        {/* Video Frame: Live Camera Preview OR Recorded Video Preview */}
        <div className="relative aspect-[9/16] max-h-[390px] mx-auto rounded-2xl overflow-hidden bg-black border border-white/15 shadow-2xl flex items-center justify-center">
          {mode === 'camera' && !hasRecordedBlob ? (
            /* Live Camera Stream */
            <div className="relative w-full h-full">
              {permissionError ? (
                <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-zinc-900">
                  <AlertCircle className="w-10 h-10 text-amber-400 mb-3" />
                  <p className="font-bold text-xs text-zinc-200 mb-2">{permissionError}</p>
                  <p className="text-[10px] text-zinc-400 mb-4 leading-relaxed">
                    Uses Android <code className="text-cyan-400">CAMERA</code> and{' '}
                    <code className="text-cyan-400">RECORD_AUDIO</code> permissions to capture vertical reels.
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => startCamera()}
                      className="px-3 py-1.5 rounded-xl bg-cyan-500 text-zinc-950 font-bold text-xs hover:bg-cyan-400 transition-colors cursor-pointer"
                    >
                      Retry Camera
                    </button>
                    <button
                      onClick={triggerNativeCameraIntent}
                      className="px-3 py-1.5 rounded-xl bg-pink-500 text-white font-bold text-xs hover:bg-pink-400 transition-colors cursor-pointer"
                    >
                      Native Intent 100
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <video
                    ref={liveVideoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                    style={{
                      filter: filters.find((f) => f.id === activeFilter)?.style || 'none',
                      transform: facingMode === 'user' ? 'scaleX(-1)' : 'none'
                    }}
                  />

                  {/* Top Overlay Controls: Flip, Mute & VU Meter */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-auto">
                    {/* Audio VU Meter (RECORD_AUDIO) */}
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15">
                      {isMuted ? (
                        <MicOff className="w-3 h-3 text-red-400" />
                      ) : (
                        <Mic className="w-3 h-3 text-cyan-400" />
                      )}
                      <div className="w-12 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-400 via-yellow-400 to-red-500 transition-all duration-75"
                          style={{ width: `${isMuted ? 0 : audioLevel}%` }}
                        />
                      </div>
                    </div>

                    {/* Camera Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={toggleMute}
                        className="p-2 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white hover:bg-black/80 transition-colors cursor-pointer"
                        title={isMuted ? 'Unmute microphone' : 'Mute microphone'}
                      >
                        {isMuted ? <MicOff className="w-3.5 h-3.5 text-red-400" /> : <Mic className="w-3.5 h-3.5 text-cyan-400" />}
                      </button>

                      <button
                        type="button"
                        onClick={toggleCameraFacing}
                        className="p-2 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white hover:bg-black/80 transition-colors cursor-pointer"
                        title="Flip Camera (Front / Back)"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Bottom Controls: Record Trigger & Timer */}
                  <div className="absolute bottom-4 inset-x-0 flex flex-col items-center gap-2 pointer-events-auto">
                    {isRecording && (
                      <div className="px-3 py-1 rounded-full bg-red-600/90 text-white text-xs font-mono font-bold flex items-center gap-1.5 animate-pulse">
                        <div className="w-2 h-2 rounded-full bg-white" />
                        <span>{formatTimer(recordingTime)} / 01:00</span>
                      </div>
                    )}

                    <div className="flex items-center gap-4">
                      {isRecording ? (
                        <button
                          type="button"
                          onClick={stopRecording}
                          className="w-16 h-16 rounded-full bg-red-500 text-white flex items-center justify-center border-4 border-white shadow-2xl hover:scale-105 active:scale-95 transition-transform cursor-pointer"
                        >
                          <Square className="w-6 h-6 fill-white" />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={startRecording}
                          className="w-16 h-16 rounded-full bg-gradient-to-tr from-pink-500 via-red-500 to-amber-500 p-1 shadow-2xl hover:scale-105 active:scale-95 transition-transform cursor-pointer"
                        >
                          <div className="w-full h-full rounded-full border-2 border-white flex items-center justify-center bg-red-500">
                            <Circle className="w-8 h-8 fill-white text-white" />
                          </div>
                        </button>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            /* Recorded or Uploaded Video Player */
            <div className="relative w-full h-full">
              <video
                ref={recordedVideoRef}
                src={videoUrl}
                className="w-full h-full object-cover"
                controls
                playsInline
                loop
              />

              <div className="absolute top-3 right-3 flex items-center gap-2 pointer-events-auto">
                {/* Save to Device (WRITE_EXTERNAL_STORAGE) */}
                <button
                  type="button"
                  onClick={handleSaveToDevice}
                  className="px-2.5 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-[11px] font-semibold flex items-center gap-1 hover:bg-black/90 transition-colors cursor-pointer"
                  title="Save clip locally (android.permission.WRITE_EXTERNAL_STORAGE)"
                >
                  <Download className="w-3 h-3 text-cyan-400" />
                  <span>Save</span>
                </button>

                {/* Retake Camera */}
                <button
                  type="button"
                  onClick={handleRetake}
                  className="px-2.5 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-[11px] font-semibold flex items-center gap-1 hover:bg-black/90 transition-colors cursor-pointer"
                >
                  <Camera className="w-3 h-3 text-pink-400" />
                  <span>Retake</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Live Filter Selection (When in Camera mode) */}
        {mode === 'camera' && !hasRecordedBlob && (
          <div>
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1.5">
              Live Camera Color Grading
            </label>
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {filters.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setActiveFilter(f.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                    activeFilter === f.id
                      ? 'bg-cyan-500 text-zinc-950 font-bold'
                      : 'bg-zinc-900 text-zinc-400 border border-white/10 hover:text-white'
                  }`}
                >
                  {f.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Sample Templates (When in template mode) */}
        {mode === 'template' && (
          <div>
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1.5">
              Stock Video Library
            </label>
            <div className="grid grid-cols-3 gap-2">
              {sampleClips.map((clip) => (
                <button
                  key={clip.url}
                  type="button"
                  onClick={() => {
                    setVideoUrl(clip.url);
                    showToast(`Switched to ${clip.label}`);
                  }}
                  className={`p-2 rounded-xl text-left border text-xs font-medium transition-colors cursor-pointer ${
                    videoUrl === clip.url
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                      : 'bg-zinc-900 border-white/10 text-zinc-300 hover:bg-zinc-800'
                  }`}
                >
                  <Film className="w-3.5 h-3.5 mb-1 text-cyan-400" />
                  <span className="block truncate text-[11px]">{clip.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Form Inputs */}
        <form onSubmit={handlePublish} className="space-y-3.5 pt-1">
          <div>
            <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
              Caption
            </label>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Write a catchy caption with hashtags #zinistag #motion..."
              rows={2}
              className="w-full bg-zinc-900 border border-white/10 rounded-xl p-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                Tags
              </label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="zinistag, creative"
                className="w-full bg-zinc-900 border border-white/10 rounded-xl px-2.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                Audio Track
              </label>
              <input
                type="text"
                value={audioTitle}
                onChange={(e) => setAudioTitle(e.target.value)}
                placeholder="Original Beat"
                className="w-full bg-zinc-900 border border-white/10 rounded-xl px-2.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-pink-500 text-white font-bold text-sm shadow-lg shadow-pink-500/25 active:scale-98 transition-transform flex items-center justify-center gap-2 cursor-pointer"
          >
            {isSubmitting ? (
              <span>Publishing Reel...</span>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Publish to Zinistag Feed</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
