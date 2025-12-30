import { INITIAL_STATE_PROFILE } from "@/constants/auth-constants";
import { User } from "@supabase/supabase-js";
import { create } from "zustand";
import { Profile } from "@/types/auth";

type AuthState = {
    user: User | null;
    profile: Profile | null;
    setUser: (user: User | null) => void
    setProfile: (profile: Profile | null) => void
    clear: () => void
    isHydrated: boolean
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    profile: INITIAL_STATE_PROFILE,
    isHydrated: false,
    setUser: (user) => set({ user }),
    setProfile: (profile) => set({ profile, isHydrated: true }),
    clear: () => set({ user: null, profile: INITIAL_STATE_PROFILE, isHydrated: false }),
}))