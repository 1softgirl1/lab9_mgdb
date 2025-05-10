const mongoose = require('mongoose');
const Article = require('./Article');

// Подключение к MongoDB
mongoose.connect('mongodb://localhost:27017/scientific_journal', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Connection error:', err));

// Функция для очистки и заполнения базы данных
async function seedDatabase() {
    try {
        // Удаление всех документов из коллекции
        await Article.deleteMany({});
        console.log('Все коллекции очищены');

        const articles = [
            {
                title: "Новые методы в машинном обучении",
                authors: ["Иван Петров", "Мария Сидорова"],
                content: "В этой статье рассматриваются инновационные подходы к обучению нейронных сетей...",
                tags: [{name: "AI"}, {name: "машинное обучение"}],
                reviews: [
                    {
                        authorName: "Алексей К.",
                        text: "Отличный обзор современных методов",
                        rating: 9
                    },
                    {
                        authorName: "Дарья М.",
                        text: "Не хватает практических примеров",
                        rating: 7
                    }
                ]
            },
            {
                title: "Квантовые вычисления: современное состояние",
                authors: ["Сергей Волков"],
                content: "Обзор последних достижений в области квантовых компьютеров...",
                tags: [{name: "квантовые вычисления"}],
                reviews: [
                    {
                        authorName: "Олег Н.",
                        text: "Очень сложно для понимания",
                        rating: 6
                    }
                ]
            },
            {
                title: "Блокчейн в научных исследованиях",
                authors: ["Анна Белова", "Дмитрий Чернов", "Елена Смирнова"],
                content: "Применение технологии блокчейн для верификации научных данных...",
                tags: [{name: "блокчейн"}, {name: "наука"}],
                reviews: [
                    {
                        authorName: "Павел Р.",
                        text: "Интересное применение технологии",
                        rating: 8
                    }
                ]
            },
            {
                title: "Биоинформатика и анализ геномных данных",
                authors: ["Александра Генетикова"],
                content: "Современные методы анализа больших геномных данных...",
                tags: [{name: "биоинформатика"}, {name: "генетика"}],
                reviews: [
                    {
                        authorName: "Михаил Б.",
                        text: "Отличный научный обзор",
                        rating: 10
                    },
                    {
                        authorName: "Татьяна Л.",
                        text: "Хотелось бы больше примеров кода",
                        rating: 8
                    }
                ]
            },
            {
                title: "Этика искусственного интеллекта",
                authors: ["Евгений Моралов", "Лидия Этикова"],
                content: "Философские и этические вопросы разработки ИИ...",
                tags: [{name: "AI"}],
                reviews: [
                    {
                        authorName: "Николай Ф.",
                        text: "Важная тема, хорошее освещение",
                        rating: 9
                    }
                ]
            },
            {
                title: "Анализ возможностей искусственного интеллекта",
                authors: ["Алексей Статистиков", "Ольга Алгоритмова"],
                content: "Современные методы анализа данных и их применение в ИИ...",
                tags: [{name: "AI"}, {name: "аналитика"}],
                reviews: [
                    {
                        authorName: "Иван К.",
                        text: "Отличный разбор технологий машинного обучения",
                        rating: 8
                    }
                ]
            },
            {
                title: "Социальный интеллект машин: анализ взаимодействия",
                authors: ["Мария Роботова", "Артем Коммуникаторов"],
                content: "Как ИИ воспринимает человеческие эмоции и адаптируется к ним...",
                tags: [{name: "AI"}, {name: "психология"}],
                reviews: [
                    {
                        authorName: "Анна С.",
                        text: "Интересный взгляд на проблему, но не хватает примеров",
                        rating: 7
                    }
                ]
            }
        ];

        const savedArticles = await Article.insertMany(articles);
        console.log(`Добавлено ${savedArticles.length} статей`);
    } catch (error) {
        console.error('Ошибка при заполнении базы данных:', error);
    } finally {
        await mongoose.connection.close();
    }
}

// Запуск функции заполнения
seedDatabase().catch(console.error);
