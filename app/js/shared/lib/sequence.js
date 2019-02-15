/**
 *
 * @param sequence
 * @param frames
 * @param start
 * @param end
 */
function applySequenceSlice(sequence, frames, start, end) {
    var end2end = frames - end;
    var prc = (frames - end2end) / frames;
    var sp = start;
    var ep = sp + prc * frames;
    var l = ep - sp;
    var ve = sp + l;
    if (ve > frames) {
        sp -= ve - frames;
    }

    sequence.start = Math.min(frames - 1, Math.round(sp));
    sequence.end = Math.min(frames - 1, Math.round(ep));
    sequence.length = sequence.end - sequence.start;
}
