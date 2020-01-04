/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
{
    /**
     *
     * @type {HC.controls.filter}
     */
    HC.controls.filter = class ControlSet extends HC.ControlSet {

        static index = 130;

        settings = {
            filter_mode: 'off',
            filter_audio: false,
            filter_limit: false,
            filter_sync: false,
            filter_volume: 1.0,
            filter_volume_oscillate: 'off'
        };
        
        types = {
            filter_mode: ['half'],
            filter_audio: ['hex'],
            filter_limit: ['hex'],
            filter_sync: ['hex'],
            filter_volume: [-10, 10, 0.01, 'half'],
            filter_volume_oscillate: ['half']
        };
    }
}