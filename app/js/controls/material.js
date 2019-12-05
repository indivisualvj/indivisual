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
            material_blending: 'NormalBlending',
            material_blendequation: 'AddEquation',
            material_blendsrc: 'SrcAlphaFactor',
            material_blenddst: 'OneMinusSrcAlphaFactor',
            material_mapping: 'default',
            material_shininess: 2,
            material_roughness: 0.5,
            material_metalness: 0.5,
            material_side: 2,
            material_softshading: false,
            material_shadowside: 2,
            material_map: 'none',
            material_input: 'texture',
            material_style: 'fill',
            material_wraps: 'ClampToEdgeWrapping',
            material_wrapt: 'ClampToEdgeWrapping',
            material_repeatx: 1.0,
            material_repeaty: 1.0,
            material_offsetx: 0.0,
            material_offsety: 0.0,
            material_centerx: .5,
            material_centery: .5,
            material_rotation: 0.0,
            material_volume: 1
        };
    }
}