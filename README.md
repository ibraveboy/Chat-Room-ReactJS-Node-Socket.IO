# RealTime Chat Room build with react and nodejs using socket.io

This is repository is created to practice socket.io

## Requirements

- node `10`
- npm `^6.0.1`
- mongodb `3.6.3`

## Installation

After confirming that your environment meets the above requirements, you can create a new project based on `Chat-Room-ReactJS-Node-Socket.IO` by doing the following:

```bash
$ git clone https://github.com/ibraveboy/Chat-Room-ReactJS-Node-Socket.IO.git
<my-project-name>
$ cd <my-project-name>
```

Then install dependencies

```bash
$ npm install
$ npm run prod  #this will create a Dist folder in client
$ npm run dev # webpack-dev-server will run front end only
$ npm run server  # Compiles the server-side and client side before the application launches
```

If everything works, you should get a message indicating so. In development Application will be served on port 8080
Open the web browser to http://localhost:8080/

## Project Structure

The project structure presented in this starter kit is outlined below. This structure is only meant to serve as a guide.

```
.
├── client                   # React-redux related files
│   ├── dist                 # Transpiled react source code
│   ├── src                  # Collections of React components or assets
│   │   ├── assets           # app assets
│   │   │   ├── img          # images
│   │   ├── components       # components of reactjs
│   │   │   ├── pages        # react components for routing
│   │   │   │   ├── ChatRoom.js    # react component ChatRoom Page
│   │   │   │   ├── Login.js       # react component Login Page
│   │   │   │   ├── NotFound.js    # react component NotFound Page
│   │   │   ├── App.js       # All Components imported here and Routes are defined
│   │   │   ├── Layout.js    # Layout will be used to generate index.html using webpack
│   │   ├── css              # contains all the style-sheets
│   │   │   └── styles.scss  # main style sheet
│   │   ├── index.js         # render app.js into html container with id #app
│   │   ├── index.html       # Main HTML page container for app
└── server                   # Application source code
    └── index.js             # Express application
├── webpack.config.js        # Webpack configuration                  

```

## Contributing

I am more than happy to accept contributions to the project. Contributions can be in the form of feedback, bug reports or even better - pull requests :)
