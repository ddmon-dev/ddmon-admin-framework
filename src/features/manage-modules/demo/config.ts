export const CONFIG = {
  tableName: 'demo_items',

  // FormCheckboxGroup 옵션
  interestOptions: [
    { label: '스포츠', value: 'sports' },
    { label: '음악', value: 'music' },
    { label: '독서', value: 'reading' },
    { label: '여행', value: 'travel' },
    { label: '요리', value: 'cooking' },
  ],

  // FormRadioGroup 옵션
  genderOptions: [
    { label: '남성', value: 'male' },
    { label: '여성', value: 'female' },
    { label: '기타', value: 'other' },
  ],

  // FormSelect 옵션
  countryOptions: [
    { label: '대한민국', value: 'kr' },
    { label: '미국', value: 'us' },
    { label: '일본', value: 'jp' },
    { label: '중국', value: 'cn' },
  ],

  // FormCombobox 옵션
  cityOptions: [
    { label: '서울', value: 'seoul' },
    { label: '부산', value: 'busan' },
    { label: '대구', value: 'daegu' },
    { label: '인천', value: 'incheon' },
    { label: '광주', value: 'gwangju' },
    { label: '대전', value: 'daejeon' },
  ],

  // FormMultiCombobox 옵션
  languageOptions: [
    { label: '한국어', value: 'ko' },
    { label: '영어', value: 'en' },
    { label: '일본어', value: 'ja' },
    { label: '중국어', value: 'zh' },
    { label: '스페인어', value: 'es' },
    { label: '프랑스어', value: 'fr' },
  ],
} as const;
