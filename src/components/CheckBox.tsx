import { useEffect, useState } from "react";

interface ICheckBox {
  checked: boolean;
  onChange: (checked: boolean) => void;
  onlymark?: boolean; // Adicionei a propriedade disabled aqui
}

const CheckBox: React.FC<ICheckBox> = ({ checked = false, onChange, onlymark = false}) => {
  const [isChecked, setIsChecked] = useState(checked);

  useEffect(() => {
    setIsChecked(checked);
  }, [checked]);

  const handleToggle = () => {
    if (onlymark && !checked) {
      const newChecked = !isChecked;
      setIsChecked(newChecked);
      if (onChange) onChange(newChecked);
    } else if (!onlymark) {
      const newChecked = !isChecked;
      setIsChecked(newChecked);
      if (onChange) onChange(newChecked);
    }
  };

  return (
    <button
      onClick={handleToggle}
      className={`h-5 w-5 aspect-square border-2 rounded-full hover:border-black ${isChecked ? 'border-8 border-black' : 'border-neutral-400'} transition ${onlymark && checked ? 'cursor-not-allowed' : ''}`}
    >
    </button>
  );
}

export { CheckBox };
