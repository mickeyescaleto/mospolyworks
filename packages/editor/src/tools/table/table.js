import Toolbox from './toolbox';
import * as $ from './utils/dom';
import throttled from './utils/throttled';

import {
  IconDirectionLeftDown,
  IconDirectionRightDown,
  IconDirectionUpRight,
  IconDirectionDownRight,
  IconCross,
  IconPlus,
} from '@codexteam/icons';

const CSS = {
  wrapper: 'tc-wrap',
  wrapperReadOnly: 'tc-wrap--readonly',
  table: 'tc-table',
  row: 'tc-row',
  withHeadings: 'tc-table--heading',
  rowSelected: 'tc-row--selected',
  cell: 'tc-cell',
  cellSelected: 'tc-cell--selected',
  addRow: 'tc-add-row',
  addRowDisabled: 'tc-add-row--disabled',
  addColumn: 'tc-add-column',
  addColumnDisabled: 'tc-add-column--disabled',
};

export default class Table {
  constructor(readOnly, api, data, config) {
    this.readOnly = readOnly;
    this.api = api;
    this.data = data;
    this.config = config;

    this.wrapper = null;
    this.table = null;

    this.toolboxColumn = this.createColumnToolbox();
    this.toolboxRow = this.createRowToolbox();

    this.createTableWrapper();

    this.hoveredRow = 0;

    this.hoveredColumn = 0;

    this.selectedRow = 0;

    this.selectedColumn = 0;

    this.tunes = {
      withHeadings: false,
    };

    this.resize();

    this.fill();

    this.focusedCell = {
      row: 0,
      column: 0,
    };

    this.documentClicked = (event) => {
      const clickedInsideTable = event.target.closest(`.${CSS.table}`) !== null;
      const outsideTableClicked =
        event.target.closest(`.${CSS.wrapper}`) === null;
      const clickedOutsideToolboxes = clickedInsideTable || outsideTableClicked;

      if (clickedOutsideToolboxes) {
        this.hideToolboxes();
      }

      const clickedOnAddRowButton = event.target.closest(`.${CSS.addRow}`);
      const clickedOnAddColumnButton = event.target.closest(
        `.${CSS.addColumn}`,
      );

      if (
        clickedOnAddRowButton &&
        clickedOnAddRowButton.parentNode === this.wrapper
      ) {
        this.addRow(undefined, true);
        this.hideToolboxes();
      } else if (
        clickedOnAddColumnButton &&
        clickedOnAddColumnButton.parentNode === this.wrapper
      ) {
        this.addColumn(undefined, true);
        this.hideToolboxes();
      }
    };

    if (!this.readOnly) {
      this.bindEvents();
    }
  }

  getWrapper() {
    return this.wrapper;
  }

  bindEvents() {
    document.addEventListener('click', this.documentClicked);

    this.table.addEventListener(
      'mousemove',
      throttled(150, (event) => this.onMouseMoveInTable(event)),
      { passive: true },
    );

    this.table.onkeypress = (event) => this.onKeyPressListener(event);

    this.table.addEventListener('keydown', (event) =>
      this.onKeyDownListener(event),
    );

    this.table.addEventListener('focusin', (event) =>
      this.focusInTableListener(event),
    );
  }

  createColumnToolbox() {
    return new Toolbox({
      api: this.api,
      cssModifier: 'column',
      items: [
        {
          label: this.api.i18n.t('Add column to left'),
          icon: IconDirectionLeftDown,
          hideIf: () => {
            return this.numberOfColumns === this.config.maxcols;
          },
          onClick: () => {
            this.addColumn(this.selectedColumn, true);
            this.hideToolboxes();
          },
        },
        {
          label: this.api.i18n.t('Add column to right'),
          icon: IconDirectionRightDown,
          hideIf: () => {
            return this.numberOfColumns === this.config.maxcols;
          },
          onClick: () => {
            this.addColumn(this.selectedColumn + 1, true);
            this.hideToolboxes();
          },
        },
        {
          label: this.api.i18n.t('Delete column'),
          icon: IconCross,
          hideIf: () => {
            return this.numberOfColumns === 1;
          },
          confirmationRequired: true,
          onClick: () => {
            this.deleteColumn(this.selectedColumn);
            this.hideToolboxes();
          },
        },
      ],
      onOpen: () => {
        this.selectColumn(this.hoveredColumn);
        this.hideRowToolbox();
      },
      onClose: () => {
        this.unselectColumn();
      },
    });
  }

