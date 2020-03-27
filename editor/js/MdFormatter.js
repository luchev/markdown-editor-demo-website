import { Formatter } from "./Formatter";
import { DOMHelper } from "./DOMHelper";
export class MdFormatter extends Formatter {
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
