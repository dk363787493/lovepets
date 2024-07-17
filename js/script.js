//loadContent('home.html', homeLink, 20, 1, "", "",true);
export function loadContent(url, link, limit, page, category_level_one, category_level_two, pushState) {
    setActiveLink(link);
    let theme = ""
    let level_one = ""
    let level_two = ""
    let sub_theme = 0
    if (url === "index.html") {
        theme = "homeArticles"
    } else if (url === "health_care.html") {
        theme = "healthCareArticles"
        level_one = category_level_one
        level_two = category_level_two
        attachToggleHandlers(theme);
    } else if (url === "adopt.html") {
        theme = "adoptArticles"
        level_one = category_level_one
        level_two = category_level_two
        attachToggleHandlers(theme);
    } else if (url === "browse.html") {
        themesHandler();
        fetchSubThemes(category_level_two);
        initialBrowseFilter();
        addDropdownHandlers();
        fileterButtonHandler();
    }
    if (url !== "browse.html") {
        fetchArticles(theme, limit, page, level_one, level_two, sub_theme)
    }

    if (pushState) {
        history.pushState({url, limit, page, category_level_one, category_level_two}, '', url);
    }
}


export function setActiveLink(link) {
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(navLink => navLink.classList.remove('active'));
    link.classList.add('active');
}

export function fetchArticles(theme, limit, page, category_level_one, category_level_two, sub_theme) {
    let url = `http://localhost:8081/article?is_short=1&limit=${limit}&page=${page}&sub_theme=${sub_theme}`;
    if (category_level_one != "") {
        url = `${url}&category_level_one=${category_level_one}&category_level_two=${category_level_two}`;
    }
    if (limit == 0) {
        limit = 1
    }
    if (page == 0) {
        page = 5
    }
    fetch(url)
        .then(response => response.json())
        .then(articles => {
            const articlesDiv = document.getElementById(theme);
            articlesDiv.innerHTML = ''; // Clear old content
            articles.data.forEach(article => {
                const articleElement = document.createElement('article');
                articleElement.classList.add('article'); // Add class for styling
                articleElement.innerHTML = `
                        <div class="content">
                            <h3>
                                <a href="http://localhost:8081/article/${article.id}" class="article-link" data-id="${article.id}">${article.title}</a>
                            </h3>
                            <p>${article.description}</p>
                        </div>
                        <a href="http://localhost:8081/article/${article.id}" class="article-link" data-id="${article.id}">
                            <img src="${article.cover_path}" alt="${article.title}">
                        </a>
                    `;
                articlesDiv.appendChild(articleElement);
            });
            attachArticleClickHandlers(theme); // Attach click handlers to article links
            if (theme !== "homeArticles") {
                generatePagination(theme, articles.totalCnt, limit, page, category_level_one, category_level_two,sub_theme);
            }
        })
        .catch(err => console.error(err));
}


export function fetchArticleContent(theme, articleId) {
    let articleContent
    if (theme == "homeArticles") {
        let contentDiv = document.getElementById("homeContent")
        contentDiv.innerHTML = ""
        articleContent = document.getElementById("homeArticle")
    } else if (theme == "healthCareArticles") {
        let contentDiv = document.getElementById("healthCareContent")
        contentDiv.innerHTML = ""
        articleContent = document.getElementById("healthArticle")
    } else if (theme == "adoptArticles") {
        let contentDiv = document.getElementById("adoptCareContent")
        contentDiv.innerHTML = ""
        articleContent = document.getElementById("adoptArticle")
    } else if (theme == "filterArticles") {
        let contentDiv = document.getElementById("browseContent")
        contentDiv.innerHTML = ""
        articleContent = document.getElementById("browseArticle")
    }
    fetch(`http://localhost:8081/article/${articleId}`)
        .then(response => response.json())
        .then(article => {
            articleContent.innerHTML = article.data.content; // Insert the article HTML content into the page
        })
        .catch(error => console.error('Error fetching article content:', error));
}

