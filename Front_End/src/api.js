import openSocket from 'socket.io-client';

// const API_URL = 'https://cloudtracking-v2.herokuapp.com';
const API_URL = 'http://localhost:3000/';

const  socket = openSocket(API_URL);

function subscribeToCoverage(cb) {
  socket.on('coverage', imagestr => cb(null, imagestr));
}

function subscribeToShadow(cb) {
  socket.on('shadow', imagestr => cb(null, imagestr));
}

export { subscribeToCoverage, subscribeToShadow, API_URL };
