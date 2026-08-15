import { Button } from "antd"

const PrimaryBtn = ({label, action}) => {
  return(
    <Button
    className="bg-yellow-500! p-5! px-10! border-0! hover:bg-yellow-600! text-black!"
    onClick={action}
    >{label}</Button>
  )
}

export default PrimaryBtn;