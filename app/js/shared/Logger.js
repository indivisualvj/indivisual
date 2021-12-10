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

    static contexts = {};

    static registerLoadingContext(context, maxItems) {
        if (!context in this.contexts) {
            this.contexts[context] = {counter: 0, maxItems: maxItems};
        }
    }

    static loading(context, key, value, maxItems) {
        if (!context in this.contexts && maxItems) {
            this.registerLoadingContext(context, maxItems);
        }
        let loading = document.getElementById('loading');
        if (loading) {
            loading.style.display = 'block';
            TimeoutManager.add('loading.' + context, 250, () => {
                loading.style.display = 'none';
            });
            loading.innerText = `loading ${context} (${value} ${key})`;
        } else {
            this.log(key, value);
        }

        this.incrementLoadingCounter(context);
    }

    static incrementLoadingCounter(context) {
        if (context in this.contexts) {
            this.contexts[context].counter++;
            if (this.contexts[context].counter >= this.contexts[context].maxItems) {
                this.removeLoadingContext(context);
            }
        }
    }

    static removeLoadingContext(context) {
        delete this.contexts[context];
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
