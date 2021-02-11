import {
  announce,
  closestInsideForm,
  elementFromHash,
  elementFromTarget,
  focusAndScrollIntoViewIfRequired,
  focusElement,
  focusInvalidForm,
  Hash,
  prefersReducedMotion,
  resetFocus,
  scrollIntoView,
  scrollIntoViewIfRequired,
  setScrollPosition,
  setTitle,
} from ".";

// tslint:disable-next-line: no-commented-code
// tslint:disable: no-expression-statement
// tslint:disable: no-object-mutation
// tslint:disable: readonly-array
// tslint:disable: no-duplicate-string
// tslint:disable: no-identical-functions
// tslint:disable: no-throw

// Keep references to the original values of these functions.
const documentElementFocus = window.document.documentElement.focus;
const bodyFocus = window.document.body.focus;
const matchMedia = window.matchMedia;
const getComputedStyle = window.getComputedStyle;

beforeEach(() => {
  // Clear previous test's DOM.
  window.document.body.innerHTML = "";

  // js-dom doesn't implement scrollTo
  // tslint:disable-next-line: no-empty
  window.scrollTo = () => {};

  // js-dom doesn't implement scrollIntoView
  // tslint:disable-next-line: no-empty
  Element.prototype.scrollIntoView = () => {};

  // Restore these functions because some tests mess with them.
  window.document.documentElement.focus = documentElementFocus;
  window.document.body.focus = bodyFocus;
  window.matchMedia = matchMedia;
  window.getComputedStyle = getComputedStyle;
});

describe("elementFromHash", () => {
  test("finds element by ID", () => {
    const div = window.document.createElement("div");
    div.id = "test-id";
    document.body.appendChild(div);
    expect(elementFromHash("#test-id")).toBe(div);
  });

  const elementFromHashTable: ReadonlyArray<[Hash, HTMLElement | undefined]> = [
    ["#", window.document.documentElement],
    ["#top", window.document.documentElement],
    ["", undefined],
    ["a", undefined],
    [(null as unknown) as Hash, undefined],
    [(undefined as unknown) as Hash, undefined],
    [(true as unknown) as Hash, undefined],
    [(1 as unknown) as Hash, undefined],
    [({} as unknown) as Hash, undefined],
    [([] as unknown) as Hash, undefined],
  ];

  describe.each(elementFromHashTable)(
    "returns expected element",
    (hash, expected) => {
      test(`for hash ${JSON.stringify(hash)}`, () => {
        expect(elementFromHash(hash)).toBe(expected);
      });
    },
  );
});

describe("elementFromTarget", () => {
  test("returns undefined for malformed CSS query", () => {
    expect(elementFromTarget("a[")).toBeUndefined();
  });

  test("returns element for valid CSS query", () => {
    expect(elementFromTarget("body")).toBe(window.document.body);
  });

  test("returns element for element", () => {
    expect(elementFromTarget(window.document.body)).toBe(window.document.body);
  });
});

describe("announce", () => {
  test("doesn't throw", async () => {
    await announce("hello");
  });
});

describe("resetFocus", () => {
  test("sets focus to the primaryFocusTarget", async () => {
    const result = await resetFocus("body");
    expect(result).toBe(true);
    expect(window.document.activeElement).toBe(window.document.body);
  });

  test("sets focus to the focusTarget", async () => {
    const div = window.document.createElement("div");
    window.document.body.appendChild(div);
    const result = await resetFocus("body", div);
    expect(result).toBe(true);
    expect(window.document.activeElement).toBe(div);
  });

  test("returns false if nothing could be focused", async () => {
    const div = window.document.createElement("div");
    window.document.body.appendChild(div);
    const p = window.document.createElement("p");
    window.document.body.appendChild(p);

    div.focus = () => {
      // tslint:disable-next-line: no-string-throw
      throw "Expected error";
    };
    p.focus = () => {
      // tslint:disable-next-line: no-string-throw
      throw "Expected error";
    };
    window.document.documentElement.focus = () => {
      // tslint:disable-next-line: no-string-throw
      throw "Expected error";
    };
    window.document.body.focus = () => {
      // tslint:disable-next-line: no-string-throw
      throw "Expected error";
    };

    const result = await resetFocus("div", "p");

    expect(result).toBe(false);
  });
});

