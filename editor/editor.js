"use strict";
/**
 * Base class for formatter logic used in the editor
 * To customize the formatting rules inherit this clas and
 * override the init method
 */
class Formatter {
    constructor(container) {
        this.init(container);
    }
    init(container) {
        // The constructor calls this method, which
        // should initialize the logic for formatting the data
        // in the container.
    }
}
;
/**
 * Markdown formatter which is based on the generic Formatter class
 * This formatter uses common Markdown syntax to
 */
class MDFormatter extends Formatter {
    init(container) {
        const observer = new MutationObserver((mutations) => MDFormatter.parseMutations(container, mutations));
        const observerConfig = {
            childList: true,
            subtree: true,
            characterData: true,
        };
        observer.observe(container, observerConfig);
    }
    static parseMutations(container, mutations) {
        for (const mutation of mutations) {
            MDFormatter.parseMutation(container, mutation);
        }
    }
    static parseMutation(container, mutation) {
        // Add first div if the editor is empty and this is the first addedd #text
        if (mutation.addedNodes.length > 0) {
            const addedNode = mutation.addedNodes[0];
            // The first text written will not be in a separate div, so create a div for it
            // and put the text inside
            if (addedNode.nodeName === "#text" && addedNode.parentElement === container) {
                const newDiv = document.createElement("div");
                container.insertBefore(newDiv, addedNode.nextSibling);
                newDiv.appendChild(addedNode);
                // Move cursor to end of line
                const range = document.createRange();
                const sel = window.getSelection();
                range.setStart(container.childNodes[0], newDiv.innerHTML.length);
                range.collapse(true);
                if (sel) {
                    sel.removeAllRanges();
                    sel.addRange(range);
                }
            }
            // If added node is a div, clear all classes
            if (addedNode.nodeName === "DIV") {
                if (addedNode.nodeType === Node.ELEMENT_NODE) {
                    const elementFromNode = addedNode;
                    while (elementFromNode.hasAttributes()) {
                        elementFromNode.removeAttribute(elementFromNode.attributes[0].name);
                    }
                }
            }
        }
        if (mutation.type === "childList") {
            if (mutation.target.nodeType === Node.ELEMENT_NODE) {
                const elementFromNode = mutation.target;
                // Check if the element is empty and clear its classes
                if (elementFromNode) {
                    const spacesRegex = RegExp("\\s*");
                    if (spacesRegex.test(elementFromNode.innerText)) {
                        elementFromNode.className = "";
                    }
                }
            }
        }
        // MD formatting
        if (mutation.type === "characterData") {
            const parent = mutation.target.parentElement;
            const header1Regex = RegExp("^#{1}\\s");
            const header2Regex = RegExp("^#{2}\\s");
            const header3Regex = RegExp("^#{3}\\s");
            const header4Regex = RegExp("^#{4}\\s");
            const header5Regex = RegExp("^#{5}\\s");
            const header6Regex = RegExp("^#{6}\\s");
            if (parent) {
                if (header6Regex.test(parent.innerText)) {
                    parent.className = "md-header-6";
                }
                else if (header5Regex.test(parent.innerText)) {
                    parent.className = "md-header-5";
                }
                else if (header4Regex.test(parent.innerText)) {
                    parent.className = "md-header-4";
                }
                else if (header3Regex.test(parent.innerText)) {
                    parent.className = "md-header-3";
                }
                else if (header2Regex.test(parent.innerText)) {
                    parent.className = "md-header-2";
                }
                else if (header1Regex.test(parent.innerText)) {
                    parent.className = "md-header-1";
                }
                else {
                    parent.className = "";
                }
            }
        }
    }
}
class Editor {
    constructor(container, formatter, editorTheme = {}, formatterTheme = {}) {
        this.container = container;
        this.editorTheme = editorTheme;
        this.formatterTheme = formatterTheme;
        this.initializeContainer();
        this.applyEditorTheme();
        this.injectFormatterTheme();
        this.formatter = new formatter(container);
    }
    injectFormatterTheme() {
        Object.entries(this.formatterTheme).forEach(([className, properties]) => {
            CSSHelper.injectClass(className, properties);
        });
    }
    initializeContainer() {
        // Make sure the container is a div
        const containerParent = this.container.parentElement;
        const editorDiv = document.createElement("div");
        const id = this.container.id;
        if (this.container.tagName.toLowerCase() === "div") {
            // Clear the div from attributes and content
            this.container.innerHTML = "";
            while (this.container.hasAttributes()) {
                const attribute = this.container.attributes[0].name;
                this.container.removeAttribute(attribute);
            }
        }
        else if (this.container.tagName.toLowerCase() !== "div" && containerParent != null) {
            // Replace the given element with an empty div
            containerParent.replaceChild(editorDiv, this.container);
            this.container = editorDiv;
        }
        else {
            // Error
            // console.log("[md] The given element is not of type DIV and cannot be converted to DIV");
            return;
        }
        // Return the container its original id
        this.container.id = id;
        // Make the div editable
        this.container.contentEditable = "true";
    }
    applyEditorTheme() {
        this.container.style.cssText = CSSHelper.stringifyCSSProperties(this.editorTheme);
    }
}
;
class CSSHelper {
    constructor() {
        CSSHelper.styleElement = document.createElement("style");
        CSSHelper.styleElement.type = "text/css";
        document.getElementsByTagName("head")[0].appendChild(CSSHelper.styleElement);
    }
    static injectClass(name, properties) {
        const cssTextPropertoes = CSSHelper.stringifyCSSProperties(properties);
        CSSHelper.styleElement.innerHTML += ` .${name} { ${cssTextPropertoes} } `;
    }
    static stringifyCSSProperties(property) {
        let cssString = "";
        Object.entries(property).forEach(([key, value]) => {
            if (value !== "") {
                cssString += `${key}: ${value}; `;
            }
        });
        return cssString;
    }
}
CSSHelper.instance = new CSSHelper();
;
/**
 * Create editor theme
 */
