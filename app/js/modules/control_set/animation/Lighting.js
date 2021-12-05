/**
 * @author indivisualvj / https://github.com/indivisualvj
 */

class Lighting extends ControlSet
{

    static index = 40;

    hooks = {
        onChange: (key, value, context, that) => {
            if (context !== undefined) {
                let id = isObject(context) ? context.index : context;
                switch (key) {
                    case 'lighting_type':
                    case 'lighting_color':
                        this.config.getEventManager().fireEventId(EVENT_LAYER_RESET_LIGHTING, id, context, SKIP_TEN_FRAMES);
                        break;
                    case 'lighting_ambient':
                        this.config.getEventManager().fireEventId(EVENT_LAYER_RESET_AMBIENT, id, context, SKIP_TEN_FRAMES);
                        break;
                    case 'lighting_fog':
                        this.config.getEventManager().fireEventId(EVENT_LAYER_RESET_FOG, id, context, SKIP_TEN_FRAMES);
                        break;

                }
            }
        }
    };

    settings = {
        lighting_type: 'off',
        lighting_color: '#ffffff',
        lighting_intensity: 1,
        lighting_intensity_oscillate: 'off',
        lighting_angle: 1.05,
        lighting_angle_oscillate: 'off',
        lighting_penumbra: 1,
        lighting_penumbra_oscillate: 'off',
        lighting_ambient: false,
        lighting_ambient_intensity: 1,
        lighting_fog: false,
        lighting_shadows: false,
        lighting_fog_near: 1500,
        lighting_fog_far: 2000
    };

    types = {
        lighting_fog_near: [0, 5000, 1],
        lighting_fog_far: [500, 10000, 1],
        lighting_intensity: [0, 10.0, 0.01],
        lighting_ambient_intensity: [0, 1.0, 0.001],
        lighting_penumbra: [0, 1, 0.001],
        lighting_angle: [0, 1.05, 0.001],
    };

    styles = {
        lighting_type: ['half', 'clear'],
        lighting_color: ['half'],
        lighting_intensity: ['half', 'clear'],
        lighting_intensity_oscillate: ['half'],
        lighting_angle: ['half', 'clear'],
        lighting_angle_oscillate: ['half'],
        lighting_penumbra: ['half', 'clear'],
        lighting_penumbra_oscillate: ['half'],
        lighting_ambient: ['half', 'clear'],
        lighting_ambient_intensity: ['half'],
        lighting_fog: ['half', 'clear'],
        lighting_shadows: ['half'],
        lighting_fog_near: ['half', 'clear'],
        lighting_fog_far: ['half'],
    };
}

export {Lighting};
