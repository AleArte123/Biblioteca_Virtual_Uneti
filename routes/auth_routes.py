#auth_routes.py 
from flask import Blueprint, render_template, redirect, url_for, request, session, flash, get_flashed_messages
from models import db, Usuario
from werkzeug.security import generate_password_hash, check_password_hash

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['POST'])
def login():
    email = request.form.get('email')
    password = request.form.get('password')

    user = Usuario.query.filter_by(Email=email).first()

    if user and user.check_password(password):
        session['user_id'] = user.ID_Usuario
        session['nombre_usuario'] = user.Nombre
        session['rol'] = user.Rol
        flash(f'¡Bienvenido de nuevo, {user.Nombre}!', 'success')
        if user.Rol == 'Admin':
            return redirect(url_for('admin.admin_dashboard')) # Correcto
        else:
            return redirect(url_for('user.user_dashboard')) # Correcto
    else:
        flash('Correo electrónico o contraseña incorrectos.', 'danger')
        return redirect(url_for('login_register'))

@auth_bp.route('/register', methods=['POST'])
def register():
    nombre = request.form.get('nombre')
    email = request.form.get('email')
    password = request.form.get('password')
    confirm_password = request.form.get('confirm_password')

    if not all([nombre, email, password, confirm_password]):
        flash('Todos los campos son obligatorios.', 'danger')
        return redirect(url_for('login_register')) 

    if password != confirm_password:
        flash('Las contraseñas no coinciden.', 'danger')
        return redirect(url_for('login_register')) 

    if Usuario.query.filter_by(Email=email).first():
        flash('Este correo electrónico ya está registrado.', 'danger')
        return redirect(url_for('login_register')) 

    new_user = Usuario(Nombre=nombre, Email=email, Rol='Usuario')
    new_user.set_password(password)
    
    try:
        db.session.add(new_user)
        db.session.commit()
        flash('Usuario creado con éxito', 'success')
        return redirect(url_for('login_register')) 
    except Exception as e:
        db.session.rollback()
        flash(f'Error al registrar usuario: {e}', 'danger')
        return redirect(url_for('login_register'))

@auth_bp.route('/logout')
def logout():
    session.pop('user_id', None)
    session.pop('nombre_usuario', None)
    session.pop('rol', None)
    get_flashed_messages()
    flash('Has cerrado sesión exitosamente.', 'info')
    return redirect(url_for('login_register')) 