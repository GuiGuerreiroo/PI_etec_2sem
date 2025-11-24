// Função para construir o header da página home
function buildHomeHeader() {
    const header = document.querySelector('header');
    if (!header) return;

    const titleWrap = document.createElement('div');
    titleWrap.className = 'title-wrap';
    titleWrap.innerHTML = `
        <h1 class="logo">Minhas Reservas</h1>
        <div class="decor" aria-hidden="true">
            <div class="line" role="presentation"></div>
            <div class="pill" role="presentation"></div>
        </div>
    `;

    header.appendChild(titleWrap);
}

function getNavBar() {
    try {
        const user = JSON.parse(localStorage.getItem('user'))
        const isHomePage = window.location.pathname.includes('home.html');

        if (user) {
            switch (user.role) {
                case 'PROFESSOR':
                    const header = document.querySelector('header');
                    if (!header) return;

                    // Cria a div menu-container
                    const menuContainer = document.createElement('div');
                    menuContainer.className = 'menu-container';

                    // Cria a div menu-toggle dentro de menu-container com ícone FA
                    const menuToggle = document.createElement('div');
                    menuToggle.className = 'menu-toggle';
                    menuToggle.id = 'menuToggle';
                    menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
                    menuContainer.appendChild(menuToggle);

                    // Adiciona ao header
                    header.appendChild(menuContainer);

                    // Cria a div menu-overlay
                    const overlay = document.createElement('div');
                    overlay.className = 'menu-overlay';
                    overlay.id = 'menuOverlay';

                    // Cria a div nav-container
                    const navContainer = document.createElement('div');
                    navContainer.className = 'nav-container';

                    // Cria a nav navbar
                    const navbar = document.createElement('nav');
                    navbar.className = 'navbar';
                    navbar.id = 'navbar';

                    // Array com os dados dos itens do menu
                    const menuItems = [
                        { href: 'home.html', icon: 'fa-calendar-check', text: 'RESERVAS' },
                        { href: 'kits.html', icon: 'fa-briefcase', text: 'KITS' },
                        { href: 'reservation.html', icon: 'fa-calendar-check', text: 'CRIAR RESERVA' },
                    ];

                    // Loop para criar cada item do menu
                    menuItems.forEach(item => {
                        const link = document.createElement('a');
                        link.href = item.href;
                        link.className = 'nav-item';

                        const icon = document.createElement('i');
                        icon.className = `fas ${item.icon}`;

                        const span = document.createElement('span');
                        span.textContent = item.text;

                        link.appendChild(icon);
                        link.appendChild(span);
                        navbar.appendChild(link);
                    });

                    // Monta a estrutura
                    navContainer.appendChild(navbar);

                    // Adiciona ao header
                    header.appendChild(overlay);
                    header.appendChild(navContainer);

                    // Configura os event listeners após criar os elementos
                    const menuToggleBtn = document.getElementById('menuToggle');
                    const menuOverlay = document.getElementById('menuOverlay');

                    function toggleMenu() {
                        menuToggleBtn.classList.toggle('active');
                        navbar.classList.toggle('active');
                        menuOverlay.classList.toggle('active');

                        const icon = menuToggleBtn.querySelector('i');
                        if (navbar.classList.contains('active')) {
                            icon.className = 'fas fa-times';
                        } else {
                            icon.className = 'fas fa-bars';
                        }

                        document.body.style.overflow = navbar.classList.contains('active') ? 'hidden' : '';
                    }

                    menuToggleBtn.addEventListener('click', function (e) {
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
                            const icon = menuToggleBtn.querySelector('i');
                            icon.className = 'fas fa-bars';
                            menuToggleBtn.classList.remove('active');
                            navbar.classList.remove('active');
                            menuOverlay.classList.remove('active');
                            document.body.style.overflow = '';
                        }
                    });

                    // Constrói o header se for a página home
                    if (isHomePage) {
                        buildHomeHeader();
                    }

                    break;
                case 'ADMIN':
                    {
                        const header = document.querySelector('header');
                        if (!header) return;

                        // Cria a div menu-container
                        const menuContainer = document.createElement('div');
                        menuContainer.className = 'menu-container';

                        // Cria a div menu-toggle dentro de menu-container com ícone FA
                        const menuToggle = document.createElement('div');
                        menuToggle.className = 'menu-toggle';
                        menuToggle.id = 'menuToggle';
                        menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
                        menuContainer.appendChild(menuToggle);

                        // Adiciona ao header
                        header.appendChild(menuContainer);

                        // Cria a div menu-overlay
                        const overlay = document.createElement('div');
                        overlay.className = 'menu-overlay';
                        overlay.id = 'menuOverlay';

                        // Cria a div nav-container
                        const navContainer = document.createElement('div');
                        navContainer.className = 'nav-container';

                        // Cria a nav navbar
                        const navbar = document.createElement('nav');
                        navbar.className = 'navbar';
                        navbar.id = 'navbar';

                        // Array com os dados dos itens do menu
                        const menuItems = [
                            { href: 'home.html', icon: 'fa-calendar-check', text: 'RESERVAS' },
                            { href: 'kits.html', icon: 'fa-briefcase', text: 'KITS' },
                            { href: 'user.html', icon: 'fa-users', text: 'USUÁRIOS' },
                            { href: 'lab_status.html', icon: 'fa-clipboard-list', text: 'STATUS RESERVAS' },
                            { href: 'edit_material.html', icon: 'fa-boxes', text: 'MATERIAIS' }
                        ];

                        // Loop para criar cada item do menu
                        menuItems.forEach(item => {
                            const link = document.createElement('a');
                            link.href = item.href;
                            link.className = 'nav-item';

                            const icon = document.createElement('i');
                            icon.className = `fas ${item.icon}`;

                            const span = document.createElement('span');
                            span.textContent = item.text;

                            link.appendChild(icon);
                            link.appendChild(span);
                            navbar.appendChild(link);
                        });

                        // Monta a estrutura
                        navContainer.appendChild(navbar);

                        // Adiciona ao header
                        header.appendChild(overlay);
                        header.appendChild(navContainer);

                        // Configura os event listeners após criar os elementos
                        const menuToggleBtn = document.getElementById('menuToggle');
                        const menuOverlay = document.getElementById('menuOverlay');

                        function toggleMenu() {
                            menuToggleBtn.classList.toggle('active');
                            navbar.classList.toggle('active');
                            menuOverlay.classList.toggle('active');

                            const icon = menuToggleBtn.querySelector('i');
                            if (navbar.classList.contains('active')) {
                                icon.className = 'fas fa-times';
                            } else {
                                icon.className = 'fas fa-bars';
                            }

                            document.body.style.overflow = navbar.classList.contains('active') ? 'hidden' : '';
                        }

                        menuToggleBtn.addEventListener('click', function (e) {
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
                                const icon = menuToggleBtn.querySelector('i');
                                icon.className = 'fas fa-bars';
                                menuToggleBtn.classList.remove('active');
                                navbar.classList.remove('active');
                                menuOverlay.classList.remove('active');
                                document.body.style.overflow = '';
                            }
                        });

                        // Constrói o header se for a página home
                        if (isHomePage) {
                            buildHomeHeader();
                        }
                    }
                    break
                case 'MODERATOR':
                    {
                        const header = document.querySelector('header');
                        if (!header) return;

                        // Cria a div menu-container
                        const menuContainer = document.createElement('div');
                        menuContainer.className = 'menu-container';

                        // Cria a div menu-toggle dentro de menu-container com ícone FA
                        const menuToggle = document.createElement('div');
                        menuToggle.className = 'menu-toggle';
                        menuToggle.id = 'menuToggle';
                        menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
                        menuContainer.appendChild(menuToggle);

                        // Adiciona ao header
                        header.appendChild(menuContainer);

                        // Cria a div menu-overlay
                        const overlay = document.createElement('div');
                        overlay.className = 'menu-overlay';
                        overlay.id = 'menuOverlay';

                        // Cria a div nav-container
                        const navContainer = document.createElement('div');
                        navContainer.className = 'nav-container';

                        // Cria a nav navbar
                        const navbar = document.createElement('nav');
                        navbar.className = 'navbar';
                        navbar.id = 'navbar';

                        // Array com os dados dos itens do menu
                        const menuItems = [
                            { href: 'home.html', icon: 'fa-calendar-check', text: 'RESERVAS' },
                            { href: 'kits.html', icon: 'fa-briefcase', text: 'KITS' },
                            { href: 'user.html', icon: 'fa-users', text: 'USUÁRIOS' },
                            { href: 'lab_status.html', icon: 'fa-clipboard-list', text: 'STATUS RESERVAS' },
                            { href: 'edit_material.html', icon: 'fa-boxes', text: 'MATERIAIS' }
                        ];

                        // Loop para criar cada item do menu
                        menuItems.forEach(item => {
                            const link = document.createElement('a');
                            link.href = item.href;
                            link.className = 'nav-item';

                            const icon = document.createElement('i');
                            icon.className = `fas ${item.icon}`;

                            const span = document.createElement('span');
                            span.textContent = item.text;

                            link.appendChild(icon);
                            link.appendChild(span);
                            navbar.appendChild(link);
                        });

                        // Monta a estrutura
                        navContainer.appendChild(navbar);

                        // Adiciona ao header
                        header.appendChild(overlay);
                        header.appendChild(navContainer);

                        // Configura os event listeners após criar os elementos
                        const menuToggleBtn = document.getElementById('menuToggle');
                        const menuOverlay = document.getElementById('menuOverlay');

                        function toggleMenu() {
                            menuToggleBtn.classList.toggle('active');
                            navbar.classList.toggle('active');
                            menuOverlay.classList.toggle('active');
                            document.body.style.overflow = navbar.classList.contains('active') ? 'hidden' : '';
                        }

                        menuToggleBtn.addEventListener('click', function (e) {
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
                                const icon = menuToggleBtn.querySelector('i');
                                icon.className = 'fas fa-bars';
                                menuToggleBtn.classList.remove('active');
                                navbar.classList.remove('active');
                                menuOverlay.classList.remove('active');
                                document.body.style.overflow = '';
                            }
                        });

                        // Constrói o header se for a página home
                        if (isHomePage) {
                            buildHomeHeader();
                        }
                    }
                    break;
                default:
                    throw new Error('Role de usuário desconhecida')



            }
        }
    } catch (error) {
        console.error('Erro ao obter usuário do localStorage:', error);
    }
}