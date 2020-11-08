const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const port = process.env.PORT || 4001;
const index = require("./routes/index");

const browserObject = require('./utils/browser');
const scraperController = require('./utils/pageController');

const app = express();

app.use(index);

const socketServer = http.createServer(app);

const io = socketIo(socketServer);

io.on("connection", (socket) => {
    console.log("New client connected");

    socket.on('from_client', url => {

        try {
            const scrape = new Promise((resolve, reject) => {
                //Start the browser and create a browser instance
                let browserInstance = browserObject.startBrowser();
                // Pass the browser instance to the scraper controller
                resolve(scraperController(browserInstance, url))
            })

            scrape.then(function (data) {
                console.log("emitting data...")
                //emit scraped data
                socket.emit("from_server", data);
            })
        } catch (error) {
            console.error(error)
        }

    });
    socket.on("disconnect", () => {
        console.log("Client disconnected");
    });
})

socketServer.listen(port, () => console.log(`Socket Server listening on: ${port}`));




