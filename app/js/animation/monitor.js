/**
 * @author indivisualvj / https://github.com/indivisualvj
 */

{
    /**
     *
     * @type {HC.Monitor}
     */
    HC.Monitor = class Monitor {

        init (hook) {
            for (var i in statics.DisplaySettings.initial) {

                if (i.match(/^display\d+_/)) {
                    // reset all mapping related values to initial
                    statics.DisplaySettings[i] = statics.DisplaySettings.initial[i];

                }
                if (i.match(/sample|sequence|display|border|shuffle|mapping|mask|zoom|fps/)) {
                    // DisplaySettings without initial value cannot be updated
                    delete statics.DisplaySettings.initial[i];
                }
            }

            statics.ControlSettings.play = false;
            statics.ControlSettings.monitor = false;
            statics.DisplaySettings.fps = 30;
            statics.DisplaySettings.display0_visible = true;

            if (hook) {
                hook();
            }
        }
    }
}
