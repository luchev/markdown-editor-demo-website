"use strict";
class Editor {
    constructor(container, editorTheme = {}, mdTheme = {}) {
        this.container = container;
        this.editorTheme = editorTheme;
        this.mdTheme = mdTheme;
        this.initializeContainer();
        this.applyEditorTheme();
        this.applyMDTheme();
        this.createListeners();
    }
    createListeners() {
        let container = this.container;
        let observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                // Add first div if the editor is empty and this is the first addedd #text
                if (mutation.addedNodes.length > 0) {
                    let addedNode = mutation.addedNodes[0];
                    // The first text written will not be in a separate div, so create a div for it
                    // and put the text inside
                    if (addedNode.nodeName == "#text" && addedNode.parentElement == container) {
                        let newDiv = document.createElement("div");
                        container.insertBefore(newDiv, addedNode.nextSibling);
                        newDiv.appendChild(addedNode);
                        // Move cursor to end of line
                        let range = document.createRange();
                        let sel = window.getSelection();
                        range.setStart(container.childNodes[0], newDiv.innerHTML.length);
                        range.collapse(true);
                        if (sel) {
                            sel.removeAllRanges();
                            sel.addRange(range);
                        }
                    }
                    // If added node is a div, clear all classes
                    if (addedNode.nodeName == "DIV") {
                        if (addedNode.nodeType == Node.ELEMENT_NODE) {
                            let elementFromNode = addedNode;
                            while (elementFromNode.hasAttributes()) {
                                elementFromNode.removeAttribute(elementFromNode.attributes[0].name);
                            }
                        }
                    }
                }
                if (mutation.type == "childList") {
                    if (mutation.target.nodeType == Node.ELEMENT_NODE) {
                        let elementFromNode = mutation.target;
                        // Check if the element is empty and clear its classes
                        if (elementFromNode) {
                            let spacesRegex = RegExp("\\s*");
                            if (spacesRegex.test(elementFromNode.innerText)) {
                                elementFromNode.className = "";
                            }
                        }
                    }
                }
                // MD formatting
                if (mutation.type == "characterData") {
                    let parent = mutation.target.parentElement;
                    let header1Regex = RegExp("^#{1}\\s");
                    let header2Regex = RegExp("^#{2}\\s");
                    let header3Regex = RegExp("^#{3}\\s");
                    let header4Regex = RegExp("^#{4}\\s");
                    let header5Regex = RegExp("^#{5}\\s");
                    let header6Regex = RegExp("^#{6}\\s");
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
            });
        });
        let observerConfig = {
            childList: true,
            subtree: true,
            characterData: true,
        };
        observer.observe(this.container, observerConfig);
    }
    applyMDTheme() {
        Object.entries(this.mdTheme).forEach(([className, properties]) => {
            CSSHelper.injectClass(className, properties);
        });
    }
    initializeContainer() {
        // Make sure the container is a div
        let containerParent = this.container.parentElement;
        let editorDiv = document.createElement("div");
        let id = this.container.id;
        if (this.container.tagName.toLowerCase() == "div") {
            // Clear the div from attributes and content
            this.container.innerHTML = "";
            while (this.container.hasAttributes()) {
                let attribute = this.container.attributes[0].name;
                this.container.removeAttribute(attribute);
            }
        }
        else if (this.container.tagName.toLowerCase() != "div" && containerParent != null) {
            // Replace the given element with an empty div
            containerParent.replaceChild(editorDiv, this.container);
            this.container = editorDiv;
        }
        else {
            console.error("[md] The given element is not of type DIV and cannot be converted to DIV");
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
class CSSHelper {
    constructor() {
        CSSHelper.styleElement = document.createElement("style");
        CSSHelper.styleElement.type = "text/css";
        document.getElementsByTagName("head")[0].appendChild(CSSHelper.styleElement);
    }
    static injectClass(name, properties) {
        let cssTextPropertoes = CSSHelper.stringifyCSSProperties(properties);
        CSSHelper.styleElement.innerHTML += ` .${name} { ${cssTextPropertoes} } `;
    }
    static stringifyCSSProperties(property) {
        let cssString = "";
        Object.entries(property).forEach(([key, value]) => {
            if (value != "") {
                cssString += `${key}: ${value}; `;
            }
        });
        return cssString;
    }
}
CSSHelper.instance = new CSSHelper();
// Add editor themes
var darkEditorTheme = {
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
var s = document.getElementById("editor");
let p = new Editor(s, darkEditorTheme, darkMDTheme);
