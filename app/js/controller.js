/**
 * @author indivisualvj / https://github.com/indivisualvj
 */

import {Controller} from "./controller/EventController";
import {Messaging} from "./shared/Messaging";
import {Config} from "./shared/Config";
import {Logger} from "./shared/Logger";

/**
 *
 */
document.addEventListener('DOMContentLoaded', function () {

    const controller = new Controller(G_INSTANCE);
    const config = new Config(controller);

    Messaging.init(controller);
    Messaging.connect(function (reconnect, controller) {

        setTimeout(() => {
            document.querySelector('iframe.preview').setAttribute('src', 'preview.html#' + Messaging.sid);
        }, 1500);

        Logger.log(controller.name, 'connected', true, true);

        if (!reconnect) {
            config.loadConfig(function (config) {
                let sets = config.initControlSets();
                controller.init(config, sets);
                controller.onResize();
            });
        }
    });
});
