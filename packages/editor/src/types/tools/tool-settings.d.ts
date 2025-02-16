import type { ToolConfig } from '@repo/editor/types/tools/tool-config';
import type { BlockToolData } from '@repo/editor/types/tools/block-tool-data';
import type {
  MenuConfig,
  MenuConfigItem,
} from '@repo/editor/types/tools/menu-config';
import type { ToolConstructable } from '@repo/editor/types/tools';

export type ToolboxConfig = ToolboxConfigEntry | ToolboxConfigEntry[];

export type ToolboxConfigEntry = {
  title?: string;
  icon?: string;
  data?: BlockToolData;
};

export type ExternalToolSettings<Config extends object = any> = {
  class: ToolConstructable;
  config?: ToolConfig<Config>;
  inlineToolbar?: boolean | string[];
  tunes?: boolean | string[];
  shortcut?: string;
  toolbox?: ToolboxConfig | false;
};

export type TunesMenuConfig = MenuConfig;

export type TunesMenuConfigItem = MenuConfigItem;

export type InternalToolSettings<Config extends object = any> = Omit<
  ExternalToolSettings<Config>,
  'class'
> &
  Partial<Pick<ExternalToolSettings<Config>, 'class'>>;

export type ToolSettings<Config extends object = any> =
  | InternalToolSettings<Config>
  | ExternalToolSettings<Config>;
