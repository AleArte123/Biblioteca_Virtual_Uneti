# routes/admin_routes.py
from flask import Blueprint, render_template, send_from_directory, redirect, url_for, session, flash
import os

admin_bp = Blueprint('admin', __name__)

# Función de ayuda para comprobar si el usuario es administrador
def admin_required(f):
    from functools import wraps
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session or session.get('rol') != 'Admin':
            flash('Acceso denegado. Se requiere rol de administrador.', 'danger')
            return redirect(url_for('login_register')) 
        return f(*args, **kwargs)
    return decorated_function

@admin_bp.route('/admin')
@admin_required # Protege esta ruta
def admin_dashboard():
    return render_template('admin.html')

@admin_bp.route('/admin_sections/<path:filename>')
@admin_required
def admin_sections(filename):
    # Desde aqui se obtiene la ruta absoluta del directorio del proyecto
    project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..')) 
    
    # Desde aqui se Construye la ruta al directorio que contiene los archivos de secciones
    directory_to_serve = os.path.join(project_root, 'templates', 'sections_admin')
    
    print(f"Intentando servir desde: {directory_to_serve}")
    print(f"Intentando servir archivo: {filename}")
    
    try:
        return send_from_directory(directory_to_serve, filename)
    except FileNotFoundError:
        print(f"ERROR: Archivo '{filename}' no encontrado en {directory_to_serve}")
        return "Contenido de sección de administración no encontrado", 404
    except Exception as e: 
        return "Error interno del servidor en admin", 500

