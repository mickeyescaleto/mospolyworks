declare module 'html-janitor' {
  type TagConfig = boolean | { [attr: string]: boolean | string };

  type Config = {
    tags: {
      [key: string]: TagConfig | ((el: Element) => TagConfig);
    };
  };

  export class HTMLJanitor {
    constructor(config: Config);

    public clean(taintString: string): string;
  }

  export default HTMLJanitor;
}
