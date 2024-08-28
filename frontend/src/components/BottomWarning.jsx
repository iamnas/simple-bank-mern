import { Link } from "react-router-dom"

export default function BottomWarning({label, buttonText, to}) {
    return <div className="py-2 text-sm flex justify-center">
      <div>
        {label}
      </div>
      <Link className=" text-blue-300 pointer underline pl-1 cursor-pointer" to={to}>
        {buttonText}
      </Link>
    </div>
}