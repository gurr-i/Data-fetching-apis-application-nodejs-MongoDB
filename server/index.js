const Express = require("express");
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
var database, collection;

// Enable CORS for all routes
app.use(cors());

// gVuIGgnikpZpbs5l

function printCollections(db) {
  db.listCollections().toArray(function (error, collections) {
    if (error) {
      console.log(error);
      return;
    }

    console.log(collections);
  });
}

// To create and query data api
app.post("/post_data_api", (request, response) => {
  collection.insert(request.body, (error, result) => {
    if (error) {
      return response.status(500).send(error);
    }
    response.send(result.result);
  });
});

app.get("/get_data_api", (request, response) => {
  collection.find({}).toArray((error, result) => {
    if (error) {
      return response.status(500).send(error);
    }
    response.send(result);
  });
});

// Get data by unique specific parameter
app.get("/get_data_api_byid/:item", (request, response) => {
  collection.findOne({ st: request.params.item }, (error, result) => {
    if (error) {
      return response.status(500).send(error);
    } else {
      console.log(result);
      response.send(result);
    }
  });
});

app.listen(process.env.PORT, () => {
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
      console.log("Connected to `" + DATABASE_NAME + "` MongoDB!");
    }
  );
});
