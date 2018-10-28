import {SlideWheel} from '../slide-wheel';

export class AySlideWheel extends HTMLElement {
  constructor() {
    super();
    var shadowRoot = this.attachShadow({mode: 'open'});
    shadowRoot.innerHTML = '<canvas class="slide-wheel-canvas"></canvas>';
  }

  connectedCallback() {
    new SlideWheel(
      this,
      (val) => {
        this.dispatchEvent(new CustomEvent('onChange', {detail: val}));
      },
      parseInt(this.getAttribute('value'), 10),
      this.getAttribute('enabled') === 'false' ? false : true,
      parseInt(this.getAttribute('min'), 10),
      parseInt(this.getAttribute('max'), 10),
      this.getAttribute('rounded-line') === 'false' ? false : true,
      parseFloat(this.getAttribute('line-thickness')),
      this.getAttribute('line-start-colour'),
      this.getAttribute('line-mid-colour'),
      this.getAttribute('line-end-colour')
    );
  }
}

window.customElements.define('ay-slide-wheel', AySlideWheel);
