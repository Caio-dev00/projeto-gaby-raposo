import { RegisterOptions, UseFormRegister } from 'react-hook-form';

interface InputProps {
  type: string;
  placeholder: string;
  name: string;
  register: UseFormRegister;
  error?: string;
  rules?: RegisterOptions;
}

export default function Input({ name, register, type, error, rules, placeholder }: InputProps) {
  return (
    <div>
      <input
        className="block w-full rounded-md border-2 border-gray-400 py-3 px-2 text-gray-600 md:text-sm"
        type={type}
        {...register(name, rules)}
        id={name}
        placeholder={placeholder}
      />
      {error && <p className='my-1 text-red-500'>{error}</p>}
    </div>
  )
}
