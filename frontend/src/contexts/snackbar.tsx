import { Alert, AlertColor, Snackbar } from '@mui/material'
import { createContext, FC, useState, ReactNode, useContext } from 'react'

type SnackBarContextActions = {
  showSnackBar: (message: string, severity: AlertColor, timeout?: number) => void
}

const SnackBarContext = createContext<SnackBarContextActions>({} as SnackBarContextActions)

interface SnackBarContextProviderProps {
  children: ReactNode
}

const SnackBarProvider: FC<SnackBarContextProviderProps> = ({ children }) => {
  const [open, setOpen] = useState<boolean>(false)
  const [message, setMessage] = useState<string>('')
  const [timeout, setTimeout] = useState<number>(6000)
  const [alertColor, setAlertColor] = useState<AlertColor>('info')

  const showSnackBar = (text: string, color: AlertColor, timeout?: number) => {
    setMessage(text)
    setAlertColor(color)
    setOpen(true)
    if (timeout) {
      setTimeout(timeout)
    }
  }

  const handleClose = () => {
    setOpen(false)
    setAlertColor('info')
    setTimeout(6000)
  }

  return (
    <SnackBarContext.Provider value={{ showSnackBar }}>
      <Snackbar
        open={open}
        autoHideDuration={timeout}
        // anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity={alertColor}>
          {message}
        </Alert>
      </Snackbar>
      {children}
    </SnackBarContext.Provider>
  )
}

const useSnackBar = (): SnackBarContextActions => {
  const context = useContext(SnackBarContext)

  if (!context) {
    throw new Error('useSnackBar must be used within a SnackBarProvider')
  }

  return context
}

export { SnackBarProvider, useSnackBar }
