/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {BackgroundModePlugin} from "../BackgroundModePlugin";

class Static extends BackgroundModePlugin {
        static index = 10;
        static tutorial = {
            color: {
                text: 'set background_color to any hex code (#ffaabb) to change color'
            }
        };

        apply() {
            if (this.needsUpdate()) {
                this.current(this.id());
                this.layer.setBackground(new Color(this.settings.background_color));
            }
        }
    }

export {Static};
