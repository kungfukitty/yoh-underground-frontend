import { SelectHTMLAttributes } from "react";
export default function Select({ className = "", children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-brand/30 ${className}`}>{children}</select>;
}
