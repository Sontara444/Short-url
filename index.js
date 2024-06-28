const express = require("express");
const path = require("path")
const cookieParser = require("cookie-parser")
const {restrictToLoggedInUserOnly, checkAuth} = require("./middlewares/auth")


const { connectToMongoDB } = require("./connect");
const URL = require("./models/url");

const urlRoute = require("./routes/url");
const staticRoute = require('./routes/staticRouter')
const userRoute = require("./routes/user")

const app = express();
const PORT = 4000;

connectToMongoDB("mongodb://127.0.0.1/shortUrl")
  .then(() => console.log("MongoDb Connected !"))
  .catch((error) => console.log("MongoDb Error", error));


//middlewares
app.use(express.json());
app.use(express.urlencoded({extended: false}))
app.use(cookieParser())

//Js engine
app.set('view engine','ejs');
app.set("views", path.resolve('./views'))


//Routes
app.use("/url", restrictToLoggedInUserOnly, urlRoute);
app.use("/user", userRoute);
app.use("/", checkAuth, staticRoute);


app.get("/url/:shortId", async (req, res) => {
  const shortId = req.params.shortId;
  const entry = await URL.findOneAndUpdate(
    {
      shortId,
    },
    {
      $push: {
        visitHistory: {
          timestamp: Date.now(),
        }
      }
    }
  );

  res.redirect(entry.redirectURL);
});

app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
