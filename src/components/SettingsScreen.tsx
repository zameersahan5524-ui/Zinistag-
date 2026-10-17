import React, { useState } from 'react';
import {
  X,
  Download,
  Smartphone,
  RefreshCw,
  Play,
  Sparkles,
  Camera,
  Mic,
  HardDrive,
  FileCode,
  Check,
  Copy,
  Code,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ZinistagLogo } from './ZinistagLogo';
import { TrendingUp, ShieldAlert, DollarSign } from 'lucide-react';

export const SettingsScreen: React.FC = () => {
  const {
    isSettingsOpen,
    closeSettings,
    openDownloadModal,
    showToast,
    showSplashScreen,
    openCreatorStudio,
    openAdminDashboard
  } = useApp();
  const [showManifestCode, setShowManifestCode] = useState<boolean>(false);
  const [showKotlinCode, setShowKotlinCode] = useState<boolean>(false);
  const [copiedManifest, setCopiedManifest] = useState<boolean>(false);
  const [copiedKotlin, setCopiedKotlin] = useState<boolean>(false);
  const [cameraStatus, setCameraStatus] = useState<'unknown' | 'granted' | 'denied'>('unknown');
  const [micStatus, setMicStatus] = useState<'unknown' | 'granted' | 'denied'>('unknown');

  if (!isSettingsOpen) return null;

  const manifestXml = `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.zinistag.app">

    <!-- Hardware & System Permissions -->
    <uses-permission android:name="android.permission.CAMERA" />
    <uses-permission android:name="android.permission.RECORD_AUDIO" />
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.MODIFY_AUDIO_SETTINGS" />

    <!-- Hardware Features -->
    <uses-feature android:name="android.hardware.camera" android:required="false" />
    <uses-feature android:name="android.hardware.camera.autofocus" android:required="false" />
    <uses-feature android:name="android.hardware.microphone" android:required="false" />
</manifest>`;

  const kotlinCameraSnippet = `private val REQUEST_CAMERA = 100

fun openCamera() {
    val intent = Intent(MediaStore.ACTION_VIDEO_CAPTURE)

    if (intent.resolveActivity(packageManager) != null) {
        startActivityForResult(intent, REQUEST_CAMERA)
    }
}`;

  const handleClearCache = () => {
    localStorage.removeItem('zinistag_reels');
    showToast('Cache cleared! Restored default reels 🔄');
  };

  const handlePreviewSplash = () => {
    closeSettings();
    showSplashScreen();
  };

  const handleCopyManifest = () => {
    navigator.clipboard?.writeText(manifestXml);
    setCopiedManifest(true);
    showToast('AndroidManifest.xml copied! 📋');
    setTimeout(() => setCopiedManifest(false), 2000);
  };

  const handleCopyKotlin = () => {
    navigator.clipboard?.writeText(kotlinCameraSnippet);
    setCopiedKotlin(true);
    showToast('Kotlin openCamera() intent copied! 📋');
    setTimeout(() => setCopiedKotlin(false), 2000);
  };

  const testPermissions = async () => {
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        showToast('Media permissions API not supported in this frame');
        return;
      }
      showToast('Testing CAMERA & RECORD_AUDIO permissions...');
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setCameraStatus('granted');
      setMicStatus('granted');
      stream.getTracks().forEach((t) => t.stop());
      showToast('Permissions verified & granted! 🟢');
    } catch {
      setCameraStatus('denied');
      setMicStatus('denied');
      showToast('Camera/Microphone permission denied or blocked');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 select-none">
      <div className="w-full max-w-md bg-zinc-900 border border-white/10 rounded-t-3xl sm:rounded-3xl text-white overflow-hidden shadow-2xl flex flex-col max-h-[88vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <ZinistagLogo size="sm" showText={false} />
            <span className="text-sm font-bold">Settings & Permissions</span>
          </div>
          <button
            onClick={closeSettings}
            className="p-1 rounded-full text-zinc-400 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* Android Permissions Card */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
              <span>Android Permissions</span>
              <button
                onClick={testPermissions}
                className="text-cyan-400 hover:text-cyan-300 font-semibold cursor-pointer lowercase flex items-center gap-1"
              >
                <span>test access</span>
              </button>
            </div>

            <div className="bg-zinc-950 rounded-xl p-3 border border-white/10 space-y-2.5">
              {/* Camera */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-pink-500/20 text-pink-400 flex items-center justify-center">
                    <Camera className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-mono text-[11px] font-bold text-white">
                      android.permission.CAMERA
                    </div>
                    <div className="text-[10px] text-zinc-400">Record reels & live video stream</div>
                  </div>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-[9px] font-bold font-mono ${
                    cameraStatus === 'granted'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-white/10 text-zinc-300'
                  }`}
                >
                  {cameraStatus === 'granted' ? 'GRANTED' : 'DECLARED'}
                </span>
              </div>

              {/* Audio */}
              <div className="flex items-center justify-between border-t border-white/5 pt-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                    <Mic className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-mono text-[11px] font-bold text-white">
                      android.permission.RECORD_AUDIO
                    </div>
                    <div className="text-[10px] text-zinc-400">Live sound & creator microphone</div>
                  </div>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-[9px] font-bold font-mono ${
                    micStatus === 'granted'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-white/10 text-zinc-300'
                  }`}
                >
                  {micStatus === 'granted' ? 'GRANTED' : 'DECLARED'}
                </span>
              </div>

              {/* Write Storage */}
              <div className="flex items-center justify-between border-t border-white/5 pt-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                    <HardDrive className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-mono text-[11px] font-bold text-white">
                      android.permission.WRITE_EXTERNAL_STORAGE
                    </div>
                    <div className="text-[10px] text-zinc-400">Save clips to device storage & downloads</div>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold font-mono bg-white/10 text-zinc-300">
                  DECLARED
                </span>
              </div>

              {/* Expandable AndroidManifest.xml */}
              <div className="border-t border-white/5 pt-2">
                <button
                  onClick={() => setShowManifestCode(!showManifestCode)}
                  className="w-full flex items-center justify-between text-zinc-400 hover:text-zinc-200 text-[11px] font-medium transition-colors cursor-pointer py-1"
                >
                  <span className="flex items-center gap-1.5">
                    <FileCode className="w-3.5 h-3.5 text-cyan-400" />
                    <span>View AndroidManifest.xml</span>
                  </span>
                  {showManifestCode ? (
                    <ChevronUp className="w-3.5 h-3.5" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5" />
                  )}
                </button>

                {showManifestCode && (
                  <div className="mt-2 space-y-2">
                    <div className="relative">
                      <pre className="p-2.5 rounded-lg bg-black text-[10px] font-mono text-zinc-300 overflow-x-auto border border-white/10 max-h-40">
                        {manifestXml}
                      </pre>
                      <button
                        onClick={handleCopyManifest}
                        className="absolute top-2 right-2 px-2 py-1 rounded bg-zinc-800 text-[10px] font-semibold text-white flex items-center gap-1 hover:bg-zinc-700 transition-colors cursor-pointer"
                      >
                        {copiedManifest ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                        <span>{copiedManifest ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Expandable Kotlin openCamera Intent */}
              <div className="border-t border-white/5 pt-2">
                <button
                  onClick={() => setShowKotlinCode(!showKotlinCode)}
                  className="w-full flex items-center justify-between text-zinc-400 hover:text-zinc-200 text-[11px] font-medium transition-colors cursor-pointer py-1"
                >
                  <span className="flex items-center gap-1.5">
                    <Code className="w-3.5 h-3.5 text-pink-400" />
                    <span>View Kotlin openCamera() (code 100)</span>
                  </span>
                  {showKotlinCode ? (
                    <ChevronUp className="w-3.5 h-3.5" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5" />
                  )}
                </button>

                {showKotlinCode && (
                  <div className="mt-2 space-y-2">
                    <div className="relative">
                      <pre className="p-2.5 rounded-lg bg-black text-[10px] font-mono text-cyan-300 overflow-x-auto border border-white/10 leading-relaxed max-h-44">
                        {kotlinCameraSnippet}
                      </pre>
                      <button
                        onClick={handleCopyKotlin}
                        className="absolute top-2 right-2 px-2 py-1 rounded bg-zinc-800 text-[10px] font-semibold text-white flex items-center gap-1 hover:bg-zinc-700 transition-colors cursor-pointer"
                      >
                        {copiedKotlin ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                        <span>{copiedKotlin ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                    <div className="flex justify-end">
                      <a
                        href="/MainActivity.kt"
                        download="MainActivity.kt"
                        className="text-cyan-400 hover:underline font-mono text-[10px] flex items-center gap-1"
                      >
                        <Download className="w-3 h-3" />
                        <span>Download MainActivity.kt</span>
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Splash Screen Preview Banner */}
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-black border border-cyan-500/30 text-white flex items-center justify-center font-bold">
                <ZinistagLogo size="xs" showText={false} />
              </div>
              <div>
                <p className="font-bold text-white">Startup Splash Screen</p>
                <p className="text-[10px] text-zinc-400">Pure black startup splash with new Zinistag Z logo</p>
              </div>
            </div>
            <button
              onClick={handlePreviewSplash}
              className="px-3 py-1.5 rounded-lg bg-white text-zinc-950 font-bold hover:bg-zinc-200 transition-colors flex items-center gap-1.5 cursor-pointer text-xs"
            >
              <Play className="w-3 h-3 fill-zinc-950" />
              <span>Preview</span>
            </button>
          </div>

          {/* Release Artifact Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-cyan-500/10 via-indigo-500/10 to-pink-500/10 border border-cyan-500/30 space-y-2.5">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
              <Smartphone className="w-4 h-4" />
              <span>Production Android Release</span>
            </div>
            <p className="text-zinc-300 leading-relaxed">
              ZINISTAG production Android App Bundle (v1.0.0, 13 MB) includes full camera, audio, and storage manifest declarations.
            </p>
            <button
              onClick={() => {
                closeSettings();
                openDownloadModal();
              }}
              className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/20"
            >
              <Download className="w-4 h-4" />
              <span>Download Signed app-release.aab</span>
            </button>
          </div>

          {/* Creator Monetization & Admin Management */}
          <div className="space-y-2">
            <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
              Creator & Platform Management
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  closeSettings();
                  openCreatorStudio();
                }}
                className="p-3 rounded-2xl bg-zinc-950 border border-cyan-500/30 hover:border-cyan-400 text-left transition-all cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mb-2 group-hover:bg-cyan-500/30">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <p className="text-xs font-bold text-white">Creator Studio</p>
                <p className="text-[10px] text-zinc-400 mt-0.5">80/20 brand deals & payouts</p>
              </button>

              <button
                onClick={() => {
                  closeSettings();
                  openAdminDashboard();
                }}
                className="p-3 rounded-2xl bg-zinc-950 border border-red-500/30 hover:border-red-400 text-left transition-all cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center mb-2 group-hover:bg-red-500/30">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <p className="text-xs font-bold text-white">Admin Control</p>
                <p className="text-[10px] text-zinc-400 mt-0.5">Verification & platform audit</p>
              </button>
            </div>
          </div>

          {/* Preferences */}
          <div className="space-y-2">
            <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
              General Preferences
            </div>
            <div className="bg-zinc-950 rounded-xl divide-y divide-white/5 border border-white/5">
              <div className="p-3 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-white">Video Autoplay</p>
                  <p className="text-[10px] text-zinc-400">Play reels automatically on swipe</p>
                </div>
                <div className="w-9 h-5 bg-cyan-500 rounded-full p-0.5 flex justify-end">
                  <div className="w-4 h-4 bg-white rounded-full" />
                </div>
              </div>

              <div className="p-3 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-white">High Quality Video</p>
                  <p className="text-[10px] text-zinc-400">Stream 1080p vertical resolution</p>
                </div>
                <div className="w-9 h-5 bg-cyan-500 rounded-full p-0.5 flex justify-end">
                  <div className="w-4 h-4 bg-white rounded-full" />
                </div>
              </div>

              <button
                onClick={handleClearCache}
                className="w-full p-3 flex items-center justify-between text-left hover:bg-white/5 transition-colors cursor-pointer"
              >
                <div>
                  <p className="font-semibold text-white">Clear Local Cache</p>
                  <p className="text-[10px] text-zinc-400">Reset saved feed data</p>
                </div>
                <RefreshCw className="w-4 h-4 text-zinc-400" />
              </button>
            </div>
          </div>

          {/* App Info */}
          <div className="space-y-2">
            <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
              About Zinistag
            </div>
            <div className="bg-zinc-950 rounded-xl p-3.5 border border-white/5 space-y-3 text-zinc-400">
              <div className="flex items-center gap-3 pb-2 border-b border-white/5">
                <ZinistagLogo size="md" variant="badge" showText={false} />
                <div>
                  <h4 className="font-bold text-white font-['Outfit'] text-sm tracking-wide">Zinistag</h4>
                  <p className="text-[10px] text-zinc-400">Next-Gen Creative Social Platform</p>
                </div>
              </div>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span>Application Name</span>
                  <span className="font-semibold text-white">Zinistag</span>
                </div>
                <div className="flex justify-between">
                  <span>Publisher</span>
                  <span className="font-semibold text-white">Zinkora</span>
                </div>
                <div className="flex justify-between">
                  <span>Package ID</span>
                  <span className="font-mono text-zinc-300">com.zinistag.app</span>
                </div>
                <div className="flex justify-between">
                  <span>Version</span>
                  <span className="text-white font-medium">1.0.0 (Build 1)</span>
                </div>
                <div className="flex justify-between">
                  <span>Platform Target</span>
                  <span className="text-white font-medium">Android 16 / SDK 36</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
