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

                let inFullscreen = false;
                document.addEventListener('dblclick', () => {
                    if (inFullscreen) {
                        document.exitFullscreen();
                        return;
                    }

                    document.body.requestFullscreen().then(() => {
                        console.log('now in fullscreen');

                    }, (e) => {
                        console.error('fullscreen failed', e);

                    });
                });
                let wakeLock;

                document.addEventListener('fullscreenchange', (e) => {
                    if (!inFullscreen) {
                        inFullscreen = true;
                        navigator.wakeLock.request().then((e) => {
                            wakeLock = e;
                            console.log('wakelock active', e);
                        }, (e) => {
                            console.error('wakelock failed', e);
                        });
                    } else if (inFullscreen) {
                        console.log('exit fullscreen');
                        inFullscreen = false;
                        if (wakeLock) {
                            wakeLock.release().then(() => {
                                console.log('wakelock released');
                            });
                        }
                    }
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
            HC.Hotkey.add('space', (e) => {
                animation.updateControl('play', !animation.config.ControlSettings.play, true, true, false);
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
