/*
    -----------------------------------------------------
    Archivo: script_admin.js
    Descripción: Contiene la lógica JavaScript para el modal
    de gestion de libros, gestion usuarios
    -----------------------------------------------------
*/


function loadContent(url, clickedButton) {
    const contentArea = document.getElementById('main-content-area');
    
    // Desactivar el botón activo actual
    const currentActive = document.querySelector('.boton-navegacion.active');
    if (currentActive) {
        currentActive.classList.remove('active');
    }
    // Activar el botón clicado
    if (clickedButton) {
        clickedButton.classList.add('active');
    }

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('No se pudo cargar el contenido: ' + response.statusText);
            }
            return response.text();
        })
        .then(html => {
            contentArea.innerHTML = html;
            // Desplazar al inicio del contenido cargado (opcional)
            contentArea.scrollTop = 0; 

            // *******************************************************
            // ¡¡¡ AQUÍ ES DONDE SE DEBE RE-INICIALIZAR LA LÓGICA DE LOS FORMULARIOS !!!
            // *******************************************************
            initializeFormLogic(); // Llamar a la función que configura los listeners
        })
        .catch(error => {
            console.error('Error al cargar la página:', error);
            contentArea.innerHTML = '<p class="text-danger">Error al cargar el contenido. Por favor, intente de nuevo.</p>';
        });
}

// Para que loadContent esté disponible globalmente si se llama desde el HTML
window.loadContent = loadContent;


