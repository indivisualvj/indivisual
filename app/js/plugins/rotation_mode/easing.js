var TWEEN = TWEEN || { // no let for fallback assignments
    Easing: {}
};

TWEEN.Easing.Judder = {
    InOut(v) {
        return Math.floor(v * 10) / 10;
    }
};
