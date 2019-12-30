/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
{
    /**
     *
     * @type {HC.controls.audio}
     */
    HC.controls.info = class ControlSet extends HC.ControlSet {

        static index = 0;
        static _name = 'info';

        settings = {
            name: 0,
            version: 1.0
        };

        types = {
            name: ['half'],
            version: ['half']
        };
    }
}