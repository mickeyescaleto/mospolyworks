import {
  IconAddBorder,
  IconStretch,
  IconAddBackground,
  IconPicture,
  IconText,
} from '@codexteam/icons';
import Ui from './ui';
import Uploader from './uploader';
import './styles.css';

import type { TunesMenuConfig } from '@repo/editor/types/tools/tool-settings';
import type { API } from '@repo/editor/types';
import type { ToolboxConfig } from '@repo/editor/types/tools/tool-settings';
import type { PasteConfig } from '@repo/editor/types/configs/paste-config';
import type {
  BlockTool,
  BlockToolConstructorOptions,
} from '@repo/editor/types/tools/block-tool';
import type { BlockAPI } from '@repo/editor/types/api/block';
import type { PasteEvent } from '@repo/editor/types/tools/paste-events';
import type { PatternPasteEventDetail } from '@repo/editor/types/tools/paste-events';
import type { FilePasteEventDetail } from '@repo/editor/types/tools/paste-events';
import type {
  ActionConfig,
  UploadResponseFormat,
  ImageToolData,
  ImageConfig,
  HTMLPasteEventDetailExtended,
  ImageSetterParam,
  FeaturesConfig,
} from './types/types';

type ImageToolConstructorOptions = BlockToolConstructorOptions<
  ImageToolData,
  ImageConfig
>;

export default class Image implements BlockTool {
  private api: API;

  private block: BlockAPI;

  private config: ImageConfig;

  private uploader: Uploader;

  private ui: Ui;

  private _data: ImageToolData;

  private isCaptionEnabled: boolean | null = null;

  constructor({
    data,
    config,
    api,
    readOnly,
    block,
  }: ImageToolConstructorOptions) {
    this.api = api;
    this.block = block;

    this.config = {
      endpoints: config.endpoints,
      additionalRequestData: config.additionalRequestData,
      additionalRequestHeaders: config.additionalRequestHeaders,
      field: config.field,
      types: config.types,
      captionPlaceholder: this.api.i18n.t(
        config.captionPlaceholder ?? 'Caption',
      ),
      buttonContent: config.buttonContent,
      uploader: config.uploader,
      actions: config.actions,
      features: config.features || {},
    };

    this.uploader = new Uploader({
      config: this.config,
      onUpload: (response: UploadResponseFormat) => this.onUpload(response),
      onError: (error: string) => this.uploadingFailed(error),
    });

    this.ui = new Ui({
      api,
      config: this.config,
      onSelectFile: () => {
        this.uploader.uploadSelectedFile({
          onPreview: (src: string) => {
            this.ui.showPreloader(src);
          },
        });
      },
      readOnly,
    });

    this._data = {
      caption: '',
      withBorder: false,
      withBackground: false,
      stretched: false,
      file: {
        url: '',
      },
    };
    this.data = data;
  }

  public static get isReadOnlySupported(): boolean {
    return true;
  }

  public static get toolbox(): ToolboxConfig {
    return {
      icon: IconPicture,
      title: 'Image',
    };
  }

  public static get tunes(): Array<ActionConfig> {
    return [
      {
        name: 'withBorder',
        icon: IconAddBorder,
        title: 'With border',
        toggle: true,
      },
      {
        name: 'stretched',
        icon: IconStretch,
        title: 'Stretch image',
        toggle: true,
      },
      {
        name: 'withBackground',
        icon: IconAddBackground,
        title: 'With background',
        toggle: true,
      },
    ];
  }

  public render(): HTMLDivElement {
    if (
      this.config.features?.caption === true ||
      this.config.features?.caption === undefined ||
      (this.config.features?.caption === 'optional' && this.data.caption)
    ) {
      this.isCaptionEnabled = true;
    }

    return this.ui.render() as HTMLDivElement;
  }

  public validate(savedData: ImageToolData): boolean {
    return !!savedData.file.url;
  }

  public save(): ImageToolData {
    const caption = this.ui.nodes.caption;

    this._data.caption = caption.innerHTML;

    return this.data;
  }

