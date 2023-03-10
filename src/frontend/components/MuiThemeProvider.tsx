import type { ReactNode } from 'react'

import { createTheme, ThemeProvider } from '@mui/material/styles'

const theme = createTheme({
  typography: {
    fontFamily: "'Open Sans'",
    fontSize: 16,
  },
  palette: {
    primary: {
      main: '#42A87A',
    },
    secondary: {
      main: '#E95D24',
    },
    success: {
      main: '#42A87A',
    },
    warning: {
      main: '#E49F18',
    },
    error: {
      main: '#FF3A3A',
    },
    info: {
      main: '#1890FF',
    },
    text: {
      primary: '#333333',
      secondary: '#666666',
      disabled: '#999999',
    },
  },
})

type MuiThemeProviderProps = {
  children: ReactNode
}

export const MuiThemeProvider = ({ children }: MuiThemeProviderProps) => {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>
}
