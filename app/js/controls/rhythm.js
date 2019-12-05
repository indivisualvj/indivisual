/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
{
    /**
     *
     * @type {HC.controls.rhythm}
     */
    HC.controls.rhythm = class ControlSet extends HC.ControlSet {
        settings = {
            rhythm: 'half',
            shape_delay: 'off',
            shape_rhythm: 'nochange',
            osci1_period: 2.0,
            osci1_amp: 0.6,
            osci2_period: 1.25,
            osci2_amp: 0.3,
            osci3_period: 0.66,
            osci3_amp: 0.1
        };
    }
}