describe("focusAndScrollIntoViewIfRequired", () => {
  test("doesn't throw when focus and scroll elements are the same", async () => {
    await focusAndScrollIntoViewIfRequired("body", "body");
  });

  test("doesn't throw when focus element doesn't exist", async () => {
    await focusAndScrollIntoViewIfRequired("does-not-exist", "body");
  });

  test("doesn't throw when scroll element doesn't exist", async () => {
    await focusAndScrollIntoViewIfRequired("body", "does-not-exist");
  });

  test("doesn't throw when focus and scroll elements are different", async () => {
    const div = document.createElement("div");
    document.body.appendChild(div);
    const p = document.createElement("p");
    document.body.appendChild(p);

    await focusAndScrollIntoViewIfRequired(div, p);
  });

  test("doesn't throw when smooth scrolling", async () => {
    await focusAndScrollIntoViewIfRequired("body", "body", true);
  });
});

describe("focusInvalidForm", () => {
  test("doesn't throw if form doesn't exist", async () => {
    await focusInvalidForm("form", "[aria-invalid=true]", ".form-group");
  });

  test("doesn't throw if invalid element doesn't exist", async () => {
    const form = document.createElement("form");
    document.body.appendChild(form);
    await focusInvalidForm(form, "[aria-invalid=true]", ".form-group");
  });

  test("focuses an invalid element", async () => {
    const form = document.createElement("form");
    document.body.appendChild(form);

    const invalidInput = document.createElement("input");
    invalidInput.setAttribute("aria-invalid", "true");
    form.appendChild(invalidInput);

    await focusInvalidForm(form, "[aria-invalid=true]", ".form-group");

    expect(document.activeElement).toBe(invalidInput);
  });

  test("doesn't throw if closest() is undefined", async () => {
    const form = document.createElement("form");
    document.body.appendChild(form);

    const invalidInput = document.createElement("input");
    invalidInput.setAttribute("aria-invalid", "true");
    form.appendChild(invalidInput);

    // @ts-ignore
    invalidInput.closest = undefined;

    await focusInvalidForm(form, "[aria-invalid=true]", ".form-group");
  });
});

describe("setTitle", () => {
  const titles: ReadonlyArray<[string, string]> = [
    ["hello", "hello"],
    ["", ""],
    [(null as unknown) as string, "null"],
    [(undefined as unknown) as string, "undefined"],
    [(true as unknown) as string, "true"],
    [(1 as unknown) as string, "1"],
    [({} as unknown) as string, "[object Object]"],
    [([] as unknown) as string, ""],
  ];

  describe.each(titles)("sets the document title", (title, expected) => {
    test(`for title ${JSON.stringify(title)}`, () => {
      setTitle(title);
      expect(document.title).toBe(expected);
    });
  });
});

describe("scrollIntoView", () => {
  test("doesn't throw", () => {
    const div = document.createElement("div");
    document.body.appendChild(div);

    scrollIntoView(window.document.body);
    scrollIntoView(window.document.documentElement);
    scrollIntoView(div);
    scrollIntoView(div, true);
  });

  test("handles exception from scrollIntoView when smooth scrolling", () => {
    const div = document.createElement("div");
    document.body.appendChild(div);

    div.scrollIntoView = (options?: ScrollIntoViewOptions) => {
      // tslint:disable-next-line: no-if-statement
      if (options !== undefined && options.behavior === "smooth") {
        throw new Error("");
      }
    };

    scrollIntoView(div, true);
  });
});

describe("scrollIntoView", () => {
  test("doesn't throw when using smooth scrolling", () => {
    setScrollPosition({ x: 0, y: 0 }, true);
  });

  test("handles exception from scrollTo when smooth scrolling", () => {
    const scrollTo = (options?: ScrollToOptions) => {
      // tslint:disable-next-line: no-if-statement
      if (options !== undefined && options.behavior === "smooth") {
        throw new Error("");
      }
    };

    // @ts-ignore
    window.scrollTo = scrollTo;

    setScrollPosition({ x: 0, y: 0 }, true);
  });
});

