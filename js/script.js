/*
    -----------------------------------------------------
    Archivo: script.js
    Descripción: Contiene la lógica JavaScript para interactuar con los modales
    de inicio de sesión y registro, manejar el envío de formularios y la transición entre ellos.
    -----------------------------------------------------
*/

document.addEventListener('DOMContentLoaded', function () {
    // Asegura que el DOM este completamente cargado antes de ejecutar el script.
    
    // --- Referencias a Elementos HTML ---
    const loginModalElement = document.getElementById('loginModal'); 
    const registerModalElement = document.getElementById('registerModal'); 
    const loginForm = document.getElementById('loginForm'); 
    const registerForm = document.getElementById('registerForm'); 
    const showLoginFromRegisterLink = document.getElementById('showLoginFromRegister'); 
    const loginMessage = document.getElementById('loginMessage'); // Nuevo elemento para mensajes de error en el login

    // --- Instancias de Modales de Bootstrap ---
    let loginModalInstance;
    if (loginModalElement) {
        loginModalInstance = new bootstrap.Modal(loginModalElement);
    } else {
        console.warn("ADVERTENCIA: Elemento 'loginModal' no encontrado. La funcionalidad de login podría estar limitada.");
    }

    let registerModalInstance;
    if (registerModalElement) {
        registerModalInstance = new bootstrap.Modal(registerModalElement);
    } else {
        console.warn("ADVERTENCIA: Elemento 'registerModal' no encontrado. La funcionalidad de registro podría estar limitada.");
    }

    // --- Funcionalidad para cambiar entre Modales (Registro a Login) ---
    if (showLoginFromRegisterLink && loginModalInstance && registerModalInstance) {
        showLoginFromRegisterLink.addEventListener('click', function (e) {
            e.preventDefault(); 
            registerModalInstance.hide();
            setTimeout(() => {
                loginModalInstance.show();
            }, 300);
        });
    }

    // --- Manejo del Envío de Formularios (Validación Básica y Simulación) ---

    // Maneja el envío del formulario de inicio de sesión.
    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault(); 

            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;

            console.log("Intentando iniciar sesión...");
            console.log("Email:", email);
            console.log("Contraseña:", password);

            // Limpiar mensajes de error previos
            loginMessage.textContent = '';
            loginMessage.style.display = 'none';

            // --- SIMULACIÓN DE LLAMADA AL BACKEND ---
            // En un entorno real, aquí harías un `fetch` a tu API de inicio de sesión.
            // Por ejemplo: fetch('/api/login', { method: 'POST', body: JSON.stringify({ email, password }) })
            // simulamos la respuesta del backend aquí.

            let simulatedResponse;
            if (email === "admin@example.com" && password === "admin123") {
                simulatedResponse = { success: true, role: "administrador", message: "Inicio de sesión exitoso como administrador." };
            } else if (email === "user@example.com" && password === "user123") {
                simulatedResponse = { success: true, role: "miembro", message: "Inicio de sesión exitoso como miembro." };
            } else {
                simulatedResponse = { success: false, message: "Correo o contraseña incorrectos." };
            }

            // Simular un retardo de red para una experiencia más realista
            setTimeout(() => {
                if (simulatedResponse.success) {
                    console.log(simulatedResponse.message);
                    // Opcional: Cerrar el modal después del intento de login exitoso
                    if (loginModalInstance) {
                        loginModalInstance.hide();
                    }

                    // --- LÓGICA DE REDIRECCIÓN BASADA EN EL ROL ---
                    if (simulatedResponse.role === 'administrador') {
                        window.location.href = './templates/admin.html'; 
                    } else if (simulatedResponse.role === 'miembro') {
                        window.location.href = './templates/user.html'; // O la página de usuario normal si tienes una
                    } else {
                        // Si el rol es desconocido, mostrar un error
                        loginMessage.textContent = 'Rol de usuario desconocido. Contacta al soporte.';
                        loginMessage.style.display = 'block';
                    }
                } else {
                    console.error("Error de inicio de sesión:", simulatedResponse.message);
                    loginMessage.textContent = simulatedResponse.message;
                    loginMessage.style.display = 'block';
                }
            }, 500); // Retardo de 0.5 segundos

            // NOTA IMPORTANTE: En un entorno real, no se manejaria la autenticación
            // solo en el frontend. Siempre necesitarás un backend seguro para validar
            // credenciales, gestionar sesiones/tokens, y determinar roles.
        });
    }

    // Maneja el envío del formulario de registro.
    if (registerForm) {
        registerForm.addEventListener('submit', function (e) {
            e.preventDefault(); 

            const name = document.getElementById('registerName').value;
            const email = document.getElementById('registerEmail').value;
            const password = document.getElementById('registerPassword').value;
            const confirmPassword = document.getElementById('registerConfirmPassword').value;

            console.log("Intentando registrar usuario...");
            console.log("Nombre:", name);
            console.log("Email:", email);
            console.log("Contraseña:", password);
            console.log("Confirmar Contraseña:", confirmPassword);

            // --- Lógica de Validación de Registro (simulada) ---
            if (password !== confirmPassword) {
                alert("Las contraseñas no coinciden. Por favor, verifica.");
                return; 
            }

            if (password.length < 6) {
                alert("La contraseña debe tener al menos 6 caracteres.");
                return;
            }

            // --- SIMULACIÓN DE LLAMADA AL BACKEND PARA REGISTRO ---
            // Aquí harías un fetch('/api/register', ...)
            // Para la simulación, asumiremos éxito.
            alert("Registro exitoso. Ahora puedes iniciar sesión.");
            
            if (registerModalInstance) {
                registerModalInstance.hide();
            }
            if (loginModalInstance) {
                setTimeout(() => loginModalInstance.show(), 300); 
            }
        });
    }
});