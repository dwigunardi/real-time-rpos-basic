import { INITIAL_STATE_PROFILE } from "@/constants/auth-constants";
import { User } from "@supabase/supabase-js";
import { create } from "zustand";
import { Profile } from "@/types/auth";

type AuthState = {
    user: User | null;
    profile: Profile | null;
    InitialProfile?: Profile;
    setUser: (user: User | null) => void
    setProfile: (profile: Profile | null) => void
    setInitialProfile: (profile: Profile) => void
    clear: () => void
    isHydrated: boolean
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    profile: INITIAL_STATE_PROFILE,
    isHydrated: false,
    InitialProfile: INITIAL_STATE_PROFILE,
    setUser: (user) => set({ user }),
    setProfile: (profile) => set({ profile, isHydrated: true }),
    clear: () => set({ user: null, profile: INITIAL_STATE_PROFILE, isHydrated: false }),
    setInitialProfile: (profile) => set({ InitialProfile: profile }),
}))