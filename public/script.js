const showArticlesBtn = document.getElementById("showArticlesBtn");
const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");
const searchAuthorBtn = document.getElementById("searchAuthorBtn");
const authorSelect = document.getElementById("authorSelect");
const articlesTableBody = document.getElementById("articlesTableBody");
const articlesContainer = document.getElementById("articlesContainer");
const createArticleBtn = document.getElementById("createArticleBtn");

// Загрузка списка авторов при загрузке страницы
document.addEventListener("DOMContentLoaded", loadAuthors);

// Функция для форматирования даты
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('ru-RU', options);
}

// Функция для отображения статей
function displayArticles(articles) {
    articlesTableBody.innerHTML = '';
    const container = document.getElementById("topArticlesContainer");
    articles.forEach((article, index) => {
        const row = document.createElement("tr");

        // Номер
        const numberCell = document.createElement("td");
        numberCell.textContent = index + 1;
        row.appendChild(numberCell);

        // Название
        const titleCell = document.createElement("td");
        titleCell.textContent = article.title;
        row.appendChild(titleCell);

        // Авторы
        const authorsCell = document.createElement("td");
        const authorsList = document.createElement("ul");
        authorsList.className = "authors-list";

        article.authors.forEach(author => {
            const authorItem = document.createElement("li");
            authorItem.textContent = author;
            authorsList.appendChild(authorItem);
        });

        authorsCell.appendChild(authorsList);
        row.appendChild(authorsCell);

        // Дата публикации
        const dateCell = document.createElement("td");
        dateCell.className = "date";
        dateCell.textContent = formatDate(article.publicationDate);
        row.appendChild(dateCell);

        // Действия
        const actionsCell = document.createElement("td");
        actionsCell.className = "actions-cell";

        // Кнопка создания подобной статьи
        const createBtn = document.createElement("button");
        createBtn.className = "action-btn create-btn";
        createBtn.innerHTML = "➕";
        createBtn.title = "Создать подобную статью";
        createBtn.addEventListener("click", createNewArticle);
        actionsCell.appendChild(createBtn);

        // Кнопка удаления
        const deleteBtn = document.createElement("button");
        deleteBtn.className = "action-btn delete-btn";
        deleteBtn.innerHTML = "🗑️";
        deleteBtn.title = "Удалить";
        deleteBtn.addEventListener("click", () => deleteArticle(article._id));
        actionsCell.appendChild(deleteBtn);

        // Кнопка просмотра
        const viewBtn = document.createElement('button');
        viewBtn.className = 'action-btn view-btn';
        viewBtn.innerHTML = '👁️';
        viewBtn.title = 'Просмотреть статью';
        viewBtn.addEventListener('click', () => {
            window.location.href = `/article.html?id=${article._id}`;
        });
        actionsCell.appendChild(viewBtn);

        row.appendChild(actionsCell);
        articlesTableBody.appendChild(row);
    });
    articlesContainer.style.display = "block";
    container.style.display = "none";
}

// Функция для загрузки списка авторов
async function loadAuthors() {
    try {
        const response = await fetch("/api/authors", {
            method: "GET",
            headers: { "Accept": "application/json" }
        });

        if (response.ok) {
            const authors = await response.json();
            authors.forEach(author => {
                const option = document.createElement("option");
                option.value = author;
                option.textContent = author;
                authorSelect.appendChild(option);
            });
        } else {
            console.error("Ошибка при загрузке авторов");
        }
    } catch (error) {
        console.error("Ошибка:", error);
    }
}
// Функция для удаления статьи
async function deleteArticle(id) {
    if (confirm("Вы уверены, что хотите удалить эту статью?")) {
        try {
            const response = await fetch(`/api/articles/${id}`, {
                method: "DELETE",
                headers: { "Accept": "application/json" }
            });

            if (response.ok) {
                await showArticles();
            } else {
                console.error("Ошибка при удалении статьи");
            }
        } catch (error) {
            console.error("Ошибка:", error);
        }
    }
}
// Функция для получения всех статей
async function showArticles() {
    try {
        const response = await fetch("/api/articles", {
            method: "GET",
            headers: { "Accept": "application/json" }
        });

        if (response.ok) {
            const articles = await response.json();
            displayArticles(articles);
        } else {
            console.error("Ошибка при загрузке статей");
        }
    } catch (error) {
        console.error("Ошибка:", error);
    }
}

// Функция для поиска статей по названию
async function searchArticles() {
    const searchText = searchInput.value.trim();
    if (!searchText) {
        showArticles();
        return;
    }

    try {
        const response = await fetch(`/api/articles?title=${encodeURIComponent(searchText)}`, {
            method: "GET",
            headers: { "Accept": "application/json" }
        });

        if (response.ok) {
            const articles = await response.json();
            displayArticles(articles);
        } else {
            console.error("Ошибка при поиске статей");
        }
    } catch (error) {
        console.error("Ошибка:", error);
    }
}