export function attachArticleClickHandlers(theme) {
    let selector = ""
    if (theme == "homeArticles") {
        selector = ".homeArticles .article-link"
        // let contentDiv=document.getElementById("homeContent")
        // contentDiv.innerHTML=""
    } else if (theme == "healthCareArticles") {
        selector = ".healthCareArticles .article-link"
        // contentDiv.innerHTML=""
        // articleDiv=document.getElementById("healthArticle")
    } else if (theme == "adoptArticles") {
        selector = ".adoptArticles .article-link"
        // let contentDiv=document.getElementById("adoptCareContent")
        // contentDiv.innerHTML=""
    } else if (theme == "filterArticles") {
        selector = ".filterArticles .article-link"
        // let contentDiv=document.getElementById("browseContent")
        // contentDiv.innerHTML=""
    }
    const articleLinks = document.querySelectorAll(selector);
    articleLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const articleId = this.getAttribute('data-id');
            fetchArticleContent(theme, articleId);
        });
    });
}

export function attachToggleHandlers(theme) {
    let level_one
    let selector = ""
    if (theme == "adoptArticles") {
        level_one = 2
        selector = "#adoptContentTitle .toggle-checkbox"
    } else if (theme == "healthCareArticles") {
        level_one = 1
        selector = "#healthCareContentTitle .toggle-checkbox"
    }
    const toggleLink = document.querySelector(selector);
    toggleLink.addEventListener('change', function () {
        if (toggleLink.checked) {
            fetchArticles(theme, 5, 1, level_one, 1)
        } else {
            fetchArticles(theme, 5, 1, level_one, 2)
        }
    });

}

export function addDropdownHandlers() {
    const dropdownHeader = document.querySelector('.dropdown-header');
    const dropdownOptions = document.querySelector('.dropdown-options');

    dropdownHeader.addEventListener('click', function () {
        dropdownOptions.classList.toggle('show');
    });

    document.addEventListener('click', function (event) {
        if (!dropdownHeader.contains(event.target) && !dropdownOptions.contains(event.target)) {
            dropdownOptions.classList.remove('show');
        }
    });
}

export function fetchSubThemes(themeId) {
    let url = `http://localhost:8081/theme/${themeId}`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            const subThemes = data.sub_themes;
            const dropdownOptions = document.querySelector('.dropdown-options');
            dropdownOptions.innerHTML = ''; // Clear any existing options

            const dropdownHeader = document.querySelector('.dropdown-header');
            const option = document.createElement('div');
            option.className = 'dropdown-option';
            option.innerText = "All";
            option.value = 0;
            option.addEventListener('click', function () {
                if (!option.classList.contains('disabled')) {
                    dropdownHeader.querySelector('span').innerText = option.innerText;
                    dropdownOptions.classList.remove('show');
                }
            });

            dropdownOptions.appendChild(option);
            subThemes.forEach(subTheme => {
                const option = document.createElement('div');
                option.className = 'dropdown-option';
                option.innerText = subTheme.SubTheme;
                option.value = subTheme.Id;
                option.addEventListener('click', function () {
                    if (!option.classList.contains('disabled')) {
                        dropdownHeader.querySelector('span').innerText = option.innerText;
                        dropdownOptions.classList.remove('show');
                    }
                });
                option.dataset.value = subTheme.Id;
                dropdownOptions.appendChild(option);
            });
        })
        .catch(error => console.error('Error fetching sub themes:', error));
}

