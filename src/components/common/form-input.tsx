import { FieldValues, Path, UseFormReturn } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { PasswordInput } from "../ui/password-input";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

type FormInputProps<T extends FieldValues> = {
    form: UseFormReturn<T>;
    name: Path<T>;
    label: string;
    placeholder?: string;
    type?: string;
    autoComplete?: string;
    suffix?: React.ReactNode;
    fieldType?: "input" | "password" | "textarea" | "select";
    selectValue?: string[];
}

export default function FormInput<T extends FieldValues>(
    { form, name, label, placeholder, type = "text", autoComplete = "off", suffix, fieldType, selectValue }: FormInputProps<T>
) {
    return (
        <FormField control={form.control} name={name} render={({ field: { ...rest } }) => (
            <FormItem>
                <FormLabel>{label}</FormLabel>
                <FormControl>
                    {type === 'textarea' || fieldType && fieldType === 'textarea' ? (
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
                    ) : type === 'select' && fieldType && fieldType === 'select' ? (
                        <Select onValueChange={rest.onChange} defaultValue={rest.value}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder={placeholder} />
                                </SelectTrigger>
                                <SelectContent className='hover:scrollbar-thumb-primary/80 scrollbar-track-transparent scrollbar-thin scrollbar-thumb-rounded-md'>
                                    {selectValue?.map((option: string, index: number) => (
                                        <SelectItem key={index} value={option} className='hover:bg-cyan-600!'>
                                            {option.slice(0, 1).toUpperCase() + option.slice(1).toLowerCase()}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
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