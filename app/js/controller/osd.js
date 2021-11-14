/**
 *
 * @param key
 * @param value
 * @param timeout
 * @param color
 */
HC.Controller.prototype.showOSD = function (key, value, timeout, color) {

    this._osdHistory = this._osdHistory || {};
    this._osdTimeout = this._osdTimeout || false;


    requestAnimationFrame(() => {
        let co = document.getElementById('osd');
        if (co) {

            if (this._osdTimeout) {
                clearTimeout(this._osdTimeout);
            }

            if (timeout) {
                this._osdTimeout = setTimeout(function () {
                    co.style.opacity = 0;
                }, timeout);
            }

            if (value !== undefined) {
                co.style.opacity = 1;

                if (value == false) {
                    value = value.toString();
                }

                let txt = '';
                let elem = false;
                if (value) {
                    txt = key + ': ' + value;

                } else {
                    txt = key;
                }

                if (key in this._osdHistory) {
                    elem = this._osdHistory[key];

                } else {
                    elem = document.createElement('DIV');
                    this._osdHistory[key] = elem;
                }

                elem.innerHTML = txt;
                elem.setAttribute('data-color', color ? color : '');

                co.appendChild(elem);

                co.scrollTop = co.scrollHeight;
            }
        }
    });
};
