import { ImageResponse } from 'next/og';

// App Router 파비콘 (동적 생성): 투명 배경 + primary 파란색 A
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
          color: '#0099FF', // primary oklch(0.65 0.21 237)의 sRGB 근사치
          fontSize: 58,
          fontWeight: 700,
        }}
      >
        A
      </div>
    ),
    { ...size }
  );
}
