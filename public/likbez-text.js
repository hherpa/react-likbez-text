"use strict";
var LikbezTextLib = (() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __require = function(m) {
  if (m === 'katex') return window.katex;
  if (m === 'react') return window.React;
  if (m === 'react-dom') return window.ReactDOM;
  if (m === 'react/jsx-runtime') return {
    jsx: function(t, p) { return window.React.createElement(t, p); },
    jsxs: function(t, p) { return window.React.createElement(t, p); },
    get Fragment() { return window.React.Fragment; }
  };
  throw new Error('Missing module: ' + m);
};
  var __commonJS = (cb, mod) => function __require2() {
    try {
      return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
    } catch (e) {
      throw mod = 0, e;
    }
  };
  var __export = (target, all4) => {
    for (var name in all4)
      __defProp(target, name, { get: all4[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key2 of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key2) && key2 !== except)
          __defProp(to, key2, { get: () => from[key2], enumerable: !(desc = __getOwnPropDesc(from, key2)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // node_modules/extend/index.js
  var require_extend = __commonJS({
    "node_modules/extend/index.js"(exports, module) {
      "use strict";
      var hasOwn = Object.prototype.hasOwnProperty;
      var toStr = Object.prototype.toString;
      var defineProperty = Object.defineProperty;
      var gOPD = Object.getOwnPropertyDescriptor;
      var isArray = function isArray2(arr) {
        if (typeof Array.isArray === "function") {
          return Array.isArray(arr);
        }
        return toStr.call(arr) === "[object Array]";
      };
      var isPlainObject2 = function isPlainObject3(obj) {
        if (!obj || toStr.call(obj) !== "[object Object]") {
          return false;
        }
        var hasOwnConstructor = hasOwn.call(obj, "constructor");
        var hasIsPrototypeOf = obj.constructor && obj.constructor.prototype && hasOwn.call(obj.constructor.prototype, "isPrototypeOf");
        if (obj.constructor && !hasOwnConstructor && !hasIsPrototypeOf) {
          return false;
        }
        var key2;
        for (key2 in obj) {
        }
        return typeof key2 === "undefined" || hasOwn.call(obj, key2);
      };
      var setProperty = function setProperty2(target, options) {
        if (defineProperty && options.name === "__proto__") {
          defineProperty(target, options.name, {
            enumerable: true,
            configurable: true,
            value: options.newValue,
            writable: true
          });
        } else {
          target[options.name] = options.newValue;
        }
      };
      var getProperty = function getProperty2(obj, name) {
        if (name === "__proto__") {
          if (!hasOwn.call(obj, name)) {
            return void 0;
          } else if (gOPD) {
            return gOPD(obj, name).value;
          }
        }
        return obj[name];
      };
      module.exports = function extend2() {
        var options, name, src, copy, copyIsArray, clone;
        var target = arguments[0];
        var i = 1;
        var length = arguments.length;
        var deep = false;
        if (typeof target === "boolean") {
          deep = target;
          target = arguments[1] || {};
          i = 2;
        }
        if (target == null || typeof target !== "object" && typeof target !== "function") {
          target = {};
        }
        for (; i < length; ++i) {
          options = arguments[i];
          if (options != null) {
            for (name in options) {
              src = getProperty(target, name);
              copy = getProperty(options, name);
              if (target !== copy) {
                if (deep && copy && (isPlainObject2(copy) || (copyIsArray = isArray(copy)))) {
                  if (copyIsArray) {
                    copyIsArray = false;
                    clone = src && isArray(src) ? src : [];
                  } else {
                    clone = src && isPlainObject2(src) ? src : {};
                  }
                  setProperty(target, { name, newValue: extend2(deep, clone, copy) });
                } else if (typeof copy !== "undefined") {
                  setProperty(target, { name, newValue: copy });
                }
              }
            }
          }
        }
        return target;
      };
    }
  });

  // src/index.ts
  var index_exports = {};
  __export(index_exports, {
    LikbezText: () => LikbezText,
    createCustomRenderer: () => createCustomRenderer,
    createKaTeXRenderer: () => createKaTeXRenderer,
    createMarkdownRenderer: () => createMarkdownRenderer,
    createParser: () => createParser,
    createSiglumRenderer: () => createSiglumRenderer,
    parserFactory: () => parserFactory,
    useLikbezText: () => useLikbezText
  });

  // src/infrastructure/parsers/UnifiedParser.ts
  var elementIdCounter = 0;
  var generateId = () => `elem_${++elementIdCounter}_${Date.now()}`;
  var defaultRenderBox = {
    dimensions: { width: "auto", height: "auto" },
    style: {
      padding: 8,
      borderRadius: 4
    }
  };
  var createParser = (options) => {
    return (source) => {
      const elements = [];
      const tokenPositions = [];
      const siglumRegex = /\{siglum\}([\s\S]*?)\{\/siglum\}/g;
      let match;
      while ((match = siglumRegex.exec(source)) !== null) {
        tokenPositions.push({
          start: match.index,
          end: match.index + match[0].length,
          element: {
            id: generateId(),
            type: "siglum",
            rawContent: match[1].trim(),
            renderBox: { ...defaultRenderBox }
          }
        });
      }
      if (options?.customElements) {
        for (const custom of options.customElements) {
          const customRegex = new RegExp(custom.pattern.source, custom.pattern.flags);
          while ((match = customRegex.exec(source)) !== null) {
            const parsed = custom.parse(match);
            tokenPositions.push({
              start: match.index,
              end: match.index + match[0].length,
              element: {
                id: generateId(),
                type: "custom",
                rawContent: parsed.rawContent || match[0],
                renderBox: { ...defaultRenderBox },
                metadata: { ...parsed.metadata, customType: custom.type }
              }
            });
          }
        }
      }
      tokenPositions.sort((a, b) => a.start - b.start);
      const usedPositions = new Array(source.length).fill(false);
      for (const token of tokenPositions) {
        for (let i = token.start; i < token.end; i++) {
          if (usedPositions[i]) {
            token.element = null;
            break;
          }
        }
        if (token.element) {
          for (let i = token.start; i < token.end; i++) {
            usedPositions[i] = true;
          }
        }
      }
      const filteredTokens = tokenPositions.filter((t) => t.element !== null);
      let lastEnd = 0;
      for (const token of filteredTokens) {
        if (token.start > lastEnd) {
          const textContent = source.slice(lastEnd, token.start).trim();
          if (textContent) {
            elements.push({
              id: generateId(),
              type: "markdown-katex",
              rawContent: textContent,
              renderBox: { ...defaultRenderBox }
            });
          }
        }
        elements.push(token.element);
        lastEnd = token.end;
      }
      if (lastEnd < source.length) {
        const remainingText = source.slice(lastEnd).trim();
        if (remainingText) {
          elements.push({
            id: generateId(),
            type: "markdown-katex",
            rawContent: remainingText,
            renderBox: { ...defaultRenderBox }
          });
        }
      }
      return { elements };
    };
  };
  var parserFactory = createParser;

  // src/infrastructure/renderers/KaTeXRenderer.tsx
  var import_katex = __toESM(__require("katex"));
  var import_jsx_runtime = __require("react/jsx-runtime");
  var createKaTeXRenderer = (defaultBox) => {
    return {
      render: (element6, config) => {
        if (typeof import_katex.default === "undefined") {
          return {
            elementId: element6.id,
            type: element6.type,
            box: element6.renderBox || defaultBox,
            content: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "likbez-error", children: "KaTeX is not loaded" })
          };
        }
        let html7;
        const displayMode = element6.metadata?.displayMode === true;
        try {
          html7 = import_katex.default.renderToString(element6.rawContent, {
            displayMode,
            throwOnError: false,
            errorColor: config?.errorColor ?? "#cc0000",
            macros: config?.macros ?? {},
            strict: config?.strict ?? false,
            trust: config?.trust ?? false
          });
        } catch (error) {
          html7 = `<span style="color: ${config?.errorColor ?? "#cc0000"}">KaTeX Error: ${error}</span>`;
        }
        const renderBox = element6.renderBox || defaultBox;
        const wrapperClass = displayMode ? "likbez-katex-wrapper-display" : "likbez-katex-wrapper";
        return {
          elementId: element6.id,
          type: element6.type,
          box: renderBox,
          content: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            "div",
            {
              className: wrapperClass,
              dangerouslySetInnerHTML: { __html: html7 }
            }
          )
        };
      }
    };
  };

  // src/infrastructure/renderers/SiglumRenderer.tsx
  var import_jsx_runtime2 = __require("react/jsx-runtime");
  var createSiglumRenderer = (defaultBox) => {
    let compiler2 = null;
    let initialized = false;
    const logs = [];
    const urlStore = /* @__PURE__ */ new Set();
    return {
      init: async (config) => {
        if (initialized) return;
        if (typeof SiglumCompiler === "undefined") {
          console.warn("SiglumCompiler not loaded. Make sure @siglum/engine is available.");
          return;
        }
        compiler2 = new SiglumCompiler({
          bundlesUrl: config?.bundlesUrl || "/bundles",
          wasmUrl: config?.wasmUrl || "/busytex.wasm",
          workerUrl: config?.workerUrl || "/worker.js",
          ctanProxyUrl: config?.ctanProxyUrl,
          onLog: (msg) => {
            logs.push(msg);
            config?.onLog?.(msg);
          },
          onProgress: config?.onProgress,
          verbose: true
        });
        await compiler2.init();
        initialized = true;
      },
      render: async (element6, config) => {
        const renderBox = element6.renderBox || defaultBox;
        if (!initialized || !compiler2) {
          return {
            elementId: element6.id,
            type: element6.type,
            box: renderBox,
            content: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "likbez-loading", children: "Initializing Siglum..." })
          };
        }
        logs.length = 0;
        const latexSource = `
\\documentclass{article}
\\usepackage{amsmath}
\\usepackage{amssymb}
\\begin{document}
${element6.rawContent}
\\end{document}
`;
        try {
          const result = await compiler2.compile(latexSource, {
            engine: config?.engine || "pdflatex"
          });
          if (!result) {
            return {
              elementId: element6.id,
              type: element6.type,
              box: renderBox,
              content: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "likbez-error", children: "No result from compiler" })
            };
          }
          if (result.success && result.pdf) {
            const pdfBuffer = result.pdfIsShared ? new Uint8Array(result.pdf).slice() : new Uint8Array(result.pdf);
            const blob = new Blob([pdfBuffer], { type: "application/pdf" });
            const url = URL.createObjectURL(blob);
            urlStore.add(url);
            return {
              elementId: element6.id,
              type: element6.type,
              box: renderBox,
              content: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "likbez-siglum", children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
                "object",
                {
                  data: url,
                  type: "application/pdf",
                  width: "100%"
                }
              ) })
            };
          }
          const texErrors = logs.filter(
            (l) => l.includes("[TeX ERR]") || l.includes("! LaTeX Error") || l.includes("Error:")
          );
          const errorText = texErrors.length > 0 ? texErrors.join("\n") : result.error || "Unknown error (check console for details)";
          return {
            elementId: element6.id,
            type: element6.type,
            box: renderBox,
            content: /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "likbez-error", children: [
              /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("strong", { children: "LaTeX Error:" }),
              /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("pre", { children: errorText })
            ] })
          };
        } catch (error) {
          return {
            elementId: element6.id,
            type: element6.type,
            box: renderBox,
            content: /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "likbez-error", children: [
              /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("strong", { children: "Compilation error:" }),
              /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("pre", { children: String(error) })
            ] })
          };
        }
      },
      compile: async (source, options) => {
        if (!compiler2) {
          return { success: false, error: "Siglum not initialized" };
        }
        return compiler2.compile(source, options);
      },
      destroy: () => {
        for (const url of urlStore) {
          URL.revokeObjectURL(url);
        }
        urlStore.clear();
        logs.length = 0;
        if (compiler2) {
          compiler2.terminate?.();
          compiler2 = null;
        }
        initialized = false;
      }
    };
  };

  // node_modules/bail/index.js
  function bail(error) {
    if (error) {
      throw error;
    }
  }

  // node_modules/unified/lib/index.js
  var import_extend = __toESM(require_extend(), 1);

  // node_modules/devlop/lib/default.js
  function ok() {
  }

  // node_modules/is-plain-obj/index.js
  function isPlainObject(value) {
    if (typeof value !== "object" || value === null) {
      return false;
    }
    const prototype = Object.getPrototypeOf(value);
    return (prototype === null || prototype === Object.prototype || Object.getPrototypeOf(prototype) === null) && !(Symbol.toStringTag in value) && !(Symbol.iterator in value);
  }

  // node_modules/trough/lib/index.js
  function trough() {
    const fns = [];
    const pipeline = { run, use };
    return pipeline;
    function run(...values) {
      let middlewareIndex = -1;
      const callback = values.pop();
      if (typeof callback !== "function") {
        throw new TypeError("Expected function as last argument, not " + callback);
      }
      next(null, ...values);
      function next(error, ...output) {
        const fn = fns[++middlewareIndex];
        let index2 = -1;
        if (error) {
          callback(error);
          return;
        }
        while (++index2 < values.length) {
          if (output[index2] === null || output[index2] === void 0) {
            output[index2] = values[index2];
          }
        }
        values = output;
        if (fn) {
          wrap(fn, next)(...output);
        } else {
          callback(null, ...output);
        }
      }
    }
    function use(middelware) {
      if (typeof middelware !== "function") {
        throw new TypeError(
          "Expected `middelware` to be a function, not " + middelware
        );
      }
      fns.push(middelware);
      return pipeline;
    }
  }
  function wrap(middleware, callback) {
    let called;
    return wrapped;
    function wrapped(...parameters) {
      const fnExpectsCallback = middleware.length > parameters.length;
      let result;
      if (fnExpectsCallback) {
        parameters.push(done);
      }
      try {
        result = middleware.apply(this, parameters);
      } catch (error) {
        const exception = (
          /** @type {Error} */
          error
        );
        if (fnExpectsCallback && called) {
          throw exception;
        }
        return done(exception);
      }
      if (!fnExpectsCallback) {
        if (result && result.then && typeof result.then === "function") {
          result.then(then, done);
        } else if (result instanceof Error) {
          done(result);
        } else {
          then(result);
        }
      }
    }
    function done(error, ...output) {
      if (!called) {
        called = true;
        callback(error, ...output);
      }
    }
    function then(value) {
      done(null, value);
    }
  }

  // node_modules/unist-util-stringify-position/lib/index.js
  function stringifyPosition(value) {
    if (!value || typeof value !== "object") {
      return "";
    }
    if ("position" in value || "type" in value) {
      return position(value.position);
    }
    if ("start" in value || "end" in value) {
      return position(value);
    }
    if ("line" in value || "column" in value) {
      return point(value);
    }
    return "";
  }
  function point(point4) {
    return index(point4 && point4.line) + ":" + index(point4 && point4.column);
  }
  function position(pos) {
    return point(pos && pos.start) + "-" + point(pos && pos.end);
  }
  function index(value) {
    return value && typeof value === "number" ? value : 1;
  }

  // node_modules/vfile-message/lib/index.js
  var VFileMessage = class extends Error {
    /**
     * Create a message for `reason`.
     *
     * > 🪦 **Note**: also has obsolete signatures.
     *
     * @overload
     * @param {string} reason
     * @param {Options | null | undefined} [options]
     * @returns
     *
     * @overload
     * @param {string} reason
     * @param {Node | NodeLike | null | undefined} parent
     * @param {string | null | undefined} [origin]
     * @returns
     *
     * @overload
     * @param {string} reason
     * @param {Point | Position | null | undefined} place
     * @param {string | null | undefined} [origin]
     * @returns
     *
     * @overload
     * @param {string} reason
     * @param {string | null | undefined} [origin]
     * @returns
     *
     * @overload
     * @param {Error | VFileMessage} cause
     * @param {Node | NodeLike | null | undefined} parent
     * @param {string | null | undefined} [origin]
     * @returns
     *
     * @overload
     * @param {Error | VFileMessage} cause
     * @param {Point | Position | null | undefined} place
     * @param {string | null | undefined} [origin]
     * @returns
     *
     * @overload
     * @param {Error | VFileMessage} cause
     * @param {string | null | undefined} [origin]
     * @returns
     *
     * @param {Error | VFileMessage | string} causeOrReason
     *   Reason for message, should use markdown.
     * @param {Node | NodeLike | Options | Point | Position | string | null | undefined} [optionsOrParentOrPlace]
     *   Configuration (optional).
     * @param {string | null | undefined} [origin]
     *   Place in code where the message originates (example:
     *   `'my-package:my-rule'` or `'my-rule'`).
     * @returns
     *   Instance of `VFileMessage`.
     */
    // eslint-disable-next-line complexity
    constructor(causeOrReason, optionsOrParentOrPlace, origin) {
      super();
      if (typeof optionsOrParentOrPlace === "string") {
        origin = optionsOrParentOrPlace;
        optionsOrParentOrPlace = void 0;
      }
      let reason = "";
      let options = {};
      let legacyCause = false;
      if (optionsOrParentOrPlace) {
        if ("line" in optionsOrParentOrPlace && "column" in optionsOrParentOrPlace) {
          options = { place: optionsOrParentOrPlace };
        } else if ("start" in optionsOrParentOrPlace && "end" in optionsOrParentOrPlace) {
          options = { place: optionsOrParentOrPlace };
        } else if ("type" in optionsOrParentOrPlace) {
          options = {
            ancestors: [optionsOrParentOrPlace],
            place: optionsOrParentOrPlace.position
          };
        } else {
          options = { ...optionsOrParentOrPlace };
        }
      }
      if (typeof causeOrReason === "string") {
        reason = causeOrReason;
      } else if (!options.cause && causeOrReason) {
        legacyCause = true;
        reason = causeOrReason.message;
        options.cause = causeOrReason;
      }
      if (!options.ruleId && !options.source && typeof origin === "string") {
        const index2 = origin.indexOf(":");
        if (index2 === -1) {
          options.ruleId = origin;
        } else {
          options.source = origin.slice(0, index2);
          options.ruleId = origin.slice(index2 + 1);
        }
      }
      if (!options.place && options.ancestors && options.ancestors) {
        const parent = options.ancestors[options.ancestors.length - 1];
        if (parent) {
          options.place = parent.position;
        }
      }
      const start = options.place && "start" in options.place ? options.place.start : options.place;
      this.ancestors = options.ancestors || void 0;
      this.cause = options.cause || void 0;
      this.column = start ? start.column : void 0;
      this.fatal = void 0;
      this.file = "";
      this.message = reason;
      this.line = start ? start.line : void 0;
      this.name = stringifyPosition(options.place) || "1:1";
      this.place = options.place || void 0;
      this.reason = this.message;
      this.ruleId = options.ruleId || void 0;
      this.source = options.source || void 0;
      this.stack = legacyCause && options.cause && typeof options.cause.stack === "string" ? options.cause.stack : "";
      this.actual = void 0;
      this.expected = void 0;
      this.note = void 0;
      this.url = void 0;
    }
  };
  VFileMessage.prototype.file = "";
  VFileMessage.prototype.name = "";
  VFileMessage.prototype.reason = "";
  VFileMessage.prototype.message = "";
  VFileMessage.prototype.stack = "";
  VFileMessage.prototype.column = void 0;
  VFileMessage.prototype.line = void 0;
  VFileMessage.prototype.ancestors = void 0;
  VFileMessage.prototype.cause = void 0;
  VFileMessage.prototype.fatal = void 0;
  VFileMessage.prototype.place = void 0;
  VFileMessage.prototype.ruleId = void 0;
  VFileMessage.prototype.source = void 0;

  // node_modules/vfile/lib/minpath.browser.js
  var minpath = { basename, dirname, extname, join, sep: "/" };
  function basename(path2, extname2) {
    if (extname2 !== void 0 && typeof extname2 !== "string") {
      throw new TypeError('"ext" argument must be a string');
    }
    assertPath(path2);
    let start = 0;
    let end = -1;
    let index2 = path2.length;
    let seenNonSlash;
    if (extname2 === void 0 || extname2.length === 0 || extname2.length > path2.length) {
      while (index2--) {
        if (path2.codePointAt(index2) === 47) {
          if (seenNonSlash) {
            start = index2 + 1;
            break;
          }
        } else if (end < 0) {
          seenNonSlash = true;
          end = index2 + 1;
        }
      }
      return end < 0 ? "" : path2.slice(start, end);
    }
    if (extname2 === path2) {
      return "";
    }
    let firstNonSlashEnd = -1;
    let extnameIndex = extname2.length - 1;
    while (index2--) {
      if (path2.codePointAt(index2) === 47) {
        if (seenNonSlash) {
          start = index2 + 1;
          break;
        }
      } else {
        if (firstNonSlashEnd < 0) {
          seenNonSlash = true;
          firstNonSlashEnd = index2 + 1;
        }
        if (extnameIndex > -1) {
          if (path2.codePointAt(index2) === extname2.codePointAt(extnameIndex--)) {
            if (extnameIndex < 0) {
              end = index2;
            }
          } else {
            extnameIndex = -1;
            end = firstNonSlashEnd;
          }
        }
      }
    }
    if (start === end) {
      end = firstNonSlashEnd;
    } else if (end < 0) {
      end = path2.length;
    }
    return path2.slice(start, end);
  }
  function dirname(path2) {
    assertPath(path2);
    if (path2.length === 0) {
      return ".";
    }
    let end = -1;
    let index2 = path2.length;
    let unmatchedSlash;
    while (--index2) {
      if (path2.codePointAt(index2) === 47) {
        if (unmatchedSlash) {
          end = index2;
          break;
        }
      } else if (!unmatchedSlash) {
        unmatchedSlash = true;
      }
    }
    return end < 0 ? path2.codePointAt(0) === 47 ? "/" : "." : end === 1 && path2.codePointAt(0) === 47 ? "//" : path2.slice(0, end);
  }
  function extname(path2) {
    assertPath(path2);
    let index2 = path2.length;
    let end = -1;
    let startPart = 0;
    let startDot = -1;
    let preDotState = 0;
    let unmatchedSlash;
    while (index2--) {
      const code4 = path2.codePointAt(index2);
      if (code4 === 47) {
        if (unmatchedSlash) {
          startPart = index2 + 1;
          break;
        }
        continue;
      }
      if (end < 0) {
        unmatchedSlash = true;
        end = index2 + 1;
      }
      if (code4 === 46) {
        if (startDot < 0) {
          startDot = index2;
        } else if (preDotState !== 1) {
          preDotState = 1;
        }
      } else if (startDot > -1) {
        preDotState = -1;
      }
    }
    if (startDot < 0 || end < 0 || // We saw a non-dot character immediately before the dot.
    preDotState === 0 || // The (right-most) trimmed path component is exactly `..`.
    preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
      return "";
    }
    return path2.slice(startDot, end);
  }
  function join(...segments) {
    let index2 = -1;
    let joined;
    while (++index2 < segments.length) {
      assertPath(segments[index2]);
      if (segments[index2]) {
        joined = joined === void 0 ? segments[index2] : joined + "/" + segments[index2];
      }
    }
    return joined === void 0 ? "." : normalize(joined);
  }
  function normalize(path2) {
    assertPath(path2);
    const absolute = path2.codePointAt(0) === 47;
    let value = normalizeString(path2, !absolute);
    if (value.length === 0 && !absolute) {
      value = ".";
    }
    if (value.length > 0 && path2.codePointAt(path2.length - 1) === 47) {
      value += "/";
    }
    return absolute ? "/" + value : value;
  }
  function normalizeString(path2, allowAboveRoot) {
    let result = "";
    let lastSegmentLength = 0;
    let lastSlash = -1;
    let dots = 0;
    let index2 = -1;
    let code4;
    let lastSlashIndex;
    while (++index2 <= path2.length) {
      if (index2 < path2.length) {
        code4 = path2.codePointAt(index2);
      } else if (code4 === 47) {
        break;
      } else {
        code4 = 47;
      }
      if (code4 === 47) {
        if (lastSlash === index2 - 1 || dots === 1) {
        } else if (lastSlash !== index2 - 1 && dots === 2) {
          if (result.length < 2 || lastSegmentLength !== 2 || result.codePointAt(result.length - 1) !== 46 || result.codePointAt(result.length - 2) !== 46) {
            if (result.length > 2) {
              lastSlashIndex = result.lastIndexOf("/");
              if (lastSlashIndex !== result.length - 1) {
                if (lastSlashIndex < 0) {
                  result = "";
                  lastSegmentLength = 0;
                } else {
                  result = result.slice(0, lastSlashIndex);
                  lastSegmentLength = result.length - 1 - result.lastIndexOf("/");
                }
                lastSlash = index2;
                dots = 0;
                continue;
              }
            } else if (result.length > 0) {
              result = "";
              lastSegmentLength = 0;
              lastSlash = index2;
              dots = 0;
              continue;
            }
          }
          if (allowAboveRoot) {
            result = result.length > 0 ? result + "/.." : "..";
            lastSegmentLength = 2;
          }
        } else {
          if (result.length > 0) {
            result += "/" + path2.slice(lastSlash + 1, index2);
          } else {
            result = path2.slice(lastSlash + 1, index2);
          }
          lastSegmentLength = index2 - lastSlash - 1;
        }
        lastSlash = index2;
        dots = 0;
      } else if (code4 === 46 && dots > -1) {
        dots++;
      } else {
        dots = -1;
      }
    }
    return result;
  }
  function assertPath(path2) {
    if (typeof path2 !== "string") {
      throw new TypeError(
        "Path must be a string. Received " + JSON.stringify(path2)
      );
    }
  }

  // node_modules/vfile/lib/minproc.browser.js
  var minproc = { cwd };
  function cwd() {
    return "/";
  }

  // node_modules/vfile/lib/minurl.shared.js
  function isUrl(fileUrlOrPath) {
    return Boolean(
      fileUrlOrPath !== null && typeof fileUrlOrPath === "object" && "href" in fileUrlOrPath && fileUrlOrPath.href && "protocol" in fileUrlOrPath && fileUrlOrPath.protocol && // @ts-expect-error: indexing is fine.
      fileUrlOrPath.auth === void 0
    );
  }

  // node_modules/vfile/lib/minurl.browser.js
  function urlToPath(path2) {
    if (typeof path2 === "string") {
      path2 = new URL(path2);
    } else if (!isUrl(path2)) {
      const error = new TypeError(
        'The "path" argument must be of type string or an instance of URL. Received `' + path2 + "`"
      );
      error.code = "ERR_INVALID_ARG_TYPE";
      throw error;
    }
    if (path2.protocol !== "file:") {
      const error = new TypeError("The URL must be of scheme file");
      error.code = "ERR_INVALID_URL_SCHEME";
      throw error;
    }
    return getPathFromURLPosix(path2);
  }
  function getPathFromURLPosix(url) {
    if (url.hostname !== "") {
      const error = new TypeError(
        'File URL host must be "localhost" or empty on darwin'
      );
      error.code = "ERR_INVALID_FILE_URL_HOST";
      throw error;
    }
    const pathname = url.pathname;
    let index2 = -1;
    while (++index2 < pathname.length) {
      if (pathname.codePointAt(index2) === 37 && pathname.codePointAt(index2 + 1) === 50) {
        const third = pathname.codePointAt(index2 + 2);
        if (third === 70 || third === 102) {
          const error = new TypeError(
            "File URL path must not include encoded / characters"
          );
          error.code = "ERR_INVALID_FILE_URL_PATH";
          throw error;
        }
      }
    }
    return decodeURIComponent(pathname);
  }

  // node_modules/vfile/lib/index.js
  var order = (
    /** @type {const} */
    [
      "history",
      "path",
      "basename",
      "stem",
      "extname",
      "dirname"
    ]
  );
  var VFile = class {
    /**
     * Create a new virtual file.
     *
     * `options` is treated as:
     *
     * *   `string` or `Uint8Array` — `{value: options}`
     * *   `URL` — `{path: options}`
     * *   `VFile` — shallow copies its data over to the new file
     * *   `object` — all fields are shallow copied over to the new file
     *
     * Path related fields are set in the following order (least specific to
     * most specific): `history`, `path`, `basename`, `stem`, `extname`,
     * `dirname`.
     *
     * You cannot set `dirname` or `extname` without setting either `history`,
     * `path`, `basename`, or `stem` too.
     *
     * @param {Compatible | null | undefined} [value]
     *   File value.
     * @returns
     *   New instance.
     */
    constructor(value) {
      let options;
      if (!value) {
        options = {};
      } else if (isUrl(value)) {
        options = { path: value };
      } else if (typeof value === "string" || isUint8Array(value)) {
        options = { value };
      } else {
        options = value;
      }
      this.cwd = "cwd" in options ? "" : minproc.cwd();
      this.data = {};
      this.history = [];
      this.messages = [];
      this.value;
      this.map;
      this.result;
      this.stored;
      let index2 = -1;
      while (++index2 < order.length) {
        const field2 = order[index2];
        if (field2 in options && options[field2] !== void 0 && options[field2] !== null) {
          this[field2] = field2 === "history" ? [...options[field2]] : options[field2];
        }
      }
      let field;
      for (field in options) {
        if (!order.includes(field)) {
          this[field] = options[field];
        }
      }
    }
    /**
     * Get the basename (including extname) (example: `'index.min.js'`).
     *
     * @returns {string | undefined}
     *   Basename.
     */
    get basename() {
      return typeof this.path === "string" ? minpath.basename(this.path) : void 0;
    }
    /**
     * Set basename (including extname) (`'index.min.js'`).
     *
     * Cannot contain path separators (`'/'` on unix, macOS, and browsers, `'\'`
     * on windows).
     * Cannot be nullified (use `file.path = file.dirname` instead).
     *
     * @param {string} basename
     *   Basename.
     * @returns {undefined}
     *   Nothing.
     */
    set basename(basename2) {
      assertNonEmpty(basename2, "basename");
      assertPart(basename2, "basename");
      this.path = minpath.join(this.dirname || "", basename2);
    }
    /**
     * Get the parent path (example: `'~'`).
     *
     * @returns {string | undefined}
     *   Dirname.
     */
    get dirname() {
      return typeof this.path === "string" ? minpath.dirname(this.path) : void 0;
    }
    /**
     * Set the parent path (example: `'~'`).
     *
     * Cannot be set if there’s no `path` yet.
     *
     * @param {string | undefined} dirname
     *   Dirname.
     * @returns {undefined}
     *   Nothing.
     */
    set dirname(dirname2) {
      assertPath2(this.basename, "dirname");
      this.path = minpath.join(dirname2 || "", this.basename);
    }
    /**
     * Get the extname (including dot) (example: `'.js'`).
     *
     * @returns {string | undefined}
     *   Extname.
     */
    get extname() {
      return typeof this.path === "string" ? minpath.extname(this.path) : void 0;
    }
    /**
     * Set the extname (including dot) (example: `'.js'`).
     *
     * Cannot contain path separators (`'/'` on unix, macOS, and browsers, `'\'`
     * on windows).
     * Cannot be set if there’s no `path` yet.
     *
     * @param {string | undefined} extname
     *   Extname.
     * @returns {undefined}
     *   Nothing.
     */
    set extname(extname2) {
      assertPart(extname2, "extname");
      assertPath2(this.dirname, "extname");
      if (extname2) {
        if (extname2.codePointAt(0) !== 46) {
          throw new Error("`extname` must start with `.`");
        }
        if (extname2.includes(".", 1)) {
          throw new Error("`extname` cannot contain multiple dots");
        }
      }
      this.path = minpath.join(this.dirname, this.stem + (extname2 || ""));
    }
    /**
     * Get the full path (example: `'~/index.min.js'`).
     *
     * @returns {string}
     *   Path.
     */
    get path() {
      return this.history[this.history.length - 1];
    }
    /**
     * Set the full path (example: `'~/index.min.js'`).
     *
     * Cannot be nullified.
     * You can set a file URL (a `URL` object with a `file:` protocol) which will
     * be turned into a path with `url.fileURLToPath`.
     *
     * @param {URL | string} path
     *   Path.
     * @returns {undefined}
     *   Nothing.
     */
    set path(path2) {
      if (isUrl(path2)) {
        path2 = urlToPath(path2);
      }
      assertNonEmpty(path2, "path");
      if (this.path !== path2) {
        this.history.push(path2);
      }
    }
    /**
     * Get the stem (basename w/o extname) (example: `'index.min'`).
     *
     * @returns {string | undefined}
     *   Stem.
     */
    get stem() {
      return typeof this.path === "string" ? minpath.basename(this.path, this.extname) : void 0;
    }
    /**
     * Set the stem (basename w/o extname) (example: `'index.min'`).
     *
     * Cannot contain path separators (`'/'` on unix, macOS, and browsers, `'\'`
     * on windows).
     * Cannot be nullified (use `file.path = file.dirname` instead).
     *
     * @param {string} stem
     *   Stem.
     * @returns {undefined}
     *   Nothing.
     */
    set stem(stem) {
      assertNonEmpty(stem, "stem");
      assertPart(stem, "stem");
      this.path = minpath.join(this.dirname || "", stem + (this.extname || ""));
    }
    // Normal prototypal methods.
    /**
     * Create a fatal message for `reason` associated with the file.
     *
     * The `fatal` field of the message is set to `true` (error; file not usable)
     * and the `file` field is set to the current file path.
     * The message is added to the `messages` field on `file`.
     *
     * > 🪦 **Note**: also has obsolete signatures.
     *
     * @overload
     * @param {string} reason
     * @param {MessageOptions | null | undefined} [options]
     * @returns {never}
     *
     * @overload
     * @param {string} reason
     * @param {Node | NodeLike | null | undefined} parent
     * @param {string | null | undefined} [origin]
     * @returns {never}
     *
     * @overload
     * @param {string} reason
     * @param {Point | Position | null | undefined} place
     * @param {string | null | undefined} [origin]
     * @returns {never}
     *
     * @overload
     * @param {string} reason
     * @param {string | null | undefined} [origin]
     * @returns {never}
     *
     * @overload
     * @param {Error | VFileMessage} cause
     * @param {Node | NodeLike | null | undefined} parent
     * @param {string | null | undefined} [origin]
     * @returns {never}
     *
     * @overload
     * @param {Error | VFileMessage} cause
     * @param {Point | Position | null | undefined} place
     * @param {string | null | undefined} [origin]
     * @returns {never}
     *
     * @overload
     * @param {Error | VFileMessage} cause
     * @param {string | null | undefined} [origin]
     * @returns {never}
     *
     * @param {Error | VFileMessage | string} causeOrReason
     *   Reason for message, should use markdown.
     * @param {Node | NodeLike | MessageOptions | Point | Position | string | null | undefined} [optionsOrParentOrPlace]
     *   Configuration (optional).
     * @param {string | null | undefined} [origin]
     *   Place in code where the message originates (example:
     *   `'my-package:my-rule'` or `'my-rule'`).
     * @returns {never}
     *   Never.
     * @throws {VFileMessage}
     *   Message.
     */
    fail(causeOrReason, optionsOrParentOrPlace, origin) {
      const message = this.message(causeOrReason, optionsOrParentOrPlace, origin);
      message.fatal = true;
      throw message;
    }
    /**
     * Create an info message for `reason` associated with the file.
     *
     * The `fatal` field of the message is set to `undefined` (info; change
     * likely not needed) and the `file` field is set to the current file path.
     * The message is added to the `messages` field on `file`.
     *
     * > 🪦 **Note**: also has obsolete signatures.
     *
     * @overload
     * @param {string} reason
     * @param {MessageOptions | null | undefined} [options]
     * @returns {VFileMessage}
     *
     * @overload
     * @param {string} reason
     * @param {Node | NodeLike | null | undefined} parent
     * @param {string | null | undefined} [origin]
     * @returns {VFileMessage}
     *
     * @overload
     * @param {string} reason
     * @param {Point | Position | null | undefined} place
     * @param {string | null | undefined} [origin]
     * @returns {VFileMessage}
     *
     * @overload
     * @param {string} reason
     * @param {string | null | undefined} [origin]
     * @returns {VFileMessage}
     *
     * @overload
     * @param {Error | VFileMessage} cause
     * @param {Node | NodeLike | null | undefined} parent
     * @param {string | null | undefined} [origin]
     * @returns {VFileMessage}
     *
     * @overload
     * @param {Error | VFileMessage} cause
     * @param {Point | Position | null | undefined} place
     * @param {string | null | undefined} [origin]
     * @returns {VFileMessage}
     *
     * @overload
     * @param {Error | VFileMessage} cause
     * @param {string | null | undefined} [origin]
     * @returns {VFileMessage}
     *
     * @param {Error | VFileMessage | string} causeOrReason
     *   Reason for message, should use markdown.
     * @param {Node | NodeLike | MessageOptions | Point | Position | string | null | undefined} [optionsOrParentOrPlace]
     *   Configuration (optional).
     * @param {string | null | undefined} [origin]
     *   Place in code where the message originates (example:
     *   `'my-package:my-rule'` or `'my-rule'`).
     * @returns {VFileMessage}
     *   Message.
     */
    info(causeOrReason, optionsOrParentOrPlace, origin) {
      const message = this.message(causeOrReason, optionsOrParentOrPlace, origin);
      message.fatal = void 0;
      return message;
    }
    /**
     * Create a message for `reason` associated with the file.
     *
     * The `fatal` field of the message is set to `false` (warning; change may be
     * needed) and the `file` field is set to the current file path.
     * The message is added to the `messages` field on `file`.
     *
     * > 🪦 **Note**: also has obsolete signatures.
     *
     * @overload
     * @param {string} reason
     * @param {MessageOptions | null | undefined} [options]
     * @returns {VFileMessage}
     *
     * @overload
     * @param {string} reason
     * @param {Node | NodeLike | null | undefined} parent
     * @param {string | null | undefined} [origin]
     * @returns {VFileMessage}
     *
     * @overload
     * @param {string} reason
     * @param {Point | Position | null | undefined} place
     * @param {string | null | undefined} [origin]
     * @returns {VFileMessage}
     *
     * @overload
     * @param {string} reason
     * @param {string | null | undefined} [origin]
     * @returns {VFileMessage}
     *
     * @overload
     * @param {Error | VFileMessage} cause
     * @param {Node | NodeLike | null | undefined} parent
     * @param {string | null | undefined} [origin]
     * @returns {VFileMessage}
     *
     * @overload
     * @param {Error | VFileMessage} cause
     * @param {Point | Position | null | undefined} place
     * @param {string | null | undefined} [origin]
     * @returns {VFileMessage}
     *
     * @overload
     * @param {Error | VFileMessage} cause
     * @param {string | null | undefined} [origin]
     * @returns {VFileMessage}
     *
     * @param {Error | VFileMessage | string} causeOrReason
     *   Reason for message, should use markdown.
     * @param {Node | NodeLike | MessageOptions | Point | Position | string | null | undefined} [optionsOrParentOrPlace]
     *   Configuration (optional).
     * @param {string | null | undefined} [origin]
     *   Place in code where the message originates (example:
     *   `'my-package:my-rule'` or `'my-rule'`).
     * @returns {VFileMessage}
     *   Message.
     */
    message(causeOrReason, optionsOrParentOrPlace, origin) {
      const message = new VFileMessage(
        // @ts-expect-error: the overloads are fine.
        causeOrReason,
        optionsOrParentOrPlace,
        origin
      );
      if (this.path) {
        message.name = this.path + ":" + message.name;
        message.file = this.path;
      }
      message.fatal = false;
      this.messages.push(message);
      return message;
    }
    /**
     * Serialize the file.
     *
     * > **Note**: which encodings are supported depends on the engine.
     * > For info on Node.js, see:
     * > <https://nodejs.org/api/util.html#whatwg-supported-encodings>.
     *
     * @param {string | null | undefined} [encoding='utf8']
     *   Character encoding to understand `value` as when it’s a `Uint8Array`
     *   (default: `'utf-8'`).
     * @returns {string}
     *   Serialized file.
     */
    toString(encoding) {
      if (this.value === void 0) {
        return "";
      }
      if (typeof this.value === "string") {
        return this.value;
      }
      const decoder = new TextDecoder(encoding || void 0);
      return decoder.decode(this.value);
    }
  };
  function assertPart(part, name) {
    if (part && part.includes(minpath.sep)) {
      throw new Error(
        "`" + name + "` cannot be a path: did not expect `" + minpath.sep + "`"
      );
    }
  }
  function assertNonEmpty(part, name) {
    if (!part) {
      throw new Error("`" + name + "` cannot be empty");
    }
  }
  function assertPath2(path2, name) {
    if (!path2) {
      throw new Error("Setting `" + name + "` requires `path` to be set too");
    }
  }
  function isUint8Array(value) {
    return Boolean(
      value && typeof value === "object" && "byteLength" in value && "byteOffset" in value
    );
  }

  // node_modules/unified/lib/callable-instance.js
  var CallableInstance = (
    /**
     * @type {new <Parameters extends Array<unknown>, Result>(property: string | symbol) => (...parameters: Parameters) => Result}
     */
    /** @type {unknown} */
    /**
     * @this {Function}
     * @param {string | symbol} property
     * @returns {(...parameters: Array<unknown>) => unknown}
     */
    (function(property) {
      const self2 = this;
      const constr = self2.constructor;
      const proto = (
        /** @type {Record<string | symbol, Function>} */
        // Prototypes do exist.
        // type-coverage:ignore-next-line
        constr.prototype
      );
      const value = proto[property];
      const apply = function() {
        return value.apply(apply, arguments);
      };
      Object.setPrototypeOf(apply, proto);
      return apply;
    })
  );

  // node_modules/unified/lib/index.js
  var own = {}.hasOwnProperty;
  var Processor = class _Processor extends CallableInstance {
    /**
     * Create a processor.
     */
    constructor() {
      super("copy");
      this.Compiler = void 0;
      this.Parser = void 0;
      this.attachers = [];
      this.compiler = void 0;
      this.freezeIndex = -1;
      this.frozen = void 0;
      this.namespace = {};
      this.parser = void 0;
      this.transformers = trough();
    }
    /**
     * Copy a processor.
     *
     * @deprecated
     *   This is a private internal method and should not be used.
     * @returns {Processor<ParseTree, HeadTree, TailTree, CompileTree, CompileResult>}
     *   New *unfrozen* processor ({@linkcode Processor}) that is
     *   configured to work the same as its ancestor.
     *   When the descendant processor is configured in the future it does not
     *   affect the ancestral processor.
     */
    copy() {
      const destination = (
        /** @type {Processor<ParseTree, HeadTree, TailTree, CompileTree, CompileResult>} */
        new _Processor()
      );
      let index2 = -1;
      while (++index2 < this.attachers.length) {
        const attacher = this.attachers[index2];
        destination.use(...attacher);
      }
      destination.data((0, import_extend.default)(true, {}, this.namespace));
      return destination;
    }
    /**
     * Configure the processor with info available to all plugins.
     * Information is stored in an object.
     *
     * Typically, options can be given to a specific plugin, but sometimes it
     * makes sense to have information shared with several plugins.
     * For example, a list of HTML elements that are self-closing, which is
     * needed during all phases.
     *
     * > **Note**: setting information cannot occur on *frozen* processors.
     * > Call the processor first to create a new unfrozen processor.
     *
     * > **Note**: to register custom data in TypeScript, augment the
     * > {@linkcode Data} interface.
     *
     * @example
     *   This example show how to get and set info:
     *
     *   ```js
     *   import {unified} from 'unified'
     *
     *   const processor = unified().data('alpha', 'bravo')
     *
     *   processor.data('alpha') // => 'bravo'
     *
     *   processor.data() // => {alpha: 'bravo'}
     *
     *   processor.data({charlie: 'delta'})
     *
     *   processor.data() // => {charlie: 'delta'}
     *   ```
     *
     * @template {keyof Data} Key
     *
     * @overload
     * @returns {Data}
     *
     * @overload
     * @param {Data} dataset
     * @returns {Processor<ParseTree, HeadTree, TailTree, CompileTree, CompileResult>}
     *
     * @overload
     * @param {Key} key
     * @returns {Data[Key]}
     *
     * @overload
     * @param {Key} key
     * @param {Data[Key]} value
     * @returns {Processor<ParseTree, HeadTree, TailTree, CompileTree, CompileResult>}
     *
     * @param {Data | Key} [key]
     *   Key to get or set, or entire dataset to set, or nothing to get the
     *   entire dataset (optional).
     * @param {Data[Key]} [value]
     *   Value to set (optional).
     * @returns {unknown}
     *   The current processor when setting, the value at `key` when getting, or
     *   the entire dataset when getting without key.
     */
    data(key2, value) {
      if (typeof key2 === "string") {
        if (arguments.length === 2) {
          assertUnfrozen("data", this.frozen);
          this.namespace[key2] = value;
          return this;
        }
        return own.call(this.namespace, key2) && this.namespace[key2] || void 0;
      }
      if (key2) {
        assertUnfrozen("data", this.frozen);
        this.namespace = key2;
        return this;
      }
      return this.namespace;
    }
    /**
     * Freeze a processor.
     *
     * Frozen processors are meant to be extended and not to be configured
     * directly.
     *
     * When a processor is frozen it cannot be unfrozen.
     * New processors working the same way can be created by calling the
     * processor.
     *
     * It’s possible to freeze processors explicitly by calling `.freeze()`.
     * Processors freeze automatically when `.parse()`, `.run()`, `.runSync()`,
     * `.stringify()`, `.process()`, or `.processSync()` are called.
     *
     * @returns {Processor<ParseTree, HeadTree, TailTree, CompileTree, CompileResult>}
     *   The current processor.
     */
    freeze() {
      if (this.frozen) {
        return this;
      }
      const self2 = (
        /** @type {Processor} */
        /** @type {unknown} */
        this
      );
      while (++this.freezeIndex < this.attachers.length) {
        const [attacher, ...options] = this.attachers[this.freezeIndex];
        if (options[0] === false) {
          continue;
        }
        if (options[0] === true) {
          options[0] = void 0;
        }
        const transformer = attacher.call(self2, ...options);
        if (typeof transformer === "function") {
          this.transformers.use(transformer);
        }
      }
      this.frozen = true;
      this.freezeIndex = Number.POSITIVE_INFINITY;
      return this;
    }
    /**
     * Parse text to a syntax tree.
     *
     * > **Note**: `parse` freezes the processor if not already *frozen*.
     *
     * > **Note**: `parse` performs the parse phase, not the run phase or other
     * > phases.
     *
     * @param {Compatible | undefined} [file]
     *   file to parse (optional); typically `string` or `VFile`; any value
     *   accepted as `x` in `new VFile(x)`.
     * @returns {ParseTree extends undefined ? Node : ParseTree}
     *   Syntax tree representing `file`.
     */
    parse(file) {
      this.freeze();
      const realFile = vfile(file);
      const parser2 = this.parser || this.Parser;
      assertParser("parse", parser2);
      return parser2(String(realFile), realFile);
    }
    /**
     * Process the given file as configured on the processor.
     *
     * > **Note**: `process` freezes the processor if not already *frozen*.
     *
     * > **Note**: `process` performs the parse, run, and stringify phases.
     *
     * @overload
     * @param {Compatible | undefined} file
     * @param {ProcessCallback<VFileWithOutput<CompileResult>>} done
     * @returns {undefined}
     *
     * @overload
     * @param {Compatible | undefined} [file]
     * @returns {Promise<VFileWithOutput<CompileResult>>}
     *
     * @param {Compatible | undefined} [file]
     *   File (optional); typically `string` or `VFile`]; any value accepted as
     *   `x` in `new VFile(x)`.
     * @param {ProcessCallback<VFileWithOutput<CompileResult>> | undefined} [done]
     *   Callback (optional).
     * @returns {Promise<VFile> | undefined}
     *   Nothing if `done` is given.
     *   Otherwise a promise, rejected with a fatal error or resolved with the
     *   processed file.
     *
     *   The parsed, transformed, and compiled value is available at
     *   `file.value` (see note).
     *
     *   > **Note**: unified typically compiles by serializing: most
     *   > compilers return `string` (or `Uint8Array`).
     *   > Some compilers, such as the one configured with
     *   > [`rehype-react`][rehype-react], return other values (in this case, a
     *   > React tree).
     *   > If you’re using a compiler that doesn’t serialize, expect different
     *   > result values.
     *   >
     *   > To register custom results in TypeScript, add them to
     *   > {@linkcode CompileResultMap}.
     *
     *   [rehype-react]: https://github.com/rehypejs/rehype-react
     */
    process(file, done) {
      const self2 = this;
      this.freeze();
      assertParser("process", this.parser || this.Parser);
      assertCompiler("process", this.compiler || this.Compiler);
      return done ? executor(void 0, done) : new Promise(executor);
      function executor(resolve, reject) {
        const realFile = vfile(file);
        const parseTree = (
          /** @type {HeadTree extends undefined ? Node : HeadTree} */
          /** @type {unknown} */
          self2.parse(realFile)
        );
        self2.run(parseTree, realFile, function(error, tree, file2) {
          if (error || !tree || !file2) {
            return realDone(error);
          }
          const compileTree = (
            /** @type {CompileTree extends undefined ? Node : CompileTree} */
            /** @type {unknown} */
            tree
          );
          const compileResult = self2.stringify(compileTree, file2);
          if (looksLikeAValue(compileResult)) {
            file2.value = compileResult;
          } else {
            file2.result = compileResult;
          }
          realDone(
            error,
            /** @type {VFileWithOutput<CompileResult>} */
            file2
          );
        });
        function realDone(error, file2) {
          if (error || !file2) {
            reject(error);
          } else if (resolve) {
            resolve(file2);
          } else {
            ok(done, "`done` is defined if `resolve` is not");
            done(void 0, file2);
          }
        }
      }
    }
    /**
     * Process the given file as configured on the processor.
     *
     * An error is thrown if asynchronous transforms are configured.
     *
     * > **Note**: `processSync` freezes the processor if not already *frozen*.
     *
     * > **Note**: `processSync` performs the parse, run, and stringify phases.
     *
     * @param {Compatible | undefined} [file]
     *   File (optional); typically `string` or `VFile`; any value accepted as
     *   `x` in `new VFile(x)`.
     * @returns {VFileWithOutput<CompileResult>}
     *   The processed file.
     *
     *   The parsed, transformed, and compiled value is available at
     *   `file.value` (see note).
     *
     *   > **Note**: unified typically compiles by serializing: most
     *   > compilers return `string` (or `Uint8Array`).
     *   > Some compilers, such as the one configured with
     *   > [`rehype-react`][rehype-react], return other values (in this case, a
     *   > React tree).
     *   > If you’re using a compiler that doesn’t serialize, expect different
     *   > result values.
     *   >
     *   > To register custom results in TypeScript, add them to
     *   > {@linkcode CompileResultMap}.
     *
     *   [rehype-react]: https://github.com/rehypejs/rehype-react
     */
    processSync(file) {
      let complete = false;
      let result;
      this.freeze();
      assertParser("processSync", this.parser || this.Parser);
      assertCompiler("processSync", this.compiler || this.Compiler);
      this.process(file, realDone);
      assertDone("processSync", "process", complete);
      ok(result, "we either bailed on an error or have a tree");
      return result;
      function realDone(error, file2) {
        complete = true;
        bail(error);
        result = file2;
      }
    }
    /**
     * Run *transformers* on a syntax tree.
     *
     * > **Note**: `run` freezes the processor if not already *frozen*.
     *
     * > **Note**: `run` performs the run phase, not other phases.
     *
     * @overload
     * @param {HeadTree extends undefined ? Node : HeadTree} tree
     * @param {RunCallback<TailTree extends undefined ? Node : TailTree>} done
     * @returns {undefined}
     *
     * @overload
     * @param {HeadTree extends undefined ? Node : HeadTree} tree
     * @param {Compatible | undefined} file
     * @param {RunCallback<TailTree extends undefined ? Node : TailTree>} done
     * @returns {undefined}
     *
     * @overload
     * @param {HeadTree extends undefined ? Node : HeadTree} tree
     * @param {Compatible | undefined} [file]
     * @returns {Promise<TailTree extends undefined ? Node : TailTree>}
     *
     * @param {HeadTree extends undefined ? Node : HeadTree} tree
     *   Tree to transform and inspect.
     * @param {(
     *   RunCallback<TailTree extends undefined ? Node : TailTree> |
     *   Compatible
     * )} [file]
     *   File associated with `node` (optional); any value accepted as `x` in
     *   `new VFile(x)`.
     * @param {RunCallback<TailTree extends undefined ? Node : TailTree>} [done]
     *   Callback (optional).
     * @returns {Promise<TailTree extends undefined ? Node : TailTree> | undefined}
     *   Nothing if `done` is given.
     *   Otherwise, a promise rejected with a fatal error or resolved with the
     *   transformed tree.
     */
    run(tree, file, done) {
      assertNode(tree);
      this.freeze();
      const transformers = this.transformers;
      if (!done && typeof file === "function") {
        done = file;
        file = void 0;
      }
      return done ? executor(void 0, done) : new Promise(executor);
      function executor(resolve, reject) {
        ok(
          typeof file !== "function",
          "`file` can\u2019t be a `done` anymore, we checked"
        );
        const realFile = vfile(file);
        transformers.run(tree, realFile, realDone);
        function realDone(error, outputTree, file2) {
          const resultingTree = (
            /** @type {TailTree extends undefined ? Node : TailTree} */
            outputTree || tree
          );
          if (error) {
            reject(error);
          } else if (resolve) {
            resolve(resultingTree);
          } else {
            ok(done, "`done` is defined if `resolve` is not");
            done(void 0, resultingTree, file2);
          }
        }
      }
    }
    /**
     * Run *transformers* on a syntax tree.
     *
     * An error is thrown if asynchronous transforms are configured.
     *
     * > **Note**: `runSync` freezes the processor if not already *frozen*.
     *
     * > **Note**: `runSync` performs the run phase, not other phases.
     *
     * @param {HeadTree extends undefined ? Node : HeadTree} tree
     *   Tree to transform and inspect.
     * @param {Compatible | undefined} [file]
     *   File associated with `node` (optional); any value accepted as `x` in
     *   `new VFile(x)`.
     * @returns {TailTree extends undefined ? Node : TailTree}
     *   Transformed tree.
     */
    runSync(tree, file) {
      let complete = false;
      let result;
      this.run(tree, file, realDone);
      assertDone("runSync", "run", complete);
      ok(result, "we either bailed on an error or have a tree");
      return result;
      function realDone(error, tree2) {
        bail(error);
        result = tree2;
        complete = true;
      }
    }
    /**
     * Compile a syntax tree.
     *
     * > **Note**: `stringify` freezes the processor if not already *frozen*.
     *
     * > **Note**: `stringify` performs the stringify phase, not the run phase
     * > or other phases.
     *
     * @param {CompileTree extends undefined ? Node : CompileTree} tree
     *   Tree to compile.
     * @param {Compatible | undefined} [file]
     *   File associated with `node` (optional); any value accepted as `x` in
     *   `new VFile(x)`.
     * @returns {CompileResult extends undefined ? Value : CompileResult}
     *   Textual representation of the tree (see note).
     *
     *   > **Note**: unified typically compiles by serializing: most compilers
     *   > return `string` (or `Uint8Array`).
     *   > Some compilers, such as the one configured with
     *   > [`rehype-react`][rehype-react], return other values (in this case, a
     *   > React tree).
     *   > If you’re using a compiler that doesn’t serialize, expect different
     *   > result values.
     *   >
     *   > To register custom results in TypeScript, add them to
     *   > {@linkcode CompileResultMap}.
     *
     *   [rehype-react]: https://github.com/rehypejs/rehype-react
     */
    stringify(tree, file) {
      this.freeze();
      const realFile = vfile(file);
      const compiler2 = this.compiler || this.Compiler;
      assertCompiler("stringify", compiler2);
      assertNode(tree);
      return compiler2(tree, realFile);
    }
    /**
     * Configure the processor to use a plugin, a list of usable values, or a
     * preset.
     *
     * If the processor is already using a plugin, the previous plugin
     * configuration is changed based on the options that are passed in.
     * In other words, the plugin is not added a second time.
     *
     * > **Note**: `use` cannot be called on *frozen* processors.
     * > Call the processor first to create a new unfrozen processor.
     *
     * @example
     *   There are many ways to pass plugins to `.use()`.
     *   This example gives an overview:
     *
     *   ```js
     *   import {unified} from 'unified'
     *
     *   unified()
     *     // Plugin with options:
     *     .use(pluginA, {x: true, y: true})
     *     // Passing the same plugin again merges configuration (to `{x: true, y: false, z: true}`):
     *     .use(pluginA, {y: false, z: true})
     *     // Plugins:
     *     .use([pluginB, pluginC])
     *     // Two plugins, the second with options:
     *     .use([pluginD, [pluginE, {}]])
     *     // Preset with plugins and settings:
     *     .use({plugins: [pluginF, [pluginG, {}]], settings: {position: false}})
     *     // Settings only:
     *     .use({settings: {position: false}})
     *   ```
     *
     * @template {Array<unknown>} [Parameters=[]]
     * @template {Node | string | undefined} [Input=undefined]
     * @template [Output=Input]
     *
     * @overload
     * @param {Preset | null | undefined} [preset]
     * @returns {Processor<ParseTree, HeadTree, TailTree, CompileTree, CompileResult>}
     *
     * @overload
     * @param {PluggableList} list
     * @returns {Processor<ParseTree, HeadTree, TailTree, CompileTree, CompileResult>}
     *
     * @overload
     * @param {Plugin<Parameters, Input, Output>} plugin
     * @param {...(Parameters | [boolean])} parameters
     * @returns {UsePlugin<ParseTree, HeadTree, TailTree, CompileTree, CompileResult, Input, Output>}
     *
     * @param {PluggableList | Plugin | Preset | null | undefined} value
     *   Usable value.
     * @param {...unknown} parameters
     *   Parameters, when a plugin is given as a usable value.
     * @returns {Processor<ParseTree, HeadTree, TailTree, CompileTree, CompileResult>}
     *   Current processor.
     */
    use(value, ...parameters) {
      const attachers = this.attachers;
      const namespace = this.namespace;
      assertUnfrozen("use", this.frozen);
      if (value === null || value === void 0) {
      } else if (typeof value === "function") {
        addPlugin(value, parameters);
      } else if (typeof value === "object") {
        if (Array.isArray(value)) {
          addList(value);
        } else {
          addPreset(value);
        }
      } else {
        throw new TypeError("Expected usable value, not `" + value + "`");
      }
      return this;
      function add(value2) {
        if (typeof value2 === "function") {
          addPlugin(value2, []);
        } else if (typeof value2 === "object") {
          if (Array.isArray(value2)) {
            const [plugin, ...parameters2] = (
              /** @type {PluginTuple<Array<unknown>>} */
              value2
            );
            addPlugin(plugin, parameters2);
          } else {
            addPreset(value2);
          }
        } else {
          throw new TypeError("Expected usable value, not `" + value2 + "`");
        }
      }
      function addPreset(result) {
        if (!("plugins" in result) && !("settings" in result)) {
          throw new Error(
            "Expected usable value but received an empty preset, which is probably a mistake: presets typically come with `plugins` and sometimes with `settings`, but this has neither"
          );
        }
        addList(result.plugins);
        if (result.settings) {
          namespace.settings = (0, import_extend.default)(true, namespace.settings, result.settings);
        }
      }
      function addList(plugins) {
        let index2 = -1;
        if (plugins === null || plugins === void 0) {
        } else if (Array.isArray(plugins)) {
          while (++index2 < plugins.length) {
            const thing = plugins[index2];
            add(thing);
          }
        } else {
          throw new TypeError("Expected a list of plugins, not `" + plugins + "`");
        }
      }
      function addPlugin(plugin, parameters2) {
        let index2 = -1;
        let entryIndex = -1;
        while (++index2 < attachers.length) {
          if (attachers[index2][0] === plugin) {
            entryIndex = index2;
            break;
          }
        }
        if (entryIndex === -1) {
          attachers.push([plugin, ...parameters2]);
        } else if (parameters2.length > 0) {
          let [primary, ...rest] = parameters2;
          const currentPrimary = attachers[entryIndex][1];
          if (isPlainObject(currentPrimary) && isPlainObject(primary)) {
            primary = (0, import_extend.default)(true, currentPrimary, primary);
          }
          attachers[entryIndex] = [plugin, primary, ...rest];
        }
      }
    }
  };
  var unified = new Processor().freeze();
  function assertParser(name, value) {
    if (typeof value !== "function") {
      throw new TypeError("Cannot `" + name + "` without `parser`");
    }
  }
  function assertCompiler(name, value) {
    if (typeof value !== "function") {
      throw new TypeError("Cannot `" + name + "` without `compiler`");
    }
  }
  function assertUnfrozen(name, frozen) {
    if (frozen) {
      throw new Error(
        "Cannot call `" + name + "` on a frozen processor.\nCreate a new processor first, by calling it: use `processor()` instead of `processor`."
      );
    }
  }
  function assertNode(node2) {
    if (!isPlainObject(node2) || typeof node2.type !== "string") {
      throw new TypeError("Expected node, got `" + node2 + "`");
    }
  }
  function assertDone(name, asyncName, complete) {
    if (!complete) {
      throw new Error(
        "`" + name + "` finished async. Use `" + asyncName + "` instead"
      );
    }
  }
  function vfile(value) {
    return looksLikeAVFile(value) ? value : new VFile(value);
  }
  function looksLikeAVFile(value) {
    return Boolean(
      value && typeof value === "object" && "message" in value && "messages" in value
    );
  }
  function looksLikeAValue(value) {
    return typeof value === "string" || isUint8Array2(value);
  }
  function isUint8Array2(value) {
    return Boolean(
      value && typeof value === "object" && "byteLength" in value && "byteOffset" in value
    );
  }

  // node_modules/mdast-util-to-string/lib/index.js
  var emptyOptions = {};
  function toString(value, options) {
    const settings = options || emptyOptions;
    const includeImageAlt = typeof settings.includeImageAlt === "boolean" ? settings.includeImageAlt : true;
    const includeHtml = typeof settings.includeHtml === "boolean" ? settings.includeHtml : true;
    return one(value, includeImageAlt, includeHtml);
  }
  function one(value, includeImageAlt, includeHtml) {
    if (node(value)) {
      if ("value" in value) {
        return value.type === "html" && !includeHtml ? "" : value.value;
      }
      if (includeImageAlt && "alt" in value && value.alt) {
        return value.alt;
      }
      if ("children" in value) {
        return all(value.children, includeImageAlt, includeHtml);
      }
    }
    if (Array.isArray(value)) {
      return all(value, includeImageAlt, includeHtml);
    }
    return "";
  }
  function all(values, includeImageAlt, includeHtml) {
    const result = [];
    let index2 = -1;
    while (++index2 < values.length) {
      result[index2] = one(values[index2], includeImageAlt, includeHtml);
    }
    return result.join("");
  }
  function node(value) {
    return Boolean(value && typeof value === "object");
  }

  // node_modules/decode-named-character-reference/index.dom.js
  var element = document.createElement("i");
  function decodeNamedCharacterReference(value) {
    const characterReference2 = "&" + value + ";";
    element.innerHTML = characterReference2;
    const character = element.textContent;
    if (character.charCodeAt(character.length - 1) === 59 && value !== "semi") {
      return false;
    }
    return character === characterReference2 ? false : character;
  }

  // node_modules/micromark-util-chunked/index.js
  function splice(list4, start, remove, items) {
    const end = list4.length;
    let chunkStart = 0;
    let parameters;
    if (start < 0) {
      start = -start > end ? 0 : end + start;
    } else {
      start = start > end ? end : start;
    }
    remove = remove > 0 ? remove : 0;
    if (items.length < 1e4) {
      parameters = Array.from(items);
      parameters.unshift(start, remove);
      list4.splice(...parameters);
    } else {
      if (remove) list4.splice(start, remove);
      while (chunkStart < items.length) {
        parameters = items.slice(chunkStart, chunkStart + 1e4);
        parameters.unshift(start, 0);
        list4.splice(...parameters);
        chunkStart += 1e4;
        start += 1e4;
      }
    }
  }
  function push(list4, items) {
    if (list4.length > 0) {
      splice(list4, list4.length, 0, items);
      return list4;
    }
    return items;
  }

  // node_modules/micromark-util-combine-extensions/index.js
  var hasOwnProperty = {}.hasOwnProperty;
  function combineExtensions(extensions) {
    const all4 = {};
    let index2 = -1;
    while (++index2 < extensions.length) {
      syntaxExtension(all4, extensions[index2]);
    }
    return all4;
  }
  function syntaxExtension(all4, extension2) {
    let hook;
    for (hook in extension2) {
      const maybe = hasOwnProperty.call(all4, hook) ? all4[hook] : void 0;
      const left = maybe || (all4[hook] = {});
      const right = extension2[hook];
      let code4;
      if (right) {
        for (code4 in right) {
          if (!hasOwnProperty.call(left, code4)) left[code4] = [];
          const value = right[code4];
          constructs(
            // @ts-expect-error Looks like a list.
            left[code4],
            Array.isArray(value) ? value : value ? [value] : []
          );
        }
      }
    }
  }
  function constructs(existing, list4) {
    let index2 = -1;
    const before = [];
    while (++index2 < list4.length) {
      ;
      (list4[index2].add === "after" ? existing : before).push(list4[index2]);
    }
    splice(existing, 0, 0, before);
  }

  // node_modules/micromark-util-decode-numeric-character-reference/index.js
  function decodeNumericCharacterReference(value, base) {
    const code4 = Number.parseInt(value, base);
    if (
      // C0 except for HT, LF, FF, CR, space.
      code4 < 9 || code4 === 11 || code4 > 13 && code4 < 32 || // Control character (DEL) of C0, and C1 controls.
      code4 > 126 && code4 < 160 || // Lone high surrogates and low surrogates.
      code4 > 55295 && code4 < 57344 || // Noncharacters.
      code4 > 64975 && code4 < 65008 || /* eslint-disable no-bitwise */
      (code4 & 65535) === 65535 || (code4 & 65535) === 65534 || /* eslint-enable no-bitwise */
      // Out of range
      code4 > 1114111
    ) {
      return "\uFFFD";
    }
    return String.fromCodePoint(code4);
  }

  // node_modules/micromark-util-normalize-identifier/index.js
  function normalizeIdentifier(value) {
    return value.replace(/[\t\n\r ]+/g, " ").replace(/^ | $/g, "").toLowerCase().toUpperCase();
  }

  // node_modules/micromark-util-character/index.js
  var asciiAlpha = regexCheck(/[A-Za-z]/);
  var asciiAlphanumeric = regexCheck(/[\dA-Za-z]/);
  var asciiAtext = regexCheck(/[#-'*+\--9=?A-Z^-~]/);
  function asciiControl(code4) {
    return (
      // Special whitespace codes (which have negative values), C0 and Control
      // character DEL
      code4 !== null && (code4 < 32 || code4 === 127)
    );
  }
  var asciiDigit = regexCheck(/\d/);
  var asciiHexDigit = regexCheck(/[\dA-Fa-f]/);
  var asciiPunctuation = regexCheck(/[!-/:-@[-`{-~]/);
  function markdownLineEnding(code4) {
    return code4 !== null && code4 < -2;
  }
  function markdownLineEndingOrSpace(code4) {
    return code4 !== null && (code4 < 0 || code4 === 32);
  }
  function markdownSpace(code4) {
    return code4 === -2 || code4 === -1 || code4 === 32;
  }
  var unicodePunctuation = regexCheck(/\p{P}|\p{S}/u);
  var unicodeWhitespace = regexCheck(/\s/);
  function regexCheck(regex) {
    return check;
    function check(code4) {
      return code4 !== null && code4 > -1 && regex.test(String.fromCharCode(code4));
    }
  }

  // node_modules/micromark-util-sanitize-uri/index.js
  function normalizeUri(value) {
    const result = [];
    let index2 = -1;
    let start = 0;
    let skip = 0;
    while (++index2 < value.length) {
      const code4 = value.charCodeAt(index2);
      let replace2 = "";
      if (code4 === 37 && asciiAlphanumeric(value.charCodeAt(index2 + 1)) && asciiAlphanumeric(value.charCodeAt(index2 + 2))) {
        skip = 2;
      } else if (code4 < 128) {
        if (!/[!#$&-;=?-Z_a-z~]/.test(String.fromCharCode(code4))) {
          replace2 = String.fromCharCode(code4);
        }
      } else if (code4 > 55295 && code4 < 57344) {
        const next = value.charCodeAt(index2 + 1);
        if (code4 < 56320 && next > 56319 && next < 57344) {
          replace2 = String.fromCharCode(code4, next);
          skip = 1;
        } else {
          replace2 = "\uFFFD";
        }
      } else {
        replace2 = String.fromCharCode(code4);
      }
      if (replace2) {
        result.push(value.slice(start, index2), encodeURIComponent(replace2));
        start = index2 + skip + 1;
        replace2 = "";
      }
      if (skip) {
        index2 += skip;
        skip = 0;
      }
    }
    return result.join("") + value.slice(start);
  }

  // node_modules/micromark-factory-space/index.js
  function factorySpace(effects, ok3, type, max) {
    const limit = max ? max - 1 : Number.POSITIVE_INFINITY;
    let size = 0;
    return start;
    function start(code4) {
      if (markdownSpace(code4)) {
        effects.enter(type);
        return prefix(code4);
      }
      return ok3(code4);
    }
    function prefix(code4) {
      if (markdownSpace(code4) && size++ < limit) {
        effects.consume(code4);
        return prefix;
      }
      effects.exit(type);
      return ok3(code4);
    }
  }

  // node_modules/micromark/lib/initialize/content.js
  var content = {
    tokenize: initializeContent
  };
  function initializeContent(effects) {
    const contentStart = effects.attempt(this.parser.constructs.contentInitial, afterContentStartConstruct, paragraphInitial);
    let previous4;
    return contentStart;
    function afterContentStartConstruct(code4) {
      if (code4 === null) {
        effects.consume(code4);
        return;
      }
      effects.enter("lineEnding");
      effects.consume(code4);
      effects.exit("lineEnding");
      return factorySpace(effects, contentStart, "linePrefix");
    }
    function paragraphInitial(code4) {
      effects.enter("paragraph");
      return lineStart(code4);
    }
    function lineStart(code4) {
      const token = effects.enter("chunkText", {
        contentType: "text",
        previous: previous4
      });
      if (previous4) {
        previous4.next = token;
      }
      previous4 = token;
      return data(code4);
    }
    function data(code4) {
      if (code4 === null) {
        effects.exit("chunkText");
        effects.exit("paragraph");
        effects.consume(code4);
        return;
      }
      if (markdownLineEnding(code4)) {
        effects.consume(code4);
        effects.exit("chunkText");
        return lineStart;
      }
      effects.consume(code4);
      return data;
    }
  }

  // node_modules/micromark/lib/initialize/document.js
  var document2 = {
    tokenize: initializeDocument
  };
  var containerConstruct = {
    tokenize: tokenizeContainer
  };
  function initializeDocument(effects) {
    const self2 = this;
    const stack = [];
    let continued = 0;
    let childFlow;
    let childToken;
    let lineStartOffset;
    return start;
    function start(code4) {
      if (continued < stack.length) {
        const item = stack[continued];
        self2.containerState = item[1];
        return effects.attempt(item[0].continuation, documentContinue, checkNewContainers)(code4);
      }
      return checkNewContainers(code4);
    }
    function documentContinue(code4) {
      continued++;
      if (self2.containerState._closeFlow) {
        self2.containerState._closeFlow = void 0;
        if (childFlow) {
          closeFlow();
        }
        const indexBeforeExits = self2.events.length;
        let indexBeforeFlow = indexBeforeExits;
        let point4;
        while (indexBeforeFlow--) {
          if (self2.events[indexBeforeFlow][0] === "exit" && self2.events[indexBeforeFlow][1].type === "chunkFlow") {
            point4 = self2.events[indexBeforeFlow][1].end;
            break;
          }
        }
        exitContainers(continued);
        let index2 = indexBeforeExits;
        while (index2 < self2.events.length) {
          self2.events[index2][1].end = {
            ...point4
          };
          index2++;
        }
        splice(self2.events, indexBeforeFlow + 1, 0, self2.events.slice(indexBeforeExits));
        self2.events.length = index2;
        return checkNewContainers(code4);
      }
      return start(code4);
    }
    function checkNewContainers(code4) {
      if (continued === stack.length) {
        if (!childFlow) {
          return documentContinued(code4);
        }
        if (childFlow.currentConstruct && childFlow.currentConstruct.concrete) {
          return flowStart(code4);
        }
        self2.interrupt = Boolean(childFlow.currentConstruct && !childFlow._gfmTableDynamicInterruptHack);
      }
      self2.containerState = {};
      return effects.check(containerConstruct, thereIsANewContainer, thereIsNoNewContainer)(code4);
    }
    function thereIsANewContainer(code4) {
      if (childFlow) closeFlow();
      exitContainers(continued);
      return documentContinued(code4);
    }
    function thereIsNoNewContainer(code4) {
      self2.parser.lazy[self2.now().line] = continued !== stack.length;
      lineStartOffset = self2.now().offset;
      return flowStart(code4);
    }
    function documentContinued(code4) {
      self2.containerState = {};
      return effects.attempt(containerConstruct, containerContinue, flowStart)(code4);
    }
    function containerContinue(code4) {
      continued++;
      stack.push([self2.currentConstruct, self2.containerState]);
      return documentContinued(code4);
    }
    function flowStart(code4) {
      if (code4 === null) {
        if (childFlow) closeFlow();
        exitContainers(0);
        effects.consume(code4);
        return;
      }
      childFlow = childFlow || self2.parser.flow(self2.now());
      effects.enter("chunkFlow", {
        _tokenizer: childFlow,
        contentType: "flow",
        previous: childToken
      });
      return flowContinue(code4);
    }
    function flowContinue(code4) {
      if (code4 === null) {
        writeToChild(effects.exit("chunkFlow"), true);
        exitContainers(0);
        effects.consume(code4);
        return;
      }
      if (markdownLineEnding(code4)) {
        effects.consume(code4);
        writeToChild(effects.exit("chunkFlow"));
        continued = 0;
        self2.interrupt = void 0;
        return start;
      }
      effects.consume(code4);
      return flowContinue;
    }
    function writeToChild(token, endOfFile) {
      const stream = self2.sliceStream(token);
      if (endOfFile) stream.push(null);
      token.previous = childToken;
      if (childToken) childToken.next = token;
      childToken = token;
      childFlow.defineSkip(token.start);
      childFlow.write(stream);
      if (self2.parser.lazy[token.start.line]) {
        let index2 = childFlow.events.length;
        while (index2--) {
          if (
            // The token starts before the line ending…
            childFlow.events[index2][1].start.offset < lineStartOffset && // …and either is not ended yet…
            (!childFlow.events[index2][1].end || // …or ends after it.
            childFlow.events[index2][1].end.offset > lineStartOffset)
          ) {
            return;
          }
        }
        const indexBeforeExits = self2.events.length;
        let indexBeforeFlow = indexBeforeExits;
        let seen;
        let point4;
        while (indexBeforeFlow--) {
          if (self2.events[indexBeforeFlow][0] === "exit" && self2.events[indexBeforeFlow][1].type === "chunkFlow") {
            if (seen) {
              point4 = self2.events[indexBeforeFlow][1].end;
              break;
            }
            seen = true;
          }
        }
        exitContainers(continued);
        index2 = indexBeforeExits;
        while (index2 < self2.events.length) {
          self2.events[index2][1].end = {
            ...point4
          };
          index2++;
        }
        splice(self2.events, indexBeforeFlow + 1, 0, self2.events.slice(indexBeforeExits));
        self2.events.length = index2;
      }
    }
    function exitContainers(size) {
      let index2 = stack.length;
      while (index2-- > size) {
        const entry = stack[index2];
        self2.containerState = entry[1];
        entry[0].exit.call(self2, effects);
      }
      stack.length = size;
    }
    function closeFlow() {
      childFlow.write([null]);
      childToken = void 0;
      childFlow = void 0;
      self2.containerState._closeFlow = void 0;
    }
  }
  function tokenizeContainer(effects, ok3, nok) {
    return factorySpace(effects, effects.attempt(this.parser.constructs.document, ok3, nok), "linePrefix", this.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4);
  }

  // node_modules/micromark-util-classify-character/index.js
  function classifyCharacter(code4) {
    if (code4 === null || markdownLineEndingOrSpace(code4) || unicodeWhitespace(code4)) {
      return 1;
    }
    if (unicodePunctuation(code4)) {
      return 2;
    }
  }

  // node_modules/micromark-util-resolve-all/index.js
  function resolveAll(constructs2, events, context) {
    const called = [];
    let index2 = -1;
    while (++index2 < constructs2.length) {
      const resolve = constructs2[index2].resolveAll;
      if (resolve && !called.includes(resolve)) {
        events = resolve(events, context);
        called.push(resolve);
      }
    }
    return events;
  }

  // node_modules/micromark-core-commonmark/lib/attention.js
  var attention = {
    name: "attention",
    resolveAll: resolveAllAttention,
    tokenize: tokenizeAttention
  };
  function resolveAllAttention(events, context) {
    let index2 = -1;
    let open;
    let group;
    let text9;
    let openingSequence;
    let closingSequence;
    let use;
    let nextEvents;
    let offset;
    while (++index2 < events.length) {
      if (events[index2][0] === "enter" && events[index2][1].type === "attentionSequence" && events[index2][1]._close) {
        open = index2;
        while (open--) {
          if (events[open][0] === "exit" && events[open][1].type === "attentionSequence" && events[open][1]._open && // If the markers are the same:
          context.sliceSerialize(events[open][1]).charCodeAt(0) === context.sliceSerialize(events[index2][1]).charCodeAt(0)) {
            if ((events[open][1]._close || events[index2][1]._open) && (events[index2][1].end.offset - events[index2][1].start.offset) % 3 && !((events[open][1].end.offset - events[open][1].start.offset + events[index2][1].end.offset - events[index2][1].start.offset) % 3)) {
              continue;
            }
            use = events[open][1].end.offset - events[open][1].start.offset > 1 && events[index2][1].end.offset - events[index2][1].start.offset > 1 ? 2 : 1;
            const start = {
              ...events[open][1].end
            };
            const end = {
              ...events[index2][1].start
            };
            movePoint(start, -use);
            movePoint(end, use);
            openingSequence = {
              type: use > 1 ? "strongSequence" : "emphasisSequence",
              start,
              end: {
                ...events[open][1].end
              }
            };
            closingSequence = {
              type: use > 1 ? "strongSequence" : "emphasisSequence",
              start: {
                ...events[index2][1].start
              },
              end
            };
            text9 = {
              type: use > 1 ? "strongText" : "emphasisText",
              start: {
                ...events[open][1].end
              },
              end: {
                ...events[index2][1].start
              }
            };
            group = {
              type: use > 1 ? "strong" : "emphasis",
              start: {
                ...openingSequence.start
              },
              end: {
                ...closingSequence.end
              }
            };
            events[open][1].end = {
              ...openingSequence.start
            };
            events[index2][1].start = {
              ...closingSequence.end
            };
            nextEvents = [];
            if (events[open][1].end.offset - events[open][1].start.offset) {
              nextEvents = push(nextEvents, [["enter", events[open][1], context], ["exit", events[open][1], context]]);
            }
            nextEvents = push(nextEvents, [["enter", group, context], ["enter", openingSequence, context], ["exit", openingSequence, context], ["enter", text9, context]]);
            nextEvents = push(nextEvents, resolveAll(context.parser.constructs.insideSpan.null, events.slice(open + 1, index2), context));
            nextEvents = push(nextEvents, [["exit", text9, context], ["enter", closingSequence, context], ["exit", closingSequence, context], ["exit", group, context]]);
            if (events[index2][1].end.offset - events[index2][1].start.offset) {
              offset = 2;
              nextEvents = push(nextEvents, [["enter", events[index2][1], context], ["exit", events[index2][1], context]]);
            } else {
              offset = 0;
            }
            splice(events, open - 1, index2 - open + 3, nextEvents);
            index2 = open + nextEvents.length - offset - 2;
            break;
          }
        }
      }
    }
    index2 = -1;
    while (++index2 < events.length) {
      if (events[index2][1].type === "attentionSequence") {
        events[index2][1].type = "data";
      }
    }
    return events;
  }
  function tokenizeAttention(effects, ok3) {
    const attentionMarkers2 = this.parser.constructs.attentionMarkers.null;
    const previous4 = this.previous;
    const before = classifyCharacter(previous4);
    let marker;
    return start;
    function start(code4) {
      marker = code4;
      effects.enter("attentionSequence");
      return inside(code4);
    }
    function inside(code4) {
      if (code4 === marker) {
        effects.consume(code4);
        return inside;
      }
      const token = effects.exit("attentionSequence");
      const after = classifyCharacter(code4);
      const open = !after || after === 2 && before || attentionMarkers2.includes(code4);
      const close = !before || before === 2 && after || attentionMarkers2.includes(previous4);
      token._open = Boolean(marker === 42 ? open : open && (before || !close));
      token._close = Boolean(marker === 42 ? close : close && (after || !open));
      return ok3(code4);
    }
  }
  function movePoint(point4, offset) {
    point4.column += offset;
    point4.offset += offset;
    point4._bufferIndex += offset;
  }

  // node_modules/micromark-core-commonmark/lib/autolink.js
  var autolink = {
    name: "autolink",
    tokenize: tokenizeAutolink
  };
  function tokenizeAutolink(effects, ok3, nok) {
    let size = 0;
    return start;
    function start(code4) {
      effects.enter("autolink");
      effects.enter("autolinkMarker");
      effects.consume(code4);
      effects.exit("autolinkMarker");
      effects.enter("autolinkProtocol");
      return open;
    }
    function open(code4) {
      if (asciiAlpha(code4)) {
        effects.consume(code4);
        return schemeOrEmailAtext;
      }
      if (code4 === 64) {
        return nok(code4);
      }
      return emailAtext(code4);
    }
    function schemeOrEmailAtext(code4) {
      if (code4 === 43 || code4 === 45 || code4 === 46 || asciiAlphanumeric(code4)) {
        size = 1;
        return schemeInsideOrEmailAtext(code4);
      }
      return emailAtext(code4);
    }
    function schemeInsideOrEmailAtext(code4) {
      if (code4 === 58) {
        effects.consume(code4);
        size = 0;
        return urlInside;
      }
      if ((code4 === 43 || code4 === 45 || code4 === 46 || asciiAlphanumeric(code4)) && size++ < 32) {
        effects.consume(code4);
        return schemeInsideOrEmailAtext;
      }
      size = 0;
      return emailAtext(code4);
    }
    function urlInside(code4) {
      if (code4 === 62) {
        effects.exit("autolinkProtocol");
        effects.enter("autolinkMarker");
        effects.consume(code4);
        effects.exit("autolinkMarker");
        effects.exit("autolink");
        return ok3;
      }
      if (code4 === null || code4 === 32 || code4 === 60 || asciiControl(code4)) {
        return nok(code4);
      }
      effects.consume(code4);
      return urlInside;
    }
    function emailAtext(code4) {
      if (code4 === 64) {
        effects.consume(code4);
        return emailAtSignOrDot;
      }
      if (asciiAtext(code4)) {
        effects.consume(code4);
        return emailAtext;
      }
      return nok(code4);
    }
    function emailAtSignOrDot(code4) {
      return asciiAlphanumeric(code4) ? emailLabel(code4) : nok(code4);
    }
    function emailLabel(code4) {
      if (code4 === 46) {
        effects.consume(code4);
        size = 0;
        return emailAtSignOrDot;
      }
      if (code4 === 62) {
        effects.exit("autolinkProtocol").type = "autolinkEmail";
        effects.enter("autolinkMarker");
        effects.consume(code4);
        effects.exit("autolinkMarker");
        effects.exit("autolink");
        return ok3;
      }
      return emailValue(code4);
    }
    function emailValue(code4) {
      if ((code4 === 45 || asciiAlphanumeric(code4)) && size++ < 63) {
        const next = code4 === 45 ? emailValue : emailLabel;
        effects.consume(code4);
        return next;
      }
      return nok(code4);
    }
  }

  // node_modules/micromark-core-commonmark/lib/blank-line.js
  var blankLine = {
    partial: true,
    tokenize: tokenizeBlankLine
  };
  function tokenizeBlankLine(effects, ok3, nok) {
    return start;
    function start(code4) {
      return markdownSpace(code4) ? factorySpace(effects, after, "linePrefix")(code4) : after(code4);
    }
    function after(code4) {
      return code4 === null || markdownLineEnding(code4) ? ok3(code4) : nok(code4);
    }
  }

  // node_modules/micromark-core-commonmark/lib/block-quote.js
  var blockQuote = {
    continuation: {
      tokenize: tokenizeBlockQuoteContinuation
    },
    exit,
    name: "blockQuote",
    tokenize: tokenizeBlockQuoteStart
  };
  function tokenizeBlockQuoteStart(effects, ok3, nok) {
    const self2 = this;
    return start;
    function start(code4) {
      if (code4 === 62) {
        const state = self2.containerState;
        if (!state.open) {
          effects.enter("blockQuote", {
            _container: true
          });
          state.open = true;
        }
        effects.enter("blockQuotePrefix");
        effects.enter("blockQuoteMarker");
        effects.consume(code4);
        effects.exit("blockQuoteMarker");
        return after;
      }
      return nok(code4);
    }
    function after(code4) {
      if (markdownSpace(code4)) {
        effects.enter("blockQuotePrefixWhitespace");
        effects.consume(code4);
        effects.exit("blockQuotePrefixWhitespace");
        effects.exit("blockQuotePrefix");
        return ok3;
      }
      effects.exit("blockQuotePrefix");
      return ok3(code4);
    }
  }
  function tokenizeBlockQuoteContinuation(effects, ok3, nok) {
    const self2 = this;
    return contStart;
    function contStart(code4) {
      if (markdownSpace(code4)) {
        return factorySpace(effects, contBefore, "linePrefix", self2.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4)(code4);
      }
      return contBefore(code4);
    }
    function contBefore(code4) {
      return effects.attempt(blockQuote, ok3, nok)(code4);
    }
  }
  function exit(effects) {
    effects.exit("blockQuote");
  }

  // node_modules/micromark-core-commonmark/lib/character-escape.js
  var characterEscape = {
    name: "characterEscape",
    tokenize: tokenizeCharacterEscape
  };
  function tokenizeCharacterEscape(effects, ok3, nok) {
    return start;
    function start(code4) {
      effects.enter("characterEscape");
      effects.enter("escapeMarker");
      effects.consume(code4);
      effects.exit("escapeMarker");
      return inside;
    }
    function inside(code4) {
      if (asciiPunctuation(code4)) {
        effects.enter("characterEscapeValue");
        effects.consume(code4);
        effects.exit("characterEscapeValue");
        effects.exit("characterEscape");
        return ok3;
      }
      return nok(code4);
    }
  }

  // node_modules/micromark-core-commonmark/lib/character-reference.js
  var characterReference = {
    name: "characterReference",
    tokenize: tokenizeCharacterReference
  };
  function tokenizeCharacterReference(effects, ok3, nok) {
    const self2 = this;
    let size = 0;
    let max;
    let test;
    return start;
    function start(code4) {
      effects.enter("characterReference");
      effects.enter("characterReferenceMarker");
      effects.consume(code4);
      effects.exit("characterReferenceMarker");
      return open;
    }
    function open(code4) {
      if (code4 === 35) {
        effects.enter("characterReferenceMarkerNumeric");
        effects.consume(code4);
        effects.exit("characterReferenceMarkerNumeric");
        return numeric;
      }
      effects.enter("characterReferenceValue");
      max = 31;
      test = asciiAlphanumeric;
      return value(code4);
    }
    function numeric(code4) {
      if (code4 === 88 || code4 === 120) {
        effects.enter("characterReferenceMarkerHexadecimal");
        effects.consume(code4);
        effects.exit("characterReferenceMarkerHexadecimal");
        effects.enter("characterReferenceValue");
        max = 6;
        test = asciiHexDigit;
        return value;
      }
      effects.enter("characterReferenceValue");
      max = 7;
      test = asciiDigit;
      return value(code4);
    }
    function value(code4) {
      if (code4 === 59 && size) {
        const token = effects.exit("characterReferenceValue");
        if (test === asciiAlphanumeric && !decodeNamedCharacterReference(self2.sliceSerialize(token))) {
          return nok(code4);
        }
        effects.enter("characterReferenceMarker");
        effects.consume(code4);
        effects.exit("characterReferenceMarker");
        effects.exit("characterReference");
        return ok3;
      }
      if (test(code4) && size++ < max) {
        effects.consume(code4);
        return value;
      }
      return nok(code4);
    }
  }

  // node_modules/micromark-core-commonmark/lib/code-fenced.js
  var nonLazyContinuation = {
    partial: true,
    tokenize: tokenizeNonLazyContinuation
  };
  var codeFenced = {
    concrete: true,
    name: "codeFenced",
    tokenize: tokenizeCodeFenced
  };
  function tokenizeCodeFenced(effects, ok3, nok) {
    const self2 = this;
    const closeStart = {
      partial: true,
      tokenize: tokenizeCloseStart
    };
    let initialPrefix = 0;
    let sizeOpen = 0;
    let marker;
    return start;
    function start(code4) {
      return beforeSequenceOpen(code4);
    }
    function beforeSequenceOpen(code4) {
      const tail = self2.events[self2.events.length - 1];
      initialPrefix = tail && tail[1].type === "linePrefix" ? tail[2].sliceSerialize(tail[1], true).length : 0;
      marker = code4;
      effects.enter("codeFenced");
      effects.enter("codeFencedFence");
      effects.enter("codeFencedFenceSequence");
      return sequenceOpen(code4);
    }
    function sequenceOpen(code4) {
      if (code4 === marker) {
        sizeOpen++;
        effects.consume(code4);
        return sequenceOpen;
      }
      if (sizeOpen < 3) {
        return nok(code4);
      }
      effects.exit("codeFencedFenceSequence");
      return markdownSpace(code4) ? factorySpace(effects, infoBefore, "whitespace")(code4) : infoBefore(code4);
    }
    function infoBefore(code4) {
      if (code4 === null || markdownLineEnding(code4)) {
        effects.exit("codeFencedFence");
        return self2.interrupt ? ok3(code4) : effects.check(nonLazyContinuation, atNonLazyBreak, after)(code4);
      }
      effects.enter("codeFencedFenceInfo");
      effects.enter("chunkString", {
        contentType: "string"
      });
      return info(code4);
    }
    function info(code4) {
      if (code4 === null || markdownLineEnding(code4)) {
        effects.exit("chunkString");
        effects.exit("codeFencedFenceInfo");
        return infoBefore(code4);
      }
      if (markdownSpace(code4)) {
        effects.exit("chunkString");
        effects.exit("codeFencedFenceInfo");
        return factorySpace(effects, metaBefore, "whitespace")(code4);
      }
      if (code4 === 96 && code4 === marker) {
        return nok(code4);
      }
      effects.consume(code4);
      return info;
    }
    function metaBefore(code4) {
      if (code4 === null || markdownLineEnding(code4)) {
        return infoBefore(code4);
      }
      effects.enter("codeFencedFenceMeta");
      effects.enter("chunkString", {
        contentType: "string"
      });
      return meta(code4);
    }
    function meta(code4) {
      if (code4 === null || markdownLineEnding(code4)) {
        effects.exit("chunkString");
        effects.exit("codeFencedFenceMeta");
        return infoBefore(code4);
      }
      if (code4 === 96 && code4 === marker) {
        return nok(code4);
      }
      effects.consume(code4);
      return meta;
    }
    function atNonLazyBreak(code4) {
      return effects.attempt(closeStart, after, contentBefore)(code4);
    }
    function contentBefore(code4) {
      effects.enter("lineEnding");
      effects.consume(code4);
      effects.exit("lineEnding");
      return contentStart;
    }
    function contentStart(code4) {
      return initialPrefix > 0 && markdownSpace(code4) ? factorySpace(effects, beforeContentChunk, "linePrefix", initialPrefix + 1)(code4) : beforeContentChunk(code4);
    }
    function beforeContentChunk(code4) {
      if (code4 === null || markdownLineEnding(code4)) {
        return effects.check(nonLazyContinuation, atNonLazyBreak, after)(code4);
      }
      effects.enter("codeFlowValue");
      return contentChunk(code4);
    }
    function contentChunk(code4) {
      if (code4 === null || markdownLineEnding(code4)) {
        effects.exit("codeFlowValue");
        return beforeContentChunk(code4);
      }
      effects.consume(code4);
      return contentChunk;
    }
    function after(code4) {
      effects.exit("codeFenced");
      return ok3(code4);
    }
    function tokenizeCloseStart(effects2, ok4, nok2) {
      let size = 0;
      return startBefore;
      function startBefore(code4) {
        effects2.enter("lineEnding");
        effects2.consume(code4);
        effects2.exit("lineEnding");
        return start2;
      }
      function start2(code4) {
        effects2.enter("codeFencedFence");
        return markdownSpace(code4) ? factorySpace(effects2, beforeSequenceClose, "linePrefix", self2.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4)(code4) : beforeSequenceClose(code4);
      }
      function beforeSequenceClose(code4) {
        if (code4 === marker) {
          effects2.enter("codeFencedFenceSequence");
          return sequenceClose(code4);
        }
        return nok2(code4);
      }
      function sequenceClose(code4) {
        if (code4 === marker) {
          size++;
          effects2.consume(code4);
          return sequenceClose;
        }
        if (size >= sizeOpen) {
          effects2.exit("codeFencedFenceSequence");
          return markdownSpace(code4) ? factorySpace(effects2, sequenceCloseAfter, "whitespace")(code4) : sequenceCloseAfter(code4);
        }
        return nok2(code4);
      }
      function sequenceCloseAfter(code4) {
        if (code4 === null || markdownLineEnding(code4)) {
          effects2.exit("codeFencedFence");
          return ok4(code4);
        }
        return nok2(code4);
      }
    }
  }
  function tokenizeNonLazyContinuation(effects, ok3, nok) {
    const self2 = this;
    return start;
    function start(code4) {
      if (code4 === null) {
        return nok(code4);
      }
      effects.enter("lineEnding");
      effects.consume(code4);
      effects.exit("lineEnding");
      return lineStart;
    }
    function lineStart(code4) {
      return self2.parser.lazy[self2.now().line] ? nok(code4) : ok3(code4);
    }
  }

  // node_modules/micromark-core-commonmark/lib/code-indented.js
  var codeIndented = {
    name: "codeIndented",
    tokenize: tokenizeCodeIndented
  };
  var furtherStart = {
    partial: true,
    tokenize: tokenizeFurtherStart
  };
  function tokenizeCodeIndented(effects, ok3, nok) {
    const self2 = this;
    return start;
    function start(code4) {
      effects.enter("codeIndented");
      return factorySpace(effects, afterPrefix, "linePrefix", 4 + 1)(code4);
    }
    function afterPrefix(code4) {
      const tail = self2.events[self2.events.length - 1];
      return tail && tail[1].type === "linePrefix" && tail[2].sliceSerialize(tail[1], true).length >= 4 ? atBreak(code4) : nok(code4);
    }
    function atBreak(code4) {
      if (code4 === null) {
        return after(code4);
      }
      if (markdownLineEnding(code4)) {
        return effects.attempt(furtherStart, atBreak, after)(code4);
      }
      effects.enter("codeFlowValue");
      return inside(code4);
    }
    function inside(code4) {
      if (code4 === null || markdownLineEnding(code4)) {
        effects.exit("codeFlowValue");
        return atBreak(code4);
      }
      effects.consume(code4);
      return inside;
    }
    function after(code4) {
      effects.exit("codeIndented");
      return ok3(code4);
    }
  }
  function tokenizeFurtherStart(effects, ok3, nok) {
    const self2 = this;
    return furtherStart2;
    function furtherStart2(code4) {
      if (self2.parser.lazy[self2.now().line]) {
        return nok(code4);
      }
      if (markdownLineEnding(code4)) {
        effects.enter("lineEnding");
        effects.consume(code4);
        effects.exit("lineEnding");
        return furtherStart2;
      }
      return factorySpace(effects, afterPrefix, "linePrefix", 4 + 1)(code4);
    }
    function afterPrefix(code4) {
      const tail = self2.events[self2.events.length - 1];
      return tail && tail[1].type === "linePrefix" && tail[2].sliceSerialize(tail[1], true).length >= 4 ? ok3(code4) : markdownLineEnding(code4) ? furtherStart2(code4) : nok(code4);
    }
  }

  // node_modules/micromark-core-commonmark/lib/code-text.js
  var codeText = {
    name: "codeText",
    previous,
    resolve: resolveCodeText,
    tokenize: tokenizeCodeText
  };
  function resolveCodeText(events) {
    let tailExitIndex = events.length - 4;
    let headEnterIndex = 3;
    let index2;
    let enter;
    if ((events[headEnterIndex][1].type === "lineEnding" || events[headEnterIndex][1].type === "space") && (events[tailExitIndex][1].type === "lineEnding" || events[tailExitIndex][1].type === "space")) {
      index2 = headEnterIndex;
      while (++index2 < tailExitIndex) {
        if (events[index2][1].type === "codeTextData") {
          events[headEnterIndex][1].type = "codeTextPadding";
          events[tailExitIndex][1].type = "codeTextPadding";
          headEnterIndex += 2;
          tailExitIndex -= 2;
          break;
        }
      }
    }
    index2 = headEnterIndex - 1;
    tailExitIndex++;
    while (++index2 <= tailExitIndex) {
      if (enter === void 0) {
        if (index2 !== tailExitIndex && events[index2][1].type !== "lineEnding") {
          enter = index2;
        }
      } else if (index2 === tailExitIndex || events[index2][1].type === "lineEnding") {
        events[enter][1].type = "codeTextData";
        if (index2 !== enter + 2) {
          events[enter][1].end = events[index2 - 1][1].end;
          events.splice(enter + 2, index2 - enter - 2);
          tailExitIndex -= index2 - enter - 2;
          index2 = enter + 2;
        }
        enter = void 0;
      }
    }
    return events;
  }
  function previous(code4) {
    return code4 !== 96 || this.events[this.events.length - 1][1].type === "characterEscape";
  }
  function tokenizeCodeText(effects, ok3, nok) {
    const self2 = this;
    let sizeOpen = 0;
    let size;
    let token;
    return start;
    function start(code4) {
      effects.enter("codeText");
      effects.enter("codeTextSequence");
      return sequenceOpen(code4);
    }
    function sequenceOpen(code4) {
      if (code4 === 96) {
        effects.consume(code4);
        sizeOpen++;
        return sequenceOpen;
      }
      effects.exit("codeTextSequence");
      return between(code4);
    }
    function between(code4) {
      if (code4 === null) {
        return nok(code4);
      }
      if (code4 === 32) {
        effects.enter("space");
        effects.consume(code4);
        effects.exit("space");
        return between;
      }
      if (code4 === 96) {
        token = effects.enter("codeTextSequence");
        size = 0;
        return sequenceClose(code4);
      }
      if (markdownLineEnding(code4)) {
        effects.enter("lineEnding");
        effects.consume(code4);
        effects.exit("lineEnding");
        return between;
      }
      effects.enter("codeTextData");
      return data(code4);
    }
    function data(code4) {
      if (code4 === null || code4 === 32 || code4 === 96 || markdownLineEnding(code4)) {
        effects.exit("codeTextData");
        return between(code4);
      }
      effects.consume(code4);
      return data;
    }
    function sequenceClose(code4) {
      if (code4 === 96) {
        effects.consume(code4);
        size++;
        return sequenceClose;
      }
      if (size === sizeOpen) {
        effects.exit("codeTextSequence");
        effects.exit("codeText");
        return ok3(code4);
      }
      token.type = "codeTextData";
      return data(code4);
    }
  }

  // node_modules/micromark-util-subtokenize/lib/splice-buffer.js
  var SpliceBuffer = class {
    /**
     * @param {ReadonlyArray<T> | null | undefined} [initial]
     *   Initial items (optional).
     * @returns
     *   Splice buffer.
     */
    constructor(initial) {
      this.left = initial ? [...initial] : [];
      this.right = [];
    }
    /**
     * Array access;
     * does not move the cursor.
     *
     * @param {number} index
     *   Index.
     * @return {T}
     *   Item.
     */
    get(index2) {
      if (index2 < 0 || index2 >= this.left.length + this.right.length) {
        throw new RangeError("Cannot access index `" + index2 + "` in a splice buffer of size `" + (this.left.length + this.right.length) + "`");
      }
      if (index2 < this.left.length) return this.left[index2];
      return this.right[this.right.length - index2 + this.left.length - 1];
    }
    /**
     * The length of the splice buffer, one greater than the largest index in the
     * array.
     */
    get length() {
      return this.left.length + this.right.length;
    }
    /**
     * Remove and return `list[0]`;
     * moves the cursor to `0`.
     *
     * @returns {T | undefined}
     *   Item, optional.
     */
    shift() {
      this.setCursor(0);
      return this.right.pop();
    }
    /**
     * Slice the buffer to get an array;
     * does not move the cursor.
     *
     * @param {number} start
     *   Start.
     * @param {number | null | undefined} [end]
     *   End (optional).
     * @returns {Array<T>}
     *   Array of items.
     */
    slice(start, end) {
      const stop = end === null || end === void 0 ? Number.POSITIVE_INFINITY : end;
      if (stop < this.left.length) {
        return this.left.slice(start, stop);
      }
      if (start > this.left.length) {
        return this.right.slice(this.right.length - stop + this.left.length, this.right.length - start + this.left.length).reverse();
      }
      return this.left.slice(start).concat(this.right.slice(this.right.length - stop + this.left.length).reverse());
    }
    /**
     * Mimics the behavior of Array.prototype.splice() except for the change of
     * interface necessary to avoid segfaults when patching in very large arrays.
     *
     * This operation moves cursor is moved to `start` and results in the cursor
     * placed after any inserted items.
     *
     * @param {number} start
     *   Start;
     *   zero-based index at which to start changing the array;
     *   negative numbers count backwards from the end of the array and values
     *   that are out-of bounds are clamped to the appropriate end of the array.
     * @param {number | null | undefined} [deleteCount=0]
     *   Delete count (default: `0`);
     *   maximum number of elements to delete, starting from start.
     * @param {Array<T> | null | undefined} [items=[]]
     *   Items to include in place of the deleted items (default: `[]`).
     * @return {Array<T>}
     *   Any removed items.
     */
    splice(start, deleteCount, items) {
      const count = deleteCount || 0;
      this.setCursor(Math.trunc(start));
      const removed = this.right.splice(this.right.length - count, Number.POSITIVE_INFINITY);
      if (items) chunkedPush(this.left, items);
      return removed.reverse();
    }
    /**
     * Remove and return the highest-numbered item in the array, so
     * `list[list.length - 1]`;
     * Moves the cursor to `length`.
     *
     * @returns {T | undefined}
     *   Item, optional.
     */
    pop() {
      this.setCursor(Number.POSITIVE_INFINITY);
      return this.left.pop();
    }
    /**
     * Inserts a single item to the high-numbered side of the array;
     * moves the cursor to `length`.
     *
     * @param {T} item
     *   Item.
     * @returns {undefined}
     *   Nothing.
     */
    push(item) {
      this.setCursor(Number.POSITIVE_INFINITY);
      this.left.push(item);
    }
    /**
     * Inserts many items to the high-numbered side of the array.
     * Moves the cursor to `length`.
     *
     * @param {Array<T>} items
     *   Items.
     * @returns {undefined}
     *   Nothing.
     */
    pushMany(items) {
      this.setCursor(Number.POSITIVE_INFINITY);
      chunkedPush(this.left, items);
    }
    /**
     * Inserts a single item to the low-numbered side of the array;
     * Moves the cursor to `0`.
     *
     * @param {T} item
     *   Item.
     * @returns {undefined}
     *   Nothing.
     */
    unshift(item) {
      this.setCursor(0);
      this.right.push(item);
    }
    /**
     * Inserts many items to the low-numbered side of the array;
     * moves the cursor to `0`.
     *
     * @param {Array<T>} items
     *   Items.
     * @returns {undefined}
     *   Nothing.
     */
    unshiftMany(items) {
      this.setCursor(0);
      chunkedPush(this.right, items.reverse());
    }
    /**
     * Move the cursor to a specific position in the array. Requires
     * time proportional to the distance moved.
     *
     * If `n < 0`, the cursor will end up at the beginning.
     * If `n > length`, the cursor will end up at the end.
     *
     * @param {number} n
     *   Position.
     * @return {undefined}
     *   Nothing.
     */
    setCursor(n) {
      if (n === this.left.length || n > this.left.length && this.right.length === 0 || n < 0 && this.left.length === 0) return;
      if (n < this.left.length) {
        const removed = this.left.splice(n, Number.POSITIVE_INFINITY);
        chunkedPush(this.right, removed.reverse());
      } else {
        const removed = this.right.splice(this.left.length + this.right.length - n, Number.POSITIVE_INFINITY);
        chunkedPush(this.left, removed.reverse());
      }
    }
  };
  function chunkedPush(list4, right) {
    let chunkStart = 0;
    if (right.length < 1e4) {
      list4.push(...right);
    } else {
      while (chunkStart < right.length) {
        list4.push(...right.slice(chunkStart, chunkStart + 1e4));
        chunkStart += 1e4;
      }
    }
  }

  // node_modules/micromark-util-subtokenize/index.js
  function subtokenize(eventsArray) {
    const jumps = {};
    let index2 = -1;
    let event;
    let lineIndex;
    let otherIndex;
    let otherEvent;
    let parameters;
    let subevents;
    let more;
    const events = new SpliceBuffer(eventsArray);
    while (++index2 < events.length) {
      while (index2 in jumps) {
        index2 = jumps[index2];
      }
      event = events.get(index2);
      if (index2 && event[1].type === "chunkFlow" && events.get(index2 - 1)[1].type === "listItemPrefix") {
        subevents = event[1]._tokenizer.events;
        otherIndex = 0;
        if (otherIndex < subevents.length && subevents[otherIndex][1].type === "lineEndingBlank") {
          otherIndex += 2;
        }
        if (otherIndex < subevents.length && subevents[otherIndex][1].type === "content") {
          while (++otherIndex < subevents.length) {
            if (subevents[otherIndex][1].type === "content") {
              break;
            }
            if (subevents[otherIndex][1].type === "chunkText") {
              subevents[otherIndex][1]._isInFirstContentOfListItem = true;
              otherIndex++;
            }
          }
        }
      }
      if (event[0] === "enter") {
        if (event[1].contentType) {
          Object.assign(jumps, subcontent(events, index2));
          index2 = jumps[index2];
          more = true;
        }
      } else if (event[1]._container) {
        otherIndex = index2;
        lineIndex = void 0;
        while (otherIndex--) {
          otherEvent = events.get(otherIndex);
          if (otherEvent[1].type === "lineEnding" || otherEvent[1].type === "lineEndingBlank") {
            if (otherEvent[0] === "enter") {
              if (lineIndex) {
                events.get(lineIndex)[1].type = "lineEndingBlank";
              }
              otherEvent[1].type = "lineEnding";
              lineIndex = otherIndex;
            }
          } else if (otherEvent[1].type === "linePrefix" || otherEvent[1].type === "listItemIndent") {
          } else {
            break;
          }
        }
        if (lineIndex) {
          event[1].end = {
            ...events.get(lineIndex)[1].start
          };
          parameters = events.slice(lineIndex, index2);
          parameters.unshift(event);
          events.splice(lineIndex, index2 - lineIndex + 1, parameters);
        }
      }
    }
    splice(eventsArray, 0, Number.POSITIVE_INFINITY, events.slice(0));
    return !more;
  }
  function subcontent(events, eventIndex) {
    const token = events.get(eventIndex)[1];
    const context = events.get(eventIndex)[2];
    let startPosition = eventIndex - 1;
    const startPositions = [];
    let tokenizer = token._tokenizer;
    if (!tokenizer) {
      tokenizer = context.parser[token.contentType](token.start);
      if (token._contentTypeTextTrailing) {
        tokenizer._contentTypeTextTrailing = true;
      }
    }
    const childEvents = tokenizer.events;
    const jumps = [];
    const gaps = {};
    let stream;
    let previous4;
    let index2 = -1;
    let current = token;
    let adjust = 0;
    let start = 0;
    const breaks = [start];
    while (current) {
      while (events.get(++startPosition)[1] !== current) {
      }
      startPositions.push(startPosition);
      if (!current._tokenizer) {
        stream = context.sliceStream(current);
        if (!current.next) {
          stream.push(null);
        }
        if (previous4) {
          tokenizer.defineSkip(current.start);
        }
        if (current._isInFirstContentOfListItem) {
          tokenizer._gfmTasklistFirstContentOfListItem = true;
        }
        tokenizer.write(stream);
        if (current._isInFirstContentOfListItem) {
          tokenizer._gfmTasklistFirstContentOfListItem = void 0;
        }
      }
      previous4 = current;
      current = current.next;
    }
    current = token;
    while (++index2 < childEvents.length) {
      if (
        // Find a void token that includes a break.
        childEvents[index2][0] === "exit" && childEvents[index2 - 1][0] === "enter" && childEvents[index2][1].type === childEvents[index2 - 1][1].type && childEvents[index2][1].start.line !== childEvents[index2][1].end.line
      ) {
        start = index2 + 1;
        breaks.push(start);
        current._tokenizer = void 0;
        current.previous = void 0;
        current = current.next;
      }
    }
    tokenizer.events = [];
    if (current) {
      current._tokenizer = void 0;
      current.previous = void 0;
    } else {
      breaks.pop();
    }
    index2 = breaks.length;
    while (index2--) {
      const slice = childEvents.slice(breaks[index2], breaks[index2 + 1]);
      const start2 = startPositions.pop();
      jumps.push([start2, start2 + slice.length - 1]);
      events.splice(start2, 2, slice);
    }
    jumps.reverse();
    index2 = -1;
    while (++index2 < jumps.length) {
      gaps[adjust + jumps[index2][0]] = adjust + jumps[index2][1];
      adjust += jumps[index2][1] - jumps[index2][0] - 1;
    }
    return gaps;
  }

  // node_modules/micromark-core-commonmark/lib/content.js
  var content2 = {
    resolve: resolveContent,
    tokenize: tokenizeContent
  };
  var continuationConstruct = {
    partial: true,
    tokenize: tokenizeContinuation
  };
  function resolveContent(events) {
    subtokenize(events);
    return events;
  }
  function tokenizeContent(effects, ok3) {
    let previous4;
    return chunkStart;
    function chunkStart(code4) {
      effects.enter("content");
      previous4 = effects.enter("chunkContent", {
        contentType: "content"
      });
      return chunkInside(code4);
    }
    function chunkInside(code4) {
      if (code4 === null) {
        return contentEnd(code4);
      }
      if (markdownLineEnding(code4)) {
        return effects.check(continuationConstruct, contentContinue, contentEnd)(code4);
      }
      effects.consume(code4);
      return chunkInside;
    }
    function contentEnd(code4) {
      effects.exit("chunkContent");
      effects.exit("content");
      return ok3(code4);
    }
    function contentContinue(code4) {
      effects.consume(code4);
      effects.exit("chunkContent");
      previous4.next = effects.enter("chunkContent", {
        contentType: "content",
        previous: previous4
      });
      previous4 = previous4.next;
      return chunkInside;
    }
  }
  function tokenizeContinuation(effects, ok3, nok) {
    const self2 = this;
    return startLookahead;
    function startLookahead(code4) {
      effects.exit("chunkContent");
      effects.enter("lineEnding");
      effects.consume(code4);
      effects.exit("lineEnding");
      return factorySpace(effects, prefixed, "linePrefix");
    }
    function prefixed(code4) {
      if (code4 === null || markdownLineEnding(code4)) {
        return nok(code4);
      }
      const tail = self2.events[self2.events.length - 1];
      if (!self2.parser.constructs.disable.null.includes("codeIndented") && tail && tail[1].type === "linePrefix" && tail[2].sliceSerialize(tail[1], true).length >= 4) {
        return ok3(code4);
      }
      return effects.interrupt(self2.parser.constructs.flow, nok, ok3)(code4);
    }
  }

  // node_modules/micromark-factory-destination/index.js
  function factoryDestination(effects, ok3, nok, type, literalType, literalMarkerType, rawType, stringType, max) {
    const limit = max || Number.POSITIVE_INFINITY;
    let balance = 0;
    return start;
    function start(code4) {
      if (code4 === 60) {
        effects.enter(type);
        effects.enter(literalType);
        effects.enter(literalMarkerType);
        effects.consume(code4);
        effects.exit(literalMarkerType);
        return enclosedBefore;
      }
      if (code4 === null || code4 === 32 || code4 === 41 || asciiControl(code4)) {
        return nok(code4);
      }
      effects.enter(type);
      effects.enter(rawType);
      effects.enter(stringType);
      effects.enter("chunkString", {
        contentType: "string"
      });
      return raw2(code4);
    }
    function enclosedBefore(code4) {
      if (code4 === 62) {
        effects.enter(literalMarkerType);
        effects.consume(code4);
        effects.exit(literalMarkerType);
        effects.exit(literalType);
        effects.exit(type);
        return ok3;
      }
      effects.enter(stringType);
      effects.enter("chunkString", {
        contentType: "string"
      });
      return enclosed(code4);
    }
    function enclosed(code4) {
      if (code4 === 62) {
        effects.exit("chunkString");
        effects.exit(stringType);
        return enclosedBefore(code4);
      }
      if (code4 === null || code4 === 60 || markdownLineEnding(code4)) {
        return nok(code4);
      }
      effects.consume(code4);
      return code4 === 92 ? enclosedEscape : enclosed;
    }
    function enclosedEscape(code4) {
      if (code4 === 60 || code4 === 62 || code4 === 92) {
        effects.consume(code4);
        return enclosed;
      }
      return enclosed(code4);
    }
    function raw2(code4) {
      if (!balance && (code4 === null || code4 === 41 || markdownLineEndingOrSpace(code4))) {
        effects.exit("chunkString");
        effects.exit(stringType);
        effects.exit(rawType);
        effects.exit(type);
        return ok3(code4);
      }
      if (balance < limit && code4 === 40) {
        effects.consume(code4);
        balance++;
        return raw2;
      }
      if (code4 === 41) {
        effects.consume(code4);
        balance--;
        return raw2;
      }
      if (code4 === null || code4 === 32 || code4 === 40 || asciiControl(code4)) {
        return nok(code4);
      }
      effects.consume(code4);
      return code4 === 92 ? rawEscape : raw2;
    }
    function rawEscape(code4) {
      if (code4 === 40 || code4 === 41 || code4 === 92) {
        effects.consume(code4);
        return raw2;
      }
      return raw2(code4);
    }
  }

  // node_modules/micromark-factory-label/index.js
  function factoryLabel(effects, ok3, nok, type, markerType, stringType) {
    const self2 = this;
    let size = 0;
    let seen;
    return start;
    function start(code4) {
      effects.enter(type);
      effects.enter(markerType);
      effects.consume(code4);
      effects.exit(markerType);
      effects.enter(stringType);
      return atBreak;
    }
    function atBreak(code4) {
      if (size > 999 || code4 === null || code4 === 91 || code4 === 93 && !seen || // To do: remove in the future once we’ve switched from
      // `micromark-extension-footnote` to `micromark-extension-gfm-footnote`,
      // which doesn’t need this.
      // Hidden footnotes hook.
      /* c8 ignore next 3 */
      code4 === 94 && !size && "_hiddenFootnoteSupport" in self2.parser.constructs) {
        return nok(code4);
      }
      if (code4 === 93) {
        effects.exit(stringType);
        effects.enter(markerType);
        effects.consume(code4);
        effects.exit(markerType);
        effects.exit(type);
        return ok3;
      }
      if (markdownLineEnding(code4)) {
        effects.enter("lineEnding");
        effects.consume(code4);
        effects.exit("lineEnding");
        return atBreak;
      }
      effects.enter("chunkString", {
        contentType: "string"
      });
      return labelInside(code4);
    }
    function labelInside(code4) {
      if (code4 === null || code4 === 91 || code4 === 93 || markdownLineEnding(code4) || size++ > 999) {
        effects.exit("chunkString");
        return atBreak(code4);
      }
      effects.consume(code4);
      if (!seen) seen = !markdownSpace(code4);
      return code4 === 92 ? labelEscape : labelInside;
    }
    function labelEscape(code4) {
      if (code4 === 91 || code4 === 92 || code4 === 93) {
        effects.consume(code4);
        size++;
        return labelInside;
      }
      return labelInside(code4);
    }
  }

  // node_modules/micromark-factory-title/index.js
  function factoryTitle(effects, ok3, nok, type, markerType, stringType) {
    let marker;
    return start;
    function start(code4) {
      if (code4 === 34 || code4 === 39 || code4 === 40) {
        effects.enter(type);
        effects.enter(markerType);
        effects.consume(code4);
        effects.exit(markerType);
        marker = code4 === 40 ? 41 : code4;
        return begin;
      }
      return nok(code4);
    }
    function begin(code4) {
      if (code4 === marker) {
        effects.enter(markerType);
        effects.consume(code4);
        effects.exit(markerType);
        effects.exit(type);
        return ok3;
      }
      effects.enter(stringType);
      return atBreak(code4);
    }
    function atBreak(code4) {
      if (code4 === marker) {
        effects.exit(stringType);
        return begin(marker);
      }
      if (code4 === null) {
        return nok(code4);
      }
      if (markdownLineEnding(code4)) {
        effects.enter("lineEnding");
        effects.consume(code4);
        effects.exit("lineEnding");
        return factorySpace(effects, atBreak, "linePrefix");
      }
      effects.enter("chunkString", {
        contentType: "string"
      });
      return inside(code4);
    }
    function inside(code4) {
      if (code4 === marker || code4 === null || markdownLineEnding(code4)) {
        effects.exit("chunkString");
        return atBreak(code4);
      }
      effects.consume(code4);
      return code4 === 92 ? escape : inside;
    }
    function escape(code4) {
      if (code4 === marker || code4 === 92) {
        effects.consume(code4);
        return inside;
      }
      return inside(code4);
    }
  }

  // node_modules/micromark-factory-whitespace/index.js
  function factoryWhitespace(effects, ok3) {
    let seen;
    return start;
    function start(code4) {
      if (markdownLineEnding(code4)) {
        effects.enter("lineEnding");
        effects.consume(code4);
        effects.exit("lineEnding");
        seen = true;
        return start;
      }
      if (markdownSpace(code4)) {
        return factorySpace(effects, start, seen ? "linePrefix" : "lineSuffix")(code4);
      }
      return ok3(code4);
    }
  }

  // node_modules/micromark-core-commonmark/lib/definition.js
  var definition = {
    name: "definition",
    tokenize: tokenizeDefinition
  };
  var titleBefore = {
    partial: true,
    tokenize: tokenizeTitleBefore
  };
  function tokenizeDefinition(effects, ok3, nok) {
    const self2 = this;
    let identifier;
    return start;
    function start(code4) {
      effects.enter("definition");
      return before(code4);
    }
    function before(code4) {
      return factoryLabel.call(
        self2,
        effects,
        labelAfter,
        // Note: we don’t need to reset the way `markdown-rs` does.
        nok,
        "definitionLabel",
        "definitionLabelMarker",
        "definitionLabelString"
      )(code4);
    }
    function labelAfter(code4) {
      identifier = normalizeIdentifier(self2.sliceSerialize(self2.events[self2.events.length - 1][1]).slice(1, -1));
      if (code4 === 58) {
        effects.enter("definitionMarker");
        effects.consume(code4);
        effects.exit("definitionMarker");
        return markerAfter;
      }
      return nok(code4);
    }
    function markerAfter(code4) {
      return markdownLineEndingOrSpace(code4) ? factoryWhitespace(effects, destinationBefore)(code4) : destinationBefore(code4);
    }
    function destinationBefore(code4) {
      return factoryDestination(
        effects,
        destinationAfter,
        // Note: we don’t need to reset the way `markdown-rs` does.
        nok,
        "definitionDestination",
        "definitionDestinationLiteral",
        "definitionDestinationLiteralMarker",
        "definitionDestinationRaw",
        "definitionDestinationString"
      )(code4);
    }
    function destinationAfter(code4) {
      return effects.attempt(titleBefore, after, after)(code4);
    }
    function after(code4) {
      return markdownSpace(code4) ? factorySpace(effects, afterWhitespace, "whitespace")(code4) : afterWhitespace(code4);
    }
    function afterWhitespace(code4) {
      if (code4 === null || markdownLineEnding(code4)) {
        effects.exit("definition");
        self2.parser.defined.push(identifier);
        return ok3(code4);
      }
      return nok(code4);
    }
  }
  function tokenizeTitleBefore(effects, ok3, nok) {
    return titleBefore2;
    function titleBefore2(code4) {
      return markdownLineEndingOrSpace(code4) ? factoryWhitespace(effects, beforeMarker)(code4) : nok(code4);
    }
    function beforeMarker(code4) {
      return factoryTitle(effects, titleAfter, nok, "definitionTitle", "definitionTitleMarker", "definitionTitleString")(code4);
    }
    function titleAfter(code4) {
      return markdownSpace(code4) ? factorySpace(effects, titleAfterOptionalWhitespace, "whitespace")(code4) : titleAfterOptionalWhitespace(code4);
    }
    function titleAfterOptionalWhitespace(code4) {
      return code4 === null || markdownLineEnding(code4) ? ok3(code4) : nok(code4);
    }
  }

  // node_modules/micromark-core-commonmark/lib/hard-break-escape.js
  var hardBreakEscape = {
    name: "hardBreakEscape",
    tokenize: tokenizeHardBreakEscape
  };
  function tokenizeHardBreakEscape(effects, ok3, nok) {
    return start;
    function start(code4) {
      effects.enter("hardBreakEscape");
      effects.consume(code4);
      return after;
    }
    function after(code4) {
      if (markdownLineEnding(code4)) {
        effects.exit("hardBreakEscape");
        return ok3(code4);
      }
      return nok(code4);
    }
  }

  // node_modules/micromark-core-commonmark/lib/heading-atx.js
  var headingAtx = {
    name: "headingAtx",
    resolve: resolveHeadingAtx,
    tokenize: tokenizeHeadingAtx
  };
  function resolveHeadingAtx(events, context) {
    let contentEnd = events.length - 2;
    let contentStart = 3;
    let content3;
    let text9;
    if (events[contentStart][1].type === "whitespace") {
      contentStart += 2;
    }
    if (contentEnd - 2 > contentStart && events[contentEnd][1].type === "whitespace") {
      contentEnd -= 2;
    }
    if (events[contentEnd][1].type === "atxHeadingSequence" && (contentStart === contentEnd - 1 || contentEnd - 4 > contentStart && events[contentEnd - 2][1].type === "whitespace")) {
      contentEnd -= contentStart + 1 === contentEnd ? 2 : 4;
    }
    if (contentEnd > contentStart) {
      content3 = {
        type: "atxHeadingText",
        start: events[contentStart][1].start,
        end: events[contentEnd][1].end
      };
      text9 = {
        type: "chunkText",
        start: events[contentStart][1].start,
        end: events[contentEnd][1].end,
        contentType: "text"
      };
      splice(events, contentStart, contentEnd - contentStart + 1, [["enter", content3, context], ["enter", text9, context], ["exit", text9, context], ["exit", content3, context]]);
    }
    return events;
  }
  function tokenizeHeadingAtx(effects, ok3, nok) {
    let size = 0;
    return start;
    function start(code4) {
      effects.enter("atxHeading");
      return before(code4);
    }
    function before(code4) {
      effects.enter("atxHeadingSequence");
      return sequenceOpen(code4);
    }
    function sequenceOpen(code4) {
      if (code4 === 35 && size++ < 6) {
        effects.consume(code4);
        return sequenceOpen;
      }
      if (code4 === null || markdownLineEndingOrSpace(code4)) {
        effects.exit("atxHeadingSequence");
        return atBreak(code4);
      }
      return nok(code4);
    }
    function atBreak(code4) {
      if (code4 === 35) {
        effects.enter("atxHeadingSequence");
        return sequenceFurther(code4);
      }
      if (code4 === null || markdownLineEnding(code4)) {
        effects.exit("atxHeading");
        return ok3(code4);
      }
      if (markdownSpace(code4)) {
        return factorySpace(effects, atBreak, "whitespace")(code4);
      }
      effects.enter("atxHeadingText");
      return data(code4);
    }
    function sequenceFurther(code4) {
      if (code4 === 35) {
        effects.consume(code4);
        return sequenceFurther;
      }
      effects.exit("atxHeadingSequence");
      return atBreak(code4);
    }
    function data(code4) {
      if (code4 === null || code4 === 35 || markdownLineEndingOrSpace(code4)) {
        effects.exit("atxHeadingText");
        return atBreak(code4);
      }
      effects.consume(code4);
      return data;
    }
  }

  // node_modules/micromark-util-html-tag-name/index.js
  var htmlBlockNames = [
    "address",
    "article",
    "aside",
    "base",
    "basefont",
    "blockquote",
    "body",
    "caption",
    "center",
    "col",
    "colgroup",
    "dd",
    "details",
    "dialog",
    "dir",
    "div",
    "dl",
    "dt",
    "fieldset",
    "figcaption",
    "figure",
    "footer",
    "form",
    "frame",
    "frameset",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "head",
    "header",
    "hr",
    "html",
    "iframe",
    "legend",
    "li",
    "link",
    "main",
    "menu",
    "menuitem",
    "nav",
    "noframes",
    "ol",
    "optgroup",
    "option",
    "p",
    "param",
    "search",
    "section",
    "summary",
    "table",
    "tbody",
    "td",
    "tfoot",
    "th",
    "thead",
    "title",
    "tr",
    "track",
    "ul"
  ];
  var htmlRawNames = ["pre", "script", "style", "textarea"];

  // node_modules/micromark-core-commonmark/lib/html-flow.js
  var htmlFlow = {
    concrete: true,
    name: "htmlFlow",
    resolveTo: resolveToHtmlFlow,
    tokenize: tokenizeHtmlFlow
  };
  var blankLineBefore = {
    partial: true,
    tokenize: tokenizeBlankLineBefore
  };
  var nonLazyContinuationStart = {
    partial: true,
    tokenize: tokenizeNonLazyContinuationStart
  };
  function resolveToHtmlFlow(events) {
    let index2 = events.length;
    while (index2--) {
      if (events[index2][0] === "enter" && events[index2][1].type === "htmlFlow") {
        break;
      }
    }
    if (index2 > 1 && events[index2 - 2][1].type === "linePrefix") {
      events[index2][1].start = events[index2 - 2][1].start;
      events[index2 + 1][1].start = events[index2 - 2][1].start;
      events.splice(index2 - 2, 2);
    }
    return events;
  }
  function tokenizeHtmlFlow(effects, ok3, nok) {
    const self2 = this;
    let marker;
    let closingTag;
    let buffer;
    let index2;
    let markerB;
    return start;
    function start(code4) {
      return before(code4);
    }
    function before(code4) {
      effects.enter("htmlFlow");
      effects.enter("htmlFlowData");
      effects.consume(code4);
      return open;
    }
    function open(code4) {
      if (code4 === 33) {
        effects.consume(code4);
        return declarationOpen;
      }
      if (code4 === 47) {
        effects.consume(code4);
        closingTag = true;
        return tagCloseStart;
      }
      if (code4 === 63) {
        effects.consume(code4);
        marker = 3;
        return self2.interrupt ? ok3 : continuationDeclarationInside;
      }
      if (asciiAlpha(code4)) {
        effects.consume(code4);
        buffer = String.fromCharCode(code4);
        return tagName;
      }
      return nok(code4);
    }
    function declarationOpen(code4) {
      if (code4 === 45) {
        effects.consume(code4);
        marker = 2;
        return commentOpenInside;
      }
      if (code4 === 91) {
        effects.consume(code4);
        marker = 5;
        index2 = 0;
        return cdataOpenInside;
      }
      if (asciiAlpha(code4)) {
        effects.consume(code4);
        marker = 4;
        return self2.interrupt ? ok3 : continuationDeclarationInside;
      }
      return nok(code4);
    }
    function commentOpenInside(code4) {
      if (code4 === 45) {
        effects.consume(code4);
        return self2.interrupt ? ok3 : continuationDeclarationInside;
      }
      return nok(code4);
    }
    function cdataOpenInside(code4) {
      const value = "CDATA[";
      if (code4 === value.charCodeAt(index2++)) {
        effects.consume(code4);
        if (index2 === value.length) {
          return self2.interrupt ? ok3 : continuation;
        }
        return cdataOpenInside;
      }
      return nok(code4);
    }
    function tagCloseStart(code4) {
      if (asciiAlpha(code4)) {
        effects.consume(code4);
        buffer = String.fromCharCode(code4);
        return tagName;
      }
      return nok(code4);
    }
    function tagName(code4) {
      if (code4 === null || code4 === 47 || code4 === 62 || markdownLineEndingOrSpace(code4)) {
        const slash = code4 === 47;
        const name = buffer.toLowerCase();
        if (!slash && !closingTag && htmlRawNames.includes(name)) {
          marker = 1;
          return self2.interrupt ? ok3(code4) : continuation(code4);
        }
        if (htmlBlockNames.includes(buffer.toLowerCase())) {
          marker = 6;
          if (slash) {
            effects.consume(code4);
            return basicSelfClosing;
          }
          return self2.interrupt ? ok3(code4) : continuation(code4);
        }
        marker = 7;
        return self2.interrupt && !self2.parser.lazy[self2.now().line] ? nok(code4) : closingTag ? completeClosingTagAfter(code4) : completeAttributeNameBefore(code4);
      }
      if (code4 === 45 || asciiAlphanumeric(code4)) {
        effects.consume(code4);
        buffer += String.fromCharCode(code4);
        return tagName;
      }
      return nok(code4);
    }
    function basicSelfClosing(code4) {
      if (code4 === 62) {
        effects.consume(code4);
        return self2.interrupt ? ok3 : continuation;
      }
      return nok(code4);
    }
    function completeClosingTagAfter(code4) {
      if (markdownSpace(code4)) {
        effects.consume(code4);
        return completeClosingTagAfter;
      }
      return completeEnd(code4);
    }
    function completeAttributeNameBefore(code4) {
      if (code4 === 47) {
        effects.consume(code4);
        return completeEnd;
      }
      if (code4 === 58 || code4 === 95 || asciiAlpha(code4)) {
        effects.consume(code4);
        return completeAttributeName;
      }
      if (markdownSpace(code4)) {
        effects.consume(code4);
        return completeAttributeNameBefore;
      }
      return completeEnd(code4);
    }
    function completeAttributeName(code4) {
      if (code4 === 45 || code4 === 46 || code4 === 58 || code4 === 95 || asciiAlphanumeric(code4)) {
        effects.consume(code4);
        return completeAttributeName;
      }
      return completeAttributeNameAfter(code4);
    }
    function completeAttributeNameAfter(code4) {
      if (code4 === 61) {
        effects.consume(code4);
        return completeAttributeValueBefore;
      }
      if (markdownSpace(code4)) {
        effects.consume(code4);
        return completeAttributeNameAfter;
      }
      return completeAttributeNameBefore(code4);
    }
    function completeAttributeValueBefore(code4) {
      if (code4 === null || code4 === 60 || code4 === 61 || code4 === 62 || code4 === 96) {
        return nok(code4);
      }
      if (code4 === 34 || code4 === 39) {
        effects.consume(code4);
        markerB = code4;
        return completeAttributeValueQuoted;
      }
      if (markdownSpace(code4)) {
        effects.consume(code4);
        return completeAttributeValueBefore;
      }
      return completeAttributeValueUnquoted(code4);
    }
    function completeAttributeValueQuoted(code4) {
      if (code4 === markerB) {
        effects.consume(code4);
        markerB = null;
        return completeAttributeValueQuotedAfter;
      }
      if (code4 === null || markdownLineEnding(code4)) {
        return nok(code4);
      }
      effects.consume(code4);
      return completeAttributeValueQuoted;
    }
    function completeAttributeValueUnquoted(code4) {
      if (code4 === null || code4 === 34 || code4 === 39 || code4 === 47 || code4 === 60 || code4 === 61 || code4 === 62 || code4 === 96 || markdownLineEndingOrSpace(code4)) {
        return completeAttributeNameAfter(code4);
      }
      effects.consume(code4);
      return completeAttributeValueUnquoted;
    }
    function completeAttributeValueQuotedAfter(code4) {
      if (code4 === 47 || code4 === 62 || markdownSpace(code4)) {
        return completeAttributeNameBefore(code4);
      }
      return nok(code4);
    }
    function completeEnd(code4) {
      if (code4 === 62) {
        effects.consume(code4);
        return completeAfter;
      }
      return nok(code4);
    }
    function completeAfter(code4) {
      if (code4 === null || markdownLineEnding(code4)) {
        return continuation(code4);
      }
      if (markdownSpace(code4)) {
        effects.consume(code4);
        return completeAfter;
      }
      return nok(code4);
    }
    function continuation(code4) {
      if (code4 === 45 && marker === 2) {
        effects.consume(code4);
        return continuationCommentInside;
      }
      if (code4 === 60 && marker === 1) {
        effects.consume(code4);
        return continuationRawTagOpen;
      }
      if (code4 === 62 && marker === 4) {
        effects.consume(code4);
        return continuationClose;
      }
      if (code4 === 63 && marker === 3) {
        effects.consume(code4);
        return continuationDeclarationInside;
      }
      if (code4 === 93 && marker === 5) {
        effects.consume(code4);
        return continuationCdataInside;
      }
      if (markdownLineEnding(code4) && (marker === 6 || marker === 7)) {
        effects.exit("htmlFlowData");
        return effects.check(blankLineBefore, continuationAfter, continuationStart)(code4);
      }
      if (code4 === null || markdownLineEnding(code4)) {
        effects.exit("htmlFlowData");
        return continuationStart(code4);
      }
      effects.consume(code4);
      return continuation;
    }
    function continuationStart(code4) {
      return effects.check(nonLazyContinuationStart, continuationStartNonLazy, continuationAfter)(code4);
    }
    function continuationStartNonLazy(code4) {
      effects.enter("lineEnding");
      effects.consume(code4);
      effects.exit("lineEnding");
      return continuationBefore;
    }
    function continuationBefore(code4) {
      if (code4 === null || markdownLineEnding(code4)) {
        return continuationStart(code4);
      }
      effects.enter("htmlFlowData");
      return continuation(code4);
    }
    function continuationCommentInside(code4) {
      if (code4 === 45) {
        effects.consume(code4);
        return continuationDeclarationInside;
      }
      return continuation(code4);
    }
    function continuationRawTagOpen(code4) {
      if (code4 === 47) {
        effects.consume(code4);
        buffer = "";
        return continuationRawEndTag;
      }
      return continuation(code4);
    }
    function continuationRawEndTag(code4) {
      if (code4 === 62) {
        const name = buffer.toLowerCase();
        if (htmlRawNames.includes(name)) {
          effects.consume(code4);
          return continuationClose;
        }
        return continuation(code4);
      }
      if (asciiAlpha(code4) && buffer.length < 8) {
        effects.consume(code4);
        buffer += String.fromCharCode(code4);
        return continuationRawEndTag;
      }
      return continuation(code4);
    }
    function continuationCdataInside(code4) {
      if (code4 === 93) {
        effects.consume(code4);
        return continuationDeclarationInside;
      }
      return continuation(code4);
    }
    function continuationDeclarationInside(code4) {
      if (code4 === 62) {
        effects.consume(code4);
        return continuationClose;
      }
      if (code4 === 45 && marker === 2) {
        effects.consume(code4);
        return continuationDeclarationInside;
      }
      return continuation(code4);
    }
    function continuationClose(code4) {
      if (code4 === null || markdownLineEnding(code4)) {
        effects.exit("htmlFlowData");
        return continuationAfter(code4);
      }
      effects.consume(code4);
      return continuationClose;
    }
    function continuationAfter(code4) {
      effects.exit("htmlFlow");
      return ok3(code4);
    }
  }
  function tokenizeNonLazyContinuationStart(effects, ok3, nok) {
    const self2 = this;
    return start;
    function start(code4) {
      if (markdownLineEnding(code4)) {
        effects.enter("lineEnding");
        effects.consume(code4);
        effects.exit("lineEnding");
        return after;
      }
      return nok(code4);
    }
    function after(code4) {
      return self2.parser.lazy[self2.now().line] ? nok(code4) : ok3(code4);
    }
  }
  function tokenizeBlankLineBefore(effects, ok3, nok) {
    return start;
    function start(code4) {
      effects.enter("lineEnding");
      effects.consume(code4);
      effects.exit("lineEnding");
      return effects.attempt(blankLine, ok3, nok);
    }
  }

  // node_modules/micromark-core-commonmark/lib/html-text.js
  var htmlText = {
    name: "htmlText",
    tokenize: tokenizeHtmlText
  };
  function tokenizeHtmlText(effects, ok3, nok) {
    const self2 = this;
    let marker;
    let index2;
    let returnState;
    return start;
    function start(code4) {
      effects.enter("htmlText");
      effects.enter("htmlTextData");
      effects.consume(code4);
      return open;
    }
    function open(code4) {
      if (code4 === 33) {
        effects.consume(code4);
        return declarationOpen;
      }
      if (code4 === 47) {
        effects.consume(code4);
        return tagCloseStart;
      }
      if (code4 === 63) {
        effects.consume(code4);
        return instruction;
      }
      if (asciiAlpha(code4)) {
        effects.consume(code4);
        return tagOpen;
      }
      return nok(code4);
    }
    function declarationOpen(code4) {
      if (code4 === 45) {
        effects.consume(code4);
        return commentOpenInside;
      }
      if (code4 === 91) {
        effects.consume(code4);
        index2 = 0;
        return cdataOpenInside;
      }
      if (asciiAlpha(code4)) {
        effects.consume(code4);
        return declaration;
      }
      return nok(code4);
    }
    function commentOpenInside(code4) {
      if (code4 === 45) {
        effects.consume(code4);
        return commentEnd;
      }
      return nok(code4);
    }
    function comment4(code4) {
      if (code4 === null) {
        return nok(code4);
      }
      if (code4 === 45) {
        effects.consume(code4);
        return commentClose;
      }
      if (markdownLineEnding(code4)) {
        returnState = comment4;
        return lineEndingBefore(code4);
      }
      effects.consume(code4);
      return comment4;
    }
    function commentClose(code4) {
      if (code4 === 45) {
        effects.consume(code4);
        return commentEnd;
      }
      return comment4(code4);
    }
    function commentEnd(code4) {
      return code4 === 62 ? end(code4) : code4 === 45 ? commentClose(code4) : comment4(code4);
    }
    function cdataOpenInside(code4) {
      const value = "CDATA[";
      if (code4 === value.charCodeAt(index2++)) {
        effects.consume(code4);
        return index2 === value.length ? cdata : cdataOpenInside;
      }
      return nok(code4);
    }
    function cdata(code4) {
      if (code4 === null) {
        return nok(code4);
      }
      if (code4 === 93) {
        effects.consume(code4);
        return cdataClose;
      }
      if (markdownLineEnding(code4)) {
        returnState = cdata;
        return lineEndingBefore(code4);
      }
      effects.consume(code4);
      return cdata;
    }
    function cdataClose(code4) {
      if (code4 === 93) {
        effects.consume(code4);
        return cdataEnd;
      }
      return cdata(code4);
    }
    function cdataEnd(code4) {
      if (code4 === 62) {
        return end(code4);
      }
      if (code4 === 93) {
        effects.consume(code4);
        return cdataEnd;
      }
      return cdata(code4);
    }
    function declaration(code4) {
      if (code4 === null || code4 === 62) {
        return end(code4);
      }
      if (markdownLineEnding(code4)) {
        returnState = declaration;
        return lineEndingBefore(code4);
      }
      effects.consume(code4);
      return declaration;
    }
    function instruction(code4) {
      if (code4 === null) {
        return nok(code4);
      }
      if (code4 === 63) {
        effects.consume(code4);
        return instructionClose;
      }
      if (markdownLineEnding(code4)) {
        returnState = instruction;
        return lineEndingBefore(code4);
      }
      effects.consume(code4);
      return instruction;
    }
    function instructionClose(code4) {
      return code4 === 62 ? end(code4) : instruction(code4);
    }
    function tagCloseStart(code4) {
      if (asciiAlpha(code4)) {
        effects.consume(code4);
        return tagClose;
      }
      return nok(code4);
    }
    function tagClose(code4) {
      if (code4 === 45 || asciiAlphanumeric(code4)) {
        effects.consume(code4);
        return tagClose;
      }
      return tagCloseBetween(code4);
    }
    function tagCloseBetween(code4) {
      if (markdownLineEnding(code4)) {
        returnState = tagCloseBetween;
        return lineEndingBefore(code4);
      }
      if (markdownSpace(code4)) {
        effects.consume(code4);
        return tagCloseBetween;
      }
      return end(code4);
    }
    function tagOpen(code4) {
      if (code4 === 45 || asciiAlphanumeric(code4)) {
        effects.consume(code4);
        return tagOpen;
      }
      if (code4 === 47 || code4 === 62 || markdownLineEndingOrSpace(code4)) {
        return tagOpenBetween(code4);
      }
      return nok(code4);
    }
    function tagOpenBetween(code4) {
      if (code4 === 47) {
        effects.consume(code4);
        return end;
      }
      if (code4 === 58 || code4 === 95 || asciiAlpha(code4)) {
        effects.consume(code4);
        return tagOpenAttributeName;
      }
      if (markdownLineEnding(code4)) {
        returnState = tagOpenBetween;
        return lineEndingBefore(code4);
      }
      if (markdownSpace(code4)) {
        effects.consume(code4);
        return tagOpenBetween;
      }
      return end(code4);
    }
    function tagOpenAttributeName(code4) {
      if (code4 === 45 || code4 === 46 || code4 === 58 || code4 === 95 || asciiAlphanumeric(code4)) {
        effects.consume(code4);
        return tagOpenAttributeName;
      }
      return tagOpenAttributeNameAfter(code4);
    }
    function tagOpenAttributeNameAfter(code4) {
      if (code4 === 61) {
        effects.consume(code4);
        return tagOpenAttributeValueBefore;
      }
      if (markdownLineEnding(code4)) {
        returnState = tagOpenAttributeNameAfter;
        return lineEndingBefore(code4);
      }
      if (markdownSpace(code4)) {
        effects.consume(code4);
        return tagOpenAttributeNameAfter;
      }
      return tagOpenBetween(code4);
    }
    function tagOpenAttributeValueBefore(code4) {
      if (code4 === null || code4 === 60 || code4 === 61 || code4 === 62 || code4 === 96) {
        return nok(code4);
      }
      if (code4 === 34 || code4 === 39) {
        effects.consume(code4);
        marker = code4;
        return tagOpenAttributeValueQuoted;
      }
      if (markdownLineEnding(code4)) {
        returnState = tagOpenAttributeValueBefore;
        return lineEndingBefore(code4);
      }
      if (markdownSpace(code4)) {
        effects.consume(code4);
        return tagOpenAttributeValueBefore;
      }
      effects.consume(code4);
      return tagOpenAttributeValueUnquoted;
    }
    function tagOpenAttributeValueQuoted(code4) {
      if (code4 === marker) {
        effects.consume(code4);
        marker = void 0;
        return tagOpenAttributeValueQuotedAfter;
      }
      if (code4 === null) {
        return nok(code4);
      }
      if (markdownLineEnding(code4)) {
        returnState = tagOpenAttributeValueQuoted;
        return lineEndingBefore(code4);
      }
      effects.consume(code4);
      return tagOpenAttributeValueQuoted;
    }
    function tagOpenAttributeValueUnquoted(code4) {
      if (code4 === null || code4 === 34 || code4 === 39 || code4 === 60 || code4 === 61 || code4 === 96) {
        return nok(code4);
      }
      if (code4 === 47 || code4 === 62 || markdownLineEndingOrSpace(code4)) {
        return tagOpenBetween(code4);
      }
      effects.consume(code4);
      return tagOpenAttributeValueUnquoted;
    }
    function tagOpenAttributeValueQuotedAfter(code4) {
      if (code4 === 47 || code4 === 62 || markdownLineEndingOrSpace(code4)) {
        return tagOpenBetween(code4);
      }
      return nok(code4);
    }
    function end(code4) {
      if (code4 === 62) {
        effects.consume(code4);
        effects.exit("htmlTextData");
        effects.exit("htmlText");
        return ok3;
      }
      return nok(code4);
    }
    function lineEndingBefore(code4) {
      effects.exit("htmlTextData");
      effects.enter("lineEnding");
      effects.consume(code4);
      effects.exit("lineEnding");
      return lineEndingAfter;
    }
    function lineEndingAfter(code4) {
      return markdownSpace(code4) ? factorySpace(effects, lineEndingAfterPrefix, "linePrefix", self2.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4)(code4) : lineEndingAfterPrefix(code4);
    }
    function lineEndingAfterPrefix(code4) {
      effects.enter("htmlTextData");
      return returnState(code4);
    }
  }

  // node_modules/micromark-core-commonmark/lib/label-end.js
  var labelEnd = {
    name: "labelEnd",
    resolveAll: resolveAllLabelEnd,
    resolveTo: resolveToLabelEnd,
    tokenize: tokenizeLabelEnd
  };
  var resourceConstruct = {
    tokenize: tokenizeResource
  };
  var referenceFullConstruct = {
    tokenize: tokenizeReferenceFull
  };
  var referenceCollapsedConstruct = {
    tokenize: tokenizeReferenceCollapsed
  };
  function resolveAllLabelEnd(events) {
    let index2 = -1;
    const newEvents = [];
    while (++index2 < events.length) {
      const token = events[index2][1];
      newEvents.push(events[index2]);
      if (token.type === "labelImage" || token.type === "labelLink" || token.type === "labelEnd") {
        const offset = token.type === "labelImage" ? 4 : 2;
        token.type = "data";
        index2 += offset;
      }
    }
    if (events.length !== newEvents.length) {
      splice(events, 0, events.length, newEvents);
    }
    return events;
  }
  function resolveToLabelEnd(events, context) {
    let index2 = events.length;
    let offset = 0;
    let token;
    let open;
    let close;
    let media;
    while (index2--) {
      token = events[index2][1];
      if (open) {
        if (token.type === "link" || token.type === "labelLink" && token._inactive) {
          break;
        }
        if (events[index2][0] === "enter" && token.type === "labelLink") {
          token._inactive = true;
        }
      } else if (close) {
        if (events[index2][0] === "enter" && (token.type === "labelImage" || token.type === "labelLink") && !token._balanced) {
          open = index2;
          if (token.type !== "labelLink") {
            offset = 2;
            break;
          }
        }
      } else if (token.type === "labelEnd") {
        close = index2;
      }
    }
    const group = {
      type: events[open][1].type === "labelLink" ? "link" : "image",
      start: {
        ...events[open][1].start
      },
      end: {
        ...events[events.length - 1][1].end
      }
    };
    const label = {
      type: "label",
      start: {
        ...events[open][1].start
      },
      end: {
        ...events[close][1].end
      }
    };
    const text9 = {
      type: "labelText",
      start: {
        ...events[open + offset + 2][1].end
      },
      end: {
        ...events[close - 2][1].start
      }
    };
    media = [["enter", group, context], ["enter", label, context]];
    media = push(media, events.slice(open + 1, open + offset + 3));
    media = push(media, [["enter", text9, context]]);
    media = push(media, resolveAll(context.parser.constructs.insideSpan.null, events.slice(open + offset + 4, close - 3), context));
    media = push(media, [["exit", text9, context], events[close - 2], events[close - 1], ["exit", label, context]]);
    media = push(media, events.slice(close + 1));
    media = push(media, [["exit", group, context]]);
    splice(events, open, events.length, media);
    return events;
  }
  function tokenizeLabelEnd(effects, ok3, nok) {
    const self2 = this;
    let index2 = self2.events.length;
    let labelStart;
    let defined;
    while (index2--) {
      if ((self2.events[index2][1].type === "labelImage" || self2.events[index2][1].type === "labelLink") && !self2.events[index2][1]._balanced) {
        labelStart = self2.events[index2][1];
        break;
      }
    }
    return start;
    function start(code4) {
      if (!labelStart) {
        return nok(code4);
      }
      if (labelStart._inactive) {
        return labelEndNok(code4);
      }
      defined = self2.parser.defined.includes(normalizeIdentifier(self2.sliceSerialize({
        start: labelStart.end,
        end: self2.now()
      })));
      effects.enter("labelEnd");
      effects.enter("labelMarker");
      effects.consume(code4);
      effects.exit("labelMarker");
      effects.exit("labelEnd");
      return after;
    }
    function after(code4) {
      if (code4 === 40) {
        return effects.attempt(resourceConstruct, labelEndOk, defined ? labelEndOk : labelEndNok)(code4);
      }
      if (code4 === 91) {
        return effects.attempt(referenceFullConstruct, labelEndOk, defined ? referenceNotFull : labelEndNok)(code4);
      }
      return defined ? labelEndOk(code4) : labelEndNok(code4);
    }
    function referenceNotFull(code4) {
      return effects.attempt(referenceCollapsedConstruct, labelEndOk, labelEndNok)(code4);
    }
    function labelEndOk(code4) {
      return ok3(code4);
    }
    function labelEndNok(code4) {
      labelStart._balanced = true;
      return nok(code4);
    }
  }
  function tokenizeResource(effects, ok3, nok) {
    return resourceStart;
    function resourceStart(code4) {
      effects.enter("resource");
      effects.enter("resourceMarker");
      effects.consume(code4);
      effects.exit("resourceMarker");
      return resourceBefore;
    }
    function resourceBefore(code4) {
      return markdownLineEndingOrSpace(code4) ? factoryWhitespace(effects, resourceOpen)(code4) : resourceOpen(code4);
    }
    function resourceOpen(code4) {
      if (code4 === 41) {
        return resourceEnd(code4);
      }
      return factoryDestination(effects, resourceDestinationAfter, resourceDestinationMissing, "resourceDestination", "resourceDestinationLiteral", "resourceDestinationLiteralMarker", "resourceDestinationRaw", "resourceDestinationString", 32)(code4);
    }
    function resourceDestinationAfter(code4) {
      return markdownLineEndingOrSpace(code4) ? factoryWhitespace(effects, resourceBetween)(code4) : resourceEnd(code4);
    }
    function resourceDestinationMissing(code4) {
      return nok(code4);
    }
    function resourceBetween(code4) {
      if (code4 === 34 || code4 === 39 || code4 === 40) {
        return factoryTitle(effects, resourceTitleAfter, nok, "resourceTitle", "resourceTitleMarker", "resourceTitleString")(code4);
      }
      return resourceEnd(code4);
    }
    function resourceTitleAfter(code4) {
      return markdownLineEndingOrSpace(code4) ? factoryWhitespace(effects, resourceEnd)(code4) : resourceEnd(code4);
    }
    function resourceEnd(code4) {
      if (code4 === 41) {
        effects.enter("resourceMarker");
        effects.consume(code4);
        effects.exit("resourceMarker");
        effects.exit("resource");
        return ok3;
      }
      return nok(code4);
    }
  }
  function tokenizeReferenceFull(effects, ok3, nok) {
    const self2 = this;
    return referenceFull;
    function referenceFull(code4) {
      return factoryLabel.call(self2, effects, referenceFullAfter, referenceFullMissing, "reference", "referenceMarker", "referenceString")(code4);
    }
    function referenceFullAfter(code4) {
      return self2.parser.defined.includes(normalizeIdentifier(self2.sliceSerialize(self2.events[self2.events.length - 1][1]).slice(1, -1))) ? ok3(code4) : nok(code4);
    }
    function referenceFullMissing(code4) {
      return nok(code4);
    }
  }
  function tokenizeReferenceCollapsed(effects, ok3, nok) {
    return referenceCollapsedStart;
    function referenceCollapsedStart(code4) {
      effects.enter("reference");
      effects.enter("referenceMarker");
      effects.consume(code4);
      effects.exit("referenceMarker");
      return referenceCollapsedOpen;
    }
    function referenceCollapsedOpen(code4) {
      if (code4 === 93) {
        effects.enter("referenceMarker");
        effects.consume(code4);
        effects.exit("referenceMarker");
        effects.exit("reference");
        return ok3;
      }
      return nok(code4);
    }
  }

  // node_modules/micromark-core-commonmark/lib/label-start-image.js
  var labelStartImage = {
    name: "labelStartImage",
    resolveAll: labelEnd.resolveAll,
    tokenize: tokenizeLabelStartImage
  };
  function tokenizeLabelStartImage(effects, ok3, nok) {
    const self2 = this;
    return start;
    function start(code4) {
      effects.enter("labelImage");
      effects.enter("labelImageMarker");
      effects.consume(code4);
      effects.exit("labelImageMarker");
      return open;
    }
    function open(code4) {
      if (code4 === 91) {
        effects.enter("labelMarker");
        effects.consume(code4);
        effects.exit("labelMarker");
        effects.exit("labelImage");
        return after;
      }
      return nok(code4);
    }
    function after(code4) {
      return code4 === 94 && "_hiddenFootnoteSupport" in self2.parser.constructs ? nok(code4) : ok3(code4);
    }
  }

  // node_modules/micromark-core-commonmark/lib/label-start-link.js
  var labelStartLink = {
    name: "labelStartLink",
    resolveAll: labelEnd.resolveAll,
    tokenize: tokenizeLabelStartLink
  };
  function tokenizeLabelStartLink(effects, ok3, nok) {
    const self2 = this;
    return start;
    function start(code4) {
      effects.enter("labelLink");
      effects.enter("labelMarker");
      effects.consume(code4);
      effects.exit("labelMarker");
      effects.exit("labelLink");
      return after;
    }
    function after(code4) {
      return code4 === 94 && "_hiddenFootnoteSupport" in self2.parser.constructs ? nok(code4) : ok3(code4);
    }
  }

  // node_modules/micromark-core-commonmark/lib/line-ending.js
  var lineEnding = {
    name: "lineEnding",
    tokenize: tokenizeLineEnding
  };
  function tokenizeLineEnding(effects, ok3) {
    return start;
    function start(code4) {
      effects.enter("lineEnding");
      effects.consume(code4);
      effects.exit("lineEnding");
      return factorySpace(effects, ok3, "linePrefix");
    }
  }

  // node_modules/micromark-core-commonmark/lib/thematic-break.js
  var thematicBreak = {
    name: "thematicBreak",
    tokenize: tokenizeThematicBreak
  };
  function tokenizeThematicBreak(effects, ok3, nok) {
    let size = 0;
    let marker;
    return start;
    function start(code4) {
      effects.enter("thematicBreak");
      return before(code4);
    }
    function before(code4) {
      marker = code4;
      return atBreak(code4);
    }
    function atBreak(code4) {
      if (code4 === marker) {
        effects.enter("thematicBreakSequence");
        return sequence(code4);
      }
      if (size >= 3 && (code4 === null || markdownLineEnding(code4))) {
        effects.exit("thematicBreak");
        return ok3(code4);
      }
      return nok(code4);
    }
    function sequence(code4) {
      if (code4 === marker) {
        effects.consume(code4);
        size++;
        return sequence;
      }
      effects.exit("thematicBreakSequence");
      return markdownSpace(code4) ? factorySpace(effects, atBreak, "whitespace")(code4) : atBreak(code4);
    }
  }

  // node_modules/micromark-core-commonmark/lib/list.js
  var list = {
    continuation: {
      tokenize: tokenizeListContinuation
    },
    exit: tokenizeListEnd,
    name: "list",
    tokenize: tokenizeListStart
  };
  var listItemPrefixWhitespaceConstruct = {
    partial: true,
    tokenize: tokenizeListItemPrefixWhitespace
  };
  var indentConstruct = {
    partial: true,
    tokenize: tokenizeIndent
  };
  function tokenizeListStart(effects, ok3, nok) {
    const self2 = this;
    const tail = self2.events[self2.events.length - 1];
    let initialSize = tail && tail[1].type === "linePrefix" ? tail[2].sliceSerialize(tail[1], true).length : 0;
    let size = 0;
    return start;
    function start(code4) {
      const kind = self2.containerState.type || (code4 === 42 || code4 === 43 || code4 === 45 ? "listUnordered" : "listOrdered");
      if (kind === "listUnordered" ? !self2.containerState.marker || code4 === self2.containerState.marker : asciiDigit(code4)) {
        if (!self2.containerState.type) {
          self2.containerState.type = kind;
          effects.enter(kind, {
            _container: true
          });
        }
        if (kind === "listUnordered") {
          effects.enter("listItemPrefix");
          return code4 === 42 || code4 === 45 ? effects.check(thematicBreak, nok, atMarker)(code4) : atMarker(code4);
        }
        if (!self2.interrupt || code4 === 49) {
          effects.enter("listItemPrefix");
          effects.enter("listItemValue");
          return inside(code4);
        }
      }
      return nok(code4);
    }
    function inside(code4) {
      if (asciiDigit(code4) && ++size < 10) {
        effects.consume(code4);
        return inside;
      }
      if ((!self2.interrupt || size < 2) && (self2.containerState.marker ? code4 === self2.containerState.marker : code4 === 41 || code4 === 46)) {
        effects.exit("listItemValue");
        return atMarker(code4);
      }
      return nok(code4);
    }
    function atMarker(code4) {
      effects.enter("listItemMarker");
      effects.consume(code4);
      effects.exit("listItemMarker");
      self2.containerState.marker = self2.containerState.marker || code4;
      return effects.check(
        blankLine,
        // Can’t be empty when interrupting.
        self2.interrupt ? nok : onBlank,
        effects.attempt(listItemPrefixWhitespaceConstruct, endOfPrefix, otherPrefix)
      );
    }
    function onBlank(code4) {
      self2.containerState.initialBlankLine = true;
      initialSize++;
      return endOfPrefix(code4);
    }
    function otherPrefix(code4) {
      if (markdownSpace(code4)) {
        effects.enter("listItemPrefixWhitespace");
        effects.consume(code4);
        effects.exit("listItemPrefixWhitespace");
        return endOfPrefix;
      }
      return nok(code4);
    }
    function endOfPrefix(code4) {
      self2.containerState.size = initialSize + self2.sliceSerialize(effects.exit("listItemPrefix"), true).length;
      return ok3(code4);
    }
  }
  function tokenizeListContinuation(effects, ok3, nok) {
    const self2 = this;
    self2.containerState._closeFlow = void 0;
    return effects.check(blankLine, onBlank, notBlank);
    function onBlank(code4) {
      self2.containerState.furtherBlankLines = self2.containerState.furtherBlankLines || self2.containerState.initialBlankLine;
      return factorySpace(effects, ok3, "listItemIndent", self2.containerState.size + 1)(code4);
    }
    function notBlank(code4) {
      if (self2.containerState.furtherBlankLines || !markdownSpace(code4)) {
        self2.containerState.furtherBlankLines = void 0;
        self2.containerState.initialBlankLine = void 0;
        return notInCurrentItem(code4);
      }
      self2.containerState.furtherBlankLines = void 0;
      self2.containerState.initialBlankLine = void 0;
      return effects.attempt(indentConstruct, ok3, notInCurrentItem)(code4);
    }
    function notInCurrentItem(code4) {
      self2.containerState._closeFlow = true;
      self2.interrupt = void 0;
      return factorySpace(effects, effects.attempt(list, ok3, nok), "linePrefix", self2.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4)(code4);
    }
  }
  function tokenizeIndent(effects, ok3, nok) {
    const self2 = this;
    return factorySpace(effects, afterPrefix, "listItemIndent", self2.containerState.size + 1);
    function afterPrefix(code4) {
      const tail = self2.events[self2.events.length - 1];
      return tail && tail[1].type === "listItemIndent" && tail[2].sliceSerialize(tail[1], true).length === self2.containerState.size ? ok3(code4) : nok(code4);
    }
  }
  function tokenizeListEnd(effects) {
    effects.exit(this.containerState.type);
  }
  function tokenizeListItemPrefixWhitespace(effects, ok3, nok) {
    const self2 = this;
    return factorySpace(effects, afterPrefix, "listItemPrefixWhitespace", self2.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4 + 1);
    function afterPrefix(code4) {
      const tail = self2.events[self2.events.length - 1];
      return !markdownSpace(code4) && tail && tail[1].type === "listItemPrefixWhitespace" ? ok3(code4) : nok(code4);
    }
  }

  // node_modules/micromark-core-commonmark/lib/setext-underline.js
  var setextUnderline = {
    name: "setextUnderline",
    resolveTo: resolveToSetextUnderline,
    tokenize: tokenizeSetextUnderline
  };
  function resolveToSetextUnderline(events, context) {
    let index2 = events.length;
    let content3;
    let text9;
    let definition3;
    while (index2--) {
      if (events[index2][0] === "enter") {
        if (events[index2][1].type === "content") {
          content3 = index2;
          break;
        }
        if (events[index2][1].type === "paragraph") {
          text9 = index2;
        }
      } else {
        if (events[index2][1].type === "content") {
          events.splice(index2, 1);
        }
        if (!definition3 && events[index2][1].type === "definition") {
          definition3 = index2;
        }
      }
    }
    const heading3 = {
      type: "setextHeading",
      start: {
        ...events[content3][1].start
      },
      end: {
        ...events[events.length - 1][1].end
      }
    };
    events[text9][1].type = "setextHeadingText";
    if (definition3) {
      events.splice(text9, 0, ["enter", heading3, context]);
      events.splice(definition3 + 1, 0, ["exit", events[content3][1], context]);
      events[content3][1].end = {
        ...events[definition3][1].end
      };
    } else {
      events[content3][1] = heading3;
    }
    events.push(["exit", heading3, context]);
    return events;
  }
  function tokenizeSetextUnderline(effects, ok3, nok) {
    const self2 = this;
    let marker;
    return start;
    function start(code4) {
      let index2 = self2.events.length;
      let paragraph3;
      while (index2--) {
        if (self2.events[index2][1].type !== "lineEnding" && self2.events[index2][1].type !== "linePrefix" && self2.events[index2][1].type !== "content") {
          paragraph3 = self2.events[index2][1].type === "paragraph";
          break;
        }
      }
      if (!self2.parser.lazy[self2.now().line] && (self2.interrupt || paragraph3)) {
        effects.enter("setextHeadingLine");
        marker = code4;
        return before(code4);
      }
      return nok(code4);
    }
    function before(code4) {
      effects.enter("setextHeadingLineSequence");
      return inside(code4);
    }
    function inside(code4) {
      if (code4 === marker) {
        effects.consume(code4);
        return inside;
      }
      effects.exit("setextHeadingLineSequence");
      return markdownSpace(code4) ? factorySpace(effects, after, "lineSuffix")(code4) : after(code4);
    }
    function after(code4) {
      if (code4 === null || markdownLineEnding(code4)) {
        effects.exit("setextHeadingLine");
        return ok3(code4);
      }
      return nok(code4);
    }
  }

  // node_modules/micromark/lib/initialize/flow.js
  var flow = {
    tokenize: initializeFlow
  };
  function initializeFlow(effects) {
    const self2 = this;
    const initial = effects.attempt(
      // Try to parse a blank line.
      blankLine,
      atBlankEnding,
      // Try to parse initial flow (essentially, only code).
      effects.attempt(this.parser.constructs.flowInitial, afterConstruct, factorySpace(effects, effects.attempt(this.parser.constructs.flow, afterConstruct, effects.attempt(content2, afterConstruct)), "linePrefix"))
    );
    return initial;
    function atBlankEnding(code4) {
      if (code4 === null) {
        effects.consume(code4);
        return;
      }
      effects.enter("lineEndingBlank");
      effects.consume(code4);
      effects.exit("lineEndingBlank");
      self2.currentConstruct = void 0;
      return initial;
    }
    function afterConstruct(code4) {
      if (code4 === null) {
        effects.consume(code4);
        return;
      }
      effects.enter("lineEnding");
      effects.consume(code4);
      effects.exit("lineEnding");
      self2.currentConstruct = void 0;
      return initial;
    }
  }

  // node_modules/micromark/lib/initialize/text.js
  var resolver = {
    resolveAll: createResolver()
  };
  var string = initializeFactory("string");
  var text = initializeFactory("text");
  function initializeFactory(field) {
    return {
      resolveAll: createResolver(field === "text" ? resolveAllLineSuffixes : void 0),
      tokenize: initializeText
    };
    function initializeText(effects) {
      const self2 = this;
      const constructs2 = this.parser.constructs[field];
      const text9 = effects.attempt(constructs2, start, notText);
      return start;
      function start(code4) {
        return atBreak(code4) ? text9(code4) : notText(code4);
      }
      function notText(code4) {
        if (code4 === null) {
          effects.consume(code4);
          return;
        }
        effects.enter("data");
        effects.consume(code4);
        return data;
      }
      function data(code4) {
        if (atBreak(code4)) {
          effects.exit("data");
          return text9(code4);
        }
        effects.consume(code4);
        return data;
      }
      function atBreak(code4) {
        if (code4 === null) {
          return true;
        }
        const list4 = constructs2[code4];
        let index2 = -1;
        if (list4) {
          while (++index2 < list4.length) {
            const item = list4[index2];
            if (!item.previous || item.previous.call(self2, self2.previous)) {
              return true;
            }
          }
        }
        return false;
      }
    }
  }
  function createResolver(extraResolver) {
    return resolveAllText;
    function resolveAllText(events, context) {
      let index2 = -1;
      let enter;
      while (++index2 <= events.length) {
        if (enter === void 0) {
          if (events[index2] && events[index2][1].type === "data") {
            enter = index2;
            index2++;
          }
        } else if (!events[index2] || events[index2][1].type !== "data") {
          if (index2 !== enter + 2) {
            events[enter][1].end = events[index2 - 1][1].end;
            events.splice(enter + 2, index2 - enter - 2);
            index2 = enter + 2;
          }
          enter = void 0;
        }
      }
      return extraResolver ? extraResolver(events, context) : events;
    }
  }
  function resolveAllLineSuffixes(events, context) {
    let eventIndex = 0;
    while (++eventIndex <= events.length) {
      if ((eventIndex === events.length || events[eventIndex][1].type === "lineEnding") && events[eventIndex - 1][1].type === "data") {
        const data = events[eventIndex - 1][1];
        const chunks = context.sliceStream(data);
        let index2 = chunks.length;
        let bufferIndex = -1;
        let size = 0;
        let tabs;
        while (index2--) {
          const chunk = chunks[index2];
          if (typeof chunk === "string") {
            bufferIndex = chunk.length;
            while (chunk.charCodeAt(bufferIndex - 1) === 32) {
              size++;
              bufferIndex--;
            }
            if (bufferIndex) break;
            bufferIndex = -1;
          } else if (chunk === -2) {
            tabs = true;
            size++;
          } else if (chunk === -1) {
          } else {
            index2++;
            break;
          }
        }
        if (context._contentTypeTextTrailing && eventIndex === events.length) {
          size = 0;
        }
        if (size) {
          const token = {
            type: eventIndex === events.length || tabs || size < 2 ? "lineSuffix" : "hardBreakTrailing",
            start: {
              _bufferIndex: index2 ? bufferIndex : data.start._bufferIndex + bufferIndex,
              _index: data.start._index + index2,
              line: data.end.line,
              column: data.end.column - size,
              offset: data.end.offset - size
            },
            end: {
              ...data.end
            }
          };
          data.end = {
            ...token.start
          };
          if (data.start.offset === data.end.offset) {
            Object.assign(data, token);
          } else {
            events.splice(eventIndex, 0, ["enter", token, context], ["exit", token, context]);
            eventIndex += 2;
          }
        }
        eventIndex++;
      }
    }
    return events;
  }

  // node_modules/micromark/lib/constructs.js
  var constructs_exports = {};
  __export(constructs_exports, {
    attentionMarkers: () => attentionMarkers,
    contentInitial: () => contentInitial,
    disable: () => disable,
    document: () => document3,
    flow: () => flow2,
    flowInitial: () => flowInitial,
    insideSpan: () => insideSpan,
    string: () => string2,
    text: () => text2
  });
  var document3 = {
    [42]: list,
    [43]: list,
    [45]: list,
    [48]: list,
    [49]: list,
    [50]: list,
    [51]: list,
    [52]: list,
    [53]: list,
    [54]: list,
    [55]: list,
    [56]: list,
    [57]: list,
    [62]: blockQuote
  };
  var contentInitial = {
    [91]: definition
  };
  var flowInitial = {
    [-2]: codeIndented,
    [-1]: codeIndented,
    [32]: codeIndented
  };
  var flow2 = {
    [35]: headingAtx,
    [42]: thematicBreak,
    [45]: [setextUnderline, thematicBreak],
    [60]: htmlFlow,
    [61]: setextUnderline,
    [95]: thematicBreak,
    [96]: codeFenced,
    [126]: codeFenced
  };
  var string2 = {
    [38]: characterReference,
    [92]: characterEscape
  };
  var text2 = {
    [-5]: lineEnding,
    [-4]: lineEnding,
    [-3]: lineEnding,
    [33]: labelStartImage,
    [38]: characterReference,
    [42]: attention,
    [60]: [autolink, htmlText],
    [91]: labelStartLink,
    [92]: [hardBreakEscape, characterEscape],
    [93]: labelEnd,
    [95]: attention,
    [96]: codeText
  };
  var insideSpan = {
    null: [attention, resolver]
  };
  var attentionMarkers = {
    null: [42, 95]
  };
  var disable = {
    null: []
  };

  // node_modules/micromark/lib/create-tokenizer.js
  function createTokenizer(parser2, initialize, from) {
    let point4 = {
      _bufferIndex: -1,
      _index: 0,
      line: from && from.line || 1,
      column: from && from.column || 1,
      offset: from && from.offset || 0
    };
    const columnStart = {};
    const resolveAllConstructs = [];
    let chunks = [];
    let stack = [];
    let consumed = true;
    const effects = {
      attempt: constructFactory(onsuccessfulconstruct),
      check: constructFactory(onsuccessfulcheck),
      consume,
      enter,
      exit: exit3,
      interrupt: constructFactory(onsuccessfulcheck, {
        interrupt: true
      })
    };
    const context = {
      code: null,
      containerState: {},
      defineSkip,
      events: [],
      now,
      parser: parser2,
      previous: null,
      sliceSerialize,
      sliceStream,
      write
    };
    let state = initialize.tokenize.call(context, effects);
    let expectedCode;
    if (initialize.resolveAll) {
      resolveAllConstructs.push(initialize);
    }
    return context;
    function write(slice) {
      chunks = push(chunks, slice);
      main();
      if (chunks[chunks.length - 1] !== null) {
        return [];
      }
      addResult(initialize, 0);
      context.events = resolveAll(resolveAllConstructs, context.events, context);
      return context.events;
    }
    function sliceSerialize(token, expandTabs) {
      return serializeChunks(sliceStream(token), expandTabs);
    }
    function sliceStream(token) {
      return sliceChunks(chunks, token);
    }
    function now() {
      const {
        _bufferIndex,
        _index,
        line,
        column,
        offset
      } = point4;
      return {
        _bufferIndex,
        _index,
        line,
        column,
        offset
      };
    }
    function defineSkip(value) {
      columnStart[value.line] = value.column;
      accountForPotentialSkip();
    }
    function main() {
      let chunkIndex;
      while (point4._index < chunks.length) {
        const chunk = chunks[point4._index];
        if (typeof chunk === "string") {
          chunkIndex = point4._index;
          if (point4._bufferIndex < 0) {
            point4._bufferIndex = 0;
          }
          while (point4._index === chunkIndex && point4._bufferIndex < chunk.length) {
            go(chunk.charCodeAt(point4._bufferIndex));
          }
        } else {
          go(chunk);
        }
      }
    }
    function go(code4) {
      consumed = void 0;
      expectedCode = code4;
      state = state(code4);
    }
    function consume(code4) {
      if (markdownLineEnding(code4)) {
        point4.line++;
        point4.column = 1;
        point4.offset += code4 === -3 ? 2 : 1;
        accountForPotentialSkip();
      } else if (code4 !== -1) {
        point4.column++;
        point4.offset++;
      }
      if (point4._bufferIndex < 0) {
        point4._index++;
      } else {
        point4._bufferIndex++;
        if (point4._bufferIndex === // Points w/ non-negative `_bufferIndex` reference
        // strings.
        /** @type {string} */
        chunks[point4._index].length) {
          point4._bufferIndex = -1;
          point4._index++;
        }
      }
      context.previous = code4;
      consumed = true;
    }
    function enter(type, fields) {
      const token = fields || {};
      token.type = type;
      token.start = now();
      context.events.push(["enter", token, context]);
      stack.push(token);
      return token;
    }
    function exit3(type) {
      const token = stack.pop();
      token.end = now();
      context.events.push(["exit", token, context]);
      return token;
    }
    function onsuccessfulconstruct(construct, info) {
      addResult(construct, info.from);
    }
    function onsuccessfulcheck(_, info) {
      info.restore();
    }
    function constructFactory(onreturn, fields) {
      return hook;
      function hook(constructs2, returnState, bogusState) {
        let listOfConstructs;
        let constructIndex;
        let currentConstruct;
        let info;
        return Array.isArray(constructs2) ? (
          /* c8 ignore next 1 */
          handleListOfConstructs(constructs2)
        ) : "tokenize" in constructs2 ? (
          // Looks like a construct.
          handleListOfConstructs([
            /** @type {Construct} */
            constructs2
          ])
        ) : handleMapOfConstructs(constructs2);
        function handleMapOfConstructs(map3) {
          return start;
          function start(code4) {
            const left = code4 !== null && map3[code4];
            const all4 = code4 !== null && map3.null;
            const list4 = [
              // To do: add more extension tests.
              /* c8 ignore next 2 */
              ...Array.isArray(left) ? left : left ? [left] : [],
              ...Array.isArray(all4) ? all4 : all4 ? [all4] : []
            ];
            return handleListOfConstructs(list4)(code4);
          }
        }
        function handleListOfConstructs(list4) {
          listOfConstructs = list4;
          constructIndex = 0;
          if (list4.length === 0) {
            return bogusState;
          }
          return handleConstruct(list4[constructIndex]);
        }
        function handleConstruct(construct) {
          return start;
          function start(code4) {
            info = store();
            currentConstruct = construct;
            if (!construct.partial) {
              context.currentConstruct = construct;
            }
            if (construct.name && context.parser.constructs.disable.null.includes(construct.name)) {
              return nok(code4);
            }
            return construct.tokenize.call(
              // If we do have fields, create an object w/ `context` as its
              // prototype.
              // This allows a “live binding”, which is needed for `interrupt`.
              fields ? Object.assign(Object.create(context), fields) : context,
              effects,
              ok3,
              nok
            )(code4);
          }
        }
        function ok3(code4) {
          consumed = true;
          onreturn(currentConstruct, info);
          return returnState;
        }
        function nok(code4) {
          consumed = true;
          info.restore();
          if (++constructIndex < listOfConstructs.length) {
            return handleConstruct(listOfConstructs[constructIndex]);
          }
          return bogusState;
        }
      }
    }
    function addResult(construct, from2) {
      if (construct.resolveAll && !resolveAllConstructs.includes(construct)) {
        resolveAllConstructs.push(construct);
      }
      if (construct.resolve) {
        splice(context.events, from2, context.events.length - from2, construct.resolve(context.events.slice(from2), context));
      }
      if (construct.resolveTo) {
        context.events = construct.resolveTo(context.events, context);
      }
    }
    function store() {
      const startPoint = now();
      const startPrevious = context.previous;
      const startCurrentConstruct = context.currentConstruct;
      const startEventsIndex = context.events.length;
      const startStack = Array.from(stack);
      return {
        from: startEventsIndex,
        restore
      };
      function restore() {
        point4 = startPoint;
        context.previous = startPrevious;
        context.currentConstruct = startCurrentConstruct;
        context.events.length = startEventsIndex;
        stack = startStack;
        accountForPotentialSkip();
      }
    }
    function accountForPotentialSkip() {
      if (point4.line in columnStart && point4.column < 2) {
        point4.column = columnStart[point4.line];
        point4.offset += columnStart[point4.line] - 1;
      }
    }
  }
  function sliceChunks(chunks, token) {
    const startIndex = token.start._index;
    const startBufferIndex = token.start._bufferIndex;
    const endIndex = token.end._index;
    const endBufferIndex = token.end._bufferIndex;
    let view;
    if (startIndex === endIndex) {
      view = [chunks[startIndex].slice(startBufferIndex, endBufferIndex)];
    } else {
      view = chunks.slice(startIndex, endIndex);
      if (startBufferIndex > -1) {
        const head2 = view[0];
        if (typeof head2 === "string") {
          view[0] = head2.slice(startBufferIndex);
        } else {
          view.shift();
        }
      }
      if (endBufferIndex > 0) {
        view.push(chunks[endIndex].slice(0, endBufferIndex));
      }
    }
    return view;
  }
  function serializeChunks(chunks, expandTabs) {
    let index2 = -1;
    const result = [];
    let atTab;
    while (++index2 < chunks.length) {
      const chunk = chunks[index2];
      let value;
      if (typeof chunk === "string") {
        value = chunk;
      } else switch (chunk) {
        case -5: {
          value = "\r";
          break;
        }
        case -4: {
          value = "\n";
          break;
        }
        case -3: {
          value = "\r\n";
          break;
        }
        case -2: {
          value = expandTabs ? " " : "	";
          break;
        }
        case -1: {
          if (!expandTabs && atTab) continue;
          value = " ";
          break;
        }
        default: {
          value = String.fromCharCode(chunk);
        }
      }
      atTab = chunk === -2;
      result.push(value);
    }
    return result.join("");
  }

  // node_modules/micromark/lib/parse.js
  function parse(options) {
    const settings = options || {};
    const constructs2 = (
      /** @type {FullNormalizedExtension} */
      combineExtensions([constructs_exports, ...settings.extensions || []])
    );
    const parser2 = {
      constructs: constructs2,
      content: create2(content),
      defined: [],
      document: create2(document2),
      flow: create2(flow),
      lazy: {},
      string: create2(string),
      text: create2(text)
    };
    return parser2;
    function create2(initial) {
      return creator;
      function creator(from) {
        return createTokenizer(parser2, initial, from);
      }
    }
  }

  // node_modules/micromark/lib/postprocess.js
  function postprocess(events) {
    while (!subtokenize(events)) {
    }
    return events;
  }

  // node_modules/micromark/lib/preprocess.js
  var search = /[\0\t\n\r]/g;
  function preprocess() {
    let column = 1;
    let buffer = "";
    let start = true;
    let atCarriageReturn;
    return preprocessor;
    function preprocessor(value, encoding, end) {
      const chunks = [];
      let match;
      let next;
      let startPosition;
      let endPosition;
      let code4;
      value = buffer + (typeof value === "string" ? value.toString() : new TextDecoder(encoding || void 0).decode(value));
      startPosition = 0;
      buffer = "";
      if (start) {
        if (value.charCodeAt(0) === 65279) {
          startPosition++;
        }
        start = void 0;
      }
      while (startPosition < value.length) {
        search.lastIndex = startPosition;
        match = search.exec(value);
        endPosition = match && match.index !== void 0 ? match.index : value.length;
        code4 = value.charCodeAt(endPosition);
        if (!match) {
          buffer = value.slice(startPosition);
          break;
        }
        if (code4 === 10 && startPosition === endPosition && atCarriageReturn) {
          chunks.push(-3);
          atCarriageReturn = void 0;
        } else {
          if (atCarriageReturn) {
            chunks.push(-5);
            atCarriageReturn = void 0;
          }
          if (startPosition < endPosition) {
            chunks.push(value.slice(startPosition, endPosition));
            column += endPosition - startPosition;
          }
          switch (code4) {
            case 0: {
              chunks.push(65533);
              column++;
              break;
            }
            case 9: {
              next = Math.ceil(column / 4) * 4;
              chunks.push(-2);
              while (column++ < next) chunks.push(-1);
              break;
            }
            case 10: {
              chunks.push(-4);
              column = 1;
              break;
            }
            default: {
              atCarriageReturn = true;
              column = 1;
            }
          }
        }
        startPosition = endPosition + 1;
      }
      if (end) {
        if (atCarriageReturn) chunks.push(-5);
        if (buffer) chunks.push(buffer);
        chunks.push(null);
      }
      return chunks;
    }
  }

  // node_modules/micromark-util-decode-string/index.js
  var characterEscapeOrReference = /\\([!-/:-@[-`{-~])|&(#(?:\d{1,7}|x[\da-f]{1,6})|[\da-z]{1,31});/gi;
  function decodeString(value) {
    return value.replace(characterEscapeOrReference, decode);
  }
  function decode($0, $1, $2) {
    if ($1) {
      return $1;
    }
    const head2 = $2.charCodeAt(0);
    if (head2 === 35) {
      const head3 = $2.charCodeAt(1);
      const hex = head3 === 120 || head3 === 88;
      return decodeNumericCharacterReference($2.slice(hex ? 2 : 1), hex ? 16 : 10);
    }
    return decodeNamedCharacterReference($2) || $0;
  }

  // node_modules/mdast-util-from-markdown/lib/index.js
  var own2 = {}.hasOwnProperty;
  function fromMarkdown(value, encoding, options) {
    if (encoding && typeof encoding === "object") {
      options = encoding;
      encoding = void 0;
    }
    return compiler(options)(postprocess(parse(options).document().write(preprocess()(value, encoding, true))));
  }
  function compiler(options) {
    const config = {
      transforms: [],
      canContainEols: ["emphasis", "fragment", "heading", "paragraph", "strong"],
      enter: {
        autolink: opener(link3),
        autolinkProtocol: onenterdata,
        autolinkEmail: onenterdata,
        atxHeading: opener(heading3),
        blockQuote: opener(blockQuote2),
        characterEscape: onenterdata,
        characterReference: onenterdata,
        codeFenced: opener(codeFlow),
        codeFencedFenceInfo: buffer,
        codeFencedFenceMeta: buffer,
        codeIndented: opener(codeFlow, buffer),
        codeText: opener(codeText2, buffer),
        codeTextData: onenterdata,
        data: onenterdata,
        codeFlowValue: onenterdata,
        definition: opener(definition3),
        definitionDestinationString: buffer,
        definitionLabelString: buffer,
        definitionTitleString: buffer,
        emphasis: opener(emphasis3),
        hardBreakEscape: opener(hardBreak3),
        hardBreakTrailing: opener(hardBreak3),
        htmlFlow: opener(html7, buffer),
        htmlFlowData: onenterdata,
        htmlText: opener(html7, buffer),
        htmlTextData: onenterdata,
        image: opener(image3),
        label: buffer,
        link: opener(link3),
        listItem: opener(listItem3),
        listItemValue: onenterlistitemvalue,
        listOrdered: opener(list4, onenterlistordered),
        listUnordered: opener(list4),
        paragraph: opener(paragraph3),
        reference: onenterreference,
        referenceString: buffer,
        resourceDestinationString: buffer,
        resourceTitleString: buffer,
        setextHeading: opener(heading3),
        strong: opener(strong3),
        thematicBreak: opener(thematicBreak4)
      },
      exit: {
        atxHeading: closer(),
        atxHeadingSequence: onexitatxheadingsequence,
        autolink: closer(),
        autolinkEmail: onexitautolinkemail,
        autolinkProtocol: onexitautolinkprotocol,
        blockQuote: closer(),
        characterEscapeValue: onexitdata,
        characterReferenceMarkerHexadecimal: onexitcharacterreferencemarker,
        characterReferenceMarkerNumeric: onexitcharacterreferencemarker,
        characterReferenceValue: onexitcharacterreferencevalue,
        characterReference: onexitcharacterreference,
        codeFenced: closer(onexitcodefenced),
        codeFencedFence: onexitcodefencedfence,
        codeFencedFenceInfo: onexitcodefencedfenceinfo,
        codeFencedFenceMeta: onexitcodefencedfencemeta,
        codeFlowValue: onexitdata,
        codeIndented: closer(onexitcodeindented),
        codeText: closer(onexitcodetext),
        codeTextData: onexitdata,
        data: onexitdata,
        definition: closer(),
        definitionDestinationString: onexitdefinitiondestinationstring,
        definitionLabelString: onexitdefinitionlabelstring,
        definitionTitleString: onexitdefinitiontitlestring,
        emphasis: closer(),
        hardBreakEscape: closer(onexithardbreak),
        hardBreakTrailing: closer(onexithardbreak),
        htmlFlow: closer(onexithtmlflow),
        htmlFlowData: onexitdata,
        htmlText: closer(onexithtmltext),
        htmlTextData: onexitdata,
        image: closer(onexitimage),
        label: onexitlabel,
        labelText: onexitlabeltext,
        lineEnding: onexitlineending,
        link: closer(onexitlink),
        listItem: closer(),
        listOrdered: closer(),
        listUnordered: closer(),
        paragraph: closer(),
        referenceString: onexitreferencestring,
        resourceDestinationString: onexitresourcedestinationstring,
        resourceTitleString: onexitresourcetitlestring,
        resource: onexitresource,
        setextHeading: closer(onexitsetextheading),
        setextHeadingLineSequence: onexitsetextheadinglinesequence,
        setextHeadingText: onexitsetextheadingtext,
        strong: closer(),
        thematicBreak: closer()
      }
    };
    configure(config, (options || {}).mdastExtensions || []);
    const data = {};
    return compile;
    function compile(events) {
      let tree = {
        type: "root",
        children: []
      };
      const context = {
        stack: [tree],
        tokenStack: [],
        config,
        enter,
        exit: exit3,
        buffer,
        resume,
        data
      };
      const listStack = [];
      let index2 = -1;
      while (++index2 < events.length) {
        if (events[index2][1].type === "listOrdered" || events[index2][1].type === "listUnordered") {
          if (events[index2][0] === "enter") {
            listStack.push(index2);
          } else {
            const tail = listStack.pop();
            index2 = prepareList(events, tail, index2);
          }
        }
      }
      index2 = -1;
      while (++index2 < events.length) {
        const handler = config[events[index2][0]];
        if (own2.call(handler, events[index2][1].type)) {
          handler[events[index2][1].type].call(Object.assign({
            sliceSerialize: events[index2][2].sliceSerialize
          }, context), events[index2][1]);
        }
      }
      if (context.tokenStack.length > 0) {
        const tail = context.tokenStack[context.tokenStack.length - 1];
        const handler = tail[1] || defaultOnError;
        handler.call(context, void 0, tail[0]);
      }
      tree.position = {
        start: point2(events.length > 0 ? events[0][1].start : {
          line: 1,
          column: 1,
          offset: 0
        }),
        end: point2(events.length > 0 ? events[events.length - 2][1].end : {
          line: 1,
          column: 1,
          offset: 0
        })
      };
      index2 = -1;
      while (++index2 < config.transforms.length) {
        tree = config.transforms[index2](tree) || tree;
      }
      return tree;
    }
    function prepareList(events, start, length) {
      let index2 = start - 1;
      let containerBalance = -1;
      let listSpread = false;
      let listItem4;
      let lineIndex;
      let firstBlankLineIndex;
      let atMarker;
      while (++index2 <= length) {
        const event = events[index2];
        switch (event[1].type) {
          case "listUnordered":
          case "listOrdered":
          case "blockQuote": {
            if (event[0] === "enter") {
              containerBalance++;
            } else {
              containerBalance--;
            }
            atMarker = void 0;
            break;
          }
          case "lineEndingBlank": {
            if (event[0] === "enter") {
              if (listItem4 && !atMarker && !containerBalance && !firstBlankLineIndex) {
                firstBlankLineIndex = index2;
              }
              atMarker = void 0;
            }
            break;
          }
          case "linePrefix":
          case "listItemValue":
          case "listItemMarker":
          case "listItemPrefix":
          case "listItemPrefixWhitespace": {
            break;
          }
          default: {
            atMarker = void 0;
          }
        }
        if (!containerBalance && event[0] === "enter" && event[1].type === "listItemPrefix" || containerBalance === -1 && event[0] === "exit" && (event[1].type === "listUnordered" || event[1].type === "listOrdered")) {
          if (listItem4) {
            let tailIndex = index2;
            lineIndex = void 0;
            while (tailIndex--) {
              const tailEvent = events[tailIndex];
              if (tailEvent[1].type === "lineEnding" || tailEvent[1].type === "lineEndingBlank") {
                if (tailEvent[0] === "exit") continue;
                if (lineIndex) {
                  events[lineIndex][1].type = "lineEndingBlank";
                  listSpread = true;
                }
                tailEvent[1].type = "lineEnding";
                lineIndex = tailIndex;
              } else if (tailEvent[1].type === "linePrefix" || tailEvent[1].type === "blockQuotePrefix" || tailEvent[1].type === "blockQuotePrefixWhitespace" || tailEvent[1].type === "blockQuoteMarker" || tailEvent[1].type === "listItemIndent") {
              } else {
                break;
              }
            }
            if (firstBlankLineIndex && (!lineIndex || firstBlankLineIndex < lineIndex)) {
              listItem4._spread = true;
            }
            listItem4.end = Object.assign({}, lineIndex ? events[lineIndex][1].start : event[1].end);
            events.splice(lineIndex || index2, 0, ["exit", listItem4, event[2]]);
            index2++;
            length++;
          }
          if (event[1].type === "listItemPrefix") {
            const item = {
              type: "listItem",
              _spread: false,
              start: Object.assign({}, event[1].start),
              // @ts-expect-error: we’ll add `end` in a second.
              end: void 0
            };
            listItem4 = item;
            events.splice(index2, 0, ["enter", item, event[2]]);
            index2++;
            length++;
            firstBlankLineIndex = void 0;
            atMarker = true;
          }
        }
      }
      events[start][1]._spread = listSpread;
      return length;
    }
    function opener(create2, and) {
      return open;
      function open(token) {
        enter.call(this, create2(token), token);
        if (and) and.call(this, token);
      }
    }
    function buffer() {
      this.stack.push({
        type: "fragment",
        children: []
      });
    }
    function enter(node2, token, errorHandler) {
      const parent = this.stack[this.stack.length - 1];
      const siblings2 = parent.children;
      siblings2.push(node2);
      this.stack.push(node2);
      this.tokenStack.push([token, errorHandler || void 0]);
      node2.position = {
        start: point2(token.start),
        // @ts-expect-error: `end` will be patched later.
        end: void 0
      };
    }
    function closer(and) {
      return close;
      function close(token) {
        if (and) and.call(this, token);
        exit3.call(this, token);
      }
    }
    function exit3(token, onExitError) {
      const node2 = this.stack.pop();
      const open = this.tokenStack.pop();
      if (!open) {
        throw new Error("Cannot close `" + token.type + "` (" + stringifyPosition({
          start: token.start,
          end: token.end
        }) + "): it\u2019s not open");
      } else if (open[0].type !== token.type) {
        if (onExitError) {
          onExitError.call(this, token, open[0]);
        } else {
          const handler = open[1] || defaultOnError;
          handler.call(this, token, open[0]);
        }
      }
      node2.position.end = point2(token.end);
    }
    function resume() {
      return toString(this.stack.pop());
    }
    function onenterlistordered() {
      this.data.expectingFirstListItemValue = true;
    }
    function onenterlistitemvalue(token) {
      if (this.data.expectingFirstListItemValue) {
        const ancestor = this.stack[this.stack.length - 2];
        ancestor.start = Number.parseInt(this.sliceSerialize(token), 10);
        this.data.expectingFirstListItemValue = void 0;
      }
    }
    function onexitcodefencedfenceinfo() {
      const data2 = this.resume();
      const node2 = this.stack[this.stack.length - 1];
      node2.lang = data2;
    }
    function onexitcodefencedfencemeta() {
      const data2 = this.resume();
      const node2 = this.stack[this.stack.length - 1];
      node2.meta = data2;
    }
    function onexitcodefencedfence() {
      if (this.data.flowCodeInside) return;
      this.buffer();
      this.data.flowCodeInside = true;
    }
    function onexitcodefenced() {
      const data2 = this.resume();
      const node2 = this.stack[this.stack.length - 1];
      node2.value = data2.replace(/^(\r?\n|\r)|(\r?\n|\r)$/g, "");
      this.data.flowCodeInside = void 0;
    }
    function onexitcodeindented() {
      const data2 = this.resume();
      const node2 = this.stack[this.stack.length - 1];
      node2.value = data2.replace(/(\r?\n|\r)$/g, "");
    }
    function onexitdefinitionlabelstring(token) {
      const label = this.resume();
      const node2 = this.stack[this.stack.length - 1];
      node2.label = label;
      node2.identifier = normalizeIdentifier(this.sliceSerialize(token)).toLowerCase();
    }
    function onexitdefinitiontitlestring() {
      const data2 = this.resume();
      const node2 = this.stack[this.stack.length - 1];
      node2.title = data2;
    }
    function onexitdefinitiondestinationstring() {
      const data2 = this.resume();
      const node2 = this.stack[this.stack.length - 1];
      node2.url = data2;
    }
    function onexitatxheadingsequence(token) {
      const node2 = this.stack[this.stack.length - 1];
      if (!node2.depth) {
        const depth = this.sliceSerialize(token).length;
        node2.depth = depth;
      }
    }
    function onexitsetextheadingtext() {
      this.data.setextHeadingSlurpLineEnding = true;
    }
    function onexitsetextheadinglinesequence(token) {
      const node2 = this.stack[this.stack.length - 1];
      node2.depth = this.sliceSerialize(token).codePointAt(0) === 61 ? 1 : 2;
    }
    function onexitsetextheading() {
      this.data.setextHeadingSlurpLineEnding = void 0;
    }
    function onenterdata(token) {
      const node2 = this.stack[this.stack.length - 1];
      const siblings2 = node2.children;
      let tail = siblings2[siblings2.length - 1];
      if (!tail || tail.type !== "text") {
        tail = text9();
        tail.position = {
          start: point2(token.start),
          // @ts-expect-error: we’ll add `end` later.
          end: void 0
        };
        siblings2.push(tail);
      }
      this.stack.push(tail);
    }
    function onexitdata(token) {
      const tail = this.stack.pop();
      tail.value += this.sliceSerialize(token);
      tail.position.end = point2(token.end);
    }
    function onexitlineending(token) {
      const context = this.stack[this.stack.length - 1];
      if (this.data.atHardBreak) {
        const tail = context.children[context.children.length - 1];
        tail.position.end = point2(token.end);
        this.data.atHardBreak = void 0;
        return;
      }
      if (!this.data.setextHeadingSlurpLineEnding && config.canContainEols.includes(context.type)) {
        onenterdata.call(this, token);
        onexitdata.call(this, token);
      }
    }
    function onexithardbreak() {
      this.data.atHardBreak = true;
    }
    function onexithtmlflow() {
      const data2 = this.resume();
      const node2 = this.stack[this.stack.length - 1];
      node2.value = data2;
    }
    function onexithtmltext() {
      const data2 = this.resume();
      const node2 = this.stack[this.stack.length - 1];
      node2.value = data2;
    }
    function onexitcodetext() {
      const data2 = this.resume();
      const node2 = this.stack[this.stack.length - 1];
      node2.value = data2;
    }
    function onexitlink() {
      const node2 = this.stack[this.stack.length - 1];
      if (this.data.inReference) {
        const referenceType = this.data.referenceType || "shortcut";
        node2.type += "Reference";
        node2.referenceType = referenceType;
        delete node2.url;
        delete node2.title;
      } else {
        delete node2.identifier;
        delete node2.label;
      }
      this.data.referenceType = void 0;
    }
    function onexitimage() {
      const node2 = this.stack[this.stack.length - 1];
      if (this.data.inReference) {
        const referenceType = this.data.referenceType || "shortcut";
        node2.type += "Reference";
        node2.referenceType = referenceType;
        delete node2.url;
        delete node2.title;
      } else {
        delete node2.identifier;
        delete node2.label;
      }
      this.data.referenceType = void 0;
    }
    function onexitlabeltext(token) {
      const string3 = this.sliceSerialize(token);
      const ancestor = this.stack[this.stack.length - 2];
      ancestor.label = decodeString(string3);
      ancestor.identifier = normalizeIdentifier(string3).toLowerCase();
    }
    function onexitlabel() {
      const fragment = this.stack[this.stack.length - 1];
      const value = this.resume();
      const node2 = this.stack[this.stack.length - 1];
      this.data.inReference = true;
      if (node2.type === "link") {
        const children2 = fragment.children;
        node2.children = children2;
      } else {
        node2.alt = value;
      }
    }
    function onexitresourcedestinationstring() {
      const data2 = this.resume();
      const node2 = this.stack[this.stack.length - 1];
      node2.url = data2;
    }
    function onexitresourcetitlestring() {
      const data2 = this.resume();
      const node2 = this.stack[this.stack.length - 1];
      node2.title = data2;
    }
    function onexitresource() {
      this.data.inReference = void 0;
    }
    function onenterreference() {
      this.data.referenceType = "collapsed";
    }
    function onexitreferencestring(token) {
      const label = this.resume();
      const node2 = this.stack[this.stack.length - 1];
      node2.label = label;
      node2.identifier = normalizeIdentifier(this.sliceSerialize(token)).toLowerCase();
      this.data.referenceType = "full";
    }
    function onexitcharacterreferencemarker(token) {
      this.data.characterReferenceType = token.type;
    }
    function onexitcharacterreferencevalue(token) {
      const data2 = this.sliceSerialize(token);
      const type = this.data.characterReferenceType;
      let value;
      if (type) {
        value = decodeNumericCharacterReference(data2, type === "characterReferenceMarkerNumeric" ? 10 : 16);
        this.data.characterReferenceType = void 0;
      } else {
        const result = decodeNamedCharacterReference(data2);
        value = result;
      }
      const tail = this.stack[this.stack.length - 1];
      tail.value += value;
    }
    function onexitcharacterreference(token) {
      const tail = this.stack.pop();
      tail.position.end = point2(token.end);
    }
    function onexitautolinkprotocol(token) {
      onexitdata.call(this, token);
      const node2 = this.stack[this.stack.length - 1];
      node2.url = this.sliceSerialize(token);
    }
    function onexitautolinkemail(token) {
      onexitdata.call(this, token);
      const node2 = this.stack[this.stack.length - 1];
      node2.url = "mailto:" + this.sliceSerialize(token);
    }
    function blockQuote2() {
      return {
        type: "blockquote",
        children: []
      };
    }
    function codeFlow() {
      return {
        type: "code",
        lang: null,
        meta: null,
        value: ""
      };
    }
    function codeText2() {
      return {
        type: "inlineCode",
        value: ""
      };
    }
    function definition3() {
      return {
        type: "definition",
        identifier: "",
        label: null,
        title: null,
        url: ""
      };
    }
    function emphasis3() {
      return {
        type: "emphasis",
        children: []
      };
    }
    function heading3() {
      return {
        type: "heading",
        // @ts-expect-error `depth` will be set later.
        depth: 0,
        children: []
      };
    }
    function hardBreak3() {
      return {
        type: "break"
      };
    }
    function html7() {
      return {
        type: "html",
        value: ""
      };
    }
    function image3() {
      return {
        type: "image",
        title: null,
        url: "",
        alt: null
      };
    }
    function link3() {
      return {
        type: "link",
        title: null,
        url: "",
        children: []
      };
    }
    function list4(token) {
      return {
        type: "list",
        ordered: token.type === "listOrdered",
        start: null,
        spread: token._spread,
        children: []
      };
    }
    function listItem3(token) {
      return {
        type: "listItem",
        spread: token._spread,
        checked: null,
        children: []
      };
    }
    function paragraph3() {
      return {
        type: "paragraph",
        children: []
      };
    }
    function strong3() {
      return {
        type: "strong",
        children: []
      };
    }
    function text9() {
      return {
        type: "text",
        value: ""
      };
    }
    function thematicBreak4() {
      return {
        type: "thematicBreak"
      };
    }
  }
  function point2(d) {
    return {
      line: d.line,
      column: d.column,
      offset: d.offset
    };
  }
  function configure(combined, extensions) {
    let index2 = -1;
    while (++index2 < extensions.length) {
      const value = extensions[index2];
      if (Array.isArray(value)) {
        configure(combined, value);
      } else {
        extension(combined, value);
      }
    }
  }
  function extension(combined, extension2) {
    let key2;
    for (key2 in extension2) {
      if (own2.call(extension2, key2)) {
        switch (key2) {
          case "canContainEols": {
            const right = extension2[key2];
            if (right) {
              combined[key2].push(...right);
            }
            break;
          }
          case "transforms": {
            const right = extension2[key2];
            if (right) {
              combined[key2].push(...right);
            }
            break;
          }
          case "enter":
          case "exit": {
            const right = extension2[key2];
            if (right) {
              Object.assign(combined[key2], right);
            }
            break;
          }
        }
      }
    }
  }
  function defaultOnError(left, right) {
    if (left) {
      throw new Error("Cannot close `" + left.type + "` (" + stringifyPosition({
        start: left.start,
        end: left.end
      }) + "): a different token (`" + right.type + "`, " + stringifyPosition({
        start: right.start,
        end: right.end
      }) + ") is open");
    } else {
      throw new Error("Cannot close document, a token (`" + right.type + "`, " + stringifyPosition({
        start: right.start,
        end: right.end
      }) + ") is still open");
    }
  }

  // node_modules/remark-parse/lib/index.js
  function remarkParse(options) {
    const self2 = this;
    self2.parser = parser2;
    function parser2(doc) {
      return fromMarkdown(doc, {
        ...self2.data("settings"),
        ...options,
        // Note: these options are not in the readme.
        // The goal is for them to be set by plugins on `data` instead of being
        // passed by users.
        extensions: self2.data("micromarkExtensions") || [],
        mdastExtensions: self2.data("fromMarkdownExtensions") || []
      });
    }
  }

  // node_modules/ccount/index.js
  function ccount(value, character) {
    const source = String(value);
    if (typeof character !== "string") {
      throw new TypeError("Expected character");
    }
    let count = 0;
    let index2 = source.indexOf(character);
    while (index2 !== -1) {
      count++;
      index2 = source.indexOf(character, index2 + character.length);
    }
    return count;
  }

  // node_modules/escape-string-regexp/index.js
  function escapeStringRegexp(string3) {
    if (typeof string3 !== "string") {
      throw new TypeError("Expected a string");
    }
    return string3.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&").replace(/-/g, "\\x2d");
  }

  // node_modules/unist-util-is/lib/index.js
  var convert = (
    // Note: overloads in JSDoc can’t yet use different `@template`s.
    /**
     * @type {(
     *   (<Condition extends string>(test: Condition) => (node: unknown, index?: number | null | undefined, parent?: Parent | null | undefined, context?: unknown) => node is Node & {type: Condition}) &
     *   (<Condition extends Props>(test: Condition) => (node: unknown, index?: number | null | undefined, parent?: Parent | null | undefined, context?: unknown) => node is Node & Condition) &
     *   (<Condition extends TestFunction>(test: Condition) => (node: unknown, index?: number | null | undefined, parent?: Parent | null | undefined, context?: unknown) => node is Node & Predicate<Condition, Node>) &
     *   ((test?: null | undefined) => (node?: unknown, index?: number | null | undefined, parent?: Parent | null | undefined, context?: unknown) => node is Node) &
     *   ((test?: Test) => Check)
     * )}
     */
    /**
     * @param {Test} [test]
     * @returns {Check}
     */
    (function(test) {
      if (test === null || test === void 0) {
        return ok2;
      }
      if (typeof test === "function") {
        return castFactory(test);
      }
      if (typeof test === "object") {
        return Array.isArray(test) ? anyFactory(test) : (
          // Cast because `ReadonlyArray` goes into the above but `isArray`
          // narrows to `Array`.
          propertiesFactory(
            /** @type {Props} */
            test
          )
        );
      }
      if (typeof test === "string") {
        return typeFactory(test);
      }
      throw new Error("Expected function, string, or object as test");
    })
  );
  function anyFactory(tests) {
    const checks2 = [];
    let index2 = -1;
    while (++index2 < tests.length) {
      checks2[index2] = convert(tests[index2]);
    }
    return castFactory(any);
    function any(...parameters) {
      let index3 = -1;
      while (++index3 < checks2.length) {
        if (checks2[index3].apply(this, parameters)) return true;
      }
      return false;
    }
  }
  function propertiesFactory(check) {
    const checkAsRecord = (
      /** @type {Record<string, unknown>} */
      check
    );
    return castFactory(all4);
    function all4(node2) {
      const nodeAsRecord = (
        /** @type {Record<string, unknown>} */
        /** @type {unknown} */
        node2
      );
      let key2;
      for (key2 in check) {
        if (nodeAsRecord[key2] !== checkAsRecord[key2]) return false;
      }
      return true;
    }
  }
  function typeFactory(check) {
    return castFactory(type);
    function type(node2) {
      return node2 && node2.type === check;
    }
  }
  function castFactory(testFunction) {
    return check;
    function check(value, index2, parent) {
      return Boolean(
        looksLikeANode(value) && testFunction.call(
          this,
          value,
          typeof index2 === "number" ? index2 : void 0,
          parent || void 0
        )
      );
    }
  }
  function ok2() {
    return true;
  }
  function looksLikeANode(value) {
    return value !== null && typeof value === "object" && "type" in value;
  }

  // node_modules/unist-util-visit-parents/lib/color.js
  function color(d) {
    return d;
  }

  // node_modules/unist-util-visit-parents/lib/index.js
  var empty = [];
  var CONTINUE = true;
  var EXIT = false;
  var SKIP = "skip";
  function visitParents(tree, test, visitor, reverse) {
    let check;
    if (typeof test === "function" && typeof visitor !== "function") {
      reverse = visitor;
      visitor = test;
    } else {
      check = test;
    }
    const is2 = convert(check);
    const step = reverse ? -1 : 1;
    factory(tree, void 0, [])();
    function factory(node2, index2, parents) {
      const value = (
        /** @type {Record<string, unknown>} */
        node2 && typeof node2 === "object" ? node2 : {}
      );
      if (typeof value.type === "string") {
        const name = (
          // `hast`
          typeof value.tagName === "string" ? value.tagName : (
            // `xast`
            typeof value.name === "string" ? value.name : void 0
          )
        );
        Object.defineProperty(visit2, "name", {
          value: "node (" + color(node2.type + (name ? "<" + name + ">" : "")) + ")"
        });
      }
      return visit2;
      function visit2() {
        let result = empty;
        let subresult;
        let offset;
        let grandparents;
        if (!test || is2(node2, index2, parents[parents.length - 1] || void 0)) {
          result = toResult(visitor(node2, parents));
          if (result[0] === EXIT) {
            return result;
          }
        }
        if ("children" in node2 && node2.children) {
          const nodeAsParent = (
            /** @type {UnistParent} */
            node2
          );
          if (nodeAsParent.children && result[0] !== SKIP) {
            offset = (reverse ? nodeAsParent.children.length : -1) + step;
            grandparents = parents.concat(nodeAsParent);
            while (offset > -1 && offset < nodeAsParent.children.length) {
              const child = nodeAsParent.children[offset];
              subresult = factory(child, offset, grandparents)();
              if (subresult[0] === EXIT) {
                return subresult;
              }
              offset = typeof subresult[1] === "number" ? subresult[1] : offset + step;
            }
          }
        }
        return result;
      }
    }
  }
  function toResult(value) {
    if (Array.isArray(value)) {
      return value;
    }
    if (typeof value === "number") {
      return [CONTINUE, value];
    }
    return value === null || value === void 0 ? empty : [value];
  }

  // node_modules/mdast-util-find-and-replace/lib/index.js
  function findAndReplace(tree, list4, options) {
    const settings = options || {};
    const ignored = convert(settings.ignore || []);
    const pairs = toPairs(list4);
    let pairIndex = -1;
    while (++pairIndex < pairs.length) {
      visitParents(tree, "text", visitor);
    }
    function visitor(node2, parents) {
      let index2 = -1;
      let grandparent;
      while (++index2 < parents.length) {
        const parent = parents[index2];
        const siblings2 = grandparent ? grandparent.children : void 0;
        if (ignored(
          parent,
          siblings2 ? siblings2.indexOf(parent) : void 0,
          grandparent
        )) {
          return;
        }
        grandparent = parent;
      }
      if (grandparent) {
        return handler(node2, parents);
      }
    }
    function handler(node2, parents) {
      const parent = parents[parents.length - 1];
      const find2 = pairs[pairIndex][0];
      const replace2 = pairs[pairIndex][1];
      let start = 0;
      const siblings2 = parent.children;
      const index2 = siblings2.indexOf(node2);
      let change = false;
      let nodes = [];
      find2.lastIndex = 0;
      let match = find2.exec(node2.value);
      while (match) {
        const position3 = match.index;
        const matchObject = {
          index: match.index,
          input: match.input,
          stack: [...parents, node2]
        };
        let value = replace2(...match, matchObject);
        if (typeof value === "string") {
          value = value.length > 0 ? { type: "text", value } : void 0;
        }
        if (value === false) {
          find2.lastIndex = position3 + 1;
        } else {
          if (start !== position3) {
            nodes.push({
              type: "text",
              value: node2.value.slice(start, position3)
            });
          }
          if (Array.isArray(value)) {
            nodes.push(...value);
          } else if (value) {
            nodes.push(value);
          }
          start = position3 + match[0].length;
          change = true;
        }
        if (!find2.global) {
          break;
        }
        match = find2.exec(node2.value);
      }
      if (change) {
        if (start < node2.value.length) {
          nodes.push({ type: "text", value: node2.value.slice(start) });
        }
        parent.children.splice(index2, 1, ...nodes);
      } else {
        nodes = [node2];
      }
      return index2 + nodes.length;
    }
  }
  function toPairs(tupleOrList) {
    const result = [];
    if (!Array.isArray(tupleOrList)) {
      throw new TypeError("Expected find and replace tuple or list of tuples");
    }
    const list4 = !tupleOrList[0] || Array.isArray(tupleOrList[0]) ? tupleOrList : [tupleOrList];
    let index2 = -1;
    while (++index2 < list4.length) {
      const tuple = list4[index2];
      result.push([toExpression(tuple[0]), toFunction(tuple[1])]);
    }
    return result;
  }
  function toExpression(find2) {
    return typeof find2 === "string" ? new RegExp(escapeStringRegexp(find2), "g") : find2;
  }
  function toFunction(replace2) {
    return typeof replace2 === "function" ? replace2 : function() {
      return replace2;
    };
  }

  // node_modules/mdast-util-gfm-autolink-literal/lib/index.js
  var inConstruct = "phrasing";
  var notInConstruct = ["autolink", "link", "image", "label"];
  function gfmAutolinkLiteralFromMarkdown() {
    return {
      transforms: [transformGfmAutolinkLiterals],
      enter: {
        literalAutolink: enterLiteralAutolink,
        literalAutolinkEmail: enterLiteralAutolinkValue,
        literalAutolinkHttp: enterLiteralAutolinkValue,
        literalAutolinkWww: enterLiteralAutolinkValue
      },
      exit: {
        literalAutolink: exitLiteralAutolink,
        literalAutolinkEmail: exitLiteralAutolinkEmail,
        literalAutolinkHttp: exitLiteralAutolinkHttp,
        literalAutolinkWww: exitLiteralAutolinkWww
      }
    };
  }
  function gfmAutolinkLiteralToMarkdown() {
    return {
      unsafe: [
        {
          character: "@",
          before: "[+\\-.\\w]",
          after: "[\\-.\\w]",
          inConstruct,
          notInConstruct
        },
        {
          character: ".",
          before: "[Ww]",
          after: "[\\-.\\w]",
          inConstruct,
          notInConstruct
        },
        {
          character: ":",
          before: "[ps]",
          after: "\\/",
          inConstruct,
          notInConstruct
        }
      ]
    };
  }
  function enterLiteralAutolink(token) {
    this.enter({ type: "link", title: null, url: "", children: [] }, token);
  }
  function enterLiteralAutolinkValue(token) {
    this.config.enter.autolinkProtocol.call(this, token);
  }
  function exitLiteralAutolinkHttp(token) {
    this.config.exit.autolinkProtocol.call(this, token);
  }
  function exitLiteralAutolinkWww(token) {
    this.config.exit.data.call(this, token);
    const node2 = this.stack[this.stack.length - 1];
    ok(node2.type === "link");
    node2.url = "http://" + this.sliceSerialize(token);
  }
  function exitLiteralAutolinkEmail(token) {
    this.config.exit.autolinkEmail.call(this, token);
  }
  function exitLiteralAutolink(token) {
    this.exit(token);
  }
  function transformGfmAutolinkLiterals(tree) {
    findAndReplace(
      tree,
      [
        [/(https?:\/\/|www(?=\.))([-.\w]+)([^ \t\r\n]*)/gi, findUrl],
        [/(?<=^|\s|\p{P}|\p{S})([-.\w+]+)@([-\w]+(?:\.[-\w]+)+)/gu, findEmail]
      ],
      { ignore: ["link", "linkReference"] }
    );
  }
  function findUrl(_, protocol, domain2, path2, match) {
    let prefix = "";
    if (!previous2(match)) {
      return false;
    }
    if (/^w/i.test(protocol)) {
      domain2 = protocol + domain2;
      protocol = "";
      prefix = "http://";
    }
    if (!isCorrectDomain(domain2)) {
      return false;
    }
    const parts = splitUrl(domain2 + path2);
    if (!parts[0]) return false;
    const result = {
      type: "link",
      title: null,
      url: prefix + protocol + parts[0],
      children: [{ type: "text", value: protocol + parts[0] }]
    };
    if (parts[1]) {
      return [result, { type: "text", value: parts[1] }];
    }
    return result;
  }
  function findEmail(_, atext, label, match) {
    if (
      // Not an expected previous character.
      !previous2(match, true) || // Label ends in not allowed character.
      /[-\d_]$/.test(label)
    ) {
      return false;
    }
    return {
      type: "link",
      title: null,
      url: "mailto:" + atext + "@" + label,
      children: [{ type: "text", value: atext + "@" + label }]
    };
  }
  function isCorrectDomain(domain2) {
    const parts = domain2.split(".");
    if (parts.length < 2 || parts[parts.length - 1] && (/_/.test(parts[parts.length - 1]) || !/[a-zA-Z\d]/.test(parts[parts.length - 1])) || parts[parts.length - 2] && (/_/.test(parts[parts.length - 2]) || !/[a-zA-Z\d]/.test(parts[parts.length - 2]))) {
      return false;
    }
    return true;
  }
  function splitUrl(url) {
    const trailExec = /[!"&'),.:;<>?\]}]+$/.exec(url);
    if (!trailExec) {
      return [url, void 0];
    }
    url = url.slice(0, trailExec.index);
    let trail2 = trailExec[0];
    let closingParenIndex = trail2.indexOf(")");
    const openingParens = ccount(url, "(");
    let closingParens = ccount(url, ")");
    while (closingParenIndex !== -1 && openingParens > closingParens) {
      url += trail2.slice(0, closingParenIndex + 1);
      trail2 = trail2.slice(closingParenIndex + 1);
      closingParenIndex = trail2.indexOf(")");
      closingParens++;
    }
    return [url, trail2];
  }
  function previous2(match, email) {
    const code4 = match.input.charCodeAt(match.index - 1);
    return (match.index === 0 || unicodeWhitespace(code4) || unicodePunctuation(code4)) && // If it’s an email, the previous character should not be a slash.
    (!email || code4 !== 47);
  }

  // node_modules/mdast-util-gfm-footnote/lib/index.js
  footnoteReference.peek = footnoteReferencePeek;
  function enterFootnoteCallString() {
    this.buffer();
  }
  function enterFootnoteCall(token) {
    this.enter({ type: "footnoteReference", identifier: "", label: "" }, token);
  }
  function enterFootnoteDefinitionLabelString() {
    this.buffer();
  }
  function enterFootnoteDefinition(token) {
    this.enter(
      { type: "footnoteDefinition", identifier: "", label: "", children: [] },
      token
    );
  }
  function exitFootnoteCallString(token) {
    const label = this.resume();
    const node2 = this.stack[this.stack.length - 1];
    ok(node2.type === "footnoteReference");
    node2.identifier = normalizeIdentifier(
      this.sliceSerialize(token)
    ).toLowerCase();
    node2.label = label;
  }
  function exitFootnoteCall(token) {
    this.exit(token);
  }
  function exitFootnoteDefinitionLabelString(token) {
    const label = this.resume();
    const node2 = this.stack[this.stack.length - 1];
    ok(node2.type === "footnoteDefinition");
    node2.identifier = normalizeIdentifier(
      this.sliceSerialize(token)
    ).toLowerCase();
    node2.label = label;
  }
  function exitFootnoteDefinition(token) {
    this.exit(token);
  }
  function footnoteReferencePeek() {
    return "[";
  }
  function footnoteReference(node2, _, state, info) {
    const tracker = state.createTracker(info);
    let value = tracker.move("[^");
    const exit3 = state.enter("footnoteReference");
    const subexit = state.enter("reference");
    value += tracker.move(
      state.safe(state.associationId(node2), { after: "]", before: value })
    );
    subexit();
    exit3();
    value += tracker.move("]");
    return value;
  }
  function gfmFootnoteFromMarkdown() {
    return {
      enter: {
        gfmFootnoteCallString: enterFootnoteCallString,
        gfmFootnoteCall: enterFootnoteCall,
        gfmFootnoteDefinitionLabelString: enterFootnoteDefinitionLabelString,
        gfmFootnoteDefinition: enterFootnoteDefinition
      },
      exit: {
        gfmFootnoteCallString: exitFootnoteCallString,
        gfmFootnoteCall: exitFootnoteCall,
        gfmFootnoteDefinitionLabelString: exitFootnoteDefinitionLabelString,
        gfmFootnoteDefinition: exitFootnoteDefinition
      }
    };
  }
  function gfmFootnoteToMarkdown(options) {
    let firstLineBlank = false;
    if (options && options.firstLineBlank) {
      firstLineBlank = true;
    }
    return {
      handlers: { footnoteDefinition, footnoteReference },
      // This is on by default already.
      unsafe: [{ character: "[", inConstruct: ["label", "phrasing", "reference"] }]
    };
    function footnoteDefinition(node2, _, state, info) {
      const tracker = state.createTracker(info);
      let value = tracker.move("[^");
      const exit3 = state.enter("footnoteDefinition");
      const subexit = state.enter("label");
      value += tracker.move(
        state.safe(state.associationId(node2), { before: value, after: "]" })
      );
      subexit();
      value += tracker.move("]:");
      if (node2.children && node2.children.length > 0) {
        tracker.shift(4);
        value += tracker.move(
          (firstLineBlank ? "\n" : " ") + state.indentLines(
            state.containerFlow(node2, tracker.current()),
            firstLineBlank ? mapAll : mapExceptFirst
          )
        );
      }
      exit3();
      return value;
    }
  }
  function mapExceptFirst(line, index2, blank) {
    return index2 === 0 ? line : mapAll(line, index2, blank);
  }
  function mapAll(line, index2, blank) {
    return (blank ? "" : "    ") + line;
  }

  // node_modules/mdast-util-gfm-strikethrough/lib/index.js
  var constructsWithoutStrikethrough = [
    "autolink",
    "destinationLiteral",
    "destinationRaw",
    "reference",
    "titleQuote",
    "titleApostrophe"
  ];
  handleDelete.peek = peekDelete;
  function gfmStrikethroughFromMarkdown() {
    return {
      canContainEols: ["delete"],
      enter: { strikethrough: enterStrikethrough },
      exit: { strikethrough: exitStrikethrough }
    };
  }
  function gfmStrikethroughToMarkdown() {
    return {
      unsafe: [
        {
          character: "~",
          inConstruct: "phrasing",
          notInConstruct: constructsWithoutStrikethrough
        }
      ],
      handlers: { delete: handleDelete }
    };
  }
  function enterStrikethrough(token) {
    this.enter({ type: "delete", children: [] }, token);
  }
  function exitStrikethrough(token) {
    this.exit(token);
  }
  function handleDelete(node2, _, state, info) {
    const tracker = state.createTracker(info);
    const exit3 = state.enter("strikethrough");
    let value = tracker.move("~~");
    value += state.containerPhrasing(node2, {
      ...tracker.current(),
      before: value,
      after: "~"
    });
    value += tracker.move("~~");
    exit3();
    return value;
  }
  function peekDelete() {
    return "~";
  }

  // node_modules/markdown-table/index.js
  function defaultStringLength(value) {
    return value.length;
  }
  function markdownTable(table2, options) {
    const settings = options || {};
    const align = (settings.align || []).concat();
    const stringLength = settings.stringLength || defaultStringLength;
    const alignments = [];
    const cellMatrix = [];
    const sizeMatrix = [];
    const longestCellByColumn = [];
    let mostCellsPerRow = 0;
    let rowIndex = -1;
    while (++rowIndex < table2.length) {
      const row3 = [];
      const sizes2 = [];
      let columnIndex2 = -1;
      if (table2[rowIndex].length > mostCellsPerRow) {
        mostCellsPerRow = table2[rowIndex].length;
      }
      while (++columnIndex2 < table2[rowIndex].length) {
        const cell2 = serialize(table2[rowIndex][columnIndex2]);
        if (settings.alignDelimiters !== false) {
          const size = stringLength(cell2);
          sizes2[columnIndex2] = size;
          if (longestCellByColumn[columnIndex2] === void 0 || size > longestCellByColumn[columnIndex2]) {
            longestCellByColumn[columnIndex2] = size;
          }
        }
        row3.push(cell2);
      }
      cellMatrix[rowIndex] = row3;
      sizeMatrix[rowIndex] = sizes2;
    }
    let columnIndex = -1;
    if (typeof align === "object" && "length" in align) {
      while (++columnIndex < mostCellsPerRow) {
        alignments[columnIndex] = toAlignment(align[columnIndex]);
      }
    } else {
      const code4 = toAlignment(align);
      while (++columnIndex < mostCellsPerRow) {
        alignments[columnIndex] = code4;
      }
    }
    columnIndex = -1;
    const row2 = [];
    const sizes = [];
    while (++columnIndex < mostCellsPerRow) {
      const code4 = alignments[columnIndex];
      let before = "";
      let after = "";
      if (code4 === 99) {
        before = ":";
        after = ":";
      } else if (code4 === 108) {
        before = ":";
      } else if (code4 === 114) {
        after = ":";
      }
      let size = settings.alignDelimiters === false ? 1 : Math.max(
        1,
        longestCellByColumn[columnIndex] - before.length - after.length
      );
      const cell2 = before + "-".repeat(size) + after;
      if (settings.alignDelimiters !== false) {
        size = before.length + size + after.length;
        if (size > longestCellByColumn[columnIndex]) {
          longestCellByColumn[columnIndex] = size;
        }
        sizes[columnIndex] = size;
      }
      row2[columnIndex] = cell2;
    }
    cellMatrix.splice(1, 0, row2);
    sizeMatrix.splice(1, 0, sizes);
    rowIndex = -1;
    const lines = [];
    while (++rowIndex < cellMatrix.length) {
      const row3 = cellMatrix[rowIndex];
      const sizes2 = sizeMatrix[rowIndex];
      columnIndex = -1;
      const line = [];
      while (++columnIndex < mostCellsPerRow) {
        const cell2 = row3[columnIndex] || "";
        let before = "";
        let after = "";
        if (settings.alignDelimiters !== false) {
          const size = longestCellByColumn[columnIndex] - (sizes2[columnIndex] || 0);
          const code4 = alignments[columnIndex];
          if (code4 === 114) {
            before = " ".repeat(size);
          } else if (code4 === 99) {
            if (size % 2) {
              before = " ".repeat(size / 2 + 0.5);
              after = " ".repeat(size / 2 - 0.5);
            } else {
              before = " ".repeat(size / 2);
              after = before;
            }
          } else {
            after = " ".repeat(size);
          }
        }
        if (settings.delimiterStart !== false && !columnIndex) {
          line.push("|");
        }
        if (settings.padding !== false && // Don’t add the opening space if we’re not aligning and the cell is
        // empty: there will be a closing space.
        !(settings.alignDelimiters === false && cell2 === "") && (settings.delimiterStart !== false || columnIndex)) {
          line.push(" ");
        }
        if (settings.alignDelimiters !== false) {
          line.push(before);
        }
        line.push(cell2);
        if (settings.alignDelimiters !== false) {
          line.push(after);
        }
        if (settings.padding !== false) {
          line.push(" ");
        }
        if (settings.delimiterEnd !== false || columnIndex !== mostCellsPerRow - 1) {
          line.push("|");
        }
      }
      lines.push(
        settings.delimiterEnd === false ? line.join("").replace(/ +$/, "") : line.join("")
      );
    }
    return lines.join("\n");
  }
  function serialize(value) {
    return value === null || value === void 0 ? "" : String(value);
  }
  function toAlignment(value) {
    const code4 = typeof value === "string" ? value.codePointAt(0) : 0;
    return code4 === 67 || code4 === 99 ? 99 : code4 === 76 || code4 === 108 ? 108 : code4 === 82 || code4 === 114 ? 114 : 0;
  }

  // node_modules/zwitch/index.js
  var own3 = {}.hasOwnProperty;
  function zwitch(key2, options) {
    const settings = options || {};
    function one4(value, ...parameters) {
      let fn = one4.invalid;
      const handlers2 = one4.handlers;
      if (value && own3.call(value, key2)) {
        const id = String(value[key2]);
        fn = own3.call(handlers2, id) ? handlers2[id] : one4.unknown;
      }
      if (fn) {
        return fn.call(this, value, ...parameters);
      }
    }
    one4.handlers = settings.handlers || {};
    one4.invalid = settings.invalid;
    one4.unknown = settings.unknown;
    return one4;
  }

  // node_modules/mdast-util-to-markdown/lib/handle/blockquote.js
  function blockquote(node2, _, state, info) {
    const exit3 = state.enter("blockquote");
    const tracker = state.createTracker(info);
    tracker.move("> ");
    tracker.shift(2);
    const value = state.indentLines(
      state.containerFlow(node2, tracker.current()),
      map
    );
    exit3();
    return value;
  }
  function map(line, _, blank) {
    return ">" + (blank ? "" : " ") + line;
  }

  // node_modules/mdast-util-to-markdown/lib/util/pattern-in-scope.js
  function patternInScope(stack, pattern) {
    return listInScope(stack, pattern.inConstruct, true) && !listInScope(stack, pattern.notInConstruct, false);
  }
  function listInScope(stack, list4, none) {
    if (typeof list4 === "string") {
      list4 = [list4];
    }
    if (!list4 || list4.length === 0) {
      return none;
    }
    let index2 = -1;
    while (++index2 < list4.length) {
      if (stack.includes(list4[index2])) {
        return true;
      }
    }
    return false;
  }

  // node_modules/mdast-util-to-markdown/lib/handle/break.js
  function hardBreak(_, _1, state, info) {
    let index2 = -1;
    while (++index2 < state.unsafe.length) {
      if (state.unsafe[index2].character === "\n" && patternInScope(state.stack, state.unsafe[index2])) {
        return /[ \t]/.test(info.before) ? "" : " ";
      }
    }
    return "\\\n";
  }

  // node_modules/longest-streak/index.js
  function longestStreak(value, substring) {
    const source = String(value);
    let index2 = source.indexOf(substring);
    let expected = index2;
    let count = 0;
    let max = 0;
    if (typeof substring !== "string") {
      throw new TypeError("Expected substring");
    }
    while (index2 !== -1) {
      if (index2 === expected) {
        if (++count > max) {
          max = count;
        }
      } else {
        count = 1;
      }
      expected = index2 + substring.length;
      index2 = source.indexOf(substring, expected);
    }
    return max;
  }

  // node_modules/mdast-util-to-markdown/lib/util/format-code-as-indented.js
  function formatCodeAsIndented(node2, state) {
    return Boolean(
      state.options.fences === false && node2.value && // If there’s no info…
      !node2.lang && // And there’s a non-whitespace character…
      /[^ \r\n]/.test(node2.value) && // And the value doesn’t start or end in a blank…
      !/^[\t ]*(?:[\r\n]|$)|(?:^|[\r\n])[\t ]*$/.test(node2.value)
    );
  }

  // node_modules/mdast-util-to-markdown/lib/util/check-fence.js
  function checkFence(state) {
    const marker = state.options.fence || "`";
    if (marker !== "`" && marker !== "~") {
      throw new Error(
        "Cannot serialize code with `" + marker + "` for `options.fence`, expected `` ` `` or `~`"
      );
    }
    return marker;
  }

  // node_modules/mdast-util-to-markdown/lib/handle/code.js
  function code(node2, _, state, info) {
    const marker = checkFence(state);
    const raw2 = node2.value || "";
    const suffix = marker === "`" ? "GraveAccent" : "Tilde";
    if (formatCodeAsIndented(node2, state)) {
      const exit4 = state.enter("codeIndented");
      const value2 = state.indentLines(raw2, map2);
      exit4();
      return value2;
    }
    const tracker = state.createTracker(info);
    const sequence = marker.repeat(Math.max(longestStreak(raw2, marker) + 1, 3));
    const exit3 = state.enter("codeFenced");
    let value = tracker.move(sequence);
    if (node2.lang) {
      const subexit = state.enter(`codeFencedLang${suffix}`);
      value += tracker.move(
        state.safe(node2.lang, {
          before: value,
          after: " ",
          encode: ["`"],
          ...tracker.current()
        })
      );
      subexit();
    }
    if (node2.lang && node2.meta) {
      const subexit = state.enter(`codeFencedMeta${suffix}`);
      value += tracker.move(" ");
      value += tracker.move(
        state.safe(node2.meta, {
          before: value,
          after: "\n",
          encode: ["`"],
          ...tracker.current()
        })
      );
      subexit();
    }
    value += tracker.move("\n");
    if (raw2) {
      value += tracker.move(raw2 + "\n");
    }
    value += tracker.move(sequence);
    exit3();
    return value;
  }
  function map2(line, _, blank) {
    return (blank ? "" : "    ") + line;
  }

  // node_modules/mdast-util-to-markdown/lib/util/check-quote.js
  function checkQuote(state) {
    const marker = state.options.quote || '"';
    if (marker !== '"' && marker !== "'") {
      throw new Error(
        "Cannot serialize title with `" + marker + "` for `options.quote`, expected `\"`, or `'`"
      );
    }
    return marker;
  }

  // node_modules/mdast-util-to-markdown/lib/handle/definition.js
  function definition2(node2, _, state, info) {
    const quote = checkQuote(state);
    const suffix = quote === '"' ? "Quote" : "Apostrophe";
    const exit3 = state.enter("definition");
    let subexit = state.enter("label");
    const tracker = state.createTracker(info);
    let value = tracker.move("[");
    value += tracker.move(
      state.safe(state.associationId(node2), {
        before: value,
        after: "]",
        ...tracker.current()
      })
    );
    value += tracker.move("]: ");
    subexit();
    if (
      // If there’s no url, or…
      !node2.url || // If there are control characters or whitespace.
      /[\0- \u007F]/.test(node2.url)
    ) {
      subexit = state.enter("destinationLiteral");
      value += tracker.move("<");
      value += tracker.move(
        state.safe(node2.url, { before: value, after: ">", ...tracker.current() })
      );
      value += tracker.move(">");
    } else {
      subexit = state.enter("destinationRaw");
      value += tracker.move(
        state.safe(node2.url, {
          before: value,
          after: node2.title ? " " : "\n",
          ...tracker.current()
        })
      );
    }
    subexit();
    if (node2.title) {
      subexit = state.enter(`title${suffix}`);
      value += tracker.move(" " + quote);
      value += tracker.move(
        state.safe(node2.title, {
          before: value,
          after: quote,
          ...tracker.current()
        })
      );
      value += tracker.move(quote);
      subexit();
    }
    exit3();
    return value;
  }

  // node_modules/mdast-util-to-markdown/lib/util/check-emphasis.js
  function checkEmphasis(state) {
    const marker = state.options.emphasis || "*";
    if (marker !== "*" && marker !== "_") {
      throw new Error(
        "Cannot serialize emphasis with `" + marker + "` for `options.emphasis`, expected `*`, or `_`"
      );
    }
    return marker;
  }

  // node_modules/mdast-util-to-markdown/lib/util/encode-character-reference.js
  function encodeCharacterReference(code4) {
    return "&#x" + code4.toString(16).toUpperCase() + ";";
  }

  // node_modules/mdast-util-to-markdown/lib/util/encode-info.js
  function encodeInfo(outside, inside, marker) {
    const outsideKind = classifyCharacter(outside);
    const insideKind = classifyCharacter(inside);
    if (outsideKind === void 0) {
      return insideKind === void 0 ? (
        // Letter inside:
        // we have to encode *both* letters for `_` as it is looser.
        // it already forms for `*` (and GFMs `~`).
        marker === "_" ? { inside: true, outside: true } : { inside: false, outside: false }
      ) : insideKind === 1 ? (
        // Whitespace inside: encode both (letter, whitespace).
        { inside: true, outside: true }
      ) : (
        // Punctuation inside: encode outer (letter)
        { inside: false, outside: true }
      );
    }
    if (outsideKind === 1) {
      return insideKind === void 0 ? (
        // Letter inside: already forms.
        { inside: false, outside: false }
      ) : insideKind === 1 ? (
        // Whitespace inside: encode both (whitespace).
        { inside: true, outside: true }
      ) : (
        // Punctuation inside: already forms.
        { inside: false, outside: false }
      );
    }
    return insideKind === void 0 ? (
      // Letter inside: already forms.
      { inside: false, outside: false }
    ) : insideKind === 1 ? (
      // Whitespace inside: encode inner (whitespace).
      { inside: true, outside: false }
    ) : (
      // Punctuation inside: already forms.
      { inside: false, outside: false }
    );
  }

  // node_modules/mdast-util-to-markdown/lib/handle/emphasis.js
  emphasis.peek = emphasisPeek;
  function emphasis(node2, _, state, info) {
    const marker = checkEmphasis(state);
    const exit3 = state.enter("emphasis");
    const tracker = state.createTracker(info);
    const before = tracker.move(marker);
    let between = tracker.move(
      state.containerPhrasing(node2, {
        after: marker,
        before,
        ...tracker.current()
      })
    );
    const betweenHead = between.charCodeAt(0);
    const open = encodeInfo(
      info.before.charCodeAt(info.before.length - 1),
      betweenHead,
      marker
    );
    if (open.inside) {
      between = encodeCharacterReference(betweenHead) + between.slice(1);
    }
    const betweenTail = between.charCodeAt(between.length - 1);
    const close = encodeInfo(info.after.charCodeAt(0), betweenTail, marker);
    if (close.inside) {
      between = between.slice(0, -1) + encodeCharacterReference(betweenTail);
    }
    const after = tracker.move(marker);
    exit3();
    state.attentionEncodeSurroundingInfo = {
      after: close.outside,
      before: open.outside
    };
    return before + between + after;
  }
  function emphasisPeek(_, _1, state) {
    return state.options.emphasis || "*";
  }

  // node_modules/unist-util-visit/lib/index.js
  function visit(tree, testOrVisitor, visitorOrReverse, maybeReverse) {
    let reverse;
    let test;
    let visitor;
    if (typeof testOrVisitor === "function" && typeof visitorOrReverse !== "function") {
      test = void 0;
      visitor = testOrVisitor;
      reverse = visitorOrReverse;
    } else {
      test = testOrVisitor;
      visitor = visitorOrReverse;
      reverse = maybeReverse;
    }
    visitParents(tree, test, overload, reverse);
    function overload(node2, parents) {
      const parent = parents[parents.length - 1];
      const index2 = parent ? parent.children.indexOf(node2) : void 0;
      return visitor(node2, index2, parent);
    }
  }

  // node_modules/mdast-util-to-markdown/lib/util/format-heading-as-setext.js
  function formatHeadingAsSetext(node2, state) {
    let literalWithBreak = false;
    visit(node2, function(node3) {
      if ("value" in node3 && /\r?\n|\r/.test(node3.value) || node3.type === "break") {
        literalWithBreak = true;
        return EXIT;
      }
    });
    return Boolean(
      (!node2.depth || node2.depth < 3) && toString(node2) && (state.options.setext || literalWithBreak)
    );
  }

  // node_modules/mdast-util-to-markdown/lib/handle/heading.js
  function heading(node2, _, state, info) {
    const rank = Math.max(Math.min(6, node2.depth || 1), 1);
    const tracker = state.createTracker(info);
    if (formatHeadingAsSetext(node2, state)) {
      const exit4 = state.enter("headingSetext");
      const subexit2 = state.enter("phrasing");
      const value2 = state.containerPhrasing(node2, {
        ...tracker.current(),
        before: "\n",
        after: "\n"
      });
      subexit2();
      exit4();
      return value2 + "\n" + (rank === 1 ? "=" : "-").repeat(
        // The whole size…
        value2.length - // Minus the position of the character after the last EOL (or
        // 0 if there is none)…
        (Math.max(value2.lastIndexOf("\r"), value2.lastIndexOf("\n")) + 1)
      );
    }
    const sequence = "#".repeat(rank);
    const exit3 = state.enter("headingAtx");
    const subexit = state.enter("phrasing");
    tracker.move(sequence + " ");
    let value = state.containerPhrasing(node2, {
      before: "# ",
      after: "\n",
      ...tracker.current()
    });
    if (/^[\t ]/.test(value)) {
      value = encodeCharacterReference(value.charCodeAt(0)) + value.slice(1);
    }
    value = value ? sequence + " " + value : sequence;
    if (state.options.closeAtx) {
      value += " " + sequence;
    }
    subexit();
    exit3();
    return value;
  }

  // node_modules/mdast-util-to-markdown/lib/handle/html.js
  html.peek = htmlPeek;
  function html(node2) {
    return node2.value || "";
  }
  function htmlPeek() {
    return "<";
  }

  // node_modules/mdast-util-to-markdown/lib/handle/image.js
  image.peek = imagePeek;
  function image(node2, _, state, info) {
    const quote = checkQuote(state);
    const suffix = quote === '"' ? "Quote" : "Apostrophe";
    const exit3 = state.enter("image");
    let subexit = state.enter("label");
    const tracker = state.createTracker(info);
    let value = tracker.move("![");
    value += tracker.move(
      state.safe(node2.alt, { before: value, after: "]", ...tracker.current() })
    );
    value += tracker.move("](");
    subexit();
    if (
      // If there’s no url but there is a title…
      !node2.url && node2.title || // If there are control characters or whitespace.
      /[\0- \u007F]/.test(node2.url)
    ) {
      subexit = state.enter("destinationLiteral");
      value += tracker.move("<");
      value += tracker.move(
        state.safe(node2.url, { before: value, after: ">", ...tracker.current() })
      );
      value += tracker.move(">");
    } else {
      subexit = state.enter("destinationRaw");
      value += tracker.move(
        state.safe(node2.url, {
          before: value,
          after: node2.title ? " " : ")",
          ...tracker.current()
        })
      );
    }
    subexit();
    if (node2.title) {
      subexit = state.enter(`title${suffix}`);
      value += tracker.move(" " + quote);
      value += tracker.move(
        state.safe(node2.title, {
          before: value,
          after: quote,
          ...tracker.current()
        })
      );
      value += tracker.move(quote);
      subexit();
    }
    value += tracker.move(")");
    exit3();
    return value;
  }
  function imagePeek() {
    return "!";
  }

  // node_modules/mdast-util-to-markdown/lib/handle/image-reference.js
  imageReference.peek = imageReferencePeek;
  function imageReference(node2, _, state, info) {
    const type = node2.referenceType;
    const exit3 = state.enter("imageReference");
    let subexit = state.enter("label");
    const tracker = state.createTracker(info);
    let value = tracker.move("![");
    const alt = state.safe(node2.alt, {
      before: value,
      after: "]",
      ...tracker.current()
    });
    value += tracker.move(alt + "][");
    subexit();
    const stack = state.stack;
    state.stack = [];
    subexit = state.enter("reference");
    const reference = state.safe(state.associationId(node2), {
      before: value,
      after: "]",
      ...tracker.current()
    });
    subexit();
    state.stack = stack;
    exit3();
    if (type === "full" || !alt || alt !== reference) {
      value += tracker.move(reference + "]");
    } else if (type === "shortcut") {
      value = value.slice(0, -1);
    } else {
      value += tracker.move("]");
    }
    return value;
  }
  function imageReferencePeek() {
    return "!";
  }

  // node_modules/mdast-util-to-markdown/lib/handle/inline-code.js
  inlineCode.peek = inlineCodePeek;
  function inlineCode(node2, _, state) {
    let value = node2.value || "";
    let sequence = "`";
    let index2 = -1;
    while (new RegExp("(^|[^`])" + sequence + "([^`]|$)").test(value)) {
      sequence += "`";
    }
    if (/[^ \r\n]/.test(value) && (/^[ \r\n]/.test(value) && /[ \r\n]$/.test(value) || /^`|`$/.test(value))) {
      value = " " + value + " ";
    }
    while (++index2 < state.unsafe.length) {
      const pattern = state.unsafe[index2];
      const expression = state.compilePattern(pattern);
      let match;
      if (!pattern.atBreak) continue;
      while (match = expression.exec(value)) {
        let position3 = match.index;
        if (value.charCodeAt(position3) === 10 && value.charCodeAt(position3 - 1) === 13) {
          position3--;
        }
        value = value.slice(0, position3) + " " + value.slice(match.index + 1);
      }
    }
    return sequence + value + sequence;
  }
  function inlineCodePeek() {
    return "`";
  }

  // node_modules/mdast-util-to-markdown/lib/util/format-link-as-autolink.js
  function formatLinkAsAutolink(node2, state) {
    const raw2 = toString(node2);
    return Boolean(
      !state.options.resourceLink && // If there’s a url…
      node2.url && // And there’s a no title…
      !node2.title && // And the content of `node` is a single text node…
      node2.children && node2.children.length === 1 && node2.children[0].type === "text" && // And if the url is the same as the content…
      (raw2 === node2.url || "mailto:" + raw2 === node2.url) && // And that starts w/ a protocol…
      /^[a-z][a-z+.-]+:/i.test(node2.url) && // And that doesn’t contain ASCII control codes (character escapes and
      // references don’t work), space, or angle brackets…
      !/[\0- <>\u007F]/.test(node2.url)
    );
  }

  // node_modules/mdast-util-to-markdown/lib/handle/link.js
  link.peek = linkPeek;
  function link(node2, _, state, info) {
    const quote = checkQuote(state);
    const suffix = quote === '"' ? "Quote" : "Apostrophe";
    const tracker = state.createTracker(info);
    let exit3;
    let subexit;
    if (formatLinkAsAutolink(node2, state)) {
      const stack = state.stack;
      state.stack = [];
      exit3 = state.enter("autolink");
      let value2 = tracker.move("<");
      value2 += tracker.move(
        state.containerPhrasing(node2, {
          before: value2,
          after: ">",
          ...tracker.current()
        })
      );
      value2 += tracker.move(">");
      exit3();
      state.stack = stack;
      return value2;
    }
    exit3 = state.enter("link");
    subexit = state.enter("label");
    let value = tracker.move("[");
    value += tracker.move(
      state.containerPhrasing(node2, {
        before: value,
        after: "](",
        ...tracker.current()
      })
    );
    value += tracker.move("](");
    subexit();
    if (
      // If there’s no url but there is a title…
      !node2.url && node2.title || // If there are control characters or whitespace.
      /[\0- \u007F]/.test(node2.url)
    ) {
      subexit = state.enter("destinationLiteral");
      value += tracker.move("<");
      value += tracker.move(
        state.safe(node2.url, { before: value, after: ">", ...tracker.current() })
      );
      value += tracker.move(">");
    } else {
      subexit = state.enter("destinationRaw");
      value += tracker.move(
        state.safe(node2.url, {
          before: value,
          after: node2.title ? " " : ")",
          ...tracker.current()
        })
      );
    }
    subexit();
    if (node2.title) {
      subexit = state.enter(`title${suffix}`);
      value += tracker.move(" " + quote);
      value += tracker.move(
        state.safe(node2.title, {
          before: value,
          after: quote,
          ...tracker.current()
        })
      );
      value += tracker.move(quote);
      subexit();
    }
    value += tracker.move(")");
    exit3();
    return value;
  }
  function linkPeek(node2, _, state) {
    return formatLinkAsAutolink(node2, state) ? "<" : "[";
  }

  // node_modules/mdast-util-to-markdown/lib/handle/link-reference.js
  linkReference.peek = linkReferencePeek;
  function linkReference(node2, _, state, info) {
    const type = node2.referenceType;
    const exit3 = state.enter("linkReference");
    let subexit = state.enter("label");
    const tracker = state.createTracker(info);
    let value = tracker.move("[");
    const text9 = state.containerPhrasing(node2, {
      before: value,
      after: "]",
      ...tracker.current()
    });
    value += tracker.move(text9 + "][");
    subexit();
    const stack = state.stack;
    state.stack = [];
    subexit = state.enter("reference");
    const reference = state.safe(state.associationId(node2), {
      before: value,
      after: "]",
      ...tracker.current()
    });
    subexit();
    state.stack = stack;
    exit3();
    if (type === "full" || !text9 || text9 !== reference) {
      value += tracker.move(reference + "]");
    } else if (type === "shortcut") {
      value = value.slice(0, -1);
    } else {
      value += tracker.move("]");
    }
    return value;
  }
  function linkReferencePeek() {
    return "[";
  }

  // node_modules/mdast-util-to-markdown/lib/util/check-bullet.js
  function checkBullet(state) {
    const marker = state.options.bullet || "*";
    if (marker !== "*" && marker !== "+" && marker !== "-") {
      throw new Error(
        "Cannot serialize items with `" + marker + "` for `options.bullet`, expected `*`, `+`, or `-`"
      );
    }
    return marker;
  }

  // node_modules/mdast-util-to-markdown/lib/util/check-bullet-other.js
  function checkBulletOther(state) {
    const bullet = checkBullet(state);
    const bulletOther = state.options.bulletOther;
    if (!bulletOther) {
      return bullet === "*" ? "-" : "*";
    }
    if (bulletOther !== "*" && bulletOther !== "+" && bulletOther !== "-") {
      throw new Error(
        "Cannot serialize items with `" + bulletOther + "` for `options.bulletOther`, expected `*`, `+`, or `-`"
      );
    }
    if (bulletOther === bullet) {
      throw new Error(
        "Expected `bullet` (`" + bullet + "`) and `bulletOther` (`" + bulletOther + "`) to be different"
      );
    }
    return bulletOther;
  }

  // node_modules/mdast-util-to-markdown/lib/util/check-bullet-ordered.js
  function checkBulletOrdered(state) {
    const marker = state.options.bulletOrdered || ".";
    if (marker !== "." && marker !== ")") {
      throw new Error(
        "Cannot serialize items with `" + marker + "` for `options.bulletOrdered`, expected `.` or `)`"
      );
    }
    return marker;
  }

  // node_modules/mdast-util-to-markdown/lib/util/check-rule.js
  function checkRule(state) {
    const marker = state.options.rule || "*";
    if (marker !== "*" && marker !== "-" && marker !== "_") {
      throw new Error(
        "Cannot serialize rules with `" + marker + "` for `options.rule`, expected `*`, `-`, or `_`"
      );
    }
    return marker;
  }

  // node_modules/mdast-util-to-markdown/lib/handle/list.js
  function list2(node2, parent, state, info) {
    const exit3 = state.enter("list");
    const bulletCurrent = state.bulletCurrent;
    let bullet = node2.ordered ? checkBulletOrdered(state) : checkBullet(state);
    const bulletOther = node2.ordered ? bullet === "." ? ")" : "." : checkBulletOther(state);
    let useDifferentMarker = parent && state.bulletLastUsed ? bullet === state.bulletLastUsed : false;
    if (!node2.ordered) {
      const firstListItem = node2.children ? node2.children[0] : void 0;
      if (
        // Bullet could be used as a thematic break marker:
        (bullet === "*" || bullet === "-") && // Empty first list item:
        firstListItem && (!firstListItem.children || !firstListItem.children[0]) && // Directly in two other list items:
        state.stack[state.stack.length - 1] === "list" && state.stack[state.stack.length - 2] === "listItem" && state.stack[state.stack.length - 3] === "list" && state.stack[state.stack.length - 4] === "listItem" && // That are each the first child.
        state.indexStack[state.indexStack.length - 1] === 0 && state.indexStack[state.indexStack.length - 2] === 0 && state.indexStack[state.indexStack.length - 3] === 0
      ) {
        useDifferentMarker = true;
      }
      if (checkRule(state) === bullet && firstListItem) {
        let index2 = -1;
        while (++index2 < node2.children.length) {
          const item = node2.children[index2];
          if (item && item.type === "listItem" && item.children && item.children[0] && item.children[0].type === "thematicBreak") {
            useDifferentMarker = true;
            break;
          }
        }
      }
    }
    if (useDifferentMarker) {
      bullet = bulletOther;
    }
    state.bulletCurrent = bullet;
    const value = state.containerFlow(node2, info);
    state.bulletLastUsed = bullet;
    state.bulletCurrent = bulletCurrent;
    exit3();
    return value;
  }

  // node_modules/mdast-util-to-markdown/lib/util/check-list-item-indent.js
  function checkListItemIndent(state) {
    const style2 = state.options.listItemIndent || "one";
    if (style2 !== "tab" && style2 !== "one" && style2 !== "mixed") {
      throw new Error(
        "Cannot serialize items with `" + style2 + "` for `options.listItemIndent`, expected `tab`, `one`, or `mixed`"
      );
    }
    return style2;
  }

  // node_modules/mdast-util-to-markdown/lib/handle/list-item.js
  function listItem(node2, parent, state, info) {
    const listItemIndent = checkListItemIndent(state);
    let bullet = state.bulletCurrent || checkBullet(state);
    if (parent && parent.type === "list" && parent.ordered) {
      bullet = (typeof parent.start === "number" && parent.start > -1 ? parent.start : 1) + (state.options.incrementListMarker === false ? 0 : parent.children.indexOf(node2)) + bullet;
    }
    let size = bullet.length + 1;
    if (listItemIndent === "tab" || listItemIndent === "mixed" && (parent && parent.type === "list" && parent.spread || node2.spread)) {
      size = Math.ceil(size / 4) * 4;
    }
    const tracker = state.createTracker(info);
    tracker.move(bullet + " ".repeat(size - bullet.length));
    tracker.shift(size);
    const exit3 = state.enter("listItem");
    const value = state.indentLines(
      state.containerFlow(node2, tracker.current()),
      map3
    );
    exit3();
    return value;
    function map3(line, index2, blank) {
      if (index2) {
        return (blank ? "" : " ".repeat(size)) + line;
      }
      return (blank ? bullet : bullet + " ".repeat(size - bullet.length)) + line;
    }
  }

  // node_modules/mdast-util-to-markdown/lib/handle/paragraph.js
  function paragraph(node2, _, state, info) {
    const exit3 = state.enter("paragraph");
    const subexit = state.enter("phrasing");
    const value = state.containerPhrasing(node2, info);
    subexit();
    exit3();
    return value;
  }

  // node_modules/mdast-util-phrasing/lib/index.js
  var phrasing = (
    /** @type {(node?: unknown) => node is Exclude<PhrasingContent, Html>} */
    convert([
      "break",
      "delete",
      "emphasis",
      // To do: next major: removed since footnotes were added to GFM.
      "footnote",
      "footnoteReference",
      "image",
      "imageReference",
      "inlineCode",
      // Enabled by `mdast-util-math`:
      "inlineMath",
      "link",
      "linkReference",
      // Enabled by `mdast-util-mdx`:
      "mdxJsxTextElement",
      // Enabled by `mdast-util-mdx`:
      "mdxTextExpression",
      "strong",
      "text",
      // Enabled by `mdast-util-directive`:
      "textDirective"
    ])
  );

  // node_modules/mdast-util-to-markdown/lib/handle/root.js
  function root(node2, _, state, info) {
    const hasPhrasing = node2.children.some(function(d) {
      return phrasing(d);
    });
    const container = hasPhrasing ? state.containerPhrasing : state.containerFlow;
    return container.call(state, node2, info);
  }

  // node_modules/mdast-util-to-markdown/lib/util/check-strong.js
  function checkStrong(state) {
    const marker = state.options.strong || "*";
    if (marker !== "*" && marker !== "_") {
      throw new Error(
        "Cannot serialize strong with `" + marker + "` for `options.strong`, expected `*`, or `_`"
      );
    }
    return marker;
  }

  // node_modules/mdast-util-to-markdown/lib/handle/strong.js
  strong.peek = strongPeek;
  function strong(node2, _, state, info) {
    const marker = checkStrong(state);
    const exit3 = state.enter("strong");
    const tracker = state.createTracker(info);
    const before = tracker.move(marker + marker);
    let between = tracker.move(
      state.containerPhrasing(node2, {
        after: marker,
        before,
        ...tracker.current()
      })
    );
    const betweenHead = between.charCodeAt(0);
    const open = encodeInfo(
      info.before.charCodeAt(info.before.length - 1),
      betweenHead,
      marker
    );
    if (open.inside) {
      between = encodeCharacterReference(betweenHead) + between.slice(1);
    }
    const betweenTail = between.charCodeAt(between.length - 1);
    const close = encodeInfo(info.after.charCodeAt(0), betweenTail, marker);
    if (close.inside) {
      between = between.slice(0, -1) + encodeCharacterReference(betweenTail);
    }
    const after = tracker.move(marker + marker);
    exit3();
    state.attentionEncodeSurroundingInfo = {
      after: close.outside,
      before: open.outside
    };
    return before + between + after;
  }
  function strongPeek(_, _1, state) {
    return state.options.strong || "*";
  }

  // node_modules/mdast-util-to-markdown/lib/handle/text.js
  function text3(node2, _, state, info) {
    return state.safe(node2.value, info);
  }

  // node_modules/mdast-util-to-markdown/lib/util/check-rule-repetition.js
  function checkRuleRepetition(state) {
    const repetition = state.options.ruleRepetition || 3;
    if (repetition < 3) {
      throw new Error(
        "Cannot serialize rules with repetition `" + repetition + "` for `options.ruleRepetition`, expected `3` or more"
      );
    }
    return repetition;
  }

  // node_modules/mdast-util-to-markdown/lib/handle/thematic-break.js
  function thematicBreak2(_, _1, state) {
    const value = (checkRule(state) + (state.options.ruleSpaces ? " " : "")).repeat(checkRuleRepetition(state));
    return state.options.ruleSpaces ? value.slice(0, -1) : value;
  }

  // node_modules/mdast-util-to-markdown/lib/handle/index.js
  var handle = {
    blockquote,
    break: hardBreak,
    code,
    definition: definition2,
    emphasis,
    hardBreak,
    heading,
    html,
    image,
    imageReference,
    inlineCode,
    link,
    linkReference,
    list: list2,
    listItem,
    paragraph,
    root,
    strong,
    text: text3,
    thematicBreak: thematicBreak2
  };

  // node_modules/mdast-util-gfm-table/lib/index.js
  function gfmTableFromMarkdown() {
    return {
      enter: {
        table: enterTable,
        tableData: enterCell,
        tableHeader: enterCell,
        tableRow: enterRow
      },
      exit: {
        codeText: exitCodeText,
        table: exitTable,
        tableData: exit2,
        tableHeader: exit2,
        tableRow: exit2
      }
    };
  }
  function enterTable(token) {
    const align = token._align;
    ok(align, "expected `_align` on table");
    this.enter(
      {
        type: "table",
        align: align.map(function(d) {
          return d === "none" ? null : d;
        }),
        children: []
      },
      token
    );
    this.data.inTable = true;
  }
  function exitTable(token) {
    this.exit(token);
    this.data.inTable = void 0;
  }
  function enterRow(token) {
    this.enter({ type: "tableRow", children: [] }, token);
  }
  function exit2(token) {
    this.exit(token);
  }
  function enterCell(token) {
    this.enter({ type: "tableCell", children: [] }, token);
  }
  function exitCodeText(token) {
    let value = this.resume();
    if (this.data.inTable) {
      value = value.replace(/\\([\\|])/g, replace);
    }
    const node2 = this.stack[this.stack.length - 1];
    ok(node2.type === "inlineCode");
    node2.value = value;
    this.exit(token);
  }
  function replace($0, $1) {
    return $1 === "|" ? $1 : $0;
  }
  function gfmTableToMarkdown(options) {
    const settings = options || {};
    const padding = settings.tableCellPadding;
    const alignDelimiters = settings.tablePipeAlign;
    const stringLength = settings.stringLength;
    const around = padding ? " " : "|";
    return {
      unsafe: [
        { character: "\r", inConstruct: "tableCell" },
        { character: "\n", inConstruct: "tableCell" },
        // A pipe, when followed by a tab or space (padding), or a dash or colon
        // (unpadded delimiter row), could result in a table.
        { atBreak: true, character: "|", after: "[	 :-]" },
        // A pipe in a cell must be encoded.
        { character: "|", inConstruct: "tableCell" },
        // A colon must be followed by a dash, in which case it could start a
        // delimiter row.
        { atBreak: true, character: ":", after: "-" },
        // A delimiter row can also start with a dash, when followed by more
        // dashes, a colon, or a pipe.
        // This is a stricter version than the built in check for lists, thematic
        // breaks, and setex heading underlines though:
        // <https://github.com/syntax-tree/mdast-util-to-markdown/blob/51a2038/lib/unsafe.js#L57>
        { atBreak: true, character: "-", after: "[:|-]" }
      ],
      handlers: {
        inlineCode: inlineCodeWithTable,
        table: handleTable,
        tableCell: handleTableCell,
        tableRow: handleTableRow
      }
    };
    function handleTable(node2, _, state, info) {
      return serializeData(handleTableAsData(node2, state, info), node2.align);
    }
    function handleTableRow(node2, _, state, info) {
      const row2 = handleTableRowAsData(node2, state, info);
      const value = serializeData([row2]);
      return value.slice(0, value.indexOf("\n"));
    }
    function handleTableCell(node2, _, state, info) {
      const exit3 = state.enter("tableCell");
      const subexit = state.enter("phrasing");
      const value = state.containerPhrasing(node2, {
        ...info,
        before: around,
        after: around
      });
      subexit();
      exit3();
      return value;
    }
    function serializeData(matrix, align) {
      return markdownTable(matrix, {
        align,
        // @ts-expect-error: `markdown-table` types should support `null`.
        alignDelimiters,
        // @ts-expect-error: `markdown-table` types should support `null`.
        padding,
        // @ts-expect-error: `markdown-table` types should support `null`.
        stringLength
      });
    }
    function handleTableAsData(node2, state, info) {
      const children2 = node2.children;
      let index2 = -1;
      const result = [];
      const subexit = state.enter("table");
      while (++index2 < children2.length) {
        result[index2] = handleTableRowAsData(children2[index2], state, info);
      }
      subexit();
      return result;
    }
    function handleTableRowAsData(node2, state, info) {
      const children2 = node2.children;
      let index2 = -1;
      const result = [];
      const subexit = state.enter("tableRow");
      while (++index2 < children2.length) {
        result[index2] = handleTableCell(children2[index2], node2, state, info);
      }
      subexit();
      return result;
    }
    function inlineCodeWithTable(node2, parent, state) {
      let value = handle.inlineCode(node2, parent, state);
      if (state.stack.includes("tableCell")) {
        value = value.replace(/\|/g, "\\$&");
      }
      return value;
    }
  }

  // node_modules/mdast-util-gfm-task-list-item/lib/index.js
  function gfmTaskListItemFromMarkdown() {
    return {
      exit: {
        taskListCheckValueChecked: exitCheck,
        taskListCheckValueUnchecked: exitCheck,
        paragraph: exitParagraphWithTaskListItem
      }
    };
  }
  function gfmTaskListItemToMarkdown() {
    return {
      unsafe: [{ atBreak: true, character: "-", after: "[:|-]" }],
      handlers: { listItem: listItemWithTaskListItem }
    };
  }
  function exitCheck(token) {
    const node2 = this.stack[this.stack.length - 2];
    ok(node2.type === "listItem");
    node2.checked = token.type === "taskListCheckValueChecked";
  }
  function exitParagraphWithTaskListItem(token) {
    const parent = this.stack[this.stack.length - 2];
    if (parent && parent.type === "listItem" && typeof parent.checked === "boolean") {
      const node2 = this.stack[this.stack.length - 1];
      ok(node2.type === "paragraph");
      const head2 = node2.children[0];
      if (head2 && head2.type === "text") {
        const siblings2 = parent.children;
        let index2 = -1;
        let firstParaghraph;
        while (++index2 < siblings2.length) {
          const sibling = siblings2[index2];
          if (sibling.type === "paragraph") {
            firstParaghraph = sibling;
            break;
          }
        }
        if (firstParaghraph === node2) {
          head2.value = head2.value.slice(1);
          if (head2.value.length === 0) {
            node2.children.shift();
          } else if (node2.position && head2.position && typeof head2.position.start.offset === "number") {
            head2.position.start.column++;
            head2.position.start.offset++;
            node2.position.start = Object.assign({}, head2.position.start);
          }
        }
      }
    }
    this.exit(token);
  }
  function listItemWithTaskListItem(node2, parent, state, info) {
    const head2 = node2.children[0];
    const checkable = typeof node2.checked === "boolean" && head2 && head2.type === "paragraph";
    const checkbox = "[" + (node2.checked ? "x" : " ") + "] ";
    const tracker = state.createTracker(info);
    if (checkable) {
      tracker.move(checkbox);
    }
    let value = handle.listItem(node2, parent, state, {
      ...info,
      ...tracker.current()
    });
    if (checkable) {
      value = value.replace(/^(?:[*+-]|\d+\.)([\r\n]| {1,3})/, check);
    }
    return value;
    function check($0) {
      return $0 + checkbox;
    }
  }

  // node_modules/mdast-util-gfm/lib/index.js
  function gfmFromMarkdown() {
    return [
      gfmAutolinkLiteralFromMarkdown(),
      gfmFootnoteFromMarkdown(),
      gfmStrikethroughFromMarkdown(),
      gfmTableFromMarkdown(),
      gfmTaskListItemFromMarkdown()
    ];
  }
  function gfmToMarkdown(options) {
    return {
      extensions: [
        gfmAutolinkLiteralToMarkdown(),
        gfmFootnoteToMarkdown(options),
        gfmStrikethroughToMarkdown(),
        gfmTableToMarkdown(options),
        gfmTaskListItemToMarkdown()
      ]
    };
  }

  // node_modules/micromark-extension-gfm-autolink-literal/lib/syntax.js
  var wwwPrefix = {
    tokenize: tokenizeWwwPrefix,
    partial: true
  };
  var domain = {
    tokenize: tokenizeDomain,
    partial: true
  };
  var path = {
    tokenize: tokenizePath,
    partial: true
  };
  var trail = {
    tokenize: tokenizeTrail,
    partial: true
  };
  var emailDomainDotTrail = {
    tokenize: tokenizeEmailDomainDotTrail,
    partial: true
  };
  var wwwAutolink = {
    name: "wwwAutolink",
    tokenize: tokenizeWwwAutolink,
    previous: previousWww
  };
  var protocolAutolink = {
    name: "protocolAutolink",
    tokenize: tokenizeProtocolAutolink,
    previous: previousProtocol
  };
  var emailAutolink = {
    name: "emailAutolink",
    tokenize: tokenizeEmailAutolink,
    previous: previousEmail
  };
  var text4 = {};
  function gfmAutolinkLiteral() {
    return {
      text: text4
    };
  }
  var code2 = 48;
  while (code2 < 123) {
    text4[code2] = emailAutolink;
    code2++;
    if (code2 === 58) code2 = 65;
    else if (code2 === 91) code2 = 97;
  }
  text4[43] = emailAutolink;
  text4[45] = emailAutolink;
  text4[46] = emailAutolink;
  text4[95] = emailAutolink;
  text4[72] = [emailAutolink, protocolAutolink];
  text4[104] = [emailAutolink, protocolAutolink];
  text4[87] = [emailAutolink, wwwAutolink];
  text4[119] = [emailAutolink, wwwAutolink];
  function tokenizeEmailAutolink(effects, ok3, nok) {
    const self2 = this;
    let dot;
    let data;
    return start;
    function start(code4) {
      if (!gfmAtext(code4) || !previousEmail.call(self2, self2.previous) || previousUnbalanced(self2.events)) {
        return nok(code4);
      }
      effects.enter("literalAutolink");
      effects.enter("literalAutolinkEmail");
      return atext(code4);
    }
    function atext(code4) {
      if (gfmAtext(code4)) {
        effects.consume(code4);
        return atext;
      }
      if (code4 === 64) {
        effects.consume(code4);
        return emailDomain;
      }
      return nok(code4);
    }
    function emailDomain(code4) {
      if (code4 === 46) {
        return effects.check(emailDomainDotTrail, emailDomainAfter, emailDomainDot)(code4);
      }
      if (code4 === 45 || code4 === 95 || asciiAlphanumeric(code4)) {
        data = true;
        effects.consume(code4);
        return emailDomain;
      }
      return emailDomainAfter(code4);
    }
    function emailDomainDot(code4) {
      effects.consume(code4);
      dot = true;
      return emailDomain;
    }
    function emailDomainAfter(code4) {
      if (data && dot && asciiAlpha(self2.previous)) {
        effects.exit("literalAutolinkEmail");
        effects.exit("literalAutolink");
        return ok3(code4);
      }
      return nok(code4);
    }
  }
  function tokenizeWwwAutolink(effects, ok3, nok) {
    const self2 = this;
    return wwwStart;
    function wwwStart(code4) {
      if (code4 !== 87 && code4 !== 119 || !previousWww.call(self2, self2.previous) || previousUnbalanced(self2.events)) {
        return nok(code4);
      }
      effects.enter("literalAutolink");
      effects.enter("literalAutolinkWww");
      return effects.check(wwwPrefix, effects.attempt(domain, effects.attempt(path, wwwAfter), nok), nok)(code4);
    }
    function wwwAfter(code4) {
      effects.exit("literalAutolinkWww");
      effects.exit("literalAutolink");
      return ok3(code4);
    }
  }
  function tokenizeProtocolAutolink(effects, ok3, nok) {
    const self2 = this;
    let buffer = "";
    let seen = false;
    return protocolStart;
    function protocolStart(code4) {
      if ((code4 === 72 || code4 === 104) && previousProtocol.call(self2, self2.previous) && !previousUnbalanced(self2.events)) {
        effects.enter("literalAutolink");
        effects.enter("literalAutolinkHttp");
        buffer += String.fromCodePoint(code4);
        effects.consume(code4);
        return protocolPrefixInside;
      }
      return nok(code4);
    }
    function protocolPrefixInside(code4) {
      if (asciiAlpha(code4) && buffer.length < 5) {
        buffer += String.fromCodePoint(code4);
        effects.consume(code4);
        return protocolPrefixInside;
      }
      if (code4 === 58) {
        const protocol = buffer.toLowerCase();
        if (protocol === "http" || protocol === "https") {
          effects.consume(code4);
          return protocolSlashesInside;
        }
      }
      return nok(code4);
    }
    function protocolSlashesInside(code4) {
      if (code4 === 47) {
        effects.consume(code4);
        if (seen) {
          return afterProtocol;
        }
        seen = true;
        return protocolSlashesInside;
      }
      return nok(code4);
    }
    function afterProtocol(code4) {
      return code4 === null || asciiControl(code4) || markdownLineEndingOrSpace(code4) || unicodeWhitespace(code4) || unicodePunctuation(code4) ? nok(code4) : effects.attempt(domain, effects.attempt(path, protocolAfter), nok)(code4);
    }
    function protocolAfter(code4) {
      effects.exit("literalAutolinkHttp");
      effects.exit("literalAutolink");
      return ok3(code4);
    }
  }
  function tokenizeWwwPrefix(effects, ok3, nok) {
    let size = 0;
    return wwwPrefixInside;
    function wwwPrefixInside(code4) {
      if ((code4 === 87 || code4 === 119) && size < 3) {
        size++;
        effects.consume(code4);
        return wwwPrefixInside;
      }
      if (code4 === 46 && size === 3) {
        effects.consume(code4);
        return wwwPrefixAfter;
      }
      return nok(code4);
    }
    function wwwPrefixAfter(code4) {
      return code4 === null ? nok(code4) : ok3(code4);
    }
  }
  function tokenizeDomain(effects, ok3, nok) {
    let underscoreInLastSegment;
    let underscoreInLastLastSegment;
    let seen;
    return domainInside;
    function domainInside(code4) {
      if (code4 === 46 || code4 === 95) {
        return effects.check(trail, domainAfter, domainAtPunctuation)(code4);
      }
      if (code4 === null || markdownLineEndingOrSpace(code4) || unicodeWhitespace(code4) || code4 !== 45 && unicodePunctuation(code4)) {
        return domainAfter(code4);
      }
      seen = true;
      effects.consume(code4);
      return domainInside;
    }
    function domainAtPunctuation(code4) {
      if (code4 === 95) {
        underscoreInLastSegment = true;
      } else {
        underscoreInLastLastSegment = underscoreInLastSegment;
        underscoreInLastSegment = void 0;
      }
      effects.consume(code4);
      return domainInside;
    }
    function domainAfter(code4) {
      if (underscoreInLastLastSegment || underscoreInLastSegment || !seen) {
        return nok(code4);
      }
      return ok3(code4);
    }
  }
  function tokenizePath(effects, ok3) {
    let sizeOpen = 0;
    let sizeClose = 0;
    return pathInside;
    function pathInside(code4) {
      if (code4 === 40) {
        sizeOpen++;
        effects.consume(code4);
        return pathInside;
      }
      if (code4 === 41 && sizeClose < sizeOpen) {
        return pathAtPunctuation(code4);
      }
      if (code4 === 33 || code4 === 34 || code4 === 38 || code4 === 39 || code4 === 41 || code4 === 42 || code4 === 44 || code4 === 46 || code4 === 58 || code4 === 59 || code4 === 60 || code4 === 63 || code4 === 93 || code4 === 95 || code4 === 126) {
        return effects.check(trail, ok3, pathAtPunctuation)(code4);
      }
      if (code4 === null || markdownLineEndingOrSpace(code4) || unicodeWhitespace(code4)) {
        return ok3(code4);
      }
      effects.consume(code4);
      return pathInside;
    }
    function pathAtPunctuation(code4) {
      if (code4 === 41) {
        sizeClose++;
      }
      effects.consume(code4);
      return pathInside;
    }
  }
  function tokenizeTrail(effects, ok3, nok) {
    return trail2;
    function trail2(code4) {
      if (code4 === 33 || code4 === 34 || code4 === 39 || code4 === 41 || code4 === 42 || code4 === 44 || code4 === 46 || code4 === 58 || code4 === 59 || code4 === 63 || code4 === 95 || code4 === 126) {
        effects.consume(code4);
        return trail2;
      }
      if (code4 === 38) {
        effects.consume(code4);
        return trailCharacterReferenceStart;
      }
      if (code4 === 93) {
        effects.consume(code4);
        return trailBracketAfter;
      }
      if (
        // `<` is an end.
        code4 === 60 || // So is whitespace.
        code4 === null || markdownLineEndingOrSpace(code4) || unicodeWhitespace(code4)
      ) {
        return ok3(code4);
      }
      return nok(code4);
    }
    function trailBracketAfter(code4) {
      if (code4 === null || code4 === 40 || code4 === 91 || markdownLineEndingOrSpace(code4) || unicodeWhitespace(code4)) {
        return ok3(code4);
      }
      return trail2(code4);
    }
    function trailCharacterReferenceStart(code4) {
      return asciiAlpha(code4) ? trailCharacterReferenceInside(code4) : nok(code4);
    }
    function trailCharacterReferenceInside(code4) {
      if (code4 === 59) {
        effects.consume(code4);
        return trail2;
      }
      if (asciiAlpha(code4)) {
        effects.consume(code4);
        return trailCharacterReferenceInside;
      }
      return nok(code4);
    }
  }
  function tokenizeEmailDomainDotTrail(effects, ok3, nok) {
    return start;
    function start(code4) {
      effects.consume(code4);
      return after;
    }
    function after(code4) {
      return asciiAlphanumeric(code4) ? nok(code4) : ok3(code4);
    }
  }
  function previousWww(code4) {
    return code4 === null || code4 === 40 || code4 === 42 || code4 === 95 || code4 === 91 || code4 === 93 || code4 === 126 || markdownLineEndingOrSpace(code4);
  }
  function previousProtocol(code4) {
    return !asciiAlpha(code4);
  }
  function previousEmail(code4) {
    return !(code4 === 47 || gfmAtext(code4));
  }
  function gfmAtext(code4) {
    return code4 === 43 || code4 === 45 || code4 === 46 || code4 === 95 || asciiAlphanumeric(code4);
  }
  function previousUnbalanced(events) {
    let index2 = events.length;
    let result = false;
    while (index2--) {
      const token = events[index2][1];
      if ((token.type === "labelLink" || token.type === "labelImage") && !token._balanced) {
        result = true;
        break;
      }
      if (token._gfmAutolinkLiteralWalkedInto) {
        result = false;
        break;
      }
    }
    if (events.length > 0 && !result) {
      events[events.length - 1][1]._gfmAutolinkLiteralWalkedInto = true;
    }
    return result;
  }

  // node_modules/micromark-extension-gfm-footnote/lib/syntax.js
  var indent = {
    tokenize: tokenizeIndent2,
    partial: true
  };
  function gfmFootnote() {
    return {
      document: {
        [91]: {
          name: "gfmFootnoteDefinition",
          tokenize: tokenizeDefinitionStart,
          continuation: {
            tokenize: tokenizeDefinitionContinuation
          },
          exit: gfmFootnoteDefinitionEnd
        }
      },
      text: {
        [91]: {
          name: "gfmFootnoteCall",
          tokenize: tokenizeGfmFootnoteCall
        },
        [93]: {
          name: "gfmPotentialFootnoteCall",
          add: "after",
          tokenize: tokenizePotentialGfmFootnoteCall,
          resolveTo: resolveToPotentialGfmFootnoteCall
        }
      }
    };
  }
  function tokenizePotentialGfmFootnoteCall(effects, ok3, nok) {
    const self2 = this;
    let index2 = self2.events.length;
    const defined = self2.parser.gfmFootnotes || (self2.parser.gfmFootnotes = []);
    let labelStart;
    while (index2--) {
      const token = self2.events[index2][1];
      if (token.type === "labelImage") {
        labelStart = token;
        break;
      }
      if (token.type === "gfmFootnoteCall" || token.type === "labelLink" || token.type === "label" || token.type === "image" || token.type === "link") {
        break;
      }
    }
    return start;
    function start(code4) {
      if (!labelStart || !labelStart._balanced) {
        return nok(code4);
      }
      const id = normalizeIdentifier(self2.sliceSerialize({
        start: labelStart.end,
        end: self2.now()
      }));
      if (id.codePointAt(0) !== 94 || !defined.includes(id.slice(1))) {
        return nok(code4);
      }
      effects.enter("gfmFootnoteCallLabelMarker");
      effects.consume(code4);
      effects.exit("gfmFootnoteCallLabelMarker");
      return ok3(code4);
    }
  }
  function resolveToPotentialGfmFootnoteCall(events, context) {
    let index2 = events.length;
    let labelStart;
    while (index2--) {
      if (events[index2][1].type === "labelImage" && events[index2][0] === "enter") {
        labelStart = events[index2][1];
        break;
      }
    }
    events[index2 + 1][1].type = "data";
    events[index2 + 3][1].type = "gfmFootnoteCallLabelMarker";
    const call = {
      type: "gfmFootnoteCall",
      start: Object.assign({}, events[index2 + 3][1].start),
      end: Object.assign({}, events[events.length - 1][1].end)
    };
    const marker = {
      type: "gfmFootnoteCallMarker",
      start: Object.assign({}, events[index2 + 3][1].end),
      end: Object.assign({}, events[index2 + 3][1].end)
    };
    marker.end.column++;
    marker.end.offset++;
    marker.end._bufferIndex++;
    const string3 = {
      type: "gfmFootnoteCallString",
      start: Object.assign({}, marker.end),
      end: Object.assign({}, events[events.length - 1][1].start)
    };
    const chunk = {
      type: "chunkString",
      contentType: "string",
      start: Object.assign({}, string3.start),
      end: Object.assign({}, string3.end)
    };
    const replacement = [
      // Take the `labelImageMarker` (now `data`, the `!`)
      events[index2 + 1],
      events[index2 + 2],
      ["enter", call, context],
      // The `[`
      events[index2 + 3],
      events[index2 + 4],
      // The `^`.
      ["enter", marker, context],
      ["exit", marker, context],
      // Everything in between.
      ["enter", string3, context],
      ["enter", chunk, context],
      ["exit", chunk, context],
      ["exit", string3, context],
      // The ending (`]`, properly parsed and labelled).
      events[events.length - 2],
      events[events.length - 1],
      ["exit", call, context]
    ];
    events.splice(index2, events.length - index2 + 1, ...replacement);
    return events;
  }
  function tokenizeGfmFootnoteCall(effects, ok3, nok) {
    const self2 = this;
    const defined = self2.parser.gfmFootnotes || (self2.parser.gfmFootnotes = []);
    let size = 0;
    let data;
    return start;
    function start(code4) {
      effects.enter("gfmFootnoteCall");
      effects.enter("gfmFootnoteCallLabelMarker");
      effects.consume(code4);
      effects.exit("gfmFootnoteCallLabelMarker");
      return callStart;
    }
    function callStart(code4) {
      if (code4 !== 94) return nok(code4);
      effects.enter("gfmFootnoteCallMarker");
      effects.consume(code4);
      effects.exit("gfmFootnoteCallMarker");
      effects.enter("gfmFootnoteCallString");
      effects.enter("chunkString").contentType = "string";
      return callData;
    }
    function callData(code4) {
      if (
        // Too long.
        size > 999 || // Closing brace with nothing.
        code4 === 93 && !data || // Space or tab is not supported by GFM for some reason.
        // `\n` and `[` not being supported makes sense.
        code4 === null || code4 === 91 || markdownLineEndingOrSpace(code4)
      ) {
        return nok(code4);
      }
      if (code4 === 93) {
        effects.exit("chunkString");
        const token = effects.exit("gfmFootnoteCallString");
        if (!defined.includes(normalizeIdentifier(self2.sliceSerialize(token)))) {
          return nok(code4);
        }
        effects.enter("gfmFootnoteCallLabelMarker");
        effects.consume(code4);
        effects.exit("gfmFootnoteCallLabelMarker");
        effects.exit("gfmFootnoteCall");
        return ok3;
      }
      if (!markdownLineEndingOrSpace(code4)) {
        data = true;
      }
      size++;
      effects.consume(code4);
      return code4 === 92 ? callEscape : callData;
    }
    function callEscape(code4) {
      if (code4 === 91 || code4 === 92 || code4 === 93) {
        effects.consume(code4);
        size++;
        return callData;
      }
      return callData(code4);
    }
  }
  function tokenizeDefinitionStart(effects, ok3, nok) {
    const self2 = this;
    const defined = self2.parser.gfmFootnotes || (self2.parser.gfmFootnotes = []);
    let identifier;
    let size = 0;
    let data;
    return start;
    function start(code4) {
      effects.enter("gfmFootnoteDefinition")._container = true;
      effects.enter("gfmFootnoteDefinitionLabel");
      effects.enter("gfmFootnoteDefinitionLabelMarker");
      effects.consume(code4);
      effects.exit("gfmFootnoteDefinitionLabelMarker");
      return labelAtMarker;
    }
    function labelAtMarker(code4) {
      if (code4 === 94) {
        effects.enter("gfmFootnoteDefinitionMarker");
        effects.consume(code4);
        effects.exit("gfmFootnoteDefinitionMarker");
        effects.enter("gfmFootnoteDefinitionLabelString");
        effects.enter("chunkString").contentType = "string";
        return labelInside;
      }
      return nok(code4);
    }
    function labelInside(code4) {
      if (
        // Too long.
        size > 999 || // Closing brace with nothing.
        code4 === 93 && !data || // Space or tab is not supported by GFM for some reason.
        // `\n` and `[` not being supported makes sense.
        code4 === null || code4 === 91 || markdownLineEndingOrSpace(code4)
      ) {
        return nok(code4);
      }
      if (code4 === 93) {
        effects.exit("chunkString");
        const token = effects.exit("gfmFootnoteDefinitionLabelString");
        identifier = normalizeIdentifier(self2.sliceSerialize(token));
        effects.enter("gfmFootnoteDefinitionLabelMarker");
        effects.consume(code4);
        effects.exit("gfmFootnoteDefinitionLabelMarker");
        effects.exit("gfmFootnoteDefinitionLabel");
        return labelAfter;
      }
      if (!markdownLineEndingOrSpace(code4)) {
        data = true;
      }
      size++;
      effects.consume(code4);
      return code4 === 92 ? labelEscape : labelInside;
    }
    function labelEscape(code4) {
      if (code4 === 91 || code4 === 92 || code4 === 93) {
        effects.consume(code4);
        size++;
        return labelInside;
      }
      return labelInside(code4);
    }
    function labelAfter(code4) {
      if (code4 === 58) {
        effects.enter("definitionMarker");
        effects.consume(code4);
        effects.exit("definitionMarker");
        if (!defined.includes(identifier)) {
          defined.push(identifier);
        }
        return factorySpace(effects, whitespaceAfter, "gfmFootnoteDefinitionWhitespace");
      }
      return nok(code4);
    }
    function whitespaceAfter(code4) {
      return ok3(code4);
    }
  }
  function tokenizeDefinitionContinuation(effects, ok3, nok) {
    return effects.check(blankLine, ok3, effects.attempt(indent, ok3, nok));
  }
  function gfmFootnoteDefinitionEnd(effects) {
    effects.exit("gfmFootnoteDefinition");
  }
  function tokenizeIndent2(effects, ok3, nok) {
    const self2 = this;
    return factorySpace(effects, afterPrefix, "gfmFootnoteDefinitionIndent", 4 + 1);
    function afterPrefix(code4) {
      const tail = self2.events[self2.events.length - 1];
      return tail && tail[1].type === "gfmFootnoteDefinitionIndent" && tail[2].sliceSerialize(tail[1], true).length === 4 ? ok3(code4) : nok(code4);
    }
  }

  // node_modules/micromark-extension-gfm-strikethrough/lib/syntax.js
  function gfmStrikethrough(options) {
    const options_ = options || {};
    let single = options_.singleTilde;
    const tokenizer = {
      name: "strikethrough",
      tokenize: tokenizeStrikethrough,
      resolveAll: resolveAllStrikethrough
    };
    if (single === null || single === void 0) {
      single = true;
    }
    return {
      text: {
        [126]: tokenizer
      },
      insideSpan: {
        null: [tokenizer]
      },
      attentionMarkers: {
        null: [126]
      }
    };
    function resolveAllStrikethrough(events, context) {
      let index2 = -1;
      while (++index2 < events.length) {
        if (events[index2][0] === "enter" && events[index2][1].type === "strikethroughSequenceTemporary" && events[index2][1]._close) {
          let open = index2;
          while (open--) {
            if (events[open][0] === "exit" && events[open][1].type === "strikethroughSequenceTemporary" && events[open][1]._open && // If the sizes are the same:
            events[index2][1].end.offset - events[index2][1].start.offset === events[open][1].end.offset - events[open][1].start.offset) {
              events[index2][1].type = "strikethroughSequence";
              events[open][1].type = "strikethroughSequence";
              const strikethrough2 = {
                type: "strikethrough",
                start: Object.assign({}, events[open][1].start),
                end: Object.assign({}, events[index2][1].end)
              };
              const text9 = {
                type: "strikethroughText",
                start: Object.assign({}, events[open][1].end),
                end: Object.assign({}, events[index2][1].start)
              };
              const nextEvents = [["enter", strikethrough2, context], ["enter", events[open][1], context], ["exit", events[open][1], context], ["enter", text9, context]];
              const insideSpan2 = context.parser.constructs.insideSpan.null;
              if (insideSpan2) {
                splice(nextEvents, nextEvents.length, 0, resolveAll(insideSpan2, events.slice(open + 1, index2), context));
              }
              splice(nextEvents, nextEvents.length, 0, [["exit", text9, context], ["enter", events[index2][1], context], ["exit", events[index2][1], context], ["exit", strikethrough2, context]]);
              splice(events, open - 1, index2 - open + 3, nextEvents);
              index2 = open + nextEvents.length - 2;
              break;
            }
          }
        }
      }
      index2 = -1;
      while (++index2 < events.length) {
        if (events[index2][1].type === "strikethroughSequenceTemporary") {
          events[index2][1].type = "data";
        }
      }
      return events;
    }
    function tokenizeStrikethrough(effects, ok3, nok) {
      const previous4 = this.previous;
      const events = this.events;
      let size = 0;
      return start;
      function start(code4) {
        if (previous4 === 126 && events[events.length - 1][1].type !== "characterEscape") {
          return nok(code4);
        }
        effects.enter("strikethroughSequenceTemporary");
        return more(code4);
      }
      function more(code4) {
        const before = classifyCharacter(previous4);
        if (code4 === 126) {
          if (size > 1) return nok(code4);
          effects.consume(code4);
          size++;
          return more;
        }
        if (size < 2 && !single) return nok(code4);
        const token = effects.exit("strikethroughSequenceTemporary");
        const after = classifyCharacter(code4);
        token._open = !after || after === 2 && Boolean(before);
        token._close = !before || before === 2 && Boolean(after);
        return ok3(code4);
      }
    }
  }

  // node_modules/micromark-extension-gfm-table/lib/edit-map.js
  var EditMap = class {
    /**
     * Create a new edit map.
     */
    constructor() {
      this.map = [];
    }
    /**
     * Create an edit: a remove and/or add at a certain place.
     *
     * @param {number} index
     * @param {number} remove
     * @param {Array<Event>} add
     * @returns {undefined}
     */
    add(index2, remove, add) {
      addImplementation(this, index2, remove, add);
    }
    // To do: add this when moving to `micromark`.
    // /**
    //  * Create an edit: but insert `add` before existing additions.
    //  *
    //  * @param {number} index
    //  * @param {number} remove
    //  * @param {Array<Event>} add
    //  * @returns {undefined}
    //  */
    // addBefore(index, remove, add) {
    //   addImplementation(this, index, remove, add, true)
    // }
    /**
     * Done, change the events.
     *
     * @param {Array<Event>} events
     * @returns {undefined}
     */
    consume(events) {
      this.map.sort(function(a, b) {
        return a[0] - b[0];
      });
      if (this.map.length === 0) {
        return;
      }
      let index2 = this.map.length;
      const vecs = [];
      while (index2 > 0) {
        index2 -= 1;
        vecs.push(events.slice(this.map[index2][0] + this.map[index2][1]), this.map[index2][2]);
        events.length = this.map[index2][0];
      }
      vecs.push(events.slice());
      events.length = 0;
      let slice = vecs.pop();
      while (slice) {
        for (const element6 of slice) {
          events.push(element6);
        }
        slice = vecs.pop();
      }
      this.map.length = 0;
    }
  };
  function addImplementation(editMap, at, remove, add) {
    let index2 = 0;
    if (remove === 0 && add.length === 0) {
      return;
    }
    while (index2 < editMap.map.length) {
      if (editMap.map[index2][0] === at) {
        editMap.map[index2][1] += remove;
        editMap.map[index2][2].push(...add);
        return;
      }
      index2 += 1;
    }
    editMap.map.push([at, remove, add]);
  }

  // node_modules/micromark-extension-gfm-table/lib/infer.js
  function gfmTableAlign(events, index2) {
    let inDelimiterRow = false;
    const align = [];
    while (index2 < events.length) {
      const event = events[index2];
      if (inDelimiterRow) {
        if (event[0] === "enter") {
          if (event[1].type === "tableContent") {
            align.push(events[index2 + 1][1].type === "tableDelimiterMarker" ? "left" : "none");
          }
        } else if (event[1].type === "tableContent") {
          if (events[index2 - 1][1].type === "tableDelimiterMarker") {
            const alignIndex = align.length - 1;
            align[alignIndex] = align[alignIndex] === "left" ? "center" : "right";
          }
        } else if (event[1].type === "tableDelimiterRow") {
          break;
        }
      } else if (event[0] === "enter" && event[1].type === "tableDelimiterRow") {
        inDelimiterRow = true;
      }
      index2 += 1;
    }
    return align;
  }

  // node_modules/micromark-extension-gfm-table/lib/syntax.js
  function gfmTable() {
    return {
      flow: {
        null: {
          name: "table",
          tokenize: tokenizeTable,
          resolveAll: resolveTable
        }
      }
    };
  }
  function tokenizeTable(effects, ok3, nok) {
    const self2 = this;
    let size = 0;
    let sizeB = 0;
    let seen;
    return start;
    function start(code4) {
      let index2 = self2.events.length - 1;
      while (index2 > -1) {
        const type = self2.events[index2][1].type;
        if (type === "lineEnding" || // Note: markdown-rs uses `whitespace` instead of `linePrefix`
        type === "linePrefix") index2--;
        else break;
      }
      const tail = index2 > -1 ? self2.events[index2][1].type : null;
      const next = tail === "tableHead" || tail === "tableRow" ? bodyRowStart : headRowBefore;
      if (next === bodyRowStart && self2.parser.lazy[self2.now().line]) {
        return nok(code4);
      }
      return next(code4);
    }
    function headRowBefore(code4) {
      effects.enter("tableHead");
      effects.enter("tableRow");
      return headRowStart(code4);
    }
    function headRowStart(code4) {
      if (code4 === 124) {
        return headRowBreak(code4);
      }
      seen = true;
      sizeB += 1;
      return headRowBreak(code4);
    }
    function headRowBreak(code4) {
      if (code4 === null) {
        return nok(code4);
      }
      if (markdownLineEnding(code4)) {
        if (sizeB > 1) {
          sizeB = 0;
          self2.interrupt = true;
          effects.exit("tableRow");
          effects.enter("lineEnding");
          effects.consume(code4);
          effects.exit("lineEnding");
          return headDelimiterStart;
        }
        return nok(code4);
      }
      if (markdownSpace(code4)) {
        return factorySpace(effects, headRowBreak, "whitespace")(code4);
      }
      sizeB += 1;
      if (seen) {
        seen = false;
        size += 1;
      }
      if (code4 === 124) {
        effects.enter("tableCellDivider");
        effects.consume(code4);
        effects.exit("tableCellDivider");
        seen = true;
        return headRowBreak;
      }
      effects.enter("data");
      return headRowData(code4);
    }
    function headRowData(code4) {
      if (code4 === null || code4 === 124 || markdownLineEndingOrSpace(code4)) {
        effects.exit("data");
        return headRowBreak(code4);
      }
      effects.consume(code4);
      return code4 === 92 ? headRowEscape : headRowData;
    }
    function headRowEscape(code4) {
      if (code4 === 92 || code4 === 124) {
        effects.consume(code4);
        return headRowData;
      }
      return headRowData(code4);
    }
    function headDelimiterStart(code4) {
      self2.interrupt = false;
      if (self2.parser.lazy[self2.now().line]) {
        return nok(code4);
      }
      effects.enter("tableDelimiterRow");
      seen = false;
      if (markdownSpace(code4)) {
        return factorySpace(effects, headDelimiterBefore, "linePrefix", self2.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4)(code4);
      }
      return headDelimiterBefore(code4);
    }
    function headDelimiterBefore(code4) {
      if (code4 === 45 || code4 === 58) {
        return headDelimiterValueBefore(code4);
      }
      if (code4 === 124) {
        seen = true;
        effects.enter("tableCellDivider");
        effects.consume(code4);
        effects.exit("tableCellDivider");
        return headDelimiterCellBefore;
      }
      return headDelimiterNok(code4);
    }
    function headDelimiterCellBefore(code4) {
      if (markdownSpace(code4)) {
        return factorySpace(effects, headDelimiterValueBefore, "whitespace")(code4);
      }
      return headDelimiterValueBefore(code4);
    }
    function headDelimiterValueBefore(code4) {
      if (code4 === 58) {
        sizeB += 1;
        seen = true;
        effects.enter("tableDelimiterMarker");
        effects.consume(code4);
        effects.exit("tableDelimiterMarker");
        return headDelimiterLeftAlignmentAfter;
      }
      if (code4 === 45) {
        sizeB += 1;
        return headDelimiterLeftAlignmentAfter(code4);
      }
      if (code4 === null || markdownLineEnding(code4)) {
        return headDelimiterCellAfter(code4);
      }
      return headDelimiterNok(code4);
    }
    function headDelimiterLeftAlignmentAfter(code4) {
      if (code4 === 45) {
        effects.enter("tableDelimiterFiller");
        return headDelimiterFiller(code4);
      }
      return headDelimiterNok(code4);
    }
    function headDelimiterFiller(code4) {
      if (code4 === 45) {
        effects.consume(code4);
        return headDelimiterFiller;
      }
      if (code4 === 58) {
        seen = true;
        effects.exit("tableDelimiterFiller");
        effects.enter("tableDelimiterMarker");
        effects.consume(code4);
        effects.exit("tableDelimiterMarker");
        return headDelimiterRightAlignmentAfter;
      }
      effects.exit("tableDelimiterFiller");
      return headDelimiterRightAlignmentAfter(code4);
    }
    function headDelimiterRightAlignmentAfter(code4) {
      if (markdownSpace(code4)) {
        return factorySpace(effects, headDelimiterCellAfter, "whitespace")(code4);
      }
      return headDelimiterCellAfter(code4);
    }
    function headDelimiterCellAfter(code4) {
      if (code4 === 124) {
        return headDelimiterBefore(code4);
      }
      if (code4 === null || markdownLineEnding(code4)) {
        if (!seen || size !== sizeB) {
          return headDelimiterNok(code4);
        }
        effects.exit("tableDelimiterRow");
        effects.exit("tableHead");
        return ok3(code4);
      }
      return headDelimiterNok(code4);
    }
    function headDelimiterNok(code4) {
      return nok(code4);
    }
    function bodyRowStart(code4) {
      effects.enter("tableRow");
      return bodyRowBreak(code4);
    }
    function bodyRowBreak(code4) {
      if (code4 === 124) {
        effects.enter("tableCellDivider");
        effects.consume(code4);
        effects.exit("tableCellDivider");
        return bodyRowBreak;
      }
      if (code4 === null || markdownLineEnding(code4)) {
        effects.exit("tableRow");
        return ok3(code4);
      }
      if (markdownSpace(code4)) {
        return factorySpace(effects, bodyRowBreak, "whitespace")(code4);
      }
      effects.enter("data");
      return bodyRowData(code4);
    }
    function bodyRowData(code4) {
      if (code4 === null || code4 === 124 || markdownLineEndingOrSpace(code4)) {
        effects.exit("data");
        return bodyRowBreak(code4);
      }
      effects.consume(code4);
      return code4 === 92 ? bodyRowEscape : bodyRowData;
    }
    function bodyRowEscape(code4) {
      if (code4 === 92 || code4 === 124) {
        effects.consume(code4);
        return bodyRowData;
      }
      return bodyRowData(code4);
    }
  }
  function resolveTable(events, context) {
    let index2 = -1;
    let inFirstCellAwaitingPipe = true;
    let rowKind = 0;
    let lastCell = [0, 0, 0, 0];
    let cell2 = [0, 0, 0, 0];
    let afterHeadAwaitingFirstBodyRow = false;
    let lastTableEnd = 0;
    let currentTable;
    let currentBody;
    let currentCell;
    const map3 = new EditMap();
    while (++index2 < events.length) {
      const event = events[index2];
      const token = event[1];
      if (event[0] === "enter") {
        if (token.type === "tableHead") {
          afterHeadAwaitingFirstBodyRow = false;
          if (lastTableEnd !== 0) {
            flushTableEnd(map3, context, lastTableEnd, currentTable, currentBody);
            currentBody = void 0;
            lastTableEnd = 0;
          }
          currentTable = {
            type: "table",
            start: Object.assign({}, token.start),
            // Note: correct end is set later.
            end: Object.assign({}, token.end)
          };
          map3.add(index2, 0, [["enter", currentTable, context]]);
        } else if (token.type === "tableRow" || token.type === "tableDelimiterRow") {
          inFirstCellAwaitingPipe = true;
          currentCell = void 0;
          lastCell = [0, 0, 0, 0];
          cell2 = [0, index2 + 1, 0, 0];
          if (afterHeadAwaitingFirstBodyRow) {
            afterHeadAwaitingFirstBodyRow = false;
            currentBody = {
              type: "tableBody",
              start: Object.assign({}, token.start),
              // Note: correct end is set later.
              end: Object.assign({}, token.end)
            };
            map3.add(index2, 0, [["enter", currentBody, context]]);
          }
          rowKind = token.type === "tableDelimiterRow" ? 2 : currentBody ? 3 : 1;
        } else if (rowKind && (token.type === "data" || token.type === "tableDelimiterMarker" || token.type === "tableDelimiterFiller")) {
          inFirstCellAwaitingPipe = false;
          if (cell2[2] === 0) {
            if (lastCell[1] !== 0) {
              cell2[0] = cell2[1];
              currentCell = flushCell(map3, context, lastCell, rowKind, void 0, currentCell);
              lastCell = [0, 0, 0, 0];
            }
            cell2[2] = index2;
          }
        } else if (token.type === "tableCellDivider") {
          if (inFirstCellAwaitingPipe) {
            inFirstCellAwaitingPipe = false;
          } else {
            if (lastCell[1] !== 0) {
              cell2[0] = cell2[1];
              currentCell = flushCell(map3, context, lastCell, rowKind, void 0, currentCell);
            }
            lastCell = cell2;
            cell2 = [lastCell[1], index2, 0, 0];
          }
        }
      } else if (token.type === "tableHead") {
        afterHeadAwaitingFirstBodyRow = true;
        lastTableEnd = index2;
      } else if (token.type === "tableRow" || token.type === "tableDelimiterRow") {
        lastTableEnd = index2;
        if (lastCell[1] !== 0) {
          cell2[0] = cell2[1];
          currentCell = flushCell(map3, context, lastCell, rowKind, index2, currentCell);
        } else if (cell2[1] !== 0) {
          currentCell = flushCell(map3, context, cell2, rowKind, index2, currentCell);
        }
        rowKind = 0;
      } else if (rowKind && (token.type === "data" || token.type === "tableDelimiterMarker" || token.type === "tableDelimiterFiller")) {
        cell2[3] = index2;
      }
    }
    if (lastTableEnd !== 0) {
      flushTableEnd(map3, context, lastTableEnd, currentTable, currentBody);
    }
    map3.consume(context.events);
    index2 = -1;
    while (++index2 < context.events.length) {
      const event = context.events[index2];
      if (event[0] === "enter" && event[1].type === "table") {
        event[1]._align = gfmTableAlign(context.events, index2);
      }
    }
    return events;
  }
  function flushCell(map3, context, range, rowKind, rowEnd, previousCell) {
    const groupName = rowKind === 1 ? "tableHeader" : rowKind === 2 ? "tableDelimiter" : "tableData";
    const valueName = "tableContent";
    if (range[0] !== 0) {
      previousCell.end = Object.assign({}, getPoint(context.events, range[0]));
      map3.add(range[0], 0, [["exit", previousCell, context]]);
    }
    const now = getPoint(context.events, range[1]);
    previousCell = {
      type: groupName,
      start: Object.assign({}, now),
      // Note: correct end is set later.
      end: Object.assign({}, now)
    };
    map3.add(range[1], 0, [["enter", previousCell, context]]);
    if (range[2] !== 0) {
      const relatedStart = getPoint(context.events, range[2]);
      const relatedEnd = getPoint(context.events, range[3]);
      const valueToken = {
        type: valueName,
        start: Object.assign({}, relatedStart),
        end: Object.assign({}, relatedEnd)
      };
      map3.add(range[2], 0, [["enter", valueToken, context]]);
      if (rowKind !== 2) {
        const start = context.events[range[2]];
        const end = context.events[range[3]];
        start[1].end = Object.assign({}, end[1].end);
        start[1].type = "chunkText";
        start[1].contentType = "text";
        if (range[3] > range[2] + 1) {
          const a = range[2] + 1;
          const b = range[3] - range[2] - 1;
          map3.add(a, b, []);
        }
      }
      map3.add(range[3] + 1, 0, [["exit", valueToken, context]]);
    }
    if (rowEnd !== void 0) {
      previousCell.end = Object.assign({}, getPoint(context.events, rowEnd));
      map3.add(rowEnd, 0, [["exit", previousCell, context]]);
      previousCell = void 0;
    }
    return previousCell;
  }
  function flushTableEnd(map3, context, index2, table2, tableBody) {
    const exits = [];
    const related = getPoint(context.events, index2);
    if (tableBody) {
      tableBody.end = Object.assign({}, related);
      exits.push(["exit", tableBody, context]);
    }
    table2.end = Object.assign({}, related);
    exits.push(["exit", table2, context]);
    map3.add(index2 + 1, 0, exits);
  }
  function getPoint(events, index2) {
    const event = events[index2];
    const side = event[0] === "enter" ? "start" : "end";
    return event[1][side];
  }

  // node_modules/micromark-extension-gfm-task-list-item/lib/syntax.js
  var tasklistCheck = {
    name: "tasklistCheck",
    tokenize: tokenizeTasklistCheck
  };
  function gfmTaskListItem() {
    return {
      text: {
        [91]: tasklistCheck
      }
    };
  }
  function tokenizeTasklistCheck(effects, ok3, nok) {
    const self2 = this;
    return open;
    function open(code4) {
      if (
        // Exit if there’s stuff before.
        self2.previous !== null || // Exit if not in the first content that is the first child of a list
        // item.
        !self2._gfmTasklistFirstContentOfListItem
      ) {
        return nok(code4);
      }
      effects.enter("taskListCheck");
      effects.enter("taskListCheckMarker");
      effects.consume(code4);
      effects.exit("taskListCheckMarker");
      return inside;
    }
    function inside(code4) {
      if (markdownLineEndingOrSpace(code4)) {
        effects.enter("taskListCheckValueUnchecked");
        effects.consume(code4);
        effects.exit("taskListCheckValueUnchecked");
        return close;
      }
      if (code4 === 88 || code4 === 120) {
        effects.enter("taskListCheckValueChecked");
        effects.consume(code4);
        effects.exit("taskListCheckValueChecked");
        return close;
      }
      return nok(code4);
    }
    function close(code4) {
      if (code4 === 93) {
        effects.enter("taskListCheckMarker");
        effects.consume(code4);
        effects.exit("taskListCheckMarker");
        effects.exit("taskListCheck");
        return after;
      }
      return nok(code4);
    }
    function after(code4) {
      if (markdownLineEnding(code4)) {
        return ok3(code4);
      }
      if (markdownSpace(code4)) {
        return effects.check({
          tokenize: spaceThenNonSpace
        }, ok3, nok)(code4);
      }
      return nok(code4);
    }
  }
  function spaceThenNonSpace(effects, ok3, nok) {
    return factorySpace(effects, after, "whitespace");
    function after(code4) {
      return code4 === null ? nok(code4) : ok3(code4);
    }
  }

  // node_modules/micromark-extension-gfm/index.js
  function gfm(options) {
    return combineExtensions([
      gfmAutolinkLiteral(),
      gfmFootnote(),
      gfmStrikethrough(options),
      gfmTable(),
      gfmTaskListItem()
    ]);
  }

  // node_modules/remark-gfm/lib/index.js
  var emptyOptions2 = {};
  function remarkGfm(options) {
    const self2 = (
      /** @type {Processor<Root>} */
      this
    );
    const settings = options || emptyOptions2;
    const data = self2.data();
    const micromarkExtensions = data.micromarkExtensions || (data.micromarkExtensions = []);
    const fromMarkdownExtensions = data.fromMarkdownExtensions || (data.fromMarkdownExtensions = []);
    const toMarkdownExtensions = data.toMarkdownExtensions || (data.toMarkdownExtensions = []);
    micromarkExtensions.push(gfm(settings));
    fromMarkdownExtensions.push(gfmFromMarkdown());
    toMarkdownExtensions.push(gfmToMarkdown(settings));
  }

  // node_modules/mdast-util-math/lib/index.js
  function mathFromMarkdown() {
    return {
      enter: {
        mathFlow: enterMathFlow,
        mathFlowFenceMeta: enterMathFlowMeta,
        mathText: enterMathText
      },
      exit: {
        mathFlow: exitMathFlow,
        mathFlowFence: exitMathFlowFence,
        mathFlowFenceMeta: exitMathFlowMeta,
        mathFlowValue: exitMathData,
        mathText: exitMathText,
        mathTextData: exitMathData
      }
    };
    function enterMathFlow(token) {
      const code4 = {
        type: "element",
        tagName: "code",
        properties: { className: ["language-math", "math-display"] },
        children: []
      };
      this.enter(
        {
          type: "math",
          meta: null,
          value: "",
          data: { hName: "pre", hChildren: [code4] }
        },
        token
      );
    }
    function enterMathFlowMeta() {
      this.buffer();
    }
    function exitMathFlowMeta() {
      const data = this.resume();
      const node2 = this.stack[this.stack.length - 1];
      ok(node2.type === "math");
      node2.meta = data;
    }
    function exitMathFlowFence() {
      if (this.data.mathFlowInside) return;
      this.buffer();
      this.data.mathFlowInside = true;
    }
    function exitMathFlow(token) {
      const data = this.resume().replace(/^(\r?\n|\r)|(\r?\n|\r)$/g, "");
      const node2 = this.stack[this.stack.length - 1];
      ok(node2.type === "math");
      this.exit(token);
      node2.value = data;
      const code4 = (
        /** @type {HastElement} */
        node2.data.hChildren[0]
      );
      ok(code4.type === "element");
      ok(code4.tagName === "code");
      code4.children.push({ type: "text", value: data });
      this.data.mathFlowInside = void 0;
    }
    function enterMathText(token) {
      this.enter(
        {
          type: "inlineMath",
          value: "",
          data: {
            hName: "code",
            hProperties: { className: ["language-math", "math-inline"] },
            hChildren: []
          }
        },
        token
      );
      this.buffer();
    }
    function exitMathText(token) {
      const data = this.resume();
      const node2 = this.stack[this.stack.length - 1];
      ok(node2.type === "inlineMath");
      this.exit(token);
      node2.value = data;
      const children2 = (
        /** @type {Array<HastElementContent>} */
        // @ts-expect-error: we defined it in `enterMathFlow`.
        node2.data.hChildren
      );
      children2.push({ type: "text", value: data });
    }
    function exitMathData(token) {
      this.config.enter.data.call(this, token);
      this.config.exit.data.call(this, token);
    }
  }
  function mathToMarkdown(options) {
    let single = (options || {}).singleDollarTextMath;
    if (single === null || single === void 0) {
      single = true;
    }
    inlineMath.peek = inlineMathPeek;
    return {
      unsafe: [
        { character: "\r", inConstruct: "mathFlowMeta" },
        { character: "\n", inConstruct: "mathFlowMeta" },
        {
          character: "$",
          after: single ? void 0 : "\\$",
          inConstruct: "phrasing"
        },
        { character: "$", inConstruct: "mathFlowMeta" },
        { atBreak: true, character: "$", after: "\\$" }
      ],
      handlers: { math: math2, inlineMath }
    };
    function math2(node2, _, state, info) {
      const raw2 = node2.value || "";
      const tracker = state.createTracker(info);
      const sequence = "$".repeat(Math.max(longestStreak(raw2, "$") + 1, 2));
      const exit3 = state.enter("mathFlow");
      let value = tracker.move(sequence);
      if (node2.meta) {
        const subexit = state.enter("mathFlowMeta");
        value += tracker.move(
          state.safe(node2.meta, {
            after: "\n",
            before: value,
            encode: ["$"],
            ...tracker.current()
          })
        );
        subexit();
      }
      value += tracker.move("\n");
      if (raw2) {
        value += tracker.move(raw2 + "\n");
      }
      value += tracker.move(sequence);
      exit3();
      return value;
    }
    function inlineMath(node2, _, state) {
      let value = node2.value || "";
      let size = 1;
      if (!single) size++;
      while (new RegExp("(^|[^$])" + "\\$".repeat(size) + "([^$]|$)").test(value)) {
        size++;
      }
      const sequence = "$".repeat(size);
      if (
        // Contains non-space.
        /[^ \r\n]/.test(value) && // Starts with space and ends with space.
        (/^[ \r\n]/.test(value) && /[ \r\n]$/.test(value) || // Starts or ends with dollar.
        /^\$|\$$/.test(value))
      ) {
        value = " " + value + " ";
      }
      let index2 = -1;
      while (++index2 < state.unsafe.length) {
        const pattern = state.unsafe[index2];
        if (!pattern.atBreak) continue;
        const expression = state.compilePattern(pattern);
        let match;
        while (match = expression.exec(value)) {
          let position3 = match.index;
          if (value.codePointAt(position3) === 10 && value.codePointAt(position3 - 1) === 13) {
            position3--;
          }
          value = value.slice(0, position3) + " " + value.slice(match.index + 1);
        }
      }
      return sequence + value + sequence;
    }
    function inlineMathPeek() {
      return "$";
    }
  }

  // node_modules/micromark-extension-math/lib/math-flow.js
  var mathFlow = {
    tokenize: tokenizeMathFenced,
    concrete: true,
    name: "mathFlow"
  };
  var nonLazyContinuation2 = {
    tokenize: tokenizeNonLazyContinuation2,
    partial: true
  };
  function tokenizeMathFenced(effects, ok3, nok) {
    const self2 = this;
    const tail = self2.events[self2.events.length - 1];
    const initialSize = tail && tail[1].type === "linePrefix" ? tail[2].sliceSerialize(tail[1], true).length : 0;
    let sizeOpen = 0;
    return start;
    function start(code4) {
      effects.enter("mathFlow");
      effects.enter("mathFlowFence");
      effects.enter("mathFlowFenceSequence");
      return sequenceOpen(code4);
    }
    function sequenceOpen(code4) {
      if (code4 === 36) {
        effects.consume(code4);
        sizeOpen++;
        return sequenceOpen;
      }
      if (sizeOpen < 2) {
        return nok(code4);
      }
      effects.exit("mathFlowFenceSequence");
      return factorySpace(effects, metaBefore, "whitespace")(code4);
    }
    function metaBefore(code4) {
      if (code4 === null || markdownLineEnding(code4)) {
        return metaAfter(code4);
      }
      effects.enter("mathFlowFenceMeta");
      effects.enter("chunkString", {
        contentType: "string"
      });
      return meta(code4);
    }
    function meta(code4) {
      if (code4 === null || markdownLineEnding(code4)) {
        effects.exit("chunkString");
        effects.exit("mathFlowFenceMeta");
        return metaAfter(code4);
      }
      if (code4 === 36) {
        return nok(code4);
      }
      effects.consume(code4);
      return meta;
    }
    function metaAfter(code4) {
      effects.exit("mathFlowFence");
      if (self2.interrupt) {
        return ok3(code4);
      }
      return effects.attempt(nonLazyContinuation2, beforeNonLazyContinuation, after)(code4);
    }
    function beforeNonLazyContinuation(code4) {
      return effects.attempt({
        tokenize: tokenizeClosingFence,
        partial: true
      }, after, contentStart)(code4);
    }
    function contentStart(code4) {
      return (initialSize ? factorySpace(effects, beforeContentChunk, "linePrefix", initialSize + 1) : beforeContentChunk)(code4);
    }
    function beforeContentChunk(code4) {
      if (code4 === null) {
        return after(code4);
      }
      if (markdownLineEnding(code4)) {
        return effects.attempt(nonLazyContinuation2, beforeNonLazyContinuation, after)(code4);
      }
      effects.enter("mathFlowValue");
      return contentChunk(code4);
    }
    function contentChunk(code4) {
      if (code4 === null || markdownLineEnding(code4)) {
        effects.exit("mathFlowValue");
        return beforeContentChunk(code4);
      }
      effects.consume(code4);
      return contentChunk;
    }
    function after(code4) {
      effects.exit("mathFlow");
      return ok3(code4);
    }
    function tokenizeClosingFence(effects2, ok4, nok2) {
      let size = 0;
      return factorySpace(effects2, beforeSequenceClose, "linePrefix", self2.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4);
      function beforeSequenceClose(code4) {
        effects2.enter("mathFlowFence");
        effects2.enter("mathFlowFenceSequence");
        return sequenceClose(code4);
      }
      function sequenceClose(code4) {
        if (code4 === 36) {
          size++;
          effects2.consume(code4);
          return sequenceClose;
        }
        if (size < sizeOpen) {
          return nok2(code4);
        }
        effects2.exit("mathFlowFenceSequence");
        return factorySpace(effects2, afterSequenceClose, "whitespace")(code4);
      }
      function afterSequenceClose(code4) {
        if (code4 === null || markdownLineEnding(code4)) {
          effects2.exit("mathFlowFence");
          return ok4(code4);
        }
        return nok2(code4);
      }
    }
  }
  function tokenizeNonLazyContinuation2(effects, ok3, nok) {
    const self2 = this;
    return start;
    function start(code4) {
      if (code4 === null) {
        return ok3(code4);
      }
      effects.enter("lineEnding");
      effects.consume(code4);
      effects.exit("lineEnding");
      return lineStart;
    }
    function lineStart(code4) {
      return self2.parser.lazy[self2.now().line] ? nok(code4) : ok3(code4);
    }
  }

  // node_modules/micromark-extension-math/lib/math-text.js
  function mathText(options) {
    const options_ = options || {};
    let single = options_.singleDollarTextMath;
    if (single === null || single === void 0) {
      single = true;
    }
    return {
      tokenize: tokenizeMathText,
      resolve: resolveMathText,
      previous: previous3,
      name: "mathText"
    };
    function tokenizeMathText(effects, ok3, nok) {
      const self2 = this;
      let sizeOpen = 0;
      let size;
      let token;
      return start;
      function start(code4) {
        effects.enter("mathText");
        effects.enter("mathTextSequence");
        return sequenceOpen(code4);
      }
      function sequenceOpen(code4) {
        if (code4 === 36) {
          effects.consume(code4);
          sizeOpen++;
          return sequenceOpen;
        }
        if (sizeOpen < 2 && !single) {
          return nok(code4);
        }
        effects.exit("mathTextSequence");
        return between(code4);
      }
      function between(code4) {
        if (code4 === null) {
          return nok(code4);
        }
        if (code4 === 36) {
          token = effects.enter("mathTextSequence");
          size = 0;
          return sequenceClose(code4);
        }
        if (code4 === 32) {
          effects.enter("space");
          effects.consume(code4);
          effects.exit("space");
          return between;
        }
        if (markdownLineEnding(code4)) {
          effects.enter("lineEnding");
          effects.consume(code4);
          effects.exit("lineEnding");
          return between;
        }
        effects.enter("mathTextData");
        return data(code4);
      }
      function data(code4) {
        if (code4 === null || code4 === 32 || code4 === 36 || markdownLineEnding(code4)) {
          effects.exit("mathTextData");
          return between(code4);
        }
        effects.consume(code4);
        return data;
      }
      function sequenceClose(code4) {
        if (code4 === 36) {
          effects.consume(code4);
          size++;
          return sequenceClose;
        }
        if (size === sizeOpen) {
          effects.exit("mathTextSequence");
          effects.exit("mathText");
          return ok3(code4);
        }
        token.type = "mathTextData";
        return data(code4);
      }
    }
  }
  function resolveMathText(events) {
    let tailExitIndex = events.length - 4;
    let headEnterIndex = 3;
    let index2;
    let enter;
    if ((events[headEnterIndex][1].type === "lineEnding" || events[headEnterIndex][1].type === "space") && (events[tailExitIndex][1].type === "lineEnding" || events[tailExitIndex][1].type === "space")) {
      index2 = headEnterIndex;
      while (++index2 < tailExitIndex) {
        if (events[index2][1].type === "mathTextData") {
          events[tailExitIndex][1].type = "mathTextPadding";
          events[headEnterIndex][1].type = "mathTextPadding";
          headEnterIndex += 2;
          tailExitIndex -= 2;
          break;
        }
      }
    }
    index2 = headEnterIndex - 1;
    tailExitIndex++;
    while (++index2 <= tailExitIndex) {
      if (enter === void 0) {
        if (index2 !== tailExitIndex && events[index2][1].type !== "lineEnding") {
          enter = index2;
        }
      } else if (index2 === tailExitIndex || events[index2][1].type === "lineEnding") {
        events[enter][1].type = "mathTextData";
        if (index2 !== enter + 2) {
          events[enter][1].end = events[index2 - 1][1].end;
          events.splice(enter + 2, index2 - enter - 2);
          tailExitIndex -= index2 - enter - 2;
          index2 = enter + 2;
        }
        enter = void 0;
      }
    }
    return events;
  }
  function previous3(code4) {
    return code4 !== 36 || this.events[this.events.length - 1][1].type === "characterEscape";
  }

  // node_modules/micromark-extension-math/lib/syntax.js
  function math(options) {
    return {
      flow: {
        [36]: mathFlow
      },
      text: {
        [36]: mathText(options)
      }
    };
  }

  // node_modules/remark-math/lib/index.js
  var emptyOptions3 = {};
  function remarkMath(options) {
    const self2 = (
      /** @type {Processor} */
      this
    );
    const settings = options || emptyOptions3;
    const data = self2.data();
    const micromarkExtensions = data.micromarkExtensions || (data.micromarkExtensions = []);
    const fromMarkdownExtensions = data.fromMarkdownExtensions || (data.fromMarkdownExtensions = []);
    const toMarkdownExtensions = data.toMarkdownExtensions || (data.toMarkdownExtensions = []);
    micromarkExtensions.push(math(settings));
    fromMarkdownExtensions.push(mathFromMarkdown());
    toMarkdownExtensions.push(mathToMarkdown(settings));
  }

  // node_modules/mdast-util-to-hast/lib/handlers/blockquote.js
  function blockquote2(state, node2) {
    const result = {
      type: "element",
      tagName: "blockquote",
      properties: {},
      children: state.wrap(state.all(node2), true)
    };
    state.patch(node2, result);
    return state.applyData(node2, result);
  }

  // node_modules/mdast-util-to-hast/lib/handlers/break.js
  function hardBreak2(state, node2) {
    const result = { type: "element", tagName: "br", properties: {}, children: [] };
    state.patch(node2, result);
    return [state.applyData(node2, result), { type: "text", value: "\n" }];
  }

  // node_modules/mdast-util-to-hast/lib/handlers/code.js
  function code3(state, node2) {
    const value = node2.value ? node2.value + "\n" : "";
    const properties2 = {};
    const language = node2.lang ? node2.lang.split(/\s+/) : [];
    if (language.length > 0) {
      properties2.className = ["language-" + language[0]];
    }
    let result = {
      type: "element",
      tagName: "code",
      properties: properties2,
      children: [{ type: "text", value }]
    };
    if (node2.meta) {
      result.data = { meta: node2.meta };
    }
    state.patch(node2, result);
    result = state.applyData(node2, result);
    result = { type: "element", tagName: "pre", properties: {}, children: [result] };
    state.patch(node2, result);
    return result;
  }

  // node_modules/mdast-util-to-hast/lib/handlers/delete.js
  function strikethrough(state, node2) {
    const result = {
      type: "element",
      tagName: "del",
      properties: {},
      children: state.all(node2)
    };
    state.patch(node2, result);
    return state.applyData(node2, result);
  }

  // node_modules/mdast-util-to-hast/lib/handlers/emphasis.js
  function emphasis2(state, node2) {
    const result = {
      type: "element",
      tagName: "em",
      properties: {},
      children: state.all(node2)
    };
    state.patch(node2, result);
    return state.applyData(node2, result);
  }

  // node_modules/mdast-util-to-hast/lib/handlers/footnote-reference.js
  function footnoteReference2(state, node2) {
    const clobberPrefix = typeof state.options.clobberPrefix === "string" ? state.options.clobberPrefix : "user-content-";
    const id = String(node2.identifier).toUpperCase();
    const safeId = normalizeUri(id.toLowerCase());
    const index2 = state.footnoteOrder.indexOf(id);
    let counter;
    let reuseCounter = state.footnoteCounts.get(id);
    if (reuseCounter === void 0) {
      reuseCounter = 0;
      state.footnoteOrder.push(id);
      counter = state.footnoteOrder.length;
    } else {
      counter = index2 + 1;
    }
    reuseCounter += 1;
    state.footnoteCounts.set(id, reuseCounter);
    const link3 = {
      type: "element",
      tagName: "a",
      properties: {
        href: "#" + clobberPrefix + "fn-" + safeId,
        id: clobberPrefix + "fnref-" + safeId + (reuseCounter > 1 ? "-" + reuseCounter : ""),
        dataFootnoteRef: true,
        ariaDescribedBy: ["footnote-label"]
      },
      children: [{ type: "text", value: String(counter) }]
    };
    state.patch(node2, link3);
    const sup = {
      type: "element",
      tagName: "sup",
      properties: {},
      children: [link3]
    };
    state.patch(node2, sup);
    return state.applyData(node2, sup);
  }

  // node_modules/mdast-util-to-hast/lib/handlers/heading.js
  function heading2(state, node2) {
    const result = {
      type: "element",
      tagName: "h" + node2.depth,
      properties: {},
      children: state.all(node2)
    };
    state.patch(node2, result);
    return state.applyData(node2, result);
  }

  // node_modules/mdast-util-to-hast/lib/handlers/html.js
  function html2(state, node2) {
    if (state.options.allowDangerousHtml) {
      const result = { type: "raw", value: node2.value };
      state.patch(node2, result);
      return state.applyData(node2, result);
    }
    return void 0;
  }

  // node_modules/mdast-util-to-hast/lib/revert.js
  function revert(state, node2) {
    const subtype = node2.referenceType;
    let suffix = "]";
    if (subtype === "collapsed") {
      suffix += "[]";
    } else if (subtype === "full") {
      suffix += "[" + (node2.label || node2.identifier) + "]";
    }
    if (node2.type === "imageReference") {
      return [{ type: "text", value: "![" + node2.alt + suffix }];
    }
    const contents = state.all(node2);
    const head2 = contents[0];
    if (head2 && head2.type === "text") {
      head2.value = "[" + head2.value;
    } else {
      contents.unshift({ type: "text", value: "[" });
    }
    const tail = contents[contents.length - 1];
    if (tail && tail.type === "text") {
      tail.value += suffix;
    } else {
      contents.push({ type: "text", value: suffix });
    }
    return contents;
  }

  // node_modules/mdast-util-to-hast/lib/handlers/image-reference.js
  function imageReference2(state, node2) {
    const id = String(node2.identifier).toUpperCase();
    const definition3 = state.definitionById.get(id);
    if (!definition3) {
      return revert(state, node2);
    }
    const properties2 = { src: normalizeUri(definition3.url || ""), alt: node2.alt };
    if (definition3.title !== null && definition3.title !== void 0) {
      properties2.title = definition3.title;
    }
    const result = { type: "element", tagName: "img", properties: properties2, children: [] };
    state.patch(node2, result);
    return state.applyData(node2, result);
  }

  // node_modules/mdast-util-to-hast/lib/handlers/image.js
  function image2(state, node2) {
    const properties2 = { src: normalizeUri(node2.url) };
    if (node2.alt !== null && node2.alt !== void 0) {
      properties2.alt = node2.alt;
    }
    if (node2.title !== null && node2.title !== void 0) {
      properties2.title = node2.title;
    }
    const result = { type: "element", tagName: "img", properties: properties2, children: [] };
    state.patch(node2, result);
    return state.applyData(node2, result);
  }

  // node_modules/mdast-util-to-hast/lib/handlers/inline-code.js
  function inlineCode2(state, node2) {
    const text9 = { type: "text", value: node2.value.replace(/\r?\n|\r/g, " ") };
    state.patch(node2, text9);
    const result = {
      type: "element",
      tagName: "code",
      properties: {},
      children: [text9]
    };
    state.patch(node2, result);
    return state.applyData(node2, result);
  }

  // node_modules/mdast-util-to-hast/lib/handlers/link-reference.js
  function linkReference2(state, node2) {
    const id = String(node2.identifier).toUpperCase();
    const definition3 = state.definitionById.get(id);
    if (!definition3) {
      return revert(state, node2);
    }
    const properties2 = { href: normalizeUri(definition3.url || "") };
    if (definition3.title !== null && definition3.title !== void 0) {
      properties2.title = definition3.title;
    }
    const result = {
      type: "element",
      tagName: "a",
      properties: properties2,
      children: state.all(node2)
    };
    state.patch(node2, result);
    return state.applyData(node2, result);
  }

  // node_modules/mdast-util-to-hast/lib/handlers/link.js
  function link2(state, node2) {
    const properties2 = { href: normalizeUri(node2.url) };
    if (node2.title !== null && node2.title !== void 0) {
      properties2.title = node2.title;
    }
    const result = {
      type: "element",
      tagName: "a",
      properties: properties2,
      children: state.all(node2)
    };
    state.patch(node2, result);
    return state.applyData(node2, result);
  }

  // node_modules/mdast-util-to-hast/lib/handlers/list-item.js
  function listItem2(state, node2, parent) {
    const results = state.all(node2);
    const loose = parent ? listLoose(parent) : listItemLoose(node2);
    const properties2 = {};
    const children2 = [];
    if (typeof node2.checked === "boolean") {
      const head2 = results[0];
      let paragraph3;
      if (head2 && head2.type === "element" && head2.tagName === "p") {
        paragraph3 = head2;
      } else {
        paragraph3 = { type: "element", tagName: "p", properties: {}, children: [] };
        results.unshift(paragraph3);
      }
      if (paragraph3.children.length > 0) {
        paragraph3.children.unshift({ type: "text", value: " " });
      }
      paragraph3.children.unshift({
        type: "element",
        tagName: "input",
        properties: { type: "checkbox", checked: node2.checked, disabled: true },
        children: []
      });
      properties2.className = ["task-list-item"];
    }
    let index2 = -1;
    while (++index2 < results.length) {
      const child = results[index2];
      if (loose || index2 !== 0 || child.type !== "element" || child.tagName !== "p") {
        children2.push({ type: "text", value: "\n" });
      }
      if (child.type === "element" && child.tagName === "p" && !loose) {
        children2.push(...child.children);
      } else {
        children2.push(child);
      }
    }
    const tail = results[results.length - 1];
    if (tail && (loose || tail.type !== "element" || tail.tagName !== "p")) {
      children2.push({ type: "text", value: "\n" });
    }
    const result = { type: "element", tagName: "li", properties: properties2, children: children2 };
    state.patch(node2, result);
    return state.applyData(node2, result);
  }
  function listLoose(node2) {
    let loose = false;
    if (node2.type === "list") {
      loose = node2.spread || false;
      const children2 = node2.children;
      let index2 = -1;
      while (!loose && ++index2 < children2.length) {
        loose = listItemLoose(children2[index2]);
      }
    }
    return loose;
  }
  function listItemLoose(node2) {
    const spread = node2.spread;
    return spread === null || spread === void 0 ? node2.children.length > 1 : spread;
  }

  // node_modules/mdast-util-to-hast/lib/handlers/list.js
  function list3(state, node2) {
    const properties2 = {};
    const results = state.all(node2);
    let index2 = -1;
    if (typeof node2.start === "number" && node2.start !== 1) {
      properties2.start = node2.start;
    }
    while (++index2 < results.length) {
      const child = results[index2];
      if (child.type === "element" && child.tagName === "li" && child.properties && Array.isArray(child.properties.className) && child.properties.className.includes("task-list-item")) {
        properties2.className = ["contains-task-list"];
        break;
      }
    }
    const result = {
      type: "element",
      tagName: node2.ordered ? "ol" : "ul",
      properties: properties2,
      children: state.wrap(results, true)
    };
    state.patch(node2, result);
    return state.applyData(node2, result);
  }

  // node_modules/mdast-util-to-hast/lib/handlers/paragraph.js
  function paragraph2(state, node2) {
    const result = {
      type: "element",
      tagName: "p",
      properties: {},
      children: state.all(node2)
    };
    state.patch(node2, result);
    return state.applyData(node2, result);
  }

  // node_modules/mdast-util-to-hast/lib/handlers/root.js
  function root2(state, node2) {
    const result = { type: "root", children: state.wrap(state.all(node2)) };
    state.patch(node2, result);
    return state.applyData(node2, result);
  }

  // node_modules/mdast-util-to-hast/lib/handlers/strong.js
  function strong2(state, node2) {
    const result = {
      type: "element",
      tagName: "strong",
      properties: {},
      children: state.all(node2)
    };
    state.patch(node2, result);
    return state.applyData(node2, result);
  }

  // node_modules/unist-util-position/lib/index.js
  var pointEnd = point3("end");
  var pointStart = point3("start");
  function point3(type) {
    return point4;
    function point4(node2) {
      const point5 = node2 && node2.position && node2.position[type] || {};
      if (typeof point5.line === "number" && point5.line > 0 && typeof point5.column === "number" && point5.column > 0) {
        return {
          line: point5.line,
          column: point5.column,
          offset: typeof point5.offset === "number" && point5.offset > -1 ? point5.offset : void 0
        };
      }
    }
  }
  function position2(node2) {
    const start = pointStart(node2);
    const end = pointEnd(node2);
    if (start && end) {
      return { start, end };
    }
  }

  // node_modules/mdast-util-to-hast/lib/handlers/table.js
  function table(state, node2) {
    const rows = state.all(node2);
    const firstRow = rows.shift();
    const tableContent = [];
    if (firstRow) {
      const head2 = {
        type: "element",
        tagName: "thead",
        properties: {},
        children: state.wrap([firstRow], true)
      };
      state.patch(node2.children[0], head2);
      tableContent.push(head2);
    }
    if (rows.length > 0) {
      const body3 = {
        type: "element",
        tagName: "tbody",
        properties: {},
        children: state.wrap(rows, true)
      };
      const start = pointStart(node2.children[1]);
      const end = pointEnd(node2.children[node2.children.length - 1]);
      if (start && end) body3.position = { start, end };
      tableContent.push(body3);
    }
    const result = {
      type: "element",
      tagName: "table",
      properties: {},
      children: state.wrap(tableContent, true)
    };
    state.patch(node2, result);
    return state.applyData(node2, result);
  }

  // node_modules/mdast-util-to-hast/lib/handlers/table-row.js
  function tableRow(state, node2, parent) {
    const siblings2 = parent ? parent.children : void 0;
    const rowIndex = siblings2 ? siblings2.indexOf(node2) : 1;
    const tagName = rowIndex === 0 ? "th" : "td";
    const align = parent && parent.type === "table" ? parent.align : void 0;
    const length = align ? align.length : node2.children.length;
    let cellIndex = -1;
    const cells2 = [];
    while (++cellIndex < length) {
      const cell2 = node2.children[cellIndex];
      const properties2 = {};
      const alignValue = align ? align[cellIndex] : void 0;
      if (alignValue) {
        properties2.align = alignValue;
      }
      let result2 = { type: "element", tagName, properties: properties2, children: [] };
      if (cell2) {
        result2.children = state.all(cell2);
        state.patch(cell2, result2);
        result2 = state.applyData(cell2, result2);
      }
      cells2.push(result2);
    }
    const result = {
      type: "element",
      tagName: "tr",
      properties: {},
      children: state.wrap(cells2, true)
    };
    state.patch(node2, result);
    return state.applyData(node2, result);
  }

  // node_modules/mdast-util-to-hast/lib/handlers/table-cell.js
  function tableCell(state, node2) {
    const result = {
      type: "element",
      tagName: "td",
      // Assume body cell.
      properties: {},
      children: state.all(node2)
    };
    state.patch(node2, result);
    return state.applyData(node2, result);
  }

  // node_modules/trim-lines/index.js
  var tab = 9;
  var space = 32;
  function trimLines(value) {
    const source = String(value);
    const search3 = /\r?\n|\r/g;
    let match = search3.exec(source);
    let last = 0;
    const lines = [];
    while (match) {
      lines.push(
        trimLine(source.slice(last, match.index), last > 0, true),
        match[0]
      );
      last = match.index + match[0].length;
      match = search3.exec(source);
    }
    lines.push(trimLine(source.slice(last), last > 0, false));
    return lines.join("");
  }
  function trimLine(value, start, end) {
    let startIndex = 0;
    let endIndex = value.length;
    if (start) {
      let code4 = value.codePointAt(startIndex);
      while (code4 === tab || code4 === space) {
        startIndex++;
        code4 = value.codePointAt(startIndex);
      }
    }
    if (end) {
      let code4 = value.codePointAt(endIndex - 1);
      while (code4 === tab || code4 === space) {
        endIndex--;
        code4 = value.codePointAt(endIndex - 1);
      }
    }
    return endIndex > startIndex ? value.slice(startIndex, endIndex) : "";
  }

  // node_modules/mdast-util-to-hast/lib/handlers/text.js
  function text5(state, node2) {
    const result = { type: "text", value: trimLines(String(node2.value)) };
    state.patch(node2, result);
    return state.applyData(node2, result);
  }

  // node_modules/mdast-util-to-hast/lib/handlers/thematic-break.js
  function thematicBreak3(state, node2) {
    const result = {
      type: "element",
      tagName: "hr",
      properties: {},
      children: []
    };
    state.patch(node2, result);
    return state.applyData(node2, result);
  }

  // node_modules/mdast-util-to-hast/lib/handlers/index.js
  var handlers = {
    blockquote: blockquote2,
    break: hardBreak2,
    code: code3,
    delete: strikethrough,
    emphasis: emphasis2,
    footnoteReference: footnoteReference2,
    heading: heading2,
    html: html2,
    imageReference: imageReference2,
    image: image2,
    inlineCode: inlineCode2,
    linkReference: linkReference2,
    link: link2,
    listItem: listItem2,
    list: list3,
    paragraph: paragraph2,
    // @ts-expect-error: root is different, but hard to type.
    root: root2,
    strong: strong2,
    table,
    tableCell,
    tableRow,
    text: text5,
    thematicBreak: thematicBreak3,
    toml: ignore,
    yaml: ignore,
    definition: ignore,
    footnoteDefinition: ignore
  };
  function ignore() {
    return void 0;
  }

  // node_modules/@ungap/structured-clone/esm/types.js
  var VOID = -1;
  var PRIMITIVE = 0;
  var ARRAY = 1;
  var OBJECT = 2;
  var DATE = 3;
  var REGEXP = 4;
  var MAP = 5;
  var SET = 6;
  var ERROR = 7;
  var BIGINT = 8;

  // node_modules/@ungap/structured-clone/esm/deserialize.js
  var env = typeof self === "object" ? self : globalThis;
  var deserializer = ($, _) => {
    const as = (out, index2) => {
      $.set(index2, out);
      return out;
    };
    const unpair = (index2) => {
      if ($.has(index2))
        return $.get(index2);
      const [type, value] = _[index2];
      switch (type) {
        case PRIMITIVE:
        case VOID:
          return as(value, index2);
        case ARRAY: {
          const arr = as([], index2);
          for (const index3 of value)
            arr.push(unpair(index3));
          return arr;
        }
        case OBJECT: {
          const object = as({}, index2);
          for (const [key2, index3] of value)
            object[unpair(key2)] = unpair(index3);
          return object;
        }
        case DATE:
          return as(new Date(value), index2);
        case REGEXP: {
          const { source, flags } = value;
          return as(new RegExp(source, flags), index2);
        }
        case MAP: {
          const map3 = as(/* @__PURE__ */ new Map(), index2);
          for (const [key2, index3] of value)
            map3.set(unpair(key2), unpair(index3));
          return map3;
        }
        case SET: {
          const set = as(/* @__PURE__ */ new Set(), index2);
          for (const index3 of value)
            set.add(unpair(index3));
          return set;
        }
        case ERROR: {
          const { name, message } = value;
          return as(new env[name](message), index2);
        }
        case BIGINT:
          return as(BigInt(value), index2);
        case "BigInt":
          return as(Object(BigInt(value)), index2);
        case "ArrayBuffer":
          return as(new Uint8Array(value).buffer, value);
        case "DataView": {
          const { buffer } = new Uint8Array(value);
          return as(new DataView(buffer), value);
        }
      }
      return as(new env[type](value), index2);
    };
    return unpair;
  };
  var deserialize = (serialized) => deserializer(/* @__PURE__ */ new Map(), serialized)(0);

  // node_modules/@ungap/structured-clone/esm/serialize.js
  var EMPTY = "";
  var { toString: toString2 } = {};
  var { keys } = Object;
  var typeOf = (value) => {
    const type = typeof value;
    if (type !== "object" || !value)
      return [PRIMITIVE, type];
    const asString = toString2.call(value).slice(8, -1);
    switch (asString) {
      case "Array":
        return [ARRAY, EMPTY];
      case "Object":
        return [OBJECT, EMPTY];
      case "Date":
        return [DATE, EMPTY];
      case "RegExp":
        return [REGEXP, EMPTY];
      case "Map":
        return [MAP, EMPTY];
      case "Set":
        return [SET, EMPTY];
      case "DataView":
        return [ARRAY, asString];
    }
    if (asString.includes("Array"))
      return [ARRAY, asString];
    if (asString.includes("Error"))
      return [ERROR, asString];
    return [OBJECT, asString];
  };
  var shouldSkip = ([TYPE, type]) => TYPE === PRIMITIVE && (type === "function" || type === "symbol");
  var serializer = (strict, json, $, _) => {
    const as = (out, value) => {
      const index2 = _.push(out) - 1;
      $.set(value, index2);
      return index2;
    };
    const pair = (value) => {
      if ($.has(value))
        return $.get(value);
      let [TYPE, type] = typeOf(value);
      switch (TYPE) {
        case PRIMITIVE: {
          let entry = value;
          switch (type) {
            case "bigint":
              TYPE = BIGINT;
              entry = value.toString();
              break;
            case "function":
            case "symbol":
              if (strict)
                throw new TypeError("unable to serialize " + type);
              entry = null;
              break;
            case "undefined":
              return as([VOID], value);
          }
          return as([TYPE, entry], value);
        }
        case ARRAY: {
          if (type) {
            let spread = value;
            if (type === "DataView") {
              spread = new Uint8Array(value.buffer);
            } else if (type === "ArrayBuffer") {
              spread = new Uint8Array(value);
            }
            return as([type, [...spread]], value);
          }
          const arr = [];
          const index2 = as([TYPE, arr], value);
          for (const entry of value)
            arr.push(pair(entry));
          return index2;
        }
        case OBJECT: {
          if (type) {
            switch (type) {
              case "BigInt":
                return as([type, value.toString()], value);
              case "Boolean":
              case "Number":
              case "String":
                return as([type, value.valueOf()], value);
            }
          }
          if (json && "toJSON" in value)
            return pair(value.toJSON());
          const entries = [];
          const index2 = as([TYPE, entries], value);
          for (const key2 of keys(value)) {
            if (strict || !shouldSkip(typeOf(value[key2])))
              entries.push([pair(key2), pair(value[key2])]);
          }
          return index2;
        }
        case DATE:
          return as([TYPE, value.toISOString()], value);
        case REGEXP: {
          const { source, flags } = value;
          return as([TYPE, { source, flags }], value);
        }
        case MAP: {
          const entries = [];
          const index2 = as([TYPE, entries], value);
          for (const [key2, entry] of value) {
            if (strict || !(shouldSkip(typeOf(key2)) || shouldSkip(typeOf(entry))))
              entries.push([pair(key2), pair(entry)]);
          }
          return index2;
        }
        case SET: {
          const entries = [];
          const index2 = as([TYPE, entries], value);
          for (const entry of value) {
            if (strict || !shouldSkip(typeOf(entry)))
              entries.push(pair(entry));
          }
          return index2;
        }
      }
      const { message } = value;
      return as([TYPE, { name: type, message }], value);
    };
    return pair;
  };
  var serialize2 = (value, { json, lossy } = {}) => {
    const _ = [];
    return serializer(!(json || lossy), !!json, /* @__PURE__ */ new Map(), _)(value), _;
  };

  // node_modules/@ungap/structured-clone/esm/index.js
  var esm_default = typeof structuredClone === "function" ? (
    /* c8 ignore start */
    (any, options) => options && ("json" in options || "lossy" in options) ? deserialize(serialize2(any, options)) : structuredClone(any)
  ) : (any, options) => deserialize(serialize2(any, options));

  // node_modules/mdast-util-to-hast/lib/footer.js
  function defaultFootnoteBackContent(_, rereferenceIndex) {
    const result = [{ type: "text", value: "\u21A9" }];
    if (rereferenceIndex > 1) {
      result.push({
        type: "element",
        tagName: "sup",
        properties: {},
        children: [{ type: "text", value: String(rereferenceIndex) }]
      });
    }
    return result;
  }
  function defaultFootnoteBackLabel(referenceIndex, rereferenceIndex) {
    return "Back to reference " + (referenceIndex + 1) + (rereferenceIndex > 1 ? "-" + rereferenceIndex : "");
  }
  function footer(state) {
    const clobberPrefix = typeof state.options.clobberPrefix === "string" ? state.options.clobberPrefix : "user-content-";
    const footnoteBackContent = state.options.footnoteBackContent || defaultFootnoteBackContent;
    const footnoteBackLabel = state.options.footnoteBackLabel || defaultFootnoteBackLabel;
    const footnoteLabel = state.options.footnoteLabel || "Footnotes";
    const footnoteLabelTagName = state.options.footnoteLabelTagName || "h2";
    const footnoteLabelProperties = state.options.footnoteLabelProperties || {
      className: ["sr-only"]
    };
    const listItems = [];
    let referenceIndex = -1;
    while (++referenceIndex < state.footnoteOrder.length) {
      const definition3 = state.footnoteById.get(
        state.footnoteOrder[referenceIndex]
      );
      if (!definition3) {
        continue;
      }
      const content3 = state.all(definition3);
      const id = String(definition3.identifier).toUpperCase();
      const safeId = normalizeUri(id.toLowerCase());
      let rereferenceIndex = 0;
      const backReferences = [];
      const counts = state.footnoteCounts.get(id);
      while (counts !== void 0 && ++rereferenceIndex <= counts) {
        if (backReferences.length > 0) {
          backReferences.push({ type: "text", value: " " });
        }
        let children2 = typeof footnoteBackContent === "string" ? footnoteBackContent : footnoteBackContent(referenceIndex, rereferenceIndex);
        if (typeof children2 === "string") {
          children2 = { type: "text", value: children2 };
        }
        backReferences.push({
          type: "element",
          tagName: "a",
          properties: {
            href: "#" + clobberPrefix + "fnref-" + safeId + (rereferenceIndex > 1 ? "-" + rereferenceIndex : ""),
            dataFootnoteBackref: "",
            ariaLabel: typeof footnoteBackLabel === "string" ? footnoteBackLabel : footnoteBackLabel(referenceIndex, rereferenceIndex),
            className: ["data-footnote-backref"]
          },
          children: Array.isArray(children2) ? children2 : [children2]
        });
      }
      const tail = content3[content3.length - 1];
      if (tail && tail.type === "element" && tail.tagName === "p") {
        const tailTail = tail.children[tail.children.length - 1];
        if (tailTail && tailTail.type === "text") {
          tailTail.value += " ";
        } else {
          tail.children.push({ type: "text", value: " " });
        }
        tail.children.push(...backReferences);
      } else {
        content3.push(...backReferences);
      }
      const listItem3 = {
        type: "element",
        tagName: "li",
        properties: { id: clobberPrefix + "fn-" + safeId },
        children: state.wrap(content3, true)
      };
      state.patch(definition3, listItem3);
      listItems.push(listItem3);
    }
    if (listItems.length === 0) {
      return;
    }
    return {
      type: "element",
      tagName: "section",
      properties: { dataFootnotes: true, className: ["footnotes"] },
      children: [
        {
          type: "element",
          tagName: footnoteLabelTagName,
          properties: {
            ...esm_default(footnoteLabelProperties),
            id: "footnote-label"
          },
          children: [{ type: "text", value: footnoteLabel }]
        },
        { type: "text", value: "\n" },
        {
          type: "element",
          tagName: "ol",
          properties: {},
          children: state.wrap(listItems, true)
        },
        { type: "text", value: "\n" }
      ]
    };
  }

  // node_modules/mdast-util-to-hast/lib/state.js
  var own4 = {}.hasOwnProperty;
  var emptyOptions4 = {};
  function createState(tree, options) {
    const settings = options || emptyOptions4;
    const definitionById = /* @__PURE__ */ new Map();
    const footnoteById = /* @__PURE__ */ new Map();
    const footnoteCounts = /* @__PURE__ */ new Map();
    const handlers2 = { ...handlers, ...settings.handlers };
    const state = {
      all: all4,
      applyData,
      definitionById,
      footnoteById,
      footnoteCounts,
      footnoteOrder: [],
      handlers: handlers2,
      one: one4,
      options: settings,
      patch,
      wrap: wrap2
    };
    visit(tree, function(node2) {
      if (node2.type === "definition" || node2.type === "footnoteDefinition") {
        const map3 = node2.type === "definition" ? definitionById : footnoteById;
        const id = String(node2.identifier).toUpperCase();
        if (!map3.has(id)) {
          map3.set(id, node2);
        }
      }
    });
    return state;
    function one4(node2, parent) {
      const type = node2.type;
      const handle3 = state.handlers[type];
      if (own4.call(state.handlers, type) && handle3) {
        return handle3(state, node2, parent);
      }
      if (state.options.passThrough && state.options.passThrough.includes(type)) {
        if ("children" in node2) {
          const { children: children2, ...shallow } = node2;
          const result = esm_default(shallow);
          result.children = state.all(node2);
          return result;
        }
        return esm_default(node2);
      }
      const unknown2 = state.options.unknownHandler || defaultUnknownHandler;
      return unknown2(state, node2, parent);
    }
    function all4(parent) {
      const values = [];
      if ("children" in parent) {
        const nodes = parent.children;
        let index2 = -1;
        while (++index2 < nodes.length) {
          const result = state.one(nodes[index2], parent);
          if (result) {
            if (index2 && nodes[index2 - 1].type === "break") {
              if (!Array.isArray(result) && result.type === "text") {
                result.value = trimMarkdownSpaceStart(result.value);
              }
              if (!Array.isArray(result) && result.type === "element") {
                const head2 = result.children[0];
                if (head2 && head2.type === "text") {
                  head2.value = trimMarkdownSpaceStart(head2.value);
                }
              }
            }
            if (Array.isArray(result)) {
              values.push(...result);
            } else {
              values.push(result);
            }
          }
        }
      }
      return values;
    }
  }
  function patch(from, to) {
    if (from.position) to.position = position2(from);
  }
  function applyData(from, to) {
    let result = to;
    if (from && from.data) {
      const hName = from.data.hName;
      const hChildren = from.data.hChildren;
      const hProperties = from.data.hProperties;
      if (typeof hName === "string") {
        if (result.type === "element") {
          result.tagName = hName;
        } else {
          const children2 = "children" in result ? result.children : [result];
          result = { type: "element", tagName: hName, properties: {}, children: children2 };
        }
      }
      if (result.type === "element" && hProperties) {
        Object.assign(result.properties, esm_default(hProperties));
      }
      if ("children" in result && result.children && hChildren !== null && hChildren !== void 0) {
        result.children = hChildren;
      }
    }
    return result;
  }
  function defaultUnknownHandler(state, node2) {
    const data = node2.data || {};
    const result = "value" in node2 && !(own4.call(data, "hProperties") || own4.call(data, "hChildren")) ? { type: "text", value: node2.value } : {
      type: "element",
      tagName: "div",
      properties: {},
      children: state.all(node2)
    };
    state.patch(node2, result);
    return state.applyData(node2, result);
  }
  function wrap2(nodes, loose) {
    const result = [];
    let index2 = -1;
    if (loose) {
      result.push({ type: "text", value: "\n" });
    }
    while (++index2 < nodes.length) {
      if (index2) result.push({ type: "text", value: "\n" });
      result.push(nodes[index2]);
    }
    if (loose && nodes.length > 0) {
      result.push({ type: "text", value: "\n" });
    }
    return result;
  }
  function trimMarkdownSpaceStart(value) {
    let index2 = 0;
    let code4 = value.charCodeAt(index2);
    while (code4 === 9 || code4 === 32) {
      index2++;
      code4 = value.charCodeAt(index2);
    }
    return value.slice(index2);
  }

  // node_modules/mdast-util-to-hast/lib/index.js
  function toHast(tree, options) {
    const state = createState(tree, options);
    const node2 = state.one(tree, void 0);
    const foot = footer(state);
    const result = Array.isArray(node2) ? { type: "root", children: node2 } : node2 || { type: "root", children: [] };
    if (foot) {
      ok("children" in result);
      result.children.push({ type: "text", value: "\n" }, foot);
    }
    return result;
  }

  // node_modules/remark-rehype/lib/index.js
  function remarkRehype(destination, options) {
    if (destination && "run" in destination) {
      return async function(tree, file) {
        const hastTree = (
          /** @type {HastRoot} */
          toHast(tree, { file, ...options })
        );
        await destination.run(hastTree, file);
      };
    }
    return function(tree, file) {
      return (
        /** @type {HastRoot} */
        toHast(tree, { file, ...destination || options })
      );
    };
  }

  // node_modules/property-information/lib/util/schema.js
  var Schema = class {
    /**
     * @param {SchemaType['property']} property
     *   Property.
     * @param {SchemaType['normal']} normal
     *   Normal.
     * @param {Space | undefined} [space]
     *   Space.
     * @returns
     *   Schema.
     */
    constructor(property, normal, space2) {
      this.normal = normal;
      this.property = property;
      if (space2) {
        this.space = space2;
      }
    }
  };
  Schema.prototype.normal = {};
  Schema.prototype.property = {};
  Schema.prototype.space = void 0;

  // node_modules/property-information/lib/util/merge.js
  function merge(definitions, space2) {
    const property = {};
    const normal = {};
    for (const definition3 of definitions) {
      Object.assign(property, definition3.property);
      Object.assign(normal, definition3.normal);
    }
    return new Schema(property, normal, space2);
  }

  // node_modules/property-information/lib/normalize.js
  function normalize2(value) {
    return value.toLowerCase();
  }

  // node_modules/property-information/lib/util/info.js
  var Info = class {
    /**
     * @param {string} property
     *   Property.
     * @param {string} attribute
     *   Attribute.
     * @returns
     *   Info.
     */
    constructor(property, attribute) {
      this.attribute = attribute;
      this.property = property;
    }
  };
  Info.prototype.attribute = "";
  Info.prototype.booleanish = false;
  Info.prototype.boolean = false;
  Info.prototype.commaOrSpaceSeparated = false;
  Info.prototype.commaSeparated = false;
  Info.prototype.defined = false;
  Info.prototype.mustUseProperty = false;
  Info.prototype.number = false;
  Info.prototype.overloadedBoolean = false;
  Info.prototype.property = "";
  Info.prototype.spaceSeparated = false;
  Info.prototype.space = void 0;

  // node_modules/property-information/lib/util/types.js
  var types_exports = {};
  __export(types_exports, {
    boolean: () => boolean,
    booleanish: () => booleanish,
    commaOrSpaceSeparated: () => commaOrSpaceSeparated,
    commaSeparated: () => commaSeparated,
    number: () => number,
    overloadedBoolean: () => overloadedBoolean,
    spaceSeparated: () => spaceSeparated
  });
  var powers = 0;
  var boolean = increment();
  var booleanish = increment();
  var overloadedBoolean = increment();
  var number = increment();
  var spaceSeparated = increment();
  var commaSeparated = increment();
  var commaOrSpaceSeparated = increment();
  function increment() {
    return 2 ** ++powers;
  }

  // node_modules/property-information/lib/util/defined-info.js
  var checks = (
    /** @type {ReadonlyArray<keyof typeof types>} */
    Object.keys(types_exports)
  );
  var DefinedInfo = class extends Info {
    /**
     * @constructor
     * @param {string} property
     *   Property.
     * @param {string} attribute
     *   Attribute.
     * @param {number | null | undefined} [mask]
     *   Mask.
     * @param {Space | undefined} [space]
     *   Space.
     * @returns
     *   Info.
     */
    constructor(property, attribute, mask, space2) {
      let index2 = -1;
      super(property, attribute);
      mark(this, "space", space2);
      if (typeof mask === "number") {
        while (++index2 < checks.length) {
          const check = checks[index2];
          mark(this, checks[index2], (mask & types_exports[check]) === types_exports[check]);
        }
      }
    }
  };
  DefinedInfo.prototype.defined = true;
  function mark(values, key2, value) {
    if (value) {
      values[key2] = value;
    }
  }

  // node_modules/property-information/lib/util/create.js
  function create(definition3) {
    const properties2 = {};
    const normals = {};
    for (const [property, value] of Object.entries(definition3.properties)) {
      const info = new DefinedInfo(
        property,
        definition3.transform(definition3.attributes || {}, property),
        value,
        definition3.space
      );
      if (definition3.mustUseProperty && definition3.mustUseProperty.includes(property)) {
        info.mustUseProperty = true;
      }
      properties2[property] = info;
      normals[normalize2(property)] = property;
      normals[normalize2(info.attribute)] = property;
    }
    return new Schema(properties2, normals, definition3.space);
  }

  // node_modules/property-information/lib/aria.js
  var aria = create({
    properties: {
      ariaActiveDescendant: null,
      ariaAtomic: booleanish,
      ariaAutoComplete: null,
      ariaBusy: booleanish,
      ariaChecked: booleanish,
      ariaColCount: number,
      ariaColIndex: number,
      ariaColSpan: number,
      ariaControls: spaceSeparated,
      ariaCurrent: null,
      ariaDescribedBy: spaceSeparated,
      ariaDetails: null,
      ariaDisabled: booleanish,
      ariaDropEffect: spaceSeparated,
      ariaErrorMessage: null,
      ariaExpanded: booleanish,
      ariaFlowTo: spaceSeparated,
      ariaGrabbed: booleanish,
      ariaHasPopup: null,
      ariaHidden: booleanish,
      ariaInvalid: null,
      ariaKeyShortcuts: null,
      ariaLabel: null,
      ariaLabelledBy: spaceSeparated,
      ariaLevel: number,
      ariaLive: null,
      ariaModal: booleanish,
      ariaMultiLine: booleanish,
      ariaMultiSelectable: booleanish,
      ariaOrientation: null,
      ariaOwns: spaceSeparated,
      ariaPlaceholder: null,
      ariaPosInSet: number,
      ariaPressed: booleanish,
      ariaReadOnly: booleanish,
      ariaRelevant: null,
      ariaRequired: booleanish,
      ariaRoleDescription: spaceSeparated,
      ariaRowCount: number,
      ariaRowIndex: number,
      ariaRowSpan: number,
      ariaSelected: booleanish,
      ariaSetSize: number,
      ariaSort: null,
      ariaValueMax: number,
      ariaValueMin: number,
      ariaValueNow: number,
      ariaValueText: null,
      role: null
    },
    transform(_, property) {
      return property === "role" ? property : "aria-" + property.slice(4).toLowerCase();
    }
  });

  // node_modules/property-information/lib/util/case-sensitive-transform.js
  function caseSensitiveTransform(attributes, attribute) {
    return attribute in attributes ? attributes[attribute] : attribute;
  }

  // node_modules/property-information/lib/util/case-insensitive-transform.js
  function caseInsensitiveTransform(attributes, property) {
    return caseSensitiveTransform(attributes, property.toLowerCase());
  }

  // node_modules/property-information/lib/html.js
  var html3 = create({
    attributes: {
      acceptcharset: "accept-charset",
      classname: "class",
      htmlfor: "for",
      httpequiv: "http-equiv"
    },
    mustUseProperty: ["checked", "multiple", "muted", "selected"],
    properties: {
      // Standard Properties.
      abbr: null,
      accept: commaSeparated,
      acceptCharset: spaceSeparated,
      accessKey: spaceSeparated,
      action: null,
      allow: null,
      allowFullScreen: boolean,
      allowPaymentRequest: boolean,
      allowUserMedia: boolean,
      alt: null,
      as: null,
      async: boolean,
      autoCapitalize: null,
      autoComplete: spaceSeparated,
      autoFocus: boolean,
      autoPlay: boolean,
      blocking: spaceSeparated,
      capture: null,
      charSet: null,
      checked: boolean,
      cite: null,
      className: spaceSeparated,
      cols: number,
      colSpan: null,
      content: null,
      contentEditable: booleanish,
      controls: boolean,
      controlsList: spaceSeparated,
      coords: number | commaSeparated,
      crossOrigin: null,
      data: null,
      dateTime: null,
      decoding: null,
      default: boolean,
      defer: boolean,
      dir: null,
      dirName: null,
      disabled: boolean,
      download: overloadedBoolean,
      draggable: booleanish,
      encType: null,
      enterKeyHint: null,
      fetchPriority: null,
      form: null,
      formAction: null,
      formEncType: null,
      formMethod: null,
      formNoValidate: boolean,
      formTarget: null,
      headers: spaceSeparated,
      height: number,
      hidden: overloadedBoolean,
      high: number,
      href: null,
      hrefLang: null,
      htmlFor: spaceSeparated,
      httpEquiv: spaceSeparated,
      id: null,
      imageSizes: null,
      imageSrcSet: null,
      inert: boolean,
      inputMode: null,
      integrity: null,
      is: null,
      isMap: boolean,
      itemId: null,
      itemProp: spaceSeparated,
      itemRef: spaceSeparated,
      itemScope: boolean,
      itemType: spaceSeparated,
      kind: null,
      label: null,
      lang: null,
      language: null,
      list: null,
      loading: null,
      loop: boolean,
      low: number,
      manifest: null,
      max: null,
      maxLength: number,
      media: null,
      method: null,
      min: null,
      minLength: number,
      multiple: boolean,
      muted: boolean,
      name: null,
      nonce: null,
      noModule: boolean,
      noValidate: boolean,
      onAbort: null,
      onAfterPrint: null,
      onAuxClick: null,
      onBeforeMatch: null,
      onBeforePrint: null,
      onBeforeToggle: null,
      onBeforeUnload: null,
      onBlur: null,
      onCancel: null,
      onCanPlay: null,
      onCanPlayThrough: null,
      onChange: null,
      onClick: null,
      onClose: null,
      onContextLost: null,
      onContextMenu: null,
      onContextRestored: null,
      onCopy: null,
      onCueChange: null,
      onCut: null,
      onDblClick: null,
      onDrag: null,
      onDragEnd: null,
      onDragEnter: null,
      onDragExit: null,
      onDragLeave: null,
      onDragOver: null,
      onDragStart: null,
      onDrop: null,
      onDurationChange: null,
      onEmptied: null,
      onEnded: null,
      onError: null,
      onFocus: null,
      onFormData: null,
      onHashChange: null,
      onInput: null,
      onInvalid: null,
      onKeyDown: null,
      onKeyPress: null,
      onKeyUp: null,
      onLanguageChange: null,
      onLoad: null,
      onLoadedData: null,
      onLoadedMetadata: null,
      onLoadEnd: null,
      onLoadStart: null,
      onMessage: null,
      onMessageError: null,
      onMouseDown: null,
      onMouseEnter: null,
      onMouseLeave: null,
      onMouseMove: null,
      onMouseOut: null,
      onMouseOver: null,
      onMouseUp: null,
      onOffline: null,
      onOnline: null,
      onPageHide: null,
      onPageShow: null,
      onPaste: null,
      onPause: null,
      onPlay: null,
      onPlaying: null,
      onPopState: null,
      onProgress: null,
      onRateChange: null,
      onRejectionHandled: null,
      onReset: null,
      onResize: null,
      onScroll: null,
      onScrollEnd: null,
      onSecurityPolicyViolation: null,
      onSeeked: null,
      onSeeking: null,
      onSelect: null,
      onSlotChange: null,
      onStalled: null,
      onStorage: null,
      onSubmit: null,
      onSuspend: null,
      onTimeUpdate: null,
      onToggle: null,
      onUnhandledRejection: null,
      onUnload: null,
      onVolumeChange: null,
      onWaiting: null,
      onWheel: null,
      open: boolean,
      optimum: number,
      pattern: null,
      ping: spaceSeparated,
      placeholder: null,
      playsInline: boolean,
      popover: null,
      popoverTarget: null,
      popoverTargetAction: null,
      poster: null,
      preload: null,
      readOnly: boolean,
      referrerPolicy: null,
      rel: spaceSeparated,
      required: boolean,
      reversed: boolean,
      rows: number,
      rowSpan: number,
      sandbox: spaceSeparated,
      scope: null,
      scoped: boolean,
      seamless: boolean,
      selected: boolean,
      shadowRootClonable: boolean,
      shadowRootDelegatesFocus: boolean,
      shadowRootMode: null,
      shape: null,
      size: number,
      sizes: null,
      slot: null,
      span: number,
      spellCheck: booleanish,
      src: null,
      srcDoc: null,
      srcLang: null,
      srcSet: null,
      start: number,
      step: null,
      style: null,
      tabIndex: number,
      target: null,
      title: null,
      translate: null,
      type: null,
      typeMustMatch: boolean,
      useMap: null,
      value: booleanish,
      width: number,
      wrap: null,
      writingSuggestions: null,
      // Legacy.
      // See: https://html.spec.whatwg.org/#other-elements,-attributes-and-apis
      align: null,
      // Several. Use CSS `text-align` instead,
      aLink: null,
      // `<body>`. Use CSS `a:active {color}` instead
      archive: spaceSeparated,
      // `<object>`. List of URIs to archives
      axis: null,
      // `<td>` and `<th>`. Use `scope` on `<th>`
      background: null,
      // `<body>`. Use CSS `background-image` instead
      bgColor: null,
      // `<body>` and table elements. Use CSS `background-color` instead
      border: number,
      // `<table>`. Use CSS `border-width` instead,
      borderColor: null,
      // `<table>`. Use CSS `border-color` instead,
      bottomMargin: number,
      // `<body>`
      cellPadding: null,
      // `<table>`
      cellSpacing: null,
      // `<table>`
      char: null,
      // Several table elements. When `align=char`, sets the character to align on
      charOff: null,
      // Several table elements. When `char`, offsets the alignment
      classId: null,
      // `<object>`
      clear: null,
      // `<br>`. Use CSS `clear` instead
      code: null,
      // `<object>`
      codeBase: null,
      // `<object>`
      codeType: null,
      // `<object>`
      color: null,
      // `<font>` and `<hr>`. Use CSS instead
      compact: boolean,
      // Lists. Use CSS to reduce space between items instead
      declare: boolean,
      // `<object>`
      event: null,
      // `<script>`
      face: null,
      // `<font>`. Use CSS instead
      frame: null,
      // `<table>`
      frameBorder: null,
      // `<iframe>`. Use CSS `border` instead
      hSpace: number,
      // `<img>` and `<object>`
      leftMargin: number,
      // `<body>`
      link: null,
      // `<body>`. Use CSS `a:link {color: *}` instead
      longDesc: null,
      // `<frame>`, `<iframe>`, and `<img>`. Use an `<a>`
      lowSrc: null,
      // `<img>`. Use a `<picture>`
      marginHeight: number,
      // `<body>`
      marginWidth: number,
      // `<body>`
      noResize: boolean,
      // `<frame>`
      noHref: boolean,
      // `<area>`. Use no href instead of an explicit `nohref`
      noShade: boolean,
      // `<hr>`. Use background-color and height instead of borders
      noWrap: boolean,
      // `<td>` and `<th>`
      object: null,
      // `<applet>`
      profile: null,
      // `<head>`
      prompt: null,
      // `<isindex>`
      rev: null,
      // `<link>`
      rightMargin: number,
      // `<body>`
      rules: null,
      // `<table>`
      scheme: null,
      // `<meta>`
      scrolling: booleanish,
      // `<frame>`. Use overflow in the child context
      standby: null,
      // `<object>`
      summary: null,
      // `<table>`
      text: null,
      // `<body>`. Use CSS `color` instead
      topMargin: number,
      // `<body>`
      valueType: null,
      // `<param>`
      version: null,
      // `<html>`. Use a doctype.
      vAlign: null,
      // Several. Use CSS `vertical-align` instead
      vLink: null,
      // `<body>`. Use CSS `a:visited {color}` instead
      vSpace: number,
      // `<img>` and `<object>`
      // Non-standard Properties.
      allowTransparency: null,
      autoCorrect: null,
      autoSave: null,
      disablePictureInPicture: boolean,
      disableRemotePlayback: boolean,
      prefix: null,
      property: null,
      results: number,
      security: null,
      unselectable: null
    },
    space: "html",
    transform: caseInsensitiveTransform
  });

  // node_modules/property-information/lib/svg.js
  var svg = create({
    attributes: {
      accentHeight: "accent-height",
      alignmentBaseline: "alignment-baseline",
      arabicForm: "arabic-form",
      baselineShift: "baseline-shift",
      capHeight: "cap-height",
      className: "class",
      clipPath: "clip-path",
      clipRule: "clip-rule",
      colorInterpolation: "color-interpolation",
      colorInterpolationFilters: "color-interpolation-filters",
      colorProfile: "color-profile",
      colorRendering: "color-rendering",
      crossOrigin: "crossorigin",
      dataType: "datatype",
      dominantBaseline: "dominant-baseline",
      enableBackground: "enable-background",
      fillOpacity: "fill-opacity",
      fillRule: "fill-rule",
      floodColor: "flood-color",
      floodOpacity: "flood-opacity",
      fontFamily: "font-family",
      fontSize: "font-size",
      fontSizeAdjust: "font-size-adjust",
      fontStretch: "font-stretch",
      fontStyle: "font-style",
      fontVariant: "font-variant",
      fontWeight: "font-weight",
      glyphName: "glyph-name",
      glyphOrientationHorizontal: "glyph-orientation-horizontal",
      glyphOrientationVertical: "glyph-orientation-vertical",
      hrefLang: "hreflang",
      horizAdvX: "horiz-adv-x",
      horizOriginX: "horiz-origin-x",
      horizOriginY: "horiz-origin-y",
      imageRendering: "image-rendering",
      letterSpacing: "letter-spacing",
      lightingColor: "lighting-color",
      markerEnd: "marker-end",
      markerMid: "marker-mid",
      markerStart: "marker-start",
      navDown: "nav-down",
      navDownLeft: "nav-down-left",
      navDownRight: "nav-down-right",
      navLeft: "nav-left",
      navNext: "nav-next",
      navPrev: "nav-prev",
      navRight: "nav-right",
      navUp: "nav-up",
      navUpLeft: "nav-up-left",
      navUpRight: "nav-up-right",
      onAbort: "onabort",
      onActivate: "onactivate",
      onAfterPrint: "onafterprint",
      onBeforePrint: "onbeforeprint",
      onBegin: "onbegin",
      onCancel: "oncancel",
      onCanPlay: "oncanplay",
      onCanPlayThrough: "oncanplaythrough",
      onChange: "onchange",
      onClick: "onclick",
      onClose: "onclose",
      onCopy: "oncopy",
      onCueChange: "oncuechange",
      onCut: "oncut",
      onDblClick: "ondblclick",
      onDrag: "ondrag",
      onDragEnd: "ondragend",
      onDragEnter: "ondragenter",
      onDragExit: "ondragexit",
      onDragLeave: "ondragleave",
      onDragOver: "ondragover",
      onDragStart: "ondragstart",
      onDrop: "ondrop",
      onDurationChange: "ondurationchange",
      onEmptied: "onemptied",
      onEnd: "onend",
      onEnded: "onended",
      onError: "onerror",
      onFocus: "onfocus",
      onFocusIn: "onfocusin",
      onFocusOut: "onfocusout",
      onHashChange: "onhashchange",
      onInput: "oninput",
      onInvalid: "oninvalid",
      onKeyDown: "onkeydown",
      onKeyPress: "onkeypress",
      onKeyUp: "onkeyup",
      onLoad: "onload",
      onLoadedData: "onloadeddata",
      onLoadedMetadata: "onloadedmetadata",
      onLoadStart: "onloadstart",
      onMessage: "onmessage",
      onMouseDown: "onmousedown",
      onMouseEnter: "onmouseenter",
      onMouseLeave: "onmouseleave",
      onMouseMove: "onmousemove",
      onMouseOut: "onmouseout",
      onMouseOver: "onmouseover",
      onMouseUp: "onmouseup",
      onMouseWheel: "onmousewheel",
      onOffline: "onoffline",
      onOnline: "ononline",
      onPageHide: "onpagehide",
      onPageShow: "onpageshow",
      onPaste: "onpaste",
      onPause: "onpause",
      onPlay: "onplay",
      onPlaying: "onplaying",
      onPopState: "onpopstate",
      onProgress: "onprogress",
      onRateChange: "onratechange",
      onRepeat: "onrepeat",
      onReset: "onreset",
      onResize: "onresize",
      onScroll: "onscroll",
      onSeeked: "onseeked",
      onSeeking: "onseeking",
      onSelect: "onselect",
      onShow: "onshow",
      onStalled: "onstalled",
      onStorage: "onstorage",
      onSubmit: "onsubmit",
      onSuspend: "onsuspend",
      onTimeUpdate: "ontimeupdate",
      onToggle: "ontoggle",
      onUnload: "onunload",
      onVolumeChange: "onvolumechange",
      onWaiting: "onwaiting",
      onZoom: "onzoom",
      overlinePosition: "overline-position",
      overlineThickness: "overline-thickness",
      paintOrder: "paint-order",
      panose1: "panose-1",
      pointerEvents: "pointer-events",
      referrerPolicy: "referrerpolicy",
      renderingIntent: "rendering-intent",
      shapeRendering: "shape-rendering",
      stopColor: "stop-color",
      stopOpacity: "stop-opacity",
      strikethroughPosition: "strikethrough-position",
      strikethroughThickness: "strikethrough-thickness",
      strokeDashArray: "stroke-dasharray",
      strokeDashOffset: "stroke-dashoffset",
      strokeLineCap: "stroke-linecap",
      strokeLineJoin: "stroke-linejoin",
      strokeMiterLimit: "stroke-miterlimit",
      strokeOpacity: "stroke-opacity",
      strokeWidth: "stroke-width",
      tabIndex: "tabindex",
      textAnchor: "text-anchor",
      textDecoration: "text-decoration",
      textRendering: "text-rendering",
      transformOrigin: "transform-origin",
      typeOf: "typeof",
      underlinePosition: "underline-position",
      underlineThickness: "underline-thickness",
      unicodeBidi: "unicode-bidi",
      unicodeRange: "unicode-range",
      unitsPerEm: "units-per-em",
      vAlphabetic: "v-alphabetic",
      vHanging: "v-hanging",
      vIdeographic: "v-ideographic",
      vMathematical: "v-mathematical",
      vectorEffect: "vector-effect",
      vertAdvY: "vert-adv-y",
      vertOriginX: "vert-origin-x",
      vertOriginY: "vert-origin-y",
      wordSpacing: "word-spacing",
      writingMode: "writing-mode",
      xHeight: "x-height",
      // These were camelcased in Tiny. Now lowercased in SVG 2
      playbackOrder: "playbackorder",
      timelineBegin: "timelinebegin"
    },
    properties: {
      about: commaOrSpaceSeparated,
      accentHeight: number,
      accumulate: null,
      additive: null,
      alignmentBaseline: null,
      alphabetic: number,
      amplitude: number,
      arabicForm: null,
      ascent: number,
      attributeName: null,
      attributeType: null,
      azimuth: number,
      bandwidth: null,
      baselineShift: null,
      baseFrequency: null,
      baseProfile: null,
      bbox: null,
      begin: null,
      bias: number,
      by: null,
      calcMode: null,
      capHeight: number,
      className: spaceSeparated,
      clip: null,
      clipPath: null,
      clipPathUnits: null,
      clipRule: null,
      color: null,
      colorInterpolation: null,
      colorInterpolationFilters: null,
      colorProfile: null,
      colorRendering: null,
      content: null,
      contentScriptType: null,
      contentStyleType: null,
      crossOrigin: null,
      cursor: null,
      cx: null,
      cy: null,
      d: null,
      dataType: null,
      defaultAction: null,
      descent: number,
      diffuseConstant: number,
      direction: null,
      display: null,
      dur: null,
      divisor: number,
      dominantBaseline: null,
      download: boolean,
      dx: null,
      dy: null,
      edgeMode: null,
      editable: null,
      elevation: number,
      enableBackground: null,
      end: null,
      event: null,
      exponent: number,
      externalResourcesRequired: null,
      fill: null,
      fillOpacity: number,
      fillRule: null,
      filter: null,
      filterRes: null,
      filterUnits: null,
      floodColor: null,
      floodOpacity: null,
      focusable: null,
      focusHighlight: null,
      fontFamily: null,
      fontSize: null,
      fontSizeAdjust: null,
      fontStretch: null,
      fontStyle: null,
      fontVariant: null,
      fontWeight: null,
      format: null,
      fr: null,
      from: null,
      fx: null,
      fy: null,
      g1: commaSeparated,
      g2: commaSeparated,
      glyphName: commaSeparated,
      glyphOrientationHorizontal: null,
      glyphOrientationVertical: null,
      glyphRef: null,
      gradientTransform: null,
      gradientUnits: null,
      handler: null,
      hanging: number,
      hatchContentUnits: null,
      hatchUnits: null,
      height: null,
      href: null,
      hrefLang: null,
      horizAdvX: number,
      horizOriginX: number,
      horizOriginY: number,
      id: null,
      ideographic: number,
      imageRendering: null,
      initialVisibility: null,
      in: null,
      in2: null,
      intercept: number,
      k: number,
      k1: number,
      k2: number,
      k3: number,
      k4: number,
      kernelMatrix: commaOrSpaceSeparated,
      kernelUnitLength: null,
      keyPoints: null,
      // SEMI_COLON_SEPARATED
      keySplines: null,
      // SEMI_COLON_SEPARATED
      keyTimes: null,
      // SEMI_COLON_SEPARATED
      kerning: null,
      lang: null,
      lengthAdjust: null,
      letterSpacing: null,
      lightingColor: null,
      limitingConeAngle: number,
      local: null,
      markerEnd: null,
      markerMid: null,
      markerStart: null,
      markerHeight: null,
      markerUnits: null,
      markerWidth: null,
      mask: null,
      maskContentUnits: null,
      maskUnits: null,
      mathematical: null,
      max: null,
      media: null,
      mediaCharacterEncoding: null,
      mediaContentEncodings: null,
      mediaSize: number,
      mediaTime: null,
      method: null,
      min: null,
      mode: null,
      name: null,
      navDown: null,
      navDownLeft: null,
      navDownRight: null,
      navLeft: null,
      navNext: null,
      navPrev: null,
      navRight: null,
      navUp: null,
      navUpLeft: null,
      navUpRight: null,
      numOctaves: null,
      observer: null,
      offset: null,
      onAbort: null,
      onActivate: null,
      onAfterPrint: null,
      onBeforePrint: null,
      onBegin: null,
      onCancel: null,
      onCanPlay: null,
      onCanPlayThrough: null,
      onChange: null,
      onClick: null,
      onClose: null,
      onCopy: null,
      onCueChange: null,
      onCut: null,
      onDblClick: null,
      onDrag: null,
      onDragEnd: null,
      onDragEnter: null,
      onDragExit: null,
      onDragLeave: null,
      onDragOver: null,
      onDragStart: null,
      onDrop: null,
      onDurationChange: null,
      onEmptied: null,
      onEnd: null,
      onEnded: null,
      onError: null,
      onFocus: null,
      onFocusIn: null,
      onFocusOut: null,
      onHashChange: null,
      onInput: null,
      onInvalid: null,
      onKeyDown: null,
      onKeyPress: null,
      onKeyUp: null,
      onLoad: null,
      onLoadedData: null,
      onLoadedMetadata: null,
      onLoadStart: null,
      onMessage: null,
      onMouseDown: null,
      onMouseEnter: null,
      onMouseLeave: null,
      onMouseMove: null,
      onMouseOut: null,
      onMouseOver: null,
      onMouseUp: null,
      onMouseWheel: null,
      onOffline: null,
      onOnline: null,
      onPageHide: null,
      onPageShow: null,
      onPaste: null,
      onPause: null,
      onPlay: null,
      onPlaying: null,
      onPopState: null,
      onProgress: null,
      onRateChange: null,
      onRepeat: null,
      onReset: null,
      onResize: null,
      onScroll: null,
      onSeeked: null,
      onSeeking: null,
      onSelect: null,
      onShow: null,
      onStalled: null,
      onStorage: null,
      onSubmit: null,
      onSuspend: null,
      onTimeUpdate: null,
      onToggle: null,
      onUnload: null,
      onVolumeChange: null,
      onWaiting: null,
      onZoom: null,
      opacity: null,
      operator: null,
      order: null,
      orient: null,
      orientation: null,
      origin: null,
      overflow: null,
      overlay: null,
      overlinePosition: number,
      overlineThickness: number,
      paintOrder: null,
      panose1: null,
      path: null,
      pathLength: number,
      patternContentUnits: null,
      patternTransform: null,
      patternUnits: null,
      phase: null,
      ping: spaceSeparated,
      pitch: null,
      playbackOrder: null,
      pointerEvents: null,
      points: null,
      pointsAtX: number,
      pointsAtY: number,
      pointsAtZ: number,
      preserveAlpha: null,
      preserveAspectRatio: null,
      primitiveUnits: null,
      propagate: null,
      property: commaOrSpaceSeparated,
      r: null,
      radius: null,
      referrerPolicy: null,
      refX: null,
      refY: null,
      rel: commaOrSpaceSeparated,
      rev: commaOrSpaceSeparated,
      renderingIntent: null,
      repeatCount: null,
      repeatDur: null,
      requiredExtensions: commaOrSpaceSeparated,
      requiredFeatures: commaOrSpaceSeparated,
      requiredFonts: commaOrSpaceSeparated,
      requiredFormats: commaOrSpaceSeparated,
      resource: null,
      restart: null,
      result: null,
      rotate: null,
      rx: null,
      ry: null,
      scale: null,
      seed: null,
      shapeRendering: null,
      side: null,
      slope: null,
      snapshotTime: null,
      specularConstant: number,
      specularExponent: number,
      spreadMethod: null,
      spacing: null,
      startOffset: null,
      stdDeviation: null,
      stemh: null,
      stemv: null,
      stitchTiles: null,
      stopColor: null,
      stopOpacity: null,
      strikethroughPosition: number,
      strikethroughThickness: number,
      string: null,
      stroke: null,
      strokeDashArray: commaOrSpaceSeparated,
      strokeDashOffset: null,
      strokeLineCap: null,
      strokeLineJoin: null,
      strokeMiterLimit: number,
      strokeOpacity: number,
      strokeWidth: null,
      style: null,
      surfaceScale: number,
      syncBehavior: null,
      syncBehaviorDefault: null,
      syncMaster: null,
      syncTolerance: null,
      syncToleranceDefault: null,
      systemLanguage: commaOrSpaceSeparated,
      tabIndex: number,
      tableValues: null,
      target: null,
      targetX: number,
      targetY: number,
      textAnchor: null,
      textDecoration: null,
      textRendering: null,
      textLength: null,
      timelineBegin: null,
      title: null,
      transformBehavior: null,
      type: null,
      typeOf: commaOrSpaceSeparated,
      to: null,
      transform: null,
      transformOrigin: null,
      u1: null,
      u2: null,
      underlinePosition: number,
      underlineThickness: number,
      unicode: null,
      unicodeBidi: null,
      unicodeRange: null,
      unitsPerEm: number,
      values: null,
      vAlphabetic: number,
      vMathematical: number,
      vectorEffect: null,
      vHanging: number,
      vIdeographic: number,
      version: null,
      vertAdvY: number,
      vertOriginX: number,
      vertOriginY: number,
      viewBox: null,
      viewTarget: null,
      visibility: null,
      width: null,
      widths: null,
      wordSpacing: null,
      writingMode: null,
      x: null,
      x1: null,
      x2: null,
      xChannelSelector: null,
      xHeight: number,
      y: null,
      y1: null,
      y2: null,
      yChannelSelector: null,
      z: null,
      zoomAndPan: null
    },
    space: "svg",
    transform: caseSensitiveTransform
  });

  // node_modules/property-information/lib/xlink.js
  var xlink = create({
    properties: {
      xLinkActuate: null,
      xLinkArcRole: null,
      xLinkHref: null,
      xLinkRole: null,
      xLinkShow: null,
      xLinkTitle: null,
      xLinkType: null
    },
    space: "xlink",
    transform(_, property) {
      return "xlink:" + property.slice(5).toLowerCase();
    }
  });

  // node_modules/property-information/lib/xmlns.js
  var xmlns = create({
    attributes: { xmlnsxlink: "xmlns:xlink" },
    properties: { xmlnsXLink: null, xmlns: null },
    space: "xmlns",
    transform: caseInsensitiveTransform
  });

  // node_modules/property-information/lib/xml.js
  var xml = create({
    properties: { xmlBase: null, xmlLang: null, xmlSpace: null },
    space: "xml",
    transform(_, property) {
      return "xml:" + property.slice(3).toLowerCase();
    }
  });

  // node_modules/property-information/lib/find.js
  var cap = /[A-Z]/g;
  var dash = /-[a-z]/g;
  var valid = /^data[-\w.:]+$/i;
  function find(schema, value) {
    const normal = normalize2(value);
    let property = value;
    let Type = Info;
    if (normal in schema.normal) {
      return schema.property[schema.normal[normal]];
    }
    if (normal.length > 4 && normal.slice(0, 4) === "data" && valid.test(value)) {
      if (value.charAt(4) === "-") {
        const rest = value.slice(5).replace(dash, camelcase);
        property = "data" + rest.charAt(0).toUpperCase() + rest.slice(1);
      } else {
        const rest = value.slice(4);
        if (!dash.test(rest)) {
          let dashes = rest.replace(cap, kebab);
          if (dashes.charAt(0) !== "-") {
            dashes = "-" + dashes;
          }
          value = "data" + dashes;
        }
      }
      Type = DefinedInfo;
    }
    return new Type(property, value);
  }
  function kebab($0) {
    return "-" + $0.toLowerCase();
  }
  function camelcase($0) {
    return $0.charAt(1).toUpperCase();
  }

  // node_modules/property-information/index.js
  var html4 = merge([aria, html3, xlink, xmlns, xml], "html");
  var svg2 = merge([aria, svg, xlink, xmlns, xml], "svg");

  // node_modules/comma-separated-tokens/index.js
  function parse2(value) {
    const tokens = [];
    const input = String(value || "");
    let index2 = input.indexOf(",");
    let start = 0;
    let end = false;
    while (!end) {
      if (index2 === -1) {
        index2 = input.length;
        end = true;
      }
      const token = input.slice(start, index2).trim();
      if (token || !end) {
        tokens.push(token);
      }
      start = index2 + 1;
      index2 = input.indexOf(",", start);
    }
    return tokens;
  }
  function stringify(values, options) {
    const settings = options || {};
    const input = values[values.length - 1] === "" ? [...values, ""] : values;
    return input.join(
      (settings.padRight ? " " : "") + "," + (settings.padLeft === false ? "" : " ")
    ).trim();
  }

  // node_modules/hast-util-parse-selector/lib/index.js
  var search2 = /[#.]/g;
  function parseSelector(selector, defaultTagName) {
    const value = selector || "";
    const props = {};
    let start = 0;
    let previous4;
    let tagName;
    while (start < value.length) {
      search2.lastIndex = start;
      const match = search2.exec(value);
      const subvalue = value.slice(start, match ? match.index : value.length);
      if (subvalue) {
        if (!previous4) {
          tagName = subvalue;
        } else if (previous4 === "#") {
          props.id = subvalue;
        } else if (Array.isArray(props.className)) {
          props.className.push(subvalue);
        } else {
          props.className = [subvalue];
        }
        start += subvalue.length;
      }
      if (match) {
        previous4 = match[0];
        start++;
      }
    }
    return {
      type: "element",
      // @ts-expect-error: tag name is parsed.
      tagName: tagName || defaultTagName || "div",
      properties: props,
      children: []
    };
  }

  // node_modules/space-separated-tokens/index.js
  function parse3(value) {
    const input = String(value || "").trim();
    return input ? input.split(/[ \t\n\r\f]+/g) : [];
  }
  function stringify2(values) {
    return values.join(" ").trim();
  }

  // node_modules/hastscript/lib/create-h.js
  function createH(schema, defaultTagName, caseSensitive) {
    const adjust = caseSensitive ? createAdjustMap(caseSensitive) : void 0;
    function h2(selector, properties2, ...children2) {
      let node2;
      if (selector === null || selector === void 0) {
        node2 = { type: "root", children: [] };
        const child = (
          /** @type {Child} */
          properties2
        );
        children2.unshift(child);
      } else {
        node2 = parseSelector(selector, defaultTagName);
        const lower = node2.tagName.toLowerCase();
        const adjusted = adjust ? adjust.get(lower) : void 0;
        node2.tagName = adjusted || lower;
        if (isChild(properties2)) {
          children2.unshift(properties2);
        } else {
          for (const [key2, value] of Object.entries(properties2)) {
            addProperty(schema, node2.properties, key2, value);
          }
        }
      }
      for (const child of children2) {
        addChild(node2.children, child);
      }
      if (node2.type === "element" && node2.tagName === "template") {
        node2.content = { type: "root", children: node2.children };
        node2.children = [];
      }
      return node2;
    }
    return h2;
  }
  function isChild(value) {
    if (value === null || typeof value !== "object" || Array.isArray(value)) {
      return true;
    }
    if (typeof value.type !== "string") return false;
    const record = (
      /** @type {Record<string, unknown>} */
      value
    );
    const keys2 = Object.keys(value);
    for (const key2 of keys2) {
      const value2 = record[key2];
      if (value2 && typeof value2 === "object") {
        if (!Array.isArray(value2)) return true;
        const list4 = (
          /** @type {ReadonlyArray<unknown>} */
          value2
        );
        for (const item of list4) {
          if (typeof item !== "number" && typeof item !== "string") {
            return true;
          }
        }
      }
    }
    if ("children" in value && Array.isArray(value.children)) {
      return true;
    }
    return false;
  }
  function addProperty(schema, properties2, key2, value) {
    const info = find(schema, key2);
    let result;
    if (value === null || value === void 0) return;
    if (typeof value === "number") {
      if (Number.isNaN(value)) return;
      result = value;
    } else if (typeof value === "boolean") {
      result = value;
    } else if (typeof value === "string") {
      if (info.spaceSeparated) {
        result = parse3(value);
      } else if (info.commaSeparated) {
        result = parse2(value);
      } else if (info.commaOrSpaceSeparated) {
        result = parse3(parse2(value).join(" "));
      } else {
        result = parsePrimitive(info, info.property, value);
      }
    } else if (Array.isArray(value)) {
      result = [...value];
    } else {
      result = info.property === "style" ? style(value) : String(value);
    }
    if (Array.isArray(result)) {
      const finalResult = [];
      for (const item of result) {
        finalResult.push(
          /** @type {number | string} */
          parsePrimitive(info, info.property, item)
        );
      }
      result = finalResult;
    }
    if (info.property === "className" && Array.isArray(properties2.className)) {
      result = properties2.className.concat(
        /** @type {Array<number | string> | number | string} */
        result
      );
    }
    properties2[info.property] = result;
  }
  function addChild(nodes, value) {
    if (value === null || value === void 0) {
    } else if (typeof value === "number" || typeof value === "string") {
      nodes.push({ type: "text", value: String(value) });
    } else if (Array.isArray(value)) {
      for (const child of value) {
        addChild(nodes, child);
      }
    } else if (typeof value === "object" && "type" in value) {
      if (value.type === "root") {
        addChild(nodes, value.children);
      } else {
        nodes.push(value);
      }
    } else {
      throw new Error("Expected node, nodes, or string, got `" + value + "`");
    }
  }
  function parsePrimitive(info, name, value) {
    if (typeof value === "string") {
      if (info.number && value && !Number.isNaN(Number(value))) {
        return Number(value);
      }
      if ((info.boolean || info.overloadedBoolean) && (value === "" || normalize2(value) === normalize2(name))) {
        return true;
      }
    }
    return value;
  }
  function style(styles) {
    const result = [];
    for (const [key2, value] of Object.entries(styles)) {
      result.push([key2, value].join(": "));
    }
    return result.join("; ");
  }
  function createAdjustMap(values) {
    const result = /* @__PURE__ */ new Map();
    for (const value of values) {
      result.set(value.toLowerCase(), value);
    }
    return result;
  }

  // node_modules/hastscript/lib/svg-case-sensitive-tag-names.js
  var svgCaseSensitiveTagNames = [
    "altGlyph",
    "altGlyphDef",
    "altGlyphItem",
    "animateColor",
    "animateMotion",
    "animateTransform",
    "clipPath",
    "feBlend",
    "feColorMatrix",
    "feComponentTransfer",
    "feComposite",
    "feConvolveMatrix",
    "feDiffuseLighting",
    "feDisplacementMap",
    "feDistantLight",
    "feDropShadow",
    "feFlood",
    "feFuncA",
    "feFuncB",
    "feFuncG",
    "feFuncR",
    "feGaussianBlur",
    "feImage",
    "feMerge",
    "feMergeNode",
    "feMorphology",
    "feOffset",
    "fePointLight",
    "feSpecularLighting",
    "feSpotLight",
    "feTile",
    "feTurbulence",
    "foreignObject",
    "glyphRef",
    "linearGradient",
    "radialGradient",
    "solidColor",
    "textArea",
    "textPath"
  ];

  // node_modules/hastscript/lib/index.js
  var h = createH(html4, "div");
  var s = createH(svg2, "g", svgCaseSensitiveTagNames);

  // node_modules/web-namespaces/index.js
  var webNamespaces = {
    html: "http://www.w3.org/1999/xhtml",
    mathml: "http://www.w3.org/1998/Math/MathML",
    svg: "http://www.w3.org/2000/svg",
    xlink: "http://www.w3.org/1999/xlink",
    xml: "http://www.w3.org/XML/1998/namespace",
    xmlns: "http://www.w3.org/2000/xmlns/"
  };

  // node_modules/hast-util-from-dom/lib/index.js
  function fromDom(tree, options) {
    return transform(tree, options || {}) || { type: "root", children: [] };
  }
  function transform(node2, options) {
    const transformed = one2(node2, options);
    if (transformed && options.afterTransform)
      options.afterTransform(node2, transformed);
    return transformed;
  }
  function one2(node2, options) {
    switch (node2.nodeType) {
      case 1: {
        const domNode = (
          /** @type {Element} */
          node2
        );
        return element2(domNode, options);
      }
      // Ignore: Attr (2).
      case 3: {
        const domNode = (
          /** @type {Text} */
          node2
        );
        return text6(domNode);
      }
      // Ignore: CDATA (4).
      // Removed: Entity reference (5)
      // Removed: Entity (6)
      // Ignore: Processing instruction (7).
      case 8: {
        const domNode = (
          /** @type {Comment} */
          node2
        );
        return comment(domNode);
      }
      case 9: {
        const domNode = (
          /** @type {Document} */
          node2
        );
        return root3(domNode, options);
      }
      case 10: {
        return doctype();
      }
      case 11: {
        const domNode = (
          /** @type {DocumentFragment} */
          node2
        );
        return root3(domNode, options);
      }
      default: {
        return void 0;
      }
    }
  }
  function root3(node2, options) {
    return { type: "root", children: all2(node2, options) };
  }
  function doctype() {
    return { type: "doctype" };
  }
  function text6(node2) {
    return { type: "text", value: node2.nodeValue || "" };
  }
  function comment(node2) {
    return { type: "comment", value: node2.nodeValue || "" };
  }
  function element2(node2, options) {
    const space2 = node2.namespaceURI;
    const x = space2 === webNamespaces.svg ? s : h;
    const tagName = space2 === webNamespaces.html ? node2.tagName.toLowerCase() : node2.tagName;
    const content3 = (
      // @ts-expect-error: DOM types are wrong, content can exist.
      space2 === webNamespaces.html && tagName === "template" ? node2.content : node2
    );
    const attributes = node2.getAttributeNames();
    const properties2 = {};
    let index2 = -1;
    while (++index2 < attributes.length) {
      properties2[attributes[index2]] = node2.getAttribute(attributes[index2]) || "";
    }
    return x(tagName, properties2, all2(content3, options));
  }
  function all2(node2, options) {
    const nodes = node2.childNodes;
    const children2 = [];
    let index2 = -1;
    while (++index2 < nodes.length) {
      const child = transform(nodes[index2], options);
      if (child !== void 0) {
        children2.push(child);
      }
    }
    return children2;
  }

  // node_modules/hast-util-from-html-isomorphic/lib/browser.js
  var parser = new DOMParser();
  function fromHtmlIsomorphic(value, options) {
    const node2 = options?.fragment ? parseFragment(value) : parser.parseFromString(value, "text/html");
    return (
      /** @type {Root} */
      fromDom(node2)
    );
  }
  function parseFragment(value) {
    const template = document.createElement("template");
    template.innerHTML = value;
    return template.content;
  }

  // node_modules/unist-util-find-after/lib/index.js
  var findAfter = (
    // Note: overloads like this are needed to support optional generics.
    /**
     * @type {(
     *   (<Kind extends UnistParent, Check extends Test>(parent: Kind, index: Child<Kind> | number, test: Check) => Matches<Child<Kind>, Check> | undefined) &
     *   (<Kind extends UnistParent>(parent: Kind, index: Child<Kind> | number, test?: null | undefined) => Child<Kind> | undefined)
     * )}
     */
    /**
     * @param {UnistParent} parent
     * @param {UnistNode | number} index
     * @param {Test} [test]
     * @returns {UnistNode | undefined}
     */
    (function(parent, index2, test) {
      const is2 = convert(test);
      if (!parent || !parent.type || !parent.children) {
        throw new Error("Expected parent node");
      }
      if (typeof index2 === "number") {
        if (index2 < 0 || index2 === Number.POSITIVE_INFINITY) {
          throw new Error("Expected positive finite number as index");
        }
      } else {
        index2 = parent.children.indexOf(index2);
        if (index2 < 0) {
          throw new Error("Expected child node or index");
        }
      }
      while (++index2 < parent.children.length) {
        if (is2(parent.children[index2], index2, parent)) {
          return parent.children[index2];
        }
      }
      return void 0;
    })
  );

  // node_modules/hast-util-is-element/lib/index.js
  var convertElement = (
    // Note: overloads in JSDoc can’t yet use different `@template`s.
    /**
     * @type {(
     *   (<Condition extends TestFunction>(test: Condition) => (element: unknown, index?: number | null | undefined, parent?: Parents | null | undefined, context?: unknown) => element is Element & Predicate<Condition, Element>) &
     *   (<Condition extends string>(test: Condition) => (element: unknown, index?: number | null | undefined, parent?: Parents | null | undefined, context?: unknown) => element is Element & {tagName: Condition}) &
     *   ((test?: null | undefined) => (element?: unknown, index?: number | null | undefined, parent?: Parents | null | undefined, context?: unknown) => element is Element) &
     *   ((test?: Test) => Check)
     * )}
     */
    /**
     * @param {Test | null | undefined} [test]
     * @returns {Check}
     */
    (function(test) {
      if (test === null || test === void 0) {
        return element3;
      }
      if (typeof test === "string") {
        return tagNameFactory(test);
      }
      if (typeof test === "object") {
        return anyFactory2(test);
      }
      if (typeof test === "function") {
        return castFactory2(test);
      }
      throw new Error("Expected function, string, or array as `test`");
    })
  );
  function anyFactory2(tests) {
    const checks2 = [];
    let index2 = -1;
    while (++index2 < tests.length) {
      checks2[index2] = convertElement(tests[index2]);
    }
    return castFactory2(any);
    function any(...parameters) {
      let index3 = -1;
      while (++index3 < checks2.length) {
        if (checks2[index3].apply(this, parameters)) return true;
      }
      return false;
    }
  }
  function tagNameFactory(check) {
    return castFactory2(tagName);
    function tagName(element6) {
      return element6.tagName === check;
    }
  }
  function castFactory2(testFunction) {
    return check;
    function check(value, index2, parent) {
      return Boolean(
        looksLikeAnElement(value) && testFunction.call(
          this,
          value,
          typeof index2 === "number" ? index2 : void 0,
          parent || void 0
        )
      );
    }
  }
  function element3(element6) {
    return Boolean(
      element6 && typeof element6 === "object" && "type" in element6 && element6.type === "element" && "tagName" in element6 && typeof element6.tagName === "string"
    );
  }
  function looksLikeAnElement(value) {
    return value !== null && typeof value === "object" && "type" in value && "tagName" in value;
  }

  // node_modules/hast-util-to-text/lib/index.js
  var searchLineFeeds = /\n/g;
  var searchTabOrSpaces = /[\t ]+/g;
  var br = convertElement("br");
  var cell = convertElement(isCell);
  var p = convertElement("p");
  var row = convertElement("tr");
  var notRendered = convertElement([
    // List from: <https://html.spec.whatwg.org/multipage/rendering.html#hidden-elements>
    "datalist",
    "head",
    "noembed",
    "noframes",
    "noscript",
    // Act as if we support scripting.
    "rp",
    "script",
    "style",
    "template",
    "title",
    // Hidden attribute.
    hidden,
    // From: <https://html.spec.whatwg.org/multipage/rendering.html#flow-content-3>
    closedDialog
  ]);
  var blockOrCaption = convertElement([
    "address",
    // Flow content
    "article",
    // Sections and headings
    "aside",
    // Sections and headings
    "blockquote",
    // Flow content
    "body",
    // Page
    "caption",
    // `table-caption`
    "center",
    // Flow content (legacy)
    "dd",
    // Lists
    "dialog",
    // Flow content
    "dir",
    // Lists (legacy)
    "dl",
    // Lists
    "dt",
    // Lists
    "div",
    // Flow content
    "figure",
    // Flow content
    "figcaption",
    // Flow content
    "footer",
    // Flow content
    "form,",
    // Flow content
    "h1",
    // Sections and headings
    "h2",
    // Sections and headings
    "h3",
    // Sections and headings
    "h4",
    // Sections and headings
    "h5",
    // Sections and headings
    "h6",
    // Sections and headings
    "header",
    // Flow content
    "hgroup",
    // Sections and headings
    "hr",
    // Flow content
    "html",
    // Page
    "legend",
    // Flow content
    "li",
    // Lists (as `display: list-item`)
    "listing",
    // Flow content (legacy)
    "main",
    // Flow content
    "menu",
    // Lists
    "nav",
    // Sections and headings
    "ol",
    // Lists
    "p",
    // Flow content
    "plaintext",
    // Flow content (legacy)
    "pre",
    // Flow content
    "section",
    // Sections and headings
    "ul",
    // Lists
    "xmp"
    // Flow content (legacy)
  ]);
  function toText(tree, options) {
    const options_ = options || {};
    const children2 = "children" in tree ? tree.children : [];
    const block = blockOrCaption(tree);
    const whitespace2 = inferWhitespace(tree, {
      whitespace: options_.whitespace || "normal",
      breakBefore: false,
      breakAfter: false
    });
    const results = [];
    if (tree.type === "text" || tree.type === "comment") {
      results.push(
        ...collectText(tree, {
          whitespace: whitespace2,
          breakBefore: true,
          breakAfter: true
        })
      );
    }
    let index2 = -1;
    while (++index2 < children2.length) {
      results.push(
        ...renderedTextCollection(
          children2[index2],
          // @ts-expect-error: `tree` is a parent if we’re here.
          tree,
          {
            whitespace: whitespace2,
            breakBefore: index2 ? void 0 : block,
            breakAfter: index2 < children2.length - 1 ? br(children2[index2 + 1]) : block
          }
        )
      );
    }
    const result = [];
    let count;
    index2 = -1;
    while (++index2 < results.length) {
      const value = results[index2];
      if (typeof value === "number") {
        if (count !== void 0 && value > count) count = value;
      } else if (value) {
        if (count !== void 0 && count > -1) {
          result.push("\n".repeat(count) || " ");
        }
        count = -1;
        result.push(value);
      }
    }
    return result.join("");
  }
  function renderedTextCollection(node2, parent, info) {
    if (node2.type === "element") {
      return collectElement(node2, parent, info);
    }
    if (node2.type === "text") {
      return info.whitespace === "normal" ? collectText(node2, info) : collectPreText(node2);
    }
    return [];
  }
  function collectElement(node2, parent, info) {
    const whitespace2 = inferWhitespace(node2, info);
    const children2 = node2.children || [];
    let index2 = -1;
    let items = [];
    if (notRendered(node2)) {
      return items;
    }
    let prefix;
    let suffix;
    if (br(node2)) {
      suffix = "\n";
    } else if (row(node2) && // @ts-expect-error: something up with types of parents.
    findAfter(parent, node2, row)) {
      suffix = "\n";
    } else if (p(node2)) {
      prefix = 2;
      suffix = 2;
    } else if (blockOrCaption(node2)) {
      prefix = 1;
      suffix = 1;
    }
    while (++index2 < children2.length) {
      items = items.concat(
        renderedTextCollection(children2[index2], node2, {
          whitespace: whitespace2,
          breakBefore: index2 ? void 0 : prefix,
          breakAfter: index2 < children2.length - 1 ? br(children2[index2 + 1]) : suffix
        })
      );
    }
    if (cell(node2) && // @ts-expect-error: something up with types of parents.
    findAfter(parent, node2, cell)) {
      items.push("	");
    }
    if (prefix) items.unshift(prefix);
    if (suffix) items.push(suffix);
    return items;
  }
  function collectText(node2, info) {
    const value = String(node2.value);
    const lines = [];
    const result = [];
    let start = 0;
    while (start <= value.length) {
      searchLineFeeds.lastIndex = start;
      const match = searchLineFeeds.exec(value);
      const end = match && "index" in match ? match.index : value.length;
      lines.push(
        // Any sequence of collapsible spaces and tabs immediately preceding or
        // following a segment break is removed.
        trimAndCollapseSpacesAndTabs(
          // […] ignoring bidi formatting characters (characters with the
          // Bidi_Control property [UAX9]: ALM, LTR, RTL, LRE-RLO, LRI-PDI) as if
          // they were not there.
          value.slice(start, end).replace(/[\u061C\u200E\u200F\u202A-\u202E\u2066-\u2069]/g, ""),
          start === 0 ? info.breakBefore : true,
          end === value.length ? info.breakAfter : true
        )
      );
      start = end + 1;
    }
    let index2 = -1;
    let join2;
    while (++index2 < lines.length) {
      if (lines[index2].charCodeAt(lines[index2].length - 1) === 8203 || index2 < lines.length - 1 && lines[index2 + 1].charCodeAt(0) === 8203) {
        result.push(lines[index2]);
        join2 = void 0;
      } else if (lines[index2]) {
        if (typeof join2 === "number") result.push(join2);
        result.push(lines[index2]);
        join2 = 0;
      } else if (index2 === 0 || index2 === lines.length - 1) {
        result.push(0);
      }
    }
    return result;
  }
  function collectPreText(node2) {
    return [String(node2.value)];
  }
  function trimAndCollapseSpacesAndTabs(value, breakBefore, breakAfter) {
    const result = [];
    let start = 0;
    let end;
    while (start < value.length) {
      searchTabOrSpaces.lastIndex = start;
      const match = searchTabOrSpaces.exec(value);
      end = match ? match.index : value.length;
      if (!start && !end && match && !breakBefore) {
        result.push("");
      }
      if (start !== end) {
        result.push(value.slice(start, end));
      }
      start = match ? end + match[0].length : end;
    }
    if (start !== end && !breakAfter) {
      result.push("");
    }
    return result.join(" ");
  }
  function inferWhitespace(node2, info) {
    if (node2.type === "element") {
      const properties2 = node2.properties || {};
      switch (node2.tagName) {
        case "listing":
        case "plaintext":
        case "xmp": {
          return "pre";
        }
        case "nobr": {
          return "nowrap";
        }
        case "pre": {
          return properties2.wrap ? "pre-wrap" : "pre";
        }
        case "td":
        case "th": {
          return properties2.noWrap ? "nowrap" : info.whitespace;
        }
        case "textarea": {
          return "pre-wrap";
        }
        default:
      }
    }
    return info.whitespace;
  }
  function hidden(node2) {
    return Boolean((node2.properties || {}).hidden);
  }
  function isCell(node2) {
    return node2.tagName === "td" || node2.tagName === "th";
  }
  function closedDialog(node2) {
    return node2.tagName === "dialog" && !(node2.properties || {}).open;
  }

  // node_modules/rehype-katex/lib/index.js
  var import_katex2 = __toESM(__require("katex"), 1);
  var emptyOptions5 = {};
  var emptyClasses = [];
  function rehypeKatex(options) {
    const settings = options || emptyOptions5;
    return function(tree, file) {
      visitParents(tree, "element", function(element6, parents) {
        const classes = Array.isArray(element6.properties.className) ? element6.properties.className : emptyClasses;
        const languageMath = classes.includes("language-math");
        const mathDisplay = classes.includes("math-display");
        const mathInline = classes.includes("math-inline");
        let displayMode = mathDisplay;
        if (!languageMath && !mathDisplay && !mathInline) {
          return;
        }
        let parent = parents[parents.length - 1];
        let scope = element6;
        if (element6.tagName === "code" && languageMath && parent && parent.type === "element" && parent.tagName === "pre") {
          scope = parent;
          parent = parents[parents.length - 2];
          displayMode = true;
        }
        if (!parent) return;
        const value = toText(scope, { whitespace: "pre" });
        let result;
        try {
          result = import_katex2.default.renderToString(value, {
            ...settings,
            displayMode,
            throwOnError: true
          });
        } catch (error) {
          const cause = (
            /** @type {Error} */
            error
          );
          const ruleId = cause.name.toLowerCase();
          file.message("Could not render math with KaTeX", {
            ancestors: [...parents, element6],
            cause,
            place: element6.position,
            ruleId,
            source: "rehype-katex"
          });
          try {
            result = import_katex2.default.renderToString(value, {
              ...settings,
              displayMode,
              strict: "ignore",
              throwOnError: false
            });
          } catch {
            result = [
              {
                type: "element",
                tagName: "span",
                properties: {
                  className: ["katex-error"],
                  style: "color:" + (settings.errorColor || "#cc0000"),
                  title: String(error)
                },
                children: [{ type: "text", value }]
              }
            ];
          }
        }
        if (typeof result === "string") {
          const root6 = fromHtmlIsomorphic(result, { fragment: true });
          result = /** @type {Array<ElementContent>} */
          root6.children;
        }
        const index2 = parent.children.indexOf(scope);
        parent.children.splice(index2, 1, ...result);
        return SKIP;
      });
    };
  }

  // node_modules/hast-util-sanitize/lib/schema.js
  var aria2 = ["ariaDescribedBy", "ariaLabel", "ariaLabelledBy"];
  var defaultSchema = {
    ancestors: {
      tbody: ["table"],
      td: ["table"],
      th: ["table"],
      thead: ["table"],
      tfoot: ["table"],
      tr: ["table"]
    },
    attributes: {
      a: [
        ...aria2,
        // Note: these 3 are used by GFM footnotes, they do work on all links.
        "dataFootnoteBackref",
        "dataFootnoteRef",
        ["className", "data-footnote-backref"],
        "href"
      ],
      blockquote: ["cite"],
      // Note: this class is not normally allowed by GH, when manually writing
      // `code` as HTML in markdown, they adds it some other way.
      // We can’t do that, so we have to allow it.
      code: [["className", /^language-./]],
      del: ["cite"],
      div: ["itemScope", "itemType"],
      dl: [...aria2],
      // Note: this is used by GFM footnotes.
      h2: [["className", "sr-only"]],
      img: [...aria2, "longDesc", "src"],
      // Note: `input` is not normally allowed by GH, when manually writing
      // it in markdown, they add it from tasklists some other way.
      // We can’t do that, so we have to allow it.
      input: [
        ["disabled", true],
        ["type", "checkbox"]
      ],
      ins: ["cite"],
      // Note: this class is not normally allowed by GH, when manually writing
      // `li` as HTML in markdown, they adds it some other way.
      // We can’t do that, so we have to allow it.
      li: [["className", "task-list-item"]],
      // Note: this class is not normally allowed by GH, when manually writing
      // `ol` as HTML in markdown, they adds it some other way.
      // We can’t do that, so we have to allow it.
      ol: [...aria2, ["className", "contains-task-list"]],
      q: ["cite"],
      section: ["dataFootnotes", ["className", "footnotes"]],
      source: ["srcSet"],
      summary: [...aria2],
      table: [...aria2],
      // Note: this class is not normally allowed by GH, when manually writing
      // `ol` as HTML in markdown, they adds it some other way.
      // We can’t do that, so we have to allow it.
      ul: [...aria2, ["className", "contains-task-list"]],
      "*": [
        "abbr",
        "accept",
        "acceptCharset",
        "accessKey",
        "action",
        "align",
        "alt",
        "axis",
        "border",
        "cellPadding",
        "cellSpacing",
        "char",
        "charOff",
        "charSet",
        "checked",
        "clear",
        "colSpan",
        "color",
        "cols",
        "compact",
        "coords",
        "dateTime",
        "dir",
        // Note: `disabled` is technically allowed on all elements by GH.
        // But it is useless on everything except `input`.
        // Because `input`s are normally not allowed, but we allow them for
        // checkboxes due to tasklists, we allow `disabled` only there.
        "encType",
        "frame",
        "hSpace",
        "headers",
        "height",
        "hrefLang",
        "htmlFor",
        "id",
        "isMap",
        "itemProp",
        "label",
        "lang",
        "maxLength",
        "media",
        "method",
        "multiple",
        "name",
        "noHref",
        "noShade",
        "noWrap",
        "open",
        "prompt",
        "readOnly",
        "rev",
        "rowSpan",
        "rows",
        "rules",
        "scope",
        "selected",
        "shape",
        "size",
        "span",
        "start",
        "summary",
        "tabIndex",
        "title",
        "useMap",
        "vAlign",
        "value",
        "width"
      ]
    },
    clobber: ["ariaDescribedBy", "ariaLabelledBy", "id", "name"],
    clobberPrefix: "user-content-",
    protocols: {
      cite: ["http", "https"],
      href: ["http", "https", "irc", "ircs", "mailto", "xmpp"],
      longDesc: ["http", "https"],
      src: ["http", "https"]
    },
    required: {
      input: { disabled: true, type: "checkbox" }
    },
    strip: ["script"],
    tagNames: [
      "a",
      "b",
      "blockquote",
      "br",
      "code",
      "dd",
      "del",
      "details",
      "div",
      "dl",
      "dt",
      "em",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "hr",
      "i",
      "img",
      // Note: `input` is not normally allowed by GH, when manually writing
      // it in markdown, they add it from tasklists some other way.
      // We can’t do that, so we have to allow it.
      "input",
      "ins",
      "kbd",
      "li",
      "ol",
      "p",
      "picture",
      "pre",
      "q",
      "rp",
      "rt",
      "ruby",
      "s",
      "samp",
      "section",
      "source",
      "span",
      "strike",
      "strong",
      "sub",
      "summary",
      "sup",
      "table",
      "tbody",
      "td",
      "tfoot",
      "th",
      "thead",
      "tr",
      "tt",
      "ul",
      "var"
    ]
  };

  // node_modules/hast-util-sanitize/lib/index.js
  var own5 = {}.hasOwnProperty;
  function sanitize(node2, options) {
    let result = { type: "root", children: [] };
    const state = {
      schema: options ? { ...defaultSchema, ...options } : defaultSchema,
      stack: []
    };
    const replace2 = transform2(state, node2);
    if (replace2) {
      if (Array.isArray(replace2)) {
        if (replace2.length === 1) {
          result = replace2[0];
        } else {
          result.children = replace2;
        }
      } else {
        result = replace2;
      }
    }
    return result;
  }
  function transform2(state, node2) {
    if (node2 && typeof node2 === "object") {
      const unsafe = (
        /** @type {Record<string, Readonly<unknown>>} */
        node2
      );
      const type = typeof unsafe.type === "string" ? unsafe.type : "";
      switch (type) {
        case "comment": {
          return comment2(state, unsafe);
        }
        case "doctype": {
          return doctype2(state, unsafe);
        }
        case "element": {
          return element4(state, unsafe);
        }
        case "root": {
          return root4(state, unsafe);
        }
        case "text": {
          return text7(state, unsafe);
        }
        default:
      }
    }
  }
  function comment2(state, unsafe) {
    if (state.schema.allowComments) {
      const result = typeof unsafe.value === "string" ? unsafe.value : "";
      const index2 = result.indexOf("-->");
      const value = index2 < 0 ? result : result.slice(0, index2);
      const node2 = { type: "comment", value };
      patch2(node2, unsafe);
      return node2;
    }
  }
  function doctype2(state, unsafe) {
    if (state.schema.allowDoctypes) {
      const node2 = { type: "doctype" };
      patch2(node2, unsafe);
      return node2;
    }
  }
  function element4(state, unsafe) {
    const name = typeof unsafe.tagName === "string" ? unsafe.tagName : "";
    state.stack.push(name);
    const content3 = (
      /** @type {Array<ElementContent>} */
      children(state, unsafe.children)
    );
    const properties_ = properties(state, unsafe.properties);
    state.stack.pop();
    let safeElement = false;
    if (name && name !== "*" && (!state.schema.tagNames || state.schema.tagNames.includes(name))) {
      safeElement = true;
      if (state.schema.ancestors && own5.call(state.schema.ancestors, name)) {
        const ancestors = state.schema.ancestors[name];
        let index2 = -1;
        safeElement = false;
        while (++index2 < ancestors.length) {
          if (state.stack.includes(ancestors[index2])) {
            safeElement = true;
          }
        }
      }
    }
    if (!safeElement) {
      return state.schema.strip && !state.schema.strip.includes(name) ? content3 : void 0;
    }
    const node2 = {
      type: "element",
      tagName: name,
      properties: properties_,
      children: content3
    };
    patch2(node2, unsafe);
    return node2;
  }
  function root4(state, unsafe) {
    const content3 = (
      /** @type {Array<RootContent>} */
      children(state, unsafe.children)
    );
    const node2 = { type: "root", children: content3 };
    patch2(node2, unsafe);
    return node2;
  }
  function text7(_, unsafe) {
    const value = typeof unsafe.value === "string" ? unsafe.value : "";
    const node2 = { type: "text", value };
    patch2(node2, unsafe);
    return node2;
  }
  function children(state, children2) {
    const results = [];
    if (Array.isArray(children2)) {
      const childrenUnknown = (
        /** @type {Array<Readonly<unknown>>} */
        children2
      );
      let index2 = -1;
      while (++index2 < childrenUnknown.length) {
        const value = transform2(state, childrenUnknown[index2]);
        if (value) {
          if (Array.isArray(value)) {
            results.push(...value);
          } else {
            results.push(value);
          }
        }
      }
    }
    return results;
  }
  function properties(state, properties2) {
    const tagName = state.stack[state.stack.length - 1];
    const attributes = state.schema.attributes;
    const required = state.schema.required;
    const specific = attributes && own5.call(attributes, tagName) ? attributes[tagName] : void 0;
    const defaults = attributes && own5.call(attributes, "*") ? attributes["*"] : void 0;
    const properties_ = (
      /** @type {Readonly<Record<string, Readonly<unknown>>>} */
      properties2 && typeof properties2 === "object" ? properties2 : {}
    );
    const result = {};
    let key2;
    for (key2 in properties_) {
      if (own5.call(properties_, key2)) {
        const unsafe = properties_[key2];
        let safe = propertyValue(
          state,
          findDefinition(specific, key2),
          key2,
          unsafe
        );
        if (safe === null || safe === void 0) {
          safe = propertyValue(state, findDefinition(defaults, key2), key2, unsafe);
        }
        if (safe !== null && safe !== void 0) {
          result[key2] = safe;
        }
      }
    }
    if (required && own5.call(required, tagName)) {
      const properties3 = required[tagName];
      for (key2 in properties3) {
        if (own5.call(properties3, key2) && !own5.call(result, key2)) {
          result[key2] = properties3[key2];
        }
      }
    }
    return result;
  }
  function propertyValue(state, definition3, key2, value) {
    return definition3 ? Array.isArray(value) ? propertyValueMany(state, definition3, key2, value) : propertyValuePrimitive(state, definition3, key2, value) : void 0;
  }
  function propertyValueMany(state, definition3, key2, values) {
    let index2 = -1;
    const result = [];
    while (++index2 < values.length) {
      const value = propertyValuePrimitive(state, definition3, key2, values[index2]);
      if (typeof value === "number" || typeof value === "string") {
        result.push(value);
      }
    }
    return result;
  }
  function propertyValuePrimitive(state, definition3, key2, value) {
    if (typeof value !== "boolean" && typeof value !== "number" && typeof value !== "string") {
      return;
    }
    if (!safeProtocol(state, key2, value)) {
      return;
    }
    if (typeof definition3 === "object" && definition3.length > 1) {
      let ok3 = false;
      let index2 = 0;
      while (++index2 < definition3.length) {
        const allowed = definition3[index2];
        if (allowed && typeof allowed === "object" && "flags" in allowed) {
          if (allowed.test(String(value))) {
            ok3 = true;
            break;
          }
        } else if (allowed === value) {
          ok3 = true;
          break;
        }
      }
      if (!ok3) return;
    }
    return state.schema.clobber && state.schema.clobberPrefix && state.schema.clobber.includes(key2) ? state.schema.clobberPrefix + value : value;
  }
  function safeProtocol(state, key2, value) {
    const protocols = state.schema.protocols && own5.call(state.schema.protocols, key2) ? state.schema.protocols[key2] : void 0;
    if (!protocols || protocols.length === 0) {
      return true;
    }
    const url = String(value);
    const colon = url.indexOf(":");
    const questionMark = url.indexOf("?");
    const numberSign = url.indexOf("#");
    const slash = url.indexOf("/");
    if (colon < 0 || // If the first colon is after a `?`, `#`, or `/`, it’s not a protocol.
    slash > -1 && colon > slash || questionMark > -1 && colon > questionMark || numberSign > -1 && colon > numberSign) {
      return true;
    }
    let index2 = -1;
    while (++index2 < protocols.length) {
      const protocol = protocols[index2];
      if (colon === protocol.length && url.slice(0, protocol.length) === protocol) {
        return true;
      }
    }
    return false;
  }
  function patch2(node2, unsafe) {
    const cleanPosition = position2(
      // @ts-expect-error: looks like a node.
      unsafe
    );
    if (unsafe.data) {
      node2.data = esm_default(unsafe.data);
    }
    if (cleanPosition) node2.position = cleanPosition;
  }
  function findDefinition(definitions, key2) {
    let dataDefault;
    let index2 = -1;
    if (definitions) {
      while (++index2 < definitions.length) {
        const entry = definitions[index2];
        const name = typeof entry === "string" ? entry : entry[0];
        if (name === key2) {
          return entry;
        }
        if (name === "data*") dataDefault = entry;
      }
    }
    if (key2.length > 4 && key2.slice(0, 4).toLowerCase() === "data") {
      return dataDefault;
    }
  }

  // node_modules/rehype-sanitize/lib/index.js
  function rehypeSanitize(options) {
    return function(tree) {
      const result = (
        /** @type {Root} */
        sanitize(tree, options)
      );
      return result;
    };
  }

  // node_modules/html-void-elements/index.js
  var htmlVoidElements = [
    "area",
    "base",
    "basefont",
    "bgsound",
    "br",
    "col",
    "command",
    "embed",
    "frame",
    "hr",
    "image",
    "img",
    "input",
    "keygen",
    "link",
    "meta",
    "param",
    "source",
    "track",
    "wbr"
  ];

  // node_modules/stringify-entities/lib/core.js
  var defaultSubsetRegex = /["&'<>`]/g;
  var surrogatePairsRegex = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;
  var controlCharactersRegex = (
    // eslint-disable-next-line no-control-regex, unicorn/no-hex-escape
    /[\x01-\t\v\f\x0E-\x1F\x7F\x81\x8D\x8F\x90\x9D\xA0-\uFFFF]/g
  );
  var regexEscapeRegex = /[|\\{}()[\]^$+*?.]/g;
  var subsetToRegexCache = /* @__PURE__ */ new WeakMap();
  function core(value, options) {
    value = value.replace(
      options.subset ? charactersToExpressionCached(options.subset) : defaultSubsetRegex,
      basic
    );
    if (options.subset || options.escapeOnly) {
      return value;
    }
    return value.replace(surrogatePairsRegex, surrogate).replace(controlCharactersRegex, basic);
    function surrogate(pair, index2, all4) {
      return options.format(
        (pair.charCodeAt(0) - 55296) * 1024 + pair.charCodeAt(1) - 56320 + 65536,
        all4.charCodeAt(index2 + 2),
        options
      );
    }
    function basic(character, index2, all4) {
      return options.format(
        character.charCodeAt(0),
        all4.charCodeAt(index2 + 1),
        options
      );
    }
  }
  function charactersToExpressionCached(subset) {
    let cached = subsetToRegexCache.get(subset);
    if (!cached) {
      cached = charactersToExpression(subset);
      subsetToRegexCache.set(subset, cached);
    }
    return cached;
  }
  function charactersToExpression(subset) {
    const groups = [];
    let index2 = -1;
    while (++index2 < subset.length) {
      groups.push(subset[index2].replace(regexEscapeRegex, "\\$&"));
    }
    return new RegExp("(?:" + groups.join("|") + ")", "g");
  }

  // node_modules/stringify-entities/lib/util/to-hexadecimal.js
  var hexadecimalRegex = /[\dA-Fa-f]/;
  function toHexadecimal(code4, next, omit) {
    const value = "&#x" + code4.toString(16).toUpperCase();
    return omit && next && !hexadecimalRegex.test(String.fromCharCode(next)) ? value : value + ";";
  }

  // node_modules/stringify-entities/lib/util/to-decimal.js
  var decimalRegex = /\d/;
  function toDecimal(code4, next, omit) {
    const value = "&#" + String(code4);
    return omit && next && !decimalRegex.test(String.fromCharCode(next)) ? value : value + ";";
  }

  // node_modules/character-entities-legacy/index.js
  var characterEntitiesLegacy = [
    "AElig",
    "AMP",
    "Aacute",
    "Acirc",
    "Agrave",
    "Aring",
    "Atilde",
    "Auml",
    "COPY",
    "Ccedil",
    "ETH",
    "Eacute",
    "Ecirc",
    "Egrave",
    "Euml",
    "GT",
    "Iacute",
    "Icirc",
    "Igrave",
    "Iuml",
    "LT",
    "Ntilde",
    "Oacute",
    "Ocirc",
    "Ograve",
    "Oslash",
    "Otilde",
    "Ouml",
    "QUOT",
    "REG",
    "THORN",
    "Uacute",
    "Ucirc",
    "Ugrave",
    "Uuml",
    "Yacute",
    "aacute",
    "acirc",
    "acute",
    "aelig",
    "agrave",
    "amp",
    "aring",
    "atilde",
    "auml",
    "brvbar",
    "ccedil",
    "cedil",
    "cent",
    "copy",
    "curren",
    "deg",
    "divide",
    "eacute",
    "ecirc",
    "egrave",
    "eth",
    "euml",
    "frac12",
    "frac14",
    "frac34",
    "gt",
    "iacute",
    "icirc",
    "iexcl",
    "igrave",
    "iquest",
    "iuml",
    "laquo",
    "lt",
    "macr",
    "micro",
    "middot",
    "nbsp",
    "not",
    "ntilde",
    "oacute",
    "ocirc",
    "ograve",
    "ordf",
    "ordm",
    "oslash",
    "otilde",
    "ouml",
    "para",
    "plusmn",
    "pound",
    "quot",
    "raquo",
    "reg",
    "sect",
    "shy",
    "sup1",
    "sup2",
    "sup3",
    "szlig",
    "thorn",
    "times",
    "uacute",
    "ucirc",
    "ugrave",
    "uml",
    "uuml",
    "yacute",
    "yen",
    "yuml"
  ];

  // node_modules/character-entities-html4/index.js
  var characterEntitiesHtml4 = {
    nbsp: "\xA0",
    iexcl: "\xA1",
    cent: "\xA2",
    pound: "\xA3",
    curren: "\xA4",
    yen: "\xA5",
    brvbar: "\xA6",
    sect: "\xA7",
    uml: "\xA8",
    copy: "\xA9",
    ordf: "\xAA",
    laquo: "\xAB",
    not: "\xAC",
    shy: "\xAD",
    reg: "\xAE",
    macr: "\xAF",
    deg: "\xB0",
    plusmn: "\xB1",
    sup2: "\xB2",
    sup3: "\xB3",
    acute: "\xB4",
    micro: "\xB5",
    para: "\xB6",
    middot: "\xB7",
    cedil: "\xB8",
    sup1: "\xB9",
    ordm: "\xBA",
    raquo: "\xBB",
    frac14: "\xBC",
    frac12: "\xBD",
    frac34: "\xBE",
    iquest: "\xBF",
    Agrave: "\xC0",
    Aacute: "\xC1",
    Acirc: "\xC2",
    Atilde: "\xC3",
    Auml: "\xC4",
    Aring: "\xC5",
    AElig: "\xC6",
    Ccedil: "\xC7",
    Egrave: "\xC8",
    Eacute: "\xC9",
    Ecirc: "\xCA",
    Euml: "\xCB",
    Igrave: "\xCC",
    Iacute: "\xCD",
    Icirc: "\xCE",
    Iuml: "\xCF",
    ETH: "\xD0",
    Ntilde: "\xD1",
    Ograve: "\xD2",
    Oacute: "\xD3",
    Ocirc: "\xD4",
    Otilde: "\xD5",
    Ouml: "\xD6",
    times: "\xD7",
    Oslash: "\xD8",
    Ugrave: "\xD9",
    Uacute: "\xDA",
    Ucirc: "\xDB",
    Uuml: "\xDC",
    Yacute: "\xDD",
    THORN: "\xDE",
    szlig: "\xDF",
    agrave: "\xE0",
    aacute: "\xE1",
    acirc: "\xE2",
    atilde: "\xE3",
    auml: "\xE4",
    aring: "\xE5",
    aelig: "\xE6",
    ccedil: "\xE7",
    egrave: "\xE8",
    eacute: "\xE9",
    ecirc: "\xEA",
    euml: "\xEB",
    igrave: "\xEC",
    iacute: "\xED",
    icirc: "\xEE",
    iuml: "\xEF",
    eth: "\xF0",
    ntilde: "\xF1",
    ograve: "\xF2",
    oacute: "\xF3",
    ocirc: "\xF4",
    otilde: "\xF5",
    ouml: "\xF6",
    divide: "\xF7",
    oslash: "\xF8",
    ugrave: "\xF9",
    uacute: "\xFA",
    ucirc: "\xFB",
    uuml: "\xFC",
    yacute: "\xFD",
    thorn: "\xFE",
    yuml: "\xFF",
    fnof: "\u0192",
    Alpha: "\u0391",
    Beta: "\u0392",
    Gamma: "\u0393",
    Delta: "\u0394",
    Epsilon: "\u0395",
    Zeta: "\u0396",
    Eta: "\u0397",
    Theta: "\u0398",
    Iota: "\u0399",
    Kappa: "\u039A",
    Lambda: "\u039B",
    Mu: "\u039C",
    Nu: "\u039D",
    Xi: "\u039E",
    Omicron: "\u039F",
    Pi: "\u03A0",
    Rho: "\u03A1",
    Sigma: "\u03A3",
    Tau: "\u03A4",
    Upsilon: "\u03A5",
    Phi: "\u03A6",
    Chi: "\u03A7",
    Psi: "\u03A8",
    Omega: "\u03A9",
    alpha: "\u03B1",
    beta: "\u03B2",
    gamma: "\u03B3",
    delta: "\u03B4",
    epsilon: "\u03B5",
    zeta: "\u03B6",
    eta: "\u03B7",
    theta: "\u03B8",
    iota: "\u03B9",
    kappa: "\u03BA",
    lambda: "\u03BB",
    mu: "\u03BC",
    nu: "\u03BD",
    xi: "\u03BE",
    omicron: "\u03BF",
    pi: "\u03C0",
    rho: "\u03C1",
    sigmaf: "\u03C2",
    sigma: "\u03C3",
    tau: "\u03C4",
    upsilon: "\u03C5",
    phi: "\u03C6",
    chi: "\u03C7",
    psi: "\u03C8",
    omega: "\u03C9",
    thetasym: "\u03D1",
    upsih: "\u03D2",
    piv: "\u03D6",
    bull: "\u2022",
    hellip: "\u2026",
    prime: "\u2032",
    Prime: "\u2033",
    oline: "\u203E",
    frasl: "\u2044",
    weierp: "\u2118",
    image: "\u2111",
    real: "\u211C",
    trade: "\u2122",
    alefsym: "\u2135",
    larr: "\u2190",
    uarr: "\u2191",
    rarr: "\u2192",
    darr: "\u2193",
    harr: "\u2194",
    crarr: "\u21B5",
    lArr: "\u21D0",
    uArr: "\u21D1",
    rArr: "\u21D2",
    dArr: "\u21D3",
    hArr: "\u21D4",
    forall: "\u2200",
    part: "\u2202",
    exist: "\u2203",
    empty: "\u2205",
    nabla: "\u2207",
    isin: "\u2208",
    notin: "\u2209",
    ni: "\u220B",
    prod: "\u220F",
    sum: "\u2211",
    minus: "\u2212",
    lowast: "\u2217",
    radic: "\u221A",
    prop: "\u221D",
    infin: "\u221E",
    ang: "\u2220",
    and: "\u2227",
    or: "\u2228",
    cap: "\u2229",
    cup: "\u222A",
    int: "\u222B",
    there4: "\u2234",
    sim: "\u223C",
    cong: "\u2245",
    asymp: "\u2248",
    ne: "\u2260",
    equiv: "\u2261",
    le: "\u2264",
    ge: "\u2265",
    sub: "\u2282",
    sup: "\u2283",
    nsub: "\u2284",
    sube: "\u2286",
    supe: "\u2287",
    oplus: "\u2295",
    otimes: "\u2297",
    perp: "\u22A5",
    sdot: "\u22C5",
    lceil: "\u2308",
    rceil: "\u2309",
    lfloor: "\u230A",
    rfloor: "\u230B",
    lang: "\u2329",
    rang: "\u232A",
    loz: "\u25CA",
    spades: "\u2660",
    clubs: "\u2663",
    hearts: "\u2665",
    diams: "\u2666",
    quot: '"',
    amp: "&",
    lt: "<",
    gt: ">",
    OElig: "\u0152",
    oelig: "\u0153",
    Scaron: "\u0160",
    scaron: "\u0161",
    Yuml: "\u0178",
    circ: "\u02C6",
    tilde: "\u02DC",
    ensp: "\u2002",
    emsp: "\u2003",
    thinsp: "\u2009",
    zwnj: "\u200C",
    zwj: "\u200D",
    lrm: "\u200E",
    rlm: "\u200F",
    ndash: "\u2013",
    mdash: "\u2014",
    lsquo: "\u2018",
    rsquo: "\u2019",
    sbquo: "\u201A",
    ldquo: "\u201C",
    rdquo: "\u201D",
    bdquo: "\u201E",
    dagger: "\u2020",
    Dagger: "\u2021",
    permil: "\u2030",
    lsaquo: "\u2039",
    rsaquo: "\u203A",
    euro: "\u20AC"
  };

  // node_modules/stringify-entities/lib/constant/dangerous.js
  var dangerous = [
    "cent",
    "copy",
    "divide",
    "gt",
    "lt",
    "not",
    "para",
    "times"
  ];

  // node_modules/stringify-entities/lib/util/to-named.js
  var own6 = {}.hasOwnProperty;
  var characters = {};
  var key;
  for (key in characterEntitiesHtml4) {
    if (own6.call(characterEntitiesHtml4, key)) {
      characters[characterEntitiesHtml4[key]] = key;
    }
  }
  var notAlphanumericRegex = /[^\dA-Za-z]/;
  function toNamed(code4, next, omit, attribute) {
    const character = String.fromCharCode(code4);
    if (own6.call(characters, character)) {
      const name = characters[character];
      const value = "&" + name;
      if (omit && characterEntitiesLegacy.includes(name) && !dangerous.includes(name) && (!attribute || next && next !== 61 && notAlphanumericRegex.test(String.fromCharCode(next)))) {
        return value;
      }
      return value + ";";
    }
    return "";
  }

  // node_modules/stringify-entities/lib/util/format-smart.js
  function formatSmart(code4, next, options) {
    let numeric = toHexadecimal(code4, next, options.omitOptionalSemicolons);
    let named;
    if (options.useNamedReferences || options.useShortestReferences) {
      named = toNamed(
        code4,
        next,
        options.omitOptionalSemicolons,
        options.attribute
      );
    }
    if ((options.useShortestReferences || !named) && options.useShortestReferences) {
      const decimal = toDecimal(code4, next, options.omitOptionalSemicolons);
      if (decimal.length < numeric.length) {
        numeric = decimal;
      }
    }
    return named && (!options.useShortestReferences || named.length < numeric.length) ? named : numeric;
  }

  // node_modules/stringify-entities/lib/index.js
  function stringifyEntities(value, options) {
    return core(value, Object.assign({ format: formatSmart }, options));
  }

  // node_modules/hast-util-to-html/lib/handle/comment.js
  var htmlCommentRegex = /^>|^->|<!--|-->|--!>|<!-$/g;
  var bogusCommentEntitySubset = [">"];
  var commentEntitySubset = ["<", ">"];
  function comment3(node2, _1, _2, state) {
    return state.settings.bogusComments ? "<?" + stringifyEntities(
      node2.value,
      Object.assign({}, state.settings.characterReferences, {
        subset: bogusCommentEntitySubset
      })
    ) + ">" : "<!--" + node2.value.replace(htmlCommentRegex, encode) + "-->";
    function encode($0) {
      return stringifyEntities(
        $0,
        Object.assign({}, state.settings.characterReferences, {
          subset: commentEntitySubset
        })
      );
    }
  }

  // node_modules/hast-util-to-html/lib/handle/doctype.js
  function doctype3(_1, _2, _3, state) {
    return "<!" + (state.settings.upperDoctype ? "DOCTYPE" : "doctype") + (state.settings.tightDoctype ? "" : " ") + "html>";
  }

  // node_modules/hast-util-whitespace/lib/index.js
  var re = /[ \t\n\f\r]/g;
  function whitespace(thing) {
    return typeof thing === "object" ? thing.type === "text" ? empty2(thing.value) : false : empty2(thing);
  }
  function empty2(value) {
    return value.replace(re, "") === "";
  }

  // node_modules/hast-util-to-html/lib/omission/util/siblings.js
  var siblingAfter = siblings(1);
  var siblingBefore = siblings(-1);
  var emptyChildren = [];
  function siblings(increment2) {
    return sibling;
    function sibling(parent, index2, includeWhitespace) {
      const siblings2 = parent ? parent.children : emptyChildren;
      let offset = (index2 || 0) + increment2;
      let next = siblings2[offset];
      if (!includeWhitespace) {
        while (next && whitespace(next)) {
          offset += increment2;
          next = siblings2[offset];
        }
      }
      return next;
    }
  }

  // node_modules/hast-util-to-html/lib/omission/omission.js
  var own7 = {}.hasOwnProperty;
  function omission(handlers2) {
    return omit;
    function omit(node2, index2, parent) {
      return own7.call(handlers2, node2.tagName) && handlers2[node2.tagName](node2, index2, parent);
    }
  }

  // node_modules/hast-util-to-html/lib/omission/closing.js
  var closing = omission({
    body,
    caption: headOrColgroupOrCaption,
    colgroup: headOrColgroupOrCaption,
    dd,
    dt,
    head: headOrColgroupOrCaption,
    html: html5,
    li,
    optgroup,
    option,
    p: p2,
    rp: rubyElement,
    rt: rubyElement,
    tbody,
    td: cells,
    tfoot,
    th: cells,
    thead,
    tr
  });
  function headOrColgroupOrCaption(_, index2, parent) {
    const next = siblingAfter(parent, index2, true);
    return !next || next.type !== "comment" && !(next.type === "text" && whitespace(next.value.charAt(0)));
  }
  function html5(_, index2, parent) {
    const next = siblingAfter(parent, index2);
    return !next || next.type !== "comment";
  }
  function body(_, index2, parent) {
    const next = siblingAfter(parent, index2);
    return !next || next.type !== "comment";
  }
  function p2(_, index2, parent) {
    const next = siblingAfter(parent, index2);
    return next ? next.type === "element" && (next.tagName === "address" || next.tagName === "article" || next.tagName === "aside" || next.tagName === "blockquote" || next.tagName === "details" || next.tagName === "div" || next.tagName === "dl" || next.tagName === "fieldset" || next.tagName === "figcaption" || next.tagName === "figure" || next.tagName === "footer" || next.tagName === "form" || next.tagName === "h1" || next.tagName === "h2" || next.tagName === "h3" || next.tagName === "h4" || next.tagName === "h5" || next.tagName === "h6" || next.tagName === "header" || next.tagName === "hgroup" || next.tagName === "hr" || next.tagName === "main" || next.tagName === "menu" || next.tagName === "nav" || next.tagName === "ol" || next.tagName === "p" || next.tagName === "pre" || next.tagName === "section" || next.tagName === "table" || next.tagName === "ul") : !parent || // Confusing parent.
    !(parent.type === "element" && (parent.tagName === "a" || parent.tagName === "audio" || parent.tagName === "del" || parent.tagName === "ins" || parent.tagName === "map" || parent.tagName === "noscript" || parent.tagName === "video"));
  }
  function li(_, index2, parent) {
    const next = siblingAfter(parent, index2);
    return !next || next.type === "element" && next.tagName === "li";
  }
  function dt(_, index2, parent) {
    const next = siblingAfter(parent, index2);
    return Boolean(
      next && next.type === "element" && (next.tagName === "dt" || next.tagName === "dd")
    );
  }
  function dd(_, index2, parent) {
    const next = siblingAfter(parent, index2);
    return !next || next.type === "element" && (next.tagName === "dt" || next.tagName === "dd");
  }
  function rubyElement(_, index2, parent) {
    const next = siblingAfter(parent, index2);
    return !next || next.type === "element" && (next.tagName === "rp" || next.tagName === "rt");
  }
  function optgroup(_, index2, parent) {
    const next = siblingAfter(parent, index2);
    return !next || next.type === "element" && next.tagName === "optgroup";
  }
  function option(_, index2, parent) {
    const next = siblingAfter(parent, index2);
    return !next || next.type === "element" && (next.tagName === "option" || next.tagName === "optgroup");
  }
  function thead(_, index2, parent) {
    const next = siblingAfter(parent, index2);
    return Boolean(
      next && next.type === "element" && (next.tagName === "tbody" || next.tagName === "tfoot")
    );
  }
  function tbody(_, index2, parent) {
    const next = siblingAfter(parent, index2);
    return !next || next.type === "element" && (next.tagName === "tbody" || next.tagName === "tfoot");
  }
  function tfoot(_, index2, parent) {
    return !siblingAfter(parent, index2);
  }
  function tr(_, index2, parent) {
    const next = siblingAfter(parent, index2);
    return !next || next.type === "element" && next.tagName === "tr";
  }
  function cells(_, index2, parent) {
    const next = siblingAfter(parent, index2);
    return !next || next.type === "element" && (next.tagName === "td" || next.tagName === "th");
  }

  // node_modules/hast-util-to-html/lib/omission/opening.js
  var opening = omission({
    body: body2,
    colgroup,
    head,
    html: html6,
    tbody: tbody2
  });
  function html6(node2) {
    const head2 = siblingAfter(node2, -1);
    return !head2 || head2.type !== "comment";
  }
  function head(node2) {
    const seen = /* @__PURE__ */ new Set();
    for (const child2 of node2.children) {
      if (child2.type === "element" && (child2.tagName === "base" || child2.tagName === "title")) {
        if (seen.has(child2.tagName)) return false;
        seen.add(child2.tagName);
      }
    }
    const child = node2.children[0];
    return !child || child.type === "element";
  }
  function body2(node2) {
    const head2 = siblingAfter(node2, -1, true);
    return !head2 || head2.type !== "comment" && !(head2.type === "text" && whitespace(head2.value.charAt(0))) && !(head2.type === "element" && (head2.tagName === "meta" || head2.tagName === "link" || head2.tagName === "script" || head2.tagName === "style" || head2.tagName === "template"));
  }
  function colgroup(node2, index2, parent) {
    const previous4 = siblingBefore(parent, index2);
    const head2 = siblingAfter(node2, -1, true);
    if (parent && previous4 && previous4.type === "element" && previous4.tagName === "colgroup" && closing(previous4, parent.children.indexOf(previous4), parent)) {
      return false;
    }
    return Boolean(head2 && head2.type === "element" && head2.tagName === "col");
  }
  function tbody2(node2, index2, parent) {
    const previous4 = siblingBefore(parent, index2);
    const head2 = siblingAfter(node2, -1);
    if (parent && previous4 && previous4.type === "element" && (previous4.tagName === "thead" || previous4.tagName === "tbody") && closing(previous4, parent.children.indexOf(previous4), parent)) {
      return false;
    }
    return Boolean(head2 && head2.type === "element" && head2.tagName === "tr");
  }

  // node_modules/hast-util-to-html/lib/handle/element.js
  var constants = {
    // See: <https://html.spec.whatwg.org/#attribute-name-state>.
    name: [
      ["	\n\f\r &/=>".split(""), "	\n\f\r \"&'/=>`".split("")],
      [`\0	
\f\r "&'/<=>`.split(""), "\0	\n\f\r \"&'/<=>`".split("")]
    ],
    // See: <https://html.spec.whatwg.org/#attribute-value-(unquoted)-state>.
    unquoted: [
      ["	\n\f\r &>".split(""), "\0	\n\f\r \"&'<=>`".split("")],
      ["\0	\n\f\r \"&'<=>`".split(""), "\0	\n\f\r \"&'<=>`".split("")]
    ],
    // See: <https://html.spec.whatwg.org/#attribute-value-(single-quoted)-state>.
    single: [
      ["&'".split(""), "\"&'`".split("")],
      ["\0&'".split(""), "\0\"&'`".split("")]
    ],
    // See: <https://html.spec.whatwg.org/#attribute-value-(double-quoted)-state>.
    double: [
      ['"&'.split(""), "\"&'`".split("")],
      ['\0"&'.split(""), "\0\"&'`".split("")]
    ]
  };
  function element5(node2, index2, parent, state) {
    const schema = state.schema;
    const omit = schema.space === "svg" ? false : state.settings.omitOptionalTags;
    let selfClosing = schema.space === "svg" ? state.settings.closeEmptyElements : state.settings.voids.includes(node2.tagName.toLowerCase());
    const parts = [];
    let last;
    if (schema.space === "html" && node2.tagName === "svg") {
      state.schema = svg2;
    }
    const attributes = serializeAttributes(state, node2.properties);
    const content3 = state.all(
      schema.space === "html" && node2.tagName === "template" ? node2.content : node2
    );
    state.schema = schema;
    if (content3) selfClosing = false;
    if (attributes || !omit || !opening(node2, index2, parent)) {
      parts.push("<", node2.tagName, attributes ? " " + attributes : "");
      if (selfClosing && (schema.space === "svg" || state.settings.closeSelfClosing)) {
        last = attributes.charAt(attributes.length - 1);
        if (!state.settings.tightSelfClosing || last === "/" || last && last !== '"' && last !== "'") {
          parts.push(" ");
        }
        parts.push("/");
      }
      parts.push(">");
    }
    parts.push(content3);
    if (!selfClosing && (!omit || !closing(node2, index2, parent))) {
      parts.push("</" + node2.tagName + ">");
    }
    return parts.join("");
  }
  function serializeAttributes(state, properties2) {
    const values = [];
    let index2 = -1;
    let key2;
    if (properties2) {
      for (key2 in properties2) {
        if (properties2[key2] !== null && properties2[key2] !== void 0) {
          const value = serializeAttribute(state, key2, properties2[key2]);
          if (value) values.push(value);
        }
      }
    }
    while (++index2 < values.length) {
      const last = state.settings.tightAttributes ? values[index2].charAt(values[index2].length - 1) : void 0;
      if (index2 !== values.length - 1 && last !== '"' && last !== "'") {
        values[index2] += " ";
      }
    }
    return values.join("");
  }
  function serializeAttribute(state, key2, value) {
    const info = find(state.schema, key2);
    const x = state.settings.allowParseErrors && state.schema.space === "html" ? 0 : 1;
    const y = state.settings.allowDangerousCharacters ? 0 : 1;
    let quote = state.quote;
    let result;
    if (info.overloadedBoolean && (value === info.attribute || value === "")) {
      value = true;
    } else if ((info.boolean || info.overloadedBoolean) && (typeof value !== "string" || value === info.attribute || value === "")) {
      value = Boolean(value);
    }
    if (value === null || value === void 0 || value === false || typeof value === "number" && Number.isNaN(value)) {
      return "";
    }
    const name = stringifyEntities(
      info.attribute,
      Object.assign({}, state.settings.characterReferences, {
        // Always encode without parse errors in non-HTML.
        subset: constants.name[x][y]
      })
    );
    if (value === true) return name;
    value = Array.isArray(value) ? (info.commaSeparated ? stringify : stringify2)(value, {
      padLeft: !state.settings.tightCommaSeparatedLists
    }) : String(value);
    if (state.settings.collapseEmptyAttributes && !value) return name;
    if (state.settings.preferUnquoted) {
      result = stringifyEntities(
        value,
        Object.assign({}, state.settings.characterReferences, {
          attribute: true,
          subset: constants.unquoted[x][y]
        })
      );
    }
    if (result !== value) {
      if (state.settings.quoteSmart && ccount(value, quote) > ccount(value, state.alternative)) {
        quote = state.alternative;
      }
      result = quote + stringifyEntities(
        value,
        Object.assign({}, state.settings.characterReferences, {
          // Always encode without parse errors in non-HTML.
          subset: (quote === "'" ? constants.single : constants.double)[x][y],
          attribute: true
        })
      ) + quote;
    }
    return name + (result ? "=" + result : result);
  }

  // node_modules/hast-util-to-html/lib/handle/text.js
  var textEntitySubset = ["<", "&"];
  function text8(node2, _, parent, state) {
    return parent && parent.type === "element" && (parent.tagName === "script" || parent.tagName === "style") ? node2.value : stringifyEntities(
      node2.value,
      Object.assign({}, state.settings.characterReferences, {
        subset: textEntitySubset
      })
    );
  }

  // node_modules/hast-util-to-html/lib/handle/raw.js
  function raw(node2, index2, parent, state) {
    return state.settings.allowDangerousHtml ? node2.value : text8(node2, index2, parent, state);
  }

  // node_modules/hast-util-to-html/lib/handle/root.js
  function root5(node2, _1, _2, state) {
    return state.all(node2);
  }

  // node_modules/hast-util-to-html/lib/handle/index.js
  var handle2 = zwitch("type", {
    invalid,
    unknown,
    handlers: { comment: comment3, doctype: doctype3, element: element5, raw, root: root5, text: text8 }
  });
  function invalid(node2) {
    throw new Error("Expected node, not `" + node2 + "`");
  }
  function unknown(node_) {
    const node2 = (
      /** @type {Nodes} */
      node_
    );
    throw new Error("Cannot compile unknown node `" + node2.type + "`");
  }

  // node_modules/hast-util-to-html/lib/index.js
  var emptyOptions6 = {};
  var emptyCharacterReferences = {};
  var emptyChildren2 = [];
  function toHtml(tree, options) {
    const options_ = options || emptyOptions6;
    const quote = options_.quote || '"';
    const alternative = quote === '"' ? "'" : '"';
    if (quote !== '"' && quote !== "'") {
      throw new Error("Invalid quote `" + quote + "`, expected `'` or `\"`");
    }
    const state = {
      one: one3,
      all: all3,
      settings: {
        omitOptionalTags: options_.omitOptionalTags || false,
        allowParseErrors: options_.allowParseErrors || false,
        allowDangerousCharacters: options_.allowDangerousCharacters || false,
        quoteSmart: options_.quoteSmart || false,
        preferUnquoted: options_.preferUnquoted || false,
        tightAttributes: options_.tightAttributes || false,
        upperDoctype: options_.upperDoctype || false,
        tightDoctype: options_.tightDoctype || false,
        bogusComments: options_.bogusComments || false,
        tightCommaSeparatedLists: options_.tightCommaSeparatedLists || false,
        tightSelfClosing: options_.tightSelfClosing || false,
        collapseEmptyAttributes: options_.collapseEmptyAttributes || false,
        allowDangerousHtml: options_.allowDangerousHtml || false,
        voids: options_.voids || htmlVoidElements,
        characterReferences: options_.characterReferences || emptyCharacterReferences,
        closeSelfClosing: options_.closeSelfClosing || false,
        closeEmptyElements: options_.closeEmptyElements || false
      },
      schema: options_.space === "svg" ? svg2 : html4,
      quote,
      alternative
    };
    return state.one(
      Array.isArray(tree) ? { type: "root", children: tree } : tree,
      void 0,
      void 0
    );
  }
  function one3(node2, index2, parent) {
    return handle2(node2, index2, parent, this);
  }
  function all3(parent) {
    const results = [];
    const children2 = parent && parent.children || emptyChildren2;
    let index2 = -1;
    while (++index2 < children2.length) {
      results[index2] = this.one(children2[index2], index2, parent);
    }
    return results.join("");
  }

  // node_modules/rehype-stringify/lib/index.js
  function rehypeStringify(options) {
    const self2 = this;
    const settings = { ...self2.data("settings"), ...options };
    self2.compiler = compiler2;
    function compiler2(tree) {
      return toHtml(tree, settings);
    }
  }

  // src/infrastructure/renderers/MarkdownRenderer.tsx
  var import_jsx_runtime3 = __require("react/jsx-runtime");
  var katexSchema = {
    ...defaultSchema,
    tagNames: [
      ...defaultSchema.tagNames,
      "math",
      "semantics",
      "mrow",
      "mi",
      "mn",
      "mo",
      "ms",
      "mspace",
      "mtext",
      "mphantom",
      "mfrac",
      "msqrt",
      "mroot",
      "mstyle",
      "msub",
      "msup",
      "msubsup",
      "mover",
      "munder",
      "munderover",
      "mmultiscripts",
      "mprescripts",
      "none",
      "mtable",
      "mtr",
      "mtd",
      "menclose",
      "merror",
      "mfenced",
      "annotation",
      "svg",
      "path",
      "defs"
    ],
    attributes: {
      ...defaultSchema.attributes,
      "*": [
        ...defaultSchema.attributes["*"] ?? [],
        "className",
        "ariaHidden",
        "style"
      ],
      annotation: [...defaultSchema.attributes["annotation"] ?? [], "encoding"],
      svg: [
        ...defaultSchema.attributes["svg"] ?? [],
        "xmlns",
        "viewBox",
        "width",
        "height",
        "focusable",
        "role",
        "ariaHidden",
        "preserveAspectRatio"
      ],
      path: [
        ...defaultSchema.attributes["path"] ?? [],
        "d",
        "stroke",
        "strokeWidth",
        "strokeLinecap",
        "strokeLinejoin",
        "fill",
        "fillRule",
        "clipRule"
      ],
      mspace: [...defaultSchema.attributes["mspace"] ?? [], "width", "height", "depth"],
      math: [...defaultSchema.attributes["math"] ?? [], "xmlns", "display"]
    }
  };
  var buildProcessor = (config) => {
    let processor = unified();
    processor = processor.use(remarkParse).use(remarkGfm).use(remarkMath);
    for (const plugin of config?.remarkPlugins ?? []) {
      processor = processor.use(plugin);
    }
    processor = processor.use(remarkRehype, { allowDangerousHtml: true }).use(rehypeKatex, config?.katex);
    for (const plugin of config?.rehypePlugins ?? []) {
      processor = processor.use(plugin);
    }
    return processor.use(rehypeSanitize, katexSchema).use(rehypeStringify);
  };
  var createMarkdownRenderer = (defaultBox) => {
    let processor = null;
    let configKey = "";
    return {
      render: (element6, config) => {
        const renderBox = element6.renderBox || defaultBox;
        const key2 = JSON.stringify({
          katex: config?.katex ?? null,
          remarkPlugins: config?.remarkPlugins ?? null,
          rehypePlugins: config?.rehypePlugins ?? null
        });
        if (!processor || key2 !== configKey) {
          processor = buildProcessor(config);
          configKey = key2;
        }
        let html7;
        try {
          html7 = String(processor.processSync(element6.rawContent));
        } catch (error) {
          html7 = `<div class="likbez-error"><strong>Markdown error:</strong><pre>${String(error)}</pre></div>`;
        }
        return {
          elementId: element6.id,
          type: element6.type,
          box: renderBox,
          content: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "likbez-markdown", children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
            "div",
            {
              dangerouslySetInnerHTML: { __html: html7 }
            }
          ) })
        };
      }
    };
  };

  // src/infrastructure/renderers/CustomRenderer.tsx
  var import_jsx_runtime4 = __require("react/jsx-runtime");
  var createCustomRenderer = (defaultBox) => {
    return {
      render: (element6, customConfigs) => {
        const config = customConfigs.find((c) => c.type === element6.metadata?.customType);
        const renderBox = element6.renderBox || defaultBox;
        if (!config || !config.render) {
          return {
            elementId: element6.id,
            type: element6.type,
            box: renderBox,
            content: /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "likbez-error", children: [
              "Unknown custom element: ",
              String(element6.metadata?.customType)
            ] })
          };
        }
        return {
          elementId: element6.id,
          type: element6.type,
          box: renderBox,
          content: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "likbez-custom", children: config.render(element6) })
        };
      }
    };
  };

  // src/presentation/components/LikbezText.tsx
  var import_react = __toESM(__require("react"));
  var import_jsx_runtime5 = __require("react/jsx-runtime");
  var EMPTY_CUSTOM_ELEMENTS = [];
  var defaultRenderBox2 = {
    dimensions: { width: "auto", height: "auto" }
  };
  var LikbezText = ({
    source,
    theme,
    parserOptions,
    defaultBox,
    customBoxes,
    customElements = EMPTY_CUSTOM_ELEMENTS,
    siglumConfig,
    katexConfig,
    style: style2,
    className
  }) => {
    const [siglumReady, setSiglumReady] = (0, import_react.useState)(false);
    const siglumRendererRef = (0, import_react.useRef)(null);
    const siglumResultsRef = (0, import_react.useRef)({});
    const [siglumResultsMap, setSiglumResultsMap] = (0, import_react.useState)({});
    const siglumIdsRef = (0, import_react.useRef)(/* @__PURE__ */ new Set());
    const abortControllerRef = (0, import_react.useRef)(null);
    const renderBox = (0, import_react.useMemo)(() => defaultBox || defaultRenderBox2, [defaultBox]);
    const parserFn = (0, import_react.useMemo)(() => createParser({ ...parserOptions, customElements }), [parserOptions, customElements]);
    const markdownRenderer = (0, import_react.useMemo)(() => createMarkdownRenderer(renderBox), [renderBox]);
    const parsedDocument = (0, import_react.useMemo)(() => {
      try {
        return parserFn(source);
      } catch (error) {
        console.error("Parse error:", error);
        return { elements: [] };
      }
    }, [source, parserFn]);
    console.log("[LIKBEZ] source length:", source?.length, "elements:", parsedDocument?.elements?.length);
    (0, import_react.useEffect)(() => {
      if (siglumConfig?.autoInit !== false) {
        const renderer = createSiglumRenderer(renderBox);
        siglumRendererRef.current = renderer;
        renderer.init(siglumConfig).then(() => {
          console.log("[LIKBEZ] siglum init resolved");
          setSiglumReady(true);
        }).catch((e) => {
          console.error("[LIKBEZ] siglum init error:", e);
        });
      }
      return () => {
        siglumRendererRef.current?.destroy();
        siglumRendererRef.current = null;
      };
    }, []);
    (0, import_react.useEffect)(() => {
      console.log("[LIKBEZ] siglum effect: siglumReady=", siglumReady, "rendererRef=", !!siglumRendererRef.current);
      if (!siglumReady || !siglumRendererRef.current) return;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();
      const renderer = siglumRendererRef.current;
      const currentResults = {};
      const currentIds = /* @__PURE__ */ new Set();
      const renderSiglumElements = async () => {
        const siglumElements = parsedDocument.elements.filter((e) => e.type === "siglum");
        for (const element6 of siglumElements) {
          if (abortControllerRef.current?.signal.aborted) return;
          currentIds.add(element6.id);
          const output = await renderer.render(element6, siglumConfig);
          if (abortControllerRef.current?.signal.aborted) return;
          currentResults[element6.id] = output.content;
        }
        siglumResultsRef.current = currentResults;
        siglumIdsRef.current = currentIds;
        console.log("[LIKBEZ] siglum results:", Object.keys(currentResults).map((k) => ({ id: k, type: typeof currentResults[k], isElement: import_react.default.isValidElement(currentResults[k]) })));
        setSiglumResultsMap({ ...currentResults });
        setTimeout(() => {
          const objectTag = document.querySelector(".likbez-text object");
          if (objectTag) {
            console.log("[LIKBEZ] object offsetWidth:", objectTag.offsetWidth, "offsetHeight:", objectTag.offsetHeight);
            console.log("[LIKBEZ] object style:", objectTag.getAttribute("style"));
            const dataUrl = objectTag.getAttribute("data");
            if (dataUrl && dataUrl.startsWith("blob:")) {
              fetch(dataUrl).then((r) => r.blob()).then((blob) => {
                console.log("[LIKBEZ] PDF blob size:", blob.size, "bytes, type:", blob.type);
              }).catch((e) => console.error("[LIKBEZ] blob fetch error:", e));
            }
            objectTag.onload = () => console.log("[LIKBEZ] object loaded successfully");
            objectTag.onerror = (e) => console.error("[LIKBEZ] object error:", e);
          }
        }, 1500);
      };
      renderSiglumElements();
    }, [source, siglumReady, siglumConfig]);
    const renderElement = (0, import_react.useCallback)((element6) => {
      const box = element6.renderBox || renderBox;
      console.log("[LIKBEZ] renderElement:", element6.type, element6.id);
      switch (element6.type) {
        case "markdown-katex": {
          const result = markdownRenderer.render(element6, {
            remarkPlugins: [],
            rehypePlugins: [],
            katex: katexConfig
          });
          console.log("[LIKBEZ] markdown result:", typeof result.content);
          return result.content;
        }
        case "siglum": {
          const siglumResult = siglumResultsMap[element6.id];
          if (siglumResult && import_react.default.isValidElement(siglumResult)) {
            const props = siglumResult.props;
            const childCount = import_react.default.Children.count(siglumResult);
            console.log("[LIKBEZ] siglum element: type=", String(siglumResult.type), "childCount=", childCount, "propsKeys=", Object.keys(props || {}));
            if (props.children) {
              console.log("[LIKBEZ] siglum children type:", typeof props.children, import_react.default.isValidElement(props.children) ? "React element" : "not element");
              if (import_react.default.isValidElement(props.children)) {
                console.log("[LIKBEZ] siglum child type:", String(props.children.type), "props:", JSON.stringify(props.children.props, (k, v) => typeof v === "function" ? "[fn]" : typeof v === "object" && v !== null ? "[obj]" : v));
              }
            }
          } else {
            console.log("[LIKBEZ] siglum no result yet");
          }
          return siglumResult || /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: "likbez-loading", children: "Loading Siglum..." });
        }
        case "custom": {
          const customRenderer = createCustomRenderer(renderBox);
          return customRenderer.render(element6, customElements).content;
        }
        default:
          return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { children: [
            "Unknown type: ",
            element6.type
          ] });
      }
    }, [renderBox, customElements, siglumResultsMap, markdownRenderer, katexConfig]);
    const themeClass = theme === "dark" ? "likbez-theme-dark" : theme && theme !== "light" ? `likbez-theme-${theme}` : "";
    return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: `likbez-text ${themeClass} ${className || ""}`, style: style2, children: parsedDocument.elements.map((element6) => /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: "likbez-element", children: renderElement(element6) }, element6.id)) });
  };

  // src/presentation/hooks/useLikbezText.ts
  var import_react2 = __require("react");
  var useLikbezText = (options) => {
    const [source, setSourceState] = (0, import_react2.useState)(options?.initialSource || "");
    const [isReady, setIsReady] = (0, import_react2.useState)(true);
    const [isLoading, setIsLoading] = (0, import_react2.useState)(false);
    const parserFn = (0, import_react2.useMemo)(
      () => createParser({ customElements: options?.customElements }),
      [options?.customElements]
    );
    const parsedDocument = (0, import_react2.useMemo)(() => {
      try {
        return parserFn(source);
      } catch (error) {
        console.error("Parse error:", error);
        return { elements: [] };
      }
    }, [source, parserFn]);
    const setSource = (0, import_react2.useCallback)((newSource) => {
      setIsLoading(true);
      setSourceState(newSource);
      setTimeout(() => setIsLoading(false), 0);
    }, []);
    const parse4 = (0, import_react2.useCallback)((newSource) => {
      setIsLoading(true);
      try {
        const result = parserFn(newSource);
        setIsLoading(false);
        return result;
      } catch (error) {
        setIsLoading(false);
        console.error("Parse error:", error);
        return { elements: [] };
      }
    }, [parserFn]);
    return {
      source,
      setSource,
      parsedDocument,
      isReady,
      isLoading,
      parse: parse4
    };
  };
  return __toCommonJS(index_exports);
})();
