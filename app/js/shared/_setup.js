DEBUG = true;

APP_DIR = 'app';
STORAGE_DIR = 'storage';
SAMPLE_DIR = 'samples';
SESSION_DIR = 'sessions';
ASSET_DIR = 'assets';
FONT_DIR = ASSET_DIR + '/fonts';
IMAGE_DIR = ASSET_DIR + '/images';
CUBE_DIR = ASSET_DIR + '/cubes';
VIDEO_DIR = ASSET_DIR + '/videos';

_HASH = document.location.hash ? document.location.hash.substr(1) : '';
_SERVER = 'server';
_CONTROLLER = 'controller';
_ANIMATION = 'animation';
_SETUP = 'setup';
_CLIENT = 'client';
_MONITOR = 'monitor';

IS_CONTROLLER = G_INSTANCE === _CONTROLLER;
IS_SETUP = G_INSTANCE === _SETUP;
IS_ANIMATION = G_INSTANCE === _ANIMATION || G_INSTANCE === _CLIENT;
IS_MONITOR = G_INSTANCE === _MONITOR;

EVENT_SOURCE_SETTING_CHANGED = 'source.setting.changed';
EVENT_SAMPLE_READY = 'sample.ready';
EVENT_SAMPLE_STATUS_CHANGED = 'sample.disabled';
EVENT_RENDERER_RENDER = 'renderer.render';
EVENT_LAYER_ANIMATE = 'layer.animate';
EVENT_LAYER_RESET = 'layer.reset';
EVENT_LAYER_RESET_SHAPES = 'layer.reset_shapes';
EVENT_LAYER_RESET_LIGHTING = 'layer.reset_lighting';
EVENT_LAYER_RESET_AMBIENT = 'layer.reset_ambient';
EVENT_LAYER_RESET_FOG = 'layer.reset_fog';
EVENT_LAYER_UPDATE_SHADERS = 'layer.update_shaders';
EVENT_SHAPE_MATERIALS_UPDATE = 'shape.materials_update';
EVENT_SOURCE_MANAGER_RENDER = 'source-manager.render';
EVENT_DISPLAY_MANAGER_RENDER = 'display-manager.render';
EVENT_ANIMATION_RENDER = 'animation.render';
EVENT_ANIMATION_ANIMATE = 'animation.animate';

SKIP_TWO_FRAMES = 1000/60*2;
SKIP_FOUR_FRAMES = 1000/60*4;
SKIP_FIVE_FRAMES = 1000/60*5;
SKIP_TEN_FRAMES = 1000/60*10;

MNEMONICS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
OSD_TIMEOUT = 2000;
RAD = Math.PI / 180;
DEG = 180 / Math.PI;
SQUARE_DIAMETER = (Math.sqrt(2 * 2 + 2 * 2) / 2);
ANTIALIAS = true;

HC.now = window.performance.now.bind(window.performance);
if (TWEEN) {
    TWEEN.now = HC.now;
}

/**
 * @type {HC.AssetManager}
 */
assetman = new HC.AssetManager();

