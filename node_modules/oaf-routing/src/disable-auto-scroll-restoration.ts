// tslint:disable: no-if-statement
// tslint:disable: no-object-mutation
// tslint:disable: no-expression-statement

/**
 * Sets `window.history.scrollRestoration` to `manual` and returns a
 * function that will restore it to its previous value.
 */
export const disableAutoScrollRestoration = (): (() => void) => {
  // https://developer.mozilla.org/en-US/docs/Web/API/History#Browser_compatibility
  if ("scrollRestoration" in window.history) {
    const original = window.history.scrollRestoration;

    window.history.scrollRestoration = "manual";
    return () => (window.history.scrollRestoration = original);
  } else {
    // tslint:disable-next-line: no-empty
    return () => {};
  }
};
