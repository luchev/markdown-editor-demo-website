/**
 * ! This is a base class, which must be extended for every different formatter
 * Base class for formatter logic used in the editor
 * To customize the formatting rules inherit this clas and
 * override the init method
 */
abstract class Formatter {
    /**
     * This method should initialize all the event handles and methods
     * which are responsible for formatting the content of the container
     * @param {HTMLElement} container HTML editable div used as editor
     */
    abstract init(container: HTMLElement): void;

    getSettings(): HTMLElement[] {
        return [];
    }
};

/**
 * Markdown formatter which is based on the generic Formatter class
 * This formatter uses common Markdown syntax to
 */
class MDFormatter extends Formatter {
    /**
     * An array of [<class-name>, <regex-expression>] tuples
     * <class-name> is the css class name added to the
     * element if it matches <regex-expression>
     */
    static startLineRegex: [string, RegExp][] = [];

    /**
     * Hook to the editor div
     */
    private editor: HTMLElement | null = null;

    /**
     * Initialize the mutation observer, which monitors changes happening
     * inside the container
     * @param {HTMLElement} editor HTML editable div used as editor
     */
    init(editor: HTMLElement): void {
        this.editor = editor;
        this.initRegex();

        const observer = new MutationObserver((mutations) => MDFormatter.handleMutations(editor, mutations));
        const observerConfig = {
            childList: true,
            subtree: true, // observe also grandchildren
            characterData: true, // observe typing
            // attributes: true,
        }
        observer.observe(editor, observerConfig);
    }

    /**
     * Get list of property elements to put in the settings menu in the editor
     */
    getSettings(): HTMLElement[] {
        const settings = [
            `<div onclick="MDFormatter.toggleDynamicRender(event)" style='display: flex; flex-direction: row; justify-items: center; justify-content: space-between; margin-top: 20px;'>
                <div style='display: flex;'>
                    Dynamic render
                </div>
                <div style='display: flex;'>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"
                        stroke-linecap="round" stroke-linejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    </svg>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"
                        stroke-linecap="round" stroke-linejoin="round" display="none">
                        <polyline points="9 11 12 14 22 4" />
                        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                    </svg>
                </div>
            </div>`
        ];

        return settings.map((setting) => DOMHelper.HTMLElementFromString(setting));
    }

