import { CursorMode, TableEditorContext } from '../TableEditorContext';

const triggerCharacters =
  'abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()_+-=[]{};:"|,./<>?`~ø';

export interface HandlerContext {
  tableContext: TableEditorContext;
  event: React.KeyboardEvent;
  tableRef: React.RefObject<HTMLDivElement>;
  translateCursor: (row: number, column: number) => void;
  columnCount: number;
  triggerCopyCommand: () => void;
}

export interface KeyboardHandler {
  keys: Set<string>;
  cursorMode: Set<CursorMode>;
  preventDefault?: boolean;
  shift?: boolean;
  mod?: boolean;
  condition?: (context: HandlerContext) => boolean;

  handler: (context: HandlerContext) => void;
}

const getMultiSelectStartPosition = ({
  cursorMode,
  multiSelectCornerRow,
  multiSelectCornerColumn,
  selectedRow,
  selectedColumn,
}: TableEditorContext) => {
  const row =
    (cursorMode === CursorMode.MultiSelect
      ? multiSelectCornerRow
      : selectedRow) ?? 0;

  const col =
    (cursorMode === CursorMode.MultiSelect
      ? multiSelectCornerColumn
      : selectedColumn) ?? 0;

  return { row, col };
};

const exitEditMode: KeyboardHandler = {
  keys: new Set(['Enter', 'Escape']),
  cursorMode: new Set([CursorMode.Edit]),

  handler: ({ tableContext, tableRef }) => {
    tableContext.setCursorMode(CursorMode.Visual);
    tableRef.current?.focus();
  },
};

const editNextCell: KeyboardHandler = {
  keys: new Set(['Tab']),
  cursorMode: new Set([CursorMode.Edit]),
  preventDefault: true,
  handler: ({ translateCursor }) => {
    translateCursor(0, 1);
  },
};

const copy: KeyboardHandler = {
  keys: new Set(['c']),
  mod: true,
  cursorMode: new Set([CursorMode.Visual, CursorMode.MultiSelect]),
  condition: ({ tableContext }) =>
    tableContext.selectedColumn !== undefined &&
    tableContext.selectedRow !== undefined,

  handler: ({ event, triggerCopyCommand }) => {
    event.preventDefault();
    triggerCopyCommand();
  },
};

const deleteCell: KeyboardHandler = {
  keys: new Set(['Delete', 'Backspace']),
  cursorMode: new Set([CursorMode.Visual, CursorMode.MultiSelect]),
  condition: ({ tableContext }) =>
    tableContext.selectedColumn !== 0 &&
    tableContext.selectedColumn !== undefined &&
    tableContext.selectedRow !== undefined,

  handler: ({ tableContext }) => {
    tableContext.clearCell();
  },
};

const deleteRow: KeyboardHandler = {
  keys: new Set(['Delete', 'Backspace']),
  cursorMode: new Set([CursorMode.Visual]),
  condition: ({ tableContext }) =>
    tableContext.selectedColumn === 0 &&
    tableContext.selectedColumn !== undefined &&
    tableContext.selectedRow !== undefined,

  handler: ({ tableContext }) => {
    tableContext.clearRow(tableContext.selectedRow!);
  },
};

const moveCursorUp: KeyboardHandler = {
  keys: new Set(['ArrowUp']),
  shift: false,
  cursorMode: new Set([CursorMode.Visual, CursorMode.MultiSelect]),

  preventDefault: true,
  handler: ({ translateCursor, tableContext }) => {
    tableContext.setCursorMode(CursorMode.Visual);
    translateCursor(-1, 0);
  },
};

const moveCursorDown: KeyboardHandler = {
  keys: new Set(['ArrowDown']),
  shift: false,
  cursorMode: new Set([CursorMode.Visual, CursorMode.MultiSelect]),

  preventDefault: true,
  handler: ({ translateCursor, tableContext }) => {
    tableContext.setCursorMode(CursorMode.Visual);
    translateCursor(1, 0);
  },
};

const moveCursorLeft: KeyboardHandler = {
  keys: new Set(['ArrowLeft']),
  shift: false,
  cursorMode: new Set([CursorMode.Visual, CursorMode.MultiSelect]),

  preventDefault: true,
  handler: ({ translateCursor, tableContext }) => {
    tableContext.setCursorMode(CursorMode.Visual);
    translateCursor(0, -1);
  },
};

