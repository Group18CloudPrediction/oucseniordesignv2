import openSocket from 'socket.io-client';
import { url } from "./components/apiCallers/_apiRootAddress";

const API_URL = url;

const socket = openSocket(API_URL);

function subscribeToCoverage(cb) {
  socket.on('coverage', imagestr => cb(null, imagestr));
}

function subscribeToShadow(cb) {
  socket.on('shadow', imagestr => cb(null, imagestr));
}

export { subscribeToCoverage, subscribeToShadow, API_URL };
