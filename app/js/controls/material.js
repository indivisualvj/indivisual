/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
{
    /**
     *
     * @type {HC.controls.material}
     */
    HC.controls.material = class ControlSet extends HC.ControlSet {

        static index = 110;

        settings = {
            mesh_material: 'lambert',
            material_style: 'fill',
            material_blending: 'NormalBlending',
            material_blendequation: 'AddEquation',
            material_blendsrc: 'SrcAlphaFactor',
            material_blenddst: 'OneMinusSrcAlphaFactor',
            material_side: 2,
            material_shininess: 2,
            material_volume: 1,
            material_roughness: 0.5,
            material_metalness: 0.5,
            material_softshading: false,
            material_shadowside: 2,
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
            mesh_material: ['half'],
            material_blending: ['half'],
            material_blendequation: ['hidden'],
            material_blendsrc: ['hidden'],
            material_blenddst: ['hidden'],
            material_softshading: ['half'],
            material_shadowside: ['half'],
            material_shininess: [0, 100, 0.1, 'half'],
            material_roughness: [0, 1, 0.01, 'half'],
            material_metalness: [0, 1, 0.01, 'half'],
            material_side: ['half'],
            material_mapping: ['half'],
            material_input: ['half'],
            material_style: ['half'],
            material_wraps: ['half'],
            material_wrapt: ['half'],
            material_repeatx: [-32, 32, 0.001, 'half'],
            material_repeaty: [-32, 32, 0.001, 'half'],
            material_offsetx: [-5, 5, 0.001, 'half'],
            material_offsety: [-5, 5, 0.001, 'half'],
            material_centerx: [0, 1, 0.001, 'half'],
            material_centery: [0, 1, 0.001, 'half'],
            material_rotation: [-180, 180, 0.01, 'half'],
            material_volume: [0, 10, 0.01, 'half']
        };
    }
}