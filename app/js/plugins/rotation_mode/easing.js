let TWEEN = TWEEN || {
    Easing: {}
};

TWEEN.Easing.Judder = {
    InOut(v) {
        return Math.floor(v * 10) / 10;
    }
};