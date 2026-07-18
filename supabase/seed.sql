-- =============================================
-- 개발용 시드 데이터
-- db:reset 시 자동 실행, db:push 시 무시
-- 에디터 컬럼(notices.content, news.content, popups.content)은
-- Tiptap 에디터가 저장하는 HTML 형식을 따른다.
-- created_at은 행마다 다른 값을 명시한다 — DEFAULT now()는 같은 트랜잭션에서
-- 전부 동일한 값이 되어 목록 정렬(created_at DESC)이 동률로 불안정해진다.
-- =============================================

-- 공지사항 목 데이터 (30개)
INSERT INTO public.notices (title, content, author, category, view_count, created_at) VALUES
  ('[중요] 2024년 신년 인사', '<p>새해 복 많이 받으세요! 2024년에도 저희 서비스를 이용해주셔서 감사합니다.</p>', 'admin', 'notice', 1245, NOW() - INTERVAL '0 days'),
  ('[공지] 시스템 정기 점검 안내', '<p>시스템 정기 점검이 아래와 같이 진행됩니다.</p><ul><li><p>점검 일시: 2024.01.15 (월) 02:00 ~ 06:00</p></li><li><p>점검 내용: 서버 안정화 및 보안 업데이트</p></li></ul><p><span style="color: #e64c4c">점검 시간 동안 서비스 이용이 제한됩니다.</span></p>', 'admin', 'notice', 892, NOW() - INTERVAL '1 days'),
  ('[공지] 개인정보처리방침 변경 안내', '<p>개인정보처리방침이 2024년 1월 1일부로 변경되었습니다.</p><p>주요 변경 사항은 다음과 같습니다.</p><ol><li><p>수집 항목 변경</p></li><li><p>보관 기간 조정</p></li><li><p>제3자 제공 범위 변경</p></li></ol>', 'admin', 'notice', 567, NOW() - INTERVAL '2 days'),
  ('2024년 1월 이벤트 당첨자 발표', '<p>새해맞이 이벤트에 참여해주신 모든 분들께 감사드립니다.</p>', 'admin', 'normal', 2341, NOW() - INTERVAL '3 days'),
  ('겨울 시즌 특별 할인 안내', '<p>겨울 시즌을 맞아 다양한 상품을 <strong>할인된 가격</strong>에 만나보세요.</p>', 'admin', 'normal', 1876, NOW() - INTERVAL '4 days'),
  ('신규 기능 업데이트 소식', '<p>사용자 편의성을 개선한 새로운 기능들이 추가되었습니다.</p>', 'admin', 'normal', 1543, NOW() - INTERVAL '5 days'),
  ('고객센터 운영시간 변경 안내', '<p>2024년부터 고객센터 운영시간이 변경됩니다.</p>', 'admin', 'normal', 987, NOW() - INTERVAL '6 days'),
  ('모바일 앱 업데이트 안내', '<p>모바일 앱이 버전 2.0으로 업데이트되었습니다.</p>', 'admin', 'normal', 2156, NOW() - INTERVAL '7 days'),
  ('회원 등급제도 개편 안내', '<p>더 나은 혜택을 제공하기 위해 회원 등급제도가 개편됩니다.</p>', 'admin', 'normal', 1432, NOW() - INTERVAL '8 days'),
  ('결제 시스템 개선 완료', '<p>더욱 안전하고 편리한 결제 시스템으로 개선되었습니다.</p>', 'admin', 'normal', 876, NOW() - INTERVAL '9 days'),
  ('FAQ 업데이트 안내', '<p>자주 묻는 질문이 업데이트되었습니다.</p>', 'admin', 'normal', 654, NOW() - INTERVAL '10 days'),
  ('2023년 결산 보고', '<p>2023년 한 해 동안의 성과를 공유합니다.</p>', 'admin', 'normal', 3421, NOW() - INTERVAL '11 days'),
  ('보안 강화 조치 안내', '<p>회원님들의 정보 보호를 위해 보안이 강화되었습니다.</p>', 'admin', 'normal', 1098, NOW() - INTERVAL '12 days'),
  ('배송 정책 변경 안내', '<p>2024년부터 배송 정책이 일부 변경됩니다.</p>', 'admin', 'normal', 765, NOW() - INTERVAL '13 days'),
  ('포인트 적립률 변경 안내', '<p>포인트 적립 정책이 변경되었습니다.</p>', 'admin', 'normal', 1234, NOW() - INTERVAL '14 days'),
  ('서비스 이용약관 개정 안내', '<p>서비스 이용약관이 개정되었습니다.</p>', 'admin', 'normal', 543, NOW() - INTERVAL '15 days'),
  ('신규 파트너사 입점 안내', '<p>새로운 파트너사가 입점했습니다.</p>', 'admin', 'normal', 892, NOW() - INTERVAL '16 days'),
  ('고객 만족도 조사 실시', '<p>서비스 개선을 위한 고객 만족도 조사에 참여해주세요.</p>', 'admin', 'normal', 456, NOW() - INTERVAL '17 days'),
  ('연말정산 서류 제출 안내', '<p>연말정산 관련 서류 제출 기한이 다가옵니다.</p>', 'admin', 'normal', 678, NOW() - INTERVAL '18 days'),
  ('멤버십 프로그램 런칭', '<p>새로운 멤버십 프로그램이 시작됩니다.</p>', 'admin', 'normal', 1567, NOW() - INTERVAL '19 days'),
  ('소셜 미디어 채널 오픈', '<p>공식 인스타그램 계정이 오픈했습니다.</p>', 'admin', 'normal', 2345, NOW() - INTERVAL '20 days'),
  ('야간 배송 서비스 시작', '<p>밤 10시까지 주문 시 새벽 배송이 가능합니다.</p>', 'admin', 'normal', 1876, NOW() - INTERVAL '21 days'),
  ('리뷰 이벤트 진행', '<p>솔직한 리뷰를 남겨주시면 포인트를 드립니다.</p>', 'admin', 'normal', 1234, NOW() - INTERVAL '22 days'),
  ('환불 정책 개선 안내', '<p>더욱 간편한 환불 절차로 개선되었습니다.</p>', 'admin', 'normal', 987, NOW() - INTERVAL '23 days'),
  ('신규 카테고리 추가', '<p>의류, 식품 카테고리가 새롭게 추가되었습니다.</p>', 'admin', 'normal', 1432, NOW() - INTERVAL '24 days'),
  ('위시리스트 기능 추가', '<p>관심 상품을 위시리스트에 담아보세요.</p>', 'admin', 'normal', 1098, NOW() - INTERVAL '25 days'),
  ('프리미엄 회원 혜택 확대', '<p>프리미엄 회원 혜택이 확대되었습니다.</p>', 'admin', 'normal', 2156, NOW() - INTERVAL '26 days'),
  ('긴급 공지: 서버 장애 복구 완료', '<p>일시적인 서버 장애가 복구되었습니다.</p>', 'admin', 'normal', 3421, NOW() - INTERVAL '27 days'),
  ('고객 후기 이벤트 당첨자 발표', '<p>고객 후기 이벤트 당첨자를 발표합니다.</p>', 'admin', 'normal', 876, NOW() - INTERVAL '28 days'),
  ('무료 배송 이벤트 진행', '<p>3만원 이상 구매 시 무료 배송 이벤트를 진행합니다.</p>', 'admin', 'normal', 1765, NOW() - INTERVAL '29 days');


