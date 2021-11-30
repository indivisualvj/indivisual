/**
 * @author indivisualvj / https://github.com/indivisualvj
 */

HC.Animation.prototype.initEvents = function () {

    HC.Hotkey.add('space', (e) => {
        this.updateControl('play', !this.config.ControlSettings.play, true, true, false);
    });

    document.onselectstart = function () {
        return false;
    };

    if (IS_ANIMATION) {
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

HC.Animation.prototype.initResize = function () {

    window.addEventListener('resize', () => {
        for (let i = 0; i < this.displayManager.config.DisplayValues.display.length; i++) {
            let display = this.displayManager.getDisplay(i);
            if (display) {
                if (!display.getMapping()) {
                    this.displayManager.centerDisplay(i, 1, true, false);
                }
            }
        }
    });
}