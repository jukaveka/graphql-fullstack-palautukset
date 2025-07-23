import { Alert } from "@mui/material"

const Notification = ({ notification }) => {
  if (!notification) {
    return null
  }

  return (
    <div style={{ padding: "10px", width: "300px" }}>
      <Alert severity="info">{notification}</Alert>
    </div>
  )
}

export default Notification
