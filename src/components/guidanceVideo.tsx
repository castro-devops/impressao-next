import { faVideo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function GuidanceButton () {
  return (
    <div className="fixed w-14 aspect-square flex items-center justify-center text-neutral-400 hover:text-neutral-700 text-lg bg-white shadow-lg bottom-10 right-10 rounded-full border-2 border-neutral-400 hover:border-neutral-700 cursor-pointer transition">
      <FontAwesomeIcon icon={faVideo} />
    </div>
  );
}