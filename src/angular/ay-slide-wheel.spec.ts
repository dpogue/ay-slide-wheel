import * as angular from 'angular';
import 'angular-mocks';

import { mock, auto, IScope, IAugmentedJQuery,
         IRootScopeService, ICompileService} from 'angular';
import aySlideWheel from './ay-slide-wheel';
import { AySlideWheel } from './ay-slide-wheel';

describe('AySlideWheel', () => {
  beforeEach(mock.module(aySlideWheel));

  let $injector: auto.IInjectorService;
  let element: IAugmentedJQuery;
  let scope: IScope;
  let controller: AySlideWheel;
  let $scope: any;

  beforeEach(inject(function(_$injector_) {
    $injector = _$injector_;
  }));

  beforeEach(function() {
    let $rootScope = $injector.get<IRootScopeService>('$rootScope');
    $scope = <any>$rootScope.$new();

    let $compile = $injector.get<ICompileService>('$compile');
    let el = angular.element('<ay-slide-wheel></ay-slide-wheel>');
    element = $compile(el)($scope);

    angular.element(document.body).append(element);

    scope = element.isolateScope();
    controller = scope['$ctrl'];
    $scope.$apply();
  });

  describe('constructor', () => {
    it('should create the slide wheel controller', () => {
      expect(controller).toBeInstanceOf(AySlideWheel);
    });
  });
});
