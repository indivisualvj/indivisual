var Stats = function () {

    var startTime = Date.now(), prevTime = startTime;
    var ms = 0, msMin = Infinity, msMax = 0;
    var fps = 0, fpsMin = Infinity, fpsMax = 0;
    var frames = 0, mode = 0;

    var setMode = function ( value ) {

        mode = value;

    };

    return {
        setMode: setMode,

        begin: function () {

            startTime = Date.now();

        },

        end: function () {

            var time = Date.now();

            ms = time - startTime;
            msMin = Math.min( msMin, ms );
            msMax = Math.max( msMax, ms );

            frames ++;

            if ( time > prevTime + 1000 ) {

                fps = Math.round( ( frames * 1000 ) / ( time - prevTime ) );
                fpsMin = Math.min( fpsMin, fps );
                fpsMax = Math.max( fpsMax, fps );

                prevTime = time;
                frames = 0;

            }

            return time;

        },

        update: function () {

            startTime = this.end();

        },

        values: function () {
            return {
                fps: fps,
                fpsMin: fpsMin,
                fpsMax: fpsMax,
                ms: ms,
                msMin: msMin,
                msMax: msMax
            };
        }

    }

};