import { ChangeEvent, KeyboardEventHandler } from 'react'

export interface LabeledInputProps {
  label: string;
  placeholder: string | undefined;
  value: string;
  onChange: (e:ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
}

export default function LabeledInput({
  label,
  placeholder,
  value,
  onChange,
  onSubmit,
}: LabeledInputProps) {

  const inputName = label.toLocaleLowerCase()

  const handleKeyUp:KeyboardEventHandler<HTMLInputElement> = event => {
    event.preventDefault()
    if (event.key === "Enter") {
      onSubmit()
    }
  }

  return (
    <>
      <label
        htmlFor={inputName}
      >{label}</label>
      <input
        type="text"
        name={inputName}
        placeholder={placeholder}
        onKeyUp={handleKeyUp}
        value={value}
        onChange={onChange}
      />
  </>
  )
}