"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { ensureUserExists, getRedirectUrl } from "@/lib/auth-utils";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;
    const handleCallback = async () => {
      try {
        // Poll for session for up to 3 seconds
        let session = null;
        let error = null;
        for (let i = 0; i < 6; i++) {
          const result = await supabase.auth.getSession();
          session = result.data?.session;
          error = result.error;
          if (session || error) break;
          await new Promise(res => setTimeout(res, 500));
        }
        
        if (cancelled) return;
        
        if (error) {
          console.error("OAuth callback error:", error.message);
          router.replace("/auth?error=" + encodeURIComponent(error.message));
          return;
        }
        
        if (session) {
          const user = session.user;
          
          // Ensure user exists in database
          await ensureUserExists(user);
          
          // Get appropriate redirect URL
          const redirectUrl = await getRedirectUrl(user.id);
          router.replace(redirectUrl);
        } else {
          router.replace("/auth?error=" + encodeURIComponent("No session found"));
        }
      } catch (error: any) {
        console.error("Callback error:", error);
        router.replace("/auth?error=" + encodeURIComponent(error.message || "Authentication failed"));
      }
    };
    
    handleCallback();
    return () => { cancelled = true; };
  }, [router]);

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
        <p className="text-gray-600">Finishing sign in…</p>
      </div>
    </div>
  );
}
