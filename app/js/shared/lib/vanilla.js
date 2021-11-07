
HTMLElement.prototype.ancestorOfClass = function (classname) {
    let _getAncestor = (target) => {
        if (target && target.classList && target.classList.contains(classname)) {
            return target;
        }

        return target.parentNode ? _getAncestor(target.parentNode) : null;
    };

    return _getAncestor(this);
};
