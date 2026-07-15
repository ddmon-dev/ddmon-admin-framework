// Vitest 전용 stub. 'server-only'는 Next.js RSC 경계 표식으로, 서버 번들이 아닌
// 환경에서 로드되면 throw한다. Vitest에는 react-server export 조건이 없으므로
// 테스트에서는 이 no-op 모듈로 alias해 서버 코드를 정상 로드시킨다.
// 실제 빌드의 server-only 가드레일에는 영향이 없다.
export {};