-- 뉴스 목 데이터 (20개)
INSERT INTO public.news (title, content, view_count, created_at) VALUES
  ('2024년 신년 특별 이벤트 진행', '<p>새해를 맞아 다양한 특별 이벤트를 준비했습니다. 많은 참여 부탁드립니다.</p>', 3421, NOW() - INTERVAL '0 days'),
  ('서비스 업데이트 안내', '<p>더 나은 사용자 경험을 위해 서비스가 업데이트되었습니다.</p>', 2156, NOW() - INTERVAL '1 days'),
  ('신규 파트너십 체결 소식', '<p>글로벌 기업과의 전략적 파트너십을 체결하게 되었습니다.</p>', 1876, NOW() - INTERVAL '2 days'),
  ('모바일 앱 2.0 출시', '<p>완전히 새로워진 모바일 앱 2.0이 출시되었습니다.</p><ul><li><p>다크 모드 지원</p></li><li><p>푸시 알림 개선</p></li><li><p>성능 최적화</p></li></ul>', 2543, NOW() - INTERVAL '3 days'),
  ('고객 감사 이벤트 진행', '<p>그동안 저희 서비스를 이용해주신 고객분들께 감사드립니다.</p>', 1234, NOW() - INTERVAL '4 days'),
  ('분기 실적 발표', '<p>2024년 1분기 실적을 발표합니다.</p>', 987, NOW() - INTERVAL '5 days'),
  ('새로운 기능 소개: AI 추천 시스템', '<p>인공지능 기반 맞춤 추천 시스템이 도입되었습니다.</p><p><span style="color: #4c99e6"><strong>사용할수록 더 정확해지는 추천</strong></span>을 경험해보세요.</p>', 1765, NOW() - INTERVAL '6 days'),
  ('보안 강화 업데이트', '<p>사용자 정보 보호를 위한 보안이 강화되었습니다.</p>', 1098, NOW() - INTERVAL '7 days'),
  ('글로벌 진출 소식', '<p>해외 시장 진출을 위한 첫 걸음을 내딛었습니다.</p>', 2345, NOW() - INTERVAL '8 days'),
  ('사용자 커뮤니티 오픈', '<p>사용자분들이 소통할 수 있는 커뮤니티가 오픈했습니다.</p>', 1432, NOW() - INTERVAL '9 days'),
  ('환경 캠페인 참여 안내', '<p>지속 가능한 미래를 위한 환경 캠페인에 참여합니다.</p>', 876, NOW() - INTERVAL '10 days'),
  ('신규 채용 공고', '<p>함께 성장할 인재를 모집합니다.</p>', 654, NOW() - INTERVAL '11 days'),
  ('서비스 1주년 기념', '<p style="text-align: center"><span style="font-size: 20px"><strong>서비스 출시 1주년을 맞이했습니다.</strong></span></p><p style="text-align: center">함께해주신 모든 분들께 감사드립니다.</p>', 3210, NOW() - INTERVAL '12 days'),
  ('프리미엄 멤버십 출시', '<p>더 많은 혜택을 담은 프리미엄 멤버십이 출시되었습니다.</p>', 1567, NOW() - INTERVAL '13 days'),
  ('고객센터 운영 시간 확대', '<p>더 나은 서비스를 위해 고객센터 운영 시간을 확대합니다.</p>', 765, NOW() - INTERVAL '14 days'),
  ('결제 시스템 개선', '<p>더욱 편리한 결제 시스템으로 개선되었습니다.</p>', 1098, NOW() - INTERVAL '15 days'),
  ('SNS 채널 오픈 안내', '<p>공식 SNS 채널이 오픈했습니다. 팔로우해주세요!</p>', 2134, NOW() - INTERVAL '16 days'),
  ('연말 감사 이벤트', '<p>한 해 동안 감사했습니다. 연말 특별 이벤트를 진행합니다.</p>', 1876, NOW() - INTERVAL '17 days'),
  ('신규 카테고리 추가', '<p>사용자 요청에 따라 새로운 카테고리가 추가되었습니다.</p>', 987, NOW() - INTERVAL '18 days'),
  ('버그 수정 및 안정화 업데이트', '<p>서비스 안정성 향상을 위한 업데이트가 진행되었습니다.</p>', 543, NOW() - INTERVAL '19 days');


