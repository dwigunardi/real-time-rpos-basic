import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateUserForm, createUserSchemaForm } from "@/validations/user-schema";
import { INITIAL_CREATE_USER_VALUE } from "@/constants/user-constants";
import { toast } from "sonner";
import { createUserAction } from "@/actions/users/create-user-action";
import { CreateUserInput } from "@/types/user";
import { useApiMutation } from "@/lib/api/api-mutation";
import { useState } from "react";
import { uploadFile } from "@/actions/storage/storage-action";
import FormUser from "../bundle/form-user";
import { Preview } from "@/types/general";

export default function DialogCreateUser({ refetch }: { refetch: () => void }) {
    const form = useForm<CreateUserForm>({
        resolver: zodResolver(createUserSchemaForm),
        defaultValues: INITIAL_CREATE_USER_VALUE,
    })

    const [preview, setPreview] = useState<Preview>(null);

    const createUser = useApiMutation(
        async (payload: CreateUserInput) => {
            let avatar_url = payload.avatar_url || '';
            if (preview?.file) {
                // Upload avatar image
                const uploadRes = await uploadFile({
                    bucket: 'images',
                    path: 'users',
                    file: preview.file,
                });
                avatar_url = uploadRes.data.url;
            }

            const input = {
                name: payload.name,
                email: payload.email,
                role: payload.role,
                password: payload.password,
                avatar_url: avatar_url || '',
            };
            return createUserAction(input);
        },
        {
            onSuccess: () => {
                toast.success('User created successfully');
                form.reset();
                setPreview(null);
                document.querySelector<HTMLButtonElement>('[data-state="open"]')?.click();
                refetch();
            },
        },
    );

    const onSubmit = form.handleSubmit((data) => {
        createUser.mutate(data);
    });

    return (
        <FormUser
            form={form}
            onSubmit={onSubmit}
            isLoading={createUser.isPending}
            type="Create"
            preview={preview}
            setPreview={setPreview}
        />
    )
}