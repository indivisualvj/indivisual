/**
 * @author indivisualvj / https://github.com/indivisualvj
 */

{
    /**
     *
     * @type {HC.Animation.EventListener}
     */
    HC.Animation.EventListener = class EventListener {
        init () {

            document.onselectstart = function () {
                return false;
            };

            if (IS_ANIMATION) { // no mousemove cursor thingy for _SETUP and _MONITOR
                var to;
                document.addEventListener('mousemove', function () {
                    document.body.style.cursor = 'default';
                    clearTimeout(to);
                    to = setTimeout(function () {
                        document.body.style.cursor = 'none';
                    }, 2000);
                });
            }
        }
    }
}

{
    /**
     *
     * @type {HC.Animation.KeyboardListener}
     */
    HC.Animation.KeyboardListener = class KeyboardListener {

        /**
         *
         * @param {HC.Animation} animation
         */
        init (animation) {

            window.addEventListener('keydown', function (e) {

                if (e.ctrlKey || e.altKey || e.shiftKey) {
                    return;
                }
                if (e.keyCode === 32) { // SPACE = play/pause
                    animation.updateControl('play', !statics.ControlSettings.play, true, false, false);
                }
            });

        }
    }
}

{
    /**
     *
     * @type {HC.Animation.ResizeListener}
     */
    HC.Animation.ResizeListener = class ResizeListener {

        /**
         *
         * @param {HC.DisplayManager} displayManager
         */
        init (displayManager) {
            var onResize = function () {
                for (var i = 0; i < statics.DisplayValues.display.length; i++) {
                    var display = displayManager.getDisplay(i);
                    if (display) {
                        if (!display.getMapping()) {
                            displayManager.centerDisplay(i, 1, true, false);
                        }
                    }
                }
            };

            window.addEventListener('resize', onResize);
        }
    }
}
