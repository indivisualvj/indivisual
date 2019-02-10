/**
 *
 */
HC.Animation.prototype.initEvents = function () {
    document.onselectstart = function() {
        return false;
    };
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

        statics.DisplaySettings.resolution = w + 'x' + (w/resolution.aspect);
        renderer.fullReset(true);
        sourceman.resize(renderer.getResolution());
        displayman.resize(renderer.getResolution());
    };

    window.addEventListener('resize', onResize);
    onResize();
};