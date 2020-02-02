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

IS_CONTROLLER = G_INSTANCE == _CONTROLLER;
IS_SETUP = G_INSTANCE == _SETUP;
IS_ANIMATION = G_INSTANCE == _ANIMATION || G_INSTANCE == _CLIENT;
IS_MONITOR = G_INSTANCE == _MONITOR;

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
 *
 * @type {HC.AssetManager}
 */
assetman = new HC.AssetManager(); // fixme put into config ?!
