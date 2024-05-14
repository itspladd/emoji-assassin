import { ChangeEvent } from 'react'

export interface LabeledInputProps {
  label: string;
  placeholder: string | undefined;
  value: string;
  onChange: (e:ChangeEvent<HTMLInputElement>) => void;
}

export default function LabeledInput({
  label,
  placeholder,
  value,
  onChange
}: LabeledInputProps) {

  const inputName = label.toLocaleLowerCase()

  return (
    <>
      <label
        htmlFor={inputName}
      >{label}</label>
      <input
        type="text"
        name={inputName}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
  </>
  )
}