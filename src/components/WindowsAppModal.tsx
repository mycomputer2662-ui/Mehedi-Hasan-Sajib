import React, { useState } from 'react';
import { X, Download, Monitor, CheckCircle2, Terminal, ArrowRight, Laptop, Sparkles, FolderDown } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { downloadWindowsLauncherPackage, downloadStandaloneBat } from '../utils/windowsPackage';

interface WindowsAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WindowsAppModal: React.FC<WindowsAppModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, install } = usePWAInstall();
  const [downloadingZip, setDownloadingZip] = useState(false);
  const [copiedCmd, setCopiedCmd] = useState(false);

  if (!isOpen) return null;

  const handleDownloadZip = async () => {
    setDownloadingZip(true);
    try {
      await downloadWindowsLauncherPackage(window.location.origin);
    } catch (e) {
      console.error(e);
    } finally {
      setDownloadingZip(false);
    }
  };

  const handleCopyCommand = () => {
    navigator.clipboard.writeText('npm install && npx electron-builder --win portable');
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-blue-950/60 via-neutral-900 to-neutral-900 border-b border-neutral-800">
          <div className="flex items-center gap-3">
            {/* Windows 11 Logo Icon */}
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.949-1.8" />
              </svg>
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Windows ডেক্সটপ সফটওয়্যার (.exe) সেটআপ
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  Windows 10 / 11
                </span>
              </h2>
              <p className="text-xs text-neutral-400">
                এই সফটওয়্যারটি আপনার উইন্ডোজ কম্পিউটারে সরাসরি চালানোর সহজ উপায়
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body with 3 Methods */}
        <div className="p-6 overflow-y-auto space-y-5 text-neutral-200 text-xs">
          {/* METHOD 1: 1-Click Browser Install as Desktop App */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-blue-950/40 to-neutral-950 border border-blue-600/30 space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-white text-sm">
                <Laptop className="w-4 h-4 text-blue-400" />
                <span>পদ্ধতি ১: ব্রাউজার থেকে সরাসরি ডেক্সটপ অ্যাপ ইনস্টল (সবচেয়ে সহজ ও দ্রুত)</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                সুপারিশকৃত
              </span>
            </div>

            <p className="text-neutral-300 leading-relaxed">
              Google Chrome অথবা Microsoft Edge দিয়ে নিচের বাটনে ক্লিক করলেই সফটওয়্যারটি আপনার Windows
              কম্পিউটারে একটি স্বতন্ত্র ডেস্কটপ সফটওয়্যার (.exe) উইন্ডো হিসেবে ইনস্টল হয়ে যাবে এবং
              Start Menu ও Taskbar-এ পিন হয়ে যাবে।
            </p>

            <div className="pt-1 flex flex-wrap items-center gap-3">
              {isInstalled ? (
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-950/60 border border-emerald-600/40 text-emerald-300 font-semibold text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  সফটওয়্যারটি ইতিমধ্যে আপনার উইন্ডোজ অ্যাপ হিসেবে ইনস্টল করা আছে!
                </div>
              ) : isInstallable ? (
                <button
                  onClick={install}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold shadow-lg shadow-blue-600/25 active:scale-95 transition"
                >
                  <Download className="w-4 h-4" />
                  এখনই Windows App হিসেবে ইনস্টল করুন
                </button>
              ) : (
                <div className="p-3 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 space-y-1 w-full">
                  <div className="font-semibold text-white flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    Chrome অথবা Edge ব্রাউজার থেকে ইনস্টল করুন:
                  </div>
                  <p className="text-[11px] text-neutral-400">
                    ব্রাউজারের উপরের অ্যাড্রেস বারের ডান পাশে থাকা <strong>"Install App"</strong> (বা ৩
                    ডট মেনু &gt; <em>Apps &gt; Install Viral 4K Thumbnail Studio</em>) বাটনে ক্লিক করলেই
                    সরাসরি ডেক্সটপ সফটওয়্যার ইনস্টল হবে।
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* METHOD 2: Download 1-Click Windows Launcher Package */}
          <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-3">
            <div className="flex items-center gap-2 font-bold text-white text-sm">
              <FolderDown className="w-4 h-4 text-amber-400" />
              <span>পদ্ধতি ২: 1-Click Windows Launcher প্যাকেজ ডাউনলোড (.zip / .bat)</span>
            </div>

            <p className="text-neutral-400 leading-relaxed">
              আমরা আপনার জন্য একটি অটোমেটেড উইন্ডোজ লঞ্চার প্যাকেজ তৈরি করেছি। এতে ডাবল-ক্লিক করলেই কোনো
              ব্রাউজার বার ছাড়া ফুলস্ক্রিন উইন্ডোজ সফটওয়্যার উইন্ডো ওপেন হবে এবং ডেক্সটপে শর্টকাট তৈরি হবে।
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                onClick={handleDownloadZip}
                disabled={downloadingZip}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white font-bold border border-neutral-700 active:scale-95 transition disabled:opacity-50"
              >
                <Download className="w-4 h-4 text-amber-400" />
                {downloadingZip ? 'তৈরি হচ্ছে...' : 'Windows Launcher Package (.zip) ডাউনলোড'}
              </button>

              <button
                onClick={() => downloadStandaloneBat(window.location.origin)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 font-semibold border border-neutral-800 transition text-xs"
              >
                <Terminal className="w-3.5 h-3.5 text-neutral-400" />
                সরাসরি Launcher.bat ডাউনলোড
              </button>
            </div>

            <div className="text-[11px] text-neutral-500 pt-1">
              প্যাকেজে রয়েছে: <code>Launch-Thumbnail-Studio.bat</code>, <code>Create-Desktop-Shortcut.vbs</code>,
              এবং বাংলা গাইড।
            </div>
          </div>

          {/* METHOD 3: Electron Standalone Single .exe Build */}
          <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-3">
            <div className="flex items-center gap-2 font-bold text-white text-sm">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span>পদ্ধতি ৩: Standalone Offline Single .exe তৈরি (Electron Builder)</span>
            </div>

            <p className="text-neutral-400 leading-relaxed">
              আপনি যদি নিজের কম্পিউটারে কোনো ইন্টারনেট সংযোগ ছাড়াই সরাসরি একক <code>.exe</code> ফাইল তৈরি করতে
              চান, তবে প্রজেক্টের রুট ডিরেক্টরিতে ইলেকট্রন ফাইল <code>electron-main.cjs</code> প্রস্তুত আছে।
            </p>

            <div className="p-3 bg-neutral-900 rounded-lg border border-neutral-800 font-mono text-[11px] text-emerald-400 flex items-center justify-between">
              <code>npm install &amp;&amp; npx electron-builder --win portable</code>
              <button
                onClick={handleCopyCommand}
                className="px-2 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded text-[10px] font-sans font-semibold transition"
              >
                {copiedCmd ? 'কপি হয়েছে!' : 'কমান্ড কপি করুন'}
              </button>
            </div>

            <p className="text-[11px] text-neutral-500">
              কমান্ড রান করলেই <code>dist/</code> ফোল্ডারে পোর্টেবল <strong>Viral-4K-Thumbnail-Studio.exe</strong> তৈরি হবে।
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-neutral-950 border-t border-neutral-800 flex items-center justify-between text-xs">
          <div className="text-neutral-400 flex items-center gap-1.5">
            <Monitor className="w-4 h-4 text-blue-400" />
            <span>Windows 11 / Windows 10 / Windows 8 সামঞ্জস্যপূর্ণ</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white font-semibold transition"
          >
            বন্ধ করুন (Close)
          </button>
        </div>
      </div>
    </div>
  );
};
