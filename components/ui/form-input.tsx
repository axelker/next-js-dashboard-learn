import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: ReactNode;
  error?: string[];
  id: string;
}

export function FormInput({ label, icon, error, className, id, ...props }: FormInputProps) {
  return (
    <div>
      <label
        className="mb-3 mt-5 block text-xs font-medium text-gray-900"
        htmlFor={id}
      >
        {label}
      </label>
      <div className="relative">
        <input
          className={cn(
            "peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500",
            className
          )}
          id={id}
          {...props}
        />
        {icon && (
          <div className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900">
            {icon}
          </div>
        )}
      </div>
      {error && error.length > 0 && (
        <div id={`${id}-error`} aria-live="polite" aria-atomic="true">
          {error.map((err) => (
            <p className="mt-2 text-sm text-red-500" key={err}>
              {err}
            </p>
          ))}
        </div>
      )}
    </div>
  );
} 