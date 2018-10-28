export function SlideWheel(element: HTMLElement, onChange, value: number, enabled=true, min=0, max=1000, roundedLine=true,
         lineThickness=0.155, lineStartColour='#45b999', lineMidColour='#9fc789',
         lineEndColour='#fcd679') {
    // The following code was originally based off of
    // code written Copyright 2013 by Anthony Terrien (MIT)
    // https://github.com/aterrien/jQuery-Knob

    let canvas: HTMLCanvasElement;
    if (element.shadowRoot) {
      canvas = element.shadowRoot.querySelector('canvas') as HTMLCanvasElement;
    } else {
      canvas = element.querySelector('canvas') as HTMLCanvasElement;
    }
    const kMin = 0;
    const kMax = 1000;

    // Value ranges from 0 to 1000
    value   = ((value - min) / (max - min)) * 1000 || 0;

    element.setAttribute('tabindex', '0');
    element.setAttribute('role', 'slider');
    element.setAttribute('aria-valuemin', min.toString());
    element.setAttribute('aria-valuemax', max.toString());
    element.setAttribute('aria-valuenow', value.toString());

    var stopper = roundedLine !== false;
    var lineCap = stopper ? 'round' : 'butt';
    var height = 600;
    var width = 600;

    var thickness = lineThickness;

    var fgColor    = lineStartColour;
    var fgColorMid = lineMidColour;
    var fgColorEnd = lineEndColour;
    var step     = 1;

    var context:any = canvas.getContext('2d');

    var xpos, ypos;

    var scale = 1;  //HDPI/retina scaling removed for now because canvas scale now matches assets and scaling is moved to CSS

    let knob = new Image();
    let knobLoaded = new Promise((res, rej) => {
      knob.src = 'assets/img/slide-wheel/knob.png';

      knob.onload = () => res();
      knob.onerror = (e) => rej(e);
    });

    var bgImg = new Image();
    let bgLoaded = new Promise((res, rej) => {
      bgImg.src = 'assets/img/slide-wheel/slide-rail.png';

      bgImg.onload = () => res();
      bgImg.onerror = (e) => rej(e);
    });

    // finalize canvas with computed width
    canvas.setAttribute('width', width.toString());
    canvas.setAttribute('height', height.toString());

    canvas.style.width = '100%';
    canvas.style.height = '100%';

    var basePadX = 0;
    var basePadY = 0;

    context.translate(basePadX*scale, basePadY*scale);

    let rect = element.getBoundingClientRect();
    height = rect.height;
    width = rect.width;

    width = width - basePadX;
    height = height - basePadY;

    var PI2 = 2*Math.PI;

    var xy = canvas.width / 2 * scale;
    var lineWidth = xy * thickness;

    var percentx = 1;
    var percenty = 1;
    var radius   = 0;

    var angleOffset = 0;
    var angleArc = 360;

    // deg to rad
    angleOffset = angleOffset * Math.PI / 180;
    angleArc    = angleArc    * Math.PI / 180;

    // compute start and end angles
    var startAngle = 1.5 * Math.PI + angleOffset;
    var endAngle   = 1.5 * Math.PI + angleOffset + angleArc;

    function change(v) {
      let oldval = value | 0;
      let newval = ((max - min) * (v / kMax) + min) | 0;
      value = v;

      if (oldval !== newval) {
        element.setAttribute('aria-valuenow', newval.toString());
        // $scope.$evalAsync(() => {
        //   $ctrl.value = newval;
        // });

        if (onChange) {
          onChange(newval);
        }
      }
    }

    if (value < kMin) {
      change(kMin);
    }

    if (value > kMax) {
      change(kMax);
    }

    function angle(v) {
      return (v - kMin) * angleArc / (kMax - kMin);
    }

    function arc(v) {
      var sa, ea;
      v = angle(v);

      sa = startAngle - 0.00001;
      ea = sa + v + 0.00001;

      return {
          s: sa,
          e: ea,
          d: false
      };
    }

    var drawing = false;
    function draw() {
      var c = context,                 // context
          a = arc(value);      // Arc


      function clearCanvas() {
        // Store the current transformation matrix
        c.save();

        // Use the identity matrix while clearing the canvas
        c.setTransform(1, 0, 0, 1, 0, 0);
        c.clearRect(0, 0, canvas.width, canvas.height);

        // Restore the transform
        c.restore();
      }

      //Draw the background
      function drawBG() {
        c.save();
        c.setTransform(1,0,0,1,0,0);
        c.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
        c.restore();
      }

      function drawArc() {
        c.lineWidth = lineWidth;
        c.lineCap = lineCap;

        //Proportional offset left for gradients to make room for stroke cap
        var offset = 0.08;

        var grad1 = c.createLinearGradient(0,0,0,canvas.height*scale);
        grad1.addColorStop(0, fgColorEnd);
        grad1.addColorStop(0.8, fgColorMid);

        var grad2 = c.createLinearGradient(0,0,0,canvas.height*scale);
        grad2.addColorStop(0, fgColor);
        grad2.addColorStop(0.8, fgColorMid);

        // First we make a clipping region for the left half
        c.save();
        c.beginPath();
        c.rect(0, 0, (1-offset)*canvas.width/2*scale, canvas.height*scale);
        c.clip();

        // Then we draw the left half
        c.strokeStyle = grad1;
        c.beginPath();
        c.arc(xy,xy,radius,a.s,a.e,a.d);
        c.stroke();

        c.restore(); // restore clipping region to default

        // Then we make a clipping region for the right half
        c.save();
        c.beginPath();
        c.rect((1-offset)*canvas.width/2*scale, 0, canvas.width*scale, canvas.height*scale);
        c.clip();

        // Then we draw the right half
        c.strokeStyle = grad2;

        c.beginPath();
        c.arc(xy,xy,radius,a.s,a.e,a.d);

        c.stroke();

        c.restore(); // restore clipping region to default
      }

      //draw the knob
      function drawKnob() {
        var dx = Math.sin(a.e - a.s) * radius - (knob.width/2)*percentx;
        var dy = - Math.cos(a.e - a.s) * radius - (knob.height/2)*percenty;
        c.drawImage(knob, xy+dx, xy+dy, knob.width*percentx, knob.height*percenty);
      }

      clearCanvas();
      drawBG();
      drawArc();
      if (enabled !== false) {
        drawKnob();
      }
    }

    function onTouch(evt) {
      if (enabled === false) {
        return;
      }

      var touchMove = function(evt) {
        var adjustment = width / canvas.offsetWidth;
        var v = xy2val(
                  evt.touches[0].pageX * adjustment,
                  evt.touches[0].pageY * adjustment
                );

        if (v === value) {
          return;
        }

        change(validate(v));
        draw();
      };

      // First touch
      touchMove(evt);

      // Touch events listeners
      document.addEventListener("touchmove", touchMove);
      document.addEventListener("touchend",
          function touchEnd() {
            document.removeEventListener('touchmove', touchMove);
            document.removeEventListener('touchend', touchEnd);
          }
        );
    }

    function onMouseDown(evt) {
      if (enabled === false) {
        return;
      }

      var mouseMove = function (evt) {
        var adjustment = width / canvas.offsetWidth;
        var v = xy2val(evt.pageX * adjustment, evt.pageY * adjustment);

        if (v === value) {
          return;
        }

        change(validate(v));
        draw();
      };

      // First click
      mouseMove(evt);

      // Mouse events listeners
      document.addEventListener("mousemove", mouseMove);
      document.addEventListener("mouseup",
          function mouseUp() {
            document.removeEventListener('mousemove', mouseMove);
            document.removeEventListener('mouseup', mouseUp);
          }
        );
    }

    //function _xy
    function updateCoords() {
      var box     = canvas.getBoundingClientRect();
      var docElem = document.documentElement;
      var offset  = {
        top: box.top + window.pageYOffset - docElem.clientTop,
        left: box.left + window.pageXOffset - docElem.clientLeft
      };

      xpos = offset.left;
      ypos = offset.top;

      width = box.width;
      height = box.height;
    }


    function listen() {
      canvas.addEventListener("mousedown",
        function (evt) {
          evt.preventDefault();
          updateCoords();
          onMouseDown(evt);
        }
      );
      canvas.addEventListener("touchstart",
        function (evt) {
          evt.preventDefault();
          updateCoords();
          onTouch(evt);
        }
      );

      element.addEventListener('keydown', function(evt) {
        let val = (value || 0) | 0;

        if (evt.keyCode === 38 || evt.keyCode === 39) {
          // 38 = UP;   39 = RIGHT
          val++;
          if (val > max) {
            val = max;
          }

          val = ((val - min) / (max - min)) * 1000 + 1;
          if (val > kMax) {
            val = kMax;
          }
          change(validate(val));
          draw();

          evt.preventDefault();
          evt.stopPropagation();
        } else if (evt.keyCode === 37 || evt.keyCode === 40) {
          // 37 = LEFT;  40 = DOWN
          val--;
          if (val < min) {
            val = min;
          }

          val = ((val - min) / (max - min)) * 1000 - 1;
          if (val < kMin) {
            val = kMin;
          }
          change(validate(val));
          draw();

          evt.preventDefault();
          evt.stopPropagation();
        }
      });
    }

    function validate(v) {
      var val = (((v < 0) ? -0.5 : 0.5) + (v/step));
      val = val < 0 ? Math.ceil(val) : Math.floor(val);
      val *= step;
      return Math.round(val * 100) / 100;
    }

    function xy2val(x, y) {
      var a, ret;

      a = Math.atan2(
        x - (xpos + width/2),
        - (y - ypos - width/2)
      ) - angleOffset;

      if (angleArc !== PI2 && (a < 0) && (a > -0.5)) {
        // if isset angleArc option, set to min if .5 under min
        a = 0;
      } else if (a < 0) {
        a += PI2;
      }

      ret = (a * (kMax - kMin) / angleArc) + kMin;

      if (stopper) {
        ret = Math.max(Math.min(ret, kMax), kMin);
      }

      // Make the knob not be able to cross the min/max boundary
      // has a side effect that you cant easily tap to change the value
      // when the dial is close to the max/min boundary
      if( (value > kMax*0.9 && ret <= kMax*0.1) || (value === kMax && ret <= kMax*0.8) ) {
        ret = kMax;
      } else if(value <= kMax*0.1 && ret > kMax*0.2) {
        ret = kMin;
      }

      return ret;
    }

    Promise.all([bgLoaded, knobLoaded]).then(function() {
      //figure out some values that are based on bgImg size
      percentx = canvas.width / bgImg.width;
      percenty = canvas.height / bgImg.height;

      radius    = xy - lineWidth / 2 - 57*percentx;

      listen();
      updateCoords();
      draw();
    });

}
