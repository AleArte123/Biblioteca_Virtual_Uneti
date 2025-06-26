/*
    -----------------------------------------------------
    Archivo: script_explorar.js
    Descripción: Contiene la lógica JavaScript para el modal
    de detalles de libros, incluyendo la visualización y
    la funcionalidad de valoración por estrellas y descarga.
    -----------------------------------------------------
*/

document.addEventListener('DOMContentLoaded', function() {
    const bookDetailsModalElement = document.getElementById('bookDetailsModal');
    let bookDetailsModalInstance;
   

    // Inicializar el modal de Bootstrap solo si el elemento existe
    if (bookDetailsModalElement) {
        bookDetailsModalInstance = new bootstrap.Modal(bookDetailsModalElement);

        // --- Manejo de la valoración del usuario en el modal ---
        const userRatingStarsContainer = document.getElementById('userRatingStars');
        let selectedRating = 0; // Para almacenar la valoración seleccionada por el usuario

        if (userRatingStarsContainer) {
            userRatingStarsContainer.addEventListener('click', function(event) {
                if (event.target.classList.contains('interactive-star')) {
                    selectedRating = parseInt(event.target.dataset.rating);
                    highlightInteractiveStars(selectedRating);
                }
            });
        }

        function highlightInteractiveStars(rating) {
            const stars = userRatingStarsContainer.querySelectorAll('.interactive-star');
            stars.forEach(star => {
                const starRating = parseInt(star.dataset.rating);
                if (starRating <= rating) {
                    star.classList.remove('far');
                    star.classList.add('fas');
                } else {
                    star.classList.remove('fas');
                    star.classList.add('far');
                }
            });
        }

        function resetInteractiveStars() {
            selectedRating = 0;
            if (userRatingStarsContainer) {
                const stars = userRatingStarsContainer.querySelectorAll('.interactive-star');
                stars.forEach(star => {
                    star.classList.remove('fas');
                    star.classList.add('far');
                });
            }
        }

        const submitRatingButton = document.getElementById('submitRatingButton');
        if (submitRatingButton) {
            submitRatingButton.addEventListener('click', function() {
                if (selectedRating > 0) {
                    console.log(`Usuario valoró el libro con ${selectedRating} estrellas.`);
                    alert(`¡Gracias! Has valorado el libro con ${selectedRating} estrellas.`);
                    resetInteractiveStars();
                } else {
                    alert("Por favor, selecciona una valoración antes de guardar.");
                }
            });
        }

        // --- Escuchar el evento 'show.bs.modal' para poblar los datos y resetear valoración ---
        bookDetailsModalElement.addEventListener('show.bs.modal', function (event) {
            resetInteractiveStars();

            const button = event.relatedTarget;
            
            // Obtener todos los datos del libro directamente del botón que activó el modal
            const bookId = button.getAttribute('data-book-id');
            const bookTitle = button.getAttribute('data-book-title');
            const bookAuthor = button.getAttribute('data-book-author');
            const bookCategory = button.getAttribute('data-book-category');
            const bookRating = button.getAttribute('data-book-rating');
            const bookDescription = button.getAttribute('data-book-description');
            const bookCover = button.getAttribute('data-book-cover');
            const bookDownloadUrl = button.getAttribute('data-book-download-url'); // <-- Obtener la URL aquí también

            // Asignar los datos del libro a atributos de datos del propio modal
            // Esto permite que el botón "Añadir a Mis Libros" los lea directamente
            bookDetailsModalElement.dataset.currentBookId = bookId;
            bookDetailsModalElement.dataset.currentBookTitle = bookTitle;
            bookDetailsModalElement.dataset.currentBookAuthor = bookAuthor;
            bookDetailsModalElement.dataset.currentBookCategory = bookCategory;
            bookDetailsModalElement.dataset.currentBookRating = bookRating;
            bookDetailsModalElement.dataset.currentBookDescription = bookDescription;
            bookDetailsModalElement.dataset.currentBookCover = bookCover;
            bookDetailsModalElement.dataset.currentBookDownloadUrl = bookDownloadUrl; // <-- Guardar la URL aquí

            document.getElementById('modalBookTitle').textContent = bookTitle;
            document.getElementById('modalBookAuthor').textContent = bookAuthor;
            document.getElementById('modalBookCategory').textContent = bookCategory;
            document.getElementById('modalBookDescription').textContent = bookDescription;
            document.getElementById('modalBookCover').src = bookCover;
            document.getElementById('modalBookCover').alt = `Portada de ${bookTitle}`;

            const ratingStarsDisplay = document.getElementById('modalBookRating');
            if (ratingStarsDisplay) {
                ratingStarsDisplay.innerHTML = '';
                const floatRating = parseFloat(bookRating);
                const fullStars = Math.floor(floatRating);
                const hasHalfStar = floatRating % 1 >= 0.5;

                for (let i = 0; i < fullStars; i++) {
                    ratingStarsDisplay.innerHTML += '<i class="fas fa-star"></i>';
                }
                if (hasHalfStar) {
                    ratingStarsDisplay.innerHTML += '<i class="fas fa-star-half-alt"></i>';
                }
                for (let i = 0; i < (5 - fullStars - (hasHalfStar ? 1 : 0)); i++) {
                    ratingStarsDisplay.innerHTML += '<i class="far fa-star"></i>';
                }
            }
        });
        
        // --- Manejar el botón de Descargar Libro ---
        const downloadBookButton = document.getElementById('downloadBookButton');
        if (downloadBookButton) {
            downloadBookButton.addEventListener('click', function() {
                // Obtener la URL directamente del dataset del modal
                const downloadUrl = bookDetailsModalElement.dataset.currentBookDownloadUrl; 
                if (downloadUrl) {
                    const link = document.createElement('a');
                    link.href = downloadUrl;
                    link.download = downloadUrl.substring(downloadUrl.lastIndexOf('/') + 1);
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    console.log(`Intentando descargar: ${downloadUrl}`);
                } else {
                    alert("No hay una URL de descarga disponible para este libro.");
                }
            });
        }

        // --- Manejar el botón de Añadir a Mis Libros (Actualizado para leer del modal) ---
        const addToListButton = document.getElementById('addToListButton');
        if (addToListButton) {
            addToListButton.addEventListener('click', function() {
                // Obtener los datos del libro directamente del dataset del modal
                const bookToAdd = {
                    id: bookDetailsModalElement.dataset.currentBookId,
                    title: bookDetailsModalElement.dataset.currentBookTitle,
                    author: bookDetailsModalElement.dataset.currentBookAuthor,
                    category: bookDetailsModalElement.dataset.currentBookCategory,
                    rating: bookDetailsModalElement.dataset.currentBookRating,
                    description: bookDetailsModalElement.dataset.currentBookDescription,
                    cover: bookDetailsModalElement.dataset.currentBookCover,
                    downloadUrl: bookDetailsModalElement.dataset.currentBookDownloadUrl // Asegúrate de obtener la URL de descarga también
                };

                if (bookToAdd.id) { // Asegúrate de que tenemos un ID de libro válido
                    // 1. Obtener la lista actual de libros de localStorage
                    let myBooks = JSON.parse(localStorage.getItem('myBooks')) || [];

                    // 2. Verificar si el libro ya está en la lista para evitar duplicados
                    const isAlreadyAdded = myBooks.some(book => book.id === bookToAdd.id);

                    if (!isAlreadyAdded) {
                        // 3. Añadir el nuevo libro a la lista
                        myBooks.push(bookToAdd);

                        // 4. Guardar la lista actualizada en localStorage
                        localStorage.setItem('myBooks', JSON.stringify(myBooks));

                        alert(`"${bookToAdd.title}" ha sido añadido a "Mis Libros".`);
                        console.log("Libro añadido:", bookToAdd);
                        console.log("Mis Libros actuales:", myBooks);
                    } else {
                        alert(`"${bookToAdd.title}" ya se encuentra en "Mis Libros".`);
                    }

                    // Opcional: Cerrar el modal después de añadir el libro
                    // bookDetailsModalInstance.hide();
                } else {
                    alert("Error: No se pudo obtener la información del libro para añadirlo."); // Se mantuvo el alert pero la causa original debería estar resuelta
                }
            });
        }

    } else {
        console.warn("ADVERTENCIA: Elemento 'bookDetailsModal' no encontrado. El modal de detalles de libro no funcionará.");
    }
});