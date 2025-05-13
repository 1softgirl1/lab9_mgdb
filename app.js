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

// Маршрут для удаления статьи
app.delete("/api/articles/:id", async (req, res) => {
    const collection = req.app.locals.collection;
    try {
        const result = await collection.deleteOne({ _id: new objectId(req.params.id) });
        if (result.deletedCount === 1) {
            res.sendStatus(200);
        } else {
            res.sendStatus(404);
        }
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

// Маршрут для создания новой статьи
app.post("/api/articles", async (req, res) => {
    const collection = req.app.locals.collection;
    try {
        // Валидация данных
        if (!req.body.title || !req.body.authors || !req.body.publicationDate) {
            return res.status(400).send("Необходимо указать название, авторов и дату публикации");
        }

        const article = {
            title: req.body.title,
            authors: Array.isArray(req.body.authors) ? req.body.authors : [req.body.authors],
            content: req.body.content,
            tags: Array.isArray(req.body.tags) ? req.body.tags : [req.body.tags],
            publicationDate: new Date(req.body.publicationDate),

        };

        const result = await collection.insertOne(article);
        res.status(201).send({ id: result.insertedId });
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

// Маршрут для получения полной информации о статье
app.get("/api/articles/full/:id", async (req, res) => {
    const collection = req.app.locals.collection;
    try {
        const article = await collection.findOne({
            _id: new objectId(req.params.id)
        });

        if (article) {
            res.send(article);
        } else {
            res.sendStatus(404);
        }
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

// Маршрут для получения топ статей
app.get("/api/top-articles", async (req, res) => {
    const collection = req.app.locals.collection;
    try {
        const topArticles = await collection.aggregate([
            {
                $addFields: {
                    reviewCount: { $size: { $ifNull: ["$reviews", []] } },
                    averageRating: {
                        $avg: {
                            $map: {
                                input: { $ifNull: ["$reviews", []] },
                                as: "review",
                                in: "$$review.rating"
                            }
                        }
                    }
                }
            },
            {
                $sort: { averageRating: -1, reviewCount: -1 }
            },
            {
                $limit: 10 // Выводим только 10 лучших статей, можно изменить
            },
            {
                $project: {
                    title: 1,
                    authors: 1,
                    averageRating: 1,
                    reviewCount: 1
                }
            }
        ]).toArray();

        res.send(topArticles);
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

// Маршрут для поиска статей по диапазону дат
app.get("/api/articles/date-range", async (req, res) => {
    const collection = req.app.locals.collection;
    try {
        const { startDate, endDate } = req.query;

        // Проверяем, что даты переданы
        if (!startDate || !endDate) {
            return res.status(400).send("Необходимо указать дату начала и окончания");
        }

        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999); // Устанавливаем конец дня

        const articles = await collection.find({
            publicationDate: {
                $gte: start,
                $lte: end
            }
        }).project({
            title: 1,
            authors: 1,
            publicationDate: 1
        }).toArray();

        res.send(articles);
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});
