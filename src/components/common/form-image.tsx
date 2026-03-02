import { FieldValues, Path, UseFormReturn } from 'react-hook-form';
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { FileImage } from 'lucide-react';
import { getImageData } from '@/utils/image-handle';
import { useEffect } from 'react';

export default function FormImage<T extends FieldValues>({
    form,
    name,
    label,
    preview,
    setPreview,
}: {
    form: UseFormReturn<T>;
    name: Path<T>;
    label: string;
    preview?: {
        file: File;
        displayUrl: string;
    } | null;
    setPreview?: (preview: { file: File; displayUrl: string } | null) => void;
}) {

    useEffect(() => {
        return () => {
            if (preview?.displayUrl) {
                URL.revokeObjectURL(preview.displayUrl);
            }
        };
    }, [preview?.displayUrl])

    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field: { onChange, ...rest } }) => (
                <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                        <div className="flex items-center gap-2">
                            <Avatar className="h-9 w-9 rounded-lg">
                                <AvatarImage
                                    src={preview?.displayUrl}
                                    alt="preview"
                                    className="object-cover"
                                />
                                <AvatarFallback className="rounded-lg">
                                    <FileImage className="w-4 h-4" />
                                </AvatarFallback>
                            </Avatar>
                            <Input
                                type="file"
                                name={rest.name}
                                ref={rest.ref}
                                onBlur={rest.onBlur}
                                disabled={rest.disabled}
                                onChange={async (event) => {
                                    if (preview?.displayUrl) {
                                        URL.revokeObjectURL(preview.displayUrl);
                                    }
                                    const files = event.target.files;
                                    if (!files || files.length === 0) {
                                        setPreview?.(null);
                                        onChange(null);
                                        return;
                                    }
                                    onChange(event);
                                    const { file, displayUrl } = getImageData(event);
                                    if (file && displayUrl) {
                                        setPreview?.({
                                            file,
                                            displayUrl,
                                        });
                                    }
                                }}
                            />
                        </div>
                    </FormControl>
                    <FormMessage className="text-xs" />
                </FormItem>
            )}
        />
    );
}