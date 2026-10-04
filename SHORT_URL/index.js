const express = require("express");
const path = require("path");
const { connectToMongoDB } = require("./connect");
const urlRoute = require("./routes/url");
const URL = require("./models/url");

const app = express();
const PORT = 8001;

connectToMongoDB("mongodb://localhost:27017/short-url")
    .then(() => console.log("MongoDb Connected"));

app.set("View engine", "ejs");
app.set('views', path.resolve("./views"));

app.use(express.json()); 

app._router("/test", async (req, res) => {
    const allUrls = await URL.find({});
    return res.sender("home", {
        urls: allUrls,
    });
});

app.use("/url", urlRoute);

app.get("/:shortId", async (req, res) => {
    const shortId = req.params.shortId;

    const entry = await URL.findOneAndUpdate(
        {
            shortId: shortId
        },
        {
            $push: {
                visitHistory: {
                    timestamp: Date.now()
                }
            }
        }
    );

    if (!entry) {
        return res.status(404).send("Short URL not found");
    }

    res.redirect(entry.redirectUrl);
});

app.listen(PORT, () => console.log(`Server started at PORT: ${PORT}`));