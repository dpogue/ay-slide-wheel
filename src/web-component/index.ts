import {SlideWheel} from '../common/slide-wheel';

export class AySlideWheel extends HTMLElement {
  constructor() {
    super();
    var shadowRoot = this.attachShadow({mode: 'open'});
    shadowRoot.innerHTML = '<canvas class="slide-wheel-canvas"></canvas>';
  }

  connectedCallback() {
    new SlideWheel(
      this,
      function(val) {
        console.log("new Value:", val);
      },
      parseInt(this.getAttribute('value'), 10),
      this.getAttribute('enabled') === 'false' ? false : true,
      parseInt(this.getAttribute('min'), 10),
      parseInt(this.getAttribute('max'), 10),
      this.getAttribute('rounded-line') === 'false' ? false : true,
      parseInt(this.getAttribute('line-thickness'), 10),
      this.getAttribute('line-start-colour'),
      this.getAttribute('line-mid-colour'),
      this.getAttribute('line-end-colour')
    );
  }
}

window.customElements.define('ay-slide-wheel', AySlideWheel);
