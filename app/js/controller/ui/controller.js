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
            if (this.getComponent().opts.type === 'range') {
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
                    if (e.key === 'Escape') {
                        valueComponent.blur();
                    }

                } else if (valueComponent.nodeName === 'SELECT') {
                    if (e.key === 'Backspace' || e.key === 'Escape') {
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
            let valueComponent = this.component.valueComponent;

            valueComponent.addEventListener('keyup', (e) => {
                e.preventDefault();
                e.stopPropagation();

                if (e.keyCode === 38) { // UP
                    this.incrementValue();

                } else if (e.keyCode === 40) { // DOWN
                    this.decrementValue();
                }
            });

            valueComponent.addEventListener('mousedown', (e) => {
                active = true;
                window.addEventListener('mousemove', (e) => {
                    if (active) {
                        e.preventDefault();
                        e.stopPropagation();
                        let dy = e.movementY;
                        let resY = window.screen.availHeight;
                        let vy = Math.abs(dy / (resY/512));
                        if (dy < 0) {
                            this.incrementValue(vy);

                        } else if (dy > 0) {
                            this.decrementValue(vy);
                        }
                    }
                });
                window.addEventListener('mouseup', (e) => {
                    active = false;
                });
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
         */
        setValue(v) {
            this.getComponent().SetValue(v);
            this.getComponent().lastValue = v;
        }

        setRangeValue(v) {
            this.getComponent().valueComponent.value = v;
            this.getComponent().lastValue = v;
            this.getComponent().emit('input', v);
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
         * @param factor
         */
        incrementValue(factor) {
            let v = this.getValue();
            let s = this.getStep();
            let d = getDigits(s);

            if (isFloat(s)) {
                s *= Math.ceil(factor||1);
            }

            v += s;
            v = Math.min(v, this.getMax());
            v = round(v, d);

            this.setRangeValue(v);
        }

        /**
         *
         * @param factor
         */
        decrementValue(factor) {
            let v = this.getValue();
            let s = this.getStep();
            let d = getDigits(s);

            if (isFloat(s)) {
                s *= Math.ceil(factor||1);
            }

            v -= s;
            v = Math.max(v, this.getMin());
            v = round(v, d);
            this.setRangeValue(v);
        }

        /**
         *
         * @returns {number}
         */
        getMin() {
            return this.getComponent().opts.min;
        }

        /**
         *
         * @returns {number}
         */
        getMax() {
            return this.getComponent().opts.max;
        }

        /**
         *
         * @return {*|Array|*[]}
         */
        getInitialValue() {
            if ('initial' in this.getComponent().opts) {
                return this.getComponent().opts.initial;
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
            if (typeof value === 'string' && typeof initial === 'number') {
                value = parseFloat(value);
            }
            if (value !== undefined && initial !== undefined) {
                return value !== initial;
            }

            return false;
        }

        /**
         *
         */
        triggerComponent() {
            if (this.getComponent().opts.type === 'checkbox') {
                this.toggleValue();

            } else if (this.getComponent().opts.type === 'button') {
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

