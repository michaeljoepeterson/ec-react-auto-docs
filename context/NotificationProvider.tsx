import { IconButton, Snackbar } from "@mui/material";
import { createContext, useContext, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";

export interface NotificationContextType {
  notifyMessage: (message: string) => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export const NotificationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const notifyMessage = (message: string) => {
    setOpen(true);
    setMessage(message);
  };

  const handleClose = () => {
    setOpen(false);
    setMessage("");
  };

  return (
    <NotificationContext.Provider value={{ notifyMessage }}>
      <>
        {children}
        <Snackbar
          open={open}
          autoHideDuration={6000}
          onClose={handleClose}
          message={message}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          action={
            <>
              <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={handleClose}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </>
          }
        />
      </>
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
};
