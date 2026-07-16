import type { MetadataRoute } from 'next';

// 검색엔진·학습용 크롤러는 차단하되, 사용자가 직접 URL을 지시한
// AI 에이전트(지시형 페처)는 데모 열람을 허용한다.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: ['Claude-User', 'ChatGPT-User', 'Perplexity-User'],
        allow: '/',
      },
      {
        userAgent: '*',
        disallow: '/',
      },
    ],
  };
}
