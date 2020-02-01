var HC = HC || {};

{
    /**
     *
     * @type {{new(): HC.Messageable, prototype: Messageable}}
     */
    HC.Messageable = class Messageable {

        /**
         * @type {string}
         */
        name;

        /**
         * @type {boolean}
         */
        ready = false;

        constructor(name) {
            this.name = name;
        }
    }
}
