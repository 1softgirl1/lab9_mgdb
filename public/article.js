document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const articleId = urlParams.get('id');

    if (!articleId) {
        window.location.href = '/';
        return;
    }

    try {
        const response = await fetch(`/api/articles/full/${articleId}`);
        if (response.ok) {
            const article = await response.json();
            displayArticle(article);
        } else {
            throw new Error('Статья не найдена');
        }
    } catch (error) {
        console.error(error);
        alert('Ошибка при загрузке статьи');
        window.location.href = '/';
    }

    document.getElementById('backButton').addEventListener('click', () => {
        window.location.href = '/';
    });
});

function displayArticle(article) {
    document.getElementById('articleTitle').textContent = article.title;

    const authorsElement = document.getElementById('articleAuthors');
    authorsElement.innerHTML = `<strong>Авторы:</strong> ${article.authors.join(', ')}`;

    const tagsElement = document.getElementById('articleTags');
    // Проверяем, есть ли теги и извлекаем их значения
    let tagsText = 'Теги отсутствуют';
    if (article.tags && article.tags.length > 0) {
        // Если теги - это объекты с полем name (например, {name: "наука"})
        if (typeof article.tags[0] === 'object' && article.tags[0].name) {
            tagsText = article.tags.map(tag => tag.name).join(', ');
        }
        // Если теги - это просто строки
        else if (typeof article.tags[0] === 'string') {
            tagsText = article.tags.join(', ');
        }
    }
    tagsElement.innerHTML = `<strong>Теги:</strong> ${tagsText}`;


    const dateElement = document.getElementById('articleDate');
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    dateElement.innerHTML = `<strong>Дата публикации:</strong> ${new Date(article.publicationDate).toLocaleDateString('ru-RU', options)}`;


    const contentElement = document.getElementById('articleContent');
    contentElement.innerHTML = article.content || '<em>Содержание отсутствует</em>';

    const reviewsContainer = document.getElementById('reviewsContainer');
    if (article.reviews && article.reviews.length > 0) {
        article.reviews.forEach(review => {
            const reviewElement = document.createElement('div');
            reviewElement.className = 'review';
            reviewElement.innerHTML = `
                <div class="review-header">
                    <strong>${review.authorName}</strong>
                    <span>Оценка: ${review.rating}/10</span>
                </div>
                <div class="review-content">${review.text}</div>
            `;
            reviewsContainer.appendChild(reviewElement);
        });
    } else {
        reviewsContainer.innerHTML = '<p>Рецензии отсутствуют</p>';
    }
}

