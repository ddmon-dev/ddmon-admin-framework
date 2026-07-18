import { renderHook } from '@testing-library/react';
import type { FieldValues, UseFormReturn } from 'react-hook-form';
import { useFormGuard } from '../use-form-guard';

const mockSetCloseGuard = vi.fn();

vi.mock('../../ui/manage-sheet', () => ({
  useManageSheet: vi.fn(() => ({
    data: null,
    open: vi.fn(),
    close: vi.fn(),
    closeWithGuard: vi.fn(),
    setMode: vi.fn(),
    setModeWithGuard: vi.fn(),
    setCloseGuard: mockSetCloseGuard,
  })),
}));

const createMockForm = (dirtyFields: Record<string, unknown>) =>
  ({ formState: { dirtyFields } }) as unknown as UseFormReturn<FieldValues>;

const DIRTY = { title: true };
const CLEAN = {};

describe('useFormGuard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('enabled=true일 때 setCloseGuard에 guard 함수를 등록한다', () => {
    renderHook(() => useFormGuard(createMockForm(DIRTY)));

    expect(mockSetCloseGuard).toHaveBeenCalledTimes(1);
    expect(mockSetCloseGuard).toHaveBeenCalledWith(expect.any(Function));
  });

  it('등록된 guard 함수는 dirty 여부를 반환한다', () => {
    renderHook(() => useFormGuard(createMockForm(DIRTY)));

    const guardFn = mockSetCloseGuard.mock.calls[0][0];
    expect(guardFn()).toBe(true);
  });

  it('dirtyFields가 변경되면 guard 함수가 최신 값을 반환한다', () => {
    const { rerender } = renderHook(
      ({ dirtyFields }) => useFormGuard(createMockForm(dirtyFields)),
      { initialProps: { dirtyFields: CLEAN as Record<string, unknown> } }
    );

    const guardFn = mockSetCloseGuard.mock.calls[0][0];
    expect(guardFn()).toBe(false);

    rerender({ dirtyFields: DIRTY });
    expect(guardFn()).toBe(true);
  });

  it('중첩 dirtyFields에 true 리프가 있으면 dirty로 판정한다', () => {
    renderHook(() => useFormGuard(createMockForm({ files: { thumbnail: [{ name: true }] } })));

    const guardFn = mockSetCloseGuard.mock.calls[0][0];
    expect(guardFn()).toBe(true);
  });

  it('되돌린 필드의 빈 객체만 남은 dirtyFields는 dirty로 판정하지 않는다', () => {
    renderHook(() => useFormGuard(createMockForm({ files: {}, items: [] })));

    const guardFn = mockSetCloseGuard.mock.calls[0][0];
    expect(guardFn()).toBe(false);
  });

  it('dirty일 때 beforeunload 이벤트에서 preventDefault를 호출한다', () => {
    renderHook(() => useFormGuard(createMockForm(DIRTY)));

    const event = new Event('beforeunload', { cancelable: true });
    Object.defineProperty(event, 'preventDefault', { value: vi.fn() });
    window.dispatchEvent(event);

    expect(event.preventDefault).toHaveBeenCalled();
  });

  it('dirty가 아닐 때 beforeunload 이벤트에서 preventDefault를 호출하지 않는다', () => {
    renderHook(() => useFormGuard(createMockForm(CLEAN)));

    const event = new Event('beforeunload', { cancelable: true });
    Object.defineProperty(event, 'preventDefault', { value: vi.fn() });
    window.dispatchEvent(event);

    expect(event.preventDefault).not.toHaveBeenCalled();
  });

  it('enabled=false일 때 setCloseGuard를 호출하지 않는다', () => {
    renderHook(() => useFormGuard(createMockForm(DIRTY), false));

    expect(mockSetCloseGuard).not.toHaveBeenCalled();
  });

  it('enabled=false일 때 beforeunload 리스너를 등록하지 않는다', () => {
    renderHook(() => useFormGuard(createMockForm(DIRTY), false));

    const event = new Event('beforeunload', { cancelable: true });
    Object.defineProperty(event, 'preventDefault', { value: vi.fn() });
    window.dispatchEvent(event);

    expect(event.preventDefault).not.toHaveBeenCalled();
  });

  it('언마운트 시 setCloseGuard(null)을 호출한다', () => {
    const { unmount } = renderHook(() => useFormGuard(createMockForm(DIRTY)));

    mockSetCloseGuard.mockClear();
    unmount();

    expect(mockSetCloseGuard).toHaveBeenCalledWith(null);
  });

  it('언마운트 시 beforeunload 리스너를 제거한다', () => {
    const { unmount } = renderHook(() => useFormGuard(createMockForm(DIRTY)));
    unmount();

    const event = new Event('beforeunload', { cancelable: true });
    Object.defineProperty(event, 'preventDefault', { value: vi.fn() });
    window.dispatchEvent(event);

    expect(event.preventDefault).not.toHaveBeenCalled();
  });
});
