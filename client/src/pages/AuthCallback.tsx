import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Loader2, CheckCircle, XCircle, Mail, AlertTriangle } from 'lucide-react';

export function AuthCallback() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isExpiredLink, setIsExpiredLink] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handleResendConfirmation = async () => {
    if (!userEmail) {
      setError('No email address available. Please go back to login and try again.');
      return;
    }
    
    setResendLoading(true);
    setError(null);
    try {
      const siteUrl = import.meta.env.VITE_SITE_URL || window.location.origin;
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: userEmail,
        options: {
          emailRedirectTo: `${siteUrl}/auth/callback`
        }
      });
      
      if (error) {
        setError(`Failed to resend confirmation email: ${error.message}`);
      } else {
        setResendSuccess(true);
        setError(null);
      }
    } catch (err: any) {
      setError(`Failed to resend confirmation email: ${err.message}`);
    } finally {
      setResendLoading(false);
    }
  };

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Check for error parameters in URL
        const errorParam = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');
        
        if (errorParam === 'access_denied' && errorDescription?.includes('expired')) {
          setIsExpiredLink(true);
          setError('Your email confirmation link has expired. Please request a new one.');
          setLoading(false);
          return;
        }

        if (errorParam) {
          setError(`Authentication error: ${errorDescription || errorParam}`);
          setLoading(false);
          return;
        }

        // Try to get the session
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          setError('Failed to verify email. Please try again.');
          setLoading(false);
          return;
        }

        if (data.session) {
          setSuccess(true);
          setUserEmail(data.session.user?.email || null);
          // Wait a moment to show success message, then redirect
          setTimeout(() => {
            navigate('/');
          }, 2000);
        } else {
          setError('Email verification failed. Please try again.');
        }
      } catch (err) {
        setError('An unexpected error occurred. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    handleAuthCallback();
  }, [navigate, searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-4" />
            <p className="text-center text-gray-600">Verifying your email...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900">
            Email Verification
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center p-8">
          {success ? (
            <>
              <CheckCircle className="h-12 w-12 text-green-600 mb-4" />
              <p className="text-center text-green-600 font-medium mb-2">
                Email verified successfully!
              </p>
              <p className="text-center text-gray-600 text-sm">
                Redirecting you to the dashboard...
              </p>
            </>
          ) : (
            <>
              {isExpiredLink ? (
                <AlertTriangle className="h-12 w-12 text-orange-600 mb-4" />
              ) : (
                <XCircle className="h-12 w-12 text-red-600 mb-4" />
              )}
              <p className="text-center font-medium mb-2">
                {isExpiredLink ? 'Link Expired' : 'Verification Failed'}
              </p>
              <p className="text-center text-gray-600 text-sm mb-4">
                {error || 'Something went wrong. Please try again.'}
              </p>
              
              {isExpiredLink && (
                <div className="space-y-3 mb-4">
                  {resendSuccess ? (
                    <div className="flex items-center justify-center gap-2 text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      <span className="text-sm">New confirmation email sent!</span>
                    </div>
                  ) : (
                    <Button
                      onClick={handleResendConfirmation}
                      disabled={resendLoading}
                      className="w-full"
                    >
                      {resendLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Mail className="mr-2 h-4 w-4" />
                          Send New Confirmation Email
                        </>
                      )}
                    </Button>
                  )}
                </div>
              )}
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => navigate('/login')}
                  className="flex-1"
                >
                  Back to Login
                </Button>
                <Button
                  onClick={() => navigate('/')}
                  className="flex-1"
                >
                  Go to Home
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