let darkEditorTheme = {
    "background": "#202225",
    "width": "826px",
    "height": "300px",
    "padding": "20px 30px 20px 30px",
    "border-radius": "5px",
    "cursor": "default",
    "overflow": "auto",
    "box-shadow": "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
    "color": "#dcddde",
    "outline": "none",
};
/**
 * Create Markdown Theme
 */
let darkMDTheme = {
    "md-header-1": {
        "margin": "24px 0 16px 0",
        "font-weight": "600",
        "line-height": "1.25",
        "font-size": "2em",
        "padding-bottom": ".3em",
        "border-bottom": "1px solid #eaecef",
    },
    "md-header-2": {
        "margin": "24px 0 16px 0",
        "font-weight": "600",
        "line-height": "1.25",
        "padding-bottom": ".3em",
        "border-bottom": "1px solid #eaecef",
        "font-size": "1.5em",
    },
    "md-header-3": {
        "margin": "24px 0 16px 0",
        "font-weight": "600",
        "line-height": "1.25",
        "font-size": "1.25em",
    },
    "md-header-4": {
        "margin": "24px 0 16px 0",
        "font-weight": "600",
        "line-height": "1.25",
        "font-size": "1em",
    },
    "md-header-5": {
        "margin": "24px 0 16px 0",
        "font-weight": "600",
        "line-height": "1.25",
        "font-size": ".875em",
    },
    "md-header-6": {
        "margin": "24px 0 16px 0",
        "font-weight": "600",
        "line-height": "1.25",
        "font-size": ".85em",
    },
    "md-italics": {
        "font-style": "italic",
    },
    "md-bold": {
        "font-weight": "bold",
    },
    "md-strikethrough": {
        "text-decoration": "line-through",
    },
    "md-ordered-list": {
        "list-style-type": "decimal",
    },
    "md-unordered-list": {
        "list-style-type": "circle",
    },
    "md-link": {
        "text-decoration": "none",
        "color": "rgb(77, 172, 253)",
    },
    "md-image": {
        "max-width": "100%",
    },
    "md-inline-code": {
        "font-family": "monospace",
        "padding": ".2em .4em",
        "font-size": "85%",
        "border-radius": "3px",
        "background-color": "rgba(220, 224, 228, 0.1) !important",
    },
    "md-block-code": {
        "font-family": "monospace",
        "border-radius": "3px",
        "word-wrap": "normal",
        "padding": "16px",
        "background": "rgba(220, 224, 228, 0.1) !important",
    },
    "md-table-header": {
        "line-height": "1.5",
        "border-spacing": "0",
        "border-collapse": "collapse",
        "text-align": "center",
        "font-weight": "600",
        "padding": "6px 13px",
        "border": "1px solid #dfe2e5",
    },
    "md-table-cell": {
        "line-height": "1.5",
        "border-spacing": "0",
        "border-collapse": "collapse",
        "text-align": "right",
        "padding": "6px 13px",
        "border": "1px solid #dfe2e5",
    },
    "md-quote": {
        "border-spacing": "0",
        "border-collapse": "collapse",
        "text-align": "right",
        "padding": "6px 13px",
        "border": "1px solid #dfe2e5",
    },
    "md-horizontal-line": {
        "line-height": "1.5",
        "overflow": "hidden",
        "height": ".25em",
        "padding": "0",
        "margin": "24px 0",
        "background": "white",
    },
};
let s = document.getElementById("editor");
if (s) {
    const editor = new Editor(s, MDFormatter, darkEditorTheme, darkMDTheme);
}
