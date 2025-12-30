import { Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Form } from "../ui/form";
import FormInput from "./form-input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateUserForm, createUserSchemaForm } from "@/validations/user-schema";
import { INITIAL_CREATE_USER_VALUE } from "@/constants/user-constants";
import { toast } from "sonner";
import { createUserAction } from "@/actions/users/create-user-action";
import { CreateUserInput } from "@/types/user";
import { Roles } from "@/constants/role-constants";
import { useApiMutation } from "@/lib/api/api-mutation";

export default function DialogCreateUser({ refetch }: { refetch: () => void }) {
    const form = useForm<CreateUserForm>({
        resolver: zodResolver(createUserSchemaForm),
        defaultValues: INITIAL_CREATE_USER_VALUE,
    })

    const createUser = useApiMutation(
        async (payload: CreateUserInput) => {
            const input = {
                name: payload.name,
                email: payload.email,
                role: payload.role,
                password: payload.password,
                avatar_url: payload.avatar_url || '',
            };
            return createUserAction(input);
        },
        {
            onSuccess: () => {
                toast.success('User created successfully');
                form.reset();
                document.querySelector<HTMLButtonElement>('[data-state="open"]')?.click();
                refetch();
            },
        },
    );

    const onSubmit = form.handleSubmit((data) => {
        createUser.mutate(data);
    });

    return (
        <DialogContent className="sm:max-w-[425px]">
            <Form {...form}>
                <DialogHeader>
                    <DialogTitle>Create User</DialogTitle>
                    <DialogDescription>register a new user</DialogDescription>
                </DialogHeader>
                <form onSubmit={onSubmit} className="space-y-4">
                    <FormInput
                        form={form}
                        name="name"
                        label="Name"
                        placeholder="Insert your name"
                    />
                    <FormInput
                        form={form}
                        name="email"
                        label="Email"
                        placeholder="Insert email here"
                        type="email"
                    />
                    <FormInput
                        form={form}
                        name="role"
                        label="Role"
                        placeholder="Insert your role"
                        type="select"
                        fieldType="select"
                        selectValue={Object.values(Roles)}
                    />
                    <FormInput
                        form={form}
                        name="password"
                        label="Password"
                        placeholder="******"
                        type="password"
                        fieldType="password"
                    />
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="submit">
                            {createUser.isPending ? (
                                <Loader2 className="animate-spin" />
                            ) : (
                                'Create'
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </Form>
        </DialogContent>
    )
}