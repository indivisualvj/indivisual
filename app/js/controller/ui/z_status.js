/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
{
    HC.GuifyStatus = class GuifyStatus extends HC.Guify {
        object;

        constructor(id, title, open, object) {
            super(id, title, open);

            for (const objectKey in object) {
                let sub = object[objectKey];

                this.addController({
                    type: 'display',
                    label: sub.label,
                    property: sub.label,
                    object: sub,
                    dataClass: sub.dataClass,
                    cssClasses: sub.cssClasses
                });
            }
        }
    }
}
