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

function subscribeToCoverage27(cb) {
  socket.on('coverage27', imagestr => cb(null, imagestr));
}

function subscribeToShadow27(cb) {
  socket.on('shadow27', imagestr => cb(null, imagestr));
}

function subscribeToCoverage28(cb) {
  socket.on('coverage28', imagestr => cb(null, imagestr));
}

function subscribeToShadow28(cb) {
  socket.on('shadow28', imagestr => cb(null, imagestr));
}

function subscribeToCoverage29(cb) {
  socket.on('coverage29', imagestr => cb(null, imagestr));
}

function subscribeToShadow29(cb) {
  socket.on('shadow29', imagestr => cb(null, imagestr));
}

function subscribeToCoverage33(cb) {
  socket.on('coverage33', imagestr => cb(null, imagestr));
}

function subscribeToShadow33(cb) {
  socket.on('shadow33', imagestr => cb(null, imagestr));
}

export { subscribeToCoverage, subscribeToShadow, subscribeToCoverage27, subscribeToShadow27, subscribeToCoverage28, subscribeToShadow28, subscribeToCoverage29, subscribeToShadow29, subscribeToCoverage33, subscribeToShadow33, API_URL };
