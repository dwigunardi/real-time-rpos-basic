import { DarkModeToggle } from "@/components/common/darkmode-toggle";
import { Coffee } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="relative bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
            <div className="absolute top-4 right-4">
                <DarkModeToggle />
            </div>
            <div className="flex w-full max-w-sm flex-col gap-6">
                <div className="flex items-center self-center font-medium gap-2">
                    <div className="bg-teal-500 flex p-2 rounded-md items-center justify-center">
                        <Coffee className="size-4" />
                    </div>
                    <span className="text-xl">Kumpul Cafe</span>
                </div>
                {children}
            </div>
        </div>
    )
}