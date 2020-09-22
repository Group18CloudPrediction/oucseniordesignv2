This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `npm run build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify

# OUCSeniorDesignv2
This was created as an empty repository for Cloud Tracking Senior Design group project.  Please comment and document responsibly before adding.

Initial Commit (no express yet) displays an html of a google map onto localhost:8000

## 7/14 Commit:

Adds express framework.

## 7/21 Commit:

Added Navbar and moved Map code to javascript file

## 7/23 Commit:

Migrated from Jade to Pug. (essentially the same thing)

## 7/24 Commit:

Cleaned up index.pug and moved navbar to layout.pug

## 8/6 Commit:

Add files for livestream testing

## 8/7 Commit:

Add required node modules for livestream

## 8/8 - 8/10 Commit:

Add player to livestream page with sample video

## 8/11 - 8/14 Commit:

Begun working with React for front end and express for back end. To run react and express at the same time

## 8/15 Commit:

Made Adjustments to div placement on app. Added Player to livestream page.

## 8/24 Commit:

Added code for setting foundation of API calls.

### How to run:

If working with purely web user interface type `npm start` in /Front_End to view any changes. To view type `localhost:3001` in web browser. <br/>
If working with api and web user interface first go to /Front_End and type `npm run build` then in the main directory type `npm start`. To view type `localhost:3000` in web browser.


### How to set up MongoDB backend and frontend connections
# Connect the backend
1. In the root directory of the project, create a folder called "credentials"
2. In ~/credentials, create a file called "mongodbCredentials.js"
3. In that file, paste the following line, replacing the {} with the appropriate value:
    `module.exports = "{mongoDB connection URL with login credentials and db name}";`
4. If no MongoDB exists, you must create one

# Connect the frontend to the backend
1. In ~//Front_End/src/components/apiCallers, find "_apiRootAddress.js"
2. In this file, you'll find the following line:
    `module.exports = "http://localhost:3000";`
3. Replace "http://localhost:3000" with the URL of your backend host
