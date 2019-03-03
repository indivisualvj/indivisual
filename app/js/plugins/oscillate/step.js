{
    HC.plugins.oscillate.fourstep = class Plugin extends HC.OscillatePlugin {
        static name = 'fourstep 0/1 on peak';
        static index = 30;
        preset = {value: 1, next: 1};

        apply(key) {
            let pa = this.params(key);
            HC.Osci.step(pa, 4, beatkeeper.getSpeed('full'), true);
            this.activate(key, pa.value);
        }
    }
}
{
    HC.plugins.oscillate.fourstepfulls = class Plugin extends HC.OscillatePlugin {
        static name = 'fourstep 0/1 on fulls';
        static index = 30;
        preset = {value: 1, next: 1};

        apply(key) {
            let pa = this.params(key);
            HC.Osci.step(pa, 4, beatkeeper.getSpeed('full'), false, false);
            this.activate(key, pa.value);
        }
    }
}
{
    HC.plugins.oscillate.fourstepminus = class Plugin extends HC.OscillatePlugin {
        preset = {value: 1, next: 1};
        static name = 'fourstep -1/1 on peak';
        static index = 30;

        apply(key) {
            let pa = this.params(key);
            HC.Osci.step(pa, 4, beatkeeper.getSpeed('full'), true, true);
            this.activate(key, pa.value);
        }
    }
}
{
    HC.plugins.oscillate.fourstephalfsminus = class Plugin extends HC.OscillatePlugin {
        static name = 'fourstep -1/1 on halfs';
        static index = 30;
        preset = {value: 1, next: 1};

        apply(key) {
            let pa = this.params(key);
            HC.Osci.step(pa, 4, beatkeeper.getSpeed('half'), false, true);
            this.activate(key, pa.value);
        }
    }
}
{
    HC.plugins.oscillate.fourstepfullsminus = class Plugin extends HC.OscillatePlugin {
        static name = 'fourstep -1/1 on fulls';
        static index = 30;
        preset = {value: 1, next: 1};

        apply(key) {
            let pa = this.params(key);
            HC.Osci.step(pa, 4, beatkeeper.getSpeed('full'), false, true);
            this.activate(key, pa.value);
        }
    }
}