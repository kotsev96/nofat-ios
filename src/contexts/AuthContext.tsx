import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { getProfile, UserProfile } from '../lib/api';

interface AuthContextType {
    session: Session | null;
    user: User | null;
    profile: UserProfile | null;
    loading: boolean;
    signOut: () => Promise<void>;
    refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [session, setSession] = useState<Session | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const fetchingProfilePromise = useRef<Promise<void> | null>(null);
    const initialized = useRef(false);

    // Fetch user profile from backend
    const fetchProfile = async () => {
        if (fetchingProfilePromise.current) {
            console.log('⏳ Profile fetch already in progress, waiting...');
            await fetchingProfilePromise.current;
            return;
        }

        const promise = (async () => {
            try {
                // Логируем текущий токен для отладки
                const { data: { session } } = await supabase.auth.getSession();
                if (session?.access_token) {
                    console.log('🔑 FetchProfile token:', `${session.access_token.substring(0, 12)}...`);
                } else {
                    console.log('⚠️ FetchProfile: no access token');
                }

                const profileData = await getProfile();
                setProfile(profileData);
                console.log('✅ Profile loaded:', profileData);
            } catch (error) {
                // Profile might not exist yet (new user)
                console.log('Profile not found:', error);
                setProfile(null);
            } finally {
                fetchingProfilePromise.current = null;
            }
        })();

        fetchingProfilePromise.current = promise;
        await promise;
    };

    // Initialize session on mount
    useEffect(() => {
        if (initialized.current) return;
        initialized.current = true;
        console.log('🔄 AuthContext: Initializing...');
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            console.log('📦 Initial session:', {
                hasSession: !!session,
                hasUser: !!session?.user,
                userId: session?.user?.id
            });
            setSession(session);
            setUser(session?.user ?? null);

            if (session?.user) {
                fetchProfile().finally(() => setLoading(false));
            } else {
                setLoading(false);
            }
        });

        // Listen for auth changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((event, session) => {
            console.log('🔔 Auth state changed:', event, {
                hasSession: !!session,
                hasUser: !!session?.user,
                userId: session?.user?.id
            });
            setSession(session);
            setUser(session?.user ?? null);

            if (event === 'SIGNED_IN' && session?.user) {
                setLoading(true);
                fetchProfile().finally(() => setLoading(false));
            }
            if (event === 'SIGNED_OUT') {
                setProfile(null);
                setLoading(false);
            }
            // TOKEN_REFRESHED не трогаем профиль, чтобы не ловить цикл
        });

        return () => subscription.unsubscribe();
    }, []);

    const signOut = async () => {
        await supabase.auth.signOut();
        setSession(null);
        setUser(null);
        setProfile(null);
    };

    const refreshProfile = async () => {
        if (user) {
            await fetchProfile();
        }
    };

    const value = {
        session,
        user,
        profile,
        loading,
        signOut,
        refreshProfile,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
