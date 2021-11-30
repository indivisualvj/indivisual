function _importThreeShader(cname) {
    _importThreeModule('examples/js/shaders', cname);
}

function _importThreePostprocessing(cname) {
    _importThreeModule('examples/js/postprocessing', cname);
}

function _importThreeLoader(cname) {
    _importThreeModule('examples/js/loaders', cname);
}

function _importThreeGeometry(cname) {
    _importThreeModule('examples/js/geometries', cname);
}

function _importThreeModule(dir, cname) {
    _importNodeModule('THREE', `three/${dir}/${cname}.js`, cname)
}

function _importNodeModule(namespace, path, cname) {
    // if (!window[namespace]) {
    //     window[namespace] = {};
    // }
    if (window[namespace] && (!(cname in window[namespace]) || (typeof window[namespace][cname]) === 'function')) {
        document.writeln(`<script type='text/javascript' src='/node_modules/${path}'></script>`);
    }
}
