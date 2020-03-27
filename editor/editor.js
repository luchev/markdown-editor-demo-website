/**
 * Add methods to work with CSS like injecting classes and
 * converting CSS properties to string which looks like css
 */
class CssHelper {
    /**
     * Deprecated singleton, the class is now static
     * The only remaining part of the singleton is the instance
     * which ensures that the constructor has been called and a new
     * style tag has been injected into the HTML
     */
    constructor() {
        CssHelper.styleElement = document.createElement("style");
        CssHelper.styleElement.type = "text/css";
        document
            .getElementsByTagName("head")[0]
            .appendChild(CssHelper.styleElement);
    }
    /**
     * Inject CSS given an identifier and properties
     * @param {string} identifier CSS identifier, e.g '#some-id' or 'a:hover'
     * @param {PropertiesHyphen} properties CSS properties
     */
    static injectCss(identifier, properties) {
        const cssTextPropertoes = CssHelper.stringifyCSSProperties(properties);
        CssHelper.styleElement.innerHTML += `${identifier} { ${cssTextPropertoes} } \n`;
    }
    /**
     * Convert a list of css properties to a string which is valid css
     * @param {PropertiesHyphen} property CSS properties
     * @return {string}
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
 * to make sure later on there is a style element which can be edited
 */
CssHelper.instance = new CssHelper();
/**
 * Class providing useful methods to work with the HTML DOM
 */
class DOMHelper {
    /**
     * Convert html string to html element
     * @param {string} html string
     * @return {HTMLElement}
     */
    static htmlElementFromString(html) {
        const creationHelperElement = document.createElement("div");
        creationHelperElement.innerHTML = html.trim();
        if (creationHelperElement.firstChild &&
            creationHelperElement.firstChild.nodeType === Node.ELEMENT_NODE) {
            return creationHelperElement.firstChild;
        }
        throw new Error("Failed to create element from html: " + html);
    }
}


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
        this.formatter = formatter;
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
        this.formatter.init(this.editor);
    }
    /**
     * Inject the Css classes/IDs into the HTML so the formatter can
     * use them when stylizing the content
     */
    injectAdditionalCssRules() {
        if (this.theme.additionalCssRules) {
            Object.entries(this.theme.additionalCssRules).forEach(([identifier, properties]) => {
                CssHelper.injectCss(identifier, properties);
            });
        }
    }
    /**
     * Inject the scrollbar classes into the HTML
     */
    injectScrollbarTheme() {
        if (this.theme.scrollbarTheme) {
            Object.entries(this.theme.scrollbarTheme).forEach(([identifier, properties]) => {
                CssHelper.injectCss("#" + this.getEditorId() + "::" + identifier, properties);
            });
        }
    }
    /**
     * Create the editor content container as an editable div
     * @param {string} futureContainerId Id of html element to convert to container for the editor
     */
    initializeContainer(futureContainerId) {
        const futureContainer = document.getElementById(futureContainerId);
        if (!futureContainer) {
            throw new Error("Cannot find element with id " + futureContainerId);
        }
        const futureContainerParent = futureContainer.parentElement;
        this.container.id = this.containerId;
        this.container.id = this.getContainerId();
        if (futureContainerParent) {
            futureContainerParent.replaceChild(this.container, futureContainer);
        }
        this.container.appendChild(this.menu);
        this.menu.id = this.getMenuId();
        // Add settings button
        const settingsSvg = DOMHelper.htmlElementFromString(`
        <div style='display: flex; justify-content: flex-end;'>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="9 18 15 12 9 6" />
            </svg>
            <svg display='none' width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="15 18 9 12 15 6" />
            </svg>
        </div>`);
        this.menu.appendChild(settingsSvg);
        settingsSvg.addEventListener("click", (event) => {
            this.settingsClick(event, this.menu);
        });
        this.container.appendChild(this.editor);
        this.editor.id = this.getEditorId();
        this.editor.contentEditable = "true";
        const settingsContainer = document.createElement("div");
        this.menu.appendChild(settingsContainer);
        settingsContainer.style.display = "none";
        settingsContainer.style.flexDirection = "column";
        this.formatter
            .getSettings()
            .forEach((element) => settingsContainer.appendChild(element));
    }
    /**
     * Event handler function for settings clicking
     * @param {MouseEvent} event click on a setting
     * @param {HTMLElement} menu the menu container as html element
     */
    settingsClick(event, menu) {
        if (event.currentTarget instanceof Element) {
            const target = event.currentTarget;
            if (target.parentElement) {
                // Switch arrow direction
                const svgs = target.children;
                for (const svg of svgs) {
                    if (svg.hasAttribute("display")) {
                        svg.removeAttribute("display");
                    }
                    else {
                        svg.setAttribute("display", "none");
                    }
                }
                // Resize menu
                if (target.parentElement.style.width === "") {
                    target.parentElement.style.width = "250px";
                    menu.children[1].style.display = "flex";
                }
                else {
                    target.parentElement.style.width = "";
                    menu.children[1].style.display = "none";
                }
            }
        }
    }
    /**
     * Change the editor theme by changint its style property
     */
    applyTheme() {
        this.injectContainerTheme();
        this.injectMenuCss();
        this.injectEditorCss();
        this.injectScrollbarTheme();
        this.injectAdditionalCssRules();
    }
    /**
     * Inject editor Css class into the HTML
     */
    injectEditorCss() {
        CssHelper.injectCss(this.getEditorIdentifier(), this.getEditorBaseCssProperties());
    }
    /**
     * Inject menu Css class into the HTML
     */
    injectMenuCss() {
        CssHelper.injectCss(this.getMenuIdentifier(), this.getMenuBaseCssProperties());
    }
    /**
     * Inject container Css class into the HTML
     */
    injectContainerTheme() {
        const containerCss = this.getContainerCssProperties();
        CssHelper.injectCss(this.getContainerIdentifier(), containerCss);
    }
    /**
     * @return {PropertiesHyphen} The combined hardcoded container Css with the container Css provided in the Theme
     */
    getContainerCssProperties() {
        if (this.theme.editorTheme) {
            return {
                ...this.getContainerBaseCssProperties(),
                ...this.theme.editorTheme,
            };
        }
        return this.getContainerBaseCssProperties();
    }
    /**
     * Hardcoded Css for the Container
     * @return {PropertiesHyphen}
     */
    getContainerBaseCssProperties() {
        return {
            cursor: "default",
            display: "flex",
            "flex-direction": "row",
            resize: "both",
            overflow: "auto",
        };
    }
    /**
     * Hardcoded Css for the menu
     * @return {PropertiesHyphen}
     */
    getMenuBaseCssProperties() {
        return {
            "border-right": "1px solid rgb(83, 79, 86)",
            margin: "20px 0px 20px 0px",
            padding: "15px 20px 15px 20px",
            display: "flex",
            "flex-direction": "column",
        };
    }
    /**
     * Hardcoded Css for the editor
     * @return {PropertiesHyphen}
     */
    getEditorBaseCssProperties() {
        return {
            flex: "1",
            outline: "none",
            overflow: "auto",
            "scrollbar-color": "red",
            padding: "20px 30px 20px 30px",
            margin: "10px 10px 10px 10px",
        };
    }
    /**
     * @return {string} Main container Id prepended with #
     */
    getContainerIdentifier() {
        return "#" + this.getContainerId();
    }
    /**
     * @return {string} Menu Id prepended with #
     */
    getMenuIdentifier() {
        return "#" + this.getMenuId();
    }
    /**
     * @return {string} Editor Id prepended with #
     */
    getEditorIdentifier() {
        return "#" + this.getEditorId();
    }
    /**
     * @return {string} Id of the whole container
     */
    getContainerId() {
        return this.containerId + "-container";
    }
    /**
     * @return {string} Id of the menu window
     */
    getMenuId() {
        return this.containerId + "-menu";
    }
    /**
     * @return {string} Id of the editor window
     */
    getEditorId() {
        return this.containerId + "-editor";
    }
}
/**
 * ! This is a base class, which must be extended for every different formatter
 * Base class for formatter logic used in the editor
 * To customize the formatting rules inherit this clas and
 * override the init method
 */
