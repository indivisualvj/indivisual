{
    var logHistory = {};

    /**
     *
     * @param key
     * @param func
     */
    HC.logFunction = function (key, func) {

        requestAnimationFrame(function () {
            var co = document.getElementById('log');
            if (co) {
                var a = HC.logGetAnchor(key);
                a.onclick = function (e) {
                    var co;
                    if (co = e.target.closest('.expandable')) {
                        e.preventDefault();
                        e.stopPropagation();
                        co.onclick(e, true);
                    }
                    func();
                };
                co.appendChild(a);
                co.scrollTop = co.scrollHeight;
            }
        });
    };

    /**
     *
     * @param key
     * @param value
     * @param force
     * @param _console
     */
    HC.log = function log (key, value, force, _console) {
        if (_console) {
            console.log(key, value);
        }

        requestAnimationFrame(function () {
            var co = document.getElementById('log');
            if (co) {

                if (statics
                    && statics.ControlSettings
                    && !statics.ControlSettings.console
                ) {
                    co.style.display = 'none';

                } else {
                    co.style.display = 'block';

                    if (value == false) {
                        value = value.toString();
                    }

                    if (IS_CONTROLLER || force) {
                        messaging.emitLog(key, value);
                    }

                    var txt = '';
                    var elem = false;
                    if (value) {
                        txt = key + ': ' + value;

                    } else {
                        txt = key;
                    }

                    if (key in logHistory) {
                        elem = logHistory[key];

                    } else {
                        elem = document.createElement('div');
                        logHistory[key] = elem;
                    }

                    elem.innerHTML = txt;
                    co.appendChild(elem);

                    co.scrollTop = co.scrollHeight;

                }
            }
        });
    };

    /**
     *
     */
    HC.clearLog = function () {
        var co = document.getElementById('log');
        if (co) {
            co.innerHTML = '';
        }
    };

    /**
     *
     * @param value
     * @returns {string}
     */
    HC.logGetRed = function (value) {
        return '<span class="red">' + value + '</span>';

    };

    /**
     *
     * @param value
     * @returns {string}
     */
    HC.logGetOrange = function (value) {
        return '<span class="orange">' + value + '</span>';

    }

    /**
     *
     * @param value
     * @returns {string}
     */
    HC.logGetYellow = function (value) {
        return '<span class="yellow">' + value + '</span>';
    };

    /**
     *
     * @param value
     * @returns {string}
     */
    HC.logGetAnchor = function (value) {
        var a = document.createElement('a');
        a.innerText = value;

        return a;
    };
}
