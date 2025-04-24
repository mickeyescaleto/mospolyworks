import { IconAlignLeft } from '@codexteam/icons';
import { IconAlignCenter } from '@codexteam/icons';
import { IconAlignRight } from '@codexteam/icons';
import { IconAlignJustify } from '@codexteam/icons';

import './styles.css';
import { PopoverItemType } from '@repo/editor/types/utils/popover/popover-item-type';

type Styles = {
  alignment: {
    left: string;
    center: string;
    right: string;
    justify: string;
  };
};

type Alignment = {
  name: AlignmentType;
  icon: string;
};

type Data = {
  alignment: AlignmentType;
};

type Config = {
  blocks: undefined | BlockType[];
  default: undefined | AlignmentType;
};

type BlockType = {
  default: undefined | AlignmentType;
  availableAlignments: undefined | AlignmentType[];
};

type AlignmentType = keyof Styles['alignment'];

export default class AlignmentTune {
  api: any;
  data: Data;
  config: Config;
  block: any;
  alignments: Alignment[];
  wrapper: HTMLDivElement;
  styles: Styles;

  static readonly DEFAULT_ALIGNMENT: AlignmentType = 'left';

  static get isTune(): boolean {
    return true;
  }

  getDefaultAlignment(): AlignmentType {
    const blockSettings = this.getCurrentBlockSettings();

    if (
      blockSettings &&
      blockSettings.default &&
      this.#alignmentIsValid(blockSettings.default)
    ) {
      return blockSettings.default;
    }

    if (this.config.default && this.#alignmentIsValid(this.config.default)) {
      return this.config.default;
    }

    return AlignmentTune.DEFAULT_ALIGNMENT;
  }

  getAvailableBlockAlignments(): Alignment[] {
    const allAlignments: Alignment[] = [
      {
        name: 'left',
        icon: IconAlignLeft,
      },
      {
        name: 'center',
        icon: IconAlignCenter,
      },
      {
        name: 'right',
        icon: IconAlignRight,
      },
      {
        name: 'justify',
        icon: IconAlignJustify,
      },
    ];

    const blockSettings = this.getCurrentBlockSettings();
    if (blockSettings && blockSettings.availableAlignments) {
      const availableAlignments: Alignment[] = [];

      blockSettings.availableAlignments.forEach((availableAlignment) => {
        if (this.#alignmentIsValid(availableAlignment)) {
          const alignment = allAlignments.find(
            (targetAlignment) => targetAlignment.name === availableAlignment,
          );
          if (alignment) {
            availableAlignments.push(alignment);
          }
        }
      });

      if (availableAlignments.length > 0) {
        return availableAlignments;
      }

      return allAlignments;
    }

    return allAlignments;
  }

  getCurrentBlockSettings(): null | BlockType {
    if (this.config.blocks) {
      const blockSettings = this.config.blocks[this.block.name];
      if (blockSettings) {
        return blockSettings;
      }
    }
    return null;
  }

  constructor({
    api,
    data,
    config,
    block,
  }: {
    api: any;
    data: undefined | Data;
    config: any;
    block: any;
  }) {
    this.api = api;
    this.block = block;
    this.config = config;

    this.data = data ?? { alignment: this.getDefaultAlignment() };

    this.alignments = this.getAvailableBlockAlignments();

    this.styles = {
      alignment: {
        left: 'e-alignment-tune--left',
        center: 'e-alignment-tune--center',
        right: 'e-alignment-tune--right',
        justify: 'e-alignment-tune--justify',
      },
    };

    this.wrapper = document.createElement('div');
  }

  wrap(blockContent: Node) {
    this.wrapper.classList.add(this.styles.alignment[this.data.alignment]);
    this.wrapper.append(blockContent);
    return this.wrapper;
  }

  render() {
    const items: unknown[] = [];

    this.alignments.forEach((alignment, index) => {
      items.push({
        icon: alignment.icon,
        title: this.api.i18n.t(
          alignment.name.charAt(0).toUpperCase() + alignment.name.slice(1),
        ),
        closeOnActivate: true,
        isActive: alignment.name === this.data.alignment,
        onActivate: () => {
          const currentAlignment = this.data.alignment;
          const newAlignment = this.alignments[index].name;

          this.data.alignment = newAlignment;

          this.block.dispatchChange();

          this.wrapper.classList.remove(
            this.styles.alignment[currentAlignment],
          );
          this.wrapper.classList.add(this.styles.alignment[newAlignment]);
        },
      });
    });

    return [
      {
        icon: this.getIcon(),
        title: this.api.i18n.t('Alignment'),
        children: {
          searchable: false,
          items,
        },
      },
      {
        type: PopoverItemType.Separator,
      },
    ];
  }

  getIcon() {
    const alignments: Record<AlignmentType, number> = {
      left: 0,
      center: 1,
      right: 2,
      justify: 3,
    };

    return this.alignments[alignments[this.data.alignment]]?.icon;
  }

  save() {
    return this.data;
  }

  #alignmentIsValid(alignment: string): boolean {
    const alignments = ['left', 'center', 'right', 'justify'];

    if (alignments.includes(alignment)) {
      return true;
    }

    return false;
  }
}
