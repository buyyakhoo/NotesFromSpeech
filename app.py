from flask import Flask, render_template, request, redirect, url_for
from werkzeug.utils import secure_filename
import os
import speech_recognition as sr
# import wave

app = Flask(__name__)
upload_folder = "\static\\audio\\"

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/upload')
def upload():
    return render_template('upload.html')

@app.route('/record')
def record():
    return render_template('record.html')

@app.route('/uploader', methods=['POST'])
def upload_file():
    transcript = ""
    if request.method == 'POST':
        print("Form Data Received!!")

        if "file" not in request.files:
            return redirect(url_for('upload'))

        # f.save(f"{os.path.dirname(__file__)}{upload_folder}{secure_filename(f.filename)}")
        # f.save(secure_filename(f.filename))
        # file.save(os.path.join(os.path.abspath(os.path.dirname(__file__)), app.config['UPLOAD_FOLDER'], secure_filename(file.filename)))
        
        uploadedFile = request.files['file']
        print(uploadedFile)
        if uploadedFile.filename == "":
            return redirect(url_for('upload'))
        
        if uploadedFile:
            # obj = wave.open(f, "rb")
            # t_audio = obj.getnframes() / obj.getframerate()
            # print(t_audio)

            recognizer = sr.Recognizer()
            audioFile = sr.AudioFile(uploadedFile)
            with audioFile as source:
                data = recognizer.record(source)
            
            transcript = recognizer.recognize_google(data, key=None)

        # return render_template('upload.html', transcript=transcript, t_audio=t_audio)
        return render_template('transcribe.html', transcript=transcript)

if __name__ == '__main__':
    app.run(debug=True)