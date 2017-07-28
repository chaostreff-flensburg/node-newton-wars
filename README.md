# Newton wars

## Description
This project is a reimplementation of the small game **Newton wars**, which was originally written in C and is also open source. The reimplementation aims to open up the game more and offer APIs for different purposes. These APIs could then be used to program AI and / or bots for the user to fight against. It also allows multiple clients to connect from the same host and features a real-time API.

## Installation and usage
To install the program and its dependencies run: `npm install`  
To start the client and the server in development mode run: `npm start`  
To start the client in development mode run: `npm run dev:client`  
To start the server in development mode run: `npm run dev:server`  
To build the client production build run: `npm run build`  
To build the client and deploy the server and the client run: `npm run launch`  

**Note:** There might be a bug, where the browser displays a blank page in development mode. To resolve the problem, quit the script by pressing `CTRL + C`. Afterwards run `npm start` again. We are sorry for the inconvenience, but unfortunately we are not able to determine the cause of this particular problem. If you look at the commit history you might get an idea of how long we have been already trying to fix this bug. If you have a guess feel free to open an issue for this and share your wisdom with us!
