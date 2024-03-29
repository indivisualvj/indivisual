/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
import {ControlSet} from "../../../shared/ControlSet";

class Material extends ControlSet
{
    static index = 110;

    hooks = {
        onChange: (key, value, context, that) => {
            if (context !== undefined) {
                let id = isObject(context) ? context.index : context;
                switch (key) {
                    case 'mesh_material':
                    case 'material_mapping':
                        this.config.getEventManager().fireEventId(EVENT_LAYER_RESET_SHAPES, id, context);
                        break;

                    default:
                        this.config.getEventManager().fireEventId(EVENT_SHAPE_MATERIALS_UPDATE, id, context);
                        break;
                }
            }
        }
    };

    settings = {
        mesh_material: 'lambert',
        material_style: 'fill',
        material_blending: 'NormalBlending',
        material_blendequation: 'AddEquation',
        material_blendsrc: 'SrcAlphaFactor',
        material_blenddst: 'OneMinusSrcAlphaFactor',
        material_side: 0,
        material_volume: 1,
        material_shininess: 0,
        material_reflectivity: 0,
        material_roughness: 0,
        material_metalness: 0,
        material_disp_scale: 0,
        material_disp_bias: 0,
        material_softshading: false,
        material_shadowside: 1,
        material_input: 'texture',
        material_mapping: 'default',
        material_wraps: 'ClampToEdgeWrapping',
        material_wrapt: 'ClampToEdgeWrapping',
        material_repeatx: 1.0,
        material_repeaty: 1.0,
        material_offsetx: 0.0,
        material_offsety: 0.0,
        material_centerx: .5,
        material_centery: .5,
        material_rotation: 0.0
    };

    types = {
        material_blendequation: ['hidden'],
        material_blendsrc: ['hidden'],
        material_blenddst: ['hidden'],
        material_shininess: [0, 1, 0.001],
        material_roughness: [0, 1, 0.001],
        material_metalness: [0, 1, 0.001],
        material_reflectivity: [0, 1, 0.001],
        material_disp_scale: [-10, 10, 0.01],
        material_disp_bias: [-10, 10, 0.01],
        material_repeatx: [-16, 16, 0.01],
        material_repeaty: [-16, 16, 0.01],
        material_offsetx: [-5, 5, 0.01],
        material_offsety: [-5, 5, 0.01],
        material_centerx: [0, 1, 0.001],
        material_centery: [0, 1, 0.001],
        material_rotation: [-180, 180, 0.1],
        material_volume: [0.01, 10, 0.01]
    };

    styles = {
        mesh_material: ['half', 'clear'],
        material_style: ['half'],
        material_blending: ['half', 'clear'],
        // material_blendequation: ['half'],
        // material_blendsrc: ['half', 'clear'],
        // material_blenddst: ['half'],
        material_side: ['half'],
        material_volume: ['clear'],
        material_shininess: ['half', 'clear'],
        material_reflectivity: ['half'],
        material_roughness: ['half', 'clear'],
        material_metalness: ['half'],
        material_disp_scale: ['half', 'clear'],
        material_disp_bias: ['half'],
        material_softshading: ['half', 'clear'],
        material_shadowside: ['half'],
        material_input: ['half', 'clear'],
        material_mapping: ['half'],
        material_wraps: ['half', 'clear'],
        material_wrapt: ['half'],
        material_repeatx: ['half', 'clear'],
        material_repeaty: ['half'],
        material_offsetx: ['half', 'clear'],
        material_offsety: ['half'],
        material_centerx: ['half', 'clear'],
        material_centery: ['half'],
        // material_rotation: ['half']
    };
}

export {Material}