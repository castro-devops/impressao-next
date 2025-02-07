import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function ProductConfig () {
  return (
    <div className="rounded-2xl border border-neutral-300 p-5 flex flex-col gap-1">
      <div className="flex justify-between">
        <p className="text-lg text-neutral-800">Campo customizado</p>
        <FontAwesomeIcon icon={faPlus} className="p-1.5 rounded-full" />
      </div>
    </div>
  )
}

function QuantityConfig () {

}

function SizeConfig () {

}

function CustomConfig () {

}

export default ProductConfig;
export { QuantityConfig, SizeConfig, CustomConfig };