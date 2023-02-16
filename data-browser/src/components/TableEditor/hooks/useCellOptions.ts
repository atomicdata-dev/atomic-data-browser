import { useEffect } from 'react';
import { useTableEditorContext } from '../TableEditorContext';

export interface CellOptions {
  hideActiveIndicator?: boolean;
}
export function useCellOptions(options: CellOptions) {
  const { setIndicatorHidden } = useTableEditorContext();

  useEffect(() => {
    if (options.hideActiveIndicator) {
      setIndicatorHidden(true);
    }

    return () => {
      if (options.hideActiveIndicator) {
        setIndicatorHidden(false);
      }
    };
  }, [options]);
}
