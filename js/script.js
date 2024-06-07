document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-menu a');
    const homeLink = document.querySelector('a[href="#home"]');
    const browseLink = document.querySelector('a[href="#browse"]');
    const homeContent = document.getElementById('homeContent');
    const resetLink = document.querySelector('.reset-link');
    const browseContent = document.getElementById('browseContent');
    const checkboxes = document.querySelectorAll('.filter-container input[type="checkbox"]');
    function setActiveLink(link) {
        navLinks.forEach(navLink => navLink.classList.remove('active'));
        link.classList.add('active');
    }

    homeLink.addEventListener('click', function(e) {
        e.preventDefault();
        homeContent.style.display = 'block';
        browseContent.style.display = 'none';
        setActiveLink(homeLink);
    });

    browseLink.addEventListener('click', function(e) {
        e.preventDefault();
        homeContent.style.display = 'none';
        browseContent.style.display = 'block';
        setActiveLink(browseLink);
    });

    // Set initial active link
    setActiveLink(homeLink);
    // Add reset functionality
    resetLink.addEventListener('click', function(e) {
        e.preventDefault();
        checkboxes.forEach(checkbox => {
            checkbox.checked = false;
        });
    });
});