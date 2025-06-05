from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def bienvenida():
    return render_template('bienvenida.html')

@app.route('/libros')
def libros():
    return render_template('libros.html')

@app.route('/autores')
def autores():
    return render_template('autores.html')

@app.route('/editoriales')
def editoriales():
    return render_template('editoriales.html')

@app.route('/generos')
def generos():
    return render_template('generos.html')
