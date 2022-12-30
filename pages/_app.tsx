import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Header from '../components/header';
import Footer from '../components/footer';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className="w-screen h-screen">
      <Header />
      <div className="w-full min-h-[86.5vh]">
        <Component {...pageProps} />
      </div>
      <Footer />
    </div>
  );
}
