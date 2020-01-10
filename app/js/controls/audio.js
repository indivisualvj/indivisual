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
            audio_thickness: 0,
            audio_usewaveform: false,
            rhythm: 'half'
        };
        
        types = {
            audio_thickness: [0, 0.99, 0.01, 'half'],
            audio_usewaveform: ['half']
        };
    }
}