# Form Components 개발 진행 상황

## 완료된 작업

### 1. FormSwitch 컴포넌트
- `/src/shared/ui/form-fields.tsx`에 FormCheckbox와 동일한 구조로 추가
- Switch 컴포넌트를 React Hook Form과 통합

### 2. DatePicker 컴포넌트 (`/src/shared/ui/date-picker.tsx`)
- **통합 방식**: Single/Multiple/Range 모드를 하나의 컴포넌트로 구현
- **Discriminated Union 타입**: mode prop으로 타입 안전성 확보
- **주요 기능**:
  - Single 모드: presets 지원 (boolean | { label: string; date: Date }[])
  - Multiple 모드: min/max 개수 제한, RemovableBadgeGroup으로 선택 표시
  - Range 모드: numberOfMonths, min/max 일수 제한
- **한국어 지원**: date-fns/locale/ko 고정
- **타입 export**: DatePickerBaseProps, SingleDatePickerProps 등 재사용 가능

### 3. FormDatePicker 컴포넌트 (`/src/shared/ui/form-fields.tsx`)
- DatePickerBaseProps 타입 재사용: `Omit<DatePickerBaseProps, 'aria-invalid' | 'className'>`
- mode에 따라 DatePicker 렌더링 분기 처리
- presets 기본값 지원: `presets={true}`로 DEFAULT_PRESETS 사용 가능

### 4. RemovableBadgeGroup 컴포넌트 (`/src/shared/ui/removable-badge-group.tsx`)
- MultiCombobox와 DatePicker(Multiple 모드)의 Badge 표시 로직 공통화
- Props: `items: Array<{ key: string; label: string }>`, `onRemove: (key: string) => void`, `variant`
- 빈 배열 체크, 래퍼 div 스타일 포함
- `/src/shared/ui/multi-combobox.tsx`와 `/src/shared/ui/date-picker.tsx`에서 사용

### 5. Zod 검증 관련
- `z.date({ required_error: ... })` → `z.date({ message: ... })` 사용
- dateRange refine 에러는 path 없이 설정해야 FormDatePicker에서 표시됨
- `z.coerce.date()` 사용 시 타입 에러 발생하여 피함

## 데모 페이지
- `/src/app/demo/page.tsx`에서 모든 Form 컴포넌트 테스트 가능
- FormDatePicker: Single(presets), Multiple(max=5), Range(numberOfMonths=2) 데모 포함

## 남은 작업 (선택사항)
- Calendar 컴포넌트의 fromDate, toDate, initialFocus prop 미사용 경고 해결 (react-day-picker v9 버전 차이)
- 추가 Form 컴포넌트 필요 시 동일한 패턴으로 구현

## 설계 원칙
- **우직실**: 우아함, 직관성, 실용성
- **오버엔지니어링 금지**: 적절한 수준의 추상화 (RemovableBadgeGroup은 두 곳에서 반복되므로 분리)
- **타입 재사용**: 중복 제거 및 일관성 유지
