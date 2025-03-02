import { faVideo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

export default function GuidanceButton () {

  const [showVideo, setShowVideo] = useState<boolean>(false);

  return (
    <div className="fixed w-14 aspect-square flex items-center justify-center text-neutral-400 hover:text-neutral-700 text-lg bg-white shadow-lg bottom-10 right-10 rounded-full border-2 border-neutral-400 hover:border-neutral-700 cursor-pointer transition" onClick={() => setShowVideo(!showVideo)}>
      <FontAwesomeIcon icon={faVideo} />
      {showVideo && <FrameVideo />}
    </div>
  );
}

export function FrameVideo() {
  return (
    <div className="absolute right-12 bottom-12 w-[560px] h-[315px] rounded-3xl shadow-lg overflow-hidden border-4 border-neutral-400">
      <iframe width="560" height="315" src="https://www.youtube.com/embed/LjK7LLJ1k10?si=JIWh2SCi-fMEcZ_8&autoplay=1&mute=0&controls=0" title="Tour pelo ambiente ed categorias." allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"></iframe>
    </div>
  );
}