
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
}
