import { l } from "./editor.api-B2Cf7Ob7.js";
const A = (i, o) => o === "tokenizer", p = async (i, o) => {
  const f = l.getLanguages().find(({ id: n }) => n === i), { language: a } = await f.loader();
  for (const n in o) {
    const r = o[n];
    if (A(r, n)) {
      const s = a.tokenizer;
      for (const t in r) {
        const c = s[t] ?? (s[t] = []), e = r[t];
        Array.isArray(e) && c.unshift(...e);
      }
    } else if (Array.isArray(r)) {
      const s = a[n] ?? (a[n] = []);
      Array.isArray(s) && s.unshift(...r);
    }
  }
};
export {
  p as updateLangConfig
};