-- FAQ 목 데이터 (20개)
INSERT INTO public.faqs (question, answer, category, sort_order) VALUES
  ('회원가입은 어떻게 하나요?', '홈페이지 우측 상단의 "회원가입" 버튼을 클릭하여 필요한 정보를 입력하시면 됩니다.', 'general', 20),
  ('비밀번호를 잊어버렸어요', '로그인 페이지에서 "비밀번호 찾기"를 클릭하시면 이메일로 재설정 링크가 발송됩니다.', 'general', 19),
  ('회원 탈퇴는 어떻게 하나요?', '마이페이지 > 설정 > 회원탈퇴에서 진행하실 수 있습니다.', 'general', 18),
  ('이메일 주소를 변경하고 싶어요', '마이페이지 > 회원정보 수정에서 이메일 주소를 변경하실 수 있습니다.', 'general', 17),
  ('결제 방법에는 어떤 것들이 있나요?', '신용카드, 체크카드, 계좌이체, 무통장입금, 간편결제(카카오페이, 네이버페이) 등을 지원합니다.', 'payment', 16),
  ('결제가 실패했어요', '카드 한도, 잔액 부족, 카드사 점검 등의 이유로 결제가 실패할 수 있습니다. 다른 결제 수단을 이용해주세요.', 'payment', 15),
  ('환불은 얼마나 걸리나요?', '카드 결제 취소는 3-5영업일, 현금 환불은 7영업일 이내에 처리됩니다.', 'payment', 14),
  ('영수증 발급이 가능한가요?', '마이페이지 > 주문내역에서 영수증을 발급받으실 수 있습니다.', 'payment', 13),
  ('배송은 얼마나 걸리나요?', '일반 배송은 2-3일, 도서산간 지역은 3-5일 정도 소요됩니다.', 'service', 12),
  ('배송 추적은 어디서 하나요?', '마이페이지 > 주문내역에서 운송장 번호를 확인하시고 택배사 사이트에서 조회하실 수 있습니다.', 'service', 11),
  ('배송지 변경이 가능한가요?', '배송 준비 중 상태에서는 고객센터를 통해 변경 가능합니다. 배송 시작 후에는 변경이 어렵습니다.', 'service', 10),
  ('해외 배송도 가능한가요?', '현재 국내 배송만 지원하고 있습니다. 해외 배송 서비스는 준비 중입니다.', 'service', 9),
  ('교환/반품은 어떻게 하나요?', '상품 수령 후 7일 이내에 마이페이지에서 교환/반품 신청을 하시면 됩니다.', 'service', 8),
  ('반품 배송비는 누가 부담하나요?', '단순 변심의 경우 고객 부담, 상품 불량의 경우 판매자가 부담합니다.', 'service', 7),
  ('교환 상품은 언제 받을 수 있나요?', '반품 상품 수거 후 검수를 거쳐 2-3영업일 내에 재발송됩니다.', 'service', 6),
  ('포인트는 어떻게 사용하나요?', '결제 시 포인트를 적용하시면 현금처럼 사용하실 수 있습니다. 1포인트 = 1원입니다.', 'general', 5),
  ('포인트 유효기간이 있나요?', '포인트는 적립일로부터 1년간 유효합니다.', 'general', 4),
  ('쿠폰은 어디서 확인하나요?', '마이페이지 > 쿠폰함에서 보유 쿠폰을 확인하실 수 있습니다.', 'general', 3),
  ('고객센터 운영시간이 어떻게 되나요?', '평일 09:00-18:00 (점심시간 12:00-13:00), 주말 및 공휴일 휴무입니다.', 'general', 2),
  ('1:1 문의는 어디서 하나요?', '마이페이지 > 1:1 문의 또는 고객센터 전화(1588-0000)로 문의해주세요.', 'general', 1);


