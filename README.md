## Synopsis

Example FX GUI that illustrates integration of Diffusion with an Electron GUI.

![screenshot](/example-screenshot.png?raw=true)

## Installation

This example requires NodeJS (version 4 or higher).

After cloning this repo, run ```npm install``` to download required dependencies.

To use Electron to run the app from source, run ```npm start```

## Building

To build this example into executables, run 
```npm run build -- --platform=<platform>```, 
where the ```platform``` argument is any of the available values from [electron-packager](https://github.com/electron-userland/electron-packager/blob/master/usage.txt).

The generated executables will be found in the ```build``` directory.

For example, running ```npm run build -- --platform=darwin``` from a clean installation will create the ```build/FxPrices-darwin-x64``` directory, containing ```FxPrices.app```. 
