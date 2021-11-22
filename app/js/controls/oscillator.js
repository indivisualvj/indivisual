/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
{

    HC.controls.oscillator = class ControlSet extends HC.ControlSet {

        static index = 30;

        settings = {
            osci1_period: 2.0,
            osci1_amp: 0.6,
            osci2_period: 1.25,
            osci2_amp: 0.3,
            osci3_period: 0.66,
            osci3_amp: 0.1
        };

        types = {
            osci1_period: [0, 8, 0.001],
            osci1_amp: [0, 2, 0.001],
            osci2_period: [0, 8, 0.001],
            osci2_amp: [0, 2, 0.001],
            osci3_period: [0, 8, 0.001],
            osci3_amp: [0, 2, 0.001]
        };
    }
}