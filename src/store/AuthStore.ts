import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User } from '@supabase/supabase-js';

interface AuthState {
    user: User | null;
    profile: any | null; // Can refine this type later if needed
    isRestored: boolean; // Tracks if hydration from localStorage is complete
    setUser: (user: User | null) => void;
    setProfile: (profile: any) => void;
    setRestored: (val: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            profile: null,
            isRestored: false,

            setUser: (user) => set({ user }),
            setProfile: (profile) => set({ profile }),
            setRestored: (val) => set({ isRestored: val }),
        }),
        {
            name: 'foon-auth-storage', // Key in localStorage
            storage: createJSONStorage(() => localStorage),
            onRehydrateStorage: () => (state) => {
                // When hydration finishes, set isRestored to true
                // This allows the UI to know it can start rendering
                state?.setRestored(true);
            },
        }
    )
);
