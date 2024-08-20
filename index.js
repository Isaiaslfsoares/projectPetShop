document.addEventListener('DOMContentLoaded', function () {
    var wrapper = document.getElementById('wrapper');
    var toggleButton = document.getElementById('menu-toggle');
    var overlay = document.querySelector('.overlay');
    var pageContent = document.getElementById('page-content-wrapper');

    toggleButton.onclick = function () {
        wrapper.classList.toggle('toggled');
        overlay.classList.toggle('active');
        if (wrapper.classList.contains('toggled')) {
            pageContent.style.marginLeft = '0';
        } else {
            pageContent.style.marginLeft = '250px';
        }
    };

    overlay.onclick = function () {
        wrapper.classList.remove('toggled');
        overlay.classList.remove('active');
        pageContent.style.marginLeft = '250px';
    };

    if (window.innerWidth > 768) {
        pageContent.style.marginLeft = '250px';
    }
});
