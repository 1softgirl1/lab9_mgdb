const mongoose = require('mongoose');

// Удаляем только существующую модель, чтобы избежать ошибки при многократной загрузке.
if (mongoose.models.Article) {
    delete mongoose.models.Article;
}

const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Название статьи обязательно'],
        trim: true
    },
    authors: {
        type: [String],
        required: [true, 'У статьи должен быть хотя бы один автор'],
        validate: {
            validator: function(authors) {
                return authors.length > 0;
            },
            message: 'Укажите хотя бы одного автора'
        },
        set: function(authors) {
            return typeof authors === 'string' ? [authors] : authors;
        }
    },
    publicationDate: {
        type: Date,
        default: Date.now
    },
    content: {
        type: String,
        required: [true, 'Текст статьи обязателен']
    },
    tags: {
        type: [{
            name: {
                type: String,
                required: true
            },
            _id: false
        }],
        default: []
    },
    reviews: {
        type: [{
            authorName: {
                type: String,
                required: true
            },
            text: {
                type: String,
                required: true
            },
            rating: {
                type: Number,
                min: 1,
                max: 10,
                required: true
            },
            _id: false
        }],
        default: []
    }
});

module.exports = mongoose.model('Article', articleSchema);
