'use client'

import { loginAction } from "@/actions/login";
import FormInput from "@/components/common/form-input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { INITIAL_LOGIN_VALUES, INITIAL_STATE_LOGIN_FORM} from "@/constants/auth-constants";
import { STATUS_CONSTANTS } from "@/constants/status-constants";
import { AuthFormState } from "@/types/auth";
import { LoginForm, authSchema } from "@/validations/auth-validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { startTransition, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function Login() {
    const form = useForm<LoginForm>({
        resolver: zodResolver(authSchema),
        defaultValues: INITIAL_LOGIN_VALUES,
    })

    const [loginState, initLogin, isPendingLogin] = useActionState<AuthFormState, FormData | null>(loginAction, INITIAL_STATE_LOGIN_FORM);

    const onSubmit = form.handleSubmit(async (data) => {
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            formData.append(key, value);
        })

        startTransition(() => {
            initLogin(formData);
        });
    })

    useEffect(() => {
        if (loginState?.status === STATUS_CONSTANTS.ERROR) {
            toast.error('Login failed. Please try again.', {
                description: loginState?.errors?._form?.[0],
                position: 'top-center',
                duration: 2000,
            });
            startTransition(() => {
                initLogin(null)
            })
        }
    }, [loginState])

    return (
        <Card>
            <CardHeader className="text-center">
                <CardTitle className="text-xl font-bold">Welcome</CardTitle>
                <CardDescription>Login to accesss all features</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={onSubmit} className="space-y-4">
                        <FormInput form={form} name="email" label="Email" placeholder="Enter your email" type="email" fieldType={"input"} />
                        <FormInput form={form} name="password" label="Password" placeholder="*******" type="password" fieldType={"password"} />
                        <Button type="submit" className="w-full cursor-pointer">{isPendingLogin ? <Loader2 className="animate-spin" /> : 'Login'}</Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}