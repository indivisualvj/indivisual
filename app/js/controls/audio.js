/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
{
    /**
     *
     * @type {HC.controls.audio}
     */
    HC.controls.audio = class ControlSet extends HC.ControlSet {

        static index = 20;
        static _name = 'audio & timing';

        settings = {
            rhythm: 'half',
            audio_thickness: 0,
            audio_usewaveform: false
        };
        
        types = {
            audio_thickness: [0, 0.99, 0.01, 'half'],
            audio_usewaveform: ['half']
        };
    }
}