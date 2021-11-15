/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
{
    /**
     *
     * @type {HC.controls.shape}
     */
    HC.controls.shape = class ControlSet extends HC.ControlSet {

        static index = 100;

        hooks = {
            onSet: (key, value, context, that) => {
                if (context) {
                    let id = isObject(context) ? context.index : context;
                    switch (key) {
                        case 'shape_sizedivider':
                            messaging.program.listener.fireEventId(EVENT_LAYER_NEEDS_RESET, id, context, 1000/7.5);
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
            shape_modifier: 'off',
            shape_modifier_volume: 1,
            shape_transform: 'off',
            shape_transform_volume: 1,
            shape_pairing: 'off',
            shape_rhythm: 'nochange',
            shape_delay: 'off'
        };
        
        types = {
            shape_geometry: ['half'],
            shape_sizedivider: [1, 64, 1, 'half'],
            shape_limit: ['quarter'],
            shape_sync: ['quarter'],
            shape_moda: [0, 128, 1, 'half'],
            shape_modb: [0, 128, 1, 'half'],
            shape_modc: [0, 128, 1, 'half'],
            shape_transform: ['half'],
            shape_transform_volume: [-5, 5, 0.01, 'half'],
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
            // shape_vertices: ['half'],
            shape_modifier: ['half', 'clear'],
            shape_modifier_volume: ['half'],
            shape_transform: ['half', 'clear'],
            shape_transform_volume: ['half'],
            // shape_pairing: ['half'],
            shape_rhythm: ['half', 'clear'],
            shape_delay: ['half'],
        };
    }
}