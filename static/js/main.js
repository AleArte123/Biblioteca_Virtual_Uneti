// static/js/main.js

document.addEventListener('DOMContentLoaded', function() {
    const mainContentArea = document.getElementById('main-content');
    const sidebarLinks = document.querySelectorAll('.sidebar-link'); // Selecciona todos los enlaces con esta clase

    // -------------   Función para activar el enlace de la barra lateral -------------
    function activateSidebarLink(target) {
        sidebarLinks.forEach(link => {
            link.classList.remove('active');  // Quita la clase 'active' de todos
        });
        // Encuentra y añade la clase 'active' al enlace correcto
        const activeLink = document.querySelector(`.sidebar-link[data-target="${target}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }

    // --------------- Función para cargar contenido vía AJAX -------------
    async function loadContent(targetUrl, targetPageName) {
        try {
            const response = await fetch(targetUrl); // Realiza la petición GET
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const html = await response.text();    // Obtiene la respuesta como texto HTML
            mainContentArea.innerHTML = html;      // Inyecta el HTML en el área principal

            // Activa el enlace correspondiente en la barra lateral
            activateSidebarLink(targetPageName);

            // Actualiza la URL en el navegador sin recargar la página (HTML5 History API)
            // Esto permite usar el botón de atrás/adelante del navegador
            window.history.pushState({ path: targetUrl, page: targetPageName }, '', `/${targetPageName.replace('_content', '')}`);

        } catch (error) {
            console.error('Error al cargar el contenido:', error);
            mainContentArea.innerHTML = '<p class="text-danger">Error al cargar el contenido. Por favor, inténtalo de nuevo.</p>';
        }
    }

    // -------------- Añadir event listeners a los enlaces de la barra lateral ------------
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault(); // Previene la acción por defecto del enlace (evita la recarga)

            const targetPageName = this.dataset.target; // Obtiene el valor de data-target
            let targetUrl = '';

            // Mapea el data-target a la ruta de Flask que devuelve el HTML
            if (targetPageName === 'profile_content') {
                targetUrl = '/get-profile-content';
            } else if (targetPageName === 'explore_books_content') {
                targetUrl = '/get-explore-books-content';
            } else if (targetPageName === 'reading_history_content') {
                targetUrl = '/get-reading-history-content';
            }
            // Agrega más condiciones aquí para futuras secciones

            if (targetUrl) {
                loadContent(targetUrl, targetPageName);
            }
        });
    });

    // Manejar el botón de atrás/adelante del navegador
    window.addEventListener('popstate', function(event) {
        if (event.state && event.state.path && event.state.page) {
            // Carga el contenido si hay un estado en el historial
            loadContent(event.state.path, event.state.page);
        } else {
            
        }
    });


    const initialPath = window.location.pathname;
    if (initialPath.includes('/profile')) {
        activateSidebarLink('profile_content');
    } else if (initialPath.includes('/explore-books')) {
        activateSidebarLink('explore_books_content');
    } else if (initialPath.includes('/reading-history')) {
        activateSidebarLink('reading_history_content');
    } else {
       
    }
});