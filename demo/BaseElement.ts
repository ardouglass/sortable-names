/**
 * This helper class is mostly taken from https://hawkticehurst.com/2024/05/bring-your-own-base-class/
 */
class BaseElement extends HTMLElement {
  static styles?: string;
  shadow: ShadowRoot;
  render?(): string;

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this._render();
  }

  _render() {
    if (!this.render) {
      throw new Error(
        "Web components extending BaseElement must implement a `render` method."
      );
    }

    const markup = this.render();
    const styles = (this.constructor as typeof BaseElement).styles || "";
    const template = document.createElement("template");
    const useConstructableStyleSheets =
      this.shadow.adoptedStyleSheets !== undefined;

    if (styles.length > 0 && useConstructableStyleSheets) {
      const sheet = new CSSStyleSheet();
      sheet.replaceSync(styles);
      this.shadow.adoptedStyleSheets = [sheet];
    }

    template.innerHTML = `
      ${
        styles.length > 0 && !useConstructableStyleSheets ?
          `<style>${styles}</style>`
        : ""
      }
      ${markup}
    `;

    this.shadow.appendChild(template.content.cloneNode(true));
  }
}

export { BaseElement };
