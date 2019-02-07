HC.plugins.shaders.blendmode = _class(false, HC.ShaderPlugin, {
    index: 30,
    create: function () {
        if (!this.pass) {
            this.pass = new THREE.ShaderPass(THREE.BlendmodeShader);
        }

        return this.pass;
    },
    settings: {
        apply: false,
        random: false,
        index: 0,
        strength: {
            value: 0.5,
            _type: [-2, 2, 0.01],
            audio: false,
            stepwise: false,
            oscillate: "off"
        },
        operator_one: {
            value: 0,
            _type: [0, 15, 1],
            audio: false,
            stepwise: false,
            oscillate: "off"
        },
        operator_two: {
            value: 1,
            _type: [0, 15, 1],
            audio: false,
            stepwise: false,
            oscillate: "off"
        }
    },
    dependencies: {
        operator_one: {
            "0": {
                "0": null,
                "9": null
            },
            "1": {"1": null},
            "2": {
                "9": null,
                "12": null
            },
            "3": {"9": null},
            "5": {"5": null},
            "6": {
                "1": null,
                "6": null
            },
            "7": {"10": null},
            "8": {
                "0": null,
                "5": null,
                "9": null,
                "10": null
            },
            "9": {
                "1": null,
                "10": null
            },
            "10": {
                "1": null,
                "3": null,
                "4": null,
                "5": null,
                "8": null,
                "11": null,
                "12": null,
                "15": null
            },
            "11": {
                "1": null,
                "2": null,
                "6": null,
                "12": null
            },
            "15": {
                "0": null,
                "6": null
            }
        },
        operator_two: 'operator_one'
    }
});