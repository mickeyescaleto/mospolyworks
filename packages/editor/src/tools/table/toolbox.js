import Popover from './utils/popover';
import * as $ from './utils/dom';
import { IconMenuSmall } from '@codexteam/icons';

export default class Toolbox {
  constructor({ api, items, onOpen, onClose, cssModifier = '' }) {
    this.api = api;

    this.items = items;
    this.onOpen = onOpen;
    this.onClose = onClose;
    this.cssModifier = cssModifier;

    this.popover = null;
    this.wrapper = this.createToolbox();
  }

  static get CSS() {
    return {
      toolbox: 'tc-toolbox',
      toolboxShowed: 'tc-toolbox--showed',
      toggler: 'tc-toolbox__toggler',
    };
  }

  get element() {
    return this.wrapper;
  }

  createToolbox() {
    const wrapper = $.make('div', [
      Toolbox.CSS.toolbox,
      this.cssModifier ? `${Toolbox.CSS.toolbox}--${this.cssModifier}` : '',
    ]);

    wrapper.dataset.mutationFree = 'true';
    const popover = this.createPopover();
    const toggler = this.createToggler();

    wrapper.appendChild(toggler);
    wrapper.appendChild(popover);

    return wrapper;
  }

  createToggler() {
    const toggler = $.make('div', Toolbox.CSS.toggler, {
      innerHTML: IconMenuSmall,
    });

    toggler.addEventListener('click', () => {
      this.togglerClicked();
    });

    return toggler;
  }

  createPopover() {
    this.popover = new Popover({
      items: this.items,
    });

    return this.popover.render();
  }

  togglerClicked() {
    if (this.popover.opened) {
      this.popover.close();
      this.onClose();
    } else {
      this.popover.open();
      this.onOpen();
    }
  }

  show(computePositionMethod) {
    const position = computePositionMethod();

    Object.entries(position).forEach(([prop, value]) => {
      this.wrapper.style[prop] = value;
    });

    this.wrapper.classList.add(Toolbox.CSS.toolboxShowed);
  }

  hide() {
    this.popover.close();
    this.wrapper.classList.remove(Toolbox.CSS.toolboxShowed);
  }
}
