import { RedactorDomChanged } from '@repo/editor/components/events/redactor-dom-changed';
import { BlockChanged } from '@repo/editor/components/events/block-changed';
import { BlockHovered } from '@repo/editor/components/events/block-hovered';
import { FakeCursorAboutToBeToggled } from '@repo/editor/components/events/fake-cursor-about-to-be-toggled';
import { FakeCursorHaveBeenSet } from '@repo/editor/components/events/fake-cursor-have-been-set';
import { EditorMobileLayoutToggled } from '@repo/editor/components/events/editor-mobile-layout-toggled';

import type { RedactorDomChangedPayload } from '@repo/editor/components/events/redactor-dom-changed';
import type { BlockChangedPayload } from '@repo/editor/components/events/block-changed';
import type { BlockHoveredPayload } from '@repo/editor/components/events/block-hovered';
import type { FakeCursorAboutToBeToggledPayload } from '@repo/editor/components/events/fake-cursor-about-to-be-toggled';
import type { FakeCursorHaveBeenSetPayload } from '@repo/editor/components/events/fake-cursor-have-been-set';
import type { EditorMobileLayoutToggledPayload } from '@repo/editor/components/events/editor-mobile-layout-toggled';

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
