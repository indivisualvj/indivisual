/**
 * @author indivisualvj / https://github.com/indivisualvj
 */

class Shape extends ControlSet
{
    static index = 100;

    hooks = {
        onChange: (key, value, context, that) => {
            if (context !== undefined) {
                let id = isObject(context) ? context.index : context;
                switch (key) {
                    case 'shape_sizedivider':
                        this.config.getEventManager().fireEventId(EVENT_LAYER_RESET, id, context, SKIP_TEN_FRAMES);
                        break;
                    case 'shape_modifier':
                    case 'shape_modifier_volume':
                    case 'shape_geometry':
                    case 'shape_transform':
                    case 'shape_moda':
                    case 'shape_modb':
                    case 'shape_modc':
                    case 'shape_merge_tolerance':
                        this.config.getEventManager().fireEventId(EVENT_LAYER_RESET_SHAPES, id, context, SKIP_TEN_FRAMES);
                        break;
                }
            }
        }
    };

    settings = {
        shape_geometry: 'tile',
        shape_sizedivider: 14,
        shape_moda: 0,
        shape_modb: 0,
        shape_modc: 0,
        shape_limit: false,
        shape_sync: true,
        shape_vertices: '',
        shape_merge_tolerance: 0,
        shape_modifier: 'off',
        shape_modifier_volume: 1,
        shape_transform: 'off',
        shape_transform_volume: 1,
        shape_pairing: 'off',
        shape_rhythm: 'nochange',
        shape_delay: 'off'
    };

    types = {
        shape_sizedivider: [1, 64, 1],
        shape_moda: [0, 128, 1],
        shape_modb: [0, 128, 1],
        shape_modc: [0, 128, 1],
        shape_merge_tolerance: [0, 100, 0.1],
        shape_transform_volume: [-5, 5, 0.01],
        shape_modifier: ['half'],
        shape_modifier_volume: [-5, 5, 0.01, 'half'],
        shape_rhythm: ['half'],
        shape_delay: ['half'],
    };

    styles = {
        shape_geometry: ['half', 'clear'],
        shape_sizedivider: ['half'],
        shape_moda: ['half', 'clear'],
        shape_modb: ['half'],
        shape_modc: ['half', 'clear'],
        shape_limit: ['quarter'],
        shape_sync: ['quarter'],
        shape_vertices: ['half', 'clear'],
        shape_merge_tolerance: ['half'],
        shape_modifier: ['half', 'clear'],
        shape_modifier_volume: ['half'],
        shape_transform: ['half', 'clear'],
        shape_transform_volume: ['half'],
        // shape_pairing: ['half'],
        shape_rhythm: ['half', 'clear'],
        shape_delay: ['half'],
    };
}

export {Shape}