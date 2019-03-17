/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
{
   HC.plugins.filter_mode.flicker = class Plugin extends HC.FilterModePlugin {

       injections = {
           opacity: 1
       };

       apply(shape) {
           let color = shape.color;
       }
   }
}