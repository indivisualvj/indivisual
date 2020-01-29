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
            if (!(parent instanceof HC.Guify)) {
                opts.folder = parent.getComponent();
            }

            if (opts.onChange) {
                let onChange = opts.onChange;
                let that = this;
                opts.onChange = function (v) {
                    onChange(v, that);
                }
            }

            this.component = this.gui.Register(opts);

            this.getContainer().setAttribute('data-id', this.getProperty());
            if (opts.dataClass) {
                this.getContainer().setAttribute('data-class', opts.dataClass);
            }
            if (opts.cssClasses) {
                let classes = opts.cssClasses.split(' ');
                for (let c in classes) {
                    this.getContainer().classList.add(classes[c]);
                }
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

            valueComponent.addEventListener('keydown', (e) => {
                if (e.ctrlKey && (e.shiftKey || e.altKey)) {
                    return;
                }

                // e.stopPropagation();

                if (valueComponent.nodeName === 'INPUT') {
                    if (e.keyCode == 27) { // ESCAPE
                        valueComponent.blur();
                    }

                } else if (valueComponent.nodeName === 'SELECT') {
                    if (e.keyCode == 8 || e.keyCode == 27) { // BACKSPACE | ESCAPE
                        valueComponent.focus();
                        valueComponent.blur();
                        valueComponent.focus();
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
                    e.preventDefault();
                    e.stopPropagation();
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
            // this.setValue(!v);
            this.getComponent().emit('input', !v);
        }

        /**
         *
         */
        incrementValue() {
            let v = this.getValue();
            let s = this.getStep();
            // this.setValue(v + s); fixme does not stop at max
            this.getComponent().emit('input', v + s);
        }

        /**
         *
         */
        decrementValue() {
            let v = this.getValue();
            let s = this.getStep();
            // this.setValue(v - s); fixme does not stop at min
            this.getComponent().emit('input', v - s);
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
        triggerComponent() {
            if (this.getComponent().opts.type == 'checkbox') {
                this.toggleValue();

            } else if (this.getComponent().opts.type == 'button') {
                this.getComponent().button.click();

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
            this.triggerComponent();
        }
    }
}

