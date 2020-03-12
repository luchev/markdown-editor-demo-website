"use strict";
class Editor {
    constructor(container, theme = new EditorTheme()) {
        this.container = container;
        this.theme = theme;
        container.contentEditable = "true";
        this.applyTheme();
    }
    applyTheme() {
        let cssString = "";
        Object.entries(this.theme.style).forEach(([key, value]) => {
            if (value != "") {
                console.log(key, value);
            }
            cssString += `${key}: ${value}; `;
        });
        this.container.style.cssText = cssString;
    }
}
class CSSManager {
    constructor() {
        this.styleElement = document.createElement('style');
        this.styleElement.type = "text/css";
        document.getElementsByTagName("head")[0].appendChild(this.styleElement);
    }
    addClass(className) {
        this.styleElement.innerHTML += ` .${className} { color: red; } `;
    }
}
class EditorTheme {
    constructor(name = "", style = {}) {
        this.name = name;
        this.style = style;
    }
}
class CSSClass {
    constructor(name, properties) {
        this.name = name;
        this.properties = properties;
    }
}
class MDTheme {
    constructor(name = "", classes) {
        this.name = name;
        this.classes = classes;
    }
}
// Add editor themes
let editorThemes = new Array();
editorThemes.push(new EditorTheme("dark", {
    background: "#202225",
    width: "826px",
    height: "300px",
    padding: "20px 30px 20px 30px",
    "border-radius": "5px",
    cursor: "default",
    overflow: "auto",
    "box-shadow": "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
    color: "#dcddde",
    outline: "none",
}));
editorThemes.push(new EditorTheme("light", {
    background: "white",
    width: "826px",
    height: "300px",
    padding: "20px 30px 20px 30px",
    "border-radius": "5px",
    cursor: "default",
    overflow: "auto",
    "box-shadow": "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
    color: "black",
    outline: "none",
}));
let s = document.getElementById('editor');
let p = new Editor(s, editorThemes[0]);
