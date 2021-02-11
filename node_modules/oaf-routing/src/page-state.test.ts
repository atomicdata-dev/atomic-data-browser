import { getPageState } from ".";

// tslint:disable: no-expression-statement

describe("getPageState", () => {
  test('returns "body" focus selector by default', () => {
    const state = getPageState();

    expect(state).toEqual({
      focusSelector: "body",
      x: 0,
      y: 0,
    });
  });
});
