osdHistory = {};
osdTimeout = false;

/**
 *
 * @param key
 * @param value
 * @param timeout
 */
function _osd(key, value, timeout, color) {
    requestAnimationFrame(function () {
        var co = document.getElementById('osd');
        if (co) {

            if (osdTimeout) {
                clearTimeout(osdTimeout);
            }

            if (timeout) {
                osdTimeout = setTimeout(function () {
                    co.style.opacity = 0;
                }, timeout);
            }

            if (value !== undefined) {
                co.style.opacity = 1;

                if (value == false) {
                    value = value.toString();
                }

                var txt = '';
                var elem = false;
                if (value) {
                    txt = key + ': ' + value;

                } else {
                    txt = key;
                }

                if (key in osdHistory) {
                    elem = osdHistory[key];

                } else {
                    elem = document.createElement('DIV');
                    osdHistory[key] = elem;
                }

                elem.innerHTML = txt;
                elem.setAttribute('data-color', color ? color : '');

                co.appendChild(elem);

                co.scrollTop = co.scrollHeight;
            }
        }
    });
}