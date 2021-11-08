
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