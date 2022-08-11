from flask import Flask, render_template
from werkzeug.utils import secure_filename
import os

app = Flask(__name__)
app.config['SECRET_KEY'] = 'pepelaugh'
app.config['UPLOAD_FOLDER'] = 'static/audio'
# path = 'notesfromspeech'

class UploadFileForm(FlaskForm):
    file = FileField("File")
    submit = SubmitField("Upload File")

# @app.route('/hello/')
# @app.route('/hello/<name>')
# def hello(name=None):
    # return 'Hello world'
    # return render_template('hello.html', name=name)

@app.route('/', methods=['GET', 'POST'])
@app.route('/home', methods=['GET', 'POST'])
def home():
    form = UploadFileForm()
    if form.validate_on_submit():
        file = form.file.data
        # file.save(os.path.join(os.path.abspath(os.path.dirname(__file__)), app.config['UPLOAD_FOLDER'], secure_filename(file.filename))) 
        file.save(os.path.join(os.path.abspath(os.path.dirname(__file__)), app.config['UPLOAD_FOLDER'], secure_filename(file.filename)))
        return "File has been uploaded."
    return render_template('index.html', form=form)

if __name__ == "__main__":
    app.run(debug=True, threaded=True)
