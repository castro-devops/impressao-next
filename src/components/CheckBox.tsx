import { useState } from "react";

interface ICheckBox {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const CheckBox: React.FC<ICheckBox> = ({checked = false, onChange}) => {

  const [isChecked, setIsChecked] = useState(checked);

  const handleToggle = () => {
    const newChecked = !isChecked;
    setIsChecked(newChecked);
    if (onChange) onChange(newChecked);
  };

  return (
    <button onClick={handleToggle} className={`h-5 w-5 aspect-square border-2 rounded-full hover:border-black ${isChecked ? 'border-8 border-black' : 'border-neutral-400'} transition`}></button>
  )
}

export {CheckBox};