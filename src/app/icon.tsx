import { ImageResponse } from 'next/og';

// App Router 파비콘 (동적 생성): 투명 배경 + primary 파란색 A
// 기본 폰트가 regular 단일 두께라 fontWeight가 무시되므로 SVG 패스로 직접 그림
export const size = { width: 64, height: 64 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'transparent',
        }}
      >
        <svg width="64" height="64" viewBox="0 0 64 64">
          <path
            d="M11 55 L32 9 L53 55 M20.5 39 H43.5"
            stroke="#0099FF" // primary oklch(0.65 0.21 237)의 sRGB 근사치
            strokeWidth="9"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      </div>
    ),
    { ...size }
  );
}
