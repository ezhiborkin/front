import '@/styles/globals.scss'
import type { AppProps } from 'next/app'
import { Layout } from '../components/layout'
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import { CookiesProvider } from 'react-cookie'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
    <CookiesProvider>
      <Layout>
          <Component {...pageProps} />
        </Layout>
    </CookiesProvider>     
    </>
  )
}
