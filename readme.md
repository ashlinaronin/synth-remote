*instructions*

1. make sure you have the latest versions of node and npm installed (info [here](https://nodejs.org/en/download/package-manager/))
2. run `npm install` in this folder to install dependencies
3. run `npm start` to run the app. this will run three processes in parallel (`node index.js`, which is running the server; `gulp`, which is running the frontend; and `ngrok http 4005`, which with the current settings will expose your localhost port 4005 to the web at a new randomized address each time it runs)
4. connect to the frontend at the address ngrok dumps out in the console. if the connection between the frontend and server isn't working, try running ngrok http 5000 in a new tab to expose the server to the web, then change the URL on the first line of src/js/app.js to the URL ngrok has bestowed upon you
5. if you're still having issues, send ashlin a message