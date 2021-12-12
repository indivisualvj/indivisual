/**
 * @author indivisualvj / https://github.com/indivisualvj
 */

import {Animation} from "./animation/Animation";
import {Config} from "./shared/Config";
import {Messaging} from "./shared/Messaging";
import {Logger} from "./shared/Logger";

/**
 *
 */
document.addEventListener('DOMContentLoaded', function () {

    const animation = new Animation(G_INSTANCE);
    const config = new Config(animation);

    Messaging.init(animation);
    Messaging.connect(function (reconnect, animation) {
        Logger.log(animation.name, 'connected', true, true);

        if (!reconnect) {
            config.loadConfig((config) => {
                config.initControlSets();
                animation.init(config);
                animation.loadSession();
            });
        }
    });
});
