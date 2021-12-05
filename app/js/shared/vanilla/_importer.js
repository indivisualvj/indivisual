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
    _importNodeModule('THREE', `three/${dir}`, cname)
}

function _importNodeModule(namespace, path, cname) {
    _import(namespace, `node_modules/${path}`, cname);
}

function _importJsLib(cname) {
    _importJs('HC', 'lib', cname);
}

function _importJs(namespace, dir, cname) {
    _importApp('HC', `js/${dir}`, cname);
}

function _importApp(namespace, dir, cname) {
    _import('HC', `app/${dir}`, cname);
}

function _import(namespace, path, cname) {
    if (window[namespace] && (!(cname in window[namespace]) || (typeof window[namespace][cname]) === 'function')) {
        // console.log(cname);
        let script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = `/${path}/${cname}`
        document.head.appendChild(script);
    }
}