  createRowToolbox() {
    return new Toolbox({
      api: this.api,
      cssModifier: 'row',
      items: [
        {
          label: this.api.i18n.t('Add row above'),
          icon: IconDirectionUpRight,
          hideIf: () => {
            return this.numberOfRows === this.config.maxrows;
          },
          onClick: () => {
            this.addRow(this.selectedRow, true);
            this.hideToolboxes();
          },
        },
        {
          label: this.api.i18n.t('Add row below'),
          icon: IconDirectionDownRight,
          hideIf: () => {
            return this.numberOfRows === this.config.maxrows;
          },
          onClick: () => {
            this.addRow(this.selectedRow + 1, true);
            this.hideToolboxes();
          },
        },
        {
          label: this.api.i18n.t('Delete row'),
          icon: IconCross,
          hideIf: () => {
            return this.numberOfRows === 1;
          },
          confirmationRequired: true,
          onClick: () => {
            this.deleteRow(this.selectedRow);
            this.hideToolboxes();
          },
        },
      ],
      onOpen: () => {
        this.selectRow(this.hoveredRow);
        this.hideColumnToolbox();
      },
      onClose: () => {
        this.unselectRow();
      },
    });
  }

  moveCursorToNextRow() {
    if (this.focusedCell.row !== this.numberOfRows) {
      this.focusedCell.row += 1;
      this.focusCell(this.focusedCell);
    } else {
      this.addRow();
      this.focusedCell.row += 1;
      this.focusCell(this.focusedCell);
      this.updateToolboxesPosition(0, 0);
    }
  }

  getCell(row, column) {
    return this.table.querySelectorAll(
      `.${CSS.row}:nth-child(${row}) .${CSS.cell}`,
    )[column - 1];
  }

  getRow(row) {
    return this.table.querySelector(`.${CSS.row}:nth-child(${row})`);
  }

  getRowByCell(cell) {
    return cell.parentElement;
  }

  getRowFirstCell(row) {
    return row.querySelector(`.${CSS.cell}:first-child`);
  }

  setCellContent(row, column, content) {
    const cell = this.getCell(row, column);

    cell.innerHTML = content;
  }

  addColumn(columnIndex = -1, setFocus = false) {
    let numberOfColumns = this.numberOfColumns;
    if (
      this.config &&
      this.config.maxcols &&
      this.numberOfColumns >= this.config.maxcols
    ) {
      return;
    }

    for (let rowIndex = 1; rowIndex <= this.numberOfRows; rowIndex++) {
      let cell;
      const cellElem = this.createCell();

      if (columnIndex > 0 && columnIndex <= numberOfColumns) {
        cell = this.getCell(rowIndex, columnIndex);

        $.insertBefore(cellElem, cell);
      } else {
        cell = this.getRow(rowIndex).appendChild(cellElem);
      }

      if (rowIndex === 1) {
        const firstCell = this.getCell(
          rowIndex,
          columnIndex > 0 ? columnIndex : numberOfColumns + 1,
        );

        if (firstCell && setFocus) {
          $.focus(firstCell);
        }
      }
    }

    const addColButton = this.wrapper.querySelector(`.${CSS.addColumn}`);
    if (
      this.config?.maxcols &&
      this.numberOfColumns > this.config.maxcols - 1 &&
      addColButton
    ) {
      addColButton.classList.add(CSS.addColumnDisabled);
    }
    this.addHeadingAttrToFirstRow();
  }

