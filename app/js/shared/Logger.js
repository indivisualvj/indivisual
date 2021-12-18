import {Messaging} from "./Messaging";
import {TimeoutManager} from "../manager/TimeoutManager";

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
     * @param timeout
     */
    static loading(key, value, timeout) {
        let loading = document.getElementById('loading');
        if (loading) {
            loading.style.display = 'block';
            TimeoutManager.add('Logger.loading', timeout ?? 300000, () => {
                loading.style.display = 'none';
            });
            loading.innerText = (key ? ` ${key} ${value} ...` : 'initializing ...');
        } else {
            this.log(key, value);
        }

    }

    /**
     *
     * @param key
     * @param value
     * @param [forward]
     * @param [logToConsole]
     */
    static log(key, value, forward, logToConsole) {

        if (logToConsole || DEBUG) {
            console.log(key, value);
        }

        requestAnimationFrame(function () {
            let co = document.getElementById('log');
            if (co) {

                if (value === false) {
                    value = value.toString();
                }

                if (forward) {
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
