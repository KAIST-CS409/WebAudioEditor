# WebAudioEditor
Web-based audio editor with various filters and audio library.

## Introduction
<img src="https://github.com/KAIST-CS409/WebAudioEditor/raw/master/img/main_image.png" alt="main_image">

WebAudioEditor project is about an audio editor that can be used in the web environment. There are various application-based audio editors these days, but those products are too complicated for novice users who are not familiar with audio editing. Also, it is cumbersome to install those applications on the local computer. Therefore, our project targets novice web audio editor users and provide access in web environment to give high accessibility. Moreover, users can save their edited audio files in their library.

## Architecture
<img src="https://github.com/KAIST-CS409/WebAudioEditor/raw/master/img/architecture.png" alt="architecture" width="70%">

The system consists of four modules: Handler, View, Server and DB. The Handler module uses Web Audio API to implement audio editing functions. It can modify audio files, workspaces, blocks and apply filters to selected blocks. After it finished loading or editing audio files it requests View module to render waveform of audio files. View component also renders main container view layout on the screen. As there are user data saved in the remote server, Handler module uses HTTP protocol communicates with Server module, which consists of node.js and express framework.  Handler module may requests audio, workspace or login info to the server and get responses about those information. Server module accepts these requests and then send queries to DB module, which is MongoDB, to get receive information.

## How to start
### Dependency installation
Install npm and mongodb before installing our project. Mongodb should run on localhost with port number 27017.

And then, run following command on the terminal.
```sh
$ npm install -g babel babel-cli nodemon cross-env webpack webpack-dev-server
$ npm install
```

### Quick start
```sh
$ npm run build
$ npm run start
```
Shortcut is ```$npm run bstart```

### Start with development environment
```sh
$ npm run development
```
If code changes, develompent server automatically compiles the code and run the server again.


## Technologies
[node.js](https://nodejs.org/en/)

[wavesurfer.js](https://github.com/katspaugh/wavesurfer.js)

[recorder.js](https://github.com/mattdiamond/Recorderjs)

[mongodb](https://www.mongodb.com)