  addRow(index = -1, setFocus = false) {
    let insertedRow;
    let rowElem = $.make('div', CSS.row);

    if (this.tunes.withHeadings) {
      this.removeHeadingAttrFromFirstRow();
    }

    let numberOfColumns = this.numberOfColumns;
    if (
      this.config &&
      this.config.maxrows &&
      this.numberOfRows >= this.config.maxrows &&
      addRowButton
    ) {
      return;
    }

    if (index > 0 && index <= this.numberOfRows) {
      let row = this.getRow(index);

      insertedRow = $.insertBefore(rowElem, row);
    } else {
      insertedRow = this.table.appendChild(rowElem);
    }

    this.fillRow(insertedRow, numberOfColumns);

    if (this.tunes.withHeadings) {
      this.addHeadingAttrToFirstRow();
    }

    const insertedRowFirstCell = this.getRowFirstCell(insertedRow);

    if (insertedRowFirstCell && setFocus) {
      $.focus(insertedRowFirstCell);
    }

    const addRowButton = this.wrapper.querySelector(`.${CSS.addRow}`);
    if (
      this.config &&
      this.config.maxrows &&
      this.numberOfRows >= this.config.maxrows &&
      addRowButton
    ) {
      addRowButton.classList.add(CSS.addRowDisabled);
    }
    return insertedRow;
  }

  deleteColumn(index) {
    for (let i = 1; i <= this.numberOfRows; i++) {
      const cell = this.getCell(i, index);

      if (!cell) {
        return;
      }

      cell.remove();
    }
    const addColButton = this.wrapper.querySelector(`.${CSS.addColumn}`);
    if (addColButton) {
      addColButton.classList.remove(CSS.addColumnDisabled);
    }
  }

  deleteRow(index) {
    this.getRow(index).remove();
    const addRowButton = this.wrapper.querySelector(`.${CSS.addRow}`);
    if (addRowButton) {
      addRowButton.classList.remove(CSS.addRowDisabled);
    }

    this.addHeadingAttrToFirstRow();
  }

  createTableWrapper() {
    this.wrapper = $.make('div', CSS.wrapper);
    this.table = $.make('div', CSS.table);

    if (this.readOnly) {
      this.wrapper.classList.add(CSS.wrapperReadOnly);
    }

    this.wrapper.appendChild(this.toolboxRow.element);
    this.wrapper.appendChild(this.toolboxColumn.element);
    this.wrapper.appendChild(this.table);

    if (!this.readOnly) {
      const addColumnButton = $.make('div', CSS.addColumn, {
        innerHTML: IconPlus,
      });
      const addRowButton = $.make('div', CSS.addRow, {
        innerHTML: IconPlus,
      });

      this.wrapper.appendChild(addColumnButton);
      this.wrapper.appendChild(addRowButton);
    }
  }

  computeInitialSize() {
    const content = this.data && this.data.content;
    const isValidArray = Array.isArray(content);
    const isNotEmptyArray = isValidArray ? content.length : false;
    const contentRows = isValidArray ? content.length : undefined;
    const contentCols = isNotEmptyArray ? content[0].length : undefined;
    const parsedRows = Number.parseInt(this.config && this.config.rows);
    const parsedCols = Number.parseInt(this.config && this.config.cols);

    const configRows =
      !isNaN(parsedRows) && parsedRows > 0 ? parsedRows : undefined;
    const configCols =
      !isNaN(parsedCols) && parsedCols > 0 ? parsedCols : undefined;
    const defaultRows = 2;
    const defaultCols = 2;
    const rows = contentRows || configRows || defaultRows;
    const cols = contentCols || configCols || defaultCols;

    return {
      rows: rows,
      cols: cols,
    };
  }

