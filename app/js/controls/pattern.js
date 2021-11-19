/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
{

    HC.controls.pattern = class ControlSet extends HC.ControlSet {

        static index = 90;

        hooks = {
            onChange: (key, value, context, that) => {
                if (context !== undefined) {
                    let id = isObject(context) ? context.index : context;
                    switch (key) {
                        case 'pattern_shapes':
                            HC.EventManager.getInstance().fireEventId(EVENT_LAYER_RESET, id, context, SKIP_TEN_FRAMES);
                            break;
                        case 'pattern':
                        case 'pattern_mover':
                            HC.EventManager.getInstance().fireEventId(EVENT_LAYER_RESET_SHAPES, id, context, SKIP_TEN_FRAMES);
                            break;
                    }
                }
            }
        };

        settings = {
            pattern: 'matrix',
            pattern_shapes: 112,
            pattern_padding: 1.0,
            pattern_padding_oscillate: 'off',
            pattern_centerx: 0,
            pattern_paddingx: 1.0,
            pattern_centery: 0,
            pattern_paddingy: 1.0,
            pattern_centerz: 0,
            pattern_paddingz: 1.0,
            pattern_limit: false,
            pattern_audio: false,
            pattern_sync: true,
            pattern_mover: 'off',
            pattern_overlay: 'off',
            pattern_overlay_volume: 0.0,
            pattern_overlay_volume_oscillate: 'off'
        };
        
        types = {
            pattern_padding: [-10, 10, 0.01],
            pattern_paddingx: [-10, 10, 0.01],
            pattern_paddingy: [-10, 10, 0.01],
            pattern_paddingz: [-10, 10, 0.01],
            pattern_shapes: [1, 512, 1],
            pattern_centerx: [-5, 5, 0.01],
            pattern_centery: [-5, 5, 0.01],
            pattern_centerz: [-5, 5, 0.01],
            pattern_overlay_volume: [0, 1.0, 0.01]
        };

        styles = {
            pattern: ['half', 'clear'],
            pattern_shapes: ['half'],
            pattern_padding: ['half', 'clear'],
            pattern_padding_oscillate: ['half'],
            pattern_centerx: ['half', 'clear'],
            pattern_paddingx: ['half'],
            pattern_centery: ['half', 'clear'],
            pattern_paddingy: ['half'],
            pattern_centerz: ['half', 'clear'],
            pattern_paddingz: ['half'],
            pattern_limit: ['third', 'clear'],
            pattern_audio: ['third'],
            pattern_sync: ['third'],
            pattern_mover: ['half', 'clear'],
            pattern_overlay: ['half'],
            pattern_overlay_volume: ['half', 'clear'],
            pattern_overlay_volume_oscillate: ['half']
        };
    }
}