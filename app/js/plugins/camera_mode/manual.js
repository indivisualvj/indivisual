{
    HC.plugins.camera_mode.manual = class Plugin extends HC.CameraModePlugin {
        static index = 1;
        static name = 'static look forward';

        apply(lookAtVector) {
            let layer = this.layer;

            let cam = layer.getCamera();
            let dd = layer.cameraDefaultDistance();

            cam.zoom = this.settings.camera_mode_volume;
            cam.lookAt(new THREE.Vector3(0, 0, 0));
            cam.position.set(
                this.settings.camera_x * dd,
                this.settings.camera_y * dd,
                this.settings.camera_z * dd
            );
            cam.rotation.set(
                this.settings.camera_rotationx * RAD,
                this.settings.camera_rotationy * RAD,
                this.settings.camera_rotationz * RAD
            );
            if (lookAtVector) {
                cam.lookAt(lookAtVector);
            }
        }
    }
}
{
    HC.plugins.camera_mode.manualcenter = class Plugin extends HC.plugins.camera_mode.manual {
        static index = 2;
        static name = 'static lookat center';

        apply() {
            HC.plugins.camera_mode.manual.prototype.apply.call(this, new THREE.Vector3(0, 0, 0));
        }
    }
}

{
    HC.plugins.camera_mode.lightingpatternxyz = class Plugin extends HC.plugins.camera_mode.manual {
        static name = 'look at lighting_patternxyz';
        static index = 99999;

        apply() {
            let plugin = this.layer.getLightingPatternPlugin();
            HC.plugins.camera_mode.manual.prototype.apply.call(this, plugin.centerVector());
        }
    }
}
{
    HC.plugins.camera_mode.lightinglookatxyz = class Plugin extends HC.plugins.camera_mode.manual {
        static name = 'look at lighting_lookatxyz';
        static index = 99999;

        apply() {
            let plugin = this.layer.getLightingLookatPlugin();
            HC.plugins.camera_mode.manual.prototype.apply.call(this, plugin.centerVector());
        }
    }
}