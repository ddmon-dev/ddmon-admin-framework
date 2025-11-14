import localFont from 'next/font/local';
import { Poppins } from 'next/font/google';

const fontPrimary = Poppins({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600', '700'],
  variable: '--font-primary',
  display: 'swap',
});

const fontSecondary = localFont({
  src: './PretendardVariable.woff2',
  variable: '--font-secondary',
  display: 'swap',
});

export { fontSecondary, fontPrimary };
