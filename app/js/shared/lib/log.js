{
    var logHistory = {};
    /**
     *
     * @param key
     * @param action
     */
    HC.logAction = function logAction(key, action) {

        requestAnimationFrame(function () {
            var co = document.getElementById('log');
            if (co) {
                var a = document.createElement('A');
                a.innerText = key;
                a.onclick = function () {
                    action();
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
                        elem = document.createElement('DIV');
                        logHistory[key] = elem;
                    }

                    elem.innerHTML = txt;
                    co.appendChild(elem);

                    co.scrollTop = co.scrollHeight;

                }
            }
        });
    };

    HC.clearLog = function () {
        var co = document.getElementById('log');
        if (co) {
            co.innerHTML = '';
        }
    };
}
