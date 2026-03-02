'use server'

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"

export async function signOut() {
    const supabase = await createClient()
    const cookieStore = await cookies()
    cookieStore.set("user_profile", JSON.stringify({}), { maxAge: 0 });
    const { error } = await supabase.auth.signOut()
    revalidatePath('/', 'layout')
    if (error) {
        return {
            status: 'error',
            message: 'There was an error signing out',
            error
        }
    }

    return {
        status: 'success',
        message: 'Logout success'
    }
}