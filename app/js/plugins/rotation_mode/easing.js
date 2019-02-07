var TWEEN = TWEEN || {
    Easing: {}
};

TWEEN.Easing.Judder = {
    InOut: function (v) {
        return Math.floor(v * 10) / 10;
    }
};