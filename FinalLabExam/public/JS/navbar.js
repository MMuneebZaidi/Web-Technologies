function scrollToSection(section) {
    document.getElementById(section).scrollIntoView({ behavior: 'smooth' });
}

function setHamburger(state) {
    var hamburger = document.querySelector('.hamburger');
    if (state) {
        hamburger.classList.add('active');
    } else {
        hamburger.classList.remove('active');
    }
}

