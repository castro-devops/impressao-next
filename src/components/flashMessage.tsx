import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type TFlashMessage = {
  show: boolean,
  type: 'error' | 'warning' | 'success' | 'info',
  message: string,
  onClick: () => void,
}

export default function FlashMessage({
  show,
  type,
  message,
  onClick
}: TFlashMessage) {

  const typeClasses = {
      error  : 'bg-red-100 text-red-600 border-red-200',
      warning: 'bg-amber-100 text-amber-400 border-amber-200',
      success: 'bg-emerald-100 text-emerald-600 border-emerald-200',
      info   : 'bg-teal-100 text-teal-600 border-teal-200',
      default: 'bg-gray-100 text-gray-600'
  }
  const returnType = () => typeClasses[type] || "bg-gray-100 text-gray-600";
  const typeClass = returnType();

  return (
    <>
      {show &&
      <div className={`p-3 flex items-center justify-between border-2 rounded-md font-medium ${typeClass}`}>
        <span className="flex-1 text-center">{message}</span>
        <FontAwesomeIcon icon={faClose} className="cursor-pointer" onClick={onClick} />
      </div>}
    </>
  )
}