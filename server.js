const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const port = process.env.PORT || 4001;
const index = require("./routes/index");

const browserObject = require('./utils/browser');
const scraperController = require('./utils/pageController');

const app = express();
// app.use(index);

const server = express()
    .use(index)
    .listen(port, () => console.log(`Listening on ${port}`));

// const socketServer = http.createServer(app);

const io = socketIo(server);

io.on("connection", (socket) => {
    console.log("New client connected");

    socket.on('from_client', url => {
        console.log("from_client", url)
        const scrape = new Promise((resolve, reject) => {
            //Start the browser and create a browser instance
            let browserInstance = browserObject.startBrowser();
            // Pass the browser instance to the scraper controller
            resolve(scraperController(browserInstance, url))
        })

        scrape.then(function (data) {
            //emit scraped data
            socket.emit("from_server", data);
        })

    });
    socket.on("disconnect", () => {
        console.log("Client disconnected");
    });
})

// socketServer.listen(port, () => console.log(`Socket Server listening on: ${port}`));

/* Create HTTP server for node application */
// const server = http.createServer(app)

/* Node application will be running on 4000 port */
// server.listen(4000);



