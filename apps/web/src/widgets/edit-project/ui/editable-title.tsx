import {
  ChangeEvent,
  ClipboardEvent,
  ComponentProps,
  KeyboardEvent,
} from 'react';

import { cn } from '@repo/ui/utilities/cn';

export function EditableTitle({
  className,
  onKeyDown,
  onPaste,
  onChange,
  maxLength = 96,
  ...props
}: ComponentProps<'textarea'>) {
  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter') {
      event.preventDefault();
      return;
    }

    onKeyDown?.(event);
  }

  function handlePaste(event: ClipboardEvent<HTMLTextAreaElement>) {
    const pastedText = event.clipboardData
      .getData('text')
      .replace(/[\r\n]+/g, ' ');

    if (pastedText.includes('\n') || pastedText.includes('\r')) {
      event.preventDefault();
      const target = event.target as HTMLTextAreaElement;
      const startPos = target.selectionStart || 0;
      const endPos = target.selectionEnd || 0;

      target.value =
        target.value.substring(0, startPos) +
        pastedText +
        target.value.substring(endPos);

      const newPos = startPos + pastedText.length;
      target.setSelectionRange(newPos, newPos);

      const ev = new Event('input', { bubbles: true });
      target.dispatchEvent(ev);
    }

    onPaste?.(event);
  }

  function handleChange(event: ChangeEvent<HTMLTextAreaElement>) {
    if (event.target.value.match(/[\r\n]/)) {
      event.target.value = event.target.value.replace(/[\r\n]+/g, ' ');

      const newEvent = {
        ...event,
        target: { ...event.target, value: event.target.value },
        currentTarget: { ...event.currentTarget, value: event.target.value },
      };
      onChange?.(newEvent);
      return;
    }

    if (maxLength && event.target.value.length > maxLength) {
      event.target.value = event.target.value.slice(0, maxLength);
      const newEvent = {
        ...event,
        target: { ...event.target, value: event.target.value },
        currentTarget: { ...event.currentTarget, value: event.target.value },
      };
      onChange?.(newEvent);
      return;
    }

    onChange?.(event);
  }

  return (
    <textarea
      data-slot="editable-title"
      onKeyDown={handleKeyDown}
      onPaste={handlePaste}
      onChange={handleChange}
      maxLength={maxLength}
      className={cn(
        'field-sizing-content w-full resize-none rounded-md py-2 outline-none focus:placeholder-transparent',
        className,
      )}
      {...props}
    />
  );
}
