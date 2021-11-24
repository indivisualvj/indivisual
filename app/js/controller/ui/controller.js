/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
{
    HC.GuifyController = class GuifyController extends HC.GuifyItem {

        _uniqueKey;

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

            if (opts.uniqueKey) {
                this._uniqueKey = opts.uniqueKey;
                delete opts.uniqueKey;
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
                if (e.keyCode === 38) { // UP
                    e.preventDefault();
                    this.incrementValue();

                } else if (e.keyCode === 40) { // DOWN
                    e.preventDefault();
                    this.decrementValue();
                }
            });

            valueComponent.addEventListener('mousedown', (e) => {
                let entry = e.screenY;
                let resY = window.screen.availHeight;

                let _handle = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    let deltaY = entry - e.screenY;//e.movementY;
                    let value = (deltaY / (resY/256));

                    if (value > 1) {
                        this.incrementValue();
                        entry = e.screenY;

                    } else if (value < -1) {
                        this.decrementValue();
                        entry = e.screenY;
                    }
                };

                window.addEventListener('mousemove', _handle);
                window.addEventListener('mouseup', (e) => {
                    window.removeEventListener('mousemove', _handle);
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
         * @returns {string}
         */
        getUniqueKey() {
            return this._uniqueKey || this.getProperty();
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
            if (this.getComponent().opts.object && this.getProperty() in this.getComponent().opts.object) {
                this.getComponent().opts.object[this.getProperty()] = v;
            }
            this.getComponent().lastValue = v;
            this.getComponent().SetValue(v);
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

