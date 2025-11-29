import localFont from 'next/font/local';
import { Gothic_A1, Nanum_Gothic, Noto_Sans_KR, IBM_Plex_Sans_KR } from 'next/font/google';

/**
 * Pretendard - 현대적이고 깔끔한 산세리프
 */
const pretendard = localFont({
  src: './PretendardVariable.woff2',
  variable: '--font-pretendard',
  display: 'swap',
});

/**
 * 나눔스퀘어 네오 - 둥글둥글하고 부드러운 느낌
 */
const nanumSquareNeo = localFont({
  src: './NanumSquareNeo-Variable.woff2',
  variable: '--font-nanum-square-neo',
  display: 'swap',
});

/**
 * SUIT - 둥글고 친근한 느낌
 */
const suit = localFont({
  src: [
    { path: './SUIT-Regular.woff2', weight: '400' },
    { path: './SUIT-Medium.woff2', weight: '500' },
    { path: './SUIT-SemiBold.woff2', weight: '600' },
    { path: './SUIT-Bold.woff2', weight: '700' },
  ],
  variable: '--font-suit',
  display: 'swap',
});

/**
 * Gothic A1 - 깔끔하고 모던한 고딕체
 */
const gothicA1 = Gothic_A1({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-gothic-a1',
  display: 'swap',
});

/**
 * 나눔고딕 - 친숙하고 가독성 좋은 고딕체
 */
const nanumGothic = Nanum_Gothic({
  weight: ['400', '700', '800'],
  subsets: ['latin'],
  variable: '--font-nanum-gothic',
  display: 'swap',
});

/**
 * Noto Sans KR - 구글의 범용 한글 폰트
 */
const notoSansKR = Noto_Sans_KR({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-noto-sans-kr',
  display: 'swap',
});

/**
 * IBM Plex Sans KR - 깔끔하고 기술적인 느낌
 */
const ibmPlexSansKR = IBM_Plex_Sans_KR({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-ibm-plex-sans-kr',
  display: 'swap',
});

export { pretendard, nanumSquareNeo, suit, gothicA1, nanumGothic, notoSansKR, ibmPlexSansKR };
