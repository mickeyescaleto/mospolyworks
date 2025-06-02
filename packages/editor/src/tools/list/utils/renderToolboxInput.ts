import * as Dom from '@editorjs/dom';
import { CssPrefix } from '../styles/CssPrefix';

interface InputOptions {
  placeholder: string;
  value?: string;
  attributes?: {
    [key: string]: string;
  };
  sanitize?: (value: string) => string;
}

const css = {
  wrapper: `${CssPrefix}-start-with-field`,
  input: `${CssPrefix}-start-with-field__input`,
  startWithElementWrapperInvalid: `${CssPrefix}-start-with-field--invalid`,
};

export function renderToolboxInput(
  inputCallback: (index: string) => void,
  { value, placeholder, attributes, sanitize }: InputOptions,
): HTMLElement {
  const startWithElementWrapper = Dom.make('div', css.wrapper);

  const input = Dom.make('input', css.input, {
    placeholder,
    tabIndex: -1,
    value,
  }) as HTMLInputElement;

  for (const attribute in attributes) {
    input.setAttribute(attribute, attributes[attribute]);
  }

  startWithElementWrapper.appendChild(input);

  input.addEventListener('input', () => {
    if (sanitize !== undefined) {
      input.value = sanitize(input.value);
    }

    const validInput = input.checkValidity();

    if (
      !validInput &&
      !startWithElementWrapper.classList.contains(
        css.startWithElementWrapperInvalid,
      )
    ) {
      startWithElementWrapper.classList.add(css.startWithElementWrapperInvalid);
    }

    if (
      validInput &&
      startWithElementWrapper.classList.contains(
        css.startWithElementWrapperInvalid,
      )
    ) {
      startWithElementWrapper.classList.remove(
        css.startWithElementWrapperInvalid,
      );
    }

    if (!validInput) {
      return;
    }

    inputCallback(input.value);
  });

  return startWithElementWrapper;
}
