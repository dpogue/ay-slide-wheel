import * as angular from 'angular';
import { auto, IScope, IAugmentedJQuery, IAttributes} from 'angular';
import { SlideWheel } from '../slide-wheel';

const modName = 'aySlideWheel';

const template = '<canvas class="slide-wheel-canvas"></canvas>';

export class AySlideWheel {
  enabled = true;
  min : number;
  max : number;
  roundedLine : boolean;
  lineThickness : number;
  lineStartColour : string;
  lineMidColour : string;
  lineEndColour : string;
  value: number;
  onChange: ({ value: number }) => void;

  $onChanges(changesObj) {
    if (changesObj.enabled) {
      this.enabled = changesObj.enabled.currentValue.toString() === 'true';
    }
  }
}


angular.module(modName, [])
.directive(modName, ['$injector', function($injector: auto.IInjectorService) {
  return {
    restrict: 'E',
    template: template,
    controller: AySlideWheel,
    controllerAs: '$ctrl',
    bindToController: true,
    scope: {
      value: '=?',
      enabled: '@?',
      onChange: '&?',
      min: '<?',
      max: '<?',
      roundedLine: '<?',
      lineThickness: '<?',
      lineStartColour: '@?',
      lineMidColour: '@?',
      lineEndColour: '@?'
    },
    link: function($scope:IScope, $element:IAugmentedJQuery, $attrs:IAttributes, $ctrl:AySlideWheel) {
      new SlideWheel(
        $element[0],
        (val: number) => {
          $scope.$evalAsync(() => {
            $ctrl.value = val;
          });
          if ($ctrl.onChange) {
            $ctrl.onChange({ value: val });
          }
        },
        $ctrl.value,
        $ctrl.enabled,
        $ctrl.min,
        $ctrl.max,
        $ctrl.roundedLine,
        $ctrl.lineThickness,
        $ctrl.lineStartColour,
        $ctrl.lineMidColour,
        $ctrl.lineEndColour
      );
    }
  };
}]);

export default modName;
