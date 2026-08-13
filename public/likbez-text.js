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
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
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
    styles: () => styles_default,
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
      render: (element, config) => {
        if (typeof import_katex.default === "undefined") {
          return {
            elementId: element.id,
            type: element.type,
            box: element.renderBox || defaultBox,
            content: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: {
              ...(element.renderBox || defaultBox).style,
              padding: 8,
              backgroundColor: "#fff3e0",
              border: "1px solid #ffb74d",
              color: "#e65100"
            }, children: "KaTeX is not loaded" })
          };
        }
        let html;
        const displayMode = element.metadata?.displayMode === true;
        try {
          html = import_katex.default.renderToString(element.rawContent, {
            displayMode,
            throwOnError: false,
            errorColor: config?.errorColor ?? "#cc0000",
            macros: config?.macros ?? {},
            strict: config?.strict ?? false,
            trust: config?.trust ?? false
          });
        } catch (error) {
          html = `<span style="color: ${config?.errorColor ?? "#cc0000"}">KaTeX Error: ${error}</span>`;
        }
        const renderBox = element.renderBox || defaultBox;
        return {
          elementId: element.id,
          type: element.type,
          box: renderBox,
          content: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            "div",
            {
              style: {
                ...renderBox.style,
                width: renderBox.dimensions.width,
                minWidth: renderBox.dimensions.minWidth,
                maxWidth: renderBox.dimensions.maxWidth,
                height: renderBox.dimensions.height,
                minHeight: renderBox.dimensions.minHeight,
                maxHeight: renderBox.dimensions.maxHeight,
                overflow: "auto"
              },
              dangerouslySetInnerHTML: { __html: html }
            }
          )
        };
      }
    };
  };

  // src/infrastructure/renderers/SiglumRenderer.tsx
  var import_jsx_runtime2 = __require("react/jsx-runtime");
  var createSiglumRenderer = (defaultBox) => {
    let compiler = null;
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
        compiler = new SiglumCompiler({
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
        await compiler.init();
        initialized = true;
      },
      render: async (element, config) => {
        const renderBox = element.renderBox || defaultBox;
        if (!initialized || !compiler) {
          return {
            elementId: element.id,
            type: element.type,
            box: renderBox,
            content: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: {
              ...renderBox.style,
              padding: 16,
              backgroundColor: "#f5f5f5",
              border: "1px dashed #ccc",
              color: "#666"
            }, children: "Initializing Siglum..." })
          };
        }
        logs.length = 0;
        const latexSource = `
\\documentclass{article}
\\usepackage{amsmath}
\\usepackage{amssymb}
\\begin{document}
${element.rawContent}
\\end{document}
`;
        try {
          const result = await compiler.compile(latexSource, {
            engine: config?.engine || "pdflatex"
          });
          if (!result) {
            return {
              elementId: element.id,
              type: element.type,
              box: renderBox,
              content: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: {
                ...renderBox.style,
                padding: 16,
                backgroundColor: "#ffebee",
                border: "1px solid #ffcdd2",
                color: "#c62828"
              }, children: "No result from compiler" })
            };
          }
          if (result.success && result.pdf) {
            const pdfBuffer = result.pdfIsShared ? new Uint8Array(result.pdf).slice() : new Uint8Array(result.pdf);
            const blob = new Blob([pdfBuffer], { type: "application/pdf" });
            const url = URL.createObjectURL(blob);
            urlStore.add(url);
            return {
              elementId: element.id,
              type: element.type,
              box: renderBox,
              content: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
                "div",
                {
                  style: {
                    ...renderBox.style,
                    width: renderBox.dimensions.width,
                    height: renderBox.dimensions.height,
                    overflow: "auto"
                  },
                  children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
                    "object",
                    {
                      data: url,
                      type: "application/pdf",
                      width: "100%",
                      style: { minHeight: 200 }
                    }
                  )
                }
              )
            };
          }
          const texErrors = logs.filter(
            (l) => l.includes("[TeX ERR]") || l.includes("! LaTeX Error") || l.includes("Error:")
          );
          const errorText = texErrors.length > 0 ? texErrors.join("\n") : result.error || "Unknown error (check console for details)";
          return {
            elementId: element.id,
            type: element.type,
            box: renderBox,
            content: /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: {
              ...renderBox.style,
              padding: 16,
              backgroundColor: "#ffebee",
              border: "1px solid #ffcdd2",
              color: "#c62828",
              fontSize: "11px",
              maxHeight: "200px",
              overflow: "auto"
            }, children: [
              /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("strong", { children: "LaTeX Error:" }),
              /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("pre", { style: { margin: "8px 0 0 0", whiteSpace: "pre-wrap" }, children: errorText })
            ] })
          };
        } catch (error) {
          return {
            elementId: element.id,
            type: element.type,
            box: renderBox,
            content: /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: {
              ...renderBox.style,
              padding: 16,
              backgroundColor: "#ffebee",
              border: "1px solid #ffcdd2",
              color: "#c62828"
            }, children: [
              /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("strong", { children: "Compilation error:" }),
              /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("pre", { style: { margin: "8px 0 0 0", fontSize: "12px" }, children: String(error) })
            ] })
          };
        }
      },
      compile: async (source, options) => {
        if (!compiler) {
          return { success: false, error: "Siglum not initialized" };
        }
        return compiler.compile(source, options);
      },
      destroy: () => {
        for (const url of urlStore) {
          URL.revokeObjectURL(url);
        }
        urlStore.clear();
        logs.length = 0;
        if (compiler) {
          compiler.terminate?.();
          compiler = null;
        }
        initialized = false;
      }
    };
  };

  // src/infrastructure/renderers/MarkdownRenderer.tsx
  var import_katex2 = __toESM(__require("katex"));
  var import_jsx_runtime3 = __require("react/jsx-runtime");
  var renderMarkdownToHtml = (text) => {
    let html = text;
    const katexBlocks = [];
    html = html.replace(/\$\$([\s\S]+?)\$\$/g, (match, formula) => {
      try {
        const katexHtml = import_katex2.default.renderToString(formula.trim(), {
          displayMode: true,
          throwOnError: false
        });
        const placeholder = `%%KATEX_BLOCK_${katexBlocks.length}%%`;
        katexBlocks.push(`<div class="katex-display">${katexHtml}</div>`);
        return placeholder;
      } catch (e) {
        return `<span style="color:#cc0000">KaTeX Error: ${e}</span>`;
      }
    });
    html = html.replace(/\$([^\$\n]+?)\$/g, (match, formula) => {
      try {
        const katexHtml = import_katex2.default.renderToString(formula.trim(), {
          displayMode: false,
          throwOnError: false
        });
        const placeholder = `%%KATEX_BLOCK_${katexBlocks.length}%%`;
        katexBlocks.push(katexHtml);
        return placeholder;
      } catch (e) {
        return `<span style="color:#cc0000">KaTeX Error: ${e}</span>`;
      }
    });
    html = html.replace(/^### (.*$)/gm, "<h3>$1</h3>");
    html = html.replace(/^## (.*$)/gm, "<h2>$1</h2>");
    html = html.replace(/^# (.*$)/gm, "<h1>$1</h1>");
    html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    html = html.replace(/\*([^*]+)\*/g, "<em>$1</em>");
    html = html.replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>');
    html = html.replace(/`([^`]+)`/g, "<code>$1</code>");
    html = html.replace(/\n/g, "<br>");
    katexBlocks.forEach((block, i) => {
      html = html.replace(`%%KATEX_BLOCK_${i}%%`, block);
    });
    return html;
  };
  var createMarkdownRenderer = (defaultBox) => {
    return {
      render: (element, config) => {
        const renderBox = element.renderBox || defaultBox;
        const html = renderMarkdownToHtml(element.rawContent);
        return {
          elementId: element.id,
          type: element.type,
          box: renderBox,
          content: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
            "div",
            {
              className: "likbez-markdown",
              style: {
                ...renderBox.style,
                width: renderBox.dimensions.width,
                minWidth: renderBox.dimensions.minWidth,
                maxWidth: renderBox.dimensions.maxWidth,
                height: renderBox.dimensions.height,
                minHeight: renderBox.dimensions.minHeight,
                maxHeight: renderBox.dimensions.maxHeight,
                overflow: "auto"
              },
              children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
                "div",
                {
                  dangerouslySetInnerHTML: { __html: html }
                }
              )
            }
          )
        };
      }
    };
  };

  // src/infrastructure/renderers/CustomRenderer.tsx
  var import_jsx_runtime4 = __require("react/jsx-runtime");
  var createCustomRenderer = (defaultBox) => {
    return {
      render: (element, customConfigs) => {
        const config = customConfigs.find((c) => c.type === element.metadata?.customType);
        const renderBox = element.renderBox || defaultBox;
        if (!config || !config.render) {
          return {
            elementId: element.id,
            type: element.type,
            box: renderBox,
            content: /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { style: {
              ...renderBox.style,
              padding: 8,
              backgroundColor: "#fff3e0",
              border: "1px solid #ffb74d"
            }, children: [
              "Unknown custom element: ",
              String(element.metadata?.customType)
            ] })
          };
        }
        return {
          elementId: element.id,
          type: element.type,
          box: renderBox,
          content: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
            "div",
            {
              style: {
                ...renderBox.style,
                width: renderBox.dimensions.width,
                minWidth: renderBox.dimensions.minWidth,
                maxWidth: renderBox.dimensions.maxWidth,
                height: renderBox.dimensions.height,
                minHeight: renderBox.dimensions.minHeight,
                maxHeight: renderBox.dimensions.maxHeight,
                overflow: "auto"
              },
              children: config.render(element)
            }
          )
        };
      }
    };
  };

  // src/presentation/components/LikbezText.tsx
  var import_react = __toESM(__require("react"));
  var import_jsx_runtime5 = __require("react/jsx-runtime");
  var EMPTY_CUSTOM_ELEMENTS = [];
  var defaultRenderBox2 = {
    dimensions: { width: "auto", height: "auto" },
    style: { padding: 8, borderRadius: 4 }
  };
  var LikbezText = ({
    source,
    parserOptions,
    defaultBox,
    customBoxes,
    customElements = EMPTY_CUSTOM_ELEMENTS,
    siglumConfig,
    katexConfig,
    style,
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
        for (const element of siglumElements) {
          if (abortControllerRef.current?.signal.aborted) return;
          currentIds.add(element.id);
          const output = await renderer.render(element, siglumConfig);
          if (abortControllerRef.current?.signal.aborted) return;
          currentResults[element.id] = output.content;
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
    const renderElement = (0, import_react.useCallback)((element) => {
      const box = element.renderBox || renderBox;
      console.log("[LIKBEZ] renderElement:", element.type, element.id);
      switch (element.type) {
        case "markdown-katex": {
          const mdRenderer = createMarkdownRenderer(renderBox);
          const result = mdRenderer.render(element, { remarkPlugins: [], rehypePlugins: [] });
          console.log("[LIKBEZ] markdown result:", typeof result.content);
          return result.content;
        }
        case "siglum": {
          const siglumResult = siglumResultsMap[element.id];
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
          return siglumResult || /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { style: { padding: 16, backgroundColor: "#f5f5f5", border: "1px dashed #ccc", color: "#666" }, children: "Loading Siglum..." });
        }
        case "custom": {
          const customRenderer = createCustomRenderer(renderBox);
          return customRenderer.render(element, customElements).content;
        }
        default:
          return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { children: [
            "Unknown type: ",
            element.type
          ] });
      }
    }, [renderBox, customElements, siglumResultsMap]);
    return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: `likbez-text ${className || ""}`, style, children: parsedDocument.elements.map((element) => /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { style: { marginBottom: 8 }, children: renderElement(element) }, element.id)) });
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
    const parse = (0, import_react2.useCallback)((newSource) => {
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
      parse
    };
  };

  // src/styles.css
  var styles_default = {};
  return __toCommonJS(index_exports);
})();