  resize() {
    const { rows, cols } = this.computeInitialSize();

    for (let i = 0; i < rows; i++) {
      this.addRow();
    }

    for (let i = 0; i < cols; i++) {
      this.addColumn();
    }
  }

  fill() {
    const data = this.data;

    if (data && data.content) {
      for (let i = 0; i < data.content.length; i++) {
        for (let j = 0; j < data.content[i].length; j++) {
          this.setCellContent(i + 1, j + 1, data.content[i][j]);
        }
      }
    }
  }

  fillRow(row, numberOfColumns) {
    for (let i = 1; i <= numberOfColumns; i++) {
      const newCell = this.createCell();

      row.appendChild(newCell);
    }
  }

  createCell() {
    return $.make('div', CSS.cell, {
      contentEditable: !this.readOnly,
    });
  }

  get numberOfRows() {
    return this.table.childElementCount;
  }

  get numberOfColumns() {
    if (this.numberOfRows) {
      return this.table.querySelectorAll(`.${CSS.row}:first-child .${CSS.cell}`)
        .length;
    }

    return 0;
  }

  get isColumnMenuShowing() {
    return this.selectedColumn !== 0;
  }

  get isRowMenuShowing() {
    return this.selectedRow !== 0;
  }

  onMouseMoveInTable(event) {
    const { row, column } = this.getHoveredCell(event);

    this.hoveredColumn = column;
    this.hoveredRow = row;

    this.updateToolboxesPosition();
  }

  onKeyPressListener(event) {
    if (event.key === 'Enter') {
      if (event.shiftKey) {
        return true;
      }

      this.moveCursorToNextRow();
    }

    return event.key !== 'Enter';
  }

  onKeyDownListener(event) {
    if (event.key === 'Tab') {
      event.stopPropagation();
    }
  }

  focusInTableListener(event) {
    const cell = event.target;
    const row = this.getRowByCell(cell);

    this.focusedCell = {
      row:
        Array.from(this.table.querySelectorAll(`.${CSS.row}`)).indexOf(row) + 1,
      column:
        Array.from(row.querySelectorAll(`.${CSS.cell}`)).indexOf(cell) + 1,
    };
  }

  hideToolboxes() {
    this.hideRowToolbox();
    this.hideColumnToolbox();
    this.updateToolboxesPosition();
  }

  hideRowToolbox() {
    this.unselectRow();
    this.toolboxRow.hide();
  }

  hideColumnToolbox() {
    this.unselectColumn();

    this.toolboxColumn.hide();
  }

  focusCell() {
    this.focusedCellElem.focus();
  }

  get focusedCellElem() {
    const { row, column } = this.focusedCell;

    return this.getCell(row, column);
  }

  updateToolboxesPosition(row = this.hoveredRow, column = this.hoveredColumn) {
    if (!this.isColumnMenuShowing) {
      if (column > 0 && column <= this.numberOfColumns) {
        this.toolboxColumn.show(() => {
          return {
            left: `calc((100% - var(--cell-size)) / (${this.numberOfColumns} * 2) * (1 + (${column} - 1) * 2))`,
          };
        });
      }
    }

    if (!this.isRowMenuShowing) {
      if (row > 0 && row <= this.numberOfRows) {
        this.toolboxRow.show(() => {
          const hoveredRowElement = this.getRow(row);
          const { fromTopBorder } = $.getRelativeCoordsOfTwoElems(
            this.table,
            hoveredRowElement,
          );
          const { height } = hoveredRowElement.getBoundingClientRect();

          return {
            top: `${Math.ceil(fromTopBorder + height / 2)}px`,
          };
        });
      }
    }
  }

  setHeadingsSetting(withHeadings) {
    this.tunes.withHeadings = withHeadings;

    if (withHeadings) {
      this.table.classList.add(CSS.withHeadings);
      this.addHeadingAttrToFirstRow();
    } else {
      this.table.classList.remove(CSS.withHeadings);
      this.removeHeadingAttrFromFirstRow();
    }
  }