  public renderSettings(): TunesMenuConfig {
    const tunes = Image.tunes.concat(this.config.actions || []);
    const featureTuneMap: Record<string, string> = {
      border: 'withBorder',
      background: 'withBackground',
      stretch: 'stretched',
      caption: 'caption',
    };

    if (this.config.features?.caption === 'optional') {
      tunes.push({
        name: 'caption',
        icon: IconText,
        title: 'With caption',
        toggle: true,
      });
    }

    const availableTunes = tunes.filter((tune) => {
      const featureKey = Object.keys(featureTuneMap).find(
        (key) => featureTuneMap[key] === tune.name,
      );

      if (featureKey === 'caption') {
        return this.config.features?.caption !== false;
      }

      return (
        featureKey == null ||
        this.config.features?.[featureKey as keyof FeaturesConfig] !== false
      );
    });

    const isActive = (tune: ActionConfig): boolean => {
      let currentState = this.data[tune.name as keyof ImageToolData] as boolean;

      if (tune.name === 'caption') {
        currentState = this.isCaptionEnabled ?? currentState;
      }

      return currentState;
    };

    return availableTunes.map((tune) => ({
      icon: tune.icon,
      label: this.api.i18n.t(tune.title),
      name: tune.name,
      toggle: tune.toggle,
      isActive: isActive(tune),
      onActivate: () => {
        if (typeof tune.action === 'function') {
          tune.action(tune.name);

          return;
        }
        let newState = !isActive(tune);

        if (tune.name === 'caption') {
          this.isCaptionEnabled = !(this.isCaptionEnabled ?? false);
          newState = this.isCaptionEnabled;
        }

        this.tuneToggled(tune.name as keyof ImageToolData, newState);
      },
    }));
  }

  public appendCallback(): void {
    this.ui.nodes.fileButton.click();
  }

  public static get pasteConfig(): PasteConfig {
    return {
      tags: [
        {
          img: { src: true },
        },
      ],
      patterns: {
        image: /https?:\/\/\S+\.(gif|jpe?g|tiff|png|svg|webp)(\?[a-z0-9=]*)?$/i,
      },
      files: {
        mimeTypes: ['image/*'],
      },
    };
  }

  public async onPaste(event: PasteEvent): Promise<void> {
    switch (event.type) {
      case 'tag': {
        const image = (event.detail as HTMLPasteEventDetailExtended).data;

        if (/^blob:/.test(image.src)) {
          const response = await fetch(image.src);

          const file = await response.blob();

          this.uploadFile(file);
          break;
        }

        this.uploadUrl(image.src);
        break;
      }
      case 'pattern': {
        const url = (event.detail as PatternPasteEventDetail).data;

        this.uploadUrl(url);
        break;
      }
      case 'file': {
        const file = (event.detail as FilePasteEventDetail).file;

        this.uploadFile(file);
        break;
      }
    }
  }

  private set data(data: ImageToolData) {
    this.image = data.file;

    this._data.caption = data.caption || '';
    this.ui.fillCaption(this._data.caption);

    Image.tunes.forEach(({ name: tune }) => {
      const value =
        typeof data[tune as keyof ImageToolData] !== 'undefined'
          ? data[tune as keyof ImageToolData] === true ||
            data[tune as keyof ImageToolData] === 'true'
          : false;

      this.setTune(tune as keyof ImageToolData, value);
    });

    if (data.caption) {
      this.setTune('caption', true);
    }
  }

  private get data(): ImageToolData {
    return this._data;
  }

  private set image(file: ImageSetterParam | undefined) {
    this._data.file = file || { url: '' };

    if (file && file.url) {
      this.ui.fillImage(file.url);
    }
  }

  private onUpload(response: UploadResponseFormat): void {
    if (response.success && Boolean(response.file)) {
      this.image = response.file;
    } else {
      this.uploadingFailed('incorrect response: ' + JSON.stringify(response));
    }
  }

  private uploadingFailed(errorText: string): void {
    console.log('Image Tool: uploading failed because of', errorText);

    this.api.notifier.show({
      message: this.api.i18n.t('Couldn’t upload image. Please try another.'),
      style: 'error',
    });
    this.ui.hidePreloader();
  }

  private tuneToggled(tuneName: keyof ImageToolData, state: boolean): void {
    if (tuneName === 'caption') {
      this.ui.applyTune(tuneName, state);

      if (state == false) {
        this._data.caption = '';
        this.ui.fillCaption('');
      }
    } else {
      this.setTune(tuneName, state);
    }
  }

  private setTune(tuneName: keyof ImageToolData, value: boolean): void {
    (this._data[tuneName] as boolean) = value;

    this.ui.applyTune(tuneName, value);
    if (tuneName === 'stretched') {
      Promise.resolve()
        .then(() => {
          this.block.stretched = value;
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }

  private uploadFile(file: Blob): void {
    this.uploader.uploadByFile(file, {
      onPreview: (src: string) => {
        this.ui.showPreloader(src);
      },
    });
  }

  private uploadUrl(url: string): void {
    this.ui.showPreloader(url);
    this.uploader.uploadByUrl(url);
  }
}
