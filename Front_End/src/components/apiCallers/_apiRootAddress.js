//
// Contains the url that the front end will use
// to access the backend api. Should be the 
// root address of the website, may need the port number
// eg: "http://localhost:3000"
//
// the heroku variable was used to determine whether 
// to use UTC or EST, but I don't belive we need to 
// make the destinction anymore.
//

var url = "http://localhost:3000";//"https://cloudtracking-v2.herokuapp.com";
var heroku = true;

export { url , heroku };
