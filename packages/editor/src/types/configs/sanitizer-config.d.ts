export type TagConfig = boolean | { [attr: string]: boolean | string };

export type SanitizerRule = TagConfig | ((el: Element) => TagConfig);

export type SanitizerConfig = {
  [key: string]: SanitizerRule;
};
