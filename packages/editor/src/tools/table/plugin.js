import Table from './table';
import * as $ from './utils/dom';

import {
  IconTable,
  IconTableWithHeadings,
  IconTableWithoutHeadings,
} from '@codexteam/icons';

export default class TableBlock {
  static get isReadOnlySupported() {
    return true;
  }

  static get enableLineBreaks() {
    return true;
  }

  constructor({ data, config, api, readOnly, block }) {
    this.api = api;
    this.readOnly = readOnly;
    this.config = config;
    this.data = {
      withHeadings: this.getConfig('withHeadings', false, data),
      content: data && data.content ? data.content : [],
    };
    this.table = null;
    this.block = block;
  }

  static get toolbox() {
    return {
      icon: IconTable,
      title: 'Table',
    };
  }

  render() {
    this.table = new Table(this.readOnly, this.api, this.data, this.config);

    this.container = $.make('div', this.api.styles.block);
    this.container.appendChild(this.table.getWrapper());

    this.table.setHeadingsSetting(this.data.withHeadings);

    return this.container;
  }

  renderSettings() {
    return [
      {
        label: this.api.i18n.t('With headings'),
        icon: IconTableWithHeadings,
        isActive: this.data.withHeadings,
        closeOnActivate: true,
        toggle: true,
        onActivate: () => {
          this.data.withHeadings = true;
          this.table.setHeadingsSetting(this.data.withHeadings);
        },
      },
      {
        label: this.api.i18n.t('Without headings'),
        icon: IconTableWithoutHeadings,
        isActive: !this.data.withHeadings,
        closeOnActivate: true,
        toggle: true,
        onActivate: () => {
          this.data.withHeadings = false;
          this.table.setHeadingsSetting(this.data.withHeadings);
        },
      },
    ];
  }

  save() {
    const tableContent = this.table.getData();

    const result = {
      withHeadings: this.data.withHeadings,
      content: tableContent,
    };

    return result;
  }

  destroy() {
    this.table.destroy();
  }

  getConfig(configName, defaultValue = undefined, savedData = undefined) {
    const data = this.data || savedData;

    if (data) {
      return data[configName] ? data[configName] : defaultValue;
    }

    return this.config && this.config[configName]
      ? this.config[configName]
      : defaultValue;
  }

  static get pasteConfig() {
    return { tags: ['TABLE', 'TR', 'TH', 'TD'] };
  }

  onPaste(event) {
    const table = event.detail.data;

    const firstRowHeading = table.querySelector(
      ':scope > thead, tr:first-of-type th',
    );

    const rows = Array.from(table.querySelectorAll('tr'));

    const content = rows.map((row) => {
      const cells = Array.from(row.querySelectorAll('th, td'));

      return cells.map((cell) => cell.innerHTML);
    });

    this.data = {
      withHeadings: firstRowHeading !== null,
      content,
    };

    if (this.table.wrapper) {
      this.table.wrapper.replaceWith(this.render());
    }
  }
}
