export type I18nDictionary = {
  toolNames?: Dictionary;
  tools?: Dictionary;
  blockTunes?: Dictionary;
  ui?: Dictionary;
};

export type Dictionary = {
  [key: string]: DictValue;
};

export type DictValue = { [key: string]: Dictionary | string } | string;
