'use client'
import * as React from "react"

import { cn } from "@/lib/utils"
import { Input } from "./input"
import { EyeClosed, EyeIcon } from "lucide-react"

function PasswordInput({ className, type, ...props }: React.ComponentProps<"input">) {
    const [passwordVisible, setPasswordVisible] = React.useState(false)
  return (
    <Input 
      type={type === "password" && passwordVisible ? "text" : "password"}
      className={className}
      placeholder={passwordVisible ? "Visible Password" : "************"}
      suffix={passwordVisible ? <EyeIcon onClick={() => setPasswordVisible(false)} className="cursor-pointer"/> : <EyeClosed onClick={() => setPasswordVisible(true)} className="cursor-pointer"/>}
      {...props}
    />
  )
}

export { PasswordInput }
