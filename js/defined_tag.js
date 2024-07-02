// components/my-header.js
class MyHeader extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
  <header class="navbar">
    <div class="logo-container">
        <div class="logo">
            <a href="./index.html">
                <img src="../img/image_png-removebg-preview.png" alt="LovePets Logo">
            </a>
            <h1>LovePets</h1>
        </div>
        <p>LovePets is a free community to learn more about pet psychology and adoption.</p>
    </div>
    <nav class="nav-menu">
        <ul>
            <li><a href="./index.html" id="home-link">Home</a></li>
            <li><a href="./health_care.html" id="healthcare-link">Health Care</a></li>
            <li><a href="./adopt.html" id="adopt-link">Adopt</a></li>
            <li><a href="./browse.html" id="browse-link">Browse</a></li>
            <li><a href="./pet-supplies.html" id="healthcare-link">Pet Supplies</a></li>
            <li><a href="./about.html" class="about">About</a></li>
        </ul>
    </nav>
</header>
        `;
    }
}


class MyBottom extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
 <link rel="stylesheet" href="../css/bottom.css">
<footer>
    <div class="footer-container">
        <div class="footer-column">
            <h3>Company</h3>
            <ul>
                <li><a href="#">About</a></li>
                <li><a href="#">Contact Us</a></li>
                <li><a href="#">Blog</a></li>
            </ul>
            <p>© BoringCashCow 2024 <a href="#"><img src="../icon/twitter.png" alt="Twitter" class="social-icon"></a></p>
        </div>
        <div class="footer-column">
            <h3>Partner</h3>
            <ul>
                <li><a href="#">Advertise</a></li>
                <li><a href="#">Affiliate</a></li>
                <li><a href="#">Suggest a Business</a></li>
            </ul>
        </div>
        <div class="footer-column">
            <h3>Free Tools</h3>
            <ul>
                <li><a href="#">Basic Technical SEO Checklist</a></li>
                <li><a href="#">SEO Broken Link Checker</a></li>
                <li><a href="#">Website DR Checker</a></li>
            </ul>
        </div>
        <div class="footer-column">
            <h3>Resources</h3>
            <ul>
                <li><a href="#">Side Hustles for Everyone</a></li>
                <li><a href="#">Business Ideas for Everyone</a></li>
            </ul>
        </div>
    </div>
</footer>
        `;
    }
}
customElements.define('my-header', MyHeader);
customElements.define('my-bottom', MyBottom);