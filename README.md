# indivisual - VJ-Synthesizer

## What is it? (Features/Antifeatures)
- YEAH BABY!!! indivisual - VJ-Synthesizer!!!
- ... more explanation here ...


## Things you have to know
indivisual VJ-Synthesizer works best and also is only developed on google-chrome.
I tried it on firefox but the performance is bad. 
Also i never tried it on another platform than linux (ubuntu & mint).

There is no clean code in here. There also is no explicit design pattern 
except a self designed plugin concept.

However i tried to cleanup and remove the messiest parts of it since i retired 
from my part time job as a VJ performing video life acts in some well known clubs in Munich.
I also retired from being a professional developer due to my inability 
to use popular programming techniques and design patterns.  

Therefore things do not work together perfectly sometimes.

But still it's pretty much fun to play with!

## Getting Started
- Install [Node.js](https://nodejs.org/en/download/)
- Install [yarn](https://yarnpkg.com/lang/en/docs/install)
- Execute the following lines in your command line:
    ```
    $ yarn install
    $ yarn start --port 8081
    ```
- Open https://localhost:8081/controller.html 
- Open https://localhost:8081 in a second window
- Don't hesitate if your browser throws something like this:
    
    This is a SSL warning. We can't use a public SSL certificate 
    but we have to use SSL to have microphone and audio input working. Therefore SSL hast to be enabled.
    Just click on the "Advanced" button and then on "Proceed to localhost (unsafe)".
    
  ![](readme/images/NET::ERR_CERT_AUTHORITY_INVALID.png) 
- Split the two windows left and right
- Try some of the setups from presets (controller->lowerleft)
- Play around
- Try to learn something in this Quick and Dirty Video Tutorial
    [![](http://img.youtube.com/vi/aPwviMbDYH8/0.jpg)](http://www.youtube.com/watch?v=aPwviMbDYH8 "")


## Questions & Answers
- Create an issue for your question

## Used Libraries and Credits
Many thanks to:

- Google for their lightning fast browser
- All the people contributing to web browser technology
- https://github.com/nodejs/node
- https://github.com/mrdoob/three.js
- https://github.com/tweenjs/tween.js
- https://github.com/glowbox/maptasticjs
- https://github.com/vuejs/vue
- https://github.com/dataarts/dat.gui
- https://github.com/mrdoob/stats.js
- https://github.com/chandlerprall/ThreeCSG
- https://www.shadertoy.com/

## How To

### Mapping
- Focus the animation or setup window 
- Enable mapping controls: M
- Show grid: B
- Focus next/another display: TAB/MOUSE1 
    - After a window resize event the mapping will not be updated until you open the mapping controls
    - You can recenter your mapping by enabling it by M and press TAB
- Move around: MOUSE1_DRAG or LEFT/RIGHT/UP/DOWN 
- Press SHIFT + MOUSE1 any point to center the current display there
- Press 1-9 to center and resize 1st to 9th division of the preset resolution
    - SHIFT + 1-9 to does the same based on screen size
- Flip display: V/H
- Rotate 45°: R
- Rotate stepwise: ALT + LEFT/RIGHT
- Scale: ALT + UP/DOWN

- ... more explanation here

### Samples & Sequences
- ... awesome ...
- Slow on GPUs but fast on INTEL's internal graphics cards
- Who could help me getting this into the GPU's memory -> contact me

### Shape-Editor
This feature is pretty crazy to use. But for some cases it does its job pretty well. Have a look at head.json or leaves.json in _____demos.

- In the controller, set shape_geometry to custom
- Open https://localhost:8081/setup.html
- Press S to enable shape controls
- ... more explanation here ...

### MIDI Controllers
- If you own a Arturia Beatstep, simply connect it. If the device uses factory settings, it will work immediately and the layout will just work fine.
- Otherwise you have to build up your own layout. Have a look at [MidiController.yml](app/structure/MidiController.yml) 
- ... more explanation here ...  

### Plugins
indivisual comes with a set of funny plugins. Nevertheless you might want to extend it with some of your own ideas.
In this case you can add your own plugins for the most settings available.

- ... more explanation here ...

## Contributing
If you have any suggestion or features or you found some bugs,
feel free to contribute to this project.
Just open a pull requests or an issue.

## Pending
- Some serious glContext lost issues