export function generatePagination(theme, totalCnt, limit, currentPage, category_level_one, category_level_two,sub_theme) {
    const paginationDiv = document.getElementById('pagination');
    paginationDiv.innerHTML = ''; // Clear old pagination

    const totalPages = Math.ceil(totalCnt / limit);
    console.log("totalCnt:",totalCnt)
    console.log("limit:",limit)
    console.log("totalPages:",totalPages)
    const ul = document.createElement('ul');
    ul.classList.add('pagination-list');

    // Calculate start and end page numbers
    let startPage, endPage;
    if (totalPages <= 5) {
        // Less than 5 total pages, so show all pages
        startPage = 1;
        endPage = totalPages;
    } else {
        // More than 5 total pages, calculate start and end pages
        if (currentPage <= 3) {
            startPage = 1;
            endPage = 5;
        } else if (currentPage + 2 >= totalPages) {
            startPage = totalPages - 4;
            endPage = totalPages;
        } else {
            startPage = currentPage - 2;
            endPage = currentPage + 2;
        }
    }

    // Previous button
    const prevLi = document.createElement('li');
    const prevLink = document.createElement('a');
    prevLink.href = '#';
    prevLink.innerHTML = '&laquo;';
    prevLink.classList.add('page-link');
    if (currentPage === 1) {
        prevLink.classList.add('disabled');
    } else {
        prevLink.addEventListener('click', function (e) {
            e.preventDefault();
            //TODO
            // fetchArticles("healthCareArticles", limit, currentPage - 1, category_level_one, category_level_two);
            fetchArticles(theme, limit, currentPage - 1, category_level_one, category_level_two,sub_theme);
        });
    }
    prevLi.appendChild(prevLink);
    ul.appendChild(prevLi);

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
        const li = document.createElement('li');
        const pageLink = document.createElement('a');
        pageLink.href = '#';
        pageLink.textContent = i;
        pageLink.classList.add('page-link');
        if (i === currentPage) {
            pageLink.classList.add('active');
        }
        pageLink.addEventListener('click', function (e) {
            e.preventDefault();
            // fetchArticles("healthCareArticles", limit, i, category_level_one, category_level_two);
            fetchArticles(theme, limit, i, category_level_one, category_level_two,sub_theme);
        });
        li.appendChild(pageLink);
        ul.appendChild(li);
    }

    // Next button
    const nextLi = document.createElement('li');
    const nextLink = document.createElement('a');
    nextLink.href = '#';
    nextLink.innerHTML = '&raquo;';
    nextLink.classList.add('page-link');
    if (currentPage === totalPages) {
        nextLink.classList.add('disabled');
    } else {
        nextLink.addEventListener('click', function (e) {
            e.preventDefault();
            fetchArticles("healthCareArticles", limit, currentPage + 1, category_level_one, category_level_two,sub_theme);
        });
    }
    nextLi.appendChild(nextLink);
    ul.appendChild(nextLi);

    paginationDiv.appendChild(ul);
}

// 主题选择触发器handler
export function themesHandler() {
    const radioButtons = document.querySelectorAll('input[name="theme-selector"]');
    radioButtons.forEach(radio => {
        radio.addEventListener('change', function () {
            const themeId = this.value;
            const browseLink = document.getElementById('browse-link');
            const dropdownHeader = document.querySelector('.dropdown-header span');
            dropdownHeader.innerText = "Select Sub Theme"; // Clear Sub Theme selection
            if (browseLink.classList.contains('active')) {
                fetchSubThemes(themeId);
            }
        });
    });
}

export function fileterButtonHandler() {
    const filterButton = document.getElementById('filter-button');
    filterButton.addEventListener('click', function () {
        const selectedTheme = document.querySelector('input[name="theme-selector"]:checked').value;
        const selectedClassification = document.querySelector('input[name="pet-classification"]:checked').value;
        const selectedSubTheme = document.querySelector('.dropdown-header span').innerText;

        // 如果没有选定子主题，请使用默认值 0
        let selectedSubThemeId = 0;
        const dropdownOptions = document.querySelectorAll('.dropdown-option');
        dropdownOptions.forEach(option => {
            if (option.innerText === selectedSubTheme) {
                selectedSubThemeId = option.dataset.value;
            }
        });
        // 使用收集到的筛选器值发送请求以获取文章数据
        fetchArticles('filterArticles', 5, 1, selectedTheme, selectedClassification, selectedSubThemeId);
    });
}

export function initialBrowseFilter() {
    const catRadioButton = document.querySelector('input[name="pet-classification"][value="1"]');
    if (catRadioButton) {
        catRadioButton.checked = true;
    }

    const themeRadioButton = document.querySelector('input[name="theme-selector"][value="1"]');
    if (themeRadioButton) {
        themeRadioButton.checked = true;
    }

    fetchArticles('filterArticles', 5, 1, 1, 1, 0);
}
