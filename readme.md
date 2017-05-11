*instructions*
 
* make sure you have the latest versions of node and npm installed (info [here](https://nodejs.org/en/download/package-manager/))

* install gulp globally (`npm install gulp`)
* install ngrok globally (`npm install ngrok`)
* if you get an error from npm about installing phantomjs (I did on Raspbian), try following [these instructions](https://www.bitpi.co/2015/02/10/installing-phantomjs-on-the-raspberry-pi/) to install phantomjs globally
* run `npm install` in this folder to install dependencies
* run `npm start` to run the app. this will run three processes in parallel (`node index.js`, which is running the server; `gulp`, which is running the frontend; and `ngrok http 4005`, which with the current settings will expose your localhost port 4005 to the web at a new randomized address each time it runs)
* connect to the frontend at the address ngrok dumps out in the console
* if you're still having issues, send ashlin a message
 

*if using a yarns MIDI-CV interface*
* make sure that layout is on 4M
* set the parts to the correct midi channels (parts 1-4 corresponding to midi channels 1-4)--

* go to Part, select 1, and exit the menu
* go to Channel, select 1, and exit the menu
* go to Part, select 2, and exit the menu
* go to Channel, select 2, and exit the menu
* repeat for parts 3 and 4
