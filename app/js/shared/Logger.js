import {Messaging} from "./Messaging";

class Logger
{
    static history = {};

    /**
     *
     * @param key
     * @param func
     */
    static function(key, func) {
        requestAnimationFrame(function () {
            let co = document.getElementById('log');
            if (co) {
                let a = Logger.getAnchor(key);
                a.onclick = function (e) {
                    let co;
                    if ((co = e.target.closest('.expandable'))) {
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
    }

    /**
     *
     * @param key
     * @param value
     * @param force
     * @param _console
     */
    static log(key, value, force, _console) {
        if (_console) {
            console.log(key, value);
        }

        // todo: create mechanism that tries to predict if there is a longer loading process in progress and shows loading screen
        requestAnimationFrame(function () {
            let co = document.getElementById('log');
            if (co) {

                if (value === false) {
                    value = value.toString();
                }

                if (IS_CONTROLLER || force) {
                    Messaging.emitLog(key, value);
                }

                let txt = '';
                let elem = false;
                if (value) {
                    txt = key + ': ' + value;

                } else {
                    txt = key;
                }

                if (key in Logger.history) {
                    elem = Logger.history[key];

                } else {
                    elem = document.createElement('div');
                    Logger.history[key] = elem;
                }

                elem.innerHTML = txt;
                co.appendChild(elem);

                co.scrollTop = co.scrollHeight;

            } else if (_console) {
                console.log(key, value);
            }
        });
    }

    /**
     *
     */
    static clear() {
        let co = document.getElementById('log');
        if (co) {
            co.innerHTML = '';
        }
    }

    /**
     *
     * @param value
     * @returns {string}
     */
    static getRed(value) {
        return '<span class="red">' + value + '</span>';
    }

    /**
     *
     * @param value
     * @returns {string}
     */
    static getOrange(value) {
        return '<span class="orange">' + value + '</span>';
    }

    /**
     *
     * @param value
     * @returns {string}
     */
    static getYellow(value) {
        return '<span class="yellow">' + value + '</span>';
    }

    /**
     *
     * @param value
     * @returns {HTMLAnchorElement}
     */
    static getAnchor(value) {
        let a = document.createElement('a');
        a.innerText = value;

        return a;
    }
}

export {Logger}
