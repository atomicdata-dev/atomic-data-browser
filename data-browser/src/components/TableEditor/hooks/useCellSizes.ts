import { useCallback, useState } from 'react';

const INDEX_CELL_WIDTH = '6ch';

export function useCellSizes(amountOfCells: number) {
  const [sizes, setSizes] = useState(Array(amountOfCells).fill('300px'));

  const resizeCell = useCallback(
    (index: number, size: string) => {
      setSizes(prevSizes => {
        const newSizes = [...prevSizes];
        newSizes[index] = size;

        return newSizes;
      });
    },
    [amountOfCells],
  );

  const templateColumns = `${INDEX_CELL_WIDTH} ${sizes.join(
    ' ',
  )} minmax(50px, 1fr)`;
  const contentRowWidth = `calc(${INDEX_CELL_WIDTH} + ${sizes.join(' + ')})`;

  return {
    templateColumns,
    contentRowWidth,
    resizeCell,
  };
}
