import { FieldValues, Path, UseFormReturn } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { PasswordInput } from "../ui/password-input";
import { Textarea } from "../ui/textarea";

type FormInputProps<T extends FieldValues> = {
    form: UseFormReturn<T>;
    name: Path<T>;
    label: string;
    placeholder?: string;
    type?: string;
    autoComplete?: string;
    suffix?: React.ReactNode;
    fieldType?: "input" | "password";
}

export default function FormInput<T extends FieldValues>(
    { form, name, label, placeholder, type = "text", autoComplete = "off", suffix, fieldType }: FormInputProps<T>
) {
    return (
        <FormField control={form.control} name={name} render={({ field: { ...rest } }) => (
            <FormItem>
                <FormLabel>{label}</FormLabel>
                <FormControl>
                    {type === 'textarea' ? (
                        <Textarea
                            {...rest}
                            placeholder={placeholder}
                            autoComplete={autoComplete}
                            className="resize-none"
                        />
                    ) : fieldType && fieldType === 'password' ? (
                        <PasswordInput
                            {...rest}
                            type={type}
                            placeholder={placeholder}
                            autoComplete={autoComplete}
                        />
                    ) : (
                        <Input
                            {...rest}
                            type={type}
                            placeholder={placeholder}
                            autoComplete={autoComplete}
                            suffix={suffix}
                        />
                    )}
                </FormControl>
                <FormMessage className="text-xs" />
            </FormItem>
        )}
        />
    )
}