    /**
     * Method to handle the click event on the setting Toggle Dynamic Renderer
     * @param event Click event to toggle Dynamic Renderer
     */
    static toggleDynamicRender(event: MouseEvent) {
        if (event.currentTarget instanceof Element) {
            const settingsItem = event.currentTarget as Element;
            const svgs = settingsItem?.children[1].children;
            for (const svg of svgs) {
                if (svg.hasAttribute("display")) {
                    svg.removeAttribute("display");
                    // TODO
                } else {
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
    private initRegex(): void {
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
    private static handleMutations(container: HTMLElement, mutations: MutationRecord[]): void {
        for (const mutation of mutations) {
            MDFormatter.handleMutation(container, mutation);
        }
    }

    /**
     * Handle a single mutation by calling the right method depending on the mutation type
     * @param {HTMLElement} container HTML editable div used as editor
     * @param {MutationRecord} mutations The mutation that happened
     */
    private static handleMutation(container: HTMLElement, mutation: MutationRecord): void {
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
    private static handleChildListMutation(editor: HTMLElement, mutation: MutationRecord): void {
        if (mutation.addedNodes.length > 0) {
            const addedNode: Node = mutation.addedNodes[0];

            // Add first div if the editor is empty and this is the first addedd #text
            // The first text written will not be in a separate div, so create a div for it
            // and put the text inside
            if (addedNode.nodeName === "#text" && addedNode.parentElement === editor) {
                const newDiv = document.createElement("div");
                editor.insertBefore(newDiv, addedNode.nextSibling);
                newDiv.appendChild(addedNode);

                // Move cursor to end of line
                const range: Range = document.createRange();
                const sel: Selection | null = window.getSelection();
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
                    const elementFromNode: HTMLElement = addedNode as HTMLElement;
                    while (elementFromNode.hasAttributes()) {
                        elementFromNode.removeAttribute(elementFromNode.attributes[0].name);
                    }
                }
            }
        }


        // Check if the element is empty and clear its classes
        if (mutation.target.nodeType === Node.ELEMENT_NODE && mutation.target !== editor) {
            const elementFromNode = mutation.target as HTMLElement;

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
    private static handleCharacterDataMutation(container: HTMLElement, mutation: MutationRecord): void {
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
};

/**
 * Abstraction of the editor as a collection of container, formatter, settings and themes
 */
class Editor {
    /**
     * The container for the menu and the editor
     */
    private container: HTMLElement = document.createElement("div");

    /**
     * The actual editor which holds the text content
     */
    private editor: HTMLElement = document.createElement("div");

    /**
     * The menu next to the editor
     */
    private menu: HTMLElement = document.createElement("div");

    /**
     * @param {string} containerId HTML element id which will become an ediable div
     * @param {Formatter} formatter Formatter which determines how the content is stylized
     * @param {Theme} theme Collection of theme objects
     */
    constructor(private containerId: string, private formatter: Formatter, private theme: Theme) {
        this.initializeContainer(containerId);
        this.applyTheme();

        this.formatter.init(this.editor);
    }

    /**
     * Inject the CSS classes/IDs into the HTML so the formatter can
     * use them when stylizing the content
     */
    private injectAdditionalCssIdentifiers(): void {
        if (this.theme.additionalCssIdentifiers) {
            Object.entries(this.theme.additionalCssIdentifiers).forEach(([identifier, properties]: [string, CssProperties]) => {
                CSSHelper.injectCss(identifier, properties);
            });
        }
    }

    /**
     * Inject the scrollbar classes into the HTML
     */
    private injectScrollbarTheme(): void {
        if (this.theme.scrollbarTheme) {
            Object.entries(this.theme.scrollbarTheme).forEach(([identifier, properties]: [string, CssProperties]) => {
                CSSHelper.injectCss("#" + this.getEditorId() + "::" + identifier, properties);
            });
        }
    }

    /**
     * Create the editor content container as an editable div
     */
    // Make sure the container is a div
    private initializeContainer(futureContainerId: string): void {
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
        const settingsSvg = DOMHelper.HTMLElementFromString(`
        <div style='display: flex; justify-content: flex-end;'>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="9 18 15 12 9 6" />
            </svg>
            <svg display='none' width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="15 18 9 12 15 6" />
            </svg>
        </div>`);
        this.menu.appendChild(settingsSvg);
        settingsSvg.addEventListener('click', (event) => {
            this.settingsClick(event, this.menu);
        });

        this.container.appendChild(this.editor);
        this.editor.id = this.getEditorId();
        this.editor.contentEditable = "true";


        const settingsContainer = document.createElement('div');
        this.menu.appendChild(settingsContainer);
        settingsContainer.style.display = 'none';
        settingsContainer.style.flexDirection = 'column';
        this.formatter.getSettings().forEach((element) => settingsContainer.appendChild(element));
    }

    private settingsClick(event: MouseEvent, menu: HTMLElement): void {
        if (event.currentTarget instanceof Element) {
            const target = event.currentTarget as Element;
            if (target.parentElement) {
                // Switch arrow direction
                const svgs = target.children;
                for (const svg of svgs) {
                    if (svg.hasAttribute("display")) {
                        svg.removeAttribute("display");
                    } else {
                        svg.setAttribute("display", "none");
                    }
                }

                // Resize menu
                if (target.parentElement.style.width === "") {
                    target.parentElement.style.width = "250px";
                    (menu.children[1] as HTMLElement).style.display = 'flex';
                } else {
                    target.parentElement.style.width = "";
                    (menu.children[1] as HTMLElement).style.display = 'none';
                }
            }
        }
    }

    /**
     * Change the editor theme by changint its style property
     */
    private applyTheme(): void {
        CSSHelper.injectCss(this.getMenuIdentifier(), this.getMenuBaseCssProperties());
        CSSHelper.injectCss(this.getEditorIdentifier(), this.getEditorBaseCssProperties());

        this.injectContainerTheme();
        this.injectAdditionalCssIdentifiers();
        this.injectScrollbarTheme();
    }

    /**
     * Inject the additional CSS classes into the HTML
     */
    private injectContainerTheme(): void {
        let properties: CssProperties;
        if (this.theme.editorTheme) {
            properties = { ...this.getContainerBaseCssProperties(), ...this.theme.editorTheme };
        } else {
            properties = this.getContainerBaseCssProperties();
        }

        CSSHelper.injectCss(this.getContainerIdentifier(), properties);
    }

    /**
     * Hardcoded CSS for the Container
     */
    private getContainerBaseCssProperties(): CssProperties {
        return {
            "cursor": "default",
            "display": "flex",
            "flex-direction": "row",
            "resize": "both",
            "overflow": "auto",
        };
    }

    /**
     * Hardcoded CSS for the menu
     */
    private getMenuBaseCssProperties(): CssProperties {
        return {
            "border-right": "1px solid rgb(83, 79, 86)",
            "margin": "20px 0px 20px 0px",
            "padding": "15px 20px 15px 20px",
            "display": "flex",
            "flex-direction": "column",
        };
    }

    /**
     * Hardcoded CSS for the editor
     */
    private getEditorBaseCssProperties(): CssProperties {
        return {
            "flex": "1",
            "outline": "none",
            "overflow": "auto",
            "scrollbar-color": "red",
            "padding": "20px 30px 20px 30px",
            "margin": "10px 10px 10px 10px",
        };
    }

    private getContainerIdentifier() {
        return "#" + this.getContainerId();
    }


    private getMenuIdentifier() {
        return "#" + this.getMenuId();
    }

    private getEditorIdentifier() {
        return "#" + this.getEditorId();
    }

    private getContainerId() {
        return this.containerId + "-container";
    }

    private getMenuId() {
        return this.containerId + "-menu";
    }

    private getEditorId() {
        return this.containerId + "-editor";
    }
};

/**
 * Add methods to work with CSS like injecting classes and
 * converting CSS properties to string which looks like css
 */
class CSSHelper {
    /**
     * The newly added style element in the DOM where all the injections arehappening
     */
    private static styleElement: HTMLStyleElement;
    /**
     * The instance is used only to initialize the class once
     */
    private static instance: CSSHelper = new CSSHelper();

    /**
     * Deprecated singleton, the class is now static
     * The only remaining part of the singleton is the instance
     * which ensures that the constructor has been called and a new
     * style tag has been injected into the HTML
     */
    private constructor() {
        CSSHelper.styleElement = document.createElement("style");
        CSSHelper.styleElement.type = "text/css";
        document.getElementsByTagName("head")[0].appendChild(CSSHelper.styleElement);
    }

    /**
     * Inject CSS given an identifier and properties
     * @param {string} identifier CSS identifier, e.g '#some-id' or 'a:hover'
     * @param {CssProperties} properties CSS properties
     */
    static injectCss(identifier: string, properties: CssProperties): void {
        const cssTextPropertoes = CSSHelper.stringifyCSSProperties(properties);
        CSSHelper.styleElement.innerHTML += `${identifier} { ${cssTextPropertoes} } \n`;
    }

    /**
     * Convert a list of css properties to a string which is valid css
     * @param {CssProperties} property CSSproperties
     */
    static stringifyCSSProperties(property: CssProperties): string {
        let cssString: string = "";
        Object.entries(property).forEach(([key, value]: [string, string]) => {
            if (value !== "") {
                cssString += `${key}: ${value}; `;
            }
        });
        return cssString;
    }
};

/**
 * Class providing useful methods to work with the HTML DOM
 */
class DOMHelper {
    static HTMLElementFromString(html: string): HTMLElement {
        const creationHelperElement = document.createElement("div");
        creationHelperElement.innerHTML = html.trim();
        if (creationHelperElement.firstChild && creationHelperElement.firstChild.nodeType === Node.ELEMENT_NODE) {
            return creationHelperElement.firstChild as HTMLElement;
        }
        throw new Error("Failed to create element from html: " + html);
    }
};

/**
 * Create Markdown Theme
 */
let darkMDFormatterTheme: MDCSSClasses = {
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
 * A collection of theme objects
 */
interface Theme {
    editorTheme?: EditorTheme;
    scrollbarTheme?: ScrollbarTheme;
    additionalCssIdentifiers?: CssIdentifiers;
};

/**
 * Theme for the scrollbar
 */
interface ScrollbarTheme {
    "-webkit-scrollbar"?: CssProperties;
    "-webkit-scrollbar-track"?: CssProperties;
    "-webkit-scrollbar-thumb"?: CssProperties;
    "-webkit-scrollbar-thumb:hover"?: CssProperties;
};

/**
 * Theme for the editor as a whole
 */
interface EditorTheme {
    "background"?: string;
    "color"?: string;
    "width"?: string;
    "height"?: string;
    "box-shadow"?: string;
}

/**
 * Dark theme for the scrollbar
 */
let darkScrollbar: ScrollbarTheme = {
    "-webkit-scrollbar": {
        "width": "10px",
    },
    "-webkit-scrollbar-track": {
        "background": "rgb(53, 59, 66)",
        "border-radius": "4px",
    },
    "-webkit-scrollbar-thumb": {
        "background": "rgb(83, 79, 86)",
        "border-radius": "4px",
    },
    "-webkit-scrollbar-thumb:hover": {
        "background": "rgb(93, 99, 106)",
    },
}

/**
 * Example usage
 */
let customTheme: Theme = {
    scrollbarTheme: darkScrollbar,
    additionalCssIdentifiers: darkMDFormatterTheme,
    editorTheme: {
        "background": "#202225",
        "color": "#dcddde",
        "height": "50%",
        "box-shadow": "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)"
    }
};
const editor = new Editor("editor", new MDFormatter(), customTheme);

/**
 * Editor theme is a set of CSS properties
 * Editor Theme is directly applied as style to the editor
 */
interface ContainerTheme extends CssProperties { }

/**
 * Markdown theme where the field names represent class names
 * and the values represent CSS class properties
 */
interface MDCSSClasses extends CssIdentifiers {
    ".md-header-1"?: CssProperties;
    ".md-header-2"?: CssProperties;
    ".md-header-3"?: CssProperties;
    ".md-header-4"?: CssProperties;
    ".md-header-5"?: CssProperties;
    ".md-header-6"?: CssProperties;
    ".md-italics"?: CssProperties;
    ".md-bold"?: CssProperties;
    ".md-strikethrough"?: CssProperties;
    ".md-ordered-list"?: CssProperties;
    ".md-unordered-list"?: CssProperties;
    ".md-link"?: CssProperties;
    ".md-image"?: CssProperties;
    ".md-inline-code"?: CssProperties;
    ".md-block-code"?: CssProperties;
    ".md-table-header"?: CssProperties;
    ".md-table-cell"?: CssProperties;
    ".md-quote"?: CssProperties;
    ".md-horizontal-line"?: CssProperties;
}

/**
 * Generic formatter theme
 */
interface CssIdentifiers { }

/**
 * CSS properties named as they are usually typed in CSS files
 * @example border-radius, color, box-shadow
 */
interface CssProperties extends StandardPropertiesHyphen, SvgPropertiesHyphen { }

/**
 * CSS properties named as DOM object fields.
 * border-radius in normal css is named borderRadius as a DOM object field.
 * @example borderRadius, color, boxShadow
 */
interface CSSObjectProperties extends StandardProperties, SvgProperties { }

/**
 * Automatically generated interfaces with lists of CSS properties
 * @see https://github.com/frenic/csstype
 */

interface StandardProperties extends StandardLonghandProperties, StandardShorthandProperties { }
interface StandardLonghandProperties {
    alignContent?: string;
    alignItems?: string;
    alignSelf?: string;
    animationDelay?: string;
    animationDirection?: string;
    animationDuration?: string;
    animationFillMode?: string;
    animationIterationCount?: string;
    animationName?: string;
    animationPlayState?: string;
    animationTimingFunction?: string;
    appearance?: string;
    aspectRatio?: string;
    backdropFilter?: string;
    backfaceVisibility?: string;
    backgroundAttachment?: string;
    backgroundBlendMode?: string;
    backgroundClip?: string;
    backgroundColor?: string;
    backgroundImage?: string;
    backgroundOrigin?: string;
    backgroundPosition?: string;
    backgroundPositionX?: string;
    backgroundPositionY?: string;
    backgroundRepeat?: string;
    backgroundSize?: string;
    blockOverflow?: string;
    blockSize?: string;
    borderBlockColor?: string;
    borderBlockEndColor?: string;
    borderBlockEndStyle?: string;
    borderBlockEndWidth?: string;
    borderBlockStartColor?: string;
    borderBlockStartStyle?: string;
    borderBlockStartWidth?: string;
    borderBlockStyle?: string;
    borderBlockWidth?: string;
    borderBottomColor?: string;
    borderBottomLeftRadius?: string;
    borderBottomRightRadius?: string;
    borderBottomStyle?: string;
    borderBottomWidth?: string;
    borderCollapse?: string;
    borderEndEndRadius?: string;
    borderEndStartRadius?: string;
    borderImageOutset?: string;
    borderImageRepeat?: string;
    borderImageSlice?: string;
    borderImageSource?: string;
    borderImageWidth?: string;
    borderInlineColor?: string;
    borderInlineEndColor?: string;
    borderInlineEndStyle?: string;
    borderInlineEndWidth?: string;
    borderInlineStartColor?: string;
    borderInlineStartStyle?: string;
    borderInlineStartWidth?: string;
    borderInlineStyle?: string;
    borderInlineWidth?: string;
    borderLeftColor?: string;
    borderLeftStyle?: string;
    borderLeftWidth?: string;
    borderRightColor?: string;
    borderRightStyle?: string;
    borderRightWidth?: string;
    borderSpacing?: string;
    borderStartEndRadius?: string;
    borderStartStartRadius?: string;
    borderTopColor?: string;
    borderTopLeftRadius?: string;
    borderTopRightRadius?: string;
    borderTopStyle?: string;
    borderTopWidth?: string;
    bottom?: string;
    boxDecorationBreak?: string;
    boxShadow?: string;
    boxSizing?: string;
    breakAfter?: string;
    breakBefore?: string;
    breakInside?: string;
    captionSide?: string;
    caretColor?: string;
    clear?: string;
    clipPath?: string;
    color?: string;
    colorAdjust?: string;
    columnCount?: string;
    columnFill?: string;
    columnGap?: string;
    columnRuleColor?: string;
    columnRuleStyle?: string;
    columnRuleWidth?: string;
    columnSpan?: string;
    columnWidth?: string;
    contain?: string;
    content?: string;
    counterIncrement?: string;
    counterReset?: string;
    counterSet?: string;
    cursor?: string;
    direction?: string;
    display?: string;
    emptyCells?: string;
    filter?: string;
    flexBasis?: string;
    flexDirection?: string;
    flexGrow?: string;
    flexShrink?: string;
    flexWrap?: string;
    float?: string;
    fontFamily?: string;
    fontFeatureSettings?: string;
    fontKerning?: string;
    fontLanguageOverride?: string;
    fontOpticalSizing?: string;
    fontSize?: string;
    fontSizeAdjust?: string;
    fontStretch?: string;
    fontStyle?: string;
    fontSynthesis?: string;
    fontVariant?: string;
    fontVariantCaps?: string;
    fontVariantEastAsian?: string;
    fontVariantLigatures?: string;
    fontVariantNumeric?: string;
    fontVariantPosition?: string;
    fontVariationSettings?: string;
    fontWeight?: string;
    gridAutoColumns?: string;
    gridAutoFlow?: string;
    gridAutoRows?: string;
    gridColumnEnd?: string;
    gridColumnStart?: string;
    gridRowEnd?: string;
    gridRowStart?: string;
    gridTemplateAreas?: string;
    gridTemplateColumns?: string;
    gridTemplateRows?: string;
    hangingPunctuation?: string;
    height?: string;
    hyphens?: string;
    imageOrientation?: string;
    imageRendering?: string;
    imageResolution?: string;
    initialLetter?: string;
    inlineSize?: string;
    inset?: string;
    insetBlock?: string;
    insetBlockEnd?: string;
    insetBlockStart?: string;
    insetInline?: string;
    insetInlineEnd?: string;
    insetInlineStart?: string;
    isolation?: string;
    justifyContent?: string;
    justifyItems?: string;
    justifySelf?: string;
    left?: string;
    letterSpacing?: string;
    lineBreak?: string;
    lineHeight?: string;
    lineHeightStep?: string;
    listStyleImage?: string;
    listStylePosition?: string;
    listStyleType?: string;
    marginBlock?: string;
    marginBlockEnd?: string;
    marginBlockStart?: string;
    marginBottom?: string;
    marginInline?: string;
    marginInlineEnd?: string;
    marginInlineStart?: string;
    marginLeft?: string;
    marginRight?: string;
    marginTop?: string;
    maskBorderMode?: string;
    maskBorderOutset?: string;
    maskBorderRepeat?: string;
    maskBorderSlice?: string;
    maskBorderSource?: string;
    maskBorderWidth?: string;
    maskClip?: string;
    maskComposite?: string;
    maskImage?: string;
    maskMode?: string;
    maskOrigin?: string;
    maskPosition?: string;
    maskRepeat?: string;
    maskSize?: string;
    maskType?: string;
    maxBlockSize?: string;
    maxHeight?: string;
    maxInlineSize?: string;
    maxLines?: string;
    maxWidth?: string;
    minBlockSize?: string;
    minHeight?: string;
    minInlineSize?: string;
    minWidth?: string;
    mixBlendMode?: string;
    motionDistance?: string;
    motionPath?: string;
    motionRotation?: string;
    objectFit?: string;
    objectPosition?: string;
    offsetAnchor?: string;
    offsetDistance?: string;
    offsetPath?: string;
    offsetRotate?: string;
    offsetRotation?: string;
    opacity?: string;
    order?: string;
    orphans?: string;
    outlineColor?: string;
    outlineOffset?: string;
    outlineStyle?: string;
    outlineWidth?: string;
    overflow?: string;
    overflowAnchor?: string;
    overflowBlock?: string;
    overflowClipBox?: string;
    overflowInline?: string;
    overflowWrap?: string;
    overflowX?: string;
    overflowY?: string;
    overscrollBehavior?: string;
    overscrollBehaviorBlock?: string;
    overscrollBehaviorInline?: string;
    overscrollBehaviorX?: string;
    overscrollBehaviorY?: string;
    paddingBlock?: string;
    paddingBlockEnd?: string;
    paddingBlockStart?: string;
    paddingBottom?: string;
    paddingInline?: string;
    paddingInlineEnd?: string;
    paddingInlineStart?: string;
    paddingLeft?: string;
    paddingRight?: string;
    paddingTop?: string;
    pageBreakAfter?: string;
    pageBreakBefore?: string;
    pageBreakInside?: string;
    paintOrder?: string;
    perspective?: string;
    perspectiveOrigin?: string;
    placeContent?: string;
    pointerEvents?: string;
    position?: string;
    quotes?: string;
    resize?: string;
    right?: string;
    rotate?: string;
    rowGap?: string;
    rubyAlign?: string;
    rubyMerge?: string;
    rubyPosition?: string;
    scale?: string;
    scrollBehavior?: string;
    scrollMargin?: string;
    scrollMarginBlock?: string;
    scrollMarginBlockEnd?: string;
    scrollMarginBlockStart?: string;
    scrollMarginBottom?: string;
    scrollMarginInline?: string;
    scrollMarginInlineEnd?: string;
    scrollMarginInlineStart?: string;
    scrollMarginLeft?: string;
    scrollMarginRight?: string;
    scrollMarginTop?: string;
    scrollPadding?: string;
    scrollPaddingBlock?: string;
    scrollPaddingBlockEnd?: string;
    scrollPaddingBlockStart?: string;
    scrollPaddingBottom?: string;
    scrollPaddingInline?: string;
    scrollPaddingInlineEnd?: string;
    scrollPaddingInlineStart?: string;
    scrollPaddingLeft?: string;
    scrollPaddingRight?: string;
    scrollPaddingTop?: string;
    scrollSnapAlign?: string;
    scrollSnapStop?: string;
    scrollSnapType?: string;
    scrollbarColor?: string;
    scrollbarWidth?: string;
    shapeImageThreshold?: string;
    shapeMargin?: string;
    shapeOutside?: string;
    tabSize?: string;
    tableLayout?: string;
    textAlign?: string;
    textAlignLast?: string;
    textCombineUpright?: string;
    textDecorationColor?: string;
    textDecorationLine?: string;
    textDecorationSkip?: string;
    textDecorationSkipInk?: string;
    textDecorationStyle?: string;
    textDecorationThickness?: string;
    textDecorationWidth?: string;
    textEmphasisColor?: string;
    textEmphasisPosition?: string;
    textEmphasisStyle?: string;
    textIndent?: string;
    textJustify?: string;
    textOrientation?: string;
    textOverflow?: string;
    textRendering?: string;
    textShadow?: string;
    textSizeAdjust?: string;
    textTransform?: string;
    textUnderlineOffset?: string;
    textUnderlinePosition?: string;
    top?: string;
    touchAction?: string;
    transform?: string;
    transformBox?: string;
    transformOrigin?: string;
    transformStyle?: string;
    transitionDelay?: string;
    transitionDuration?: string;
    transitionProperty?: string;
    transitionTimingFunction?: string;
    translate?: string;
    unicodeBidi?: string;
    userSelect?: string;
    verticalAlign?: string;
    visibility?: string;
    whiteSpace?: string;
    widows?: string;
    width?: string;
    willChange?: string;
    wordBreak?: string;
    wordSpacing?: string;
    wordWrap?: string;
    writingMode?: string;
    zIndex?: string;
    zoom?: string;
}
interface StandardShorthandProperties {
    all?: string;
    animation?: string;
    background?: string;
    border?: string;
    borderBlock?: string;
    borderBlockEnd?: string;
    borderBlockStart?: string;
    borderBottom?: string;
    borderColor?: string;
    borderImage?: string;
    borderInline?: string;
    borderInlineEnd?: string;
    borderInlineStart?: string;
    borderLeft?: string;
    borderRadius?: string;
    borderRight?: string;
    borderStyle?: string;
    borderTop?: string;
    borderWidth?: string;
    columnRule?: string;
    columns?: string;
    flex?: string;
    flexFlow?: string;
    font?: string;
    gap?: string;
    grid?: string;
    gridArea?: string;
    gridColumn?: string;
    gridRow?: string;
    gridTemplate?: string;
    lineClamp?: string;
    listStyle?: string;
    margin?: string;
    mask?: string;
    maskBorder?: string;
    motion?: string;
    offset?: string;
    outline?: string;
    padding?: string;
    placeItems?: string;
    placeSelf?: string;
    textDecoration?: string;
    textEmphasis?: string;
    transition?: string;
}
interface SvgProperties {
    alignmentBaseline?: string;
    baselineShift?: string;
    clip?: string;
    clipPath?: string;
    clipRule?: string;
    color?: string;
    colorInterpolation?: string;
    colorRendering?: string;
    cursor?: string;
    direction?: string;
    display?: string;
    dominantBaseline?: string;
    fill?: string;
    fillOpacity?: string;
    fillRule?: string;
    filter?: string;
    floodColor?: string;
    floodOpacity?: string;
    font?: string;
    fontFamily?: string;
    fontSize?: string;
    fontSizeAdjust?: string;
    fontStretch?: string;
    fontStyle?: string;
    fontVariant?: string;
    fontWeight?: string;
    glyphOrientationVertical?: string;
    imageRendering?: string;
    letterSpacing?: string;
    lightingColor?: string;
    lineHeight?: string;
    marker?: string;
    markerEnd?: string;
    markerMid?: string;
    markerStart?: string;
    mask?: string;
    opacity?: string;
    overflow?: string;
    paintOrder?: string;
    pointerEvents?: string;
    shapeRendering?: string;
    stopColor?: string;
    stopOpacity?: string;
    stroke?: string;
    strokeDasharray?: string;
    strokeDashoffset?: string;
    strokeLinecap?: string;
    strokeLinejoin?: string;
    strokeMiterlimit?: string;
    strokeOpacity?: string;
    strokeWidth?: string;
    textAnchor?: string;
    textDecoration?: string;
    textRendering?: string;
    unicodeBidi?: string;
    vectorEffect?: string;
    visibility?: string;
    whiteSpace?: string;
    wordSpacing?: string;
    writingMode?: string;
}
interface StandardPropertiesHyphen extends StandardLonghandPropertiesHyphen, StandardShorthandPropertiesHyphen { }
interface StandardLonghandPropertiesHyphen {
    "align-content"?: string;
    "align-items"?: string;
    "align-self"?: string;
    "animation-delay"?: string;
    "animation-direction"?: string;
    "animation-duration"?: string;
    "animation-fill-mode"?: string;
    "animation-iteration-count"?: string;
    "animation-name"?: string;
    "animation-play-state"?: string;
    "animation-timing-function"?: string;
    "appearance"?: string;
    "aspect-ratio"?: string;
    "backdrop-filter"?: string;
    "backface-visibility"?: string;
    "background-attachment"?: string;
    "background-blend-mode"?: string;
    "background-clip"?: string;
    "background-color"?: string;
    "background-image"?: string;
    "background-origin"?: string;
    "background-position"?: string;
    "background-position-x"?: string;
    "background-position-y"?: string;
    "background-repeat"?: string;
    "background-size"?: string;
    "block-overflow"?: string;
    "block-size"?: string;
    "border-block-color"?: string;
    "border-block-end-color"?: string;
    "border-block-end-style"?: string;
    "border-block-end-width"?: string;
    "border-block-start-color"?: string;
    "border-block-start-style"?: string;
    "border-block-start-width"?: string;
    "border-block-style"?: string;
    "border-block-width"?: string;
    "border-bottom-color"?: string;
    "border-bottom-left-radius"?: string;
    "border-bottom-right-radius"?: string;
    "border-bottom-style"?: string;
    "border-bottom-width"?: string;
    "border-collapse"?: string;
    "border-end-end-radius"?: string;
    "border-end-start-radius"?: string;
    "border-image-outset"?: string;
    "border-image-repeat"?: string;
    "border-image-slice"?: string;
    "border-image-source"?: string;
    "border-image-width"?: string;
    "border-inline-color"?: string;
    "border-inline-end-color"?: string;
    "border-inline-end-style"?: string;
    "border-inline-end-width"?: string;
    "border-inline-start-color"?: string;
    "border-inline-start-style"?: string;
    "border-inline-start-width"?: string;
    "border-inline-style"?: string;
    "border-inline-width"?: string;
    "border-left-color"?: string;
    "border-left-style"?: string;
    "border-left-width"?: string;
    "border-right-color"?: string;
    "border-right-style"?: string;
    "border-right-width"?: string;
    "border-spacing"?: string;
    "border-start-end-radius"?: string;
    "border-start-start-radius"?: string;
    "border-top-color"?: string;
    "border-top-left-radius"?: string;
    "border-top-right-radius"?: string;
    "border-top-style"?: string;
    "border-top-width"?: string;
    "bottom"?: string;
    "box-decoration-break"?: string;
    "box-shadow"?: string;
    "box-sizing"?: string;
    "break-after"?: string;
    "break-before"?: string;
    "break-inside"?: string;
    "caption-side"?: string;
    "caret-color"?: string;
    "clear"?: string;
    "clip-path"?: string;
    "color"?: string;
    "color-adjust"?: string;
    "column-count"?: string;
    "column-fill"?: string;
    "column-gap"?: string;
    "column-rule-color"?: string;
    "column-rule-style"?: string;
    "column-rule-width"?: string;
    "column-span"?: string;
    "column-width"?: string;
    "contain"?: string;
    "content"?: string;
    "counter-increment"?: string;
    "counter-reset"?: string;
    "counter-set"?: string;
    "cursor"?: string;
    "direction"?: string;
    "display"?: string;
    "empty-cells"?: string;
    "filter"?: string;
    "flex-basis"?: string;
    "flex-direction"?: string;
    "flex-grow"?: string;
    "flex-shrink"?: string;
    "flex-wrap"?: string;
    "float"?: string;
    "font-family"?: string;
    "font-feature-settings"?: string;
    "font-kerning"?: string;
    "font-language-override"?: string;
    "font-optical-sizing"?: string;
    "font-size"?: string;
    "font-size-adjust"?: string;
    "font-stretch"?: string;
    "font-style"?: string;
    "font-synthesis"?: string;
    "font-variant"?: string;
    "font-variant-caps"?: string;
    "font-variant-east-asian"?: string;
    "font-variant-ligatures"?: string;
    "font-variant-numeric"?: string;
    "font-variant-position"?: string;
    "font-variation-settings"?: string;
    "font-weight"?: string;
    "grid-auto-columns"?: string;
    "grid-auto-flow"?: string;
    "grid-auto-rows"?: string;
    "grid-column-end"?: string;
    "grid-column-start"?: string;
    "grid-row-end"?: string;
    "grid-row-start"?: string;
    "grid-template-areas"?: string;
    "grid-template-columns"?: string;
    "grid-template-rows"?: string;
    "hanging-punctuation"?: string;
    "height"?: string;
    "hyphens"?: string;
    "image-orientation"?: string;
    "image-rendering"?: string;
    "image-resolution"?: string;
    "initial-letter"?: string;
    "inline-size"?: string;
    "inset"?: string;
    "inset-block"?: string;
    "inset-block-end"?: string;
    "inset-block-start"?: string;
    "inset-inline"?: string;
    "inset-inline-end"?: string;
    "inset-inline-start"?: string;
    "isolation"?: string;
    "justify-content"?: string;
    "justify-items"?: string;
    "justify-self"?: string;
    "left"?: string;
    "letter-spacing"?: string;
    "line-break"?: string;
    "line-height"?: string;
    "line-height-step"?: string;
    "list-style-image"?: string;
    "list-style-position"?: string;
    "list-style-type"?: string;
    "margin-block"?: string;
    "margin-block-end"?: string;
    "margin-block-start"?: string;
    "margin-bottom"?: string;
    "margin-inline"?: string;
    "margin-inline-end"?: string;
    "margin-inline-start"?: string;
    "margin-left"?: string;
    "margin-right"?: string;
    "margin-top"?: string;
    "mask-border-mode"?: string;
    "mask-border-outset"?: string;
    "mask-border-repeat"?: string;
    "mask-border-slice"?: string;
    "mask-border-source"?: string;
    "mask-border-width"?: string;
    "mask-clip"?: string;
    "mask-composite"?: string;
    "mask-image"?: string;
    "mask-mode"?: string;
    "mask-origin"?: string;
    "mask-position"?: string;
    "mask-repeat"?: string;
    "mask-size"?: string;
    "mask-type"?: string;
    "max-block-size"?: string;
    "max-height"?: string;
    "max-inline-size"?: string;
    "max-lines"?: string;
    "max-width"?: string;
    "min-block-size"?: string;
    "min-height"?: string;
    "min-inline-size"?: string;
    "min-width"?: string;
    "mix-blend-mode"?: string;
    "motion-distance"?: string;
    "motion-path"?: string;
    "motion-rotation"?: string;
    "object-fit"?: string;
    "object-position"?: string;
    "offset-anchor"?: string;
    "offset-distance"?: string;
    "offset-path"?: string;
    "offset-rotate"?: string;
    "offset-rotation"?: string;
    "opacity"?: string;
    "order"?: string;
    "orphans"?: string;
    "outline-color"?: string;
    "outline-offset"?: string;
    "outline-style"?: string;
    "outline-width"?: string;
    "overflow"?: string;
    "overflow-anchor"?: string;
    "overflow-block"?: string;
    "overflow-clip-box"?: string;
    "overflow-inline"?: string;
    "overflow-wrap"?: string;
    "overflow-x"?: string;
    "overflow-y"?: string;
    "overscroll-behavior"?: string;
    "overscroll-behavior-block"?: string;
    "overscroll-behavior-inline"?: string;
    "overscroll-behavior-x"?: string;
    "overscroll-behavior-y"?: string;
    "padding-block"?: string;
    "padding-block-end"?: string;
    "padding-block-start"?: string;
    "padding-bottom"?: string;
    "padding-inline"?: string;
    "padding-inline-end"?: string;
    "padding-inline-start"?: string;
    "padding-left"?: string;
    "padding-right"?: string;
    "padding-top"?: string;
    "page-break-after"?: string;
    "page-break-before"?: string;
    "page-break-inside"?: string;
    "paint-order"?: string;
    "perspective"?: string;
    "perspective-origin"?: string;
    "place-content"?: string;
    "pointer-events"?: string;
    "position"?: string;
    "quotes"?: string;
    "resize"?: string;
    "right"?: string;
    "rotate"?: string;
    "row-gap"?: string;
    "ruby-align"?: string;
    "ruby-merge"?: string;
    "ruby-position"?: string;
    "scale"?: string;
    "scroll-behavior"?: string;
    "scroll-margin"?: string;
    "scroll-margin-block"?: string;
    "scroll-margin-block-end"?: string;
    "scroll-margin-block-start"?: string;
    "scroll-margin-bottom"?: string;
    "scroll-margin-inline"?: string;
    "scroll-margin-inline-end"?: string;
    "scroll-margin-inline-start"?: string;
    "scroll-margin-left"?: string;
    "scroll-margin-right"?: string;
    "scroll-margin-top"?: string;
    "scroll-padding"?: string;
    "scroll-padding-block"?: string;
    "scroll-padding-block-end"?: string;
    "scroll-padding-block-start"?: string;
    "scroll-padding-bottom"?: string;
    "scroll-padding-inline"?: string;
    "scroll-padding-inline-end"?: string;
    "scroll-padding-inline-start"?: string;
    "scroll-padding-left"?: string;
    "scroll-padding-right"?: string;
    "scroll-padding-top"?: string;
    "scroll-snap-align"?: string;
    "scroll-snap-stop"?: string;
    "scroll-snap-type"?: string;
    "scrollbar-color"?: string;
    "scrollbar-width"?: string;
    "shape-image-threshold"?: string;
    "shape-margin"?: string;
    "shape-outside"?: string;
    "tab-size"?: string;
    "table-layout"?: string;
    "text-align"?: string;
    "text-align-last"?: string;
    "text-combine-upright"?: string;
    "text-decoration-color"?: string;
    "text-decoration-line"?: string;
    "text-decoration-skip"?: string;
    "text-decoration-skip-ink"?: string;
    "text-decoration-style"?: string;
    "text-decoration-thickness"?: string;
    "text-decoration-width"?: string;
    "text-emphasis-color"?: string;
    "text-emphasis-position"?: string;
    "text-emphasis-style"?: string;
    "text-indent"?: string;
    "text-justify"?: string;
    "text-orientation"?: string;
    "text-overflow"?: string;
    "text-rendering"?: string;
    "text-shadow"?: string;
    "text-size-adjust"?: string;
    "text-transform"?: string;
    "text-underline-offset"?: string;
    "text-underline-position"?: string;
    "top"?: string;
    "touch-action"?: string;
    "transform"?: string;
    "transform-box"?: string;
    "transform-origin"?: string;
    "transform-style"?: string;
    "transition-delay"?: string;
    "transition-duration"?: string;
    "transition-property"?: string;
    "transition-timing-function"?: string;
    "translate"?: string;
    "unicode-bidi"?: string;
    "user-select"?: string;
    "vertical-align"?: string;
    "visibility"?: string;
    "white-space"?: string;
    "widows"?: string;
    "width"?: string;
    "will-change"?: string;
    "word-break"?: string;
    "word-spacing"?: string;
    "word-wrap"?: string;
    "writing-mode"?: string;
    "z-index"?: string;
    "zoom"?: string;
}
interface StandardShorthandPropertiesHyphen {
    "all"?: string;
    "animation"?: string;
    "background"?: string;
    "border"?: string;
    "border-block"?: string;
    "border-block-end"?: string;
    "border-block-start"?: string;
    "border-bottom"?: string;
    "border-color"?: string;
    "border-image"?: string;
    "border-inline"?: string;
    "border-inline-end"?: string;
    "border-inline-start"?: string;
    "border-left"?: string;
    "border-radius"?: string;
    "border-right"?: string;
    "border-style"?: string;
    "border-top"?: string;
    "border-width"?: string;
    "column-rule"?: string;
    "columns"?: string;
    "flex"?: string;
    "flex-flow"?: string;
    "font"?: string;
    "gap"?: string;
    "grid"?: string;
    "grid-area"?: string;
    "grid-column"?: string;
    "grid-row"?: string;
    "grid-template"?: string;
    "line-clamp"?: string;
    "list-style"?: string;
    "margin"?: string;
    "mask"?: string;
    "mask-border"?: string;
    "motion"?: string;
    "offset"?: string;
    "outline"?: string;
    "padding"?: string;
    "place-items"?: string;
    "place-self"?: string;
    "text-decoration"?: string;
    "text-emphasis"?: string;
    "transition"?: string;
}
interface SvgPropertiesHyphen {
    "alignment-baseline"?: string;
    "baseline-shift"?: string;
    "clip"?: string;
    "clip-path"?: string;
    "clip-rule"?: string;
    "color"?: string;
    "color-interpolation"?: string;
    "color-rendering"?: string;
    "cursor"?: string;
    "direction"?: string;
    "display"?: string;
    "dominant-baseline"?: string;
    "fill"?: string;
    "fill-opacity"?: string;
    "fill-rule"?: string;
    "filter"?: string;
    "flood-color"?: string;
    "flood-opacity"?: string;
    "font"?: string;
    "font-family"?: string;
    "font-size"?: string;
    "font-size-adjust"?: string;
    "font-stretch"?: string;
    "font-style"?: string;
    "font-variant"?: string;
    "font-weight"?: string;
    "glyph-orientation-vertical"?: string;
    "image-rendering"?: string;
    "letter-spacing"?: string;
    "lighting-color"?: string;
    "line-height"?: string;
    "marker"?: string;
    "marker-end"?: string;
    "marker-mid"?: string;
    "marker-start"?: string;
    "mask"?: string;
    "opacity"?: string;
    "overflow"?: string;
    "paint-order"?: string;
    "pointer-events"?: string;
    "shape-rendering"?: string;
    "stop-color"?: string;
    "stop-opacity"?: string;
    "stroke"?: string;
    "stroke-dasharray"?: string;
    "stroke-dashoffset"?: string;
    "stroke-linecap"?: string;
    "stroke-linejoin"?: string;
    "stroke-miterlimit"?: string;
    "stroke-opacity"?: string;
    "stroke-width"?: string;
    "text-anchor"?: string;
    "text-decoration"?: string;
    "text-rendering"?: string;
    "unicode-bidi"?: string;
    "vector-effect"?: string;
    "visibility"?: string;
    "white-space"?: string;
    "word-spacing"?: string;
    "writing-mode"?: string;
}
