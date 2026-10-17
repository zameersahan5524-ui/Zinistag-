import React, { useState } from 'react';
import {
  X,
  Download,
  Check,
  Copy,
  ShieldCheck,
  Camera,
  Mic,
  HardDrive,
  FileCode
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ZinistagLogo } from './ZinistagLogo';

export const DownloadAabModal: React.FC = () => {
  const { isDownloadModalOpen, closeDownloadModal, showToast } = useApp();
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  if (!isDownloadModalOpen) return null;

  const absoluteUrl = typeof window !== 'undefined' ? `${window.location.origin}/app-release.aab` : '/app-release.aab';
  const manifestUrl = typeof window !== 'undefined' ? `${window.location.origin}/AndroidManifest.xml` : '/AndroidManifest.xml';

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(absoluteUrl);
    setCopied(true);
    showToast('Download link copied to clipboard! 📋');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDirectDownload = () => {
    setIsDownloading(true);
    showToast('Starting AAB download... 📦');

    try {
      const link = document.createElement('a');
      link.href = absoluteUrl;
      link.setAttribute('download', 'app-release.aab');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch {
      window.location.href = absoluteUrl;
    }

    setTimeout(() => setIsDownloading(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 select-none">
      <div className="w-full max-w-lg bg-zinc-900 border border-white/15 rounded-t-3xl sm:rounded-3xl text-white overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-zinc-950/60">
          <div className="flex items-center gap-3">
            <ZinistagLogo size="sm" variant="badge" showText={false} />
            <div>
              <h3 className="text-sm font-bold text-white">Zinistag Android Release</h3>
              <p className="text-[11px] text-zinc-400">Signed Production App Bundle (.aab)</p>
            </div>
          </div>
          <button
            onClick={closeDownloadModal}
            className="p-1 rounded-full text-zinc-400 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* Artifact Details Card */}
          <div className="bg-zinc-950 rounded-2xl p-4 border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="font-semibold text-white">Signed Release Bundle</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-[10px] font-bold">
                13 MB
              </span>
            </div>

            <div className="space-y-1.5 text-zinc-400 border-t border-white/5 pt-2 font-mono text-[11px]">
              <div className="flex justify-between">
                <span>File Name:</span>
                <span className="text-zinc-200">app-release.aab</span>
              </div>
              <div className="flex justify-between">
                <span>Package ID:</span>
                <span className="text-zinc-200">com.zinistag.app</span>
              </div>
              <div className="flex justify-between">
                <span>Target SDK:</span>
                <span className="text-zinc-200">Android 16 (API 36)</span>
              </div>
              <div className="flex justify-between">
                <span>Version:</span>
                <span className="text-zinc-200">1.0.0 (Build 1)</span>
              </div>
            </div>
          </div>

          {/* Configured Android Permissions Section */}
          <div className="bg-zinc-950 rounded-2xl p-3.5 border border-white/10 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-zinc-300 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                <span>Declared Android Permissions</span>
              </span>
              <div className="flex items-center gap-2">
                <a
                  href="/MainActivity.kt"
                  download="MainActivity.kt"
                  className="text-[10px] text-pink-400 hover:text-pink-300 font-mono flex items-center gap-1 cursor-pointer"
                >
                  <FileCode className="w-3 h-3" />
                  <span>MainActivity.kt</span>
                </a>
                <span className="text-zinc-600">•</span>
                <a
                  href={manifestUrl}
                  download="AndroidManifest.xml"
                  className="text-[10px] text-cyan-400 hover:text-cyan-300 font-mono flex items-center gap-1 cursor-pointer"
                >
                  <FileCode className="w-3 h-3" />
                  <span>AndroidManifest.xml</span>
                </a>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-1.5 font-mono text-[10px]">
              <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/5 text-zinc-300">
                <Camera className="w-3 h-3 text-pink-400 shrink-0" />
                <span className="truncate">android.permission.CAMERA</span>
              </div>
              <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/5 text-zinc-300">
                <Mic className="w-3 h-3 text-cyan-400 shrink-0" />
                <span className="truncate">android.permission.RECORD_AUDIO</span>
              </div>
              <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/5 text-zinc-300">
                <HardDrive className="w-3 h-3 text-amber-400 shrink-0" />
                <span className="truncate">android.permission.WRITE_EXTERNAL_STORAGE</span>
              </div>
            </div>
          </div>

          {/* Primary Direct Download Action */}
          <div className="space-y-2">
            <button
              onClick={handleDirectDownload}
              disabled={isDownloading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-pink-500 hover:opacity-95 text-white font-bold text-sm shadow-lg shadow-cyan-500/20 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>{isDownloading ? 'Downloading...' : 'Direct Download app-release.aab'}</span>
            </button>

            {/* Direct Copy URL */}
            <div className="flex items-center gap-2 bg-zinc-950 border border-white/10 rounded-xl p-2 pl-3">
              <input
                type="text"
                readOnly
                value={absoluteUrl}
                className="bg-transparent text-[11px] text-zinc-300 font-mono flex-1 outline-none truncate"
              />
              <button
                onClick={handleCopyLink}
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white font-medium text-xs flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Google Play Internal Testing Guide */}
          <div className="p-3.5 rounded-2xl bg-zinc-950 border border-white/10 space-y-2">
            <div className="font-bold text-zinc-200 flex items-center gap-1.5">
              <span>Google Play Console Upload Steps</span>
            </div>
            <ol className="list-decimal list-inside space-y-1 text-zinc-400 leading-relaxed text-[11px]">
              <li>Open <span className="text-white">play.google.com/console</span></li>
              <li>Select or create app <span className="text-cyan-400 font-bold">ZINISTAG</span></li>
              <li>Go to <span className="text-white">Testing → Internal testing</span></li>
              <li>Click <span className="text-white">Create new release</span></li>
              <li>Upload <span className="font-mono text-zinc-200">app-release.aab</span> and save</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};
