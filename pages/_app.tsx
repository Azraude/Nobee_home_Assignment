import '@frontend/assets/styles/proxima-nova-600.css'
import '@frontend/assets/styles/tailwind.css'

import type { AppProps } from 'next/dist/shared/lib/router/router'
import { MuiThemeProvider } from '@frontend/components/MuiThemeProvider'

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <MuiThemeProvider>
      <Component {...pageProps} />
    </MuiThemeProvider>
  )
}

export default MyApp
