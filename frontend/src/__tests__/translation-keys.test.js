const en = require("../locales/en/translation.json");
const pt = require("../locales/pt/translation.json");

describe("translation key parity", () => {
  it("Portuguese has all keys defined in English", () => {
    const ptKeys = new Set(Object.keys(pt));
    const missing = Object.keys(en).filter((key) => !ptKeys.has(key));
    expect(missing).toEqual([]);
  });

  it("English has all keys defined in Portuguese", () => {
    const enKeys = new Set(Object.keys(en));
    const missing = Object.keys(pt).filter((key) => !enKeys.has(key));
    expect(missing).toEqual([]);
  });
});
