# app.py
from flask import Flask, render_template, session, flash, redirect, url_for, send_from_directory
from flask_sqlalchemy import SQLAlchemy
import os

# Importar configuración y modelos
from config import Config
from models import db # Importamos la instancia de db

# Inicialización de la aplicación Flask
app = Flask(__name__)
app.config.from_object(Config) # Carga la configuración desde Config

# Inicializa la base de datos con la aplicación
db.init_app(app)

# Importar los Blueprints
from routes.auth_routes import auth_bp
from routes.user_routes import user_bp
from routes.admin_routes import admin_bp

# Registrar los Blueprints
app.register_blueprint(auth_bp)
app.register_blueprint(user_bp)
app.register_blueprint(admin_bp)

# --- Rutas principales que no pertenecen a un Blueprint específico (ej. la landing page) ---
@app.route('/')
def login_register():
    # Aquí podríamos añadir una redirección si el usuario ya está logueado
    if 'user_id' in session:
        if session.get('rol') == 'Admin':
            return redirect(url_for('admin.admin_dashboard'))
        else:
            return redirect(url_for('user.user_dashboard'))
    return render_template('login_register.html')

# Nueva ruta para servir los modales dinámicamente
@app.route('/modals/<path:filename>')
def serve_modal(filename):
    try:
        return send_from_directory(os.path.join(app.root_path, 'templates', 'modal_login_register'), filename)
    except FileNotFoundError:
        return "Modal no encontrado", 404
    except Exception as e:
        app.logger.error(f"Error sirviendo el modal {filename}: {e}")
        return "Error interno del servidor al cargar modal", 500


if __name__ == '__main__':
    # Esto creará la base de datos y las tablas definidas en los modelos
    # Asegúrate de ejecutar esto una vez para crear la BD y el admin inicial
    with app.app_context():
        db.create_all()
        
        # Opcional: Crear un usuario administrador si no existe
        from models import Usuario # Importa Usuario aquí para usarlo en el contexto de la app
        if not Usuario.query.filter_by(Rol='Admin').first():
            admin_user = Usuario(Nombre='Admin', Email='admin@biblio.com', Rol='Admin')
            admin_user.set_password('adminpass') # Usa el método del modelo
            db.session.add(admin_user)
            db.session.commit()
            print("Usuario administrador creado: admin@biblio.com / adminpass")
        
    app.run(debug=True)