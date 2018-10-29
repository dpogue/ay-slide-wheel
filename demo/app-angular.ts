import * as angular from 'angular';
import aySlideWheel from '../src/angular/ay-slide-wheel';

const modName = 'demoApp';

class DemoApp {
  slideWheelValue: number = 0;
}

const template = `
<h1>Ay Slide Wheel Demo</h1>
<ay-slide-wheel min="0"
                max="10"
                value="$ctrl.slideWheelValue"
                line-thickness="0.175"
                rounded-line="false"
                line-start-colour="rgba(70,141,172,1)"
                line-mid-colour="#A77484"
                line-end-colour="#1D165B">
</ay-slide-wheel>
<p>Current value is <span ng-bind="$ctrl.slideWheelValue"></span></p>`;

angular.module(modName, [aySlideWheel]).component(modName, {
  template: template,
  controller: DemoApp
});
