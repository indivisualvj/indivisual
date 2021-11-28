{
    HC.plugins.pattern.disc = class Plugin extends HC.PatternPlugin {
        static name = 'disc';
        injections = {shellIndex: false};
        squareDiameter = (Math.sqrt(2 * 2 + 2 * 2) / 2);

        apply(shape) {
            let layer = this.layer;
            let params = this.params(shape);

            let index = shape.index;
            let x = 0, y = 0, z = 0;

            if (index > 0) {

                let diameter = layer.shapeSize(this.squareDiameter);

                if (!params.shellIndex) {

                    let shellIndex = 1;
                    let shapesOnShell = 0;
                    let shapesOnShells = 0;

                    while (shapesOnShells < index) {
                        let circum = 2 * Math.PI * (diameter * shellIndex);
                        shapesOnShell = Math.floor(circum / diameter);
                        let segment = 360 / shapesOnShell * RAD;

                        shapesOnShells += shapesOnShell;

                        if (index <= shapesOnShells) {
                            let shellPosition = shapesOnShell - (shapesOnShells - index) - 1;

                            params.shellIndex = shellIndex;
                            params.shellAngle = segment * shellPosition;
                        }

                        shellIndex++;
                    }
                }

                let radius = diameter * params.shellIndex;
                let angle = params.shellAngle;

                x = Math.sin(angle) * radius * this.settings.pattern_paddingx;
                y = Math.cos(angle) * radius * this.settings.pattern_paddingy;
                z = 0;

            }

            layer.positionIn3dSpace(shape, x, y, z);
        }
    }
}