// Nueva función para inicializar la lógica de los formularios (modales)
function initializeFormLogic() {
    console.log('DEBUG: initializeFormLogic se ha ejecutado.'); // Primer punto de depuración
    // *******************************************************
    // LÓGICA DE GESTIÓN DE LIBROS (YA EXISTENTE)
    // *******************************************************

    // Lógica para el formulario de Añadir Nuevo Libro
    const addBookForm = document.getElementById('addBookForm');
    if (addBookForm) {
        addBookForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Evita que el formulario se envíe de forma predeterminada

            // Recopilar los datos del formulario
            const bookData = {
                title: document.getElementById('bookTitle').value,
                author: document.getElementById('bookAuthor').value,
                genre: document.getElementById('bookGenre').value,
                year: document.getElementById('bookYear').value,
                isbn: document.getElementById('bookISBN').value,
                description: document.getElementById('bookDescription').value,
                coverUrl: document.getElementById('bookCoverUrl').value,
                
            };

            console.log('Datos del nuevo libro:', bookData);

            // Cerrar el modal
            const modalElement = document.getElementById('addBookModal');
            if (modalElement) {
                const modalInstance = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
                modalInstance.hide();
            } else {
                console.warn('El modal addBookModal no se encontró o no está inicializado después de la carga dinámica.');
            }
            
            // Opcional: Recargar la tabla de libros si lo necesitas
            // loadContent('../templates/_gestionlibros.html', document.querySelector('.boton-navegacion[onclick*="_gestionlibros.html"]'));
        });
    }

    // Lógica para el formulario de Buscar Libro
    const searchBookForm = document.getElementById('searchBookForm');
    if (searchBookForm) {
        searchBookForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Evita que el formulario se envíe de forma predeterminada

            const searchQueryData = {
                query: document.getElementById('searchQuery').value,
                genre: document.getElementById('searchGenre').value,
                year: document.getElementById('searchYear').value
            };

            console.log('Parámetros de búsqueda:', searchQueryData);

            // Cerrar el modal
            const modalElement = document.getElementById('searchBookModal');
            if (modalElement) {
                const modalInstance = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
                modalInstance.hide();
            } else {
                console.warn('El modal searchBookModal no se encontró o no está inicializado después de la carga dinámica.');
            }

           // Aquí puedes actualizar la tabla con los resultados de la búsqueda
        });
    }

    // *******************************************************
    //  LÓGICA PARA EL MODAL DE EDICIÓN DE LIBROS
    // *******************************************************
    const editBookModal = document.getElementById('editBookModal');
    if (editBookModal) {
        editBookModal.addEventListener('show.bs.modal', function (event) {
            const button = event.relatedTarget; 

            const bookId = button.getAttribute('data-book-id');
            const bookTitle = button.getAttribute('data-book-title');
            const bookAuthor = button.getAttribute('data-book-author');
            const bookGenre = button.getAttribute('data-book-genre');
            const bookYear = button.getAttribute('data-book-year');
            const bookISBN = button.getAttribute('data-book-isbn');
            const bookDescription = button.getAttribute('data-book-description');
            const bookCoverUrl = button.getAttribute('data-book-cover-url');

            document.getElementById('editBookId').value = bookId;
            document.getElementById('editBookTitle').value = bookTitle;
            document.getElementById('editBookAuthor').value = bookAuthor;
            document.getElementById('editBookGenre').value = bookGenre;
            document.getElementById('editBookYear').value = bookYear;
            document.getElementById('editBookISBN').value = bookISBN;
            document.getElementById('editBookDescription').value = bookDescription;
            document.getElementById('editBookCoverUrl').value = bookCoverUrl;

            console.log(`Modal de Edición (Libro): Datos precargados para ID: ${bookId}, Título: ${bookTitle}`);
        });

        const editBookForm = document.getElementById('editBookForm');
        editBookForm.addEventListener('submit', function(event) {
            event.preventDefault(); 

            const editedBookData = {
                id: document.getElementById('editBookId').value,
                title: document.getElementById('editBookTitle').value,
                author: document.getElementById('editBookAuthor').value,
                genre: document.getElementById('editBookGenre').value,
                year: document.getElementById('editBookYear').value,
                isbn: document.getElementById('editBookISBN').value,
                description: document.getElementById('editBookDescription').value,
                coverUrl: document.getElementById('editBookCoverUrl').value
            };

            console.log('Datos del libro editado:', editedBookData);

            // Código para enviar datos al backend (descomentar y adaptar)
            // ... (fetch code) ...

            const modalInstance = bootstrap.Modal.getInstance(editBookModal);
            if (modalInstance) {
                modalInstance.hide();
            } else {
                console.warn('El modal editBookModal no se encontró o no está inicializado.');
            }
        });
    }

    // *******************************************************
    // LÓGICA PARA EL BOTÓN DE ELIMINAR LIBRO
    // *******************************************************
    const deleteBookButtons = document.querySelectorAll('.delete-book-btn'); // CAMBIO: Usar un nombre más específico 'deleteBookButtons'
    console.log('DEBUG: Número de botones de eliminar libro encontrados:', deleteBookButtons.length); // Añadido para depuración
    
    deleteBookButtons.forEach(button => {
        console.log('DEBUG: Adjuntando listener a botón de eliminar libro con ID:', button.getAttribute('data-book-id')); // Añadido para depuración
        button.addEventListener('click', function() {
            console.log('DEBUG: Click en botón de eliminar libro detectado para ID:', this.getAttribute('data-book-id')); // Añadido para depuración
            const bookId = this.getAttribute('data-book-id');
            const bookTitle = this.getAttribute('data-book-title') || "este libro"; 

            if (confirm(`¿Estás seguro de que quieres eliminar "${bookTitle}" (ID: ${bookId})? Esta acción no se puede deshacer.`)) {
                console.log(`Intentando eliminar libro con ID: ${bookId}`);

                // Código para enviar solicitud DELETE al backend (descomentar y adaptar)
                // ... (fetch code) ...

                this.closest('tr').remove(); // Elimina la fila de la tabla del DOM
                alert(`Libro "${bookTitle}" (ID: ${bookId}) eliminado (simulado).`);
            }
        });
    });

    // *******************************************************
    // INICIO DE LA LÓGICA DE GESTIÓN DE USUARIOS
    // *******************************************************

    console.log('DEBUG: Iniciando lógica de gestión de usuarios.'); // Segundo punto de depuración

    // Lógica para el formulario de Añadir Nuevo Usuario
    // Corrección: Mover la declaración de addUserForm fuera del if para que siempre esté disponible antes del if(addUserForm)
    const addUserForm = document.getElementById('addUserForm'); 
    if (addUserForm) {
        console.log('DEBUG: Add User Form encontrado.'); // Añadido para depuración
        addUserForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Evita que el formulario se envíe

            const userData = {
                name: document.getElementById('userName').value,
                email: document.getElementById('userEmail').value,
                password: document.getElementById('userPassword').value,
                role: document.getElementById('userRole').value
            };
            console.log('Datos del nuevo usuario:', userData);

            // Simular cierre de modal
            const modalElement = document.getElementById('addUserModal');
            if (modalElement) {
                const modalInstance = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
                modalInstance.hide();
            }
            alert(`Usuario ${userData.name} añadido (simulado).`);
            // Opcional: Recargar la tabla de usuarios para ver el nuevo usuario
            // loadContent('../templates/_gestionuser.html', document.querySelector('.boton-navegacion[onclick*="_gestionuser.html"]'));
        });
    }

    // Lógica para el formulario de Buscar Usuario
    const searchUserForm = document.getElementById('searchUserForm');
    if (searchUserForm) {
        console.log('DEBUG: Search User Form encontrado.'); // Añadido para depuración
        searchUserForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Evita que el formulario se envíe

            const searchQueryData = {
                query: document.getElementById('searchUserQuery').value,
                role: document.getElementById('searchUserRole').value,
                status: document.getElementById('searchUserStatus').value
            };
            console.log('Parámetros de búsqueda de usuario:', searchQueryData);

           
            // Simular cierre de modal
            const modalElement = document.getElementById('searchUserModal');
            if (modalElement) {
                const modalInstance = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
                modalInstance.hide();
            }
            alert('Búsqueda de usuario realizada (simulada).');
        });
    }

    // Lógica para el MODAL DE EDICIÓN DE USUARIO
    const editUserModal = document.getElementById('editUserModal');
    if (editUserModal) {
        console.log('DEBUG: Edit User Modal encontrado.'); // Añadido para depuración
        editUserModal.addEventListener('show.bs.modal', function (event) {
            const button = event.relatedTarget; // Botón que activó el modal
            
            // Extraer información de los atributos data-* del botón
            const userId = button.getAttribute('data-user-id');
            const userName = button.getAttribute('data-user-name');
            const userEmail = button.getAttribute('data-user-email');
            const userRole = button.getAttribute('data-user-role');
            const userStatus = button.getAttribute('data-user-status');

            // Rellenar los campos del formulario de edición
            document.getElementById('editUserId').value = userId;
            document.getElementById('editUserName').value = userName;
            document.getElementById('editUserEmail').value = userEmail;
            document.getElementById('editUserRole').value = userRole;
            document.getElementById('editUserStatus').value = userStatus;
            document.getElementById('editUserPassword').value = ''; // Siempre limpiar la contraseña por seguridad

            console.log(`Modal de Edición (Usuario): Datos precargados para ID: ${userId}, Nombre: ${userName}`);
        });

        // Lógica para el envío del formulario de Edición de Usuario
        const editUserForm = document.getElementById('editUserForm');
        editUserForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Evita que el formulario se envíe

            const editedUserData = {
                id: document.getElementById('editUserId').value,
                name: document.getElementById('editUserName').value,
                email: document.getElementById('editUserEmail').value,
                // Solo enviar la contraseña si se ha modificado y no está vacía
                password: document.getElementById('editUserPassword').value || undefined, 
                role: document.getElementById('editUserRole').value,
                status: document.getElementById('editUserStatus').value
            };

            console.log('Datos del usuario editado:', editedUserData);

           
            
            // Simular cierre de modal
            const modalInstance = bootstrap.Modal.getInstance(editUserModal);
            if (modalInstance) {
                modalInstance.hide();
            }
            alert(`Usuario ${editedUserData.name} (ID: ${editedUserData.id}) editado (simulado).`);
            // Opcional: Recargar la tabla de usuarios o actualizar la fila específica
            // loadContent('../templates/_gestionuser.html', document.querySelector('.boton-navegacion[onclick*="_gestionuser.html"]'));
        });
    }

    // Lógica para el BOTÓN DE BLOQUEAR/ACTIVAR USUARIO
    const toggleUserStatusButtons = document.querySelectorAll('.toggle-user-status-btn');
    console.log('DEBUG: Número de botones de Bloquear/Activar usuario encontrados:', toggleUserStatusButtons.length); // Añadido para depuración
    toggleUserStatusButtons.forEach(button => {
        console.log('DEBUG: Adjuntando listener a botón de Bloquear/Activar usuario con ID:', button.getAttribute('data-user-id')); // Añadido para depuración
        button.addEventListener('click', function() {
            console.log('DEBUG: Click en botón de Bloquear/Activar detectado para ID:', this.getAttribute('data-user-id')); // Añadido para depuración
            const userId = this.getAttribute('data-user-id');
            const userName = this.getAttribute('data-user-name');
            let currentUserStatus = this.getAttribute('data-user-status');
            let newStatus = (currentUserStatus === 'Activo') ? 'Inactivo' : 'Activo'; // Ajustado a "Inactivo" para el ejemplo
            let actionText = (newStatus === 'Inactivo') ? 'bloquear' : 'activar';
            let confirmMsg = `¿Estás seguro de que quieres ${actionText} a ${userName} (ID: ${userId})?`;

            if (confirm(confirmMsg)) {
                console.log(`Intentando ${actionText} usuario con ID: ${userId}, de ${currentUserStatus} a ${newStatus}`);
                // Aquí iría tu lógica para enviar el cambio de estado al backend
                
                alert(`Usuario ${userName} (ID: ${userId}) ${actionText} (simulado).`);
            }
        });
    });

    // Lógica para el BOTÓN DE ELIMINAR USUARIO
    const deleteUserButtons = document.querySelectorAll('.delete-user-btn');
    console.log('DEBUG: Número de botones de eliminar usuario encontrados:', deleteUserButtons.length); // CUARTO Y CRÍTICO PUNTO DE DEPURACIÓN
    deleteUserButtons.forEach(button => {
        console.log('DEBUG: Adjuntando listener a botón de eliminar con ID:', button.getAttribute('data-user-id')); // Quinto punto de depuración
        button.addEventListener('click', function() {
            console.log('DEBUG: Click en botón de eliminar detectado para ID:', this.getAttribute('data-user-id')); // Sexto punto de depuración (dentro del listener)
            const userId = this.getAttribute('data-user-id');
            const userName = this.getAttribute('data-user-name') || "este usuario"; 

            if (confirm(`¿Estás seguro de que quieres eliminar a ${userName} (ID: ${userId})? Esta acción no se puede deshacer.`)) {
                console.log(`Intentando eliminar usuario con ID: ${userId}`); // Este ya lo tenías

                // Aquí enviarías la solicitud DELETE a tu backend
                // fetch(`/api/users/${userId}`, { ... })

                // Simulación para el frontend:
                this.closest('tr').remove(); // Elimina la fila de la tabla del DOM
                alert(`Usuario ${userName} (ID: ${userId}) eliminado (simulado).`);
            }
        });
    });

} // CIERRE CORRECTO DE initializeFormLogic

// Se asegura de que initializeFormLogic se llame cuando el DOM inicial está cargado
// y cuando se navega a "Gestionar Usuarios".
document.addEventListener('DOMContentLoaded', function() {
    // Aquí se  puede cargar la vista inicial, por ejemplo, el dashboard
    loadContent('templates/admin_dashboard.html', document.querySelector('.boton-navegacion[onclick*="admin_dashboard.html"]'));
    // Opcional: Si quieres que la lógica se inicialice también en la carga inicial de admin.html
    // initializeFormLogic(); 
});