/**
 * @author indivisualvj / https://github.com/indivisualvj
 */

import {Animation} from "./animation/Animation";
import {Config} from "./lib/Config";
import {Messaging} from "./lib/Messaging";

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
        HC.log(animation.name, 'connected', true, true);

        if (!reconnect) {
            config.loadConfig((config) => {
                config.initControlSets();
                animation.init(config);
                animation.loadSession();
            });
        }
    });
});
