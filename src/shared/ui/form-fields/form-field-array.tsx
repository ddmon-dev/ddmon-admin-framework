'use client';

import { ReactElement, ReactNode } from 'react';
import { type Control, type FieldPath, type FieldValues, useFieldArray } from 'react-hook-form';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Plus, X } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Field, FieldContent, FieldLabel, FieldDescription } from '../field';

export type FormFieldArrayProps<
  V extends FieldValues = FieldValues,
  N extends FieldPath<V> = FieldPath<V>
> = {
  /** React Hook Form control */
  control: Control<V>;
  /** Field name */
  name: N;
  /** Label */
  label: ReactNode;
  /** Description */
  description?: ReactNode;
  /** 최소 개수 (기본: 1) */
  min?: number;
  /** 최대 개수 */
  max?: number;
  /** 각 항목 렌더링 함수 */
  renderField: (index: number) => ReactNode;
  /** 추가 버튼 텍스트 (기본: "추가") */
  addButtonText?: string;
  /** 초기 값 (추가 시 사용) */
  defaultValue?: Record<string, unknown>;
};

type SortableItemProps = {
  id: string;
  index: number;
  onRemove: () => void;
  canRemove: boolean;
  children: ReactNode;
};

function SortableItem({ id, index, onRemove, canRemove, children }: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="group relative flex items-start gap-2">
      {/* 드래그 핸들 */}
      <button
        type="button"
        className="mt-2 cursor-grab touch-none text-muted-foreground hover:text-foreground active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-5 w-5" />
      </button>

      {/* 필드 콘텐츠 */}
      <div className="flex-1">{children}</div>

      {/* 제거 버튼 */}
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={onRemove}
        disabled={!canRemove}
        className="mt-2 opacity-0 transition-opacity group-hover:opacity-100"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}

/**
 * FormFieldArray - 동적 필드 배열 컴포넌트 (React Hook Form + DnD Kit)
 *
 * 항목 추가/제거, 드래그 앤 드롭으로 순서 변경 가능
 *
 * @example
 * ```tsx
 * // 단일 필드
 * <FormFieldArray
 *   control={form.control}
 *   name="emails"
 *   label="이메일 목록"
 *   min={1}
 *   max={5}
 *   renderField={(index) => (
 *     <FormInput
 *       control={form.control}
 *       name={`emails.${index}.value`}
 *       placeholder="이메일"
 *     />
 *   )}
 * />
 *
 * // 다중 필드
 * <FormFieldArray
 *   control={form.control}
 *   name="contacts"
 *   label="연락처 목록"
 *   min={1}
 *   max={10}
 *   renderField={(index) => (
 *     <div className="grid grid-cols-3 gap-2">
 *       <FormInput
 *         control={form.control}
 *         name={`contacts.${index}.name`}
 *         placeholder="이름"
 *       />
 *       <FormPhoneInput
 *         control={form.control}
 *         name={`contacts.${index}.phone`}
 *         placeholder="전화번호"
 *       />
 *       <FormInput
 *         control={form.control}
 *         name={`contacts.${index}.email`}
 *         placeholder="이메일"
 *       />
 *     </div>
 *   )}
 * />
 * ```
 *
 * @remarks
 * - 객체 배열 형식: `[{ value: '값1' }, { value: '값2' }]`
 * - 드래그 앤 드롭으로 순서 변경 가능
 * - 최소/최대 개수 제한
 * - 빈 값 제거는 폼 제출 시 수동으로 처리 필요
 */
export const FormFieldArray = <
  V extends FieldValues = FieldValues,
  N extends FieldPath<V> = FieldPath<V>
>({
  control,
  name,
  label,
  description,
  min = 1,
  max,
  renderField,
  addButtonText = '추가',
  defaultValue = { value: '' },
}: FormFieldArrayProps<V, N>): ReactElement => {
  const { fields, append, remove, move } = useFieldArray({
    control,
    name,
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = fields.findIndex(field => field.id === active.id);
      const newIndex = fields.findIndex(field => field.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        move(oldIndex, newIndex);
      }
    }
  };

  const handleAdd = () => {
    if (max === undefined || fields.length < max) {
      append(defaultValue as never);
    }
  };

  const handleRemove = (index: number) => {
    if (fields.length > min) {
      remove(index);
    }
  };

  const canRemove = fields.length > min;
  const canAdd = max === undefined || fields.length < max;

  return (
    <Field>
      {/* Label */}
      <FieldContent>
        <FieldLabel>{label}</FieldLabel>
        {description && <FieldDescription>{description}</FieldDescription>}
      </FieldContent>

      {/* Field Array */}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={fields.map(f => f.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {fields.map((field, index) => (
              <SortableItem
                key={field.id}
                id={field.id}
                index={index}
                onRemove={() => handleRemove(index)}
                canRemove={canRemove}
              >
                {renderField(index)}
              </SortableItem>
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {/* Add Button */}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleAdd}
        disabled={!canAdd}
        className="w-full"
      >
        <Plus className="mr-2 h-4 w-4" />
        {addButtonText}
        {max !== undefined && ` (${fields.length}/${max})`}
      </Button>
    </Field>
  );
};
