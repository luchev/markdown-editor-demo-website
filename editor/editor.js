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
     * @param {HTMLElement} editor HTML editable div used as editor
     */
    init(editor) {
        this.initRegex();
        const observer = new MutationObserver((mutations) => MDFormatter.handleMutations(editor, mutations));
        const observerConfig = {
            childList: true,
            subtree: true,
            characterData: true,
        };
        observer.observe(editor, observerConfig);
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
     * @param {HTMLElement} editor HTML editable div used as editor
     * @param {MutationRecord} mutation The mutation that happened
     */
    static handleChildListMutation(editor, mutation) {
        if (mutation.addedNodes.length > 0) {
            const addedNode = mutation.addedNodes[0];
            // Add first div if the editor is empty and this is the first addedd #text
            // The first text written will not be in a separate div, so create a div for it
            // and put the text inside
            if (addedNode.nodeName === "#text" && addedNode.parentElement === editor) {
                const newDiv = document.createElement("div");
                editor.insertBefore(newDiv, addedNode.nextSibling);
                newDiv.appendChild(addedNode);
                // Move cursor to end of line
                const range = document.createRange();
                const sel = window.getSelection();
                range.setStart(editor.childNodes[0], newDiv.innerText.length);
                range.collapse(true);
                if (sel) {
                    sel.removeAllRanges();
                    sel.addRange(range);
                }
            }
            // If added node is a div, clear all classes
            if (addedNode.nodeName === "DIV" && mutation.target !== editor) {
                if (addedNode.nodeType === Node.ELEMENT_NODE) {
                    const elementFromNode = addedNode;
                    while (elementFromNode.hasAttributes()) {
                        elementFromNode.removeAttribute(elementFromNode.attributes[0].name);
                    }
                }
            }
        }
        // Check if the element is empty and clear its classes
        if (mutation.target.nodeType === Node.ELEMENT_NODE && mutation.target !== editor) {
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
     * @param {string} containerId HTML element id which will become an ediable div
     * @param {Formatter} formatter Formatter which determines how the content is stylized
     * @param {Theme} theme Collection of theme objects
     */
    constructor(containerId, formatter, theme) {
        this.containerId = containerId;
        this.theme = theme;
        /**
         * The container for the menu and the editor
         */
        this.container = document.createElement("div");
        /**
         * The actual editor which holds the text content
         */
        this.editor = document.createElement("div");
        /**
         * The menu next to the editor
         */
        this.menu = document.createElement("div");
        this.initializeContainer(containerId);
        this.applyTheme();
        this.initializeFormatter(formatter);
    }
    initializeFormatter(formatter) {
        const f = new formatter(this.editor);
    }
    /**
     * Inject the CSS classes into the HTML so the formatter can
     * use them when stylizing the content
     */
    injectFormatterTheme() {
        Object.entries(this.theme.formatterTheme).forEach(([identifier, properties]) => {
            CSSHelper.injectCss(identifier, properties);
        });
    }
    /**
     * Inject the additional CSS classes into the HTML
     */
    injectAdditionalTheme() {
        Object.entries(this.theme.additionalIdentifiers).forEach(([identifier, properties]) => {
            CSSHelper.injectCss(this.interpolateCssIdentifier(identifier), properties);
        });
    }
    /**
     * Replace special keywords in CSS identifiers with identifiers,
     * which are used in the current editor.
     * This allows users to write custom CSS using identifiers to edit this editor
     * TODO proper description
     */
    interpolateCssIdentifier(identifier) {
        return identifier.replace(/<EDITOR>/g, "." + this.getEditorCssClass())
            .replace(/<CONTAINER>/g, "." + this.getContainerCssClass())
            .replace(/<MENU>/g, "." + this.getMenuCssClass());
    }
    /**
     * Create the editor content container as an editable div
     */
    initializeContainer(futureContainerId) {
        // Make sure the container is a div
        const futureContainer = document.getElementById(futureContainerId);
        if (!futureContainer) {
            throw new Error("Cannot find element with id " + futureContainerId);
        }
        const futureContainerParent = futureContainer.parentElement;
        this.container.id = this.containerId;
        this.container.className = this.getContainerCssClass();
        if (futureContainerParent) {
            futureContainerParent.replaceChild(this.container, futureContainer);
        }
        this.container.appendChild(this.menu);
        this.menu.className = this.getMenuCssClass();
        // Add settings button
        const settingsSvg = DOMHelper.HTMLElementFromString("<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'> <circle cx='12' cy='12' r='3' /> <path d='M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z' /></svg>");
        this.menu.appendChild(settingsSvg);
        this.container.appendChild(this.editor);
        this.editor.className = this.getEditorCssClass();
        this.editor.contentEditable = "true";
    }
    /**
     * Change the editor theme by changint its style property
     */
    applyTheme() {
        CSSHelper.injectCss("." + this.getContainerCssClass(), this.theme.containerTheme);
        CSSHelper.injectCss("." + this.getMenuCssClass(), this.theme.menuTheme);
        CSSHelper.injectCss("." + this.getEditorCssClass(), this.theme.editorTheme);
        this.injectFormatterTheme();
        this.injectAdditionalTheme();
    }
    getContainerCssClass() {
        return this.containerId + "-container";
    }
    getMenuCssClass() {
        return this.containerId + "-menu";
    }
    getEditorCssClass() {
        return this.containerId + "-editor";
    }
}
;
/**
 * Add methods to work with CSS like injecting classes and
 * converting CSS properties to string which looks like css
 */
class CSSHelper {
    /**
     * Deprecated singleton, the class is now static
     * The only remaining part of the singleton is the instance
     * which ensures that the constructor has been called and a new
     * style tag has been injected into the HTML
     */
    constructor() {
        CSSHelper.styleElement = document.createElement("style");
        CSSHelper.styleElement.type = "text/css";
        document.getElementsByTagName("head")[0].appendChild(CSSHelper.styleElement);
    }
    /**
     * Inject CSS given an identifier and properties
     * @param {string} identifier CSS identifier, e.g '#some-id' or 'a:hover'
     * @param {CssProperties} properties CSS properties
     */
    static injectCss(identifier, properties) {
        const cssTextPropertoes = CSSHelper.stringifyCSSProperties(properties);
        CSSHelper.styleElement.innerHTML += `${identifier} { ${cssTextPropertoes} } \n`;
    }
    /**
     * Convert a list of css properties to a string which is valid css
     * @param {CssProperties} property CSSproperties
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
 * Class providing useful methods to work with the HTML DOM
 */
class DOMHelper {
    static HTMLElementFromString(html) {
        const creationHelperElement = document.createElement("div");
        creationHelperElement.innerHTML = html.trim();
        if (creationHelperElement.firstChild && creationHelperElement.firstChild.nodeType === Node.ELEMENT_NODE) {
            return creationHelperElement.firstChild;
        }
        throw new Error("Failed to create element from html: " + html);
    }
}
;
/**
 * A collection of theme objects
 */
class Theme {
    constructor(containerTheme = {}, editorTheme = {}, menuTheme = {}, formatterTheme = {}, additionalIdentifiers = {}) {
        this.containerTheme = containerTheme;
        this.editorTheme = editorTheme;
        this.menuTheme = menuTheme;
        this.formatterTheme = formatterTheme;
        this.additionalIdentifiers = additionalIdentifiers;
    }
}
;
/**
 * Create Markdown Theme
 */
let darkMDFormatterTheme = {
    ".md-header-1": {
        "margin": "24px 0 16px 0",
        "font-weight": "600",
        "line-height": "1.25",
        "font-size": "2em",
        "padding-bottom": ".3em",
        "border-bottom": "1px solid #eaecef",
    },
    ".md-header-2": {
        "margin": "24px 0 16px 0",
        "font-weight": "600",
        "line-height": "1.25",
        "padding-bottom": ".3em",
        "border-bottom": "1px solid #eaecef",
        "font-size": "1.5em",
    },
    ".md-header-3": {
        "margin": "24px 0 16px 0",
        "font-weight": "600",
        "line-height": "1.25",
        "font-size": "1.25em",
    },
    ".md-header-4": {
        "margin": "24px 0 16px 0",
        "font-weight": "600",
        "line-height": "1.25",
        "font-size": "1em",
    },
    ".md-header-5": {
        "margin": "24px 0 16px 0",
        "font-weight": "600",
        "line-height": "1.25",
        "font-size": ".875em",
    },
    ".md-header-6": {
        "margin": "24px 0 16px 0",
        "font-weight": "600",
        "line-height": "1.25",
        "font-size": ".85em",
    },
    ".md-italics": {
        "font-style": "italic",
    },
    ".md-bold": {
        "font-weight": "bold",
    },
    ".md-strikethrough": {
        "text-decoration": "line-through",
    },
    ".md-ordered-list": {
        "list-style-type": "decimal",
    },
    ".md-unordered-list": {
        "list-style-type": "circle",
    },
    ".md-link": {
        "text-decoration": "none",
        "color": "rgb(77, 172, 253)",
    },
    ".md-image": {
        "max-width": "100%",
    },
    ".md-inline-code": {
        "font-family": "monospace",
        "padding": ".2em .4em",
        "font-size": "85%",
        "border-radius": "3px",
        "background-color": "rgba(220, 224, 228, 0.1) !important",
    },
    ".md-block-code": {
        "font-family": "monospace",
        "border-radius": "3px",
        "word-wrap": "normal",
        "padding": "16px",
        "background": "rgba(220, 224, 228, 0.1) !important",
    },
    ".md-table-header": {
        "line-height": "1.5",
        "border-spacing": "0",
        "border-collapse": "collapse",
        "text-align": "center",
        "font-weight": "600",
        "padding": "6px 13px",
        "border": "1px solid #dfe2e5",
    },
    ".md-table-cell": {
        "line-height": "1.5",
        "border-spacing": "0",
        "border-collapse": "collapse",
        "text-align": "right",
        "padding": "6px 13px",
        "border": "1px solid #dfe2e5",
    },
    ".md-quote": {
        "border-spacing": "0",
        "border-collapse": "collapse",
        "padding": "6px 13px",
        "border-left": ".25em solid rgb(53, 59, 66)",
    },
    ".md-horizontal-line": {
        "line-height": "1.5",
        "overflow": "hidden",
        "height": ".25em",
        "padding": "0",
        "margin": "24px 0",
        "background": "white",
    },
};
/**
 * Create container theme
 */
let darkContainerTheme = {
    "background": "#202225",
    "width": "826px",
    "height": "300px",
    "border-radius": "5px",
    "cursor": "default",
    "box-shadow": "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
    "color": "#dcddde",
    "display": "flex",
    "flex-direction": "row",
    "resize": "both",
    "overflow": "auto",
};
/**
 * Create menu theme
 */
let darkMenuTheme = {
    "border-right": "1px solid rgb(83, 79, 86)",
    "margin": "20px 0px 20px 0px",
    "padding": "15px 20px 0px 20px",
};
/**
 * Create editor theme
 */
let darkEditorTheme = {
    "flex": "1",
    "outline": "none",
    "padding-left": "20px",
    "overflow": "auto",
    "scrollbar-color": "red",
    "padding": "20px 30px 20px 30px",
    "margin": "10px 10px 10px 10px",
};
/**
 * Add styling for the scrollbar
 */
let additionalTheme = {
    "<EDITOR>::-webkit-scrollbar": {
        "width": "10px",
    },
    "<EDITOR>::-webkit-scrollbar-track": {
        "background": "rgb(53, 59, 66)",
        "border-radius": "4px",
    },
    "<EDITOR>::-webkit-scrollbar-thumb": {
        "background": "rgb(83, 79, 86)",
        "border-radius": "4px",
    },
    "<EDITOR>::-webkit-scrollbar-thumb:hover": {
        "background": "rgb(93, 99, 106)",
    },
};
/**
 * Example usage
 */
let customTheme = new Theme(darkContainerTheme, darkEditorTheme, darkMenuTheme, darkMDFormatterTheme, additionalTheme);
const editor = new Editor("editor", MDFormatter, customTheme);
