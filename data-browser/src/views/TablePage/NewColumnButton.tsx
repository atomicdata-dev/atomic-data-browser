import { Datatype } from '@tomic/react';
import React, { useCallback, useContext, useMemo, useState } from 'react';
import { FaChevronCircleDown, FaFile, FaPlus } from 'react-icons/fa';
import { DropdownMenu, Item } from '../../components/Dropdown';
import { buildDefaultTrigger } from '../../components/Dropdown/DefaultTrigger';
import { dataTypeIconMap } from './dataTypeMaps';
import { NewPropertyDialog } from './PropertyForm/NewPropertyDialog';
import { TablePageContext } from './tablePageContext';

const NewColumnTrigger = buildDefaultTrigger(<FaPlus />, 'Add column');

const TextIcon = dataTypeIconMap.get(Datatype.STRING)!;
const NumberIcon = dataTypeIconMap.get(Datatype.INTEGER)!;
const DateIcon = dataTypeIconMap.get(Datatype.DATE)!;
const CheckboxIcon = dataTypeIconMap.get(Datatype.BOOLEAN)!;
const SelectIcon = FaChevronCircleDown;
const FileIcon = FaFile;
const RelationIcon = dataTypeIconMap.get(Datatype.ATOMIC_URL)!;

export function NewColumnButton(): JSX.Element {
  const [showDialog, setShowDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>();

  const { tableClassResource } = useContext(TablePageContext);

  const openDialog = useCallback(
    (category: string) => () => {
      setSelectedCategory(category);
      setShowDialog(true);
    },
    [],
  );

  const items = useMemo((): Item[] => {
    return [
      {
        id: 'text',
        label: 'Text',
        onClick: openDialog('text'),
        icon: <TextIcon />,
      },
      {
        id: 'number',
        label: 'Number',
        onClick: openDialog('number'),
        icon: <NumberIcon />,
      },
      {
        id: 'date',
        label: 'Date',
        onClick: openDialog('date'),
        icon: <DateIcon />,
      },
      {
        id: 'checkbox',
        label: 'Checkbox',
        onClick: openDialog('checkbox'),
        icon: <CheckboxIcon />,
      },
      {
        id: 'select',
        label: 'Select',
        onClick: openDialog('select'),
        icon: <SelectIcon />,
      },
      {
        id: 'file',
        label: 'File',
        onClick: openDialog('file'),
        icon: <FileIcon />,
      },
      {
        id: 'relation',
        label: 'Relation',
        onClick: openDialog('relation'),
        icon: <RelationIcon />,
      },
    ];
  }, []);

  return (
    <>
      <DropdownMenu trigger={NewColumnTrigger} items={items} />
      <NewPropertyDialog
        showDialog={showDialog}
        tableClassResource={tableClassResource}
        selectedCategory={selectedCategory}
        bindShow={setShowDialog}
      />
    </>
  );
}
