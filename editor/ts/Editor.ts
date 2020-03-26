import { Theme } from "./Theme";
import { PropertiesHyphen } from "csstype";
import { CssHelper } from './CssHelper';

/**
 * Abstraction of the editor as a collection of container, formatter, settings and themes
 */
export class Editor {
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
    private injectAdditionalCssRules(): void {
        if (this.theme.additionalCssRules) {
            Object.entries(this.theme.additionalCssRules).forEach(([identifier, properties]: [string, PropertiesHyphen]) => {
                CssHelper.injectCss(identifier, properties);
            });
        }
    }

    /**
     * Inject the scrollbar classes into the HTML
     */
    private injectScrollbarTheme(): void {
        if (this.theme.scrollbarTheme) {
            Object.entries(this.theme.scrollbarTheme).forEach(([identifier, properties]: [string, PropertiesHyphen]) => {
                CssHelper.injectCss("#" + this.getEditorId() + "::" + identifier, properties);
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
        CssHelper.injectCss(this.getMenuIdentifier(), this.getMenuBaseCssProperties());
        CssHelper.injectCss(this.getEditorIdentifier(), this.getEditorBaseCssProperties());

        this.injectContainerTheme();
        this.injectAdditionalCssRules();
        this.injectScrollbarTheme();
    }

    /**
     * Inject the additional CSS classes into the HTML
     */
    private injectContainerTheme(): void {
        // TODO fix any
        let properties: any;
        if (this.theme.editorTheme) {
            properties = { ...this.getContainerBaseCssProperties(), ...this.theme.editorTheme };
        } else {
            properties = this.getContainerBaseCssProperties();
        }

        CssHelper.injectCss(this.getContainerIdentifier(), properties);
    }

    /**
     * Hardcoded CSS for the Container
     */
    private getContainerBaseCssProperties(): PropertiesHyphen {
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
    private getMenuBaseCssProperties(): PropertiesHyphen {
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
    private getEditorBaseCssProperties(): PropertiesHyphen {
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
}
