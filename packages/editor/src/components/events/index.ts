import { RedactorDomChanged } from '@/components/events/redactor-dom-changed';
import { BlockChanged } from '@/components/events/block-changed';
import { BlockHovered } from '@/components/events/block-hovered';
import { FakeCursorAboutToBeToggled } from '@/components/events/fake-cursor-about-to-be-toggled';
import { FakeCursorHaveBeenSet } from '@/components/events/fake-cursor-have-been-set';
import { EditorMobileLayoutToggled } from '@/components/events/editor-mobile-layout-toggled';

import type { RedactorDomChangedPayload } from '@/components/events/redactor-dom-changed';
import type { BlockChangedPayload } from '@/components/events/block-changed';
import type { BlockHoveredPayload } from '@/components/events/block-hovered';
import type { FakeCursorAboutToBeToggledPayload } from '@/components/events/fake-cursor-about-to-be-toggled';
import type { FakeCursorHaveBeenSetPayload } from '@/components/events/fake-cursor-have-been-set';
import type { EditorMobileLayoutToggledPayload } from '@/components/events/editor-mobile-layout-toggled';

export {
  RedactorDomChanged,
  BlockChanged,
  FakeCursorAboutToBeToggled,
  FakeCursorHaveBeenSet,
  EditorMobileLayoutToggled,
};

export type EditorEventMap = {
  [BlockHovered]: BlockHoveredPayload;
  [RedactorDomChanged]: RedactorDomChangedPayload;
  [BlockChanged]: BlockChangedPayload;
  [FakeCursorAboutToBeToggled]: FakeCursorAboutToBeToggledPayload;
  [FakeCursorHaveBeenSet]: FakeCursorHaveBeenSetPayload;
  [EditorMobileLayoutToggled]: EditorMobileLayoutToggledPayload;
};