  addHeadingAttrToFirstRow() {
    for (let cellIndex = 1; cellIndex <= this.numberOfColumns; cellIndex++) {
      let cell = this.getCell(1, cellIndex);

      if (cell) {
        cell.setAttribute('heading', this.api.i18n.t('Heading'));
      }
    }
  }

  removeHeadingAttrFromFirstRow() {
    for (let cellIndex = 1; cellIndex <= this.numberOfColumns; cellIndex++) {
      let cell = this.getCell(1, cellIndex);

      if (cell) {
        cell.removeAttribute('heading');
      }
    }
  }

  selectRow(index) {
    const row = this.getRow(index);

    if (row) {
      this.selectedRow = index;
      row.classList.add(CSS.rowSelected);
    }
  }

  unselectRow() {
    if (this.selectedRow <= 0) {
      return;
    }

    const row = this.table.querySelector(`.${CSS.rowSelected}`);

    if (row) {
      row.classList.remove(CSS.rowSelected);
    }

    this.selectedRow = 0;
  }

  selectColumn(index) {
    for (let i = 1; i <= this.numberOfRows; i++) {
      const cell = this.getCell(i, index);

      if (cell) {
        cell.classList.add(CSS.cellSelected);
      }
    }

    this.selectedColumn = index;
  }

  unselectColumn() {
    if (this.selectedColumn <= 0) {
      return;
    }

    let cells = this.table.querySelectorAll(`.${CSS.cellSelected}`);

    Array.from(cells).forEach((column) => {
      column.classList.remove(CSS.cellSelected);
    });

    this.selectedColumn = 0;
  }

  getHoveredCell(event) {
    let hoveredRow = this.hoveredRow;
    let hoveredColumn = this.hoveredColumn;
    const { width, height, x, y } = $.getCursorPositionRelativeToElement(
      this.table,
      event,
    );

    if (x >= 0) {
      hoveredColumn = this.binSearch(
        this.numberOfColumns,
        (mid) => this.getCell(1, mid),
        ({ fromLeftBorder }) => x < fromLeftBorder,
        ({ fromRightBorder }) => x > width - fromRightBorder,
      );
    }

    if (y >= 0) {
      hoveredRow = this.binSearch(
        this.numberOfRows,
        (mid) => this.getCell(mid, 1),
        ({ fromTopBorder }) => y < fromTopBorder,
        ({ fromBottomBorder }) => y > height - fromBottomBorder,
      );
    }

    return {
      row: hoveredRow || this.hoveredRow,
      column: hoveredColumn || this.hoveredColumn,
    };
  }

  binSearch(numberOfCells, getCell, beforeTheLeftBorder, afterTheRightBorder) {
    let leftBorder = 0;
    let rightBorder = numberOfCells + 1;
    let totalIterations = 0;
    let mid;

    while (leftBorder < rightBorder - 1 && totalIterations < 10) {
      mid = Math.ceil((leftBorder + rightBorder) / 2);

      const cell = getCell(mid);
      const relativeCoords = $.getRelativeCoordsOfTwoElems(this.table, cell);

      if (beforeTheLeftBorder(relativeCoords)) {
        rightBorder = mid;
      } else if (afterTheRightBorder(relativeCoords)) {
        leftBorder = mid;
      } else {
        break;
      }

      totalIterations++;
    }

    return mid;
  }

  getData() {
    const data = [];

    for (let i = 1; i <= this.numberOfRows; i++) {
      const row = this.table.querySelector(`.${CSS.row}:nth-child(${i})`);
      const cells = Array.from(row.querySelectorAll(`.${CSS.cell}`));
      const isEmptyRow = cells.every((cell) => !cell.textContent.trim());

      if (isEmptyRow) {
        continue;
      }

      data.push(cells.map((cell) => cell.innerHTML));
    }

    return data;
  }

  destroy() {
    document.removeEventListener('click', this.documentClicked);
  }
}
