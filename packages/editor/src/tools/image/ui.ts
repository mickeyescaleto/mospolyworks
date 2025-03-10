import { IconPicture } from '@codexteam/icons';
import { make } from './utils/dom';

import type { API } from '@repo/editor/types';
import type { ImageConfig } from './types/types';

export enum UiState {
  Empty = 'empty',
  Uploading = 'uploading',
  Filled = 'filled',
}

type Nodes = {
  wrapper: HTMLElement;
  imageContainer: HTMLElement;
  fileButton: HTMLElement;
  imageEl?: HTMLElement;
  imagePreloader: HTMLElement;
};

type ConstructorParams = {
  api: API;
  config: ImageConfig;
  onSelectFile: () => void;
  readOnly: boolean;
};

export default class Ui {
  public nodes: Nodes;

  private api: API;

  private config: ImageConfig;

  private onSelectFile: () => void;

  private readOnly: boolean;

  constructor({ api, config, onSelectFile, readOnly }: ConstructorParams) {
    this.api = api;
    this.config = config;
    this.onSelectFile = onSelectFile;
    this.readOnly = readOnly;
    this.nodes = {
      wrapper: make('div', this.CSS.wrapper),
      imageContainer: make('div', this.CSS.imageContainer),
      fileButton: this.createFileButton(),
      imageEl: undefined,
      imagePreloader: make('div', this.CSS.imagePreloader),
    };

    this.nodes.imageContainer.appendChild(this.nodes.imagePreloader);
    this.nodes.wrapper.appendChild(this.nodes.imageContainer);
    this.nodes.wrapper.appendChild(
      make('div', 'invisible-block', {
        contentEditable: true,
        tabIndex: '-1',
      }),
    );
    this.nodes.wrapper.appendChild(this.nodes.fileButton);
  }

  public applyTune(tuneName: string, status: boolean): void {
    this.nodes.wrapper.classList.toggle(
      `${this.CSS.wrapper}--${tuneName}`,
      status,
    );
  }

  public render(): HTMLElement {
    this.toggleStatus(UiState.Empty);

    return this.nodes.wrapper;
  }

  public showPreloader(src: string): void {
    this.nodes.imagePreloader.style.backgroundImage = `url(${src})`;
    this.toggleStatus(UiState.Uploading);
  }

  public hidePreloader(): void {
    this.nodes.imagePreloader.style.backgroundImage = '';
    this.toggleStatus(UiState.Empty);
  }

  public fillImage(url: string): void {
    const tag = /\.mp4$/.test(url) ? 'VIDEO' : 'IMG';

    const attributes: { [key: string]: string | boolean } = {
      src: url,
    };

    let eventName = 'load';

    if (tag === 'VIDEO') {
      attributes.autoplay = true;
      attributes.loop = true;
      attributes.muted = true;
      attributes.playsinline = true;

      eventName = 'loadeddata';
    }

    this.nodes.imageEl = make(tag, this.CSS.imageEl, attributes);

    this.nodes.imageEl.addEventListener(eventName, () => {
      this.toggleStatus(UiState.Filled);

      if (this.nodes.imagePreloader !== undefined) {
        this.nodes.imagePreloader.style.backgroundImage = '';
      }
    });

    this.nodes.imageContainer.appendChild(this.nodes.imageEl);
  }

  public toggleStatus(status: UiState): void {
    for (const statusType in UiState) {
      if (Object.prototype.hasOwnProperty.call(UiState, statusType)) {
        const state = UiState[statusType as keyof typeof UiState];

        this.nodes.wrapper.classList.toggle(
          `${this.CSS.wrapper}--${state}`,
          state === status,
        );
      }
    }
  }

  private get CSS(): Record<string, string> {
    return {
      button: this.api.styles.button,
      wrapper: 'e-image',
      imageContainer: 'e-image__image',
      imagePreloader: 'e-image__image-preloader',
      imageEl: 'e-image__image-picture',
    };
  }

  private createFileButton(): HTMLElement {
    const button = make('div', this.CSS.button);

    button.innerHTML =
      this.config.buttonContent ??
      `${IconPicture} ${this.api.i18n.t('Select an Image')}`;

    button.addEventListener('click', () => {
      this.onSelectFile();
    });

    return button;
  }
}
