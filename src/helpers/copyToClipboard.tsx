export const copyToClipboard = (str: string): void => {
  const el = document.createElement('textarea');
  el.value = str;
  el.style.position = 'absolute';
  el.style.left = '-9999px';
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
  window.alert(`Copied ${str} to clipboard!`);
};
