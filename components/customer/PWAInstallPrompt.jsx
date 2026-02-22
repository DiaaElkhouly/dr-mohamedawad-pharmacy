"use client";

import { useState, useEffect } from "react";
import Button from "@/components/ui/Button";

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    let mounted = true;

    const init = () => {
      // Check if already installed (standalone mode)
      const isStandaloneMode = window.matchMedia(
        "(display-mode: standalone)",
      ).matches;

      // Check if it's iOS
      const isIOSDevice =
        /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

      // Check if Android
      const isAndroid = /Android/.test(navigator.userAgent);

      // Check for mobile using user agent or screen size
      const isMobileByAgent =
        /Mobile|Android|iPhone|iPad|iPod|Windows Phone|BlackBerry|Opera Mini|IEMobile/.test(
          navigator.userAgent,
        );
      const isMobileBySize = window.innerWidth <= 1024;
      const isTouchDevice =
        "ontouchstart" in window || navigator.maxTouchPoints > 0;

      if (!mounted) return;

      setIsStandalone(isStandaloneMode);
      setIsIOS(isIOSDevice);

      if (isStandaloneMode) {
        console.log("App is already installed (standalone mode)");
        return;
      }

      // Show on mobile devices (detected by agent, size, or touch)
      const isMobile =
        isIOSDevice ||
        isAndroid ||
        isMobileByAgent ||
        (isMobileBySize && isTouchDevice);

      console.log("Device detection:", {
        isIOSDevice,
        isAndroid,
        isMobileByAgent,
        isMobileBySize,
        isTouchDevice,
        isMobile,
        userAgent: navigator.userAgent,
        width: window.innerWidth,
      });

      // Listen for beforeinstallprompt event (Android/Chrome)
      const handleBeforeInstallPrompt = (e) => {
        e.preventDefault();
        setDeferredPrompt(e);
        setIsVisible(true);
        console.log("beforeinstallprompt event fired");
      };

      window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

      const handleAppInstalled = () => {
        setIsVisible(false);
        setDeferredPrompt(null);
        console.log("PWA was installed");
      };

      window.addEventListener("appinstalled", handleAppInstalled);

      // Show prompt for mobile devices after a short delay
      let timer;
      if (isMobile) {
        timer = setTimeout(() => {
          const hasSeenPrompt = localStorage.getItem("pwa-prompt-seen");
          if (!hasSeenPrompt && mounted) {
            console.log("Showing PWA install prompt");
            setIsVisible(true);
          }
        }, 1500);
      }

      return () => {
        window.removeEventListener(
          "beforeinstallprompt",
          handleBeforeInstallPrompt,
        );
        window.removeEventListener("appinstalled", handleAppInstalled);
        if (timer) clearTimeout(timer);
      };
    };

    // Small delay to ensure window is fully loaded
    const initTimer = setTimeout(init, 100);

    return () => {
      mounted = false;
      clearTimeout(initTimer);
    };
  }, []);

  const handleInstallClick = async () => {
    console.log("Install button clicked", { deferredPrompt });

    if (!deferredPrompt) {
      // If no deferred prompt, show instructions for manual installation
      alert(
        "لتثبيت التطبيق:\n\n" +
          "Android:\n" +
          "1. اضغط على القائمة (ثلاث نقاط) في المتصفح\n" +
          "2. اختر 'إضافة إلى الشاشة الرئيسية'\n\n" +
          "iPhone:\n" +
          "1. اضغط على زر المشاركة (Share)\n" +
          "2. اختر 'إضافة إلى الشاشة الرئيسية'",
      );
      setIsVisible(false);
      return;
    }

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      console.log("User accepted the install prompt");
    } else {
      console.log("User dismissed the install prompt");
    }

    // Clear the deferred prompt
    setDeferredPrompt(null);
    setIsVisible(false);
  };

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem("pwa-prompt-seen", "true");
  };

  const handleIOSInstall = () => {
    // Show instructions for iOS installation
    alert(
      "لتثبيت التطبيق على iPhone:\n\n" +
        "1. اضغط على زر المشاركة (Share) في أسفل الشاشة\n" +
        "2. اختر 'إضافة إلى الشاشة الرئيسية' (Add to Home Screen)\n" +
        "3. اضغط 'إضافة' (Add)",
    );
    localStorage.setItem("pwa-prompt-seen", "true");
    setIsVisible(false);
  };

  if (!isVisible || isStandalone) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-white rounded-lg shadow-2xl border border-emerald-100 p-4 z-50 animate-slide-up">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
            <svg
              className="w-6 h-6 text-emerald-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
          </div>
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-1">
            تثبيت تطبيق الصيدلية
          </h3>
          <p className="text-sm text-gray-600 mb-3">
            {isIOS
              ? "أضف التطبيق إلى شاشتك الرئيسية للوصول السريع"
              : "ثبت التطبيق للوصول السريع"}
          </p>
          <div className="flex gap-2">
            {isIOS ? (
              <Button
                onClick={handleIOSInstall}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-sm py-2 px-4 rounded-lg transition-colors"
              >
                كيفية التثبيت
              </Button>
            ) : (
              <Button
                onClick={handleInstallClick}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-sm py-2 px-4 rounded-lg transition-colors"
              >
                تثبيت التطبيق
              </Button>
            )}
            <Button
              onClick={handleClose}
              variant="outline"
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border-gray-300 hover:border-gray-400 rounded-lg transition-colors"
            >
              لاحقاً
            </Button>
          </div>
        </div>
        <button
          onClick={handleClose}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="إغلاق"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
