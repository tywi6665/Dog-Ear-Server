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

const defaultData = data = {
    title: "",
    imgSrc: "",
    author: "",
    description: "",
    tags: []
}

io.on("connection", (socket) => {
    console.log("New client connected");

    socket.on('from_client', url => {


        const scrape = new Promise((resolve, reject) => {

            try {
                //Start the browser and create a browser instance
                let browserInstance = browserObject.startBrowser();
                // Pass the browser instance to the scraper controller
                if (browserInstance) {
                    resolve(scraperController(browserInstance, url))
                } else {
                    reject(socket.emit("from_server", defaultData))
                }
            } catch (error) {
                console.error(error)
            }
        })

        scrape.then(function (data) {
            console.log("emitting data...")
            //emit scraped data
            socket.emit("from_server", data);
        })

    });
    socket.on("disconnect", () => {
        console.log("Client disconnected");
    });
})

socketServer.listen(port, () => console.log(`Socket Server listening on: ${port}`));




