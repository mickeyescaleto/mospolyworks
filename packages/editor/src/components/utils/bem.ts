const ELEMENT_DELIMITER = '__';
const MODIFIER_DELIMITER = '--';

export function bem(blockName: string) {
  return (elementName?: string | null, modifier?: string) => {
    const className = [blockName, elementName]
      .filter((x) => !!x)
      .join(ELEMENT_DELIMITER);

    return [className, modifier].filter((x) => !!x).join(MODIFIER_DELIMITER);
  };
}
