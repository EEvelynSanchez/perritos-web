"use client"

import { FieldError, UseFormRegisterReturn } from "react-hook-form"

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  registration: UseFormRegisterReturn
  error?: FieldError
  helperText?: string
}

/**
 * Accessible form input component using React Hook Form.
 * Supports error messages, helper text, and ARIA attributes.
 */
export function FormInput({ label, registration, error, helperText, ...props }: FormInputProps) {
  const id = registration.name
  const errorId = error ? `${id}-error` : undefined
  const helperId = helperText ? `${id}-helper` : undefined

  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {props.required && <span className="text-red-600 ml-1" aria-label="required">*</span>}
      </label>
      <input
        id={id}
        {...registration}
        {...props}
        aria-describedby={[errorId, helperId].filter(Boolean).join(" ") || undefined}
        aria-invalid={error ? true : false}
        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          error ? "border-red-500 bg-red-50" : "border-gray-300"
        }`}
      />
      {helperText && (
        <p id={helperId} className="mt-1 text-sm text-gray-500">
          {helperText}
        </p>
      )}
      {error && (
        <p id={errorId} role="alert" className="mt-1 text-sm text-red-600">
          {error.message}
        </p>
      )}
    </div>
  )
}
