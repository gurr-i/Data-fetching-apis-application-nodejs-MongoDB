const Express = require("express");
const https = require("https");
const http = require("http");
const fs = require("fs");

const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
// dotenv.config({ path: '/path/to/.env' }); To specify path

const BodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
// const ObjectId = require("mongodb").ObjectID;

const un = process.env.DB_user_name;
const up = process.env.Mongo_db_Password;

const CONNECTION_URL =
  "mongodb+srv://" +
  un +
  ":" +
  up +
  "@cluster0.zn9oy.mongodb.net/?retryWrites=true&w=majority";
const DATABASE_NAME = "sample_weatherdata";

var app = Express();
app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));
// var database, collection;

// // Enable CORS for all routes
app.use(cors());

// gVuIGgnikpZpbs5l

// Redirect HTTP to HTTPS
// app.use((req, res, next) => {
//   if (req.headers["x-forwarded-proto"] !== "https") {
//     return res.redirect(`https://${req.headers.host}${req.url}`);
//   }
//   next();
// });

async function printCollections(db) {
  try {
    const collections = await db.listCollections().toArray();
    console.log(collections);
  } catch (error) {
    console.log(error);
  }
}

// To create and query data api
app.post("/post_data_api", async (request, response) => {
  try {
    const result = await collection.insert(request.body);
    response.send(result);
  } catch (error) {
    console.log(error);
    response.status(500).send(error);
  }
});

app.get("/", async (request, response) => {
  try {
    response.send("Server Running!");
  } catch (error) {
    return response.status(500).send(error);
  }
});

app.get("/get_data_api", async (request, response) => {
  try {
    const result = collection.find({}).toArray();

    // console.log(array_result);
    // console.log(result);

    // Using Promise because respose is Big
    const promise = new Promise((resolve, reject) => {
      resolve(result);
    });

    promise.then((res) => {
      console.log(JSON.stringify(res)); // {"name":"John","age":30}
      response.send(JSON.stringify(res));
    });
  } catch (error) {
    return response.status(500).send(error);
  }
});

app.get("/get_data_api_byid/:item", async (request, response) => {
  try {
    const result = await collection.findOne({ st: request.params.item });
    // const array_result = Array.from(Object.entries(result));
    const array_result = Object.values(result);
    console.log(result);
    response.send(array_result);

    // Using Promise because respose is Big
    // const promise = new Promise((resolve, reject) => {
    //   resolve(result);
    // });

    // promise.then((res) => {
    //   console.log(res);
    //   response.send(res);
    //   // console.log(res);
    // });
    // promise.catch((err) => {
    //   console.log("promise not resolved!");
    // });
  } catch (error) {
    console.log("try block failed!");
    return response.status(500).send(error);
  }
});

// Creating http server using Express js

// app.listen(process.env.PORT, () => {
//   MongoClient.connect(
//     CONNECTION_URL,
//     { useNewUrlParser: true },
//     (error, client) => {
//       if (error) {
//         throw error;
//       }
//       database = client.db(DATABASE_NAME);
//       collection = database.collection("data");
//       printCollections(database);
//       console.log(
//         "HTTP server Connected to PORT " +
//           process.env.PORT +
//           " : '" +
//           DATABASE_NAME +
//           "' MongoDB!"
//       );
//     }
//   );
// });

// Load the SSL certificate and key
const privateKey = fs.readFileSync("server.key");
const certificate = fs.readFileSync("server.cert");
// set up a config object
var server_config = {
  key: privateKey,
  cert: certificate,
};

// create the HTTPS server on port 443
var https_server = https
  .createServer(server_config, app)
  .listen(8000, function (err) {
    console.log("Node.js Express HTTPS Server Listening on Port 8000");
  });

// create an HTTP server on port 5000 and redirect to HTTPS
var http_server = http
  .createServer(async function (req, res) {
    // 301 redirect (reclassifies google listings)
    try {
      MongoClient.connect(
        CONNECTION_URL,
        { useNewUrlParser: true },
        (error, client) => {
          if (error) {
            throw error;
          }
          database = client.db(DATABASE_NAME);
          collection = database.collection("data");
          printCollections(database);
          console.log(
            "HTTP server Connected to PORT " +
              process.env.PORT +
              " : '" +
              DATABASE_NAME +
              "' MongoDB!"
          );
        }
      );
    } catch (error) {
      console.log(error, "Error in connecting MONGODB!");
    }

    res.writeHead(301, {
      Location: "https://" + req.headers["host"] + req.url,
    });
    res.end("ok");
  })
  .listen(process.env.PORT, function (err) {
    console.log(
      "Node.js Express HTTP Server Listening on Port " + process.env.PORT
    );
  });
