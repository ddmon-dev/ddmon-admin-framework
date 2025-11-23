/**
 * 전화번호 필터 함수
 * - 숫자만 입력 허용
 * - 02/010/070 패턴에 따라 자동 하이픈 삽입
 * - 최대 길이 제한 (02: 9~10자리, 010/070: 11자리, 기타: 10자리)
 */
export function telFilter(value: string): string {
  const numbersOnly = value.replace(/\D/g, '');

  if (numbersOnly.startsWith('02')) {
    // 서울 (02-XXX-XXXX or 02-XXXX-XXXX)
    if (numbersOnly.length <= 9) {
      return numbersOnly.replace(/(\d{2})(\d{0,3})(\d{0,4})/, (match, p1, p2, p3) =>
        [p1, p2, p3].filter(Boolean).join('-')
      );
    } else {
      return numbersOnly
        .slice(0, 10)
        .replace(/(\d{2})(\d{0,4})(\d{0,4})/, (match, p1, p2, p3) =>
          [p1, p2, p3].filter(Boolean).join('-')
        );
    }
  } else if (numbersOnly.startsWith('010') || numbersOnly.startsWith('070')) {
    // 휴대폰/인터넷전화 (010-XXXX-XXXX, 070-XXXX-XXXX)
    if (numbersOnly.length <= 11) {
      return numbersOnly.replace(/(\d{3})(\d{0,4})(\d{0,4})/, (match, p1, p2, p3) =>
        [p1, p2, p3].filter(Boolean).join('-')
      );
    } else {
      return numbersOnly
        .slice(0, 11)
        .replace(/(\d{3})(\d{0,4})(\d{0,4})/, (match, p1, p2, p3) =>
          [p1, p2, p3].filter(Boolean).join('-')
        );
    }
  } else {
    // 일반 지역번호 (0XX-XXX-XXXX)
    if (numbersOnly.length <= 10) {
      return numbersOnly.replace(/(\d{3})(\d{0,3})(\d{0,4})/, (match, p1, p2, p3) =>
        [p1, p2, p3].filter(Boolean).join('-')
      );
    } else {
      return numbersOnly
        .slice(0, 10)
        .replace(/(\d{3})(\d{0,3})(\d{0,4})/, (match, p1, p2, p3) =>
          [p1, p2, p3].filter(Boolean).join('-')
        );
    }
  }
}
