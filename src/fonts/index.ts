import localFont from 'next/font/local';
import { Poppins, Oswald } from 'next/font/google';

export const poppins = Poppins({
  weight: ['300', '400', '500', '600'],
  subsets: ['latin'],
  variable: '--font-poppins',
  display: 'swap',
});

export const oswald = Oswald({
  weight: ['500'],
  subsets: ['latin'],
  variable: '--font-oswald',
  display: 'swap',
});

export const pretendard = localFont({
  src: './PretendardVariable.woff2',
  variable: '--font-pretendard',
  display: 'swap',
});
