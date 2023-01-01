import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Header from '../components/header';
import Footer from '../components/footer';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className="w-screen min-h-screen relative flex flex-col">
      <Header />
      <div className="w-full min-h-full relative pb-20 flex flex-col flex-grow">
        <Component {...pageProps} />
      </div>
      <Footer />
    </div>
  );
}
