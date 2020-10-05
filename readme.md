# Avalon Web Application

## Repository Note
This repository was moved from an old one that contained solutions to assignment code in a course we did. To avoid any future drama with cheating and academic integrity, I deleted the old repository and kept around this project. This effectively deletes the commit history of this repository, unfortunately.

## Getting Started
Here's everthing you need to know to set up the program so that you can play a game of Avalon!

### Prerequisites
Node.js must be installed. Also please have a web browser that isnt Edge/IE.

### Installing
* Download the source code.

* Run `npm install` from the root of the project directory.

* That's it! Assuming no errors, you should be all set to go!

## Running a Local Development Server
* From the main directory of the project, run `npm start` in the terminal.

* In your web browser of choice, navigate to (http://localhost:3000/). Since the server is running on your own PC, it is likely that you are not playing with other people. To remedy this, open the app in multiple tabs, so that you may pose as multiple different players and test the code that way.

## Running a Production Server
* From the main directory of the project, run `npm run build` in the terminal. This tells WebPack to compile the code.

* After the project is done building, run `npm run production`. This starts the production server on (http://localhost:3000/).

## Port Forwarding
If you want to take the code base and host your own server, here is a quick guide on the ports we are using:

* Port 8080 is used for the client production server.

* Port 3000 is used for the development server. Do not make that public unless you are absolutely sure you want to open a WebPack development server.

* Port 4001 is used for the Socket.IO server. The current configuration requires that port to be forwarded too.
