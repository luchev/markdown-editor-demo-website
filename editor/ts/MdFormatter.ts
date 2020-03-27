import { Formatter } from "./Formatter";
import { DOMHelper } from "./DOMHelper";

/**
 * Markdown formatter which is based on the generic Formatter class
 * This formatter uses common Markdown syntax to
 */
export class MdFormatter extends Formatter {
  /**
   * An array of [<class-name>, <regex-expression>] tuples
   * <class-name> is the css class name added to the
   * element if it matches <regex-expression>
   */
  static startLineRegex: [string, RegExp][] = [];

  /**
   * Hook to the editor div
   */
  private editor: HTMLElement = document.createElement("invalid");

  /**
   * Flag indicating whether formatting should be applied when text is inputted
   */
  private dynamicRender = true;

  /**
   * Initialize the mutation observer, which monitors changes happening
   * inside the container
   * @param {HTMLElement} editor HTML editable div used as editor
   */
  init(editor: HTMLElement): void {
    this.editor = editor;
    this.initRegex();

    const observer = new MutationObserver((mutations) =>
      this.handleMutations(mutations)
    );
    const observerConfig = {
      childList: true,
      subtree: true, // observe also grandchildren
      characterData: true, // observe typing
      // attributes: true,
    };
    observer.observe(editor, observerConfig);
  }

  /**
   * Get list of property elements to put in the settings menu in the editor
   * @return {HTMLElement[]} List of settings as div elements
   */
  getSettings(): HTMLElement[] {
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

    const settingsElements = settingsHtml.map((setting) =>
      DOMHelper.htmlElementFromString(setting)
    );

    // TODO convert the following foreach to event delegation
    settingsElements.forEach((element) => {
      if (element.hasAttribute("data-setting")) {
        if (element.getAttribute("data-setting") === "dynamic-render") {
          element.addEventListener("click", (event: MouseEvent) =>
            this.toggleDynamicRender(event)
          );
        }
      }
    });

    return settingsElements;
  }

  /**
   * Method to handle the click event on the setting Toggle Dynamic Renderer
   * @param {MouseEvent} event Click event to toggle Dynamic Renderer
   */
  private toggleDynamicRender(event: MouseEvent): void {
    const settingsItem = event.currentTarget as Element;
    const svgs = settingsItem?.children[1].children;

    for (const svg of svgs) {
      if (svg.hasAttribute("display")) {
        svg.removeAttribute("display");
      } else {
        svg.setAttribute("display", "none");
      }
    }

    this.dynamicRender = !this.dynamicRender;
    if (this.dynamicRender) {
      this.enableRendering();
    } else {
      this.disableRendering();
    }
  }

  /**
   * Initialize regexes for matching markdown formatting strings
   * at the start of the line
   * e.g headers # and ###
   */
  private initRegex(): void {
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

  /**
   * Handle array of Mutations
   * @param {MutationRecord[]} mutations array of mutations
   */
  private handleMutations(mutations: MutationRecord[]): void {
    if (this.dynamicRender) {
      for (const mutation of mutations) {
        this.handleMutation(mutation);
      }
    }
  }

  /**
   * Handle a single mutation by calling the right method depending on the mutation type
   * @param {MutationRecord} mutation Mutation to parse
   */
  private handleMutation(mutation: MutationRecord): void {
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
  private handleChildListMutation(mutation: MutationRecord): void {
    if (mutation.addedNodes.length > 0) {
      const addedNode: Node = mutation.addedNodes[0];

      // Add first div if the editor is empty and this is the first addedd #text
      // The first text written will not be in a separate div, so create a div for it
      // and put the text inside
      if (
        addedNode.nodeName === "#text" &&
        addedNode.parentElement === this.editor
      ) {
        const newDiv = document.createElement("div");
        this.editor.insertBefore(newDiv, addedNode.nextSibling);
        newDiv.appendChild(addedNode);

        // Move cursor to end of line
        const range: Range = document.createRange();
        const sel: Selection | null = window.getSelection();
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
          const elementFromNode: HTMLElement = addedNode as HTMLElement;
          while (elementFromNode.hasAttributes()) {
            elementFromNode.removeAttribute(elementFromNode.attributes[0].name);
          }
        }
      }
    }

    // Check if the element is empty and clear its classes
    if (
      mutation.target.nodeType === Node.ELEMENT_NODE &&
      mutation.target !== this.editor
    ) {
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
   * @param {MutationRecord} mutation The mutation that happened
   */
  private handleCharacterDataMutation(mutation: MutationRecord): void {
    const div = mutation.target.parentElement;

    if (div) {
      div.className = "";
      this.applyFormatting(div);
    }
  }

  /**
   * Disable and Remove all formatting
   */
  private disableRendering(): void {
    for (const child of this.editor.children) {
      if (child instanceof HTMLElement) {
        const div = child as HTMLElement;
        this.clearFormatting(div);
      }
    }
  }

  /**
   * Enable and apply all formatting
   */
  private enableRendering(): void {
    for (const child of this.editor.children) {
      if (child instanceof HTMLElement) {
        const div = child as HTMLElement;
        this.applyFormatting(div);
      }
    }
  }

  /**
   * Add specific MD formatting to a single element(paragraph)
   * @param {HTMLElement} div the element to apply specific formatting
   */
  private applyFormatting(div: HTMLElement): void {
    for (const [className, regex] of MdFormatter.startLineRegex) {
      if (regex.test(div.innerText)) {
        div.className = className;
      }
    }
  }

  /**
   * Clear MD formatting from a single element(paragraph)
   * @param {HTMLElement} div the element to apply specific formatting
   */
  private clearFormatting(div: HTMLElement): void {
    div.className = "";
  }
}
