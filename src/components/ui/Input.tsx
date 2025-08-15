import { InputHTMLAttributes } from "react";
export default function Input({ className = "", ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-brand/30 ${className}`} />;
}
