"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { ensureUserExists, getRedirectUrl } from "@/lib/auth-utils";
import { CheckCircle2, XCircle, Clock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type ConfirmationStatus = 
  | "verifying"
  | "success"
  | "expired"
  | "already_confirmed"
  | "error"
  | "oauth_success";

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [confirmationStatus, setConfirmationStatus] = useState<ConfirmationStatus>("verifying");
  const [statusMessage, setStatusMessage] = useState<string>("Verifying your email...");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");

  useEffect(() => {
    let cancelled = false;
    let authListener: { data: { subscription: any } } | null = null;
    let redirectTimeout: NodeJS.Timeout | null = null;

    const handleCallback = async () => {
      try {
        // Check for error in URL params (OAuth errors)
        const error = searchParams.get("error");
        const errorDescription = searchParams.get("error_description");
        
        if (error) {
          setConfirmationStatus("error");
          setStatusMessage("Authentication Error");
          setErrorMessage(errorDescription || error);
          
          redirectTimeout = setTimeout(() => {
            router.replace("/auth?error=" + encodeURIComponent(errorDescription || error));
          }, 5000);
          return;
        }

        // Check if this is an email confirmation (hash fragment in URL)
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const type = hashParams.get("type");
        const accessToken = hashParams.get("access_token");
        const isEmailConfirmation = type === "signup" || type === "recovery" || (accessToken && !searchParams.has("code"));

        // Handle email confirmation and OAuth callbacks
        setStatusMessage("Verifying your email...");
        
        // Get session - this will parse hash fragments from email confirmations
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (cancelled) return;

        if (sessionError) {
          // Check if it's an expired token
          if (sessionError.message.includes("expired") || sessionError.message.includes("invalid") || sessionError.message.includes("token")) {
            setConfirmationStatus("expired");
            setStatusMessage("Link Expired");
            setErrorMessage("This confirmation link has expired. Please request a new confirmation email.");
            
            redirectTimeout = setTimeout(() => {
              router.replace("/auth?error=" + encodeURIComponent("Confirmation link expired"));
            }, 5000);
          } else {
            setConfirmationStatus("error");
            setStatusMessage("Verification Failed");
            setErrorMessage(sessionError.message);
            
            redirectTimeout = setTimeout(() => {
              router.replace("/auth?error=" + encodeURIComponent(sessionError.message));
            }, 5000);
          }
          return;
        }

        if (session) {
          const user = session.user;
          setUserEmail(user.email || "");
          
          // Check if email was just confirmed
          if (isEmailConfirmation && user.email_confirmed_at) {
            setConfirmationStatus("success");
            setStatusMessage("Email Confirmed Successfully!");
          } else if (user.email_confirmed_at) {
            // Already confirmed (might be OAuth or already verified)
            setConfirmationStatus("oauth_success");
            setStatusMessage("Sign In Successful");
          } else {
            setConfirmationStatus("success");
            setStatusMessage("Email Confirmed Successfully!");
          }
          
          // Ensure user exists in database
          await ensureUserExists(user);
          
          // Get appropriate redirect URL
          const redirectUrl = await getRedirectUrl(user.id);
          // Show success message for 2 seconds before redirecting
          redirectTimeout = setTimeout(() => {
            router.replace(redirectUrl);
          }, 2000);
        } else {
          // No session yet - set up auth state change listener
          // This handles email confirmations that might take a moment
          setStatusMessage("Processing confirmation...");
          
          authListener = supabase.auth.onAuthStateChange(async (event, session) => {
            if (cancelled) return;
            if (event === "SIGNED_IN" && session) {
              const user = session.user;
              setUserEmail(user.email || "");
              
              if (isEmailConfirmation) {
                setConfirmationStatus("success");
                setStatusMessage("Email Confirmed Successfully!");
              } else {
                setConfirmationStatus("oauth_success");
                setStatusMessage("Sign In Successful");
              }
              
              try {
                await ensureUserExists(user);
                const redirectUrl = await getRedirectUrl(user.id);
                redirectTimeout = setTimeout(() => {
                  router.replace(redirectUrl);
                }, 2000);
              } catch (error: any) {
                setConfirmationStatus("error");
                setStatusMessage("Setup Error");
                setErrorMessage(error.message || "Failed to set up your account");
                
                redirectTimeout = setTimeout(() => {
                  router.replace("/auth?error=" + encodeURIComponent(error.message || "Authentication failed"));
                }, 5000);
              }
            } else if (event === "SIGNED_OUT") {
              setConfirmationStatus("error");
              setStatusMessage("Authentication Failed");
              setErrorMessage("Your session was terminated. Please try again.");
              
              redirectTimeout = setTimeout(() => {
                router.replace("/auth?error=" + encodeURIComponent("Authentication failed"));
              }, 5000);
            }
          });

          // Fallback: if no auth state change after 5 seconds, check session again
          setTimeout(async () => {
            if (cancelled) return;
            
            const { data: { session: retrySession } } = await supabase.auth.getSession();
            if (retrySession) {
              const user = retrySession.user;
              setUserEmail(user.email || "");
              setConfirmationStatus("success");
              setStatusMessage("Email Confirmed Successfully!");
              
              try {
                await ensureUserExists(user);
                const redirectUrl = await getRedirectUrl(user.id);
                
                redirectTimeout = setTimeout(() => {
                  router.replace(redirectUrl);
                }, 2000);
              } catch (error: any) {
                setConfirmationStatus("error");
                setStatusMessage("Setup Error");
                setErrorMessage(error.message || "Failed to set up your account");
                
                redirectTimeout = setTimeout(() => {
                  router.replace("/auth?error=" + encodeURIComponent("Authentication timeout"));
                }, 5000);
              }
            } else {
              // Check if we have hash params but no session (expired/invalid token)
              if (isEmailConfirmation) {
                setConfirmationStatus("expired");
                setStatusMessage("Link Expired");
                setErrorMessage("This confirmation link has expired or is invalid. Please request a new confirmation email.");
              } else {
                setConfirmationStatus("error");
                setStatusMessage("Verification Failed");
                setErrorMessage("No session found. Please try signing in again.");
              }
              
              redirectTimeout = setTimeout(() => {
                router.replace("/auth?error=" + encodeURIComponent("No session found. Please try signing in again."));
              }, 5000);
            }
          }, 5000);
        }
      } catch (error: any) {
        setConfirmationStatus("error");
        setStatusMessage("Error");
        setErrorMessage(error.message || "Authentication failed");
        
        redirectTimeout = setTimeout(() => {
          router.replace("/auth?error=" + encodeURIComponent(error.message || "Authentication failed"));
        }, 5000);
      }
    };
    
    handleCallback();
    
    return () => {
      cancelled = true;
      if (authListener) {
        authListener.data.subscription.unsubscribe();
      }
      if (redirectTimeout) {
        clearTimeout(redirectTimeout);
      }
    };
  }, [router, searchParams]);

  const renderStatusCard = () => {
    switch (confirmationStatus) {
      case "verifying":
        return (
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              </div>
              <CardTitle>{statusMessage}</CardTitle>
              <CardDescription>Please wait while we verify your email...</CardDescription>
            </CardHeader>
          </Card>
        );

      case "success":
        return (
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4">
                <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto" />
              </div>
              <CardTitle className="text-2xl text-green-600 dark:text-green-400">
                {statusMessage}
              </CardTitle>
              <CardDescription>
                {userEmail && `Your email ${userEmail} has been verified.`}
                <br />
                Redirecting you to your dashboard...
              </CardDescription>
            </CardHeader>
          </Card>
        );

      case "oauth_success":
        return (
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4">
                <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto" />
              </div>
              <CardTitle className="text-2xl text-green-600 dark:text-green-400">
                {statusMessage}
              </CardTitle>
              <CardDescription>
                {userEmail && `Welcome back, ${userEmail}!`}
                <br />
                Redirecting you to your dashboard...
              </CardDescription>
            </CardHeader>
          </Card>
        );

      case "expired":
        return (
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4">
                <Clock className="h-16 w-16 text-orange-500 mx-auto" />
              </div>
              <CardTitle className="text-2xl text-orange-600 dark:text-orange-400">
                {statusMessage}
              </CardTitle>
              <CardDescription className="space-y-4">
                <p>{errorMessage || "This confirmation link has expired."}</p>
                <p className="text-sm">Please request a new confirmation email by signing up again.</p>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                className="w-full"
                onClick={() => router.push("/auth")}
              >
                Go to Sign In
              </Button>
            </CardContent>
          </Card>
        );

      case "error":
        return (
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4">
                <XCircle className="h-16 w-16 text-red-500 mx-auto" />
              </div>
              <CardTitle className="text-2xl text-red-600 dark:text-red-400">
                {statusMessage}
              </CardTitle>
              <CardDescription className="space-y-4">
                <p>{errorMessage || "An error occurred during verification."}</p>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                className="w-full"
                onClick={() => router.push("/auth")}
              >
                Go to Sign In
              </Button>
            </CardContent>
          </Card>
        );

      default:
        return (
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4">
                <AlertCircle className="h-16 w-16 text-muted-foreground mx-auto" />
              </div>
              <CardTitle>Unknown Status</CardTitle>
              <CardDescription>Please try again.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                className="w-full"
                onClick={() => router.push("/auth")}
              >
                Go to Sign In
              </Button>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-br from-background via-primary/5 to-background p-4">
      {renderStatusCard()}
    </div>
  );
}

function AuthCallbackFallback() {
  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-br from-background via-primary/5 to-background">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}

export default function AuthCallback() {
  return (
    <Suspense fallback={<AuthCallbackFallback />}>
      <AuthCallbackContent />
    </Suspense>
  );
}