// Функция для поиска статей по автору
async function searchByAuthor() {
    const selectedAuthor = authorSelect.value;
    if (!selectedAuthor) {
        await showArticles();
        return;
    }

    try {
        const response = await fetch(`/api/articles?author=${encodeURIComponent(selectedAuthor)}`, {
            method: "GET",
            headers: { "Accept": "application/json" }
        });

        if (response.ok) {
            const articles = await response.json();
            displayArticles(articles);
        } else {
            console.error("Ошибка при поиске статей по автору");
        }
    } catch (error) {
        console.error("Ошибка:", error);
    }
}



// Функция для создания новой статьи (полностью с нуля)
async function createNewArticle() {
    // Создаем модальное окно для ввода данных
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>Создать новую статью</h3>
            <div class="form-group">
                <label for="newTitle">Название статьи:</label>
                <input type="text" id="newTitle" required>
            </div>
            <div class="form-group">
                <label for="newAuthors">Авторы (через запятую):</label>
                <input type="text" id="newAuthors" required>
            </div>
            <div class="form-group">
                <label for="newTags">Теги (через запятую):</label>
                <input type="text" id="newTags" required>
            </div>
            <div class="form-group">
                <label for="newContent">Содержимое:</label>
                <textarea id="newContent" required> </textarea>
            </div>
            <div class="form-group">
                <label for="newDate">Дата публикации:</label>
                <input type="date" id="newDate" required>
            </div>
            <div class="modal-buttons">
                <button id="cancelCreate" class="btn cancel-btn">Отмена</button>
                <button id="submitCreate" class="btn submit-btn">Создать</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Обработчики для модального окна
    const cancelBtn = modal.querySelector('#cancelCreate');
    cancelBtn.addEventListener('click', () => {
        document.body.removeChild(modal);
    });

    const submitBtn = modal.querySelector('#submitCreate');
    submitBtn.addEventListener('click', async () => {
        const title = modal.querySelector('#newTitle').value.trim();
        const authorsInput = modal.querySelector('#newAuthors').value.trim();
        const content = modal.querySelector('#newContent').value.trim();
        const tagsInput = modal.querySelector('#newTags').value.trim();
        const date = modal.querySelector('#newDate').value;

        if (!title || !authorsInput || !date) {
            alert('Все поля обязательны для заполнения!');
            return;
        }

        const authors = authorsInput.split(',').map(author => author.trim());
        const tags = tagsInput.split(',').map(tag =>tag.trim());

        try {
            const response = await fetch("/api/articles", {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    title,
                    authors,
                    content,
                    tags,
                    publicationDate: new Date(date).toISOString()
                })
            });

            if (response.ok) {
                document.body.removeChild(modal);
                await showArticles();
                alert("Новая статья успешно создана!");
            } else {
                alert("Ошибка при создании статьи");
            }
        } catch (error) {
            console.error("Ошибка:", error);
            alert("Произошла ошибка при создании статьи");
        }
    });

    // Устанавливаем текущую дату по умолчанию
    modal.querySelector('#newDate').valueAsDate = new Date();
}

document.getElementById("topArticlesButton").addEventListener("click", async () => {
    try {
        const response = await fetch("/api/top-articles");
        if (response.ok) {
            const topArticles = await response.json();
            displayTopArticles(topArticles);
        } else {
            alert("Ошибка при загрузке топ статей");
        }
    } catch (error) {
        console.error(error);
        alert("Ошибка при загрузке топ статей");
    }
});

function displayTopArticles(articles) {
    const container = document.getElementById("topArticlesContainer");
    container.innerHTML = "";

    if (articles.length === 0) {
        container.innerHTML = "<p>Нет статей для отображения</p>";
        return;
    }

    articles.forEach(article => {
        const articleElement = document.createElement("div");
        articleElement.className = "top-article";
        articleElement.innerHTML = `
            <h3>${article.title}</h3>
            <p><strong>Авторы:</strong> ${article.authors.join(", ")}</p>
            <p><strong>Средний рейтинг:</strong> ${article.averageRating ? article.averageRating.toFixed(1) : "Нет оценок"}</p>
            <p><strong>Количество комментариев:</strong> ${article.reviewCount}</p>
        `;
        container.appendChild(articleElement);
    });
    container.style.display = "block";
    articlesContainer.style.display = "none";
}
// Функция для получения всех статей
async function searchByDate() {
    const startDate = document.getElementById("startDate").value;
    const endDate = document.getElementById("endDate").value;

    if (!startDate || !endDate) {
        alert("Пожалуйста, выберите обе даты.");
        return;
    }

    try {
        const response = await fetch(`/api/articles/date-range?startDate=${startDate}&endDate=${endDate}`, {
            method: "GET",
            headers: { "Accept": "application/json" }
        });

        if (response.ok) {
            const articles = await response.json();
            displayArticles(articles);

        } else {
            console.error("Ошибка при загрузке статей");
        }
    } catch (error) {
        console.error("Ошибка:", error);
    }
}

// Обработчики событий
showArticlesBtn.addEventListener("click", showArticles);
searchBtn.addEventListener("click", searchArticles);
searchAuthorBtn.addEventListener("click", searchByAuthor);
document.getElementById("searchByDateButton").addEventListener("click", searchByDate)
createArticleBtn.addEventListener("click", createNewArticle);
searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        searchArticles();
    }
});

