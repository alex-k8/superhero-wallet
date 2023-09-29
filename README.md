# Superhero Wallet

**Superhero is a browser extension that allows you to send and receive value to URLs and content producers across the internet.**

[![Build Status](https://travis-ci.com/aeternity/superhero-wallet.svg?branch=develop)](https://travis-ci.com/aeternity/superhero-wallet) [![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/aeternity/superhero-wallet.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/aeternity/superhero-wallet/context:javascript)

## Build

Clone the master branch of this repo.

```
$ git clone https://github.com/aeternity/superhero-wallet.git
$ cd superhero-wallet
```

### Build locally

```
$ npm install
$ npm run build
$ npm run build:extension # build an extension
$ npm run build:web # build a web version
$ npm run build:android # to build android application
$ npm run build:ios # to build ios application
```

### Develop locally

```
$ npm install
$ npm run watch # watch an extension
$ npm run serve # watch a web version
```

### Run tests

```
$ npm install
$ npm run test:unit
$ npm run test:e2e
$ npm run test # to run both unit and e2e tests
```

### Add to browser via local build or release zip

- Chromium based (Chrome, Brave, Opera)

1. Open chrome/brave browser `Preferences -> More tools > Extensions`
2. Make sure `Developer mode` is `On` in the right corner.
3. Click the `Load unpacked` button and select the generated `dist` folder in the cloned repo or the unarchived release folder.

- Firefox

1. Open the Firefox menu and select `Add-ons` section.
2. Click the `Tools for  all add-ons` button and select `Debug Add-ons`
3. Click `Load a temorary add-on` and navigate to the generated `dist` folder in the cloned repo or the unarchived release folder and select the `manifest.json` file.

### Build Cordova version for production

#### iOS

- create Xcode project by `npm run build:ios`
- open created project in Xcode
- Go to TARGETS->App
- open Signing & Capabilities
- enable signing by the corresponding development team
- ensure that `applinks:wallet.superhero.com` is in Associated domains feature
- open Build Settings
- switch "Code Signing Identity => Release" and "Code Signing Identity => Release => Any iOS SDK" from "iOS Distribution" to "iOS Developer" 
- In the Info Tab ensure that you have the following permissions set. Privacy - Camera Usage Description, Privacy - Photo Library Usage Description and Privacy - Photo Library Additions Usage Description 
- Update in General Tab desired Release Version and Build Number
- choose Product => Archive
- In the organizer you can distribute app to Testflight and AppStore

#### Android

build a production version signed by the corresponding key ([see](https://ionicframework.com/docs/deployment/play-store#signing-an-apk)):
```bash
npm run build:android
```

## Security
If you discover a security vulnerability within this application, please get in touch with us. All security vulnerabilities will be promptly addressed.

## Tooling
This project is tested with BrowserStack.

## Contribution

Contributions are more than welcome.

If you spot an issue while testing/using the extension - [submit an issue](https://github.com/aeternity/superhero-wallet/issues)

If you want to help us with building this amazing project submit your PR!
