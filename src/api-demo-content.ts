import { LitElement, html, TemplateResult } from 'lit';
import { property } from 'lit/decorators/property.js';
import { ElementInfo } from './lib/types.js';
import { EMPTY_ELEMENT } from './lib/constants.js';
import './api-viewer-demo.js';

export class ApiDemoContent extends LitElement {
  @property({ attribute: false }) elements: ElementInfo[] = [];

  @property({ type: Number }) selected = 0;

  @property() exclude = '';

  @property({ type: Number }) vid?: number;

  protected createRenderRoot(): this {
    return this;
  }

  protected render(): TemplateResult {
    const { elements, selected, exclude, vid } = this;

    const { name, properties, slots, events, cssProperties } = {
      ...EMPTY_ELEMENT,
      ...(elements[selected] || {})
    };

    // TODO: analyzer should sort CSS custom properties
    const cssProps = (cssProperties || []).sort((a, b) =>
      a.name > b.name ? 1 : -1
    );

    return html`
      <header part="header">
        <div part="header-title">&lt;${name}&gt;</div>
        <nav>
          <label part="select-label">
            <select
              @change="${this._onSelect}"
              .value="${String(selected)}"
              ?hidden="${elements.length === 1}"
              part="select"
            >
              ${elements.map(
                (tag, idx) => html`<option value="${idx}">${tag.name}</option>`
              )}
            </select>
          </label>
        </nav>
      </header>
      <api-viewer-demo
        .name="${name}"
        .props="${properties}"
        .slots="${slots}"
        .events="${events}"
        .cssProps="${cssProps}"
        .exclude="${exclude}"
        .vid="${vid}"
      ></api-viewer-demo>
    `;
  }

  private _onSelect(e: CustomEvent): void {
    this.selected = Number((e.target as HTMLSelectElement).value);
  }
}

customElements.define('api-demo-content', ApiDemoContent);

declare global {
  interface HTMLElementTagNameMap {
    'api-demo-content': ApiDemoContent;
  }
}
