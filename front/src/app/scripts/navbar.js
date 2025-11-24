const menuToggle = document.getElementById('menuToggle');
const navbar = document.getElementById('navbar');
const menuOverlay = document.getElementById('menuOverlay');

function toggleMenu() {
    menuToggle.classList.toggle('active');
    navbar.classList.toggle('active');
    menuOverlay.classList.toggle('active');
    
    
    document.body.style.overflow = navbar.classList.contains('active') ? 'hidden' : '';
}

menuToggle.addEventListener('click', function(e) {
    e.stopPropagation(); 
    toggleMenu();
});

menuOverlay.addEventListener('click', toggleMenu);

const navItems = document.querySelectorAll('.nav-item');
navItems.forEach(item => {
    item.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
            toggleMenu();
        }
    });
});


window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        menuToggle.classList.remove('active');
        navbar.classList.remove('active');
        menuOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
});