import type { AppProps } from 'next/app';
import { useEffect } from 'react'

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
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;



