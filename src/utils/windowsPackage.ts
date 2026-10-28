import JSZip from 'jszip';

export async function downloadWindowsLauncherPackage(appUrl: string) {
  const zip = new JSZip();

  const targetUrl = appUrl || window.location.origin;

  // 1. Windows Batch Launcher (.bat)
  const batContent = `@echo off
title Viral 4K YouTube Thumbnail Studio
echo ======================================================
echo    Starting Viral 4K YouTube Thumbnail Studio...
echo ======================================================

:: Launch in native standalone window without browser UI
start msedge.exe --app="${targetUrl}" 2>nul || start chrome.exe --app="${targetUrl}" 2>nul || start "" "${targetUrl}"
exit
`;

  // 2. Silent VBS Launcher (no command prompt window)
  const vbsContent = `Set WshShell = CreateObject("WScript.Shell")
WshShell.Run "msedge.exe --app=""" & "${targetUrl}" & """", 1, False
`;

  // 3. Desktop Shortcut Creator Script (.vbs)
  const shortcutCreatorContent = `Set WshShell = CreateObject("WScript.Shell")
strDesktop = WshShell.SpecialFolders("Desktop")
Set oShortcut = WshShell.CreateShortcut(strDesktop & "\\Viral 4K Thumbnail Studio.lnk")
oShortcut.TargetPath = "msedge.exe"
oShortcut.Arguments = "--app=""" & "${targetUrl}" & """"
oShortcut.Description = "Viral 4K YouTube Thumbnail Studio (Desktop App)"
oShortcut.Save

MsgBox "সফল হয়েছে! আপনার Windows Desktop এ 'Viral 4K Thumbnail Studio' শর্টকাট তৈরি হয়েছে।" & vbCrLf & "এখন ডেস্কটপ আইকনে ক্লিক করে সরাসরি সফটওয়্যারটি ব্যবহার করতে পারবেন।", vbInformation, "Thumbnail Studio Windows Setup"
`;

  // 4. Instructions in Bengali & English
  const readmeContent = `====================================================================
  VIRAL 4K YOUTUBE THUMBNAIL STUDIO - WINDOWS DESKTOP SETUP GUIDE
====================================================================

বাংলা নির্দেশিকা (BENGALI INSTRUCTIONS):
--------------------------------------------------------------------
১. 'Create-Desktop-Shortcut.vbs' ফাইলে ডাবল ক্লিক করুন:
   - এটি আপনার Windows Desktop-এ একটি সরাসরি শর্টকাট সফটওয়্যার আইকন তৈরি করবে।
   - এখন থেকে যেকোনো সময় ডেস্কটপ থেকে এক ক্লিকেই সফটওয়্যারটি ফুলস্ক্রিন অ্যাপ মোডে ওপেন হবে।

২. অথবা সরাসরি 'Launch-Thumbnail-Studio.bat' ফাইলে ডাবল ক্লিক করুন:
   - এটি ব্রাউজারের কোনো অ্যাড্রেস বার বা ট্যাব ছাড়া একদম রিয়েল উইন্ডোজ সফটওয়্যার উইন্ডো হিসেবে ওপেন হবে।

৩. ব্রাউজার থেকে সরাসরি ইনস্টল করতে:
   - আপনার ক্রোম (Chrome) বা এজ (Edge) ব্রাউজারের উপরে ডানদিকের "Install App" বা "ডেস্কটপে ইনস্টল করুন" বাটনে ক্লিক করুন।
   - উইন্ডোজ স্বয়ংক্রিয়ভাবে এটিকে Windows Start Menu এবং Taskbar-এ পিন করে দেবে।

OFFLINE STANDALONE EXE BUILD (ELECTRON):
--------------------------------------------------------------------
আপনি যদি সম্পূর্ণ অফলাইন standalone .exe ফাইল কম্পাইল করতে চান:
১. এই প্রজেক্ট ফোল্ডারে টার্মিনাল ওপেন করুন
২. রান করুন: npm install
৩. রান করুন: npx electron-builder --win portable
৪. dist/ ফোল্ডারে আপনার 'Viral-4K-Thumbnail-Studio.exe' রেডি হয়ে যাবে!

App URL: ${targetUrl}
Enjoy 4K YouTube Thumbnail Creation!
`;

  zip.file('Launch-Thumbnail-Studio.bat', batContent);
  zip.file('Launch-Thumbnail-Studio.vbs', vbsContent);
  zip.file('Create-Desktop-Shortcut.vbs', shortcutCreatorContent);
  zip.file('README-বাংলা-WINDOWS.txt', readmeContent);

  const blob = await zip.generateAsync({ type: 'blob' });
  const downloadUrl = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = downloadUrl;
  a.download = 'Viral-4K-Thumbnail-Studio-Windows.zip';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(downloadUrl);
}

export function downloadStandaloneBat(appUrl: string) {
  const targetUrl = appUrl || window.location.origin;
  const batContent = `@echo off
title Viral 4K YouTube Thumbnail Studio
echo Starting Viral 4K YouTube Thumbnail Studio in Native Desktop Window...
start msedge.exe --app="${targetUrl}" 2>nul || start chrome.exe --app="${targetUrl}" 2>nul || start "" "${targetUrl}"
exit
`;
  const blob = new Blob([batContent], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'Launch-Thumbnail-Studio.bat';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