const moveCursorRight: KeyboardHandler = {
  keys: new Set(['ArrowRight']),
  shift: false,
  cursorMode: new Set([CursorMode.Visual, CursorMode.MultiSelect]),

  preventDefault: true,
  handler: ({ translateCursor, tableContext }) => {
    tableContext.setCursorMode(CursorMode.Visual);
    translateCursor(0, 1);
  },
};

const enterEditModeWithEnter: KeyboardHandler = {
  keys: new Set(['Enter']),
  cursorMode: new Set([CursorMode.Visual]),
  condition: ({ tableContext }) =>
    tableContext.selectedColumn !== undefined &&
    tableContext.selectedColumn !== 0 &&
    tableContext.selectedRow !== undefined,

  handler: ({ tableContext }) => {
    tableContext.setCursorMode(CursorMode.Edit);
  },
};

const enterEditModeByTyping: KeyboardHandler = {
  keys: new Set(triggerCharacters.split('')),
  cursorMode: new Set([CursorMode.Visual]),
  mod: false,
  condition: ({ tableContext }) =>
    tableContext.selectedColumn !== undefined &&
    tableContext.selectedColumn !== 0 &&
    tableContext.selectedRow !== undefined,

  preventDefault: true,
  handler: ({ tableContext, event }) => {
    tableContext.enterEditModeWithCharacter(event.key);
    tableContext.setCursorMode(CursorMode.Edit);
  },
};

const moveMultiSelectCornerUp: KeyboardHandler = {
  keys: new Set(['ArrowUp']),
  cursorMode: new Set([CursorMode.Visual, CursorMode.MultiSelect]),
  shift: true,

  preventDefault: true,
  handler: ({ tableContext }) => {
    const { row, col } = getMultiSelectStartPosition(tableContext);
    tableContext.setMultiSelectCorner(Math.max(0, row - 1), col);
    tableContext.setCursorMode(CursorMode.MultiSelect);
  },
};

const moveMultiSelectCornerDown: KeyboardHandler = {
  keys: new Set(['ArrowDown']),
  cursorMode: new Set([CursorMode.Visual, CursorMode.MultiSelect]),
  shift: true,

  preventDefault: true,
  handler: ({ tableContext }) => {
    const { row, col } = getMultiSelectStartPosition(tableContext);
    tableContext.setMultiSelectCorner(Math.max(0, row + 1), col);
    tableContext.setCursorMode(CursorMode.MultiSelect);
  },
};

const moveMultiSelectCornerLeft: KeyboardHandler = {
  keys: new Set(['ArrowLeft']),
  cursorMode: new Set([CursorMode.Visual, CursorMode.MultiSelect]),
  shift: true,

  preventDefault: true,
  handler: ({ tableContext, columnCount }) => {
    const { row, col } = getMultiSelectStartPosition(tableContext);
    tableContext.setMultiSelectCorner(
      row,
      Math.min(Math.max(col - 1, 0), columnCount),
    );
    tableContext.setCursorMode(CursorMode.MultiSelect);
  },
};

const moveMultiSelectCornerRight: KeyboardHandler = {
  keys: new Set(['ArrowRight']),
  cursorMode: new Set([CursorMode.Visual, CursorMode.MultiSelect]),
  shift: true,

  preventDefault: true,
  handler: ({ tableContext, columnCount }) => {
    const { row, col } = getMultiSelectStartPosition(tableContext);
    tableContext.setMultiSelectCorner(
      row,
      Math.min(Math.max(col + 1, 0), columnCount),
    );
    tableContext.setCursorMode(CursorMode.MultiSelect);
  },
};

export const tableKeyboardHandlers = [
  exitEditMode,
  editNextCell,
  copy,
  deleteCell,
  deleteRow,
  moveCursorUp,
  moveCursorDown,
  moveCursorLeft,
  moveCursorRight,
  enterEditModeWithEnter,
  enterEditModeByTyping,
  moveMultiSelectCornerUp,
  moveMultiSelectCornerDown,
  moveMultiSelectCornerLeft,
  moveMultiSelectCornerRight,
];
