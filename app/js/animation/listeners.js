/**
 * @author indivisualvj / https://github.com/indivisualvj
 */

{
    HC.Animation.EventListener = class EventListener {
        init () {

            document.onselectstart = function () {
                return false;
            };

            if (IS_ANIMATION) { // no mousemove cursor thingy for _SETUP and _MONITOR
                let to;
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
                if (e.key === 'Space') { // SPACE = play/pause
                    animation.updateControl('play', !animation.config.ControlSettings.play, true, false, false);
                }
            });

        }
    }
}

{
    HC.Animation.ResizeListener = class ResizeListener {

        /**
         *
         * @param {HC.DisplayManager} displayManager
         */
        init (displayManager) {
            let onResize = function () {
                for (let i = 0; i < displayManager.config.DisplayValues.display.length; i++) {
                    let display = displayManager.getDisplay(i);
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
