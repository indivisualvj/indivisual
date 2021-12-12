/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {Guify} from "./guify/Guify";

class StatusBar extends Guify {

    config = {
        bpm: {
            label: 'current bpm',
            dataClass: 'half',
            cssClasses: 'clear'
        },
        // beats: {
        //     label: 'beats counted',
        //     dataClass: 'third',
        //     cssClasses: 'noclear'
        // },
        // duration: {
        //     dataClass: 'quarter',
        //     cssClasses: 'noclear'
        // },
        pitch: {
            label: 'offset (ms)',
            dataClass: 'half',
            cssClasses: 'noclear'
        },
        fps: {
            label: 'fps',
            dataClass: 'half',
            cssClasses: 'clear'
        },
        rms: {
            label: 'rms',
            dataClass: 'half',
            cssClasses: 'noclear'
        },
        input_level: {
            label: 'input_level',
            dataClass: 'half',
            cssClasses: 'clear'
        },
        peak_bpm: {
            label: 'peak_bpm',
            dataClass: 'half',
            cssClasses: 'noclear'
        },
        selected_layer: {
            label: 'selected_layer',
            dataClass: 'half',
            cssClasses: 'clear'
        },
        rendered_layers: {
            label: 'rendered_layers',
            dataClass: 'half',
            cssClasses: 'noclear'
        },
        changed_layers: {
            label: 'changed_layers',
            dataClass: 'full',
            cssClasses: ''
        }
    }

    constructor(id, title, open, object) {
        super(id, title, open);

        let config = this.config;

        for (const k in config) {
            let sub = config[k];

            this.addController({
                type: 'display',
                label: sub.label,
                property: k,
                object: object,
                dataClass: sub.dataClass,
                cssClasses: sub.cssClasses
            });
        }

        this._finishFolder(this.gui.panel.panel);
    }


    /**
     *
     * @param id
     * @param title
     */
    init(id, title) {

        this.opts = {
            title: title,
            theme: 'dark', // dark, light, yorha, or theme object
            align: 'right', // left, right
            width: '100%',
            barMode: 'offset', // none, overlay, above, offset
            panelMode: 'inner',
            opacity: 1,
            pollRateMS: SKIP_TWO_FRAMES,
            root: document.getElementById(id),
        };

        this.gui = new guify(this.opts);
        this.gui.container.style.zIndex = 99;
        this.gui.container.style.position = 'relative';
        this.gui.panel.container.style.background = '#000';

        this.setOpen(true);

    }

    _finishFolder(container) {
        let clear = document.createElement('div');
        clear.classList.add('guify-component-container');
        clear.classList.add('clear');
        container.appendChild(clear);
    }
}

export {StatusBar}