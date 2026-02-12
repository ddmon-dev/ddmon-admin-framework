import { renderHook } from '@testing-library/react';
import type { FieldValues, UseFormReturn } from 'react-hook-form';
import { useFormGuard } from '../use-form-guard';

const mockSetCloseGuard = vi.fn();

vi.mock('../../ui/manage-sheet', () => ({
  useManageSheet: vi.fn(() => ({
    data: null,
    open: vi.fn(),
    close: vi.fn(),
    requestClose: vi.fn(),
    setCloseGuard: mockSetCloseGuard,
  })),
}));

const createMockForm = (isDirty: boolean) =>
  ({ formState: { isDirty } }) as unknown as UseFormReturn<FieldValues>;

describe('useFormGuard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('enabled=true일 때 setCloseGuard에 guard 함수를 등록한다', () => {
    renderHook(() => useFormGuard(createMockForm(true)));

    expect(mockSetCloseGuard).toHaveBeenCalledTimes(1);
    expect(mockSetCloseGuard).toHaveBeenCalledWith(expect.any(Function));
  });

  it('등록된 guard 함수는 isDirty 값을 반환한다', () => {
    renderHook(() => useFormGuard(createMockForm(true)));

    const guardFn = mockSetCloseGuard.mock.calls[0][0];
    expect(guardFn()).toBe(true);
  });

  it('isDirty가 변경되면 guard 함수가 최신 값을 반환한다', () => {
    const { rerender } = renderHook(
      ({ isDirty }) => useFormGuard(createMockForm(isDirty)),
      { initialProps: { isDirty: false } },
    );

    const guardFn = mockSetCloseGuard.mock.calls[0][0];
    expect(guardFn()).toBe(false);

    rerender({ isDirty: true });
    expect(guardFn()).toBe(true);
  });

  it('isDirty=true일 때 beforeunload 이벤트에서 preventDefault를 호출한다', () => {
    renderHook(() => useFormGuard(createMockForm(true)));

    const event = new Event('beforeunload', { cancelable: true });
    Object.defineProperty(event, 'preventDefault', { value: vi.fn() });
    window.dispatchEvent(event);

    expect(event.preventDefault).toHaveBeenCalled();
  });

  it('isDirty=false일 때 beforeunload 이벤트에서 preventDefault를 호출하지 않는다', () => {
    renderHook(() => useFormGuard(createMockForm(false)));

    const event = new Event('beforeunload', { cancelable: true });
    Object.defineProperty(event, 'preventDefault', { value: vi.fn() });
    window.dispatchEvent(event);

    expect(event.preventDefault).not.toHaveBeenCalled();
  });

  it('enabled=false일 때 setCloseGuard를 호출하지 않는다', () => {
    renderHook(() => useFormGuard(createMockForm(true), false));

    expect(mockSetCloseGuard).not.toHaveBeenCalled();
  });

  it('enabled=false일 때 beforeunload 리스너를 등록하지 않는다', () => {
    renderHook(() => useFormGuard(createMockForm(true), false));

    const event = new Event('beforeunload', { cancelable: true });
    Object.defineProperty(event, 'preventDefault', { value: vi.fn() });
    window.dispatchEvent(event);

    expect(event.preventDefault).not.toHaveBeenCalled();
  });

  it('언마운트 시 setCloseGuard(null)을 호출한다', () => {
    const { unmount } = renderHook(() => useFormGuard(createMockForm(true)));

    mockSetCloseGuard.mockClear();
    unmount();

    expect(mockSetCloseGuard).toHaveBeenCalledWith(null);
  });

  it('언마운트 시 beforeunload 리스너를 제거한다', () => {
    const { unmount } = renderHook(() => useFormGuard(createMockForm(true)));
    unmount();

    const event = new Event('beforeunload', { cancelable: true });
    Object.defineProperty(event, 'preventDefault', { value: vi.fn() });
    window.dispatchEvent(event);

    expect(event.preventDefault).not.toHaveBeenCalled();
  });
});
