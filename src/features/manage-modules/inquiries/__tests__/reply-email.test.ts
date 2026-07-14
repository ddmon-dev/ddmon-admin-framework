import { getReplyEmailHtml } from '../reply-email';

describe('inquiries/getReplyEmailHtml', () => {
  it('사용자 입력의 HTML 태그를 이스케이프한다 (인젝션 차단)', () => {
    const html = getReplyEmailHtml({
      name: '<script>alert(1)</script>',
      inquiryContent: '<a href="https://phish.example">계정 확인</a>',
      replyContent: '<img src=x onerror=alert(1)>',
    });

    // 원본 태그가 그대로 남아있으면 안 됨
    expect(html).not.toContain('<script>alert(1)</script>');
    expect(html).not.toContain('<a href="https://phish.example">');
    expect(html).not.toContain('<img src=x');

    // 이스케이프된 형태로 포함
    expect(html).toContain('&lt;script&gt;alert(1)&lt;/script&gt;');
    expect(html).toContain('&lt;a href=&quot;https://phish.example&quot;&gt;');
    expect(html).toContain('&lt;img src=x onerror=alert(1)&gt;');
  });

  it('특수문자 5종(& < > " \')을 모두 치환한다', () => {
    const html = getReplyEmailHtml({
      name: `A & B < C > D " E ' F`,
      inquiryContent: '문의',
      replyContent: '답변',
    });

    expect(html).toContain('A &amp; B &lt; C &gt; D &quot; E &#39; F');
  });

  it('일반 텍스트는 변형 없이 그대로 포함한다', () => {
    const html = getReplyEmailHtml({
      name: '홍길동',
      inquiryContent: '배송 문의드립니다.\n두 번째 줄',
      replyContent: '답변드립니다.',
    });

    expect(html).toContain('Hello, 홍길동');
    expect(html).toContain('배송 문의드립니다.\n두 번째 줄');
    expect(html).toContain('답변드립니다.');
  });
});
