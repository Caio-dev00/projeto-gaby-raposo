import { RegisterOptions, UseFormRegister } from 'react-hook-form';

interface InputProps {
  type: string;
  placeholder: string;
  name: string;
  register: UseFormRegister;
  error?: string;
  rules?: RegisterOptions;
}

export default function Input({ name, placeholder, register, type, error, rules }: InputProps) {
  return (
    <div>
      <input
        className="mt-2 w-full border-none rounded-md h-10 px-3 text-1xl"
        type={type}
        placeholder={placeholder}
        {...register(name, rules)}
        id={name}
      />
      {error && <p className='my-1 text-yellow-300'>{error}</p>}
    </div>
  )
}
