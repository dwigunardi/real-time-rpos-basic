'use client'

import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/stores/auth-store";
import { Profile } from "@/types/auth";
import { User } from "@supabase/supabase-js";
import { ReactNode, useEffect } from "react";

export default function AuthStoreProvider({
    children, profile, user
}: {
    children: ReactNode; profile: Profile | null, user: User | null
}) {

    useEffect(() => {
        useAuthStore.getState().setUser(user);
        useAuthStore.getState().setProfile(profile);
    }, [profile])

    return <>{children}</>
}