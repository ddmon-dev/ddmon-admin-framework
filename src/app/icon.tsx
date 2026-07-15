import { ImageResponse } from 'next/og';

// App Router 파비콘 (동적 생성): primary 원형 배경 + 흰색 D
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
          borderRadius: '50%',
          background: '#0099FF', // primary oklch(0.65 0.21 237)의 sRGB 근사치
          color: '#ffffff',
          fontSize: 44,
          fontWeight: 700,
        }}
      >
        D
      </div>
    ),
    { ...size }
  );
}
