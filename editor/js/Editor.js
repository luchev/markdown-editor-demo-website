import { CssHelper } from "./CssHelper";
import { DOMHelper } from "./DOMHelper";
/**
 * Abstraction of the editor as a collection of container, formatter, settings and themes
 */
export class Editor {
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
