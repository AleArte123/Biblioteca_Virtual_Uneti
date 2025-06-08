# config.py
import os

class Config:
    # Genera una clave secreta fuerte. En producción, úsala desde una variable de entorno.
    SECRET_KEY = os.environ.get('SECRET_KEY') or os.urandom(24).hex()
    
    # Configuración de la base de datos SQLite
    SQLALCHEMY_DATABASE_URI = 'sqlite:///biblioteca.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False # Desactiva el seguimiento de modificaciones de objetos SQLAlchemy