/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
{
    HC.GuifyController = class GuifyController extends HC.GuifyItem {
        /**
         *
         * @param parent
         * @param opts
         * @returns {*}
         */
        constructor(parent, opts) {
            super(parent.gui);
            this.parent = parent;
            opts.folder = parent.getComponent();
            this.component = this.gui.Register(opts);

            this.getContainer().setAttribute('data-id', this.getProperty());
            if (opts.dataClass) {
                this.getContainer().setAttribute('data-class', opts.dataClass);
            }
            if (opts.cssClasses) {
                this.getContainer().classList.add(opts.cssClasses);
            }

            this.initEvents();
        }

        /**
         *
         */
        initEvents() {
            if (this.getComponent().opts.type == 'range') {
                this._initRangeEvents();

            }

            this._initInputEvents();
        }

        /**
         *
         * @private
         */
        _initInputEvents() {

            let valueComponent = this.getComponent().valueComponent || this.getComponent().input;
            if (!valueComponent) {
                return;
            }

            valueComponent.addEventListener('keydown', function (e) {
                if (e.ctrlKey && (e.shiftKey || e.altKey)) {
                    return;
                }

                e.stopPropagation();

                if (valueComponent.nodeName === 'INPUT') { // todo checkout and make nicer
                    if (e.keyCode == 27) { // ESCAPE
                        this.focus();
                        valueComponent.blur();
                        this.focus();
                        valueComponent.blur();
                        e.preventDefault();
                        e.stopPropagation();

                    } else if (e.keyCode == 9) { // TAB
                        e.preventDefault();
                        e.stopPropagation();

                    }

                } else if (valueComponent.nodeName === 'SELECT') {
                    if (e.keyCode == 8 || e.keyCode == 27) { // BACKSPACE | ESCAPE
                        this.focus();
                        valueComponent.blur();
                        this.focus();
                        valueComponent.blur();
                        e.preventDefault();
                        e.stopPropagation();

                    }
                }
            });
        }

        /**
         *
         * @private
         */
        _initRangeEvents() {
            let active = false;
            let valueCompondent = this.component.valueComponent;

            valueCompondent.addEventListener('keyup', (e) => {
                e.preventDefault();
                e.stopPropagation();

                if (e.keyCode == 38) { // UP
                    this.incrementValue();

                } else if (e.keyCode == 40) { // DOWN
                    this.decrementValue();
                }
            });

            valueCompondent.addEventListener('mousedown', function (e) {
                active = true;
            });

            window.addEventListener('mousemove', (e) => {
                if (active) {
                    let dy = e.movementY;
                    if (dy < 0) { // todo make it depend on screen resolution
                        this.incrementValue();

                    } else if (dy > 0) {
                        this.decrementValue();
                    }
                }
            });

            window.addEventListener('mouseup', function (e) {
                active = false;
            });
        }

        /**
         *
         * @return {string}
         */
        getProperty() {
            return this.getComponent().opts.property || this.getLabel();
        }

        /**
         *
         * @return {*}
         */
        getValue() {
            if (this.getComponent().opts.object && this.getProperty() in this.getComponent().opts.object) {
                return this.getComponent().opts.object[this.getProperty()];
            }

            return undefined;
        }

        /**
         *
         * @param v
         * @return {*}
         */
        setValue(v) {
            if (this.getComponent().opts.object && this.getProperty() in this.getComponent().opts.object) {
                this.getComponent().opts.object[this.getProperty()] = v;
            }
        }

        /**
         *
         * @return {number}
         */
        getStep() {
            return this.getComponent().opts.step;
        }

        /**
         *
         */
        toggleValue() {
            let v = this.getValue();
            this.setValue(!v);
            this.getComponent().emit('input', this.getValue());
        }

        /**
         *
         */
        incrementValue() {
            let v = this.getValue();
            let s = this.getStep();
            this.setValue(v + s);
            this.getComponent().emit('input', this.getValue());
        }

        /**
         *
         */
        decrementValue() {
            let v = this.getValue();
            let s = this.getStep();
            this.setValue(v - s);
            this.getComponent().emit('input', this.getValue());
        }

        /**
         *
         * @return {*|Array|*[]}
         */
        getInitialValue() {
            if ('initial' in this.getComponent().opts) {
                let initial = this.getComponent().opts.initial;
                return initial;
            }

            return undefined;
        }

        /**
         *
         * @return {boolean}
         */
        isModified() {
            let value = this.getValue();
            let initial = this.getInitialValue();
            if (value !== undefined && initial !== undefined) {
                return value !== initial;
            }

            return false;
        }

        /**
         *
         */
        catchFocus() {
            if (this.getComponent().opts.type == 'checkbox') {
                this.toggleValue();

            } else {
                let elem = this.getComponent().valueComponent || this.getComponent().input;
                if (elem) {
                    elem.focus();
                }
            }
        }

        /**
         *
         */
        mnemonicAction() {
            this.catchFocus();
        }
    }
}
