// https://fkhadra.github.io/react-toastify/introduction/
// https://fkhadra.github.io/react-toastify/replace-default-transition/
import { toast } from 'react-toastify'

const flashMessage = (message_type: string, message: string) => {
  switch(message_type) {
    case "success":
      toast.success(message)
      break
    case "danger":
      toast.error(message)
      break
    case "warning":
      toast.warn(message)
      break
    case "info":
      toast.info(message)
      break
    default:
      toast.info('🦄 ' + message)
      break
  }
}

export default flashMessage
