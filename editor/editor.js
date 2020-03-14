"use strict";
/**
 * ! This is a base class, which must be extended for every different formatter
 * Base class for formatter logic used in the editor
 * To customize the formatting rules inherit this clas and
 * override the init method
 */
class Formatter {
    /**
     * The constructor only calls the init method,
     * which is responsible for starting the formatting engine
     * @param {HTMLElement} container HTML editable div, used as editor
     */
    constructor(container) {
        this.init(container);
    }
}
;
/**
 * Markdown formatter which is based on the generic Formatter class
 * This formatter uses common Markdown syntax to
 */
class MDFormatter extends Formatter {
    /**
     * Initialize the mutation observer, which monitors changes happening
     * inside the container
     * @param {HTMLElement} container HTML editable div used as editor
     */
    init(container) {
        this.initRegex();
        const observer = new MutationObserver((mutations) => MDFormatter.handleMutations(container, mutations));
        const observerConfig = {
            childList: true,
            subtree: true,
            characterData: true,
        };
        observer.observe(container, observerConfig);
    }
    /**
     * Initialize regexes for matching markdown formatting strings
     * at the start of the line
     * e.g headers # and ###
     */
    initRegex() {
        if (MDFormatter.startLineRegex.length === 0) {
            MDFormatter.startLineRegex.push(["md-header-1", RegExp("^#{1}\\s")]);
            MDFormatter.startLineRegex.push(["md-header-2", RegExp("^#{2}\\s")]);
            MDFormatter.startLineRegex.push(["md-header-3", RegExp("^#{3}\\s")]);
            MDFormatter.startLineRegex.push(["md-header-4", RegExp("^#{4}\\s")]);
            MDFormatter.startLineRegex.push(["md-header-5", RegExp("^#{5}\\s")]);
            MDFormatter.startLineRegex.push(["md-header-6", RegExp("^#{6}\\s")]);
            MDFormatter.startLineRegex.push(["md-quote", RegExp("^>\\s")]);
        }
    }
    /**
     * Handle array of Mutations
     * @param {HTMLElement} container HTML editable div used as editor
     * @param {MutationRecord[]} mutations array of mutations
     */
    static handleMutations(container, mutations) {
        for (const mutation of mutations) {
            MDFormatter.handleMutation(container, mutation);
        }
    }
    /**
     * Handle a single mutation by calling the right method depending on the mutation type
     * @param {HTMLElement} container HTML editable div used as editor
     * @param {MutationRecord} mutations The mutation that happened
     */
    static handleMutation(container, mutation) {
        if (mutation.type === "childList") {
            MDFormatter.handleChildListMutation(container, mutation);
        }
        if (mutation.type === "characterData") {
            MDFormatter.handleCharacterDataMutation(container, mutation);
        }
    }
    /**
     * Handle a single Mutation of type childList
     * @param {HTMLElement} container HTML editable div used as editor
     * @param {MutationRecord} mutation The mutation that happened
     */
    static handleChildListMutation(container, mutation) {
        if (mutation.addedNodes.length > 0) {
            const addedNode = mutation.addedNodes[0];
            // Add first div if the editor is empty and this is the first addedd #text
            // The first text written will not be in a separate div, so create a div for it
            // and put the text inside
            if (addedNode.nodeName === "#text" && addedNode.parentElement === container) {
                const newDiv = document.createElement("div");
                container.insertBefore(newDiv, addedNode.nextSibling);
                newDiv.appendChild(addedNode);
                // Move cursor to end of line
                const range = document.createRange();
                const sel = window.getSelection();
                range.setStart(container.childNodes[0], newDiv.innerText.length);
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
        // Check if the element is empty and clear its classes
        if (mutation.target.nodeType === Node.ELEMENT_NODE) {
            const elementFromNode = mutation.target;
            if (elementFromNode) {
                const spacesRegex = RegExp("\\s*");
                if (spacesRegex.test(elementFromNode.innerText)) {
                    elementFromNode.className = "";
                }
            }
        }
    }
    /**
     * Handle a single Mutation of type characterData
     * @param {HTMLElement} container HTML editable div used as editor
     * @param {MutationRecord} mutation The mutation that happened
     */
    static handleCharacterDataMutation(container, mutation) {
        const parent = mutation.target.parentElement;
        if (parent) {
            parent.className = "";
            for (const [className, regex] of MDFormatter.startLineRegex) {
                if (regex.test(parent.innerText)) {
                    parent.className = className;
                }
            }
        }
    }
}
/**
 * An array of [<class-name>, <regex-expression>] tuples
 * <class-name> is the css class name added to the
 * element if it matches <regex-expression>
 */
MDFormatter.startLineRegex = [];
;
/**
 * Abstraction of the editor as a collection of container, formatter, settings and themes
 */
class Editor {
    /**
     * @param {HTMLElement} container HTML element which will become an ediable div
     * @param {Formatter} formatter Formatter which determines how the content is stylized
     * @param {EditorTheme} editorTheme Theme of the editor as a whole
     * @param {FormatterTheme} formatterTheme List of css classes which assist the formatter in stylizing the content
     */
    constructor(container, formatter, editorTheme = {}, formatterTheme = {}) {
        this.container = container;
        this.editorTheme = editorTheme;
        this.formatterTheme = formatterTheme;
        this.initializeContainer();
        this.applyEditorTheme();
        this.injectFormatterTheme();
        this.formatter = new formatter(container);
    }
    /**
     * Inject the css classes into the HTML so the formatter can
     * use them when stylizing the content
     */
    injectFormatterTheme() {
        Object.entries(this.formatterTheme).forEach(([className, properties]) => {
            CSSHelper.injectClass(className, properties);
        });
    }
    /**
     * Create the editor content container as an editable div
     */
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
    /**
     * Change the editor theme by changint its style property
     */
    applyEditorTheme() {
        this.container.style.cssText = CSSHelper.stringifyCSSProperties(this.editorTheme);
    }
}
;
/**
 * Add methods to work with CSS like injecting classes and
 * converting CSS properties to string which looks like css
 */
class CSSHelper {
    /**
     * Deprecated singleton, the class is now
     */
    constructor() {
        CSSHelper.styleElement = document.createElement("style");
        CSSHelper.styleElement.type = "text/css";
        document.getElementsByTagName("head")[0].appendChild(CSSHelper.styleElement);
    }
    /**
     * Add a new css class with properties
     */
    static injectClass(name, properties) {
        const cssTextPropertoes = CSSHelper.stringifyCSSProperties(properties);
        CSSHelper.styleElement.innerHTML += ` .${name} { ${cssTextPropertoes} } `;
    }
    /**
     * Convert a list of css properties to a string which is valid css
     * @param {CSSStringProperties} property CSSproperties
     */
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
/**
 * The instance is used only to initialize the class once
 */
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
        "padding": "6px 13px",
        "border-left": ".25em solid rgb(53, 59, 66)",
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
/**
 * Get an anchor to the element-to-be-editor
 * and create an editor from it
 */
let editorContainer = document.getElementById("editor");
if (editorContainer) {
    const editor = new Editor(editorContainer, MDFormatter, darkEditorTheme, darkMDTheme);
}
