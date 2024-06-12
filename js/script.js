document.addEventListener('DOMContentLoaded', function () {
    const navLinks = document.querySelectorAll('.nav-menu a');
    const contentDiv = document.getElementById('content');
    const homeLink = document.querySelector('a[href="#home"]');
    const healthCareLink = document.querySelector('a[href="#healthcare"]');
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
                if (link === homeLink) {
                    fetchArticles(20, 1, "", "");
                } else {
                    fetchArticles(limit, page, category_level_one, category_level_two);
                }
            })
            .catch(error => console.error('Error loading content:', error));
    }

    function fetchArticles(limit, page, category_level_one, category_level_two) {
        let url = `http://localhost:8081/article?is_short=1&limit=${limit}&page=${page}`;
        if (category_level_one != "") {
            url = `${url}&category_level_one=${category_level_one}&category_level_two=${category_level_two}`;
        }
        console.log("url", url);
        fetch(url)
            .then(response => response.json())
            .then(articles => {
                const articlesDiv = document.getElementById('articles');
                articlesDiv.innerHTML = ''; // Clear old content
                articles.data.forEach(article => {
                    const articleElement = document.createElement('article');
                    articleElement.classList.add('article'); // Add class for styling
                    articleElement.innerHTML = `
                        <div class="content">
                            <h3>
                                <a href="http://localhost:8081/article/${article.id}">${article.title}</a>
                           </h3>
                            <p>${article.description}</p>
                     </div>
                          <a href="http://localhost:8081/article/${article.id}">
                          <img src="${article.cover_path}" alt="${article.title}">
                         </a>
                    `;
                    articlesDiv.appendChild(articleElement);
                });
            })
            .catch(error => console.error('Error fetching articles:', error));
    }

    homeLink.addEventListener('click', function (e) {
        e.preventDefault();
        loadContent('home.html', homeLink, 20, 1, "", "");
    });

    healthCareLink.addEventListener('click', function (e) {
        e.preventDefault();
        loadContent('health_care.html', healthCareLink, 20, 1, "Health", "Care");
    });

    browseLink.addEventListener('click', function (e) {
        e.preventDefault();
        loadContent('browse.html', browseLink, 20, 1, "", "");
    });
    // Load home.html content by default
    loadContent('home.html', homeLink, 20, 1, "", "");
});