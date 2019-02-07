HC.plugins.shaders.crawler = _class(false, HC.ShaderPlugin, {
    index: 170,
    create: function () {
        if (!this.pass) {
            this.pass = new THREE.ShaderPass(THREE.CrawlerShader);
        }

        return this.pass;
    },
    settings: {
        apply: false,
        random: false,
        index: 0,
        time: {
            value: 1,
            _type: [-3, 3, 0.001],
            audio: false,
            stepwise: false,
            oscillate: "off"
        },
        strength: {
            value: 0.25,
            _type: [0, 5, 0.01],
            audio: false,
            stepwise: false,
            oscillate: "off"
        },
        displace: {value: true}
    }
});
HC.plugins.shaders.twist = _class(false, HC.ShaderPlugin, {
    index: 180,
    create: function () {
        if (!this.pass) {
            this.pass = new THREE.ShaderPass(THREE.TwistShader);
        }

        return this.pass;
    },
    settings: {
        apply: false,
        random: false,
        index: 0,
        radius: {
            value: 0.5,
            _type: [0, 1, 0.001],
            audio: false,
            stepwise: false,
            oscillate: "off"
        },
        angle: {
            value: 5,
            _type: [-10, 10, 0.001],
            audio: false,
            stepwise: false,
            oscillate: "off"
        },
        offset: {
            x: {
                value: 0.5,
                _type: [0, 1, 0.01],
                audio: false,
                stepwise: false,
                oscillate: "off"
            },
            y: {
                value: 0.5,
                _type: [0, 1, 0.01],
                audio: false,
                stepwise: false,
                oscillate: "off"
            }
        }
    }
});
HC.plugins.shaders.rgbsplit = _class(false, HC.ShaderPlugin, {
    index: 190,
    create: function () {
        if (!this.pass) {
            this.pass = new THREE.ShaderPass(THREE.RGBShiftShader);
        }

        return this.pass;
    },
    settings: {
        apply: false,
        random: false,
        index: 0,
        amount: {
            value: 0.005,
            _type: [0, 3, 0.001],
            audio: false,
            stepwise: false,
            oscillate: "off"
        },
        angle: {
            value: 0,
            _type: [-5, 5, 0.001],
            audio: false,
            stepwise: false,
            oscillate: "off"
        }
    }
});
HC.plugins.shaders.dotscreen = _class(false, HC.ShaderPlugin, {
    index: 200,
    create: function () {
        if (!this.pass) {
            this.pass = new THREE.ShaderPass(THREE.DotScreenShader);
        }

        return this.pass;
    },
    settings: {
        apply: false,
        random: false,
        index: 0,
        scale: {
            value: 0.5,
            _type: [0, 5, 0.001],
            audio: false,
            stepwise: false,
            oscillate: "off"
        },
        angle: {
            value: 5,
            _type: [-10, 10, 0.01],
            audio: false,
            stepwise: false,
            oscillate: "off"
        }
    }
});
HC.plugins.shaders.ledmatrix = _class(false, HC.ShaderPlugin, {
    index: 210,
    create: function () {
        if (!this.pass) {
            this.pass = new THREE.ShaderPass(THREE.DotMatrixShader);
        }

        return this.pass;
    },
    settings: {
        apply: false,
        random: false,
        index: 0,
        spacing: {
            value: 10,
            _type: [1, 500, 1],
            audio: false,
            stepwise: false,
            oscillate: "off"
        },
        size: {
            value: 4,
            _type: [0.5, 250, 1],
            audio: false,
            stepwise: false,
            oscillate: "off"
        },
        blur: {
            value: 4,
            _type: [0, 250, 0.01],
            audio: false,
            stepwise: false,
            oscillate: "off"
        },
        punchedplate: {value: false}
    }
});
HC.plugins.shaders.pixelate = _class(false, HC.ShaderPlugin, {
    index: 220,
    create: function () {
        if (!this.pass) {
            this.pass = new THREE.ShaderPass(THREE.PixelateShader);
        }

        return this.pass;
    },
    settings: {
        apply: false,
        random: false,
        index: 0,
        size: {
            x: {
                value: 4,
                _type: [1, 64, 1],
                audio: false,
                stepwise: false,
                oscillate: "off"
            },
            y: {
                value: 4,
                _type: [1, 64, 1],
                audio: false,
                stepwise: false,
                oscillate: "off"
            }
        }
    }
});
HC.plugins.shaders.hexagonsampling = _class(false, HC.ShaderPlugin, {
    index: 230,
    create: function () {
        if (!this.pass) {
            this.pass = new THREE.ShaderPass(THREE.HexagonsamplingShader);
        }

        return this.pass;
    },
    settings: {
        apply: false,
        random: false,
        index: 0,
        divisor: {
            value: 80,
            _type: [1, 500, 0.5],
            audio: false,
            stepwise: false,
            oscillate: "off"
        }
    }
});
HC.plugins.shaders.crosshatch = _class(false, HC.ShaderPlugin, {
    index: 240,
    create: function () {
        if (!this.pass) {
            this.pass = new THREE.ShaderPass(THREE.CrossHatchShader);
        }

        return this.pass;
    },
    settings: {
        apply: false,
        random: false,
        index: 0,
        spacing: {
            value: 10,
            _type: [0.1, 24, 0.1],
            audio: false,
            stepwise: false,
            oscillate: "off"
        }
    }
});