describe("prefersReducedMotion", () => {
  test("doesn't throw when window.matchMedia is undefined", () => {
    expect(prefersReducedMotion()).toBe(false);
  });

  test("calls window.matchMedia appropriately", () => {
    window.matchMedia = () => ({ matches: true } as MediaQueryList);
    expect(prefersReducedMotion()).toBe(true);
  });
});

describe("scrollIntoViewIfRequired", () => {
  test("doesn't throw", () => {
    scrollIntoViewIfRequired(document.documentElement);
  });

  test("doesn't throw if smooth scrolling", () => {
    scrollIntoViewIfRequired(document.documentElement, true);
  });

  test("doesn't throw when element is not in viewport", () => {
    scrollIntoViewIfRequired(document.documentElement, false, () => false);
  });
});

describe("focusElement", () => {
  test("returns false when selector doesn't exist", async () => {
    const result = await focusElement("does-not-exist");
    expect(result).toBe(false);
  });

  test("focuses the specified element", async () => {
    const div = window.document.createElement("div");
    window.document.body.appendChild(div);

    const result = await focusElement(div, true);

    expect(result).toBe(true);
    expect(window.document.activeElement).toBe(div);
    expect(div.getAttribute("tabindex")).toBe("-1");

    div.blur();
    expect(div.getAttribute("tabindex")).toBeNull();
  });

  test("leaves tabindex alone if already set", async () => {
    const div = window.document.createElement("div");
    div.setAttribute("tabindex", "0");
    window.document.body.appendChild(div);

    const result = await focusElement(div, true);

    expect(result).toBe(true);
    expect(window.document.activeElement).toBe(div);
    expect(div.getAttribute("tabindex")).toBe("0");

    div.blur();
    expect(div.getAttribute("tabindex")).toBe("0");
  });

  test("handles exceptions from focus() when preventScroll is true", async () => {
    const div = window.document.createElement("div");
    window.document.body.appendChild(div);

    const originalFocus = div.focus;
    div.focus = options => {
      // tslint:disable-next-line: no-if-statement
      if (options !== undefined && options.preventScroll === true) {
        throw new Error("");
      } else {
        originalFocus.call(div);
      }
    };

    const result = await focusElement(div, true);

    expect(result).toBe(true);
    expect(window.document.activeElement).toBe(div);
  });

  test("returns false when focus() throws", async () => {
    const div = window.document.createElement("div");
    window.document.body.appendChild(div);

    div.focus = () => {
      // tslint:disable: no-string-throw
      throw "Expected error";
    };

    const result = await focusElement(div, true);

    expect(result).toBe(false);
    expect(window.document.activeElement).not.toBe(div);
  });

  test("doesn't throw when window.getComputedStyle is undefined", async () => {
    // @ts-ignore
    window.getComputedStyle = undefined;

    const result = await focusElement(document.body, true);
    expect(result).toBe(true);
  });

  test("doesn't throw when smooth scroll set via CSS", async () => {
    // @ts-ignore
    window.getComputedStyle = () => ({ scrollBehavior: "smooth" });

    const result = await focusElement(document.body, true);
    expect(result).toBe(true);
  });
});

describe("closestInsideForm", () => {
  test("matches wrapper element inside form", () => {
    const form = window.document.createElement("form");
    const div = window.document.createElement("div");
    const input = window.document.createElement("input");
    form.appendChild(div);
    div.appendChild(input);
    window.document.body.appendChild(form);

    expect(closestInsideForm(input, "div", form)).toBe(div);
  });

  test("stops at form even when match exists above form", () => {
    const div = window.document.createElement("div");
    const form = window.document.createElement("form");
    const input = window.document.createElement("input");
    form.appendChild(input);
    div.appendChild(form);
    window.document.body.appendChild(div);

    expect(closestInsideForm(input, "div", form)).toBeUndefined();
  });
});
