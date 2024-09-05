import type { AppProps } from 'next/app';
import { useEffect } from 'react'
import { ThemeProvider } from 'next-themes'

import Layout from '../components/layout/Layout';
import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    const socketInitializer = async () => {
      await fetch('/api/socketio')
      console.log('Socket connection initialized')
    }
    socketInitializer()
  }, [])
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem={true}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ThemeProvider>
   
  );
}

export default MyApp;



