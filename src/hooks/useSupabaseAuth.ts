import { useCallback, useState } from 'react';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { Platform } from 'react-native';

import { supabase } from '../lib/supabase';

export function useSupabaseAuth() {
  const [loading, setLoading] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const signInWithGoogle = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (Platform.OS === 'web') {
        // On web, use redirect-based OAuth
        console.log('🌐 Web OAuth: Using redirect');
        const { error: signInError } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: window.location.origin,
          },
        });

        if (signInError) {
          throw signInError;
        }

        // The page will redirect, so we don't need to do anything else
        return null;
      } else {
        // On mobile, use WebBrowser
        const redirectTo = AuthSession.makeRedirectUri({
          scheme: 'nofatcommunity',
          path: 'auth/callback',
        });

        console.log('🔐 Mobile OAuth with redirect:', redirectTo);

        const { data, error: signInError } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: { redirectTo },
        });

        console.log('📱 OAuth response:', { data, error: signInError });

        if (signInError) {
          throw signInError;
        }

        if (data?.url) {
          console.log('🌐 Opening auth URL:', data.url);
          const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
          console.log('✅ Auth session result:', result);
        }

        // Wait a bit for the session to be established
        await new Promise(resolve => setTimeout(resolve, 1000));

        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        console.log('🔑 Session data:', {
          hasSession: !!sessionData.session,
          hasUser: !!sessionData.session?.user,
          error: sessionError
        });

        if (sessionError) {
          throw sessionError;
        }

        const token = sessionData.session?.access_token ?? null;
        console.log('🎫 Access token:', token ? 'Present' : 'Missing');
        setAccessToken(token);
        return token;
      }
    } catch (e: any) {
      const message = e?.message ?? 'Authentication error';
      console.error('❌ Auth error:', message, e);
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { signInWithGoogle, accessToken, loading, error };
}
