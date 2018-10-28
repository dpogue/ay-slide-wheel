# Slide Wheel Component

This is an AngularJS 1.x directive which renders a slide wheel in canvas.

## Installation

```bash
npm install ay-slide-wheel
```

## Usage

```javascript
// App.ts
import aySlideWheel from 'ay-slide-wheel/angular';
angular.module('myApp', [aySlideWheel]);
```

```html
<ay-slide-wheel
  min="0"
  max="10"
  value="0"
  line-thickness="0.175"
  rounded-line="false"
  line-start-colour="rgba(70,141,172,1)"
  line-mid-colour="#A77484"
  line-end-colour="#1D165B"
>
</ay-slide-wheel>
```

## Contributing

Contributions of bug reports, feature requests, and pull requests are greatly appreciated!

Please note that this project is released with a [Contributor Code of Conduct](https://github.com/AyogoHealth/ay-slide-wheel/blob/master/CODE_OF_CONDUCT.md). By participating in this project you agree to abide by its terms.

## Licence

Released under the MIT Licence.
Copyright © 2018 Ayogo Health Inc.
