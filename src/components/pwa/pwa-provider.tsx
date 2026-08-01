"use client";

import { useEffect, useState, useCallback, useSyncExternalStore } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Download, X } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

// External store for online status (avoids setState in effect)
function useOnlineStatus() {
  return useSyncExternalStore(
    (callback) => {
      window.addEventListener("online", callback);
      window.addEventListener("offline", callback);
      return () => {
        window.removeEventListener("online", callback);
        window.removeEventListener("offline", callback);
      };
    },
    () => navigator.onLine,
    () => true
  );
}

// External store for standalone mode (avoids setState in effect)
function useIsStandalone() {
  return useSyncExternalStore(
    (callback) => {
      const mql = window.matchMedia("(display-mode: standalone)");
      mql.addEventListener("change", callback);
      return () => mql.removeEventListener("change", callback);
    },
    () => window.matchMedia("(display-mode: standalone)").matches,
    () => false
  );
}

export function PWAProvider({ children }: { children: React.ReactNode }) {
  const [installPrompt, setInstallPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallDialog, setShowInstallDialog] = useState(false);
  const isInstalled = useIsStandalone();
  const isOnline = useOnlineStatus();
  const [showOfflineBanner, setShowOfflineBanner] = useState(false);

  // Register service worker
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("SW registered:", registration.scope);
          // Check for updates periodically
          const intervalId = setInterval(() => {
            registration.update();
          }, 60 * 60 * 1000);
          return () => clearInterval(intervalId);
        })
        .catch((error) => {
          console.log("SW registration failed:", error);
        });
    }
  }, []);

  // Listen for install prompt
  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
      setTimeout(() => setShowInstallDialog(true), 3000);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  // Show offline banner when going offline
  useEffect(() => {
    if (!isOnline) {
      setShowOfflineBanner(true);
    }
  }, [isOnline]);

  // Listen for app installed event
  useEffect(() => {
    const handler = () => {
      setInstallPrompt(null);
      setShowInstallDialog(false);
    };

    window.addEventListener("appinstalled", handler);
    return () => window.removeEventListener("appinstalled", handler);
  }, []);

  const handleInstall = useCallback(async () => {
    if (!installPrompt) return;
    await installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === "accepted") {
      console.log("PWA installed");
    }
    setInstallPrompt(null);
    setShowInstallDialog(false);
  }, [installPrompt]);

  const dismissInstall = useCallback(() => {
    setShowInstallDialog(false);
  }, []);

  const dismissOffline = useCallback(() => {
    setShowOfflineBanner(false);
  }, []);

  return (
    <>
      {children}

      {/* Install to Home Screen Dialog */}
      {!isInstalled && (
        <Dialog open={showInstallDialog} onOpenChange={setShowInstallDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Download className="h-5 w-5 text-[#4A148C]" />
                Install Youth Assembly App
              </DialogTitle>
              <DialogDescription>
                Add Youth Church to your home screen for quick access
                and an app-like experience. You&apos;ll be able to access
                content even offline.
              </DialogDescription>
            </DialogHeader>
            <div className="flex items-center justify-center py-4">
              <img
                src="/icons/icon-192x192.png"
                alt="MFM Youth Church"
                className="w-24 h-24 rounded-2xl"
              />
            </div>
            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button
                variant="outline"
                onClick={dismissInstall}
                className="w-full sm:w-auto"
              >
                Not Now
              </Button>
              <Button
                onClick={handleInstall}
                className="w-full sm:w-auto bg-[#4A148C] hover:bg-[#1A0033] text-white"
              >
                <Download className="mr-2 h-4 w-4" />
                Install App
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Offline Banner */}
      {showOfflineBanner && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#D32F2F] text-white p-3 text-center text-sm flex items-center justify-center gap-2 animate-in slide-in-from-bottom-5 duration-300">
          <span>
            You are currently offline. Some features may be limited.
          </span>
          <button
            onClick={dismissOffline}
            className="ml-2 hover:bg-white/20 rounded-full p-1"
            aria-label="Dismiss offline notification"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </>
  );
}