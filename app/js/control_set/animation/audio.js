/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
{

    HC.control_set.audio = class ControlSet extends HC.ControlSet {

        static index = 20;
        static _name = 'audio & timing';

        settings = {
            audio_thickness: 0,
            audio_usewaveform: false,
            rhythm: 'half'
        };
        
        types = {
            audio_thickness: [0, 0.99, 0.01],
        };

        styles = {
            audio_thickness: ['half', 'clear'],
            audio_usewaveform: ['half']
        };
    }
}
