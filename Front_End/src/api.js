import openSocket from 'socket.io-client';
import { url } from "./components/apiCallers/_apiRootAddress";

const API_URL = url;

let socket;

socket = openSocket(API_URL);


const latLongs = {
    "CENTER": [28.2367025, -81.23375],
    "sub28": [28.29172, -81.19373],
    "sub27": [28.24917, -81.28942],
    "sub29": [28.22465, -81.17819],
    "sub33": [28.18127, -81.27366],
    "sub38": [28.5027919, -81.0435609],
    "sub40": [28.1564629, -81.1078959]
}


function subscribeToCoverage(cb) {
  socket.on('coverage', imagestr => cb(null, imagestr));
}

function subscribeToShadow(cb) {
  socket.on('shadow', imagestr => cb(null, imagestr));
}

function subscribeToCoverageN(N, cb) {
  socket.on('coverage'+N, imagestr => cb(null, imagestr));
}

function subscribeToShadowN(N, cb) {
  socket.on('shadow'+N, imagestr => cb(null, imagestr));
}

export { latLongs, subscribeToCoverage, subscribeToShadow, subscribeToCoverageN, subscribeToShadowN, API_URL };
