# DroneManagementSystem
Managing a delivery systems done by drones

## Installation

Download the project and run 

```bash
$ npm install
```

## Install mongodb in your local environment

[How to install mongodb](https://www.mongodb.com/docs/manual/administration/install-community/).

## Replace mongo db connection string

In src/app.js file replace "mongodb://localhost:27017" part with your local mongodb connection string

```bash
$ const MONGODB_URI = "<Your MongoDB Connection String>/droneManagement";
```

## Run the application

In terminal run following command to start the application

```bash
$ npm start
```
