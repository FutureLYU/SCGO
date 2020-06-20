# SCGO

This is a react-based website for second-hand goods transactions.

## Table of Contents

- [Background](#background)
- [Install](#install)
- [Usage](#usage)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)

## Background

Some students would choose to sell items in WeChat Group but people in Group may easily miss because of mass information. This website is aimed at helping students sell easily. Students can upload their items on the website and delete after transactions. For convenience, students can upload several items once and get a long picture of all items, which can be used in WeChat Group. Also, other users can search what they want on the website. 


## Install

This project uses [node](http://nodejs.org) and [npm](https://npmjs.com). To install required dependencies, you need to run codes below in the folder

```sh
$ npm install
$ cd client; npm install
```

## Usage

To start app, you need to create dev.js under server/config folder and add your mongoDB connection in the file like 

```js
{}
module.exports = {
    mongoURI: '<your connection string>'
}
```

then your can run codes below under SCGO folder to start app

```
$ npm run dev
```

Roadmap
=========================
- [x] **Preview**  2020-06-18
    - ~~Base demo~~
- **0.1.0**  2020-06-20
    - Add email varification
- **0.2.0**  2019-06-？
    - Improve upload page
    - Add long-picture generator


## Contributing

## License
