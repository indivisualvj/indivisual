/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
{
   HC.plugins.filter_mode.flicker = class Plugin extends HC.FilterModePlugin {

       injections = {
           current: {
               opacity: 1
           },
           next: {
               opacity: 0.
           },
           opacity: 0
       };

       apply(shape) {
           let speed = this.layer.getShapeSpeed(shape);
           let params = this.params(shape);

           if (!params.opacity) {
               params.opacity = shape.color.o;
           }

           if (!params.tween && (speed.prc === 0 || this.audioAnalyser.peak)) {
               let sc = this.layer.shapeCount();
               let part = sc / 10;

               if (randomBool(round(sc/(part * this.settings.filter_volume))) || params.next.opacity === 0) {
                   params.next.opacity = params.opacity * .33;
                   params.current.opacity = 1.5;
                   let tween = this.tweenShape(shape, params.current, params.next);
                   tween.easing(TWEEN.Easing.Circular.Out);
                   tween.onUpdate(function () {
                       shape.color.o = params.current.opacity;
                   });
                   tween.onComplete(function () {
                       params.tween = false;
                   });
                   this.tweenStart(tween);

                   params.tween = tween;
               }
           }
       }
   }
}