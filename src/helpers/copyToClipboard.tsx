export const copyToClipboard = (str: string): void => {
  const el = document.createElement('textarea');
  el.value = str;
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  console.log('copied!', str);
  document.body.removeChild(el);
  window.alert(`Copied ${str} to clipboard!`);
};
