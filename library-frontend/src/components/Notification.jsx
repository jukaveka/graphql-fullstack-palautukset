import { Alert } from "@mui/material"

const Notification = ({ notification }) => {
  console.log(notification)

  if (!notification) {
    return null
  }

  return (
    <div>
      <Alert severity="info">{notification}</Alert>
    </div>
  )
}

export default Notification
