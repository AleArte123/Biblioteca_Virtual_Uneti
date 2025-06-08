# models.py
# Nota: La instancia 'db' se inicializará en app.py y luego se importará aquí.
# Esto es una dependencia circular temporal que se resuelve cuando Flask levanta la app.

from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
import datetime

# db se inicializará en app.py y se pasará/importará a este módulo
db = SQLAlchemy() # Se inicializará con app más adelante

class Usuario(db.Model):
    __tablename__ = 'Usuario'                                                # Nombre de la tabla en la BD
    ID_Usuario = db.Column(db.Integer, primary_key=True)
    Nombre = db.Column(db.String(100), nullable=False)
    Email = db.Column(db.String(120), unique=True, nullable=False)
    Contrasena = db.Column(db.String(255), nullable=False)                  # Almacenaremos el hash de la contraseña
    Rol = db.Column(db.String(50), default='Usuario', nullable=False)       # 'Usuario' o 'Admin'
    Fecha_Registro = db.Column(db.DateTime, default=datetime.datetime.now)  # Para SQLite, usa datetime.datetime.now

    def set_password(self, password):
        """Hashea la contraseña y la guarda en el objeto Usuario."""
        self.Contrasena = generate_password_hash(password)

    def check_password(self, password):
        """Verifica una contraseña dada contra el hash guardado."""
        return check_password_hash(self.Contrasena, password)

    def __repr__(self):
        return f'<Usuario {self.Nombre} ({self.Email})>'

# Anotaciones para terminar de armar las tablas siguiendo el  MER:

# class Libro(db.Model):
#     __tablename__ = 'Libro'
#     ID_Libro = db.Column(db.Integer, primary_key=True)
#     Titulo = db.Column(db.String(255), nullable=False)
#     ID_Editorial = db.Column(db.Integer, db.ForeignKey('Editorial.ID_Editorial'))
#     ID_Autor = db.Column(db.Integer, db.ForeignKey('Autor.ID_Autor'))
#     ID_Categoria = db.Column(db.Integer, db.ForeignKey('Categoria.ID_Categoria'))
#     Fecha_Publicacion = db.Column(db.Integer) # O db.Date
#     Idioma = db.Column(db.String(50))
#     Descripcion = db.Column(db.Text)
#     Archivo_URL = db.Column(db.String(255))
#     Imagen_Portada_URL = db.Column(db.String(255))
#     # Relaciones
#     # valoraciones = db.relationship('Valoracion', backref='libro', lazy=True)
#     # historial = db.relationship('Historial_Lectura', backref='libro', lazy=True)
#     # estadisticas = db.relationship('Estadisticas', backref='libro', uselist=False, lazy=True)
#     # tags = db.relationship('Libro_TAG', backref='libro', lazy=True)

# class Editorial(db.Model):
#     __tablename__ = 'Editorial'
#     ID_Editorial = db.Column(db.Integer, primary_key=True)
#     Nombre = db.Column(db.String(100), nullable=False)
#     Direccion = db.Column(db.String(255))
#     URL_Sitio = db.Column(db.String(255))
#     # libros = db.relationship('Libro', backref='editorial', lazy=True)

# class Autor(db.Model):
#     __tablename__ = 'Autor'
#     ID_Autor = db.Column(db.Integer, primary_key=True)
#     Nombre = db.Column(db.String(100), nullable=False)
#     Nacionalidad = db.Column(db.String(100))
#     Biografia = db.Column(db.Text)
#     # libros = db.relationship('Libro', backref='autor', lazy=True)

# class Categoria(db.Model):
#     __tablename__ = 'Categoria'
#     ID_Categoria = db.Column(db.Integer, primary_key=True)
#     Nombre_Categoria = db.Column(db.String(100), nullable=False, unique=True)
#     Descripcion = db.Column(db.Text)
#     # libros = db.relationship('Libro', backref='categoria', lazy=True)

# class Valoracion(db.Model):
#     __tablename__ = 'Valoracion'
#     ID_Valoracion = db.Column(db.Integer, primary_key=True)
#     ID_Usuario = db.Column(db.Integer, db.ForeignKey('Usuario.ID_Usuario'), nullable=False)
#     ID_Libro = db.Column(db.Integer, db.ForeignKey('Libro.ID_Libro'), nullable=False)
#     Puntuacion = db.Column(db.Integer, nullable=False)
#     Fecha = db.Column(db.DateTime, default=datetime.datetime.now)

# class Historial_Lectura(db.Model):
#     __tablename__ = 'Historial_Lectura'
#     ID_Historial = db.Column(db.Integer, primary_key=True)
#     ID_Usuario = db.Column(db.Integer, db.ForeignKey('Usuario.ID_Usuario'), nullable=False)
#     ID_Libro = db.Column(db.Integer, db.ForeignKey('Libro.ID_Libro'), nullable=False)
#     Accion = db.Column(db.String(50), nullable=False) # Ej. 'Descargado', 'Leido'
#     Fecha = db.Column(db.DateTime, default=datetime.datetime.now)

# class TAG(db.Model):
#     __tablename__ = 'TAG'
#     ID_TAG = db.Column(db.Integer, primary_key=True)
#     Tema_Categoria = db.Column(db.String(100), nullable=False, unique=True)
#     # libros = db.relationship('Libro_TAG', backref='tag', lazy=True)

# class Libro_TAG(db.Model):
#     __tablename__ = 'Libro_TAG'
#     ID_Libro = db.Column(db.Integer, db.ForeignKey('Libro.ID_Libro'), primary_key=True)
#     ID_TAG = db.Column(db.Integer, db.ForeignKey('TAG.ID_TAG'), primary_key=True)

# class Estadisticas(db.Model):
#     __tablename__ = 'Estadisticas'
#     ID_Estadistica = db.Column(db.Integer, primary_key=True)
#     ID_Libro = db.Column(db.Integer, db.ForeignKey('Libro.ID_Libro'), unique=True, nullable=False)
#     Visitas = db.Column(db.Integer, default=0)
#     Descargas = db.Column(db.Integer, default=0)