-- 문의 목 데이터 (15개)
INSERT INTO public.inquiries (id, name, email, phone, company, position, content, status, created_at) VALUES
  ('a0000000-0000-0000-0000-000000000001', '김민수', 'minsu.kim@example.com', '010-1234-5678', '(주)테크솔루션', '개발팀장', '안녕하세요, API 연동 관련 문의드립니다. REST API의 호출 제한 횟수는 어떻게 되나요? 대량 데이터 처리 시 배치 API를 별도로 제공하시는지도 궁금합니다.', 'answered', NOW() - INTERVAL '14 days'),
  ('a0000000-0000-0000-0000-000000000002', '이서연', 'seoyeon.lee@example.com', '010-2345-6789', '디자인스튜디오', '대표', '결제 수단 추가 관련 문의입니다. 현재 신용카드와 계좌이체만 지원되는데, 카카오페이나 네이버페이 같은 간편결제 도입 계획이 있으신가요?', 'answered', NOW() - INTERVAL '12 days'),
  ('a0000000-0000-0000-0000-000000000003', '박준혁', 'junhyuk.park@example.com', '010-3456-7890', NULL, NULL, '회원 탈퇴 후 데이터 보관 기간이 궁금합니다. 개인정보 삭제 요청을 하면 즉시 처리되나요, 아니면 일정 기간 보관 후 삭제되나요?', 'answered', NOW() - INTERVAL '10 days'),
  ('a0000000-0000-0000-0000-000000000004', '최은지', 'eunji.choi@example.com', '010-4567-8901', '(주)마케팅허브', '마케팅팀', '대시보드에서 데이터 엑셀 다운로드가 안 됩니다. 크롬 브라우저 최신 버전 사용 중이고, 팝업 차단은 해제한 상태입니다. 확인 부탁드립니다.', 'pending', NOW() - INTERVAL '8 days'),
  ('a0000000-0000-0000-0000-000000000005', '정우성', 'woosung.jung@example.com', NULL, '프리랜서', '개발자', '서비스 이용 중 간헐적으로 500 에러가 발생합니다. 주로 오후 2시~4시 사이에 발생하며, 특정 페이지(/dashboard/analytics)에서 빈번하게 나타납니다.', 'pending', NOW() - INTERVAL '7 days'),
  ('a0000000-0000-0000-0000-000000000006', '한지민', 'jimin.han@example.com', '010-5678-9012', '(주)이커머스코리아', '운영팀장', '대량 상품 등록 기능에 대해 문의드립니다. CSV 파일로 한 번에 1000개 이상의 상품을 등록할 수 있는 기능이 있나요?', 'pending', NOW() - INTERVAL '6 days'),
  ('a0000000-0000-0000-0000-000000000007', '송민호', 'minho.song@example.com', '010-6789-0123', NULL, NULL, '모바일에서 이미지 업로드 시 화면이 멈추는 현상이 있습니다. iPhone 15 Pro, iOS 17.2 환경입니다. 5MB 이상 이미지에서 발생하는 것 같습니다.', 'pending', NOW() - INTERVAL '5 days'),
  ('a0000000-0000-0000-0000-000000000008', '윤서아', 'seoa.yoon@example.com', '010-7890-1234', '스타트업빌더', 'PM', '현재 Basic 요금제를 사용 중인데, Pro 요금제로 업그레이드하면 기존 데이터는 모두 유지되나요? 중간 업그레이드 시 요금 계산 방식도 알려주세요.', 'answered', NOW() - INTERVAL '4 days'),
  ('a0000000-0000-0000-0000-000000000009', '강동원', 'dongwon.kang@example.com', NULL, '(주)데이터랩', '시니어 개발자', 'Webhook 연동 관련 문의입니다. 이벤트 발생 시 특정 URL로 콜백을 보내는 기능이 있나요? 있다면 지원하는 이벤트 종류가 궁금합니다.', 'pending', NOW() - INTERVAL '3 days'),
  ('a0000000-0000-0000-0000-000000000010', '임수정', 'sujung.lim@example.com', '010-8901-2345', NULL, '디자이너', '관리자 페이지에서 다크 모드를 지원할 계획이 있으신가요? 장시간 사용 시 눈의 피로감이 있어 요청드립니다.', 'pending', NOW() - INTERVAL '2 days'),
  ('a0000000-0000-0000-0000-000000000011', '오현우', 'hyunwoo.oh@example.com', '010-9012-3456', '(주)핀테크코리아', 'CTO', 'SSO(Single Sign-On) 연동을 지원하시나요? 사내 Okta 시스템과 SAML 2.0으로 연동하고 싶습니다.', 'pending', NOW() - INTERVAL '1 day'),
  ('a0000000-0000-0000-0000-000000000012', '배수지', 'suji.bae@example.com', '010-0123-4567', '크리에이티브랩', '콘텐츠 매니저', '에디터에서 유튜브 영상 임베드가 가능한가요? 현재 이미지와 텍스트만 지원되는 것 같아 문의드립니다.', 'answered', NOW() - INTERVAL '20 hours'),
  ('a0000000-0000-0000-0000-000000000013', '류현진', 'hyunjin.ryu@example.com', NULL, '(주)로지스틱스', '물류팀', '주문 상태 변경 시 고객에게 자동으로 알림 메일을 보내는 기능이 있나요? 현재는 수동으로 안내하고 있어 비효율적입니다.', 'pending', NOW() - INTERVAL '10 hours'),
  ('a0000000-0000-0000-0000-000000000014', '신예은', 'yeeun.shin@example.com', '010-1111-2222', NULL, NULL, '서비스 도입을 검토 중인데, 30일 무료 체험이 가능한가요? 팀 규모는 약 15명 정도이고, 엔터프라이즈 기능이 필요합니다.', 'pending', NOW() - INTERVAL '5 hours'),
  ('a0000000-0000-0000-0000-000000000015', '조인성', 'insung.cho@example.com', '010-3333-4444', '(주)미디어그룹', '사업부장', '연간 계약 시 할인이 적용되나요? 현재 월간 결제 중인데, 연간으로 전환하면 어떤 혜택이 있는지 궁금합니다.', 'pending', NOW() - INTERVAL '1 hour');


