import {
  type CssCustomProperty,
  unquote
} from '@api-viewer/common/lib/index.js';
import {
  AbstractController,
  type AbstractControllerHost
} from './abstract-controller.js';
import type { CssCustomPropertyValue } from '../types.js';

export class StylesController extends AbstractController<CssCustomPropertyValue> {
  constructor(
    host: AbstractControllerHost,
    component: HTMLElement,
    cssProps: CssCustomProperty[]
  ) {
    super(host, component);

    if (cssProps.length) {
      const style = getComputedStyle(component);

      this.data = cssProps.map((cssProp) => {
        let value = cssProp.default
          ? unquote(cssProp.default)
          : style.getPropertyValue(cssProp.name);

        const result: CssCustomPropertyValue = cssProp;
        if (value) {
          value = value.trim();
          result.default = value;
          result.value = value;
        }

        return result;
      });
    }
  }

  setValue(name: string, value: string): void {
    this.data = this.data.map((prop) =>
      prop.name === name ? { ...prop, value } : prop
    );
  }

  updateData(data: CssCustomPropertyValue[]): void {
    super.updateData(data);

    if (data.length) {
      data.forEach((prop) => {
        const { name, value } = prop;
        if (value) {
          if (value === prop.default) {
            this.el.style.removeProperty(name);
          } else {
            this.el.style.setProperty(name, value);
          }
        }
      });
    }
  }
}
