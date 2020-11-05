import openSocket from 'socket.io-client';
import { url } from "./components/apiCallers/_apiRootAddress";

const API_URL = url;

let socket;

socket = openSocket(API_URL);

function initializeSubstation(substation) {
  if (socket && substation) socket.emit('substation', substation);
}

function subscribeToCoverage(cb) {
  socket.on('coverage', imagestr => cb(null, imagestr));
}

function subscribeToShadow(cb) {
  socket.on('shadow', imagestr => cb(null, imagestr));
}

export { initializeSubstation, subscribeToCoverage, subscribeToShadow, API_URL };
