/**
 *
 * @param sample
 * @param image
 * @param progress
 * @param color
 */
function renderSample (sample, image, progress, color, hook) {
    if (image && sample.frames) {
        if (!sample.started) {
            if (progress.prc == 0) {
                listener.fire('sample.render.start', sample.id, sample);
                sample.started = true;
                if (hook) {
                    hook();
                }
            }
        }
        if (sample.started) {
            animation.powersave = true;
            if (progress.prc == 0) {
                if (sample.counter >= sample.beats) {
                    sample.finish(sample.record);

                } else {
                    sample.counter++;
                    listener.fire('sample.render.progress', sample.id, sample);
                }

            }
            if (!sample.complete) {
                var target = sample.frames[sample.pointer++];
                if (target && target.ctx) {
                    target._color = color;
                    target.progress = sample.counter + progress.prc;
                    target.prc = progress.prc;
                    var ctx = target.ctx;
                    ctx.clearRect(0, 0, sample.width, sample.height);
                    ctx.drawImage(image, 0, 0);
                }
            }
        }
    } else {
        listener.fire('sample.render.error', sample.id, sample);
    }
}

/**
 *
 * @param sample
 * @param name
 * @param resolution
 */
function storeSample (sample, name, resolution)
{

    sample.pointer = 0;
    var canvas = false;
    var ctx = false;
    if (resolution && resolution != 1.0) {
        canvas = document.createElement('canvas');
        canvas.width = sample.width * resolution;
        canvas.height = sample.height * resolution;
        ctx = canvas.getContext('2d');
    }

    var _mov = function () {

        if (sample.isReady()) {
            animation.powersave = true;

            var frame = sample.frames[sample.pointer];
            if (ctx) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(frame, 0, 0, frame.width, frame.height, 0, 0, canvas.width, canvas.height);
                frame = canvas;
            }
            var now = HC.now();
            var data = frame.toDataURL('image/png');
            var diff = HC.now() - now;

            messaging.sample(name, sample.pointer + '.png', data);
            sample.pointer++;

            if (sample.pointer % 5 == 0) {
                listener.fire('sample.store.progress', sample.id, sample);
            }

            if (sample.pointer < sample.frames.length) {

                setTimeout(function () {
                    requestAnimationFrame(_mov);
                }, animation.threadTimeout(diff/animation.duration));

            } else {
                animation.powersave = false;
                listener.fire('sample.store.end', sample.id, sample);
            }
        }
    };
    requestAnimationFrame(_mov);
}