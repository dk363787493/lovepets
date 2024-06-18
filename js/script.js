document.addEventListener('DOMContentLoaded', function () {
    const navLinks = document.querySelectorAll('.nav-menu a');
    const contentDiv = document.getElementById('content');
    const homeLink = document.querySelector('a[href="#home"]');
    const healthCareLink = document.querySelector('a[href="#healthcare"]');
    const adoptLink = document.querySelector('a[href="#adopt"]');
    const browseLink = document.querySelector('a[href="#browse"]');

    function setActiveLink(link) {
        navLinks.forEach(navLink => navLink.classList.remove('active'));
        link.classList.add('active');
    }

    function loadContent(url, link, limit, page, category_level_one, category_level_two) {
        fetch(url)
            .then(response => response.text())
            .then(data => {
                contentDiv.innerHTML = data;
                setActiveLink(link);
                let theme=""
                let level_one=""
                let level_two=""
                let limit_temp=0
                let page_temp=0
                if (link === homeLink) {
                    theme="homeArticles"
                    limit_temp=20
                    page_temp=1
                } else if (link === healthCareLink){
                    theme="healthCareArticles"
                    level_one=category_level_one
                    level_two=category_level_two
                    limit_temp=limit
                    page_temp=page
                    attachToggleHandlers(theme);
                } else if (link === adoptLink){
                    theme="adoptArticles"
                    level_one=category_level_one
                    level_two=category_level_two
                    limit_temp=limit
                    page_temp=page
                    attachToggleHandlers(theme);
                }
                fetchArticles(theme, limit_temp, page_temp, level_one, level_two)

            })
            .catch(error => console.error('Error loading content:', error));
    }

    function fetchArticles(theme, limit, page, category_level_one, category_level_two) {
        let url = `http://localhost:8081/article?is_short=1&limit=${limit}&page=${page}`;
        if (category_level_one != "") {
            url = `${url}&category_level_one=${category_level_one}&category_level_two=${category_level_two}`;
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
                    generatePagination(articles.totalCnt, limit, page, category_level_one, category_level_two);
                }
            })
            .catch(error => console.error('Error fetching articles:', error));
    }

    function fetchArticleContent(articleId) {
        fetch(`http://localhost:8081/article/${articleId}`)
            .then(response => response.json())
            .then(articleContent => {
                contentDiv.innerHTML = articleContent.data.content; // Insert the article HTML content into the page
            })
            .catch(error => console.error('Error fetching article content:', error));
    }

    function attachArticleClickHandlers(theme) {
        let selector=""
        if (theme=="homeArticles"){
            selector=".homeArticles .article-link"
        }else if(theme=="healthCareArticles"){
            selector=".healthCareArticles .article-link"
        }else if(theme=="adoptArticles"){
            selector=".adoptArticles .article-link"
        }
        const articleLinks = document.querySelectorAll(selector);
        articleLinks.forEach(link => {
            link.addEventListener('click', function (e) {
                e.preventDefault();
                const articleId = this.getAttribute('data-id');
                fetchArticleContent(articleId);
            });
        });
    }

    function attachToggleHandlers(theme) {
        let level_one
        let selector=""
        if (theme=="adoptArticles"){
            level_one=2
            selector="#adoptContentTitle .toggle-checkbox"
        }else if(theme=="healthCareArticles"){
            level_one=1
            selector="#healthCareContentTitle .toggle-checkbox"
        }
        const toggleLink = document.querySelector(selector);
        toggleLink.addEventListener('change', function () {
            if (toggleLink.checked) {
                fetchArticles(theme, 5, 1, level_one, 1)
                console.log('Cat mode activated!');
            } else {
                fetchArticles(theme, 5, 1, level_one, 2)
                console.log('Dog mode activated!');
            }
        });

    }

    function generatePagination(totalCnt, limit, currentPage, category_level_one, category_level_two) {
        const paginationDiv = document.getElementById('pagination');
        paginationDiv.innerHTML = ''; // Clear old pagination

        const totalPages = Math.ceil(totalCnt / limit);
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
                fetchArticles("healthCareArticles", limit, currentPage - 1, category_level_one, category_level_two);
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
                fetchArticles("healthCareArticles", limit, i, category_level_one, category_level_two);
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
                fetchArticles("healthCareArticles", limit, currentPage + 1, category_level_one, category_level_two);
            });
        }
        nextLi.appendChild(nextLink);
        ul.appendChild(nextLi);

        paginationDiv.appendChild(ul);
    }

    homeLink.addEventListener('click', function (e) {
        e.preventDefault();
        loadContent('home.html', homeLink, 20, 1, "", "");
    });

    healthCareLink.addEventListener('click', function (e) {
        e.preventDefault();
        loadContent('health_care.html', healthCareLink, 5, 1, 1, 2);
    });
    adoptLink.addEventListener('click', function (e) {
        e.preventDefault();
        loadContent('adopt.html', adoptLink, 5, 1, 2, 1);
    });
    browseLink.addEventListener('click', function (e) {
        e.preventDefault();
        loadContent('browse.html', browseLink, 10, 1, "", "");
    });

    // Initialize the home page by default
    loadContent('home.html', homeLink, 20, 1, "", "");
});

