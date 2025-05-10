const express = require("express");
const MongoClient = require("mongodb").MongoClient;
const objectId = require("mongodb").ObjectId;

const app = express();
app.use(express.static("public"));
app.use(express.json());

const mongoClient = new MongoClient("mongodb://127.0.0.1:27017/");

(async () => {
    try {
        await mongoClient.connect();
        app.locals.collection = mongoClient.db("scientific_journal").collection("articles");
        app.listen(3000, () => console.log("Сервер ожидает подключения на http://localhost:3000"));
    } catch (err) {
        return console.log(err);
    }
})();

// Маршрут для получения списка статей
app.get("/api/articles", async (req, res) => {
    const collection = req.app.locals.collection;
    try {
        const query = {};
        if (req.query.title) {
            query.title = { $regex: req.query.title, $options: "i" };
        }
        if (req.query.author) {
            query.authors = req.query.author;
        }
        const articles = await collection.find(query).toArray();
        res.send(articles);
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

// Маршрут для получения списка всех авторов
app.get("/api/authors", async (req, res) => {
    const collection = req.app.locals.collection;
    try {
        const authors = await collection.distinct("authors");
        res.send(authors);
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});
