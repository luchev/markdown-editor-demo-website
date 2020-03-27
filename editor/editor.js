class CssHelper {
    constructor() {
        CssHelper.styleElement = document.createElement("style");
        CssHelper.styleElement.type = "text/css";
        document
            .getElementsByTagName("head")[0]
            .appendChild(CssHelper.styleElement);
    }
    static injectCss(identifier, properties) {
        const cssTextPropertoes = CssHelper.stringifyCSSProperties(properties);
        CssHelper.styleElement.innerHTML += `${identifier} { ${cssTextPropertoes} } \n`;
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
CssHelper.instance = new CssHelper();
class DOMHelper {
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


class Editor {
    constructor(containerId, formatter, theme) {
        this.formatter = formatter;
        this.theme = theme;
        this.container = document.createElement("div");
        this.editor = document.createElement("div");
        this.menu = document.createElement("div");
        this.idPrefix = containerId;
        this.initializeContainer(this.idPrefix);
        this.applyTheme();
        this.formatter.init(this.editor);
    }
    injectAdditionalCssRules() {
        if (this.theme.additionalCssRules) {
            Object.entries(this.theme.additionalCssRules).forEach(([identifier, properties]) => {
                CssHelper.injectCss(identifier, properties);
            });
        }
    }
    injectScrollbarTheme() {
        if (this.theme.scrollbarTheme) {
            Object.entries(this.theme.scrollbarTheme).forEach(([identifier, properties]) => {
                CssHelper.injectCss("#" + this.getEditorId() + "::" + identifier, properties);
            });
        }
    }
    createContainerId() {
        this.container.id = this.idPrefix;
        this.container.id = this.getContainerId();
    }
    createContainer(futureContainerId) {
        const futureContainer = document.getElementById(futureContainerId);
        if (!futureContainer) {
            throw new Error("Cannot find element with id " + futureContainerId);
        }
        const futureContainerParent = futureContainer.parentElement;
        if (!futureContainerParent) {
            throw new Error("Cannot find parent of element with id " + futureContainerId);
        }
        this.createContainerId();
        futureContainerParent.replaceChild(this.container, futureContainer);
    }
    createMenu() {
        this.createMenuBase();
        this.createMenuSettingsItems();
    }
    createMenuBase() {
        this.container.appendChild(this.menu);
        this.menu.id = this.getMenuId();
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
    }
    createMenuSettingsItems() {
        const settingsContainer = document.createElement("div");
        this.menu.appendChild(settingsContainer);
        settingsContainer.style.display = "none";
        settingsContainer.style.flexDirection = "column";
        this.formatter
            .getSettings()
            .forEach((element) => settingsContainer.appendChild(element));
    }
    createEditor() {
        this.container.appendChild(this.editor);
        this.editor.id = this.getEditorId();
        this.editor.contentEditable = "true";
    }
    initializeContainer(futureContainerId) {
        this.createContainer(futureContainerId);
        this.createMenu();
        this.createEditor();
    }
    settingsClick(event, menu) {
        const target = event.currentTarget;
        if (target.parentElement) {
            const svgs = target.children;
            for (const svg of svgs) {
                if (svg.hasAttribute("display")) {
                    svg.removeAttribute("display");
                }
                else {
                    svg.setAttribute("display", "none");
                }
            }
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
    applyTheme() {
        this.injectContainerTheme();
        this.injectMenuCss();
        this.injectEditorCss();
        this.injectScrollbarTheme();
        this.injectAdditionalCssRules();
    }
    injectEditorCss() {
        CssHelper.injectCss(this.getEditorIdentifier(), this.getEditorBaseCssProperties());
    }
    injectMenuCss() {
        CssHelper.injectCss(this.getMenuIdentifier(), this.getMenuBaseCssProperties());
    }
    injectContainerTheme() {
        const containerCss = this.getContainerCssProperties();
        CssHelper.injectCss(this.getContainerIdentifier(), containerCss);
    }
    getContainerCssProperties() {
        if (this.theme.editorTheme) {
            return {
                ...this.getContainerBaseCssProperties(),
                ...this.theme.editorTheme,
            };
        }
        return this.getContainerBaseCssProperties();
    }
    getContainerBaseCssProperties() {
        return {
            cursor: "default",
            display: "flex",
            "flex-direction": "row",
            resize: "both",
            overflow: "auto",
        };
    }
    getMenuBaseCssProperties() {
        return {
            "border-right": "1px solid rgb(83, 79, 86)",
            margin: "20px 0px 20px 0px",
            padding: "15px 20px 15px 20px",
            display: "flex",
            "flex-direction": "column",
        };
    }
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
    getContainerIdentifier() {
        return "#" + this.getContainerId();
    }
    getMenuIdentifier() {
        return "#" + this.getMenuId();
    }
    getEditorIdentifier() {
        return "#" + this.getEditorId();
    }
    getContainerId() {
        return this.idPrefix + "-container";
    }
    getMenuId() {
        return this.idPrefix + "-menu";
    }
    getEditorId() {
        return this.idPrefix + "-editor";
    }
}
class Formatter {
}


class MdFormatter extends Formatter {
    constructor() {
        super(...arguments);
        this.editor = document.createElement("invalid");
        this.dynamicRender = true;
    }
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
        settingsElements.forEach((element) => {
            if (element.hasAttribute("data-setting")) {
                if (element.getAttribute("data-setting") === "dynamic-render") {
                    element.addEventListener("click", (event) => this.toggleDynamicRender(event));
                }
            }
        });
        return settingsElements;
    }
    toggleDynamicRender(event) {
        const settingsItem = event.currentTarget;
        const svgs = settingsItem?.children[1].children;
        for (const svg of svgs) {
            if (svg.hasAttribute("display")) {
                svg.removeAttribute("display");
            }
            else {
                svg.setAttribute("display", "none");
            }
        }
        this.dynamicRender = !this.dynamicRender;
        if (this.dynamicRender) {
            this.enableRendering();
        }
        else {
            this.disableRendering();
        }
    }
    initRegex() {
        if (MdFormatter.startLineRegex.length === 0) {
            MdFormatter.startLineRegex.push(["md-header-1", RegExp("^#{1}\\s")]);
            MdFormatter.startLineRegex.push(["md-header-2", RegExp("^#{2}\\s")]);
            MdFormatter.startLineRegex.push(["md-header-3", RegExp("^#{3}\\s")]);
            MdFormatter.startLineRegex.push(["md-header-4", RegExp("^#{4}\\s")]);
            MdFormatter.startLineRegex.push(["md-header-5", RegExp("^#{5}\\s")]);
            MdFormatter.startLineRegex.push(["md-header-6", RegExp("^#{6}\\s")]);
            MdFormatter.startLineRegex.push(["md-quote", RegExp("^>\\s")]);
        }
    }
    handleMutations(mutations) {
        if (this.dynamicRender) {
            for (const mutation of mutations) {
                this.handleMutation(mutation);
            }
        }
    }
    handleMutation(mutation) {
        if (mutation.type === "childList") {
            this.handleChildListMutation(mutation);
        }
        if (mutation.type === "characterData") {
            this.handleCharacterDataMutation(mutation);
        }
    }
    handleChildListMutation(mutation) {
        if (mutation.addedNodes.length > 0) {
            const addedNode = mutation.addedNodes[0];
            if (addedNode.nodeName === "#text" &&
                addedNode.parentElement === this.editor) {
                const newDiv = document.createElement("div");
                this.editor.insertBefore(newDiv, addedNode.nextSibling);
                newDiv.appendChild(addedNode);
                const range = document.createRange();
                const sel = window.getSelection();
                range.setStart(this.editor.childNodes[0], newDiv.innerText.length);
                range.collapse(true);
                if (sel) {
                    sel.removeAllRanges();
                    sel.addRange(range);
                }
            }
            if (addedNode.nodeName === "DIV" && mutation.target !== this.editor) {
                if (addedNode.nodeType === Node.ELEMENT_NODE) {
                    const elementFromNode = addedNode;
                    while (elementFromNode.hasAttributes()) {
                        elementFromNode.removeAttribute(elementFromNode.attributes[0].name);
                    }
                }
            }
        }
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
    handleCharacterDataMutation(mutation) {
        const div = mutation.target.parentElement;
        if (div) {
            div.className = "";
            this.applyFormatting(div);
        }
    }
    disableRendering() {
        for (const child of this.editor.children) {
            if (child instanceof HTMLElement) {
                const div = child;
                this.clearFormatting(div);
            }
        }
    }
    enableRendering() {
        for (const child of this.editor.children) {
            if (child instanceof HTMLElement) {
                const div = child;
                this.applyFormatting(div);
            }
        }
    }
    applyFormatting(div) {
        for (const [className, regex] of MdFormatter.startLineRegex) {
            if (regex.test(div.innerText)) {
                div.className = className;
            }
        }
    }
    clearFormatting(div) {
        div.className = "";
    }
}
MdFormatter.startLineRegex = [];


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
const customTheme = {
    scrollbarTheme: darkScrollbar,
    additionalCssRules: darkMDFormatterTheme,
    editorTheme: darkEditorTheme,
};
const editor = new Editor("editor", new MdFormatter(), customTheme);
