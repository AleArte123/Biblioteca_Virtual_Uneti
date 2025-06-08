# routes/user_routes.py
from flask import Blueprint, render_template, send_from_directory, redirect, url_for, session, flash
import os

user_bp = Blueprint('user', __name__)

# Función de ayuda para comprobar si el usuario está logueado
def login_required(f):
    from functools import wraps
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            flash('Por favor, inicia sesión para acceder.', 'warning')
            return redirect(url_for('login_register')) # Cambiado a 'main.login_register'
        return f(*args, **kwargs)
    return decorated_function

@user_bp.route('/user')
@login_required # Protege esta ruta
def user_dashboard():
    return render_template('user.html')

@user_bp.route('/user_sections/<path:filename>')
@login_required # Protege esta ruta
def user_sections(filename):
    try:
        return send_from_directory(os.path.join(user_bp.root_path, '..', 'templates', 'sections_user'), filename)
    except FileNotFoundError:
        return "Contenido de sección no encontrado", 404
    except Exception as e:
        return "Error interno del servidor", 500

# Aqui podemos añadir más rutas específicas de usuario, como:
# Lógica para ver/editar perfil de usuario
