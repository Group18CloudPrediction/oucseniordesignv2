

### How to run:

If working with purely web user interface type `npm start` in /Front_End to view any changes. To view type `localhost:3001` in web browser. <br/>
If working with api and web user interface first go to /Front_End and type `npm run build` then in the main directory type `npm start`. To view type `localhost:3000` in web browser.

### Resources

Code overview and quick reference: CodeQuickReferenceGuide.html
Installation: InstallationAndUserGuide.html

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