-- 문의 답변 목 데이터 (답변완료된 문의에 대한 답변)
INSERT INTO public.inquiry_replies (inquiry_id, content, author, sent_at, created_at) VALUES
  ('a0000000-0000-0000-0000-000000000001', 'API 호출 제한은 Basic 요금제 기준 분당 60회, Pro 요금제 기준 분당 300회입니다. 대량 데이터 처리를 위한 Batch API는 Pro 요금제 이상에서 제공되며, 한 번에 최대 500건까지 처리 가능합니다. 자세한 내용은 개발자 문서(docs.example.com/api)를 참고해주세요.', 'admin', NOW() - INTERVAL '13 days', NOW() - INTERVAL '13 days'),
  ('a0000000-0000-0000-0000-000000000002', '간편결제 도입은 현재 개발 로드맵에 포함되어 있으며, 2024년 2분기 중 카카오페이와 네이버페이를 우선 지원할 예정입니다. 토스페이 등 추가 결제 수단도 순차적으로 도입할 계획입니다. 업데이트 시 별도 안내드리겠습니다.', 'admin', NOW() - INTERVAL '11 days', NOW() - INTERVAL '11 days'),
  ('a0000000-0000-0000-0000-000000000003', '회원 탈퇴 시 개인정보는 관련 법령에 따라 30일간 보관 후 완전 삭제됩니다. 즉시 삭제를 원하시는 경우 고객센터로 별도 요청해주시면 수동 처리가 가능합니다. 단, 전자상거래법에 따라 거래 기록은 5년간 보관됩니다.', 'admin', NOW() - INTERVAL '9 days', NOW() - INTERVAL '9 days'),
  ('a0000000-0000-0000-0000-000000000008', '기존 데이터는 업그레이드 시 100% 유지됩니다. 요금은 남은 기간에 대해 일할 계산되며, Basic 잔여 금액을 차감한 Pro 요금이 청구됩니다. 예를 들어 15일 남은 시점에서 업그레이드하시면 Basic 15일분을 공제한 차액만 결제하시면 됩니다.', 'admin', NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days'),
  ('a0000000-0000-0000-0000-000000000012', '네, 에디터에서 유튜브 동영상 임베드를 지원하고 있습니다. 에디터 툴바의 유튜브 아이콘을 클릭하신 뒤 영상 URL을 입력하시면 본문에 삽입됩니다. 혹시 해당 아이콘이 보이지 않으시면 브라우저 캐시를 삭제 후 다시 시도해주세요.', 'admin', NOW() - INTERVAL '18 hours', NOW() - INTERVAL '18 hours');


-- 팝업 목 데이터 (8개)
INSERT INTO public.popups (title, content, author, position_top, position_left, width, is_active, is_always, start_date, end_date, z_index) VALUES
  ('신년 이벤트 안내', '<p style="text-align: center"><span style="color: #e64c4c; font-size: 20px"><strong>2024 신년 특별 이벤트</strong></span></p><p style="text-align: center">신규 가입 시 <strong>30% 할인 쿠폰</strong>을 드립니다!</p><p style="text-align: center"><span style="color: #999999">기간: 2024.01.01 ~ 2024.01.31</span></p>', 'admin', 100, 100, 450, true, false, '2024-01-01', '2024-01-31', 10),
  ('시스템 점검 안내', '<p><span style="font-size: 18px"><strong>시스템 정기 점검 안내</strong></span></p><p>아래 시간 동안 서비스 이용이 제한됩니다.</p><ul><li><p>일시: 2024.02.15 (목) 02:00 ~ 06:00</p></li><li><p>대상: 전체 서비스</p></li></ul><p><span style="color: #999999">이용에 불편을 드려 죄송합니다.</span></p>', 'admin', 150, 200, 400, false, false, '2024-02-14', '2024-02-15', 20),
  ('개인정보 처리방침 변경', '<p><span style="font-size: 18px"><strong>개인정보 처리방침 변경 안내</strong></span></p><p>2024년 3월 1일부로 개인정보 처리방침이 변경됩니다.</p><p>주요 변경 사항:</p><ol><li><p>수집 항목 변경</p></li><li><p>보관 기간 조정</p></li><li><p>제3자 제공 범위 변경</p></li></ol>', 'admin', 80, 150, 420, true, false, '2024-02-15', '2024-03-15', 15),
  ('긴급 공지', '<p style="text-align: center"><span style="color: #e64c4c; font-size: 22px"><strong>긴급 공지</strong></span></p><p style="text-align: center">현재 결제 시스템 일시 장애가 발생하여 복구 작업을 진행 중입니다.</p><p style="text-align: center"><strong>예상 복구 시간: 1시간 이내</strong></p>', 'admin', 120, 250, 380, false, false, NULL, NULL, 30),
  ('프로모션 배너', '<p style="text-align: center"><span style="font-size: 22px"><strong>Premium Plan</strong></span></p><p style="text-align: center">지금 업그레이드하면 첫 3개월 50% 할인!</p><p style="text-align: center"><span style="color: #4c4ce6; font-size: 20px"><strong>월 29,900원 → 14,950원</strong></span></p>', 'admin', 200, 300, 500, true, true, NULL, NULL, 5),
  ('설문조사 참여 요청', '<p><span style="font-size: 18px"><strong>고객 만족도 설문조사</strong></span></p><p>서비스 개선을 위한 설문조사에 참여해주세요.</p><p>소요 시간: 약 3분</p><p><span style="color: #4c99e6"><strong>참여하신 분들께 스타벅스 기프티콘을 드립니다!</strong></span></p>', 'admin', 100, 50, 380, true, false, '2024-03-01', '2024-03-31', 10),
  ('앱 업데이트 안내', '<p style="text-align: center"><span style="font-size: 18px"><strong>모바일 앱 v3.0 업데이트</strong></span></p><p style="text-align: center">새로워진 기능을 만나보세요!</p><ul><li><p>다크 모드 지원</p></li><li><p>푸시 알림 개선</p></li><li><p>성능 최적화</p></li></ul>', 'admin', 80, 120, 360, false, false, '2024-03-10', '2024-04-10', 10),
  ('채용 공고', '<p><span style="font-size: 18px"><strong>함께 성장할 인재를 찾습니다</strong></span></p><p>프론트엔드 개발자, 백엔드 개발자, 디자이너를 모집합니다.</p><p>지원 마감: 2024.04.30</p><p><span style="color: #4c99e6">자세한 내용은 채용 페이지를 확인해주세요.</span></p>', 'admin', 160, 180, 420, true, false, '2024-02-01', '2024-04-30', 8);


-- =============================================
-- 다국어(en) 데모 데이터
-- 언어 전환 UI(?lang=en) 검증용. lang을 명시하지 않은 위 데이터는 기본값 'ko'.
-- =============================================

-- 공지사항 (en)
INSERT INTO public.notices (title, content, author, category, view_count, lang, created_at) VALUES
  ('[Important] Happy New Year 2024', '<p>Wishing you a wonderful new year! Thank you for using our service.</p>', 'admin', 'notice', 842, 'en', NOW() - INTERVAL '0 days'),
  ('[Notice] Scheduled System Maintenance', '<p>Regular system maintenance is scheduled for Jan 15, 2024, 02:00–06:00.</p>', 'admin', 'notice', 531, 'en', NOW() - INTERVAL '1 days'),
  ('Winter Season Special Discount', '<p>Meet a wide range of products at <strong>discounted prices</strong> this winter.</p>', 'admin', 'normal', 1120, 'en', NOW() - INTERVAL '2 days'),
  ('Mobile App Update', '<p>Our mobile app has been updated to version 2.0.</p>', 'admin', 'normal', 976, 'en', NOW() - INTERVAL '3 days');

-- 뉴스 (en)
INSERT INTO public.news (title, content, view_count, lang, created_at) VALUES
  ('New Year Special Event 2024', '<p>We have prepared various special events to celebrate the new year. Please join us.</p>', 2103, 'en', NOW() - INTERVAL '0 days'),
  ('Mobile App 2.0 Released', '<p>The completely renewed mobile app 2.0 is now available.</p>', 1487, 'en', NOW() - INTERVAL '1 days'),
  ('New Feature: AI Recommendation', '<p>An AI-based personalized recommendation system has been introduced.</p>', 998, 'en', NOW() - INTERVAL '2 days');

-- FAQ (en) — sort_order는 언어별로 독립적
INSERT INTO public.faqs (question, answer, category, sort_order, lang) VALUES
  ('How do I sign up?', 'Click the "Sign up" button at the top right of the homepage and enter the required information.', 'general', 4, 'en'),
  ('I forgot my password', 'Click "Forgot password" on the login page to receive a reset link by email.', 'general', 3, 'en'),
  ('What payment methods are available?', 'We support credit/debit cards, bank transfer, and easy-pay (KakaoPay, NaverPay).', 'payment', 2, 'en'),
  ('How long does delivery take?', 'Standard delivery takes 2–3 days; remote areas take about 3–5 days.', 'service', 1, 'en');

-- 팝업 (en)
INSERT INTO public.popups (title, content, author, position_top, position_left, width, is_active, is_always, start_date, end_date, z_index, lang) VALUES
  ('New Year Event', '<p style="text-align: center"><span style="color: #e64c4c; font-size: 20px"><strong>2024 New Year Special Event</strong></span></p><p style="text-align: center">Get a <strong>30% discount coupon</strong> when you sign up!</p><p style="text-align: center"><span style="color: #999999">Period: 2024.01.01 – 2024.01.31</span></p>', 'admin', 100, 100, 450, true, false, '2024-01-01', '2024-01-31', 10, 'en'),
  ('Premium Plan', '<p style="text-align: center"><span style="font-size: 22px"><strong>Premium Plan</strong></span></p><p style="text-align: center">Upgrade now and get 50% off for the first 3 months!</p>', 'admin', 200, 300, 500, true, true, NULL, NULL, 5, 'en');
