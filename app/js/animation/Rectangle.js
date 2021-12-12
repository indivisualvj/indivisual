/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
class Rectangle {

    /**
     *
     * @param x
     * @param y
     * @param width
     * @param height
     */
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }


    /**
     *
     * @param width
     * @param height
     * @returns {Rectangle}
     */
    cropTo(width, height) {
        let offsetX = .5 * (this.width - width);
        let offsetY = .5 * (this.height - height);

        return new Rectangle(offsetX, offsetY, width, height);
    }

}

export {Rectangle}