'use server'

import { INITIAL_STATE_LOGIN_FORM, LOGIN_FORM_KEY } from "@/constants/auth-constants"
import { STATUS_CONSTANTS } from "@/constants/status-constants";
import { createClient } from "@/lib/supabase/server";
import { AuthFormState } from "@/types/auth"
import { authSchema } from "@/validations/auth-validation"
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function loginAction(prevState: AuthFormState, formData: FormData | null) {
    
    if (!formData) {
        return INITIAL_STATE_LOGIN_FORM;
    }
    const { EMAIL, PASSWORD } = LOGIN_FORM_KEY;
    const validatedFields = authSchema.safeParse({
        email: formData.get(EMAIL),
        password: formData.get(PASSWORD),
    })

    if (!validatedFields.success) {
        return {
            status: STATUS_CONSTANTS.ERROR,
            errors: {
                ...validatedFields.error.flatten().fieldErrors,
                _form: [],
            }
        }
    }

    const supabase = await createClient();
    const { error, data: { user } } = await supabase.auth.signInWithPassword({
        email: validatedFields.data.email,
        password: validatedFields.data.password,
    })

    if (error) {
        return {
            status: STATUS_CONSTANTS.ERROR,
            errors: {
                ...prevState.errors,
                _form: [error.message],
            },
        }
    }

    const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .single();

    if (profile) {
        const cookieStore = await cookies();
        cookieStore.set('user_profile', JSON.stringify(profile), {
            path: '/' , 
            httpOnly: true , 
            sameSite: 'lax', 
            maxAge: 60 * 60 * 24 * 7 
        });
    }

    revalidatePath('/', 'layout')
    redirect('/admin');
}