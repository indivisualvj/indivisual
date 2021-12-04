/**
 * @author indivisualvj / https://github.com/indivisualvj
 */

import {Animation} from "./animation/Animation";
import {Config} from "./shared/Config";
import {Messaging} from "./shared/Messaging";
import {Logger} from "./shared/Logger";

// workaround:
_importThreeLoader('FontLoader');
_importThreePostprocessing('EffectComposer');

/**
 *
 */
document.addEventListener('DOMContentLoaded', function () {

    const animation = new Animation(G_INSTANCE);
    let config = new Config();

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
