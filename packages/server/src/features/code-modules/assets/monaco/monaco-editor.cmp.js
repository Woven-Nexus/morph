import { updateLangConfig as Ao } from "./lang-config-extender.js";
import "./user-worker-H1G5OZMt.js";
import { hg as F } from "./editor.api-B2Cf7Ob7.js";
const Mo = "useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict";
let zo = (t) => crypto.getRandomValues(new Uint8Array(t)), $o = (t, o, e) => {
  let i = (2 << Math.log(t.length - 1) / Math.LN2) - 1, n = -~(1.6 * i * o / t.length);
  return (r = o) => {
    let a = "";
    for (; ; ) {
      let d = e(n), c = n;
      for (; c--; )
        if (a += t[d[c] & i] || "", a.length === r)
          return a;
    }
  };
}, Eo = (t, o = 21) => $o(t, o, zo), Co = (t = 21) => {
  let o = "", e = crypto.getRandomValues(new Uint8Array(t));
  for (; t--; )
    o += Mo[e[t] & 63];
  return o;
};
const _o = () => {
  let t = Co(5), o = () => {
  }, e = () => {
  };
  return [new Promise((i, n) => {
    o = i, e = n;
  }), o, e, t];
}, Do = (t, o, e) => {
  const i = new CustomEvent(
    o,
    {
      bubbles: !0,
      cancelable: !1,
      composed: !0,
      detail: {},
      ...e
    }
  );
  return t.dispatchEvent(i), i;
}, Bo = (t) => new Promise((o) => setTimeout(o, t));
Eo("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ");
(() => {
  try {
    return document.createEvent("TouchEvent"), !0;
  } catch {
    return !1;
  }
})();
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const N = globalThis, Q = N.ShadowRoot && (N.ShadyCSS === void 0 || N.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, Z = Symbol(), J = /* @__PURE__ */ new WeakMap();
let mo = class {
  constructor(o, e, i) {
    if (this._$cssResult$ = !0, i !== Z)
      throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = o, this.t = e;
  }
  get styleSheet() {
    let o = this.o;
    const e = this.t;
    if (Q && o === void 0) {
      const i = e !== void 0 && e.length === 1;
      i && (o = J.get(e)), o === void 0 && ((this.o = o = new CSSStyleSheet()).replaceSync(this.cssText), i && J.set(e, o));
    }
    return o;
  }
  toString() {
    return this.cssText;
  }
};
const So = (t) => new mo(typeof t == "string" ? t : t + "", void 0, Z), Io = (t, ...o) => {
  const e = t.length === 1 ? t[0] : o.reduce((i, n, r) => i + ((a) => {
    if (a._$cssResult$ === !0)
      return a.cssText;
    if (typeof a == "number")
      return a;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + a + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(n) + t[r + 1], t[0]);
  return new mo(e, t, Z);
}, Ho = (t, o) => {
  if (Q)
    t.adoptedStyleSheets = o.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else
    for (const e of o) {
      const i = document.createElement("style"), n = N.litNonce;
      n !== void 0 && i.setAttribute("nonce", n), i.textContent = e.cssText, t.appendChild(i);
    }
}, X = Q ? (t) => t : (t) => t instanceof CSSStyleSheet ? ((o) => {
  let e = "";
  for (const i of o.cssRules)
    e += i.cssText;
  return So(e);
})(t) : t;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Lo, defineProperty: No, getOwnPropertyDescriptor: To, getOwnPropertyNames: qo, getOwnPropertySymbols: jo, getPrototypeOf: Wo } = Object, v = globalThis, K = v.trustedTypes, Po = K ? K.emptyScript : "", U = v.reactiveElementPolyfillSupport, E = (t, o) => t, T = { toAttribute(t, o) {
  switch (o) {
    case Boolean:
      t = t ? Po : null;
      break;
    case Object:
    case Array:
      t = t == null ? t : JSON.stringify(t);
  }
  return t;
}, fromAttribute(t, o) {
  let e = t;
  switch (o) {
    case Boolean:
      e = t !== null;
      break;
    case Number:
      e = t === null ? null : Number(t);
      break;
    case Object:
    case Array:
      try {
        e = JSON.parse(t);
      } catch {
        e = null;
      }
  }
  return e;
} }, G = (t, o) => !Lo(t, o), oo = { attribute: !0, type: String, converter: T, reflect: !1, hasChanged: G };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), v.litPropertyMetadata ?? (v.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
class y extends HTMLElement {
  static addInitializer(o) {
    this._$Ei(), (this.l ?? (this.l = [])).push(o);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(o, e = oo) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.elementProperties.set(o, e), !e.noAccessor) {
      const i = Symbol(), n = this.getPropertyDescriptor(o, i, e);
      n !== void 0 && No(this.prototype, o, n);
    }
  }
  static getPropertyDescriptor(o, e, i) {
    const { get: n, set: r } = To(this.prototype, o) ?? { get() {
      return this[e];
    }, set(a) {
      this[e] = a;
    } };
    return { get() {
      return n == null ? void 0 : n.call(this);
    }, set(a) {
      const d = n == null ? void 0 : n.call(this);
      r.call(this, a), this.requestUpdate(o, d, i);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(o) {
    return this.elementProperties.get(o) ?? oo;
  }
  static _$Ei() {
    if (this.hasOwnProperty(E("elementProperties")))
      return;
    const o = Wo(this);
    o.finalize(), o.l !== void 0 && (this.l = [...o.l]), this.elementProperties = new Map(o.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(E("finalized")))
      return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(E("properties"))) {
      const e = this.properties, i = [...qo(e), ...jo(e)];
      for (const n of i)
        this.createProperty(n, e[n]);
    }
    const o = this[Symbol.metadata];
    if (o !== null) {
      const e = litPropertyMetadata.get(o);
      if (e !== void 0)
        for (const [i, n] of e)
          this.elementProperties.set(i, n);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [e, i] of this.elementProperties) {
      const n = this._$Eu(e, i);
      n !== void 0 && this._$Eh.set(n, e);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(o) {
    const e = [];
    if (Array.isArray(o)) {
      const i = new Set(o.flat(1 / 0).reverse());
      for (const n of i)
        e.unshift(X(n));
    } else
      o !== void 0 && e.push(X(o));
    return e;
  }
  static _$Eu(o, e) {
    const i = e.attribute;
    return i === !1 ? void 0 : typeof i == "string" ? i : typeof o == "string" ? o.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    var o;
    this._$ES = new Promise((e) => this.enableUpdating = e), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), (o = this.constructor.l) == null || o.forEach((e) => e(this));
  }
  addController(o) {
    var e;
    (this._$EO ?? (this._$EO = /* @__PURE__ */ new Set())).add(o), this.renderRoot !== void 0 && this.isConnected && ((e = o.hostConnected) == null || e.call(o));
  }
  removeController(o) {
    var e;
    (e = this._$EO) == null || e.delete(o);
  }
  _$E_() {
    const o = /* @__PURE__ */ new Map(), e = this.constructor.elementProperties;
    for (const i of e.keys())
      this.hasOwnProperty(i) && (o.set(i, this[i]), delete this[i]);
    o.size > 0 && (this._$Ep = o);
  }
  createRenderRoot() {
    const o = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return Ho(o, this.constructor.elementStyles), o;
  }
  connectedCallback() {
    var o;
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), (o = this._$EO) == null || o.forEach((e) => {
      var i;
      return (i = e.hostConnected) == null ? void 0 : i.call(e);
    });
  }
  enableUpdating(o) {
  }
  disconnectedCallback() {
    var o;
    (o = this._$EO) == null || o.forEach((e) => {
      var i;
      return (i = e.hostDisconnected) == null ? void 0 : i.call(e);
    });
  }
  attributeChangedCallback(o, e, i) {
    this._$AK(o, i);
  }
  _$EC(o, e) {
    var r;
    const i = this.constructor.elementProperties.get(o), n = this.constructor._$Eu(o, i);
    if (n !== void 0 && i.reflect === !0) {
      const a = (((r = i.converter) == null ? void 0 : r.toAttribute) !== void 0 ? i.converter : T).toAttribute(e, i.type);
      this._$Em = o, a == null ? this.removeAttribute(n) : this.setAttribute(n, a), this._$Em = null;
    }
  }
  _$AK(o, e) {
    var r;
    const i = this.constructor, n = i._$Eh.get(o);
    if (n !== void 0 && this._$Em !== n) {
      const a = i.getPropertyOptions(n), d = typeof a.converter == "function" ? { fromAttribute: a.converter } : ((r = a.converter) == null ? void 0 : r.fromAttribute) !== void 0 ? a.converter : T;
      this._$Em = n, this[n] = d.fromAttribute(e, a.type), this._$Em = null;
    }
  }
  requestUpdate(o, e, i) {
    if (o !== void 0) {
      if (i ?? (i = this.constructor.getPropertyOptions(o)), !(i.hasChanged ?? G)(this[o], e))
        return;
      this.P(o, e, i);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$ET());
  }
  P(o, e, i) {
    this._$AL.has(o) || this._$AL.set(o, e), i.reflect === !0 && this._$Em !== o && (this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Set())).add(o);
  }
  async _$ET() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (e) {
      Promise.reject(e);
    }
    const o = this.scheduleUpdate();
    return o != null && await o, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    var i;
    if (!this.isUpdatePending)
      return;
    if (!this.hasUpdated) {
      if (this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this._$Ep) {
        for (const [r, a] of this._$Ep)
          this[r] = a;
        this._$Ep = void 0;
      }
      const n = this.constructor.elementProperties;
      if (n.size > 0)
        for (const [r, a] of n)
          a.wrapped !== !0 || this._$AL.has(r) || this[r] === void 0 || this.P(r, this[r], a);
    }
    let o = !1;
    const e = this._$AL;
    try {
      o = this.shouldUpdate(e), o ? (this.willUpdate(e), (i = this._$EO) == null || i.forEach((n) => {
        var r;
        return (r = n.hostUpdate) == null ? void 0 : r.call(n);
      }), this.update(e)) : this._$EU();
    } catch (n) {
      throw o = !1, this._$EU(), n;
    }
    o && this._$AE(e);
  }
  willUpdate(o) {
  }
  _$AE(o) {
    var e;
    (e = this._$EO) == null || e.forEach((i) => {
      var n;
      return (n = i.hostUpdated) == null ? void 0 : n.call(i);
    }), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(o)), this.updated(o);
  }
  _$EU() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(o) {
    return !0;
  }
  update(o) {
    this._$Ej && (this._$Ej = this._$Ej.forEach((e) => this._$EC(e, this[e]))), this._$EU();
  }
  updated(o) {
  }
  firstUpdated(o) {
  }
}
y.elementStyles = [], y.shadowRootOptions = { mode: "open" }, y[E("elementProperties")] = /* @__PURE__ */ new Map(), y[E("finalized")] = /* @__PURE__ */ new Map(), U == null || U({ ReactiveElement: y }), (v.reactiveElementVersions ?? (v.reactiveElementVersions = [])).push("2.0.4");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const C = globalThis, q = C.trustedTypes, eo = q ? q.createPolicy("lit-html", { createHTML: (t) => t }) : void 0, po = "$lit$", b = `lit$${(Math.random() + "").slice(9)}$`, go = "?" + b, Fo = `<${go}>`, x = document, B = () => x.createComment(""), S = (t) => t === null || typeof t != "object" && typeof t != "function", ho = Array.isArray, Uo = (t) => ho(t) || typeof (t == null ? void 0 : t[Symbol.iterator]) == "function", O = `[ 	
\f\r]`, z = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, to = /-->/g, io = />/g, f = RegExp(`>|${O}(?:([^\\s"'>=/]+)(${O}*=${O}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), no = /'/g, ro = /"/g, uo = /^(?:script|style|textarea|title)$/i, Oo = (t) => (o, ...e) => ({ _$litType$: t, strings: o, values: e }), ao = Oo(1), k = Symbol.for("lit-noChange"), l = Symbol.for("lit-nothing"), co = /* @__PURE__ */ new WeakMap(), w = x.createTreeWalker(x, 129);
function bo(t, o) {
  if (!Array.isArray(t) || !t.hasOwnProperty("raw"))
    throw Error("invalid template strings array");
  return eo !== void 0 ? eo.createHTML(o) : o;
}
const Ro = (t, o) => {
  const e = t.length - 1, i = [];
  let n, r = o === 2 ? "<svg>" : "", a = z;
  for (let d = 0; d < e; d++) {
    const c = t[d];
    let m, p, s = -1, h = 0;
    for (; h < c.length && (a.lastIndex = h, p = a.exec(c), p !== null); )
      h = a.lastIndex, a === z ? p[1] === "!--" ? a = to : p[1] !== void 0 ? a = io : p[2] !== void 0 ? (uo.test(p[2]) && (n = RegExp("</" + p[2], "g")), a = f) : p[3] !== void 0 && (a = f) : a === f ? p[0] === ">" ? (a = n ?? z, s = -1) : p[1] === void 0 ? s = -2 : (s = a.lastIndex - p[2].length, m = p[1], a = p[3] === void 0 ? f : p[3] === '"' ? ro : no) : a === ro || a === no ? a = f : a === to || a === io ? a = z : (a = f, n = void 0);
    const u = a === f && t[d + 1].startsWith("/>") ? " " : "";
    r += a === z ? c + Fo : s >= 0 ? (i.push(m), c.slice(0, s) + po + c.slice(s) + b + u) : c + b + (s === -2 ? d : u);
  }
  return [bo(t, r + (t[e] || "<?>") + (o === 2 ? "</svg>" : "")), i];
};
class I {
  constructor({ strings: o, _$litType$: e }, i) {
    let n;
    this.parts = [];
    let r = 0, a = 0;
    const d = o.length - 1, c = this.parts, [m, p] = Ro(o, e);
    if (this.el = I.createElement(m, i), w.currentNode = this.el.content, e === 2) {
      const s = this.el.content.firstChild;
      s.replaceWith(...s.childNodes);
    }
    for (; (n = w.nextNode()) !== null && c.length < d; ) {
      if (n.nodeType === 1) {
        if (n.hasAttributes())
          for (const s of n.getAttributeNames())
            if (s.endsWith(po)) {
              const h = p[a++], u = n.getAttribute(s).split(b), L = /([.?@])?(.*)/.exec(h);
              c.push({ type: 1, index: r, name: L[2], strings: u, ctor: L[1] === "." ? Vo : L[1] === "?" ? Qo : L[1] === "@" ? Zo : W }), n.removeAttribute(s);
            } else
              s.startsWith(b) && (c.push({ type: 6, index: r }), n.removeAttribute(s));
        if (uo.test(n.tagName)) {
          const s = n.textContent.split(b), h = s.length - 1;
          if (h > 0) {
            n.textContent = q ? q.emptyScript : "";
            for (let u = 0; u < h; u++)
              n.append(s[u], B()), w.nextNode(), c.push({ type: 2, index: ++r });
            n.append(s[h], B());
          }
        }
      } else if (n.nodeType === 8)
        if (n.data === go)
          c.push({ type: 2, index: r });
        else {
          let s = -1;
          for (; (s = n.data.indexOf(b, s + 1)) !== -1; )
            c.push({ type: 7, index: r }), s += b.length - 1;
        }
      r++;
    }
  }
  static createElement(o, e) {
    const i = x.createElement("template");
    return i.innerHTML = o, i;
  }
}
function A(t, o, e = t, i) {
  var a, d;
  if (o === k)
    return o;
  let n = i !== void 0 ? (a = e._$Co) == null ? void 0 : a[i] : e._$Cl;
  const r = S(o) ? void 0 : o._$litDirective$;
  return (n == null ? void 0 : n.constructor) !== r && ((d = n == null ? void 0 : n._$AO) == null || d.call(n, !1), r === void 0 ? n = void 0 : (n = new r(t), n._$AT(t, e, i)), i !== void 0 ? (e._$Co ?? (e._$Co = []))[i] = n : e._$Cl = n), n !== void 0 && (o = A(t, n._$AS(t, o.values), n, i)), o;
}
class Yo {
  constructor(o, e) {
    this._$AV = [], this._$AN = void 0, this._$AD = o, this._$AM = e;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(o) {
    const { el: { content: e }, parts: i } = this._$AD, n = ((o == null ? void 0 : o.creationScope) ?? x).importNode(e, !0);
    w.currentNode = n;
    let r = w.nextNode(), a = 0, d = 0, c = i[0];
    for (; c !== void 0; ) {
      if (a === c.index) {
        let m;
        c.type === 2 ? m = new H(r, r.nextSibling, this, o) : c.type === 1 ? m = new c.ctor(r, c.name, c.strings, this, o) : c.type === 6 && (m = new Go(r, this, o)), this._$AV.push(m), c = i[++d];
      }
      a !== (c == null ? void 0 : c.index) && (r = w.nextNode(), a++);
    }
    return w.currentNode = x, n;
  }
  p(o) {
    let e = 0;
    for (const i of this._$AV)
      i !== void 0 && (i.strings !== void 0 ? (i._$AI(o, i, e), e += i.strings.length - 2) : i._$AI(o[e])), e++;
  }
}
class H {
  get _$AU() {
    var o;
    return ((o = this._$AM) == null ? void 0 : o._$AU) ?? this._$Cv;
  }
  constructor(o, e, i, n) {
    this.type = 2, this._$AH = l, this._$AN = void 0, this._$AA = o, this._$AB = e, this._$AM = i, this.options = n, this._$Cv = (n == null ? void 0 : n.isConnected) ?? !0;
  }
  get parentNode() {
    let o = this._$AA.parentNode;
    const e = this._$AM;
    return e !== void 0 && (o == null ? void 0 : o.nodeType) === 11 && (o = e.parentNode), o;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(o, e = this) {
    o = A(this, o, e), S(o) ? o === l || o == null || o === "" ? (this._$AH !== l && this._$AR(), this._$AH = l) : o !== this._$AH && o !== k && this._(o) : o._$litType$ !== void 0 ? this.$(o) : o.nodeType !== void 0 ? this.T(o) : Uo(o) ? this.k(o) : this._(o);
  }
  S(o) {
    return this._$AA.parentNode.insertBefore(o, this._$AB);
  }
  T(o) {
    this._$AH !== o && (this._$AR(), this._$AH = this.S(o));
  }
  _(o) {
    this._$AH !== l && S(this._$AH) ? this._$AA.nextSibling.data = o : this.T(x.createTextNode(o)), this._$AH = o;
  }
  $(o) {
    var r;
    const { values: e, _$litType$: i } = o, n = typeof i == "number" ? this._$AC(o) : (i.el === void 0 && (i.el = I.createElement(bo(i.h, i.h[0]), this.options)), i);
    if (((r = this._$AH) == null ? void 0 : r._$AD) === n)
      this._$AH.p(e);
    else {
      const a = new Yo(n, this), d = a.u(this.options);
      a.p(e), this.T(d), this._$AH = a;
    }
  }
  _$AC(o) {
    let e = co.get(o.strings);
    return e === void 0 && co.set(o.strings, e = new I(o)), e;
  }
  k(o) {
    ho(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let i, n = 0;
    for (const r of o)
      n === e.length ? e.push(i = new H(this.S(B()), this.S(B()), this, this.options)) : i = e[n], i._$AI(r), n++;
    n < e.length && (this._$AR(i && i._$AB.nextSibling, n), e.length = n);
  }
  _$AR(o = this._$AA.nextSibling, e) {
    var i;
    for ((i = this._$AP) == null ? void 0 : i.call(this, !1, !0, e); o && o !== this._$AB; ) {
      const n = o.nextSibling;
      o.remove(), o = n;
    }
  }
  setConnected(o) {
    var e;
    this._$AM === void 0 && (this._$Cv = o, (e = this._$AP) == null || e.call(this, o));
  }
}
class W {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(o, e, i, n, r) {
    this.type = 1, this._$AH = l, this._$AN = void 0, this.element = o, this.name = e, this._$AM = n, this.options = r, i.length > 2 || i[0] !== "" || i[1] !== "" ? (this._$AH = Array(i.length - 1).fill(new String()), this.strings = i) : this._$AH = l;
  }
  _$AI(o, e = this, i, n) {
    const r = this.strings;
    let a = !1;
    if (r === void 0)
      o = A(this, o, e, 0), a = !S(o) || o !== this._$AH && o !== k, a && (this._$AH = o);
    else {
      const d = o;
      let c, m;
      for (o = r[0], c = 0; c < r.length - 1; c++)
        m = A(this, d[i + c], e, c), m === k && (m = this._$AH[c]), a || (a = !S(m) || m !== this._$AH[c]), m === l ? o = l : o !== l && (o += (m ?? "") + r[c + 1]), this._$AH[c] = m;
    }
    a && !n && this.j(o);
  }
  j(o) {
    o === l ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, o ?? "");
  }
}
class Vo extends W {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(o) {
    this.element[this.name] = o === l ? void 0 : o;
  }
}
class Qo extends W {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(o) {
    this.element.toggleAttribute(this.name, !!o && o !== l);
  }
}
class Zo extends W {
  constructor(o, e, i, n, r) {
    super(o, e, i, n, r), this.type = 5;
  }
  _$AI(o, e = this) {
    if ((o = A(this, o, e, 0) ?? l) === k)
      return;
    const i = this._$AH, n = o === l && i !== l || o.capture !== i.capture || o.once !== i.once || o.passive !== i.passive, r = o !== l && (i === l || n);
    n && this.element.removeEventListener(this.name, this, i), r && this.element.addEventListener(this.name, this, o), this._$AH = o;
  }
  handleEvent(o) {
    var e;
    typeof this._$AH == "function" ? this._$AH.call(((e = this.options) == null ? void 0 : e.host) ?? this.element, o) : this._$AH.handleEvent(o);
  }
}
class Go {
  constructor(o, e, i) {
    this.element = o, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = i;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(o) {
    A(this, o);
  }
}
const R = C.litHtmlPolyfillSupport;
R == null || R(I, H), (C.litHtmlVersions ?? (C.litHtmlVersions = [])).push("3.1.2");
const Jo = (t, o, e) => {
  const i = (e == null ? void 0 : e.renderBefore) ?? o;
  let n = i._$litPart$;
  if (n === void 0) {
    const r = (e == null ? void 0 : e.renderBefore) ?? null;
    i._$litPart$ = n = new H(o.insertBefore(B(), r), r, void 0, e ?? {});
  }
  return n._$AI(t), n;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
let _ = class extends y {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    var e;
    const o = super.createRenderRoot();
    return (e = this.renderOptions).renderBefore ?? (e.renderBefore = o.firstChild), o;
  }
  update(o) {
    const e = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(o), this._$Do = Jo(e, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    var o;
    super.connectedCallback(), (o = this._$Do) == null || o.setConnected(!0);
  }
  disconnectedCallback() {
    var o;
    super.disconnectedCallback(), (o = this._$Do) == null || o.setConnected(!1);
  }
  render() {
    return k;
  }
};
var lo;
_._$litElement$ = !0, _.finalized = !0, (lo = globalThis.litElementHydrateSupport) == null || lo.call(globalThis, { LitElement: _ });
const Y = globalThis.litElementPolyfillSupport;
Y == null || Y({ LitElement: _ });
(globalThis.litElementVersions ?? (globalThis.litElementVersions = [])).push("4.0.4");
var vo = (t, o, e) => {
  if (!o.has(t))
    throw TypeError("Cannot " + e);
}, Xo = (t, o, e) => (vo(t, o, "read from private field"), e ? e.call(t) : o.get(t)), Ko = (t, o, e) => {
  if (o.has(t))
    throw TypeError("Cannot add the same private member more than once");
  o instanceof WeakSet ? o.add(t) : o.set(t, e);
}, so = (t, o, e, i) => (vo(t, o, "write to private field"), i ? i.call(t, e) : o.set(t, e), e);
const oe = (t) => (o) => (o.tagName = t.toLowerCase(), o);
var $;
let ee = class extends _ {
  constructor() {
    super(...arguments), Ko(this, $, !1);
  }
  static register() {
    globalThis.customElements.get(this.tagName) || globalThis.customElements.define(this.tagName, this);
  }
  /**
   * Is called on every connection of this element, after on the first updated call.
   *
   * This is perfect for performing operations that require the dom to have rendered.
   *
   * If it's an operation that only needs to run once, you can use firstConnected.
   * But for code that must rerun on every reconnection, this is the place.
   *
   * @category lifecycle
   */
  afterConnectedCallback() {
  }
  connectedCallback() {
    super.connectedCallback(), so(this, $, !0);
  }
  updated(o) {
    super.updated(o), Xo(this, $) && (so(this, $, !1), this.afterConnectedCallback());
  }
};
$ = /* @__PURE__ */ new WeakMap();
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const te = { attribute: !0, type: String, converter: T, reflect: !1, hasChanged: G }, ie = (t = te, o, e) => {
  const { kind: i, metadata: n } = e;
  let r = globalThis.litPropertyMetadata.get(n);
  if (r === void 0 && globalThis.litPropertyMetadata.set(n, r = /* @__PURE__ */ new Map()), r.set(e.name, t), i === "accessor") {
    const { name: a } = e;
    return { set(d) {
      const c = o.get.call(this);
      o.set.call(this, d), this.requestUpdate(a, c, t);
    }, init(d) {
      return d !== void 0 && this.P(a, void 0, t), d;
    } };
  }
  if (i === "setter") {
    const { name: a } = e;
    return function(d) {
      const c = this[a];
      o.call(this, d), this.requestUpdate(a, c, t);
    };
  }
  throw Error("Unsupported decorator location: " + i);
};
function P(t) {
  return (o, e) => typeof e == "object" ? ie(t, o, e) : ((i, n, r) => {
    const a = n.hasOwnProperty(r);
    return n.constructor.createProperty(r, a ? { ...i, wrapped: !0 } : i), a ? Object.getOwnPropertyDescriptor(n, r) : void 0;
  })(t, o, e);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function fo(t) {
  return P({ ...t, state: !0, attribute: !1 });
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const wo = { ATTRIBUTE: 1, CHILD: 2, PROPERTY: 3, BOOLEAN_ATTRIBUTE: 4, EVENT: 5, ELEMENT: 6 }, xo = (t) => (...o) => ({ _$litDirective$: t, values: o });
class ko {
  constructor(o) {
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AT(o, e, i) {
    this._$Ct = o, this._$AM = e, this._$Ci = i;
  }
  _$AS(o, e) {
    return this.update(o, e);
  }
  update(o, e) {
    return this.render(...e);
  }
}
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ne = xo(class extends ko {
  constructor(t) {
    var o;
    if (super(t), t.type !== wo.ATTRIBUTE || t.name !== "class" || ((o = t.strings) == null ? void 0 : o.length) > 2)
      throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.");
  }
  render(t) {
    return " " + Object.keys(t).filter((o) => t[o]).join(" ") + " ";
  }
  update(t, [o]) {
    var i, n;
    if (this.st === void 0) {
      this.st = /* @__PURE__ */ new Set(), t.strings !== void 0 && (this.nt = new Set(t.strings.join(" ").split(/\s/).filter((r) => r !== "")));
      for (const r in o)
        o[r] && !((i = this.nt) != null && i.has(r)) && this.st.add(r);
      return this.render(o);
    }
    const e = t.element.classList;
    for (const r of this.st)
      r in o || (e.remove(r), this.st.delete(r));
    for (const r in o) {
      const a = !!o[r];
      a === this.st.has(r) || (n = this.nt) != null && n.has(r) || (a ? (e.add(r), this.st.add(r)) : (e.remove(r), this.st.delete(r)));
    }
    return k;
  }
});
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const re = (t) => t.strings === void 0;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const D = (t, o) => {
  var i;
  const e = t._$AN;
  if (e === void 0)
    return !1;
  for (const n of e)
    (i = n._$AO) == null || i.call(n, o, !1), D(n, o);
  return !0;
}, j = (t) => {
  let o, e;
  do {
    if ((o = t._$AM) === void 0)
      break;
    e = o._$AN, e.delete(t), t = o;
  } while ((e == null ? void 0 : e.size) === 0);
}, yo = (t) => {
  for (let o; o = t._$AM; t = o) {
    let e = o._$AN;
    if (e === void 0)
      o._$AN = e = /* @__PURE__ */ new Set();
    else if (e.has(t))
      break;
    e.add(t), de(o);
  }
};
function ae(t) {
  this._$AN !== void 0 ? (j(this), this._$AM = t, yo(this)) : this._$AM = t;
}
function ce(t, o = !1, e = 0) {
  const i = this._$AH, n = this._$AN;
  if (n !== void 0 && n.size !== 0)
    if (o)
      if (Array.isArray(i))
        for (let r = e; r < i.length; r++)
          D(i[r], !1), j(i[r]);
      else
        i != null && (D(i, !1), j(i));
    else
      D(this, t);
}
const de = (t) => {
  t.type == wo.CHILD && (t._$AP ?? (t._$AP = ce), t._$AQ ?? (t._$AQ = ae));
};
class se extends ko {
  constructor() {
    super(...arguments), this._$AN = void 0;
  }
  _$AT(o, e, i) {
    super._$AT(o, e, i), yo(this), this.isConnected = o._$AU;
  }
  _$AO(o, e = !0) {
    var i, n;
    o !== this.isConnected && (this.isConnected = o, o ? (i = this.reconnected) == null || i.call(this) : (n = this.disconnected) == null || n.call(this)), e && (D(this, o), j(this));
  }
  setValue(o) {
    if (re(this._$Ct))
      this._$Ct._$AI(o, this);
    else {
      const e = [...this._$Ct._$AH];
      e[this._$Ci] = o, this._$Ct._$AI(e, this, 0);
    }
  }
  disconnected() {
  }
  reconnected() {
  }
}
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const le = () => new me();
class me {
}
const V = /* @__PURE__ */ new WeakMap(), pe = xo(class extends se {
  render(t) {
    return l;
  }
  update(t, [o]) {
    var i;
    const e = o !== this.Y;
    return e && this.Y !== void 0 && this.rt(void 0), (e || this.lt !== this.ct) && (this.Y = o, this.ht = (i = t.options) == null ? void 0 : i.host, this.rt(this.ct = t.element)), l;
  }
  rt(t) {
    if (typeof this.Y == "function") {
      const o = this.ht ?? globalThis;
      let e = V.get(o);
      e === void 0 && (e = /* @__PURE__ */ new WeakMap(), V.set(o, e)), e.get(this.Y) !== void 0 && this.Y.call(this.ht, void 0), e.set(this.Y, t), t !== void 0 && this.Y.call(this.ht, t);
    } else
      this.Y.value = t;
  }
  get lt() {
    var t, o;
    return typeof this.Y == "function" ? (t = V.get(this.ht ?? globalThis)) == null ? void 0 : t.get(this.Y) : (o = this.Y) == null ? void 0 : o.value;
  }
  disconnected() {
    this.lt === this.ct && this.rt(void 0);
  }
  reconnected() {
    this.rt(this.ct);
  }
});
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function ge(t, o, e) {
  return t ? o(t) : e == null ? void 0 : e(t);
}
const he = `/*!-----------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Version: 0.47.0(69991d66135e4a1fc1cf0b1ac4ad25d429866a0d)
 * Released under the MIT license
 * https://github.com/microsoft/vscode/blob/main/LICENSE.txt
 *-----------------------------------------------------------*/.monaco-action-bar{height:100%;white-space:nowrap}.monaco-action-bar .actions-container{align-items:center;display:flex;height:100%;margin:0 auto;padding:0;width:100%}.monaco-action-bar.vertical .actions-container{display:inline-block}.monaco-action-bar .action-item{align-items:center;cursor:pointer;display:block;justify-content:center;position:relative}.monaco-action-bar .action-item.disabled{cursor:default}.monaco-action-bar .action-item .codicon,.monaco-action-bar .action-item .icon{display:block}.monaco-action-bar .action-item .codicon{align-items:center;display:flex;height:16px;width:16px}.monaco-action-bar .action-label{border-radius:5px;display:flex;font-size:11px;padding:3px}.monaco-action-bar .action-item.disabled .action-label,.monaco-action-bar .action-item.disabled .action-label:before,.monaco-action-bar .action-item.disabled .action-label:hover{color:var(--vscode-disabledForeground)}.monaco-action-bar.vertical{text-align:left}.monaco-action-bar.vertical .action-item{display:block}.monaco-action-bar.vertical .action-label.separator{border-bottom:1px solid #bbb;display:block;margin-left:.8em;margin-right:.8em;padding-top:1px}.monaco-action-bar .action-item .action-label.separator{background-color:#bbb;cursor:default;height:16px;margin:5px 4px!important;min-width:1px;padding:0;width:1px}.secondary-actions .monaco-action-bar .action-label{margin-left:6px}.monaco-action-bar .action-item.select-container{align-items:center;display:flex;flex:1;justify-content:center;margin-right:10px;max-width:170px;min-width:60px;overflow:hidden}.monaco-action-bar .action-item.action-dropdown-item{display:flex}.monaco-action-bar .action-item.action-dropdown-item>.action-dropdown-item-separator{align-items:center;cursor:default;display:flex}.monaco-action-bar .action-item.action-dropdown-item>.action-dropdown-item-separator>div{width:1px}.monaco-aria-container{left:-999em;position:absolute}.monaco-text-button{align-items:center;border:1px solid var(--vscode-button-border,transparent);border-radius:2px;box-sizing:border-box;cursor:pointer;display:flex;justify-content:center;line-height:18px;padding:4px;text-align:center;width:100%}.monaco-text-button:focus{outline-offset:2px!important}.monaco-text-button:hover{text-decoration:none!important}.monaco-button.disabled,.monaco-button.disabled:focus{cursor:default;opacity:.4!important}.monaco-text-button .codicon{color:inherit!important;margin:0 .2em}.monaco-text-button.monaco-text-button-with-short-label{flex-direction:row;flex-wrap:wrap;height:28px;overflow:hidden;padding:0 4px}.monaco-text-button.monaco-text-button-with-short-label>.monaco-button-label{flex-basis:100%}.monaco-text-button.monaco-text-button-with-short-label>.monaco-button-label-short{flex-grow:1;overflow:hidden;width:0}.monaco-text-button.monaco-text-button-with-short-label>.monaco-button-label,.monaco-text-button.monaco-text-button-with-short-label>.monaco-button-label-short{align-items:center;display:flex;font-style:inherit;font-weight:400;justify-content:center;padding:4px 0}.monaco-button-dropdown{cursor:pointer;display:flex}.monaco-button-dropdown.disabled{cursor:default}.monaco-button-dropdown>.monaco-button:focus{outline-offset:-1px!important}.monaco-button-dropdown.disabled>.monaco-button-dropdown-separator,.monaco-button-dropdown.disabled>.monaco-button.disabled,.monaco-button-dropdown.disabled>.monaco-button.disabled:focus{opacity:.4!important}.monaco-button-dropdown>.monaco-button.monaco-text-button{border-right-width:0!important}.monaco-button-dropdown .monaco-button-dropdown-separator{cursor:default;padding:4px 0}.monaco-button-dropdown .monaco-button-dropdown-separator>div{height:100%;width:1px}.monaco-button-dropdown>.monaco-button.monaco-dropdown-button{align-items:center;border:1px solid var(--vscode-button-border,transparent);border-left-width:0!important;border-radius:0 2px 2px 0;display:flex}.monaco-button-dropdown>.monaco-button.monaco-text-button{border-radius:2px 0 0 2px}.monaco-description-button{align-items:center;display:flex;flex-direction:column;margin:4px 5px}.monaco-description-button .monaco-button-description{font-size:11px;font-style:italic;padding:4px 20px}.monaco-description-button .monaco-button-description,.monaco-description-button .monaco-button-label{align-items:center;display:flex;justify-content:center}.monaco-description-button .monaco-button-description>.codicon,.monaco-description-button .monaco-button-label>.codicon{color:inherit!important;margin:0 .2em}.monaco-button-dropdown.default-colors>.monaco-button,.monaco-button.default-colors{background-color:var(--vscode-button-background);color:var(--vscode-button-foreground)}.monaco-button-dropdown.default-colors>.monaco-button:hover,.monaco-button.default-colors:hover{background-color:var(--vscode-button-hoverBackground)}.monaco-button-dropdown.default-colors>.monaco-button.secondary,.monaco-button.default-colors.secondary{background-color:var(--vscode-button-secondaryBackground);color:var(--vscode-button-secondaryForeground)}.monaco-button-dropdown.default-colors>.monaco-button.secondary:hover,.monaco-button.default-colors.secondary:hover{background-color:var(--vscode-button-secondaryHoverBackground)}.monaco-button-dropdown.default-colors .monaco-button-dropdown-separator{background-color:var(--vscode-button-background);border-bottom:1px solid var(--vscode-button-border);border-top:1px solid var(--vscode-button-border)}.monaco-button-dropdown.default-colors .monaco-button.secondary+.monaco-button-dropdown-separator{background-color:var(--vscode-button-secondaryBackground)}.monaco-button-dropdown.default-colors .monaco-button-dropdown-separator>div{background-color:var(--vscode-button-separator)}@font-face{font-display:block;font-family:codicon;src:url(../base/browser/ui/codicons/codicon/codicon.ttf) format("truetype")}.codicon[class*=codicon-]{display:inline-block;font:normal normal normal 16px/1 codicon;text-align:center;text-decoration:none;text-rendering:auto;text-transform:none;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;user-select:none;-webkit-user-select:none}.codicon-wrench-subaction{opacity:.5}@keyframes codicon-spin{to{transform:rotate(1turn)}}.codicon-gear.codicon-modifier-spin,.codicon-loading.codicon-modifier-spin,.codicon-notebook-state-executing.codicon-modifier-spin,.codicon-sync.codicon-modifier-spin{animation:codicon-spin 1.5s steps(30) infinite}.codicon-modifier-disabled{opacity:.4}.codicon-loading,.codicon-tree-item-loading:before{animation-duration:1s!important;animation-timing-function:cubic-bezier(.53,.21,.29,.67)!important}.context-view{position:absolute}.context-view.fixed{all:initial;color:inherit;font-family:inherit;font-size:13px;position:fixed}.monaco-count-badge{border-radius:11px;box-sizing:border-box;display:inline-block;font-size:11px;font-weight:400;line-height:11px;min-height:18px;min-width:18px;padding:3px 6px;text-align:center}.monaco-count-badge.long{border-radius:2px;line-height:normal;min-height:auto;padding:2px 3px}.monaco-dropdown{height:100%;padding:0}.monaco-dropdown>.dropdown-label{align-items:center;cursor:pointer;display:flex;height:100%;justify-content:center}.monaco-dropdown>.dropdown-label>.action-label.disabled{cursor:default}.monaco-dropdown-with-primary{border-radius:5px;display:flex!important;flex-direction:row}.monaco-dropdown-with-primary>.action-container>.action-label{margin-right:0}.monaco-dropdown-with-primary>.dropdown-action-container>.monaco-dropdown>.dropdown-label .codicon[class*=codicon-]{font-size:12px;line-height:16px;margin-left:-3px;padding-left:0;padding-right:0}.monaco-dropdown-with-primary>.dropdown-action-container>.monaco-dropdown>.dropdown-label>.action-label{background-position:50%;background-repeat:no-repeat;background-size:16px;display:block}.monaco-findInput{position:relative}.monaco-findInput .monaco-inputbox{font-size:13px;width:100%}.monaco-findInput>.controls{position:absolute;right:2px;top:3px}.vs .monaco-findInput.disabled{background-color:#e1e1e1}.vs-dark .monaco-findInput.disabled{background-color:#333}.hc-light .monaco-findInput.highlight-0 .controls,.monaco-findInput.highlight-0 .controls{animation:monaco-findInput-highlight-0 .1s linear 0s}.hc-light .monaco-findInput.highlight-1 .controls,.monaco-findInput.highlight-1 .controls{animation:monaco-findInput-highlight-1 .1s linear 0s}.hc-black .monaco-findInput.highlight-0 .controls,.vs-dark .monaco-findInput.highlight-0 .controls{animation:monaco-findInput-highlight-dark-0 .1s linear 0s}.hc-black .monaco-findInput.highlight-1 .controls,.vs-dark .monaco-findInput.highlight-1 .controls{animation:monaco-findInput-highlight-dark-1 .1s linear 0s}@keyframes monaco-findInput-highlight-0{0%{background:rgba(253,255,0,.8)}to{background:transparent}}@keyframes monaco-findInput-highlight-1{0%{background:rgba(253,255,0,.8)}99%{background:transparent}}@keyframes monaco-findInput-highlight-dark-0{0%{background:hsla(0,0%,100%,.44)}to{background:transparent}}@keyframes monaco-findInput-highlight-dark-1{0%{background:hsla(0,0%,100%,.44)}99%{background:transparent}}.monaco-hover{animation:fadein .1s linear;box-sizing:border-box;cursor:default;line-height:1.5em;overflow:hidden;position:absolute;user-select:text;-webkit-user-select:text;white-space:var(--vscode-hover-whiteSpace,normal)}.monaco-hover.hidden{display:none}.monaco-hover a:hover:not(.disabled){cursor:pointer}.monaco-hover .hover-contents:not(.html-hover-contents){padding:4px 8px}.monaco-hover .markdown-hover>.hover-contents:not(.code-hover-contents){max-width:var(--vscode-hover-maxWidth,500px);word-wrap:break-word}.monaco-hover .markdown-hover>.hover-contents:not(.code-hover-contents) hr{min-width:100%}.monaco-hover .code,.monaco-hover h1,.monaco-hover h2,.monaco-hover h3,.monaco-hover h4,.monaco-hover h5,.monaco-hover h6,.monaco-hover p,.monaco-hover ul{margin:8px 0}.monaco-hover h1,.monaco-hover h2,.monaco-hover h3,.monaco-hover h4,.monaco-hover h5,.monaco-hover h6{line-height:1.1}.monaco-hover code{font-family:var(--monaco-monospace-font)}.monaco-hover hr{border-left:0;border-right:0;box-sizing:border-box;height:1px;margin:4px -8px -4px}.monaco-hover .code:first-child,.monaco-hover p:first-child,.monaco-hover ul:first-child{margin-top:0}.monaco-hover .code:last-child,.monaco-hover p:last-child,.monaco-hover ul:last-child{margin-bottom:0}.monaco-hover ol,.monaco-hover ul{padding-left:20px}.monaco-hover li>p{margin-bottom:0}.monaco-hover li>ul{margin-top:0}.monaco-hover code{border-radius:3px;padding:0 .4em}.monaco-hover .monaco-tokenized-source{white-space:var(--vscode-hover-sourceWhiteSpace,pre-wrap)}.monaco-hover .hover-row.status-bar{font-size:12px;line-height:22px}.monaco-hover .hover-row.status-bar .info{font-style:italic;padding:0 8px}.monaco-hover .hover-row.status-bar .actions{display:flex;padding:0 8px}.monaco-hover .hover-row.status-bar .actions .action-container{cursor:pointer;margin-right:16px}.monaco-hover .hover-row.status-bar .actions .action-container .action .icon{padding-right:4px}.monaco-hover .markdown-hover .hover-contents .codicon{color:inherit;font-size:inherit;vertical-align:middle}.monaco-hover .hover-contents a.code-link,.monaco-hover .hover-contents a.code-link:hover{color:inherit}.monaco-hover .hover-contents a.code-link:before{content:"("}.monaco-hover .hover-contents a.code-link:after{content:")"}.monaco-hover .hover-contents a.code-link>span{border-bottom:1px solid transparent;color:var(--vscode-textLink-foreground);text-decoration:underline;text-underline-position:under}.monaco-hover .hover-contents a.code-link>span:hover{color:var(--vscode-textLink-activeForeground)}.monaco-hover .markdown-hover .hover-contents:not(.code-hover-contents):not(.html-hover-contents) span{display:inline-block;margin-bottom:4px}.monaco-hover-content .action-container a{-webkit-user-select:none;user-select:none}.monaco-hover-content .action-container.disabled{cursor:default;opacity:.4;pointer-events:none}.monaco-icon-label{display:flex;overflow:hidden;text-overflow:ellipsis}.monaco-icon-label:before{background-position:0;background-repeat:no-repeat;background-size:16px;display:inline-block;height:22px;line-height:inherit!important;padding-right:6px;width:16px;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;flex-shrink:0;vertical-align:top}.monaco-icon-label-container.disabled{color:var(--vscode-disabledForeground)}.monaco-icon-label>.monaco-icon-label-container{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis}.monaco-icon-label>.monaco-icon-label-container>.monaco-icon-name-container>.label-name{color:inherit;white-space:pre}.monaco-icon-label>.monaco-icon-label-container>.monaco-icon-name-container>.label-name>.label-separator{margin:0 2px;opacity:.5}.monaco-icon-label>.monaco-icon-label-container>.monaco-icon-suffix-container>.label-suffix{opacity:.7;white-space:pre}.monaco-icon-label>.monaco-icon-label-container>.monaco-icon-description-container>.label-description{font-size:.9em;margin-left:.5em;opacity:.7;white-space:pre}.monaco-icon-label.nowrap>.monaco-icon-label-container>.monaco-icon-description-container>.label-description{white-space:nowrap}.vs .monaco-icon-label>.monaco-icon-label-container>.monaco-icon-description-container>.label-description{opacity:.95}.monaco-icon-label.italic>.monaco-icon-label-container>.monaco-icon-description-container>.label-description,.monaco-icon-label.italic>.monaco-icon-label-container>.monaco-icon-name-container>.label-name{font-style:italic}.monaco-icon-label.deprecated{opacity:.66;text-decoration:line-through}.monaco-icon-label.italic:after{font-style:italic}.monaco-icon-label.strikethrough>.monaco-icon-label-container>.monaco-icon-description-container>.label-description,.monaco-icon-label.strikethrough>.monaco-icon-label-container>.monaco-icon-name-container>.label-name{text-decoration:line-through}.monaco-icon-label:after{font-size:90%;font-weight:600;margin:auto 16px 0 5px;opacity:.75;text-align:center}.monaco-list:focus .selected .monaco-icon-label,.monaco-list:focus .selected .monaco-icon-label:after{color:inherit!important}.monaco-list-row.focused.selected .label-description,.monaco-list-row.selected .label-description{opacity:.8}.monaco-inputbox{border-radius:2px;box-sizing:border-box;display:block;font-size:inherit;padding:0;position:relative}.monaco-inputbox>.ibwrapper>.input,.monaco-inputbox>.ibwrapper>.mirror{padding:4px 6px}.monaco-inputbox>.ibwrapper{height:100%;position:relative;width:100%}.monaco-inputbox>.ibwrapper>.input{border:none;box-sizing:border-box;color:inherit;display:inline-block;font-family:inherit;font-size:inherit;height:100%;line-height:inherit;resize:none;width:100%}.monaco-inputbox>.ibwrapper>input{text-overflow:ellipsis}.monaco-inputbox>.ibwrapper>textarea.input{display:block;outline:none;scrollbar-width:none}.monaco-inputbox>.ibwrapper>textarea.input::-webkit-scrollbar{display:none}.monaco-inputbox>.ibwrapper>textarea.input.empty{white-space:nowrap}.monaco-inputbox>.ibwrapper>.mirror{box-sizing:border-box;display:inline-block;left:0;position:absolute;top:0;visibility:hidden;white-space:pre-wrap;width:100%;word-wrap:break-word}.monaco-inputbox-container{text-align:right}.monaco-inputbox-container .monaco-inputbox-message{box-sizing:border-box;display:inline-block;font-size:12px;line-height:17px;margin-top:-1px;overflow:hidden;padding:.4em;text-align:left;width:100%;word-wrap:break-word}.monaco-inputbox .monaco-action-bar{position:absolute;right:2px;top:4px}.monaco-inputbox .monaco-action-bar .action-item{margin-left:2px}.monaco-inputbox .monaco-action-bar .action-item .codicon{background-repeat:no-repeat;height:16px;width:16px}.monaco-keybinding{align-items:center;display:flex;line-height:10px}.monaco-keybinding>.monaco-keybinding-key{border-radius:3px;border-style:solid;border-width:1px;display:inline-block;font-size:11px;margin:0 2px;padding:3px 5px;vertical-align:middle}.monaco-keybinding>.monaco-keybinding-key:first-child{margin-left:0}.monaco-keybinding>.monaco-keybinding-key:last-child{margin-right:0}.monaco-keybinding>.monaco-keybinding-key-separator{display:inline-block}.monaco-keybinding>.monaco-keybinding-key-chord-separator{width:6px}.monaco-list{height:100%;position:relative;white-space:nowrap;width:100%}.monaco-list.mouse-support{user-select:none;-webkit-user-select:none}.monaco-list>.monaco-scrollable-element{height:100%}.monaco-list-rows{height:100%;position:relative;width:100%}.monaco-list.horizontal-scrolling .monaco-list-rows{min-width:100%;width:auto}.monaco-list-row{box-sizing:border-box;overflow:hidden;position:absolute;width:100%}.monaco-list.mouse-support .monaco-list-row{cursor:pointer;touch-action:none}.monaco-list .monaco-scrollable-element>.scrollbar.vertical,.monaco-pane-view>.monaco-split-view2.vertical>.monaco-scrollable-element>.scrollbar.vertical{z-index:14}.monaco-list-row.scrolling{display:none!important}.monaco-list.element-focused,.monaco-list.selection-multiple,.monaco-list.selection-single{outline:0!important}.monaco-drag-image{border-radius:10px;display:inline-block;font-size:12px;padding:1px 7px;position:absolute;z-index:1000}.monaco-list-type-filter-message{box-sizing:border-box;height:100%;left:0;opacity:.7;padding:40px 1em 1em;pointer-events:none;position:absolute;text-align:center;top:0;white-space:normal;width:100%}.monaco-list-type-filter-message:empty{display:none}.monaco-mouse-cursor-text{cursor:text}.monaco-progress-container{height:2px;overflow:hidden;width:100%}.monaco-progress-container .progress-bit{display:none;height:2px;left:0;position:absolute;width:2%}.monaco-progress-container.active .progress-bit{display:inherit}.monaco-progress-container.discrete .progress-bit{left:0;transition:width .1s linear}.monaco-progress-container.discrete.done .progress-bit{width:100%}.monaco-progress-container.infinite .progress-bit{animation-duration:4s;animation-iteration-count:infinite;animation-name:progress;animation-timing-function:linear;transform:translateZ(0)}.monaco-progress-container.infinite.infinite-long-running .progress-bit{animation-timing-function:steps(100)}@keyframes progress{0%{transform:translateX(0) scaleX(1)}50%{transform:translateX(2500%) scaleX(3)}to{transform:translateX(4900%) scaleX(1)}}:root{--vscode-sash-size:4px;--vscode-sash-hover-size:4px}.monaco-sash{position:absolute;touch-action:none;z-index:35}.monaco-sash.disabled{pointer-events:none}.monaco-sash.mac.vertical{cursor:col-resize}.monaco-sash.vertical.minimum{cursor:e-resize}.monaco-sash.vertical.maximum{cursor:w-resize}.monaco-sash.mac.horizontal{cursor:row-resize}.monaco-sash.horizontal.minimum{cursor:s-resize}.monaco-sash.horizontal.maximum{cursor:n-resize}.monaco-sash.disabled{cursor:default!important;pointer-events:none!important}.monaco-sash.vertical{cursor:ew-resize;height:100%;top:0;width:var(--vscode-sash-size)}.monaco-sash.horizontal{cursor:ns-resize;height:var(--vscode-sash-size);left:0;width:100%}.monaco-sash:not(.disabled)>.orthogonal-drag-handle{content:" ";cursor:all-scroll;display:block;height:calc(var(--vscode-sash-size)*2);position:absolute;width:calc(var(--vscode-sash-size)*2);z-index:100}.monaco-sash.horizontal.orthogonal-edge-north:not(.disabled)>.orthogonal-drag-handle.start,.monaco-sash.horizontal.orthogonal-edge-south:not(.disabled)>.orthogonal-drag-handle.end{cursor:nwse-resize}.monaco-sash.horizontal.orthogonal-edge-north:not(.disabled)>.orthogonal-drag-handle.end,.monaco-sash.horizontal.orthogonal-edge-south:not(.disabled)>.orthogonal-drag-handle.start{cursor:nesw-resize}.monaco-sash.vertical>.orthogonal-drag-handle.start{left:calc(var(--vscode-sash-size)*-.5);top:calc(var(--vscode-sash-size)*-1)}.monaco-sash.vertical>.orthogonal-drag-handle.end{bottom:calc(var(--vscode-sash-size)*-1);left:calc(var(--vscode-sash-size)*-.5)}.monaco-sash.horizontal>.orthogonal-drag-handle.start{left:calc(var(--vscode-sash-size)*-1);top:calc(var(--vscode-sash-size)*-.5)}.monaco-sash.horizontal>.orthogonal-drag-handle.end{right:calc(var(--vscode-sash-size)*-1);top:calc(var(--vscode-sash-size)*-.5)}.monaco-sash:before{background:transparent;content:"";height:100%;pointer-events:none;position:absolute;width:100%}.monaco-workbench:not(.reduce-motion) .monaco-sash:before{transition:background-color .1s ease-out}.monaco-sash.active:before,.monaco-sash.hover:before{background:var(--vscode-sash-hoverBorder)}.monaco-sash.vertical:before{left:calc(50% - var(--vscode-sash-hover-size)/2);width:var(--vscode-sash-hover-size)}.monaco-sash.horizontal:before{height:var(--vscode-sash-hover-size);top:calc(50% - var(--vscode-sash-hover-size)/2)}.pointer-events-disabled{pointer-events:none!important}.monaco-sash.debug{background:cyan}.monaco-sash.debug.disabled{background:rgba(0,255,255,.2)}.monaco-sash.debug:not(.disabled)>.orthogonal-drag-handle{background:red}.monaco-scrollable-element>.scrollbar>.scra{cursor:pointer;font-size:11px!important}.monaco-scrollable-element>.visible{background:transparent;opacity:1;transition:opacity .1s linear;z-index:11}.monaco-scrollable-element>.invisible{opacity:0;pointer-events:none}.monaco-scrollable-element>.invisible.fade{transition:opacity .8s linear}.monaco-scrollable-element>.shadow{display:none;position:absolute}.monaco-scrollable-element>.shadow.top{box-shadow:var(--vscode-scrollbar-shadow) 0 6px 6px -6px inset;display:block;height:3px;left:3px;top:0;width:100%}.monaco-scrollable-element>.shadow.left{box-shadow:var(--vscode-scrollbar-shadow) 6px 0 6px -6px inset;display:block;height:100%;left:0;top:3px;width:3px}.monaco-scrollable-element>.shadow.top-left-corner{display:block;height:3px;left:0;top:0;width:3px}.monaco-scrollable-element>.shadow.top.left{box-shadow:var(--vscode-scrollbar-shadow) 6px 0 6px -6px inset}.monaco-scrollable-element>.scrollbar>.slider{background:var(--vscode-scrollbarSlider-background)}.monaco-scrollable-element>.scrollbar>.slider:hover{background:var(--vscode-scrollbarSlider-hoverBackground)}.monaco-scrollable-element>.scrollbar>.slider.active{background:var(--vscode-scrollbarSlider-activeBackground)}.monaco-select-box{border-radius:2px;cursor:pointer;width:100%}.monaco-select-box-dropdown-container{font-size:13px;font-weight:400;text-transform:none}.monaco-action-bar .action-item.select-container{cursor:default}.monaco-action-bar .action-item .monaco-select-box{cursor:pointer;min-height:18px;min-width:100px;padding:2px 23px 2px 8px}.mac .monaco-action-bar .action-item .monaco-select-box{border-radius:5px;font-size:11px}.monaco-select-box-dropdown-padding{--dropdown-padding-top:1px;--dropdown-padding-bottom:1px}.hc-black .monaco-select-box-dropdown-padding,.hc-light .monaco-select-box-dropdown-padding{--dropdown-padding-top:3px;--dropdown-padding-bottom:4px}.monaco-select-box-dropdown-container{box-sizing:border-box;display:none}.monaco-select-box-dropdown-container>.select-box-details-pane>.select-box-description-markdown *{margin:0}.monaco-select-box-dropdown-container>.select-box-details-pane>.select-box-description-markdown a:focus{outline:1px solid -webkit-focus-ring-color;outline-offset:-1px}.monaco-select-box-dropdown-container>.select-box-details-pane>.select-box-description-markdown code{font-family:var(--monaco-monospace-font);line-height:15px}.monaco-select-box-dropdown-container.visible{border-bottom-left-radius:3px;border-bottom-right-radius:3px;display:flex;flex-direction:column;overflow:hidden;text-align:left;width:1px}.monaco-select-box-dropdown-container>.select-box-dropdown-list-container{align-self:flex-start;box-sizing:border-box;flex:0 0 auto;overflow:hidden;padding-bottom:var(--dropdown-padding-bottom);padding-left:1px;padding-right:1px;padding-top:var(--dropdown-padding-top);width:100%}.monaco-select-box-dropdown-container>.select-box-details-pane{padding:5px}.hc-black .monaco-select-box-dropdown-container>.select-box-dropdown-list-container{padding-bottom:var(--dropdown-padding-bottom);padding-top:var(--dropdown-padding-top)}.monaco-select-box-dropdown-container>.select-box-dropdown-list-container .monaco-list .monaco-list-row{cursor:pointer}.monaco-select-box-dropdown-container>.select-box-dropdown-list-container .monaco-list .monaco-list-row>.option-text{float:left;overflow:hidden;padding-left:3.5px;text-overflow:ellipsis;white-space:nowrap}.monaco-select-box-dropdown-container>.select-box-dropdown-list-container .monaco-list .monaco-list-row>.option-detail{float:left;opacity:.7;overflow:hidden;padding-left:3.5px;text-overflow:ellipsis;white-space:nowrap}.monaco-select-box-dropdown-container>.select-box-dropdown-list-container .monaco-list .monaco-list-row>.option-decorator-right{float:right;overflow:hidden;padding-right:10px;text-overflow:ellipsis;white-space:nowrap}.monaco-select-box-dropdown-container>.select-box-dropdown-list-container .monaco-list .monaco-list-row>.visually-hidden{height:1px;left:-10000px;overflow:hidden;position:absolute;top:auto;width:1px}.monaco-select-box-dropdown-container>.select-box-dropdown-container-width-control{align-self:flex-start;flex:1 1 auto;opacity:0}.monaco-select-box-dropdown-container>.select-box-dropdown-container-width-control>.width-control-div{max-height:0;overflow:hidden}.monaco-select-box-dropdown-container>.select-box-dropdown-container-width-control>.width-control-div>.option-text-width-control{padding-left:4px;padding-right:8px;white-space:nowrap}.monaco-split-view2{height:100%;position:relative;width:100%}.monaco-split-view2>.sash-container{height:100%;pointer-events:none;position:absolute;width:100%}.monaco-split-view2>.sash-container>.monaco-sash{pointer-events:auto}.monaco-split-view2>.monaco-scrollable-element{height:100%;width:100%}.monaco-split-view2>.monaco-scrollable-element>.split-view-container{height:100%;position:relative;white-space:nowrap;width:100%}.monaco-split-view2>.monaco-scrollable-element>.split-view-container>.split-view-view{position:absolute;white-space:normal}.monaco-split-view2>.monaco-scrollable-element>.split-view-container>.split-view-view:not(.visible){display:none}.monaco-split-view2.vertical>.monaco-scrollable-element>.split-view-container>.split-view-view{width:100%}.monaco-split-view2.horizontal>.monaco-scrollable-element>.split-view-container>.split-view-view{height:100%}.monaco-split-view2.separator-border>.monaco-scrollable-element>.split-view-container>.split-view-view:not(:first-child):before{background-color:var(--separator-border);content:" ";left:0;pointer-events:none;position:absolute;top:0;z-index:5}.monaco-split-view2.separator-border.horizontal>.monaco-scrollable-element>.split-view-container>.split-view-view:not(:first-child):before{height:100%;width:1px}.monaco-split-view2.separator-border.vertical>.monaco-scrollable-element>.split-view-container>.split-view-view:not(:first-child):before{height:1px;width:100%}.monaco-table{display:flex;flex-direction:column;height:100%;overflow:hidden;position:relative;white-space:nowrap;width:100%}.monaco-table>.monaco-split-view2{border-bottom:1px solid transparent}.monaco-table>.monaco-list{flex:1}.monaco-table-tr{display:flex;height:100%}.monaco-table-th{font-weight:700;height:100%;overflow:hidden;text-overflow:ellipsis;width:100%}.monaco-table-td,.monaco-table-th{box-sizing:border-box;flex-shrink:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.monaco-table>.monaco-split-view2 .monaco-sash.vertical:before{border-left:1px solid transparent;content:"";left:calc(var(--vscode-sash-size)/2);position:absolute;width:0}.monaco-workbench:not(.reduce-motion) .monaco-table>.monaco-split-view2,.monaco-workbench:not(.reduce-motion) .monaco-table>.monaco-split-view2 .monaco-sash.vertical:before{transition:border-color .2s ease-out}.monaco-custom-toggle{border:1px solid transparent;border-radius:3px;box-sizing:border-box;cursor:pointer;float:left;height:20px;margin-left:2px;overflow:hidden;padding:1px;user-select:none;-webkit-user-select:none;width:20px}.monaco-custom-toggle:hover{background-color:var(--vscode-inputOption-hoverBackground)}.hc-black .monaco-custom-toggle:hover,.hc-light .monaco-custom-toggle:hover{border:1px dashed var(--vscode-focusBorder)}.hc-black .monaco-custom-toggle,.hc-black .monaco-custom-toggle:hover,.hc-light .monaco-custom-toggle,.hc-light .monaco-custom-toggle:hover{background:none}.monaco-custom-toggle.monaco-checkbox{background-size:16px!important;border:1px solid transparent;border-radius:3px;height:18px;margin-left:0;margin-right:9px;opacity:1;padding:0;width:18px}.monaco-action-bar .checkbox-action-item{align-items:center;display:flex}.monaco-action-bar .checkbox-action-item>.monaco-custom-toggle.monaco-checkbox{margin-right:4px}.monaco-action-bar .checkbox-action-item>.checkbox-label{font-size:12px}.monaco-custom-toggle.monaco-checkbox:not(.checked):before{visibility:hidden}.monaco-toolbar{height:100%}.monaco-toolbar .toolbar-toggle-more{display:inline-block;padding:0}.monaco-tl-row{align-items:center;display:flex;height:100%;position:relative}.monaco-tl-row.disabled{cursor:default}.monaco-tl-indent{height:100%;left:16px;pointer-events:none;position:absolute;top:0}.hide-arrows .monaco-tl-indent{left:12px}.monaco-tl-indent>.indent-guide{border-left:1px solid transparent;box-sizing:border-box;display:inline-block;height:100%}.monaco-workbench:not(.reduce-motion) .monaco-tl-indent>.indent-guide{transition:border-color .1s linear}.monaco-tl-contents,.monaco-tl-twistie{height:100%}.monaco-tl-twistie{align-items:center;display:flex!important;flex-shrink:0;font-size:10px;justify-content:center;padding-right:6px;text-align:right;transform:translateX(3px);width:16px}.monaco-tl-contents{flex:1;overflow:hidden}.monaco-tl-twistie:before{border-radius:20px}.monaco-tl-twistie.collapsed:before{transform:rotate(-90deg)}.monaco-tl-twistie.codicon-tree-item-loading:before{animation:codicon-spin 1.25s steps(30) infinite}.monaco-tree-type-filter{border:1px solid var(--vscode-widget-border);border-bottom-left-radius:4px;border-bottom-right-radius:4px;display:flex;margin:0 6px;max-width:200px;padding:3px;position:absolute;top:0;z-index:100}.monaco-workbench:not(.reduce-motion) .monaco-tree-type-filter{transition:top .3s}.monaco-tree-type-filter.disabled{top:-40px!important}.monaco-tree-type-filter-grab{align-items:center;cursor:grab;display:flex!important;justify-content:center;margin-right:2px}.monaco-tree-type-filter-grab.grabbing{cursor:grabbing}.monaco-tree-type-filter-input{flex:1}.monaco-tree-type-filter-input .monaco-inputbox{height:23px}.monaco-tree-type-filter-input .monaco-inputbox>.ibwrapper>.input,.monaco-tree-type-filter-input .monaco-inputbox>.ibwrapper>.mirror{padding:2px 4px}.monaco-tree-type-filter-input .monaco-findInput>.controls{top:2px}.monaco-tree-type-filter-actionbar{margin-left:4px}.monaco-tree-type-filter-actionbar .monaco-action-bar .action-label{padding:2px}.monaco-list .monaco-scrollable-element .monaco-tree-sticky-container{background-color:var(--vscode-sideBar-background);height:0;left:0;position:absolute;top:0;width:100%;z-index:13}.monaco-list .monaco-scrollable-element .monaco-tree-sticky-container .monaco-tree-sticky-row.monaco-list-row{background-color:var(--vscode-sideBar-background);opacity:1!important;overflow:hidden;position:absolute;width:100%}.monaco-list .monaco-scrollable-element .monaco-tree-sticky-container .monaco-tree-sticky-row:hover{background-color:var(--vscode-list-hoverBackground)!important;cursor:pointer}.monaco-list .monaco-scrollable-element .monaco-tree-sticky-container.empty,.monaco-list .monaco-scrollable-element .monaco-tree-sticky-container.empty .monaco-tree-sticky-container-shadow{display:none}.monaco-list .monaco-scrollable-element .monaco-tree-sticky-container .monaco-tree-sticky-container-shadow{bottom:-3px;box-shadow:var(--vscode-scrollbar-shadow) 0 6px 6px -6px inset;height:3px;left:0;position:absolute;width:100%}.monaco-list .monaco-scrollable-element .monaco-tree-sticky-container[tabindex="0"]:focus{outline:none}.monaco-editor .inputarea{background-color:transparent;border:none;color:transparent;margin:0;min-height:0;min-width:0;outline:none!important;overflow:hidden;padding:0;position:absolute;resize:none;z-index:-10}.monaco-editor .inputarea.ime-input{caret-color:var(--vscode-editorCursor-foreground);color:var(--vscode-editor-foreground);z-index:10}.monaco-editor .blockDecorations-container{pointer-events:none;position:absolute;top:0}.monaco-editor .blockDecorations-block{box-sizing:border-box;position:absolute}.monaco-editor .margin-view-overlays .current-line,.monaco-editor .view-overlays .current-line{box-sizing:border-box;display:block;left:0;position:absolute;top:0}.monaco-editor .margin-view-overlays .current-line.current-line-margin.current-line-margin-both{border-right:0}.monaco-editor .lines-content .cdr{position:absolute}.monaco-editor .glyph-margin{position:absolute;top:0}.monaco-editor .glyph-margin-widgets .cgmr{align-items:center;display:flex;justify-content:center;position:absolute}.monaco-editor .glyph-margin-widgets .cgmr.codicon-modifier-spin:before{left:50%;position:absolute;top:50%;transform:translate(-50%,-50%)}.monaco-editor .lines-content .core-guide{box-sizing:border-box;position:absolute}.monaco-editor .margin-view-overlays .line-numbers{box-sizing:border-box;cursor:default;display:inline-block;font-variant-numeric:tabular-nums;height:100%;position:absolute;text-align:right;vertical-align:middle}.monaco-editor .relative-current-line-number{display:inline-block;text-align:left;width:100%}.monaco-editor .margin-view-overlays .line-numbers.lh-odd{margin-top:1px}.monaco-editor .line-numbers{color:var(--vscode-editorLineNumber-foreground)}.monaco-editor .line-numbers.active-line-number{color:var(--vscode-editorLineNumber-activeForeground)}.mtkcontrol{background:#960000!important;color:#fff!important}.mtkoverflow{background-color:var(--vscode-button-background,var(--vscode-editor-background));border-color:var(--vscode-contrastBorder);border-radius:2px;border-style:solid;border-width:1px;color:var(--vscode-button-foreground,var(--vscode-editor-foreground));cursor:pointer;padding:4px}.mtkoverflow:hover{background-color:var(--vscode-button-hoverBackground)}.monaco-editor.no-user-select .lines-content,.monaco-editor.no-user-select .view-line,.monaco-editor.no-user-select .view-lines{user-select:none;-webkit-user-select:none}.monaco-editor.mac .lines-content:hover,.monaco-editor.mac .view-line:hover,.monaco-editor.mac .view-lines:hover{user-select:text;-webkit-user-select:text;-ms-user-select:text}.monaco-editor.enable-user-select{user-select:auto;-webkit-user-select:initial}.monaco-editor .view-lines{white-space:nowrap}.monaco-editor .view-line{position:absolute;width:100%}.monaco-editor .mtkw,.monaco-editor .mtkz{color:var(--vscode-editorWhitespace-foreground)!important}.monaco-editor .mtkz{display:inline-block}.monaco-editor .lines-decorations{background:#fff;position:absolute;top:0}.monaco-editor .margin-view-overlays .cldr{height:100%;position:absolute}.monaco-editor .margin{background-color:var(--vscode-editorGutter-background)}.monaco-editor .margin-view-overlays .cmdr{height:100%;left:0;position:absolute;width:100%}.monaco-editor .minimap.slider-mouseover .minimap-slider{opacity:0;transition:opacity .1s linear}.monaco-editor .minimap.slider-mouseover .minimap-slider.active,.monaco-editor .minimap.slider-mouseover:hover .minimap-slider{opacity:1}.monaco-editor .minimap-slider .minimap-slider-horizontal{background:var(--vscode-minimapSlider-background)}.monaco-editor .minimap-slider:hover .minimap-slider-horizontal{background:var(--vscode-minimapSlider-hoverBackground)}.monaco-editor .minimap-slider.active .minimap-slider-horizontal{background:var(--vscode-minimapSlider-activeBackground)}.monaco-editor .minimap-shadow-visible{box-shadow:var(--vscode-scrollbar-shadow) -6px 0 6px -6px inset}.monaco-editor .minimap-shadow-hidden{position:absolute;width:0}.monaco-editor .minimap-shadow-visible{left:-6px;position:absolute;width:6px}.monaco-editor.no-minimap-shadow .minimap-shadow-visible{left:-1px;position:absolute;width:1px}.minimap.autohide{opacity:0;transition:opacity .5s}.minimap.autohide:hover{opacity:1}.monaco-editor .minimap{z-index:5}.monaco-editor .overlayWidgets{left:0;position:absolute;top:0}.monaco-editor .view-ruler{box-shadow:1px 0 0 0 var(--vscode-editorRuler-foreground) inset;position:absolute;top:0}.monaco-editor .scroll-decoration{box-shadow:var(--vscode-scrollbar-shadow) 0 6px 6px -6px inset;height:6px;left:0;position:absolute;top:0}.monaco-editor .lines-content .cslr{position:absolute}.monaco-editor .focused .selected-text{background-color:var(--vscode-editor-selectionBackground)}.monaco-editor .selected-text{background-color:var(--vscode-editor-inactiveSelectionBackground)}.monaco-editor			.top-left-radius{border-top-left-radius:3px}.monaco-editor			.bottom-left-radius{border-bottom-left-radius:3px}.monaco-editor			.top-right-radius{border-top-right-radius:3px}.monaco-editor			.bottom-right-radius{border-bottom-right-radius:3px}.monaco-editor.hc-black .top-left-radius{border-top-left-radius:0}.monaco-editor.hc-black .bottom-left-radius{border-bottom-left-radius:0}.monaco-editor.hc-black .top-right-radius{border-top-right-radius:0}.monaco-editor.hc-black .bottom-right-radius{border-bottom-right-radius:0}.monaco-editor.hc-light .top-left-radius{border-top-left-radius:0}.monaco-editor.hc-light .bottom-left-radius{border-bottom-left-radius:0}.monaco-editor.hc-light .top-right-radius{border-top-right-radius:0}.monaco-editor.hc-light .bottom-right-radius{border-bottom-right-radius:0}.monaco-editor .cursors-layer{position:absolute;top:0}.monaco-editor .cursors-layer>.cursor{box-sizing:border-box;overflow:hidden;position:absolute}.monaco-editor .cursors-layer.cursor-smooth-caret-animation>.cursor{transition:all 80ms}.monaco-editor .cursors-layer.cursor-block-outline-style>.cursor{background:transparent!important;border-style:solid;border-width:1px}.monaco-editor .cursors-layer.cursor-underline-style>.cursor{background:transparent!important;border-bottom-style:solid;border-bottom-width:2px}.monaco-editor .cursors-layer.cursor-underline-thin-style>.cursor{background:transparent!important;border-bottom-style:solid;border-bottom-width:1px}@keyframes monaco-cursor-smooth{0%,20%{opacity:1}60%,to{opacity:0}}@keyframes monaco-cursor-phase{0%,20%{opacity:1}90%,to{opacity:0}}@keyframes monaco-cursor-expand{0%,20%{transform:scaleY(1)}80%,to{transform:scaleY(0)}}.cursor-smooth{animation:monaco-cursor-smooth .5s ease-in-out 0s 20 alternate}.cursor-phase{animation:monaco-cursor-phase .5s ease-in-out 0s 20 alternate}.cursor-expand>.cursor{animation:monaco-cursor-expand .5s ease-in-out 0s 20 alternate}.monaco-editor .mwh{color:var(--vscode-editorWhitespace-foreground)!important;position:absolute}.monaco-component.diff-review{user-select:none;-webkit-user-select:none;z-index:99}.monaco-diff-editor .diff-review{position:absolute}.monaco-component.diff-review .diff-review-line-number{color:var(--vscode-editorLineNumber-foreground);display:inline-block;text-align:right}.monaco-component.diff-review .diff-review-summary{padding-left:10px}.monaco-component.diff-review .diff-review-shadow{box-shadow:var(--vscode-scrollbar-shadow) 0 -6px 6px -6px inset;position:absolute}.monaco-component.diff-review .diff-review-row{white-space:pre}.monaco-component.diff-review .diff-review-table{display:table;min-width:100%}.monaco-component.diff-review .diff-review-row{display:table-row;width:100%}.monaco-component.diff-review .diff-review-spacer{display:inline-block;vertical-align:middle;width:10px}.monaco-component.diff-review .diff-review-spacer>.codicon{font-size:9px!important}.monaco-component.diff-review .diff-review-actions{display:inline-block;position:absolute;right:10px;top:2px;z-index:100}.monaco-component.diff-review .diff-review-actions .action-label{height:16px;margin:2px 0;width:16px}.monaco-component.diff-review .revertButton{cursor:pointer}.monaco-editor .diff-hidden-lines-widget{width:100%}.monaco-editor .diff-hidden-lines{font-size:13px;height:0;line-height:14px;transform:translateY(-10px)}.monaco-editor .diff-hidden-lines .bottom.dragging,.monaco-editor .diff-hidden-lines .top.dragging,.monaco-editor .diff-hidden-lines:not(.dragging) .bottom:hover,.monaco-editor .diff-hidden-lines:not(.dragging) .top:hover{background-color:var(--vscode-focusBorder)}.monaco-editor .diff-hidden-lines .bottom,.monaco-editor .diff-hidden-lines .top{background-clip:padding-box;background-color:transparent;border-bottom:2px solid transparent;border-top:4px solid transparent;height:4px;transition:background-color .1s ease-out}.monaco-editor .diff-hidden-lines .bottom.canMoveTop:not(.canMoveBottom),.monaco-editor .diff-hidden-lines .top.canMoveTop:not(.canMoveBottom),.monaco-editor.draggingUnchangedRegion.canMoveTop:not(.canMoveBottom) *{cursor:n-resize!important}.monaco-editor .diff-hidden-lines .bottom:not(.canMoveTop).canMoveBottom,.monaco-editor .diff-hidden-lines .top:not(.canMoveTop).canMoveBottom,.monaco-editor.draggingUnchangedRegion:not(.canMoveTop).canMoveBottom *{cursor:s-resize!important}.monaco-editor .diff-hidden-lines .bottom.canMoveTop.canMoveBottom,.monaco-editor .diff-hidden-lines .top.canMoveTop.canMoveBottom,.monaco-editor.draggingUnchangedRegion.canMoveTop.canMoveBottom *{cursor:ns-resize!important}.monaco-editor .diff-hidden-lines .top{transform:translateY(4px)}.monaco-editor .diff-hidden-lines .bottom{transform:translateY(-6px)}.monaco-editor .diff-unchanged-lines{background:var(--vscode-diffEditor-unchangedCodeBackground)}.monaco-editor .noModificationsOverlay{align-items:center;background:var(--vscode-editor-background);display:flex;justify-content:center;z-index:1}.monaco-editor .diff-hidden-lines .center{background:var(--vscode-diffEditor-unchangedRegionBackground);box-shadow:inset 0 -5px 5px -7px var(--vscode-diffEditor-unchangedRegionShadow),inset 0 5px 5px -7px var(--vscode-diffEditor-unchangedRegionShadow);color:var(--vscode-diffEditor-unchangedRegionForeground);display:block;height:24px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.monaco-editor .diff-hidden-lines .center span.codicon{vertical-align:middle}.monaco-editor .diff-hidden-lines .center a:hover .codicon{color:var(--vscode-editorLink-activeForeground)!important;cursor:pointer}.monaco-editor .diff-hidden-lines div.breadcrumb-item{cursor:pointer}.monaco-editor .diff-hidden-lines div.breadcrumb-item:hover{color:var(--vscode-editorLink-activeForeground)}.monaco-editor .movedModified,.monaco-editor .movedOriginal{border:2px solid var(--vscode-diffEditor-move-border)}.monaco-editor .movedModified.currentMove,.monaco-editor .movedOriginal.currentMove{border:2px solid var(--vscode-diffEditor-moveActive-border)}.monaco-diff-editor .moved-blocks-lines path.currentMove{stroke:var(--vscode-diffEditor-moveActive-border)}.monaco-diff-editor .moved-blocks-lines path{pointer-events:visiblestroke}.monaco-diff-editor .moved-blocks-lines .arrow{fill:var(--vscode-diffEditor-move-border)}.monaco-diff-editor .moved-blocks-lines .arrow.currentMove{fill:var(--vscode-diffEditor-moveActive-border)}.monaco-diff-editor .moved-blocks-lines .arrow-rectangle{fill:var(--vscode-editor-background)}.monaco-diff-editor .moved-blocks-lines{pointer-events:none;position:absolute}.monaco-diff-editor .moved-blocks-lines path{fill:none;stroke:var(--vscode-diffEditor-move-border);stroke-width:2}.monaco-editor .char-delete.diff-range-empty{border-left:3px solid var(--vscode-diffEditor-removedTextBackground);margin-left:-1px}.monaco-editor .char-insert.diff-range-empty{border-left:3px solid var(--vscode-diffEditor-insertedTextBackground)}.monaco-editor .fold-unchanged{cursor:pointer}.monaco-diff-editor .diff-moved-code-block{display:flex;justify-content:flex-end;margin-top:-4px}.monaco-diff-editor .diff-moved-code-block .action-bar .action-label.codicon{font-size:12px;height:12px;width:12px}.monaco-diff-editor .diffOverview{z-index:9}.monaco-diff-editor .diffOverview .diffViewport{z-index:10}.monaco-diff-editor.vs			.diffOverview{background:rgba(0,0,0,.03)}.monaco-diff-editor.vs-dark		.diffOverview{background:hsla(0,0%,100%,.01)}.monaco-scrollable-element.modified-in-monaco-diff-editor.vs		.scrollbar,.monaco-scrollable-element.modified-in-monaco-diff-editor.vs-dark	.scrollbar{background:transparent}.monaco-scrollable-element.modified-in-monaco-diff-editor.hc-black	.scrollbar,.monaco-scrollable-element.modified-in-monaco-diff-editor.hc-light	.scrollbar{background:none}.monaco-scrollable-element.modified-in-monaco-diff-editor .slider{z-index:10}.modified-in-monaco-diff-editor				.slider.active{background:hsla(0,0%,67%,.4)}.modified-in-monaco-diff-editor.hc-black	.slider.active,.modified-in-monaco-diff-editor.hc-light	.slider.active{background:none}.monaco-diff-editor .delete-sign,.monaco-diff-editor .insert-sign,.monaco-editor .delete-sign,.monaco-editor .insert-sign{align-items:center;display:flex!important;font-size:11px!important;opacity:.7!important}.monaco-diff-editor.hc-black .delete-sign,.monaco-diff-editor.hc-black .insert-sign,.monaco-diff-editor.hc-light .delete-sign,.monaco-diff-editor.hc-light .insert-sign,.monaco-editor.hc-black .delete-sign,.monaco-editor.hc-black .insert-sign,.monaco-editor.hc-light .delete-sign,.monaco-editor.hc-light .insert-sign{opacity:1}.monaco-editor .inline-added-margin-view-zone,.monaco-editor .inline-deleted-margin-view-zone{text-align:right}.monaco-editor .arrow-revert-change{position:absolute;z-index:10}.monaco-editor .arrow-revert-change:hover{cursor:pointer}.monaco-editor .view-zones .view-lines .view-line span{display:inline-block}.monaco-editor .margin-view-zones .lightbulb-glyph:hover{cursor:pointer}.monaco-diff-editor .char-insert,.monaco-editor .char-insert{background-color:var(--vscode-diffEditor-insertedTextBackground)}.monaco-diff-editor .line-insert,.monaco-editor .line-insert{background-color:var(--vscode-diffEditor-insertedLineBackground,var(--vscode-diffEditor-insertedTextBackground))}.monaco-editor .char-insert,.monaco-editor .line-insert{border:1px solid var(--vscode-diffEditor-insertedTextBorder);box-sizing:border-box}.monaco-editor.hc-black .char-insert,.monaco-editor.hc-black .line-insert,.monaco-editor.hc-light .char-insert,.monaco-editor.hc-light .line-insert{border-style:dashed}.monaco-editor .char-delete,.monaco-editor .line-delete{border:1px solid var(--vscode-diffEditor-removedTextBorder);box-sizing:border-box}.monaco-editor.hc-black .char-delete,.monaco-editor.hc-black .line-delete,.monaco-editor.hc-light .char-delete,.monaco-editor.hc-light .line-delete{border-style:dashed}.monaco-diff-editor .gutter-insert,.monaco-editor .gutter-insert,.monaco-editor .inline-added-margin-view-zone{background-color:var(--vscode-diffEditorGutter-insertedLineBackground,var(--vscode-diffEditor-insertedLineBackground),var(--vscode-diffEditor-insertedTextBackground))}.monaco-diff-editor .char-delete,.monaco-editor .char-delete{background-color:var(--vscode-diffEditor-removedTextBackground)}.monaco-diff-editor .line-delete,.monaco-editor .line-delete{background-color:var(--vscode-diffEditor-removedLineBackground,var(--vscode-diffEditor-removedTextBackground))}.monaco-diff-editor .gutter-delete,.monaco-editor .gutter-delete,.monaco-editor .inline-deleted-margin-view-zone{background-color:var(--vscode-diffEditorGutter-removedLineBackground,var(--vscode-diffEditor-removedLineBackground),var(--vscode-diffEditor-removedTextBackground))}.monaco-diff-editor.side-by-side .editor.modified{border-left:1px solid var(--vscode-diffEditor-border);box-shadow:-6px 0 5px -5px var(--vscode-scrollbar-shadow)}.monaco-diff-editor .diffViewport{background:var(--vscode-scrollbarSlider-background)}.monaco-diff-editor .diffViewport:hover{background:var(--vscode-scrollbarSlider-hoverBackground)}.monaco-diff-editor .diffViewport:active{background:var(--vscode-scrollbarSlider-activeBackground)}.monaco-editor .diagonal-fill{background-image:linear-gradient(-45deg,var(--vscode-diffEditor-diagonalFill) 12.5%,#0000 12.5%,#0000 50%,var(--vscode-diffEditor-diagonalFill) 50%,var(--vscode-diffEditor-diagonalFill) 62.5%,#0000 62.5%,#0000 100%);background-size:8px 8px}.monaco-workbench .workbench-hover{background:var(--vscode-editorHoverWidget-background);border:1px solid var(--vscode-editorHoverWidget-border);border-radius:3px;box-shadow:0 2px 8px var(--vscode-widget-shadow);color:var(--vscode-editorHoverWidget-foreground);font-size:13px;line-height:19px;max-width:700px;overflow:hidden;position:relative;z-index:40}.monaco-workbench .workbench-hover hr{border-bottom:none}.monaco-workbench .workbench-hover:not(.skip-fade-in){animation:fadein .1s linear}.monaco-workbench .workbench-hover.compact{font-size:12px}.monaco-workbench .workbench-hover.compact .hover-contents{padding:2px 8px}.monaco-workbench .workbench-hover-container.locked .workbench-hover{outline:1px solid var(--vscode-editorHoverWidget-border)}.monaco-workbench .workbench-hover-container.locked .workbench-hover:focus,.monaco-workbench .workbench-hover-lock:focus{outline:1px solid var(--vscode-focusBorder)}.monaco-workbench .workbench-hover-container.locked .workbench-hover-lock:hover{background:var(--vscode-toolbar-hoverBackground)}.monaco-workbench .workbench-hover-pointer{pointer-events:none;position:absolute;z-index:41}.monaco-workbench .workbench-hover-pointer:after{background-color:var(--vscode-editorHoverWidget-background);border-bottom:1px solid var(--vscode-editorHoverWidget-border);border-right:1px solid var(--vscode-editorHoverWidget-border);content:"";height:5px;position:absolute;width:5px}.monaco-workbench .locked .workbench-hover-pointer:after{border-bottom-width:2px;border-right-width:2px;height:4px;width:4px}.monaco-workbench .workbench-hover-pointer.left{left:-3px}.monaco-workbench .workbench-hover-pointer.right{right:3px}.monaco-workbench .workbench-hover-pointer.top{top:-3px}.monaco-workbench .workbench-hover-pointer.bottom{bottom:3px}.monaco-workbench .workbench-hover-pointer.left:after{transform:rotate(135deg)}.monaco-workbench .workbench-hover-pointer.right:after{transform:rotate(315deg)}.monaco-workbench .workbench-hover-pointer.top:after{transform:rotate(225deg)}.monaco-workbench .workbench-hover-pointer.bottom:after{transform:rotate(45deg)}.monaco-workbench .workbench-hover a{color:var(--vscode-textLink-foreground)}.monaco-workbench .workbench-hover a:focus{outline:1px solid;outline-color:var(--vscode-focusBorder);outline-offset:-1px;text-decoration:underline}.monaco-workbench .workbench-hover a:active,.monaco-workbench .workbench-hover a:hover{color:var(--vscode-textLink-activeForeground)}.monaco-workbench .workbench-hover code{background:var(--vscode-textCodeBlock-background)}.monaco-workbench .workbench-hover .hover-row .actions{background:var(--vscode-editorHoverWidget-statusBarBackground)}.monaco-workbench .workbench-hover.right-aligned{left:1px}.monaco-workbench .workbench-hover.right-aligned .hover-row.status-bar .actions{flex-direction:row-reverse}.monaco-workbench .workbench-hover.right-aligned .hover-row.status-bar .actions .action-container{margin-left:16px;margin-right:0}.monaco-editor .rendered-markdown kbd{background-color:var(--vscode-keybindingLabel-background);border-color:var(--vscode-keybindingLabel-border);border-bottom-color:var(--vscode-keybindingLabel-bottomBorder);border-radius:3px;border-style:solid;border-width:1px;box-shadow:inset 0 -1px 0 var(--vscode-widget-shadow);color:var(--vscode-keybindingLabel-foreground);padding:1px 3px;vertical-align:middle}.rendered-markdown li:has(input[type=checkbox]){list-style-type:none}::-ms-clear{display:none}.monaco-editor .editor-widget input{color:inherit}.monaco-editor{overflow:visible;position:relative;-webkit-text-size-adjust:100%;color:var(--vscode-editor-foreground)}.monaco-editor,.monaco-editor-background{background-color:var(--vscode-editor-background)}.monaco-editor .rangeHighlight{background-color:var(--vscode-editor-rangeHighlightBackground);border:1px solid var(--vscode-editor-rangeHighlightBorder);box-sizing:border-box}.monaco-editor.hc-black .rangeHighlight,.monaco-editor.hc-light .rangeHighlight{border-style:dotted}.monaco-editor .symbolHighlight{background-color:var(--vscode-editor-symbolHighlightBackground);border:1px solid var(--vscode-editor-symbolHighlightBorder);box-sizing:border-box}.monaco-editor.hc-black .symbolHighlight,.monaco-editor.hc-light .symbolHighlight{border-style:dotted}.monaco-editor .overflow-guard{overflow:hidden;position:relative}.monaco-editor .view-overlays{position:absolute;top:0}.monaco-editor .squiggly-error{border-bottom:4px double var(--vscode-editorError-border)}.monaco-editor .squiggly-error:before{background:var(--vscode-editorError-background);content:"";display:block;height:100%;width:100%}.monaco-editor .squiggly-warning{border-bottom:4px double var(--vscode-editorWarning-border)}.monaco-editor .squiggly-warning:before{background:var(--vscode-editorWarning-background);content:"";display:block;height:100%;width:100%}.monaco-editor .squiggly-info{border-bottom:4px double var(--vscode-editorInfo-border)}.monaco-editor .squiggly-info:before{background:var(--vscode-editorInfo-background);content:"";display:block;height:100%;width:100%}.monaco-editor .squiggly-hint{border-bottom:2px dotted var(--vscode-editorHint-border)}.monaco-editor.showUnused .squiggly-unnecessary{border-bottom:2px dashed var(--vscode-editorUnnecessaryCode-border)}.monaco-editor.showDeprecated .squiggly-inline-deprecated{text-decoration:line-through;text-decoration-color:var(--vscode-editor-foreground,inherit)}.monaco-component.multiDiffEditor{background:var(--vscode-multiDiffEditor-background);overflow-y:hidden}.monaco-component.multiDiffEditor .focused{--vscode-multiDiffEditor-border:var(--vscode-focusBorder)}.monaco-component.multiDiffEditor .multiDiffEntry{display:flex;flex:1;flex-direction:column;overflow:hidden}.monaco-component.multiDiffEditor .multiDiffEntry .collapse-button{cursor:pointer;margin:0 5px}.monaco-component.multiDiffEditor .multiDiffEntry .collapse-button a{display:block}.monaco-component.multiDiffEditor .multiDiffEntry .header{background:var(--vscode-editor-background);z-index:1000}.monaco-component.multiDiffEditor .multiDiffEntry .header:not(.collapsed) .header-content{border-bottom:1px solid var(--vscode-sideBarSectionHeader-border)}.monaco-component.multiDiffEditor .multiDiffEntry .header .header-content{align-items:center;background:var(--vscode-multiDiffEditor-headerBackground);border-left:1px solid var(--vscode-multiDiffEditor-border);border-right:1px solid var(--vscode-multiDiffEditor-border);border-top:1px solid var(--vscode-multiDiffEditor-border);border-top-left-radius:2px;border-top-right-radius:2px;color:var(--vscode-foreground);display:flex;margin:8px 8px 0;padding:8px 5px}.monaco-component.multiDiffEditor .multiDiffEntry .header .header-content.shadow{box-shadow:var(--vscode-scrollbar-shadow) 0 6px 6px -6px}.monaco-component.multiDiffEditor .multiDiffEntry .header .header-content .file-path{display:flex;flex:1;min-width:0}.monaco-component.multiDiffEditor .multiDiffEntry .header .header-content .file-path .title{font-size:14px;line-height:22px}.monaco-component.multiDiffEditor .multiDiffEntry .header .header-content .file-path .title.original{flex:1;min-width:0;text-overflow:ellipsis}.monaco-component.multiDiffEditor .multiDiffEntry .header .header-content .file-path .status{font-weight:600;line-height:22px;margin:0 10px;opacity:.75}.monaco-component.multiDiffEditor .multiDiffEntry .header .header-content .actions{padding:0 8px}.monaco-component.multiDiffEditor .multiDiffEntry .editorParent{border-bottom:1px solid var(--vscode-multiDiffEditor-border);border-left:1px solid var(--vscode-multiDiffEditor-border);border-radius:2px;border-right:1px solid var(--vscode-multiDiffEditor-border);display:flex;flex:1;flex-direction:column;margin-left:8px;margin-right:8px;overflow:hidden}.monaco-component.multiDiffEditor .multiDiffEntry .editorContainer{flex:1}.monaco-editor .selection-anchor{background-color:#007acc;width:2px!important}.monaco-editor .bracket-match{background-color:var(--vscode-editorBracketMatch-background);border:1px solid var(--vscode-editorBracketMatch-border);box-sizing:border-box}.monaco-editor .lightBulbWidget{align-items:center;display:flex;justify-content:center}.monaco-editor .lightBulbWidget:hover{cursor:pointer}.monaco-editor .lightBulbWidget.codicon-light-bulb,.monaco-editor .lightBulbWidget.codicon-lightbulb-sparkle{color:var(--vscode-editorLightBulb-foreground)}.monaco-editor .lightBulbWidget.codicon-lightbulb-autofix,.monaco-editor .lightBulbWidget.codicon-lightbulb-sparkle-autofix{color:var(--vscode-editorLightBulbAutoFix-foreground,var(--vscode-editorLightBulb-foreground))}.monaco-editor .lightBulbWidget.codicon-sparkle-filled{color:var(--vscode-editorLightBulbAi-foreground,var(--vscode-icon-foreground))}.monaco-editor .lightBulbWidget:before{position:relative;z-index:2}.monaco-editor .lightBulbWidget:after{background-color:var(--vscode-editor-background);content:"";display:block;height:100%;left:0;opacity:.3;position:absolute;top:0;width:100%;z-index:1}.monaco-editor .codelens-decoration{color:var(--vscode-editorCodeLens-foreground);display:inline-block;font-family:var(--vscode-editorCodeLens-fontFamily),var(--vscode-editorCodeLens-fontFamilyDefault);font-feature-settings:var(--vscode-editorCodeLens-fontFeatureSettings);font-size:var(--vscode-editorCodeLens-fontSize);line-height:var(--vscode-editorCodeLens-lineHeight);overflow:hidden;padding-right:calc(var(--vscode-editorCodeLens-fontSize)*.5);text-overflow:ellipsis;white-space:nowrap}.monaco-editor .codelens-decoration>a,.monaco-editor .codelens-decoration>span{user-select:none;-webkit-user-select:none;vertical-align:sub;white-space:nowrap}.monaco-editor .codelens-decoration>a{text-decoration:none}.monaco-editor .codelens-decoration>a:hover{cursor:pointer}.monaco-editor .codelens-decoration>a:hover,.monaco-editor .codelens-decoration>a:hover .codicon{color:var(--vscode-editorLink-activeForeground)!important}.monaco-editor .codelens-decoration .codicon{color:currentColor!important;color:var(--vscode-editorCodeLens-foreground);font-size:var(--vscode-editorCodeLens-fontSize);line-height:var(--vscode-editorCodeLens-lineHeight);vertical-align:middle}.monaco-editor .codelens-decoration>a:hover .codicon:before{cursor:pointer}@keyframes fadein{0%{opacity:0;visibility:visible}to{opacity:1}}.monaco-editor .codelens-decoration.fadein{animation:fadein .1s linear}.colorpicker-widget{height:190px;user-select:none;-webkit-user-select:none}.colorpicker-color-decoration,.hc-light .colorpicker-color-decoration{border:.1em solid #000;box-sizing:border-box;cursor:pointer;display:inline-block;height:.8em;line-height:.8em;margin:.1em .2em 0;width:.8em}.hc-black .colorpicker-color-decoration,.vs-dark .colorpicker-color-decoration{border:.1em solid #eee}.colorpicker-header{background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAZdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuMTZEaa/1AAAAHUlEQVQYV2PYvXu3JAi7uLiAMaYAjAGTQBPYLQkAa/0Zef3qRswAAAAASUVORK5CYII=);background-size:9px 9px;display:flex;height:24px;image-rendering:pixelated;position:relative}.colorpicker-header .picked-color{align-items:center;color:#fff;cursor:pointer;display:flex;flex:1;justify-content:center;line-height:24px;overflow:hidden;white-space:nowrap;width:240px}.colorpicker-header .picked-color .picked-color-presentation{margin-left:5px;margin-right:5px;white-space:nowrap}.colorpicker-header .picked-color .codicon{color:inherit;font-size:14px}.colorpicker-header .picked-color.light{color:#000}.colorpicker-header .original-color{cursor:pointer;width:74px;z-index:inherit}.standalone-colorpicker{background-color:var(--vscode-editorHoverWidget-background);border:1px solid var(--vscode-editorHoverWidget-border);color:var(--vscode-editorHoverWidget-foreground)}.colorpicker-header.standalone-colorpicker{border-bottom:none}.colorpicker-header .close-button{background-color:var(--vscode-editorHoverWidget-background);border-left:1px solid var(--vscode-editorHoverWidget-border);cursor:pointer}.colorpicker-header .close-button-inner-div{height:100%;text-align:center;width:100%}.colorpicker-header .close-button-inner-div:hover{background-color:var(--vscode-toolbar-hoverBackground)}.colorpicker-header .close-icon{padding:3px}.colorpicker-body{display:flex;padding:8px;position:relative}.colorpicker-body .saturation-wrap{flex:1;height:150px;min-width:220px;overflow:hidden;position:relative}.colorpicker-body .saturation-box{height:150px;position:absolute}.colorpicker-body .saturation-selection{border:1px solid #fff;border-radius:100%;box-shadow:0 0 2px rgba(0,0,0,.8);height:9px;margin:-5px 0 0 -5px;position:absolute;width:9px}.colorpicker-body .strip{height:150px;width:25px}.colorpicker-body .standalone-strip{height:122px;width:25px}.colorpicker-body .hue-strip{background:linear-gradient(180deg,red 0,#ff0 17%,#0f0 33%,#0ff 50%,#00f 67%,#f0f 83%,red);cursor:grab;margin-left:8px;position:relative}.colorpicker-body .opacity-strip{background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAZdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuMTZEaa/1AAAAHUlEQVQYV2PYvXu3JAi7uLiAMaYAjAGTQBPYLQkAa/0Zef3qRswAAAAASUVORK5CYII=);background-size:9px 9px;cursor:grab;image-rendering:pixelated;margin-left:8px;position:relative}.colorpicker-body .strip.grabbing{cursor:grabbing}.colorpicker-body .slider{border:1px solid hsla(0,0%,100%,.71);box-shadow:0 0 1px rgba(0,0,0,.85);box-sizing:border-box;height:4px;left:-2px;position:absolute;top:0;width:calc(100% + 4px)}.colorpicker-body .strip .overlay{height:150px;pointer-events:none}.colorpicker-body .standalone-strip .standalone-overlay{height:122px;pointer-events:none}.standalone-colorpicker-body{border:1px solid transparent;border-bottom:1px solid var(--vscode-editorHoverWidget-border);display:block;overflow:hidden}.colorpicker-body .insert-button{background:var(--vscode-button-background);border:none;border-radius:2px;bottom:8px;color:var(--vscode-button-foreground);cursor:pointer;height:20px;padding:0;position:absolute;right:8px;width:58px}.colorpicker-body .insert-button:hover{background:var(--vscode-button-hoverBackground)}.monaco-editor.hc-light .dnd-target,.monaco-editor.vs .dnd-target{border-right:2px dotted #000;color:#fff}.monaco-editor.vs-dark .dnd-target{border-right:2px dotted #aeafad;color:#51504f}.monaco-editor.hc-black .dnd-target{border-right:2px dotted #fff;color:#000}.monaco-editor.hc-black.mac.mouse-default .view-lines,.monaco-editor.hc-light.mac.mouse-default .view-lines,.monaco-editor.mouse-default .view-lines,.monaco-editor.vs-dark.mac.mouse-default .view-lines{cursor:default}.monaco-editor.hc-black.mac.mouse-copy .view-lines,.monaco-editor.hc-light.mac.mouse-copy .view-lines,.monaco-editor.mouse-copy .view-lines,.monaco-editor.vs-dark.mac.mouse-copy .view-lines{cursor:copy}.post-edit-widget{background-color:var(--vscode-editorWidget-background);border:1px solid var(--vscode-widget-border,transparent);border-radius:4px;box-shadow:0 0 8px 2px var(--vscode-widget-shadow);overflow:hidden}.post-edit-widget .monaco-button{border:none;border-radius:0;padding:2px}.post-edit-widget .monaco-button:hover{background-color:var(--vscode-button-secondaryHoverBackground)!important}.post-edit-widget .monaco-button .codicon{margin:0}.monaco-editor .findOptionsWidget{border:2px solid var(--vscode-contrastBorder)}.monaco-editor .find-widget,.monaco-editor .findOptionsWidget{background-color:var(--vscode-editorWidget-background);box-shadow:0 0 8px 2px var(--vscode-widget-shadow);color:var(--vscode-editorWidget-foreground)}.monaco-editor .find-widget{border-bottom:1px solid var(--vscode-widget-border);border-bottom-left-radius:4px;border-bottom-right-radius:4px;border-left:1px solid var(--vscode-widget-border);border-right:1px solid var(--vscode-widget-border);box-sizing:border-box;height:33px;line-height:19px;overflow:hidden;padding:0 4px;position:absolute;transform:translateY(calc(-100% - 10px));transition:transform .2s linear;z-index:35}.monaco-workbench.reduce-motion .monaco-editor .find-widget{transition:transform 0ms linear}.monaco-editor .find-widget textarea{margin:0}.monaco-editor .find-widget.hiddenEditor{display:none}.monaco-editor .find-widget.replaceToggled>.replace-part{display:flex}.monaco-editor .find-widget.visible{transform:translateY(0)}.monaco-editor .find-widget .monaco-inputbox.synthetic-focus{outline:1px solid -webkit-focus-ring-color;outline-color:var(--vscode-focusBorder);outline-offset:-1px}.monaco-editor .find-widget .monaco-inputbox .input{background-color:transparent;min-height:0}.monaco-editor .find-widget .monaco-findInput .input{font-size:13px}.monaco-editor .find-widget>.find-part,.monaco-editor .find-widget>.replace-part{display:flex;font-size:12px;margin:3px 25px 0 17px}.monaco-editor .find-widget>.find-part .monaco-inputbox,.monaco-editor .find-widget>.replace-part .monaco-inputbox{min-height:25px}.monaco-editor .find-widget>.replace-part .monaco-inputbox>.ibwrapper>.mirror{padding-right:22px}.monaco-editor .find-widget>.find-part .monaco-inputbox>.ibwrapper>.input,.monaco-editor .find-widget>.find-part .monaco-inputbox>.ibwrapper>.mirror,.monaco-editor .find-widget>.replace-part .monaco-inputbox>.ibwrapper>.input,.monaco-editor .find-widget>.replace-part .monaco-inputbox>.ibwrapper>.mirror{padding-bottom:2px;padding-top:2px}.monaco-editor .find-widget>.find-part .find-actions,.monaco-editor .find-widget>.replace-part .replace-actions{align-items:center;display:flex;height:25px}.monaco-editor .find-widget .monaco-findInput{display:flex;flex:1;vertical-align:middle}.monaco-editor .find-widget .monaco-findInput .monaco-scrollable-element{width:100%}.monaco-editor .find-widget .monaco-findInput .monaco-scrollable-element .scrollbar.vertical{opacity:0}.monaco-editor .find-widget .matchesCount{box-sizing:border-box;display:flex;flex:initial;height:25px;line-height:23px;margin:0 0 0 3px;padding:2px 0 0 2px;text-align:center;vertical-align:middle}.monaco-editor .find-widget .button{align-items:center;background-position:50%;background-repeat:no-repeat;border-radius:5px;cursor:pointer;display:flex;flex:initial;height:16px;justify-content:center;margin-left:3px;padding:3px;width:16px}.monaco-editor .find-widget .codicon-find-selection{border-radius:5px;height:22px;padding:3px;width:22px}.monaco-editor .find-widget .button.left{margin-left:0;margin-right:3px}.monaco-editor .find-widget .button.wide{padding:1px 6px;top:-1px;width:auto}.monaco-editor .find-widget .button.toggle{border-radius:0;box-sizing:border-box;height:100%;left:3px;position:absolute;top:0;width:18px}.monaco-editor .find-widget .button.toggle.disabled{display:none}.monaco-editor .find-widget .disabled{color:var(--vscode-disabledForeground);cursor:default}.monaco-editor .find-widget>.replace-part{display:none}.monaco-editor .find-widget>.replace-part>.monaco-findInput{display:flex;flex:auto;flex-grow:0;flex-shrink:0;position:relative;vertical-align:middle}.monaco-editor .find-widget>.replace-part>.monaco-findInput>.controls{position:absolute;right:2px;top:3px}.monaco-editor .find-widget.reduced-find-widget .matchesCount{display:none}.monaco-editor .find-widget.narrow-find-widget{max-width:257px!important}.monaco-editor .find-widget.collapsed-find-widget{max-width:170px!important}.monaco-editor .find-widget.collapsed-find-widget .button.next,.monaco-editor .find-widget.collapsed-find-widget .button.previous,.monaco-editor .find-widget.collapsed-find-widget .button.replace,.monaco-editor .find-widget.collapsed-find-widget .button.replace-all,.monaco-editor .find-widget.collapsed-find-widget>.find-part .monaco-findInput .controls{display:none}.monaco-editor .find-widget.no-results .matchesCount{color:var(--vscode-errorForeground)}.monaco-editor .findMatch{animation-duration:0;animation-name:inherit!important;background-color:var(--vscode-editor-findMatchHighlightBackground)}.monaco-editor .currentFindMatch{background-color:var(--vscode-editor-findMatchBackground);border:2px solid var(--vscode-editor-findMatchBorder);box-sizing:border-box;padding:1px}.monaco-editor .findScope{background-color:var(--vscode-editor-findRangeHighlightBackground)}.monaco-editor .find-widget .monaco-sash{background-color:var(--vscode-editorWidget-resizeBorder,var(--vscode-editorWidget-border));left:0!important}.monaco-editor.hc-black .find-widget .button:before{left:2px;position:relative;top:1px}.monaco-editor .find-widget .button:not(.disabled):hover,.monaco-editor .find-widget .codicon-find-selection:hover{background-color:var(--vscode-toolbar-hoverBackground)!important}.monaco-editor.findMatch{background-color:var(--vscode-editor-findMatchHighlightBackground)}.monaco-editor.currentFindMatch{background-color:var(--vscode-editor-findMatchBackground)}.monaco-editor.findScope{background-color:var(--vscode-editor-findRangeHighlightBackground)}.monaco-editor.findMatch{background-color:var(--vscode-editorWidget-background)}.monaco-editor .find-widget>.button.codicon-widget-close{position:absolute;right:4px;top:5px}.monaco-editor .margin-view-overlays .codicon-folding-collapsed,.monaco-editor .margin-view-overlays .codicon-folding-expanded,.monaco-editor .margin-view-overlays .codicon-folding-manual-collapsed,.monaco-editor .margin-view-overlays .codicon-folding-manual-expanded{align-items:center;cursor:pointer;display:flex;font-size:140%;justify-content:center;margin-left:2px;opacity:0;transition:opacity .5s}.monaco-workbench.reduce-motion .monaco-editor .margin-view-overlays .codicon-folding-collapsed,.monaco-workbench.reduce-motion .monaco-editor .margin-view-overlays .codicon-folding-expanded,.monaco-workbench.reduce-motion .monaco-editor .margin-view-overlays .codicon-folding-manual-collapsed,.monaco-workbench.reduce-motion .monaco-editor .margin-view-overlays .codicon-folding-manual-expanded{transition:initial}.monaco-editor .margin-view-overlays .codicon.alwaysShowFoldIcons,.monaco-editor .margin-view-overlays .codicon.codicon-folding-collapsed,.monaco-editor .margin-view-overlays .codicon.codicon-folding-manual-collapsed,.monaco-editor .margin-view-overlays:hover .codicon{opacity:1}.monaco-editor .inline-folded:after{color:grey;content:"\\22EF";cursor:pointer;display:inline;line-height:1em;margin:.1em .2em 0}.monaco-editor .folded-background{background-color:var(--vscode-editor-foldBackground)}.monaco-editor .cldr.codicon.codicon-folding-collapsed,.monaco-editor .cldr.codicon.codicon-folding-expanded,.monaco-editor .cldr.codicon.codicon-folding-manual-collapsed,.monaco-editor .cldr.codicon.codicon-folding-manual-expanded{color:var(--vscode-editorGutter-foldingControlForeground)!important}.monaco-editor .peekview-widget .head .peekview-title .severity-icon{display:inline-block;margin-right:4px;vertical-align:text-top}.monaco-editor .marker-widget{text-overflow:ellipsis;white-space:nowrap}.monaco-editor .marker-widget>.stale{font-style:italic;opacity:.6}.monaco-editor .marker-widget .title{display:inline-block;padding-right:5px}.monaco-editor .marker-widget .descriptioncontainer{padding:8px 12px 0 20px;position:absolute;user-select:text;-webkit-user-select:text;white-space:pre}.monaco-editor .marker-widget .descriptioncontainer .message{display:flex;flex-direction:column}.monaco-editor .marker-widget .descriptioncontainer .message .details{padding-left:6px}.monaco-editor .marker-widget .descriptioncontainer .message .source,.monaco-editor .marker-widget .descriptioncontainer .message span.code{opacity:.6}.monaco-editor .marker-widget .descriptioncontainer .message a.code-link{color:inherit;opacity:.6}.monaco-editor .marker-widget .descriptioncontainer .message a.code-link:before{content:"("}.monaco-editor .marker-widget .descriptioncontainer .message a.code-link:after{content:")"}.monaco-editor .marker-widget .descriptioncontainer .message a.code-link>span{border-bottom:1px solid transparent;color:var(--vscode-textLink-activeForeground);text-decoration:underline;text-underline-position:under}.monaco-editor .marker-widget .descriptioncontainer .filename{color:var(--vscode-textLink-activeForeground);cursor:pointer}.monaco-editor .goto-definition-link{color:var(--vscode-editorLink-activeForeground)!important;cursor:pointer;text-decoration:underline}.monaco-editor .zone-widget .zone-widget-container.reference-zone-widget{border-bottom-width:1px;border-top-width:1px}.monaco-editor .reference-zone-widget .inline{display:inline-block;vertical-align:top}.monaco-editor .reference-zone-widget .messages{height:100%;padding:3em 0;text-align:center;width:100%}.monaco-editor .reference-zone-widget .ref-tree{background-color:var(--vscode-peekViewResult-background);color:var(--vscode-peekViewResult-lineForeground);line-height:23px}.monaco-editor .reference-zone-widget .ref-tree .reference{overflow:hidden;text-overflow:ellipsis}.monaco-editor .reference-zone-widget .ref-tree .reference-file{color:var(--vscode-peekViewResult-fileForeground);display:inline-flex;height:100%;width:100%}.monaco-editor .reference-zone-widget .ref-tree .monaco-list:focus .selected .reference-file{color:inherit!important}.monaco-editor .reference-zone-widget .ref-tree .monaco-list:focus .monaco-list-rows>.monaco-list-row.selected:not(.highlighted){background-color:var(--vscode-peekViewResult-selectionBackground);color:var(--vscode-peekViewResult-selectionForeground)!important}.monaco-editor .reference-zone-widget .ref-tree .reference-file .count{margin-left:auto;margin-right:12px}.monaco-editor .reference-zone-widget .ref-tree .referenceMatch .highlight{background-color:var(--vscode-peekViewResult-matchHighlightBackground)}.monaco-editor .reference-zone-widget .preview .reference-decoration{background-color:var(--vscode-peekViewEditor-matchHighlightBackground);border:2px solid var(--vscode-peekViewEditor-matchHighlightBorder);box-sizing:border-box}.monaco-editor .reference-zone-widget .preview .monaco-editor .inputarea.ime-input,.monaco-editor .reference-zone-widget .preview .monaco-editor .monaco-editor-background{background-color:var(--vscode-peekViewEditor-background)}.monaco-editor .reference-zone-widget .preview .monaco-editor .margin{background-color:var(--vscode-peekViewEditorGutter-background)}.monaco-editor.hc-black .reference-zone-widget .ref-tree .reference-file,.monaco-editor.hc-light .reference-zone-widget .ref-tree .reference-file{font-weight:700}.monaco-editor.hc-black .reference-zone-widget .ref-tree .referenceMatch .highlight,.monaco-editor.hc-light .reference-zone-widget .ref-tree .referenceMatch .highlight{border:1px dotted var(--vscode-contrastActiveBorder,transparent);box-sizing:border-box}.monaco-editor .hoverHighlight{background-color:var(--vscode-editor-hoverHighlightBackground)}.monaco-editor .monaco-hover{background-color:var(--vscode-editorHoverWidget-background);border:1px solid var(--vscode-editorHoverWidget-border);border-radius:3px;color:var(--vscode-editorHoverWidget-foreground)}.monaco-editor .monaco-hover a{color:var(--vscode-textLink-foreground)}.monaco-editor .monaco-hover a:hover{color:var(--vscode-textLink-activeForeground)}.monaco-editor .monaco-hover .hover-row .actions{background-color:var(--vscode-editorHoverWidget-statusBarBackground)}.monaco-editor .monaco-hover code{background-color:var(--vscode-textCodeBlock-background)}.monaco-editor.vs .valueSetReplacement{outline:solid 2px var(--vscode-editorBracketMatch-border)}.monaco-editor .suggest-preview-additional-widget{white-space:nowrap}.monaco-editor .suggest-preview-additional-widget .content-spacer{color:transparent;white-space:pre}.monaco-editor .suggest-preview-additional-widget .button{cursor:pointer;display:inline-block;text-decoration:underline;text-underline-position:under}.monaco-editor .ghost-text-hidden{font-size:0;opacity:0}.monaco-editor .ghost-text-decoration,.monaco-editor .suggest-preview-text .ghost-text{font-style:italic}.monaco-editor .ghost-text-decoration,.monaco-editor .ghost-text-decoration-preview,.monaco-editor .suggest-preview-text .ghost-text{background-color:var(--vscode-editorGhostText-background);border:1px solid var(--vscode-editorGhostText-border);color:var(--vscode-editorGhostText-foreground)!important}.monaco-editor .inlineSuggestionsHints.withBorder{background-color:var(--vscode-editorHoverWidget-background);border:1px solid var(--vscode-editorHoverWidget-border);color:var(--vscode-editorHoverWidget-foreground);z-index:39}.monaco-editor .inlineSuggestionsHints a,.monaco-editor .inlineSuggestionsHints a:hover{color:var(--vscode-foreground)}.monaco-editor .inlineSuggestionsHints .keybinding{display:flex;margin-left:4px;opacity:.6}.monaco-editor .inlineSuggestionsHints .keybinding .monaco-keybinding-key{font-size:8px;padding:2px 3px}.monaco-editor .inlineSuggestionsHints .availableSuggestionCount a{display:flex;justify-content:center;min-width:19px}.monaco-editor .inlineSuggestionStatusBarItemLabel{margin-right:2px}.monaco-editor .inline-edit-remove{background-color:var(--vscode-editorGhostText-background);font-style:italic;text-decoration:line-through}.monaco-editor .inline-edit-remove.backgroundColoring{background-color:var(--vscode-diffEditor-removedLineBackground)}.monaco-editor .inline-edit-hidden{font-size:0;opacity:0}.monaco-editor .inline-edit-decoration,.monaco-editor .suggest-preview-text .inline-edit{font-style:italic}.monaco-editor .inline-completion-text-to-replace{text-decoration:underline;text-underline-position:under}.monaco-editor .inline-edit-decoration,.monaco-editor .inline-edit-decoration-preview,.monaco-editor .suggest-preview-text .inline-edit{background-color:var(--vscode-editorGhostText-background);border:1px solid var(--vscode-editorGhostText-border);color:var(--vscode-editorGhostText-foreground)!important}.monaco-editor .inlineEditHints.withBorder{background-color:var(--vscode-editorHoverWidget-background);border:1px solid var(--vscode-editorHoverWidget-border);color:var(--vscode-editorHoverWidget-foreground);z-index:39}.monaco-editor .inlineEditHints a,.monaco-editor .inlineEditHints a:hover{color:var(--vscode-foreground)}.monaco-editor .inlineEditHints .keybinding{display:flex;margin-left:4px;opacity:.6}.monaco-editor .inlineEditHints .keybinding .monaco-keybinding-key{font-size:8px;padding:2px 3px}.monaco-editor .inlineEditStatusBarItemLabel{margin-right:2px}.inline-editor-progress-decoration{display:inline-block;height:1em;width:1em}.inline-progress-widget{align-items:center;display:flex!important;justify-content:center}.inline-progress-widget .icon{font-size:80%!important}.inline-progress-widget:hover .icon{animation:none;font-size:90%!important}.inline-progress-widget:hover .icon:before{content:"\\ea76"}.monaco-editor .linked-editing-decoration{background-color:var(--vscode-editor-linkedEditingBackground);min-width:1px}.monaco-editor .detected-link,.monaco-editor .detected-link-active{text-decoration:underline;text-underline-position:under}.monaco-editor .detected-link-active{color:var(--vscode-editorLink-activeForeground)!important;cursor:pointer}.monaco-editor .monaco-editor-overlaymessage{padding-bottom:8px;z-index:10000}.monaco-editor .monaco-editor-overlaymessage.below{padding-bottom:0;padding-top:8px;z-index:10000}@keyframes fadeIn{0%{opacity:0}to{opacity:1}}.monaco-editor .monaco-editor-overlaymessage.fadeIn{animation:fadeIn .15s ease-out}@keyframes fadeOut{0%{opacity:1}to{opacity:0}}.monaco-editor .monaco-editor-overlaymessage.fadeOut{animation:fadeOut .1s ease-out}.monaco-editor .monaco-editor-overlaymessage .message{background-color:var(--vscode-editorHoverWidget-background);border:1px solid var(--vscode-inputValidation-infoBorder);border-radius:3px;color:var(--vscode-editorHoverWidget-foreground);padding:2px 4px}.monaco-editor .monaco-editor-overlaymessage .message p{margin-block:0}.monaco-editor .monaco-editor-overlaymessage .message a{color:var(--vscode-textLink-foreground)}.monaco-editor .monaco-editor-overlaymessage .message a:hover{color:var(--vscode-textLink-activeForeground)}.monaco-editor.hc-black .monaco-editor-overlaymessage .message,.monaco-editor.hc-light .monaco-editor-overlaymessage .message{border-width:2px}.monaco-editor .monaco-editor-overlaymessage .anchor{border:8px solid transparent;height:0!important;left:2px;position:absolute;width:0!important;z-index:1000}.monaco-editor .monaco-editor-overlaymessage .anchor.top{border-bottom-color:var(--vscode-inputValidation-infoBorder)}.monaco-editor .monaco-editor-overlaymessage .anchor.below{border-top-color:var(--vscode-inputValidation-infoBorder)}.monaco-editor .monaco-editor-overlaymessage.below .anchor.below,.monaco-editor .monaco-editor-overlaymessage:not(.below) .anchor.top{display:none}.monaco-editor .monaco-editor-overlaymessage.below .anchor.top{display:inherit;top:-8px}.monaco-editor .parameter-hints-widget{background-color:var(--vscode-editorHoverWidget-background);border:1px solid var(--vscode-editorHoverWidget-border);color:var(--vscode-editorHoverWidget-foreground);cursor:default;display:flex;flex-direction:column;line-height:1.5em;z-index:39}.hc-black .monaco-editor .parameter-hints-widget,.hc-light .monaco-editor .parameter-hints-widget{border-width:2px}.monaco-editor .parameter-hints-widget>.phwrapper{display:flex;flex-direction:row;max-width:440px}.monaco-editor .parameter-hints-widget.multiple{min-height:3.3em;padding:0}.monaco-editor .parameter-hints-widget.multiple .body:before{border-left:1px solid var(--vscode-editorHoverWidget-border);content:"";display:block;height:100%;opacity:.5;position:absolute}.monaco-editor .parameter-hints-widget p,.monaco-editor .parameter-hints-widget ul{margin:8px 0}.monaco-editor .parameter-hints-widget .body,.monaco-editor .parameter-hints-widget .monaco-scrollable-element{display:flex;flex:1;flex-direction:column;min-height:100%}.monaco-editor .parameter-hints-widget .signature{padding:4px 5px;position:relative}.monaco-editor .parameter-hints-widget .signature.has-docs:after{border-bottom:1px solid var(--vscode-editorHoverWidget-border);content:"";display:block;left:0;opacity:.5;padding-top:4px;position:absolute;width:100%}.monaco-editor .parameter-hints-widget .docs{padding:0 10px 0 5px;white-space:pre-wrap}.monaco-editor .parameter-hints-widget .docs.empty{display:none}.monaco-editor .parameter-hints-widget .docs a{color:var(--vscode-textLink-foreground)}.monaco-editor .parameter-hints-widget .docs a:hover{color:var(--vscode-textLink-activeForeground);cursor:pointer}.monaco-editor .parameter-hints-widget .docs .markdown-docs{white-space:normal}.monaco-editor .parameter-hints-widget .docs code{background-color:var(--vscode-textCodeBlock-background);border-radius:3px;font-family:var(--monaco-monospace-font);padding:0 .4em}.monaco-editor .parameter-hints-widget .docs .code,.monaco-editor .parameter-hints-widget .docs .monaco-tokenized-source{white-space:pre-wrap}.monaco-editor .parameter-hints-widget .controls{align-items:center;display:none;flex-direction:column;justify-content:flex-end;min-width:22px}.monaco-editor .parameter-hints-widget.multiple .controls{display:flex;padding:0 2px}.monaco-editor .parameter-hints-widget.multiple .button{background-repeat:no-repeat;cursor:pointer;height:16px;width:16px}.monaco-editor .parameter-hints-widget .button.previous{bottom:24px}.monaco-editor .parameter-hints-widget .overloads{font-family:var(--monaco-monospace-font);height:12px;line-height:12px;text-align:center}.monaco-editor .parameter-hints-widget .signature .parameter.active{color:var(--vscode-editorHoverWidget-highlightForeground);font-weight:700}.monaco-editor .parameter-hints-widget .documentation-parameter>.parameter{font-weight:700;margin-right:.5em}.monaco-editor .peekview-widget .head{box-sizing:border-box;display:flex;flex-wrap:nowrap;justify-content:space-between}.monaco-editor .peekview-widget .head .peekview-title{align-items:baseline;display:flex;font-size:13px;margin-left:20px;min-width:0;overflow:hidden;text-overflow:ellipsis}.monaco-editor .peekview-widget .head .peekview-title.clickable{cursor:pointer}.monaco-editor .peekview-widget .head .peekview-title .dirname:not(:empty){font-size:.9em;margin-left:.5em}.monaco-editor .peekview-widget .head .peekview-title .dirname,.monaco-editor .peekview-widget .head .peekview-title .filename,.monaco-editor .peekview-widget .head .peekview-title .meta{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.monaco-editor .peekview-widget .head .peekview-title .meta:not(:empty):before{content:"-";padding:0 .3em}.monaco-editor .peekview-widget .head .peekview-actions{flex:1;padding-right:2px;text-align:right}.monaco-editor .peekview-widget .head .peekview-actions>.monaco-action-bar{display:inline-block}.monaco-editor .peekview-widget .head .peekview-actions>.monaco-action-bar,.monaco-editor .peekview-widget .head .peekview-actions>.monaco-action-bar>.actions-container{height:100%}.monaco-editor .peekview-widget>.body{border-top:1px solid;position:relative}.monaco-editor .peekview-widget .head .peekview-title .codicon{align-self:center;margin-right:4px}.monaco-editor .peekview-widget .monaco-list .monaco-list-row.focused .codicon{color:inherit!important}.monaco-editor .rename-box{border-radius:4px;color:inherit;z-index:100}.monaco-editor .rename-box.preview{padding:4px 4px 0}.monaco-editor .rename-box .rename-input{border-radius:2px;padding:3px;width:calc(100% - 8px)}.monaco-editor .rename-box .rename-label{display:none;opacity:.8}.monaco-editor .rename-box.preview .rename-label{display:inherit}.monaco-editor .snippet-placeholder{background-color:var(--vscode-editor-snippetTabstopHighlightBackground,transparent);min-width:2px;outline-color:var(--vscode-editor-snippetTabstopHighlightBorder,transparent);outline-style:solid;outline-width:1px}.monaco-editor .finish-snippet-placeholder{background-color:var(--vscode-editor-snippetFinalTabstopHighlightBackground,transparent);outline-color:var(--vscode-editor-snippetFinalTabstopHighlightBorder,transparent);outline-style:solid;outline-width:1px}.monaco-editor .sticky-widget{overflow:hidden}.monaco-editor .sticky-widget-line-numbers{background-color:inherit;float:left}.monaco-editor .sticky-widget-lines-scrollable{background-color:inherit;display:inline-block;overflow:hidden;position:absolute;width:var(--vscode-editorStickyScroll-scrollableWidth)}.monaco-editor .sticky-widget-lines{background-color:inherit;position:absolute}.monaco-editor .sticky-line-content,.monaco-editor .sticky-line-number{background-color:inherit;color:var(--vscode-editorLineNumber-foreground);display:inline-block;position:absolute;white-space:nowrap}.monaco-editor .sticky-line-number .codicon-folding-collapsed,.monaco-editor .sticky-line-number .codicon-folding-expanded{float:right;transition:var(--vscode-editorStickyScroll-foldingOpacityTransition)}.monaco-editor .sticky-line-content{background-color:inherit;white-space:nowrap;width:var(--vscode-editorStickyScroll-scrollableWidth)}.monaco-editor .sticky-line-number-inner{display:inline-block;text-align:right}.monaco-editor .sticky-widget{border-bottom:1px solid var(--vscode-editorStickyScroll-border)}.monaco-editor .sticky-line-content:hover{background-color:var(--vscode-editorStickyScrollHover-background);cursor:pointer}.monaco-editor .sticky-widget{background-color:var(--vscode-editorStickyScroll-background);box-shadow:var(--vscode-editorStickyScroll-shadow) 0 3px 2px -2px;width:100%;z-index:4}.monaco-editor .sticky-widget.peek{background-color:var(--vscode-peekViewEditorStickyScroll-background)}.monaco-editor .suggest-widget{border-radius:3px;display:flex;flex-direction:column;width:430px;z-index:40}.monaco-editor .suggest-widget.message{align-items:center;flex-direction:row}.monaco-editor .suggest-details,.monaco-editor .suggest-widget{background-color:var(--vscode-editorSuggestWidget-background);border-color:var(--vscode-editorSuggestWidget-border);border-style:solid;border-width:1px;flex:0 1 auto;width:100%}.monaco-editor.hc-black .suggest-details,.monaco-editor.hc-black .suggest-widget,.monaco-editor.hc-light .suggest-details,.monaco-editor.hc-light .suggest-widget{border-width:2px}.monaco-editor .suggest-widget .suggest-status-bar{border-top:1px solid var(--vscode-editorSuggestWidget-border);box-sizing:border-box;display:none;flex-flow:row nowrap;font-size:80%;justify-content:space-between;overflow:hidden;padding:0 4px;width:100%}.monaco-editor .suggest-widget.with-status-bar .suggest-status-bar{display:flex}.monaco-editor .suggest-widget .suggest-status-bar .left{padding-right:8px}.monaco-editor .suggest-widget.with-status-bar .suggest-status-bar .action-label{color:var(--vscode-editorSuggestWidgetStatus-foreground)}.monaco-editor .suggest-widget.with-status-bar .suggest-status-bar .action-item:not(:last-of-type) .action-label{margin-right:0}.monaco-editor .suggest-widget.with-status-bar .suggest-status-bar .action-item:not(:last-of-type) .action-label:after{content:", ";margin-right:.3em}.monaco-editor .suggest-widget.with-status-bar .monaco-list .monaco-list-row.focused.string-label>.contents>.main>.right>.readMore,.monaco-editor .suggest-widget.with-status-bar .monaco-list .monaco-list-row>.contents>.main>.right>.readMore{display:none}.monaco-editor .suggest-widget.with-status-bar:not(.docs-side) .monaco-list .monaco-list-row:hover>.contents>.main>.right.can-expand-details>.details-label{width:100%}.monaco-editor .suggest-widget>.message{padding-left:22px}.monaco-editor .suggest-widget>.tree{height:100%;width:100%}.monaco-editor .suggest-widget .monaco-list{user-select:none;-webkit-user-select:none}.monaco-editor .suggest-widget .monaco-list .monaco-list-row{background-position:2px 2px;background-repeat:no-repeat;-mox-box-sizing:border-box;box-sizing:border-box;cursor:pointer;display:flex;padding-right:10px;touch-action:none;white-space:nowrap}.monaco-editor .suggest-widget .monaco-list .monaco-list-row.focused{color:var(--vscode-editorSuggestWidget-selectedForeground)}.monaco-editor .suggest-widget .monaco-list .monaco-list-row.focused .codicon{color:var(--vscode-editorSuggestWidget-selectedIconForeground)}.monaco-editor .suggest-widget .monaco-list .monaco-list-row>.contents{flex:1;height:100%;overflow:hidden;padding-left:2px}.monaco-editor .suggest-widget .monaco-list .monaco-list-row>.contents>.main{display:flex;justify-content:space-between;overflow:hidden;text-overflow:ellipsis;white-space:pre}.monaco-editor .suggest-widget .monaco-list .monaco-list-row>.contents>.main>.left,.monaco-editor .suggest-widget .monaco-list .monaco-list-row>.contents>.main>.right{display:flex}.monaco-editor .suggest-widget .monaco-list .monaco-list-row:not(.focused)>.contents>.main .monaco-icon-label{color:var(--vscode-editorSuggestWidget-foreground)}.monaco-editor .suggest-widget:not(.frozen) .monaco-highlighted-label .highlight{font-weight:700}.monaco-editor .suggest-widget .monaco-list .monaco-list-row>.contents>.main .monaco-highlighted-label .highlight{color:var(--vscode-editorSuggestWidget-highlightForeground)}.monaco-editor .suggest-widget .monaco-list .monaco-list-row.focused>.contents>.main .monaco-highlighted-label .highlight{color:var(--vscode-editorSuggestWidget-focusHighlightForeground)}.monaco-editor .suggest-details>.monaco-scrollable-element>.body>.header>.codicon-close,.monaco-editor .suggest-widget .monaco-list .monaco-list-row>.contents>.main>.right>.readMore:before{color:inherit;cursor:pointer;font-size:14px;opacity:1}.monaco-editor .suggest-details>.monaco-scrollable-element>.body>.header>.codicon-close{position:absolute;right:2px;top:6px}.monaco-editor .suggest-details>.monaco-scrollable-element>.body>.header>.codicon-close:hover,.monaco-editor .suggest-widget .monaco-list .monaco-list-row>.contents>.main>.right>.readMore:hover{opacity:1}.monaco-editor .suggest-widget .monaco-list .monaco-list-row>.contents>.main>.right>.details-label{opacity:.7}.monaco-editor .suggest-widget .monaco-list .monaco-list-row>.contents>.main>.left>.signature-label{opacity:.6;overflow:hidden;text-overflow:ellipsis}.monaco-editor .suggest-widget .monaco-list .monaco-list-row>.contents>.main>.left>.qualifier-label{align-self:center;font-size:85%;line-height:normal;margin-left:12px;opacity:.4;overflow:hidden;text-overflow:ellipsis}.monaco-editor .suggest-widget .monaco-list .monaco-list-row>.contents>.main>.right>.details-label{font-size:85%;margin-left:1.1em;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.monaco-editor .suggest-widget .monaco-list .monaco-list-row>.contents>.main>.right>.details-label>.monaco-tokenized-source{display:inline}.monaco-editor .suggest-widget .monaco-list .monaco-list-row>.contents>.main>.right>.details-label{display:none}.monaco-editor .suggest-widget .monaco-list .monaco-list-row:not(.string-label)>.contents>.main>.right>.details-label,.monaco-editor .suggest-widget.docs-side .monaco-list .monaco-list-row.focused:not(.string-label)>.contents>.main>.right>.details-label,.monaco-editor .suggest-widget:not(.shows-details) .monaco-list .monaco-list-row.focused>.contents>.main>.right>.details-label{display:inline}.monaco-editor .suggest-widget:not(.docs-side) .monaco-list .monaco-list-row.focused:hover>.contents>.main>.right.can-expand-details>.details-label{width:calc(100% - 26px)}.monaco-editor .suggest-widget .monaco-list .monaco-list-row>.contents>.main>.left{flex-grow:1;flex-shrink:1;overflow:hidden}.monaco-editor .suggest-widget .monaco-list .monaco-list-row>.contents>.main>.left>.monaco-icon-label{flex-shrink:0}.monaco-editor .suggest-widget .monaco-list .monaco-list-row:not(.string-label)>.contents>.main>.left>.monaco-icon-label{max-width:100%}.monaco-editor .suggest-widget .monaco-list .monaco-list-row.string-label>.contents>.main>.left>.monaco-icon-label{flex-shrink:1}.monaco-editor .suggest-widget .monaco-list .monaco-list-row>.contents>.main>.right{flex-shrink:4;max-width:70%;overflow:hidden}.monaco-editor .suggest-widget .monaco-list .monaco-list-row>.contents>.main>.right>.readMore{display:inline-block;height:18px;position:absolute;right:10px;visibility:hidden;width:18px}.monaco-editor .suggest-widget.docs-side .monaco-list .monaco-list-row>.contents>.main>.right>.readMore{display:none!important}.monaco-editor .suggest-widget .monaco-list .monaco-list-row.string-label>.contents>.main>.right>.readMore{display:none}.monaco-editor .suggest-widget .monaco-list .monaco-list-row.focused.string-label>.contents>.main>.right>.readMore{display:inline-block}.monaco-editor .suggest-widget .monaco-list .monaco-list-row.focused:hover>.contents>.main>.right>.readMore{visibility:visible}.monaco-editor .suggest-widget .monaco-list .monaco-list-row .monaco-icon-label.deprecated{opacity:.66;text-decoration:unset}.monaco-editor .suggest-widget .monaco-list .monaco-list-row .monaco-icon-label.deprecated>.monaco-icon-label-container>.monaco-icon-name-container{text-decoration:line-through}.monaco-editor .suggest-widget .monaco-list .monaco-list-row .monaco-icon-label:before{height:100%}.monaco-editor .suggest-widget .monaco-list .monaco-list-row .icon{background-position:50%;background-repeat:no-repeat;background-size:80%;display:block;height:16px;margin-left:2px;width:16px}.monaco-editor .suggest-widget .monaco-list .monaco-list-row .icon.hide{display:none}.monaco-editor .suggest-widget .monaco-list .monaco-list-row .suggest-icon{align-items:center;display:flex;margin-right:4px}.monaco-editor .suggest-widget.no-icons .monaco-list .monaco-list-row .icon,.monaco-editor .suggest-widget.no-icons .monaco-list .monaco-list-row .suggest-icon:before{display:none}.monaco-editor .suggest-widget .monaco-list .monaco-list-row .icon.customcolor .colorspan{border:.1em solid #000;display:inline-block;height:.7em;margin:0 0 0 .3em;width:.7em}.monaco-editor .suggest-details-container{z-index:41}.monaco-editor .suggest-details{color:var(--vscode-editorSuggestWidget-foreground);cursor:default;display:flex;flex-direction:column}.monaco-editor .suggest-details.focused{border-color:var(--vscode-focusBorder)}.monaco-editor .suggest-details a{color:var(--vscode-textLink-foreground)}.monaco-editor .suggest-details a:hover{color:var(--vscode-textLink-activeForeground)}.monaco-editor .suggest-details code{background-color:var(--vscode-textCodeBlock-background)}.monaco-editor .suggest-details.no-docs{display:none}.monaco-editor .suggest-details>.monaco-scrollable-element{flex:1}.monaco-editor .suggest-details>.monaco-scrollable-element>.body{box-sizing:border-box;height:100%;width:100%}.monaco-editor .suggest-details>.monaco-scrollable-element>.body>.header>.type{flex:2;margin:0 24px 0 0;opacity:.7;overflow:hidden;padding:4px 0 12px 5px;text-overflow:ellipsis;white-space:pre}.monaco-editor .suggest-details>.monaco-scrollable-element>.body>.header>.type.auto-wrap{white-space:normal;word-break:break-all}.monaco-editor .suggest-details>.monaco-scrollable-element>.body>.docs{margin:0;padding:4px 5px;white-space:pre-wrap}.monaco-editor .suggest-details.no-type>.monaco-scrollable-element>.body>.docs{margin-right:24px;overflow:hidden}.monaco-editor .suggest-details>.monaco-scrollable-element>.body>.docs.markdown-docs{min-height:calc(1rem + 8px);padding:0;white-space:normal}.monaco-editor .suggest-details>.monaco-scrollable-element>.body>.docs.markdown-docs>div,.monaco-editor .suggest-details>.monaco-scrollable-element>.body>.docs.markdown-docs>span:not(:empty){padding:4px 5px}.monaco-editor .suggest-details>.monaco-scrollable-element>.body>.docs.markdown-docs>div>p:first-child{margin-top:0}.monaco-editor .suggest-details>.monaco-scrollable-element>.body>.docs.markdown-docs>div>p:last-child{margin-bottom:0}.monaco-editor .suggest-details>.monaco-scrollable-element>.body>.docs.markdown-docs .monaco-tokenized-source{white-space:pre}.monaco-editor .suggest-details>.monaco-scrollable-element>.body>.docs .code{white-space:pre-wrap;word-wrap:break-word}.monaco-editor .suggest-details>.monaco-scrollable-element>.body>.docs.markdown-docs .codicon{vertical-align:sub}.monaco-editor .suggest-details>.monaco-scrollable-element>.body>p:empty{display:none}.monaco-editor .suggest-details code{border-radius:3px;padding:0 .4em}.monaco-editor .suggest-details ol,.monaco-editor .suggest-details ul{padding-left:20px}.monaco-editor .suggest-details p code{font-family:var(--monaco-monospace-font)}.monaco-editor .codicon.codicon-symbol-array,.monaco-workbench .codicon.codicon-symbol-array{color:var(--vscode-symbolIcon-arrayForeground)}.monaco-editor .codicon.codicon-symbol-boolean,.monaco-workbench .codicon.codicon-symbol-boolean{color:var(--vscode-symbolIcon-booleanForeground)}.monaco-editor .codicon.codicon-symbol-class,.monaco-workbench .codicon.codicon-symbol-class{color:var(--vscode-symbolIcon-classForeground)}.monaco-editor .codicon.codicon-symbol-method,.monaco-workbench .codicon.codicon-symbol-method{color:var(--vscode-symbolIcon-methodForeground)}.monaco-editor .codicon.codicon-symbol-color,.monaco-workbench .codicon.codicon-symbol-color{color:var(--vscode-symbolIcon-colorForeground)}.monaco-editor .codicon.codicon-symbol-constant,.monaco-workbench .codicon.codicon-symbol-constant{color:var(--vscode-symbolIcon-constantForeground)}.monaco-editor .codicon.codicon-symbol-constructor,.monaco-workbench .codicon.codicon-symbol-constructor{color:var(--vscode-symbolIcon-constructorForeground)}.monaco-editor .codicon.codicon-symbol-enum,.monaco-editor .codicon.codicon-symbol-value,.monaco-workbench .codicon.codicon-symbol-enum,.monaco-workbench .codicon.codicon-symbol-value{color:var(--vscode-symbolIcon-enumeratorForeground)}.monaco-editor .codicon.codicon-symbol-enum-member,.monaco-workbench .codicon.codicon-symbol-enum-member{color:var(--vscode-symbolIcon-enumeratorMemberForeground)}.monaco-editor .codicon.codicon-symbol-event,.monaco-workbench .codicon.codicon-symbol-event{color:var(--vscode-symbolIcon-eventForeground)}.monaco-editor .codicon.codicon-symbol-field,.monaco-workbench .codicon.codicon-symbol-field{color:var(--vscode-symbolIcon-fieldForeground)}.monaco-editor .codicon.codicon-symbol-file,.monaco-workbench .codicon.codicon-symbol-file{color:var(--vscode-symbolIcon-fileForeground)}.monaco-editor .codicon.codicon-symbol-folder,.monaco-workbench .codicon.codicon-symbol-folder{color:var(--vscode-symbolIcon-folderForeground)}.monaco-editor .codicon.codicon-symbol-function,.monaco-workbench .codicon.codicon-symbol-function{color:var(--vscode-symbolIcon-functionForeground)}.monaco-editor .codicon.codicon-symbol-interface,.monaco-workbench .codicon.codicon-symbol-interface{color:var(--vscode-symbolIcon-interfaceForeground)}.monaco-editor .codicon.codicon-symbol-key,.monaco-workbench .codicon.codicon-symbol-key{color:var(--vscode-symbolIcon-keyForeground)}.monaco-editor .codicon.codicon-symbol-keyword,.monaco-workbench .codicon.codicon-symbol-keyword{color:var(--vscode-symbolIcon-keywordForeground)}.monaco-editor .codicon.codicon-symbol-module,.monaco-workbench .codicon.codicon-symbol-module{color:var(--vscode-symbolIcon-moduleForeground)}.monaco-editor .codicon.codicon-symbol-namespace,.monaco-workbench .codicon.codicon-symbol-namespace{color:var(--vscode-symbolIcon-namespaceForeground)}.monaco-editor .codicon.codicon-symbol-null,.monaco-workbench .codicon.codicon-symbol-null{color:var(--vscode-symbolIcon-nullForeground)}.monaco-editor .codicon.codicon-symbol-number,.monaco-workbench .codicon.codicon-symbol-number{color:var(--vscode-symbolIcon-numberForeground)}.monaco-editor .codicon.codicon-symbol-object,.monaco-workbench .codicon.codicon-symbol-object{color:var(--vscode-symbolIcon-objectForeground)}.monaco-editor .codicon.codicon-symbol-operator,.monaco-workbench .codicon.codicon-symbol-operator{color:var(--vscode-symbolIcon-operatorForeground)}.monaco-editor .codicon.codicon-symbol-package,.monaco-workbench .codicon.codicon-symbol-package{color:var(--vscode-symbolIcon-packageForeground)}.monaco-editor .codicon.codicon-symbol-property,.monaco-workbench .codicon.codicon-symbol-property{color:var(--vscode-symbolIcon-propertyForeground)}.monaco-editor .codicon.codicon-symbol-reference,.monaco-workbench .codicon.codicon-symbol-reference{color:var(--vscode-symbolIcon-referenceForeground)}.monaco-editor .codicon.codicon-symbol-snippet,.monaco-workbench .codicon.codicon-symbol-snippet{color:var(--vscode-symbolIcon-snippetForeground)}.monaco-editor .codicon.codicon-symbol-string,.monaco-workbench .codicon.codicon-symbol-string{color:var(--vscode-symbolIcon-stringForeground)}.monaco-editor .codicon.codicon-symbol-struct,.monaco-workbench .codicon.codicon-symbol-struct{color:var(--vscode-symbolIcon-structForeground)}.monaco-editor .codicon.codicon-symbol-text,.monaco-workbench .codicon.codicon-symbol-text{color:var(--vscode-symbolIcon-textForeground)}.monaco-editor .codicon.codicon-symbol-type-parameter,.monaco-workbench .codicon.codicon-symbol-type-parameter{color:var(--vscode-symbolIcon-typeParameterForeground)}.monaco-editor .codicon.codicon-symbol-unit,.monaco-workbench .codicon.codicon-symbol-unit{color:var(--vscode-symbolIcon-unitForeground)}.monaco-editor .codicon.codicon-symbol-variable,.monaco-workbench .codicon.codicon-symbol-variable{color:var(--vscode-symbolIcon-variableForeground)}.editor-banner{background:var(--vscode-banner-background);box-sizing:border-box;cursor:default;display:flex;font-size:12px;height:26px;overflow:visible;width:100%}.editor-banner .icon-container{align-items:center;display:flex;flex-shrink:0;padding:0 6px 0 10px}.editor-banner .icon-container.custom-icon{background-position:50%;background-repeat:no-repeat;background-size:16px;margin:0 6px 0 10px;padding:0;width:16px}.editor-banner .message-container{align-items:center;display:flex;line-height:26px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.editor-banner .message-container p{margin-block-end:0;margin-block-start:0}.editor-banner .message-actions-container{flex-grow:1;flex-shrink:0;line-height:26px;margin:0 4px}.editor-banner .message-actions-container a.monaco-button{margin:2px 8px;padding:0 12px;width:inherit}.editor-banner .message-actions-container a{margin-left:12px;padding:3px;text-decoration:underline}.editor-banner .action-container{padding:0 10px 0 6px}.editor-banner{background-color:var(--vscode-banner-background)}.editor-banner,.editor-banner .action-container .codicon,.editor-banner .message-actions-container .monaco-link{color:var(--vscode-banner-foreground)}.editor-banner .icon-container .codicon{color:var(--vscode-banner-iconForeground)}.monaco-editor .unicode-highlight{background-color:var(--vscode-editorUnicodeHighlight-background);border:1px solid var(--vscode-editorUnicodeHighlight-border);box-sizing:border-box}.monaco-editor .focused .selectionHighlight{background-color:var(--vscode-editor-selectionHighlightBackground);border:1px solid var(--vscode-editor-selectionHighlightBorder);box-sizing:border-box}.monaco-editor.hc-black .focused .selectionHighlight,.monaco-editor.hc-light .focused .selectionHighlight{border-style:dotted}.monaco-editor .wordHighlight{background-color:var(--vscode-editor-wordHighlightBackground);border:1px solid var(--vscode-editor-wordHighlightBorder);box-sizing:border-box}.monaco-editor.hc-black .wordHighlight,.monaco-editor.hc-light .wordHighlight{border-style:dotted}.monaco-editor .wordHighlightStrong{background-color:var(--vscode-editor-wordHighlightStrongBackground);border:1px solid var(--vscode-editor-wordHighlightStrongBorder);box-sizing:border-box}.monaco-editor.hc-black .wordHighlightStrong,.monaco-editor.hc-light .wordHighlightStrong{border-style:dotted}.monaco-editor .wordHighlightText{background-color:var(--vscode-editor-wordHighlightTextBackground);border:1px solid var(--vscode-editor-wordHighlightTextBorder);box-sizing:border-box}.monaco-editor.hc-black .wordHighlightText,.monaco-editor.hc-light .wordHighlightText{border-style:dotted}.monaco-editor .zone-widget{position:absolute;z-index:10}.monaco-editor .zone-widget .zone-widget-container{border-bottom-style:solid;border-bottom-width:0;border-top-style:solid;border-top-width:0;position:relative}.monaco-editor .iPadShowKeyboard{background:url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1MyIgaGVpZ2h0PSIzNiIgZmlsbD0ibm9uZSI+PGcgY2xpcC1wYXRoPSJ1cmwoI2EpIj48cGF0aCBmaWxsPSIjNDI0MjQyIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik00OC4wMzYgNC4wMUg0LjAwOFYzMi4wM2g0NC4wMjh6TTQuMDA4LjAwOEE0LjAwMyA0LjAwMyAwIDAgMCAuMDA1IDQuMDFWMzIuMDNhNC4wMDMgNC4wMDMgMCAwIDAgNC4wMDMgNC4wMDJoNDQuMDI4YTQuMDAzIDQuMDAzIDAgMCAwIDQuMDAzLTQuMDAyVjQuMDFBNC4wMDMgNC4wMDMgMCAwIDAgNDguMDM2LjAwOHpNOC4wMSA4LjAxM2g0LjAwM3Y0LjAwM0g4LjAxem0xMi4wMDggMGgtNC4wMDJ2NC4wMDNoNC4wMDJ6bTQuMDAzIDBoNC4wMDJ2NC4wMDNoLTQuMDAyem0xMi4wMDggMGgtNC4wMDN2NC4wMDNoNC4wMDN6bTQuMDAyIDBoNC4wMDN2NC4wMDNINDAuMDN6bS0yNC4wMTUgOC4wMDVIOC4wMXY0LjAwM2g4LjAwNnptNC4wMDIgMGg0LjAwM3Y0LjAwM2gtNC4wMDN6bTEyLjAwOCAwaC00LjAwM3Y0LjAwM2g0LjAwM3ptMTIuMDA4IDB2NC4wMDNoLTguMDA1di00LjAwM3ptLTMyLjAyMSA4LjAwNUg4LjAxdjQuMDAzaDQuMDAzem00LjAwMyAwaDIwLjAxM3Y0LjAwM0gxNi4wMTZ6bTI4LjAxOCAwSDQwLjAzdjQuMDAzaDQuMDAzeiIgY2xpcC1ydWxlPSJldmVub2RkIi8+PC9nPjxkZWZzPjxjbGlwUGF0aCBpZD0iYSI+PHBhdGggZmlsbD0iI2ZmZiIgZD0iTTAgMGg1M3YzNkgweiIvPjwvY2xpcFBhdGg+PC9kZWZzPjwvc3ZnPg==) 50% no-repeat;border:4px solid #f6f6f6;border-radius:4px;height:36px;margin:0;min-height:0;min-width:0;overflow:hidden;padding:0;position:absolute;resize:none;width:58px}.monaco-editor.vs-dark .iPadShowKeyboard{background:url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1MyIgaGVpZ2h0PSIzNiIgZmlsbD0ibm9uZSI+PGcgY2xpcC1wYXRoPSJ1cmwoI2EpIj48cGF0aCBmaWxsPSIjQzVDNUM1IiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik00OC4wMzYgNC4wMUg0LjAwOFYzMi4wM2g0NC4wMjh6TTQuMDA4LjAwOEE0LjAwMyA0LjAwMyAwIDAgMCAuMDA1IDQuMDFWMzIuMDNhNC4wMDMgNC4wMDMgMCAwIDAgNC4wMDMgNC4wMDJoNDQuMDI4YTQuMDAzIDQuMDAzIDAgMCAwIDQuMDAzLTQuMDAyVjQuMDFBNC4wMDMgNC4wMDMgMCAwIDAgNDguMDM2LjAwOHpNOC4wMSA4LjAxM2g0LjAwM3Y0LjAwM0g4LjAxem0xMi4wMDggMGgtNC4wMDJ2NC4wMDNoNC4wMDJ6bTQuMDAzIDBoNC4wMDJ2NC4wMDNoLTQuMDAyem0xMi4wMDggMGgtNC4wMDN2NC4wMDNoNC4wMDN6bTQuMDAyIDBoNC4wMDN2NC4wMDNINDAuMDN6bS0yNC4wMTUgOC4wMDVIOC4wMXY0LjAwM2g4LjAwNnptNC4wMDIgMGg0LjAwM3Y0LjAwM2gtNC4wMDN6bTEyLjAwOCAwaC00LjAwM3Y0LjAwM2g0LjAwM3ptMTIuMDA4IDB2NC4wMDNoLTguMDA1di00LjAwM3ptLTMyLjAyMSA4LjAwNUg4LjAxdjQuMDAzaDQuMDAzem00LjAwMyAwaDIwLjAxM3Y0LjAwM0gxNi4wMTZ6bTI4LjAxOCAwSDQwLjAzdjQuMDAzaDQuMDAzeiIgY2xpcC1ydWxlPSJldmVub2RkIi8+PC9nPjxkZWZzPjxjbGlwUGF0aCBpZD0iYSI+PHBhdGggZmlsbD0iI2ZmZiIgZD0iTTAgMGg1M3YzNkgweiIvPjwvY2xpcFBhdGg+PC9kZWZzPjwvc3ZnPg==) 50% no-repeat;border:4px solid #252526}.monaco-editor .tokens-inspect-widget{background-color:var(--vscode-editorHoverWidget-background);border:1px solid var(--vscode-editorHoverWidget-border);color:var(--vscode-editorHoverWidget-foreground);padding:10px;user-select:text;-webkit-user-select:text;z-index:50}.monaco-editor.hc-black .tokens-inspect-widget,.monaco-editor.hc-light .tokens-inspect-widget{border-width:2px}.monaco-editor .tokens-inspect-widget .tokens-inspect-separator{background-color:var(--vscode-editorHoverWidget-border);border:0;height:1px}.monaco-editor .tokens-inspect-widget .tm-token{font-family:var(--monaco-monospace-font)}.monaco-editor .tokens-inspect-widget .tm-token-length{float:right;font-size:60%;font-weight:400}.monaco-editor .tokens-inspect-widget .tm-metadata-table{width:100%}.monaco-editor .tokens-inspect-widget .tm-metadata-value{font-family:var(--monaco-monospace-font);text-align:right}.monaco-editor .tokens-inspect-widget .tm-token-type{font-family:var(--monaco-monospace-font)}.quick-input-widget{font-size:13px}.quick-input-widget .monaco-highlighted-label .highlight{color:#0066bf}.vs .quick-input-widget .monaco-list-row.focused .monaco-highlighted-label .highlight{color:#9dddff}.vs-dark .quick-input-widget .monaco-highlighted-label .highlight{color:#0097fb}.hc-black .quick-input-widget .monaco-highlighted-label .highlight{color:#f38518}.hc-light .quick-input-widget .monaco-highlighted-label .highlight{color:#0f4a85}.monaco-keybinding>.monaco-keybinding-key{background-color:hsla(0,0%,87%,.4);border:1px solid hsla(0,0%,80%,.4);border-bottom-color:hsla(0,0%,73%,.4);box-shadow:inset 0 -1px 0 hsla(0,0%,73%,.4);color:#555}.hc-black .monaco-keybinding>.monaco-keybinding-key{background-color:transparent;border:1px solid #6fc3df;box-shadow:none;color:#fff}.hc-light .monaco-keybinding>.monaco-keybinding-key{background-color:transparent;border:1px solid #0f4a85;box-shadow:none;color:#292929}.vs-dark .monaco-keybinding>.monaco-keybinding-key{background-color:hsla(0,0%,50%,.17);border:1px solid rgba(51,51,51,.6);border-bottom-color:rgba(68,68,68,.6);box-shadow:inset 0 -1px 0 rgba(68,68,68,.6);color:#ccc}.monaco-editor{font-family:-apple-system,BlinkMacSystemFont,Segoe WPC,Segoe UI,HelveticaNeue-Light,system-ui,Ubuntu,Droid Sans,sans-serif;--monaco-monospace-font:"SF Mono",Monaco,Menlo,Consolas,"Ubuntu Mono","Liberation Mono","DejaVu Sans Mono","Courier New",monospace}.monaco-editor.hc-black .monaco-menu .monaco-action-bar.vertical .action-menu-item:focus .action-label,.monaco-editor.hc-light .monaco-menu .monaco-action-bar.vertical .action-menu-item:focus .action-label,.monaco-editor.vs-dark .monaco-menu .monaco-action-bar.vertical .action-menu-item:focus .action-label,.monaco-menu .monaco-action-bar.vertical .action-item .action-menu-item:focus .action-label{stroke-width:1.2px}.monaco-hover p{margin:0}.monaco-aria-container{height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute!important;top:0;width:1px;clip:rect(1px,1px,1px,1px);clip-path:inset(50%)}.monaco-diff-editor .synthetic-focus,.monaco-diff-editor [tabindex="-1"]:focus,.monaco-diff-editor [tabindex="0"]:focus,.monaco-diff-editor button:focus,.monaco-diff-editor input[type=button]:focus,.monaco-diff-editor input[type=checkbox]:focus,.monaco-diff-editor input[type=search]:focus,.monaco-diff-editor input[type=text]:focus,.monaco-diff-editor select:focus,.monaco-diff-editor textarea:focus,.monaco-editor{opacity:1;outline-color:var(--vscode-focusBorder);outline-offset:-1px;outline-style:solid;outline-width:1px}.action-widget{background-color:var(--vscode-editorWidget-background);border:1px solid var(--vscode-editorWidget-border)!important;border-radius:0;border-radius:2px;color:var(--vscode-editorWidget-foreground);display:block;font-size:13px;max-width:80vw;min-width:160px;width:100%;z-index:40}.context-view-block{z-index:-1}.context-view-block,.context-view-pointerBlock{cursor:auto;height:100%;left:0;position:fixed;top:0;width:100%}.context-view-pointerBlock{z-index:2}.action-widget .monaco-list{border:0!important;user-select:none;-webkit-user-select:none}.action-widget .monaco-list:focus:before{outline:0!important}.action-widget .monaco-list .monaco-scrollable-element{overflow:visible}.action-widget .monaco-list .monaco-list-row{cursor:pointer;padding:0 10px;touch-action:none;white-space:nowrap;width:100%}.action-widget .monaco-list .monaco-list-row.action.focused:not(.option-disabled){background-color:var(--vscode-quickInputList-focusBackground)!important;color:var(--vscode-quickInputList-focusForeground);outline:1px solid var(--vscode-menu-selectionBorder,transparent);outline-offset:-1px}.action-widget .monaco-list-row.group-header{color:var(--vscode-descriptionForeground)!important;font-weight:600}.action-widget .monaco-list .group-header,.action-widget .monaco-list .option-disabled,.action-widget .monaco-list .option-disabled .focused,.action-widget .monaco-list .option-disabled .focused:before,.action-widget .monaco-list .option-disabled:before{cursor:default!important;-webkit-touch-callout:none;background-color:transparent!important;outline:0 solid!important;-webkit-user-select:none;user-select:none}.action-widget .monaco-list-row.action{align-items:center;display:flex;gap:6px}.action-widget .monaco-list-row.action.option-disabled,.action-widget .monaco-list-row.action.option-disabled .codicon,.action-widget .monaco-list:focus .monaco-list-row.focused.action.option-disabled,.action-widget .monaco-list:not(.drop-target):not(.dragging) .monaco-list-row:hover:not(.selected):not(.focused).option-disabled{color:var(--vscode-disabledForeground)}.action-widget .monaco-list-row.action:not(.option-disabled) .codicon{color:inherit}.action-widget .monaco-list-row.action .title{flex:1;overflow:hidden;text-overflow:ellipsis}.action-widget .monaco-list-row.action .monaco-keybinding>.monaco-keybinding-key{background-color:var(--vscode-keybindingLabel-background);border-color:var(--vscode-keybindingLabel-border);border-bottom-color:var(--vscode-keybindingLabel-bottomBorder);border-radius:3px;border-style:solid;border-width:1px;box-shadow:inset 0 -1px 0 var(--vscode-widget-shadow);color:var(--vscode-keybindingLabel-foreground)}.action-widget .action-widget-action-bar{background-color:var(--vscode-editorHoverWidget-statusBarBackground);border-top:1px solid var(--vscode-editorHoverWidget-border)}.action-widget .action-widget-action-bar:before{content:"";display:block;width:100%}.action-widget .action-widget-action-bar .actions-container{padding:0 8px}.action-widget-action-bar .action-label{color:var(--vscode-textLink-activeForeground);font-size:12px;line-height:22px;padding:0;pointer-events:all}.action-widget-action-bar .action-item{margin-right:16px;pointer-events:none}.action-widget-action-bar .action-label:hover{background-color:transparent!important}.monaco-action-bar .actions-container.highlight-toggled .action-label.checked{background:var(--vscode-actionBar-toggledBackground)!important}.monaco-action-bar .action-item.menu-entry .action-label.icon{background-position:50%;background-repeat:no-repeat;background-size:16px;height:16px;width:16px}.monaco-dropdown-with-default{border-radius:5px;display:flex!important;flex-direction:row}.monaco-dropdown-with-default>.action-container>.action-label{margin-right:0}.monaco-dropdown-with-default>.action-container.menu-entry>.action-label.icon{background-position:50%;background-repeat:no-repeat;background-size:16px;height:16px;width:16px}.monaco-dropdown-with-default:hover{background-color:var(--vscode-toolbar-hoverBackground)}.monaco-dropdown-with-default>.dropdown-action-container>.monaco-dropdown>.dropdown-label .codicon[class*=codicon-]{font-size:12px;line-height:16px;margin-left:-3px;padding-left:0;padding-right:0}.monaco-dropdown-with-default>.dropdown-action-container>.monaco-dropdown>.dropdown-label>.action-label{background-position:50%;background-repeat:no-repeat;background-size:16px;display:block}.monaco-link{color:var(--vscode-textLink-foreground)}.monaco-link:hover{color:var(--vscode-textLink-activeForeground)}.quick-input-widget{left:50%;margin-left:-300px;position:absolute;width:600px;z-index:2550;-webkit-app-region:no-drag;border-radius:6px}.quick-input-titlebar{align-items:center;border-top-left-radius:5px;border-top-right-radius:5px;display:flex}.quick-input-left-action-bar{display:flex;flex:1;margin-left:4px}.quick-input-title{overflow:hidden;padding:3px 0;text-align:center;text-overflow:ellipsis}.quick-input-right-action-bar{display:flex;flex:1;margin-right:4px}.quick-input-right-action-bar>.actions-container{justify-content:flex-end}.quick-input-titlebar .monaco-action-bar .action-label.codicon{background-position:50%;background-repeat:no-repeat;padding:2px}.quick-input-description{margin:6px 6px 6px 11px}.quick-input-header .quick-input-description{flex:1;margin:4px 2px}.quick-input-header{display:flex;padding:8px 6px 6px}.quick-input-widget.hidden-input .quick-input-header{margin-bottom:0;padding:0}.quick-input-and-message{display:flex;flex-direction:column;flex-grow:1;min-width:0;position:relative}.quick-input-check-all{align-self:center;margin:0}.quick-input-filter{display:flex;flex-grow:1;position:relative}.quick-input-box{flex-grow:1}.quick-input-widget.show-checkboxes .quick-input-box,.quick-input-widget.show-checkboxes .quick-input-message{margin-left:5px}.quick-input-visible-count{left:-10000px;position:absolute}.quick-input-count{align-items:center;align-self:center;display:flex;position:absolute;right:4px}.quick-input-count .monaco-count-badge{border-radius:2px;line-height:normal;min-height:auto;padding:2px 4px;vertical-align:middle}.quick-input-action{margin-left:6px}.quick-input-action .monaco-text-button{align-items:center;display:flex;font-size:11px;height:25px;padding:0 6px}.quick-input-message{margin-top:-1px;overflow-wrap:break-word;padding:5px}.quick-input-message>.codicon{margin:0 .2em;vertical-align:text-bottom}.quick-input-message a{color:inherit}.quick-input-progress.monaco-progress-container{position:relative}.quick-input-list{line-height:22px}.quick-input-widget.hidden-input .quick-input-list{margin-top:4px;padding-bottom:4px}.quick-input-list .monaco-list{max-height:440px;overflow:hidden;padding-bottom:5px}.quick-input-list .monaco-scrollable-element{padding:0 5px}.quick-input-list .quick-input-list-entry{box-sizing:border-box;display:flex;height:100%;overflow:hidden;padding:0 6px}.quick-input-list .quick-input-list-entry.quick-input-list-separator-border{border-top-style:solid;border-top-width:1px}.quick-input-list .monaco-list-row{border-radius:3px}.quick-input-list .monaco-list-row[data-index="0"] .quick-input-list-entry.quick-input-list-separator-border{border-top-style:none}.quick-input-list .quick-input-list-label{display:flex;flex:1;height:100%;overflow:hidden}.quick-input-list .quick-input-list-checkbox{align-self:center;margin:0}.quick-input-list .quick-input-list-icon{align-items:center;background-position:0;background-repeat:no-repeat;background-size:16px;display:flex;height:22px;justify-content:center;padding-right:6px;width:16px}.quick-input-list .quick-input-list-rows{display:flex;flex:1;flex-direction:column;height:100%;margin-left:5px;overflow:hidden;text-overflow:ellipsis}.quick-input-widget.show-checkboxes .quick-input-list .quick-input-list-rows{margin-left:10px}.quick-input-widget .quick-input-list .quick-input-list-checkbox{display:none}.quick-input-widget.show-checkboxes .quick-input-list .quick-input-list-checkbox{display:inline}.quick-input-list .quick-input-list-rows>.quick-input-list-row{align-items:center;display:flex}.quick-input-list .quick-input-list-rows>.quick-input-list-row .monaco-icon-label,.quick-input-list .quick-input-list-rows>.quick-input-list-row .monaco-icon-label .monaco-icon-label-container>.monaco-icon-name-container{flex:1}.quick-input-list .quick-input-list-rows>.quick-input-list-row .codicon[class*=codicon-]{vertical-align:text-bottom}.quick-input-list .quick-input-list-rows .monaco-highlighted-label>span{opacity:1}.quick-input-list .quick-input-list-entry .quick-input-list-entry-keybinding{margin-right:8px}.quick-input-list .quick-input-list-label-meta{line-height:normal;opacity:.7;overflow:hidden;text-overflow:ellipsis}.quick-input-list .monaco-highlighted-label .highlight{font-weight:700}.quick-input-list .quick-input-list-entry .quick-input-list-separator{margin-right:4px}.quick-input-list .quick-input-list-entry-action-bar{display:flex;flex:0;overflow:visible}.quick-input-list .quick-input-list-entry-action-bar .action-label{display:none}.quick-input-list .quick-input-list-entry-action-bar .action-label.codicon{margin-right:4px;padding:0 2px 2px}.quick-input-list .quick-input-list-entry-action-bar{margin-right:4px;margin-top:1px}.quick-input-list .monaco-list-row.focused .quick-input-list-entry-action-bar .action-label,.quick-input-list .quick-input-list-entry .quick-input-list-entry-action-bar .action-label.always-visible,.quick-input-list .quick-input-list-entry:hover .quick-input-list-entry-action-bar .action-label{display:flex}.quick-input-list .monaco-list-row.focused .monaco-keybinding-key,.quick-input-list .monaco-list-row.focused .quick-input-list-entry .quick-input-list-separator{color:inherit}.quick-input-list .monaco-list-row.focused .monaco-keybinding-key{background:none}.quick-input-list .quick-input-list-separator-as-item{font-size:12px;font-weight:600}.extension-editor .codicon.codicon-error,.extensions-viewlet>.extensions .codicon.codicon-error,.markers-panel .marker-icon .codicon.codicon-error,.markers-panel .marker-icon.error,.monaco-editor .zone-widget .codicon.codicon-error,.preferences-editor .codicon.codicon-error,.text-search-provider-messages .providerMessage .codicon.codicon-error{color:var(--vscode-problemsErrorIcon-foreground)}.extension-editor .codicon.codicon-warning,.extensions-viewlet>.extensions .codicon.codicon-warning,.markers-panel .marker-icon .codicon.codicon-warning,.markers-panel .marker-icon.warning,.monaco-editor .zone-widget .codicon.codicon-warning,.preferences-editor .codicon.codicon-warning,.text-search-provider-messages .providerMessage .codicon.codicon-warning{color:var(--vscode-problemsWarningIcon-foreground)}.extension-editor .codicon.codicon-info,.extensions-viewlet>.extensions .codicon.codicon-info,.markers-panel .marker-icon .codicon.codicon-info,.markers-panel .marker-icon.info,.monaco-editor .zone-widget .codicon.codicon-info,.preferences-editor .codicon.codicon-info,.text-search-provider-messages .providerMessage .codicon.codicon-info{color:var(--vscode-problemsInfoIcon-foreground)}`;
var ue = Object.defineProperty, be = Object.getOwnPropertyDescriptor, M = (t, o, e, i) => {
  for (var n = i > 1 ? void 0 : i ? be(o, e) : o, r = t.length - 1, a; r >= 0; r--)
    (a = t[r]) && (n = (i ? a(o, e, n) : a(n)) || n);
  return i && n && ue(o, e, n), n;
};
let g = class extends ee {
  constructor() {
    super(), this.visible = !1, this.editorReady = (() => {
      const [t, o] = _o(), e = t;
      return e.resolve = () => {
        e.done = !0, o();
      }, e.done = !1, e;
    })(), this.disposables = [], this.disposableModels = [], this.monacoRef = le(), this.resizeObs = new ResizeObserver(([t]) => {
      var e;
      const o = t.contentRect;
      (e = this.editor) == null || e.layout({ height: o.height, width: o.width });
    }), this.internals = this.attachInternals();
  }
  set value(t) {
    var o, e;
    this.editorReady.done ? ((o = this.editor) == null ? void 0 : o.getValue()) !== t && ((e = this.editor) == null || e.setValue(t)) : this.createModel(t, this.language ?? "typescript");
  }
  get value() {
    var t;
    return ((t = this.editor) == null ? void 0 : t.getValue()) ?? "";
  }
  get monaco() {
    return F;
  }
  get editor() {
    return this._editor;
  }
  connectedCallback() {
    super.connectedCallback(), this.updateComplete.then(() => this.afterConnected());
  }
  disconnectedCallback() {
    var t;
    super.disconnectedCallback(), this.disposables.forEach((o) => o.dispose()), this.disposableModels.forEach((o) => o.dispose()), (t = this._editor) == null || t.dispose(), this.resizeObs.unobserve(this);
  }
  async afterConnected() {
    this.resizeObs.observe(this), await g.modifyLangConfig, F.defineTheme("Plastic", {
      base: "vs-dark",
      inherit: !0,
      colors: {
        "editor.background": "#1E1E1E",
        "editor.foreground": "#D4D4D4",
        "editor.inactiveSelectionBackground": "#3A3D41",
        "editorIndentGuide.background": "#404040",
        "editor.selectionHighlightBackground": "#ADD6FF26",
        "editorBracketHighlight.foreground1": "#A9B2C3",
        "editorBracketHighlight.foreground2": "#61AFEF",
        "editorBracketHighlight.foreground3": "#E5C07B",
        "editorBracketHighlight.foreground4": "#E06C75",
        "editorBracketHighlight.foreground5": "#98C379",
        "editorBracketHighlight.foreground6": "#B57EDC"
      },
      rules: [
        { token: "identifier", foreground: "C6CCD7" },
        { token: "string", foreground: "98C379" },
        { token: "function", foreground: "B57EDC" },
        { token: "type", foreground: "E5C07B" },
        { token: "keyword.type", foreground: "E5C07B" },
        { token: "keyword.special", foreground: "E06C75" },
        { token: "meta.decorator", foreground: "A9B2C3" }
      ]
    }), this._editor = F.create(this.monacoRef.value, {
      model: null,
      language: "typescript",
      theme: "Plastic",
      tabSize: 3,
      mouseWheelZoom: !0,
      fixedOverflowWidgets: !0,
      useShadowDOM: !0,
      minimap: { enabled: !1 }
    });
    let t = "";
    this.disposables.push(
      this._editor.onDidChangeModel(() => {
        var i;
        this.visible = !!((i = this._editor) != null && i.getModel());
        const o = this.value;
        this.internals.setFormValue(o);
        const e = new Event("change", {
          bubbles: !0,
          composed: !0
        });
        this.dispatchEvent(e);
      }),
      this._editor.onDidFocusEditorText(() => {
        t = this.value;
      }),
      this._editor.onDidBlurEditorText(() => {
        if (t === this.value)
          return;
        const o = this.value;
        this.internals.setFormValue(o), this.dispatchEvent(new Event("change", {
          bubbles: !0,
          composed: !0
        }));
      }),
      this._editor.onDidChangeModelContent(() => {
        const o = this.value;
        this.internals.setFormValue(o), this.dispatchEvent(new InputEvent("input", {
          bubbles: !0,
          composed: !0,
          data: o
        }));
      })
    ), await Bo(100), this.editorReady.resolve(), Do(this, "editor-ready", { bubbles: !1 });
  }
  async createModel(t, o) {
    var i, n, r;
    await this.editorReady;
    const e = this.monaco.createModel(t, o);
    this.disposableModels.forEach((a) => a.dispose()), this.disposableModels.push(e), (i = this.editor) == null || i.setModel(e), (n = this.editor) == null || n.restoreViewState(null), (r = this.editor) == null || r.focus();
  }
  render() {
    return ao`
		<div
			${pe(this.monacoRef)}
			class=${ne({ editor: !0, visible: this.visible })}
		></div>
		${ge(!this.visible, () => ao`
		<s-editor-placeholder>
			${this.placeholder}
		</s-editor-placeholder>
		`)}
		`;
  }
};
g.formAssociated = !0;
g.modifyLangConfig = Ao("typescript", {
  typeKeywords: ["any", "boolean", "number", "object", "string", "undefined"],
  specialKeywords: ["this", "export", "return", "default"],
  tokenizer: {
    root: [{ include: "custom" }],
    custom: [
      ["@", "meta.decorator"],
      [/[\w\d]+ *`/, { token: "function", goBack: 1 }],
      [/[\w\d]+ *\(/, { token: "function", goBack: 1 }],
      [
        /[#]?[a-z_$][\w$]*/,
        {
          cases: {
            "@specialKeywords": "keyword.special",
            "@typeKeywords": "keyword.type",
            "@keywords": "keyword",
            "@default": "identifier"
          }
        }
      ]
    ]
  }
});
g.styles = [
  (() => {
    const t = new CSSStyleSheet();
    return t.replaceSync(he), t;
  })(),
  Io`
		:host {
			display: grid;
			overflow: hidden;
		}
		.editor {
			opacity: 0;
		}
		.editor.visible {
			opacity: 1;
		}
		s-editor-placeholder {
			display: grid;
			place-items: center;
		}
		.editor, s-editor-placeholder {
			grid-row: 1/2;
			grid-column: 1/2;
		}
		`
];
M([
  P()
], g.prototype, "value", 1);
M([
  P()
], g.prototype, "placeholder", 2);
M([
  P()
], g.prototype, "language", 2);
M([
  fo()
], g.prototype, "_editor", 2);
M([
  fo()
], g.prototype, "visible", 2);
g = M([
  oe("monaco-editor")
], g);
g.register();
export {
  g as MonacoEditorCmp
};
