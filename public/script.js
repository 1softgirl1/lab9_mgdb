const showArticlesBtn = document.getElementById("showArticlesBtn");
const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");
const searchAuthorBtn = document.getElementById("searchAuthorBtn");
const authorSelect = document.getElementById("authorSelect");
const articlesTableBody = document.getElementById("articlesTableBody");
const articlesContainer = document.getElementById("articlesContainer")

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

        articlesTableBody.appendChild(row);
        articlesContainer.style.display = "block";
    });
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

// Обработчики событий
showArticlesBtn.addEventListener("click", showArticles);
searchBtn.addEventListener("click", searchArticles);
searchAuthorBtn.addEventListener("click", searchByAuthor);
searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        searchArticles();
    }
});