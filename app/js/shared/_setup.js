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
EVENT_RENDERER_BEFORE_RENDER = 'renderer.before_render';
EVENT_LAYER_RESET = 'layer.reset';
EVENT_LAYER_RESET_SHAPES = 'layer.reset_shapes';
EVENT_LAYER_RESET_LIGHTING = 'layer.reset_lighting';
EVENT_LAYER_RESET_AMBIENT = 'layer.reset_ambient';
EVENT_LAYER_RESET_FOG = 'layer.reset_fog';
EVENT_LAYER_UPDATE_SHADERS = 'layer.update_shaders';
EVENT_SHAPE_MATERIALS_UPDATE = 'shape.materials_update';
EVENT_SOURCE_MANAGER_RENDER = 'source-manager.render';
EVENT_DISPLAY_MANAGER_RENDER = 'display-manager.render';
EVENT_SAMPLE_INIT_END = 'sample.init.end';
EVENT_SAMPLE_RENDER_END = 'sample.render.end';
EVENT_SAMPLE_RENDER_START = 'sample.render.start';
EVENT_SAMPLE_RENDER_PROGRESS = 'sample.render.progress';
EVENT_SAMPLE_RENDER_ERROR = 'sample.render.error';
ENENT_SAMPLE_STORE_END = 'sample.store.end';
EVENT_ANIMATION_RENDER = 'animation.render';
EVENT_ANIMATION_ANIMATE = 'animation.animate';
EVENT_WEBGL_CONTEXT_LOST = 'webglcontextlost'
EVENT_ANIMATION_UPDATE_SETTING = 'animation.update_setting';
EVENT_AUDIO_PEAK = 'audio.peak';
EVENT_CLIP_UPDATE = 'clip.update';
EVENT_THUMB_UPDATE = 'thumb.update';
EVENT_CLIP_INDICATOR_UPDATE = 'clip.indicator_update';
EVENT_ANIMATION_PLAY = 'animation.play';
EVENT_ANIMATION_PAUSE = 'animation.pause';
EVENT_FULL_RESET = 'full_reset';
EVENT_RESET = 'reset';
EVENT_RESIZE = 'resize';

SKIP_ONE_FRAMES = 1000/60;
SKIP_TWO_FRAMES = 1000/60*2;
SKIP_FOUR_FRAMES = 1000/60*4;
SKIP_FIVE_FRAMES = 1000/60*5;
SKIP_TEN_FRAMES = 1000/60*10;

MNEMONICS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
OSD_TIMEOUT = 2000;
RAD = Math.PI / 180;
DEG = 180 / Math.PI;
ANTIALIAS = true;

HC.now = window.performance.now.bind(window.performance);
if (TWEEN) {
    TWEEN.now = HC.now;
}

assetman = new HC.AssetManager();

