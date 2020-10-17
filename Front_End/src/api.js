import openSocket from 'socket.io-client';

const API_URL = 'http://cloud-track.herokuapp.com';
// const API_URL = 'http://localhost:3001/';

const  socket = openSocket(API_URL);

function subscribeToCoverage(cb) {
  socket.on('coverage', imagestr => cb(null, imagestr));
}

function subscribeToShadow(cb) {
  socket.on('shadow', imagestr => cb(null, imagestr));
}

function subscribeToData(cb) { 
    socket.on('data', data => cb(null, data))
}

export { subscribeToCoverage, subscribeToShadow, subscribeToData, API_URL };
