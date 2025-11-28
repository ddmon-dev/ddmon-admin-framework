import localFont from 'next/font/local';
import { Poppins } from 'next/font/google';

/**
 * Primary Font: Poppins (라틴 문자용)
 * 폰트 교체 시 이 설정만 변경하면 됩니다.
 */
const primary = Poppins({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600', '700'],
  variable: '--font-primary-value',
  display: 'swap',
});

/**
 * Secondary Font: Pretendard (한글 + fallback)
 * 폰트 교체 시 이 설정만 변경하면 됩니다.
 */
const secondary = localFont({
  src: './PretendardVariable.woff2',
  variable: '--font-secondary-value',
  display: 'swap',
});

export { primary, secondary };
