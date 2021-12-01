import { ChakraProvider } from "@chakra-ui/react";
import { AppProps } from 'next/app'
import 'styles/global.css'

const App = ({ Component, pageProps }: AppProps): JSX.Element => {
  return (
    <ChakraProvider>
      <Component {...pageProps} />
    </ChakraProvider>
  )
}

export default App
