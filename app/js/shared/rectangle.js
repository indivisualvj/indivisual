/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
{

    HC.Rectangle = class Rectangle {

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
         * @returns {HC.Rectangle}
         */
        cropTo(width, height) {
            let offsetX = .5 * (this.width - width);
            let offsetY = .5 * (this.height - height);

            return new HC.Rectangle(offsetX, offsetY, width, height);
        }

    }
}