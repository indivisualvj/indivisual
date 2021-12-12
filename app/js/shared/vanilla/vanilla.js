HTMLElement.prototype.ancestorOfClass = function (classname) {
    let _getAncestor = (target) => {
        if (target && target.classList && target.classList.contains(classname)) {
            return target;
        }

        return target.parentNode ? _getAncestor(target.parentNode) : null;
    };

    return _getAncestor(this);
};

function clone (obj) {
    if (obj === null || typeof obj !== "object") {
        return obj;
    } else if (Array.isArray(obj)) {
        let clonedArr = [];
        obj.forEach(function (element) {
            clonedArr.push(clone(element))
        });
        return clonedArr;
    } else {
        let clonedObj = {};
        for (let prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                clonedObj[prop] = clone(obj[prop]);
            }
        }
        return clonedObj;
    }
}

JSON.copy = function (object) {
    return JSON.parse(JSON.stringify(object));
};

Number.prototype.toIntArray = function () {
    return [this];
};

String.prototype.toIntArray = function () {
    if (this.length) {
        let arr = [];

        if (this.match(/\d+\.{2}\d+/)) {
            // fill from digit 1 to digit 2
            let ft = this.split('..');
            let from = parseInt(ft[0]);
            let to = parseInt(ft[1]);
            for (let i = from; i <= to; i++) {
                arr.push(i);
            }
        } else {
            arr = this.split(',');
        }

        return arr.map(it => {
            return parseInt(it);
        });
    }

    return [];
};

Number.prototype.digits = function () {
    let digits = this.toString();
    return digits.substr(digits.indexOf('.')+1).length;
}

String.prototype.toSnakeCase = function() {
    return this
        .match(/[A-Z0-9]{2,}(?=[A-Z0-9][a-z0-9]+)|[A-Z0-9]?[a-z0-9]+|[A-Z0-9]/g)
        .map(x => x.toLowerCase())
        .join('_');
}

String.prototype.toKebapCase = function() {
    return this
        .match(/[A-Z0-9]{2,}(?=[A-Z0-9][a-z0-9]+)|[A-Z0-9]?[a-z0-9]+|[A-Z0-9]/g)
        .map(x => x.toLowerCase())
        .join('-');
}

Object.sortedKeys = function (_object) {
    let keys = Object.keys(_object);
    keys.sort((a, b) => {
        let ai = _object[a].index || 99999;
        let bi = _object[b].index || 99999;
        let an = _object[a].name || a;
        let bn = _object[b].name || b;

        let cmpi = ai - bi;
        if (cmpi === 0) {
            return an.localeCompare(bn);
        }
        return cmpi;
    });

    return keys;
}