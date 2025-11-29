import localFont from 'next/font/local';

/**
 * Pretendard - 현대적이고 깔끔한 산세리프 (Secondary 폰트로 고정)
 */
export const pretendard = localFont({
  src: './PretendardVariable.woff2',
  variable: '--font-pretendard',
  display: 'swap',
});

/**
 * 나눔스퀘어 네오 - 둥글둥글하고 부드러운 느낌
 */
export const nanumSquareNeo = localFont({
  src: './NanumSquareNeo-Variable.woff2',
  variable: '--font-nanum-square-neo',
  display: 'swap',
});

/**
 * SUIT - 둥글고 친근한 느낌
 */
export const suit = localFont({
  src: [
    { path: './SUIT-Regular.woff2', weight: '400' },
    { path: './SUIT-Medium.woff2', weight: '500' },
    { path: './SUIT-SemiBold.woff2', weight: '600' },
    { path: './SUIT-Bold.woff2', weight: '700' },
  ],
  variable: '--font-suit',
  display: 'swap',
});
