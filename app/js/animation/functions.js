/**
 *
 */
HC.Animation.prototype.initEvents = function () {
    document.onselectstart = function () {
        return false;
    };

    if (IS_ANIMATION) {
        var to;
        document.addEventListener('mousemove', function () {
            document.body.style.cursor = 'default';
            clearTimeout(to);
            to = setTimeout(function () {
                document.body.style.cursor = 'none';
            }, 2000);
        });
    }
};

/**
 *
 */
HC.Animation.prototype.initKeyboard = function () {
    window.addEventListener('keydown', function (e) {

        if (e.ctrlKey || e.altKey || e.shiftKey) {
            return;
        }
        if (e.keyCode == 32) { // SPACE = play/pause
            animation.updateControl('play', !statics.ControlSettings.play, true, false, false);
        }
    });
};

/**
 *
 */
HC.Animation.prototype.prepareMonitor = function () {
    for (var i in statics.ControlSettings.initial) {
        if (i.match(/sample|sequence|display|border|shuffle|mapping|zoom|fps/)) {
            delete statics.ControlSettings.initial[i];
        }
    }

    statics.ControlSettings.play = false;
    statics.ControlSettings.monitor = false;
    statics.ControlSettings.mapping = false;
    statics.ControlSettings.shuffle = false;
    statics.DisplaySettings.fps = 30;
    statics.DisplaySettings.display0_visible = true;
    displayman.updateDisplay(0);

    var onResize = function () {
        var w = window.innerWidth;
        var resolution = renderer.getResolution();

        statics.DisplaySettings.resolution = w + 'x' + (w / resolution.aspect);
        renderer.fullReset(true);
        sourceman.resize(renderer.getResolution());
        displayman.resize(renderer.getResolution());
    };

    window.addEventListener('resize', onResize);
    onResize(true);
};

/**
 *
 */
HC.Animation.prototype.prepareAnimation = function () {
    var onResize = function () {
        for (var i = 0; i < statics.DisplayValues.display.length; i++) {
            var display = displayman.getDisplay(i);
            if (display) {
                if (!display.getMapping()) {
                    displayman.centerDisplay(i, 1, true, false);
                }
            }
        }
    };

    window.addEventListener('resize', onResize);
};