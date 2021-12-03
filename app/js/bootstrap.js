var HC = HC || {};
var THREE = THREE || {};

const DEBUG = true;

const APP_DIR = 'app';
const STORAGE_DIR = 'storage';
const SAMPLE_DIR = 'samples';
const SESSION_DIR = 'sessions';
const ASSET_DIR = 'assets';
const FONT_DIR = ASSET_DIR + '/fonts';
const IMAGE_DIR = ASSET_DIR + '/images';
const CUBE_DIR = ASSET_DIR + '/cubes';
const VIDEO_DIR = ASSET_DIR + '/videos';

const _HASH = document.location.hash ? document.location.hash.substr(1) : '';
const _SERVER = 'server';
const _CONTROLLER = 'controller';
const _ANIMATION = 'animation';
const _SETUP = 'setup';
const _CLIENT = 'client';
const _MONITOR = 'monitor';

const IS_CONTROLLER = G_INSTANCE === _CONTROLLER;
const IS_SETUP = G_INSTANCE === _SETUP;
const IS_ANIMATION = G_INSTANCE === _ANIMATION || G_INSTANCE === _CLIENT;
const IS_MONITOR = G_INSTANCE === _MONITOR;

const EVENT_SOURCE_SETTING_CHANGED = 'source.setting.changed';
const EVENT_SAMPLE_READY = 'sample.ready';
const EVENT_SAMPLE_STATUS_CHANGED = 'sample.disabled';
const EVENT_RENDERER_BEFORE_RENDER = 'renderer.before_render';
const EVENT_LAYER_RESET = 'layer.reset';
const EVENT_LAYER_RESET_SHAPES = 'layer.reset_shapes';
const EVENT_LAYER_RESET_LIGHTING = 'layer.reset_lighting';
const EVENT_LAYER_RESET_AMBIENT = 'layer.reset_ambient';
const EVENT_LAYER_RESET_FOG = 'layer.reset_fog';
const EVENT_LAYER_UPDATE_SHADERS = 'layer.update_shaders';
const EVENT_SHAPE_MATERIALS_UPDATE = 'shape.materials_update';
const EVENT_SOURCE_MANAGER_RENDER = 'source-manager.render';
const EVENT_DISPLAY_MANAGER_RENDER = 'display-manager.render';
const EVENT_SAMPLE_INIT_END = 'sample.init.end';
const EVENT_SAMPLE_RENDER_END = 'sample.render.end';
const EVENT_SAMPLE_RENDER_START = 'sample.render.start';
const EVENT_SAMPLE_RENDER_PROGRESS = 'sample.render.progress';
const EVENT_SAMPLE_RENDER_ERROR = 'sample.render.error';
const ENENT_SAMPLE_STORE_END = 'sample.store.end';
const EVENT_ANIMATION_RENDER = 'animation.render';
const EVENT_ANIMATION_ANIMATE = 'animation.animate';
const EVENT_WEBGL_CONTEXT_LOST = 'webglcontextlost'
const EVENT_ANIMATION_UPDATE_SETTING = 'animation.update_setting';
const EVENT_AUDIO_PEAK = 'audio.peak';
const EVENT_CLIP_UPDATE = 'clip.update';
const EVENT_CLIP_LOADED = 'clip.loaded';
const EVENT_THUMB_UPDATE = 'thumb.update';
const EVENT_CLIP_INDICATOR_UPDATE = 'clip.indicator_update';
const EVENT_ANIMATION_PLAY = 'animation.play';
const EVENT_ANIMATION_PAUSE = 'animation.pause';
const EVENT_FULL_RESET = 'full_reset';
const EVENT_RESET = 'reset';
const EVENT_RESIZE = 'resize';

const SKIP_ONE_FRAMES = 1000/60;
const SKIP_TWO_FRAMES = 1000/60*2;
const SKIP_FOUR_FRAMES = 1000/60*4;
const SKIP_FIVE_FRAMES = 1000/60*5;
const SKIP_TEN_FRAMES = 1000/60*10;

const MNEMONICS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const OSD_TIMEOUT = 2000;
const RAD = Math.PI / 180;
const DEG = 180 / Math.PI;
const ANTIALIAS = true;

HC.now = window.performance.now.bind(window.performance);
if (TWEEN) {
    TWEEN.now = HC.now;
}