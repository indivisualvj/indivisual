// HC.plugins.oscillate.twostep = _class(
//     function () {
//         this.preset = {value: 1, next: 1};
//     }, HC.OscillatePlugin, {
//         name: 'twostep 0/1 on peak',
//         index: 30,
//         apply: function (key) {
//             var pa = this.params(key);
//
//             HC.Osci.step(pa, 2, beatkeeper.getSpeed('full'), true);
//             this.activate(key, pa.value);
//         }
//     }
// );
//
// HC.plugins.oscillate.twostepminus = _class(
//     function () {
//         this.preset = {value: 1, next: 1};
//     }, HC.OscillatePlugin, {
//         name: 'twostep -1/1 on peak',
//         index: 30,
//         apply: function (key) {
//             var pa = this.params(key);
//             HC.Osci.step(pa, 2, beatkeeper.getSpeed('full'), true, true);
//             this.activate(key, pa.value);
//         }
//     }
// );
//
// HC.plugins.oscillate.twostephalfsminus = _class(
//     function () {
//         this.preset = {value: 1, next: 1};
//     }, HC.OscillatePlugin, {
//         name: 'twostep -1/1 on halfs',
//         index: 30,
//         apply: function (key) {
//             var pa = this.params(key);
//             HC.Osci.step(pa, 2, beatkeeper.getSpeed('half'), false, true);
//             this.activate(key, pa.value);
//         }
//     }
// );
//
// HC.plugins.oscillate.twostepfullsminus = _class(
//     function () {
//         this.preset = {value: 1, next: 1};
//     }, HC.OscillatePlugin, {
//         name: 'twostep -1/1 on fulls',
//         index: 30,
//         apply: function (key) {
//             var pa = this.params(key);
//             HC.Osci.step(pa, 2, beatkeeper.getSpeed('full'), false, true);
//             this.activate(key, pa.value);
//         }
//     }
// );
//
// HC.plugins.oscillate.threestep = _class(
//     function () {
//         this.preset = {value: 1, next: 1};
//     }, HC.OscillatePlugin, {
//         name: 'threestep 0/1 on peak',
//         index: 30,
//         apply: function (key) {
//             var pa = this.params(key);
//             HC.Osci.step(pa, 3, beatkeeper.getSpeed('full'), true);
//             this.activate(key, pa.value);
//         }
//     }
// );
//
// HC.plugins.oscillate.threestepminus = _class(
//     function () {
//         this.preset = {value: 1, next: 1};
//     }, HC.OscillatePlugin, {
//         name: 'threestep -1/1 on peak',
//         index: 30,
//         apply: function (key) {
//             var pa = this.params(key);
//             HC.Osci.step(pa, 3, beatkeeper.getSpeed('full'), true, true);
//             this.activate(key, pa.value);
//         }
//     }
// );
//
// HC.plugins.oscillate.threestephalfsminus = _class(
//     function () {
//         this.preset = {value: 1, next: 1};
//     }, HC.OscillatePlugin, {
//         name: 'threestep -1/1 on halfs',
//         index: 30,
//         apply: function (key) {
//             var pa = this.params(key);
//             HC.Osci.step(pa, 3, beatkeeper.getSpeed('half'), false, true);
//             this.activate(key, pa.value);
//         }
//     }
// );
//
// HC.plugins.oscillate.threestepfullsminus = _class(
//     function () {
//         this.preset = {value: 1, next: 1};
//     }, HC.OscillatePlugin, {
//         name: 'threestep -1/1 on fulls',
//         index: 30,
//         apply: function (key) {
//             var pa = this.params(key);
//             HC.Osci.step(pa, 3, beatkeeper.getSpeed('full'), false, true);
//             this.activate(key, pa.value);
//         }
//     }
// );

HC.plugins.oscillate.fourstep = _class(
    function () {
        this.preset = {value: 1, next: 1};
    }, HC.OscillatePlugin, {
        name: 'fourstep 0/1 on peak',
        index: 30,
        apply: function (key) {
            var pa = this.params(key);
            HC.Osci.step(pa, 4, beatkeeper.getSpeed('full'), true);
            this.activate(key, pa.value);
        }
    }
);

HC.plugins.oscillate.fourstepfulls = _class(
    function () {
        this.preset = {value: 1, next: 1};
    }, HC.OscillatePlugin, {
        name: 'fourstep 0/1 on fulls',
        index: 30,
        apply: function (key) {
            var pa = this.params(key);
            HC.Osci.step(pa, 4, beatkeeper.getSpeed('full'), false, false);
            this.activate(key, pa.value);
        }
    }
);

HC.plugins.oscillate.fourstepminus = _class(
    function () {
        this.preset = {value: 1, next: 1};
    }, HC.OscillatePlugin, {
        name: 'fourstep -1/1 on peak',
        index: 30,
        apply: function (key) {

            var pa = this.params(key);
            HC.Osci.step(pa, 4, beatkeeper.getSpeed('full'), true, true);
            this.activate(key, pa.value);
        }
    }
);

HC.plugins.oscillate.fourstephalfsminus = _class(
    function () {
        this.preset = {value: 1, next: 1};
    }, HC.OscillatePlugin, {
        name: 'fourstep -1/1 on halfs',
        index: 30,
        apply: function (key) {
            var pa = this.params(key);
            HC.Osci.step(pa, 4, beatkeeper.getSpeed('half'), false, true);
            this.activate(key, pa.value);
        }
    }
);

HC.plugins.oscillate.fourstepfullsminus = _class(
    function () {
        this.preset = {value: 1, next: 1};
    }, HC.OscillatePlugin, {
        name: 'fourstep -1/1 on fulls',
        index: 30,
        apply: function (key) {
            var pa = this.params(key);
            HC.Osci.step(pa, 4, beatkeeper.getSpeed('full'), false, true);
            this.activate(key, pa.value);
        }
    }
);