class Formatter {
}


/**
 * Markdown formatter which is based on the generic Formatter class
 * This formatter uses common Markdown syntax to
 */
class MDFormatter extends Formatter {
    constructor() {
        super(...arguments);
        /**
         * Hook to the editor div
         */
        this.editor = document.createElement("invalid");
    }
    /**
     * Initialize the mutation observer, which monitors changes happening
     * inside the container
     * @param {HTMLElement} editor HTML editable div used as editor
     */
    init(editor) {
        this.editor = editor;
        this.initRegex();
        const observer = new MutationObserver((mutations) => this.handleMutations(mutations));
        const observerConfig = {
            childList: true,
            subtree: true,
            characterData: true,
        };
        observer.observe(editor, observerConfig);
    }
    /**
     * Get list of property elements to put in the settings menu in the editor
     * @return {HTMLElement[]} List of settings as div elements
     */
    getSettings() {
        const settingsHtml = [
            `<div data-setting="dynamic-render" style='display: flex; flex-direction: row; justify-items: center; justify-content: space-between; margin-top: 20px;'>
                <div style='display: flex;'>
                    Dynamic render
                </div>
                <div style='display: flex;'>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"
                        stroke-linecap="round" stroke-linejoin="round" display="none">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    </svg>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"
                        stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="9 11 12 14 22 4" />
                        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                    </svg>
                </div>
            </div>`,
        ];
        const settingsElements = settingsHtml.map((setting) => DOMHelper.htmlElementFromString(setting));
        // TODO convert the following foreach to event delegation
        settingsElements.forEach((element) => {
            if (element.hasAttribute("data-setting")) {
                if (element.getAttribute("data-setting") === "dynamic-render") {
                    element.addEventListener("click", (event) => this.toggleDynamicRender(event));
                }
            }
        });
        return settingsElements;
    }
    /**
     * Method to handle the click event on the setting Toggle Dynamic Renderer
     * @param {MouseEvent} event Click event to toggle Dynamic Renderer
     */
    toggleDynamicRender(event) {
        if (event.currentTarget instanceof Element) {
            const settingsItem = event.currentTarget;
            const svgs = settingsItem?.children[1].children;
            for (const svg of svgs) {
                if (svg.hasAttribute("display")) {
                    svg.removeAttribute("display");
                    // TODO
                }
                else {
                    svg.setAttribute("display", "none");
                    // TODO
                }
            }
        }
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
     * @param {MutationRecord[]} mutations array of mutations
     */
    handleMutations(mutations) {
        for (const mutation of mutations) {
            this.handleMutation(mutation);
        }
    }
    /**
     * Handle a single mutation by calling the right method depending on the mutation type
     * @param {MutationRecord} mutation Mutation to parse
     */
    handleMutation(mutation) {
        if (mutation.type === "childList") {
            this.handleChildListMutation(mutation);
        }
        if (mutation.type === "characterData") {
            this.handleCharacterDataMutation(mutation);
        }
    }
    /**
     * Handle a single Mutation of type childList
     * @param {MutationRecord} mutation The mutation that happened
     */
    handleChildListMutation(mutation) {
        if (mutation.addedNodes.length > 0) {
            const addedNode = mutation.addedNodes[0];
            // Add first div if the editor is empty and this is the first addedd #text
            // The first text written will not be in a separate div, so create a div for it
            // and put the text inside
            if (addedNode.nodeName === "#text" &&
                addedNode.parentElement === this.editor) {
                const newDiv = document.createElement("div");
                this.editor.insertBefore(newDiv, addedNode.nextSibling);
                newDiv.appendChild(addedNode);
                // Move cursor to end of line
                const range = document.createRange();
                const sel = window.getSelection();
                range.setStart(this.editor.childNodes[0], newDiv.innerText.length);
                range.collapse(true);
                if (sel) {
                    sel.removeAllRanges();
                    sel.addRange(range);
                }
            }
            // If added node is a div, clear all classes
            if (addedNode.nodeName === "DIV" && mutation.target !== this.editor) {
                if (addedNode.nodeType === Node.ELEMENT_NODE) {
                    const elementFromNode = addedNode;
                    while (elementFromNode.hasAttributes()) {
                        elementFromNode.removeAttribute(elementFromNode.attributes[0].name);
                    }
                }
            }
        }
        // Check if the element is empty and clear its classes
        if (mutation.target.nodeType === Node.ELEMENT_NODE &&
            mutation.target !== this.editor) {
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
     * @param {MutationRecord} mutation The mutation that happened
     */
    handleCharacterDataMutation(mutation) {
        const div = mutation.target.parentElement;
        if (div) {
            div.className = "";
            this.applyFormatting(div);
        }
    }
    /**
     * Add specific MD formatting to a single element(paragraph)
     * @param {HTMLElement} div the element to apply specific formatting
     */
    applyFormatting(div) {
        for (const [className, regex] of MDFormatter.startLineRegex) {
            if (regex.test(div.innerText)) {
                div.className = className;
            }
        }
    }
    /**
     * Clear MD formatting from a single element(paragraph)
     * @param {HTMLElement} div the element to apply specific formatting
     */
    clearFormatting(div) {
        div.className = "";
    }
}
/**
 * An array of [<class-name>, <regex-expression>] tuples
 * <class-name> is the css class name added to the
 * element if it matches <regex-expression>
 */
MDFormatter.startLineRegex = [];


/**
 * Create Markdown Theme
 */
const darkMDFormatterTheme = {
    ".md-header-1": {
        margin: "24px 0 16px 0",
        "font-weight": "bold",
        "line-height": "1.25",
        "font-size": "2em",
        "padding-bottom": ".3em",
        "border-bottom": "1px solid #eaecef",
    },
    ".md-header-2": {
        margin: "24px 0 16px 0",
        "font-weight": "bold",
        "line-height": "1.25",
        "padding-bottom": ".3em",
        "border-bottom": "1px solid #eaecef",
        "font-size": "1.5em",
    },
    ".md-header-3": {
        margin: "24px 0 16px 0",
        "font-weight": "bold",
        "line-height": "1.25",
        "font-size": "1.25em",
    },
    ".md-header-4": {
        margin: "24px 0 16px 0",
        "font-weight": "bold",
        "line-height": "1.25",
        "font-size": "1em",
    },
    ".md-header-5": {
        margin: "24px 0 16px 0",
        "font-weight": "bold",
        "line-height": "1.25",
        "font-size": ".875em",
    },
    ".md-header-6": {
        margin: "24px 0 16px 0",
        "font-weight": "bold",
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
        color: "rgb(77, 172, 253)",
    },
    ".md-image": {
        "max-width": "100%",
    },
    ".md-inline-code": {
        "font-family": "monospace",
        padding: ".2em .4em",
        "font-size": "85%",
        "border-radius": "3px",
        "background-color": "rgba(220, 224, 228, 0.1) !important",
    },
    ".md-block-code": {
        "font-family": "monospace",
        "border-radius": "3px",
        "word-wrap": "normal",
        padding: "16px",
        background: "rgba(220, 224, 228, 0.1) !important",
    },
    ".md-table-header": {
        "line-height": "1.5",
        "border-spacing": "0",
        "border-collapse": "collapse",
        "text-align": "center",
        "font-weight": "bold",
        padding: "6px 13px",
        border: "1px solid #dfe2e5",
    },
    ".md-table-cell": {
        "line-height": "1.5",
        "border-spacing": "0",
        "border-collapse": "collapse",
        "text-align": "right",
        padding: "6px 13px",
        border: "1px solid #dfe2e5",
    },
    ".md-quote": {
        "border-spacing": "0",
        "border-collapse": "collapse",
        padding: "6px 13px",
        "border-left": ".25em solid rgb(53, 59, 66)",
    },
    ".md-horizontal-line": {
        "line-height": "1.5",
        overflow: "hidden",
        height: ".25em",
        padding: "0",
        margin: "24px 0",
        background: "white",
    },
};
/**
 * Dark theme for the scrollbar
 */
const darkScrollbar = {
    "-webkit-scrollbar": {
        width: "10px",
    },
    "-webkit-scrollbar-track": {
        background: "rgb(53, 59, 66)",
        "border-radius": "4px",
    },
    "-webkit-scrollbar-thumb": {
        background: "rgb(83, 79, 86)",
        "border-radius": "4px",
    },
    "-webkit-scrollbar-thumb:hover": {
        background: "rgb(93, 99, 106)",
    },
};
const darkEditorTheme = {
    background: "#202225",
    color: "#dcddde",
    height: "50%",
    "box-shadow": "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
};
/**
 * Example usage
 */
const customTheme = {
    scrollbarTheme: darkScrollbar,
    additionalCssRules: darkMDFormatterTheme,
    editorTheme: darkEditorTheme,
};
const editor = new Editor("editor", new MDFormatter(), customTheme);
