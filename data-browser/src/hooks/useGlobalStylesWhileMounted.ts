import { useEffect, useId } from 'react';

const getNode = (id: string) => {
  const existingNode = document.getElementById(id);

  if (existingNode) {
    return existingNode;
  }

  const node = document.createElement('style');
  node.id = id;
  document.head.appendChild(node);

  return node;
};

export function useGlobalStylesWhileMounted(cssText: string) {
  const id = useId();

  useEffect(() => {
    const node = getNode(id);

    node.innerHTML = cssText;

    return () => {
      document.head.removeChild(node);
    };
  }, [cssText]);
}
