import Module from '@/components/__module';
import { modificationsObserverBatchTimeout } from '@/components/constants';
import {
  BlockChanged,
  FakeCursorAboutToBeToggled,
  FakeCursorHaveBeenSet,
  RedactorDomChanged,
} from '@/components/events';
import * as utilities from '@/components/utilities';

import type { ModuleConfig } from '@/types-internal/module-config';
import type { BlockId } from '@/types/data-formats/block-id';
import type {
  BlockMutationEvent,
  BlockMutationType,
} from '@/types/events/block';

type UniqueBlockMutationKey = `block:${BlockId}:event:${BlockMutationType}`;

export default class ModificationsObserver extends Module {
  private disabled = false;

  private readonly mutationObserver: MutationObserver;

  private batchingTimeout: null | ReturnType<typeof setTimeout> = null;

  private batchingOnChangeQueue = new Map<
    UniqueBlockMutationKey,
    BlockMutationEvent
  >();

  private readonly batchTime = modificationsObserverBatchTimeout;

  constructor({ config, eventsDispatcher }: ModuleConfig) {
    super({
      config,
      eventsDispatcher,
    });

    this.mutationObserver = new MutationObserver((mutations) => {
      this.redactorChanged(mutations);
    });

    this.eventsDispatcher.on(BlockChanged, (payload) => {
      this.particularBlockChanged(payload.event);
    });

    this.eventsDispatcher.on(FakeCursorAboutToBeToggled, () => {
      this.disable();
    });

    this.eventsDispatcher.on(FakeCursorHaveBeenSet, () => {
      this.enable();
    });
  }

  public enable(): void {
    this.mutationObserver.observe(this.Editor.UI.nodes.redactor, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
    });
    this.disabled = false;
  }

  public disable(): void {
    this.mutationObserver.disconnect();
    this.disabled = true;
  }

  private particularBlockChanged(event: BlockMutationEvent): void {
    if (this.disabled || !utilities.isFunction(this.config.onChange)) {
      return;
    }

    this.batchingOnChangeQueue.set(
      `block:${event.detail.target.id}:event:${
        event.type as BlockMutationType
      }`,
      event,
    );

    if (this.batchingTimeout) {
      clearTimeout(this.batchingTimeout);
    }

    this.batchingTimeout = setTimeout(() => {
      let eventsToEmit;

      if (this.batchingOnChangeQueue.size === 1) {
        eventsToEmit = this.batchingOnChangeQueue.values().next().value;
      } else {
        eventsToEmit = Array.from(this.batchingOnChangeQueue.values());
      }

      if (this.config.onChange) {
        this.config.onChange(this.Editor.API.methods, eventsToEmit);
      }

      this.batchingOnChangeQueue.clear();
    }, this.batchTime);
  }

  private redactorChanged(mutations: MutationRecord[]): void {
    this.eventsDispatcher.emit(RedactorDomChanged, {
      mutations,
    });
  }
}
