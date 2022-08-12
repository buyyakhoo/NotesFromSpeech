URL = window.URL || window.webkitURL;
var gumStream;
var rec;
var input;

var AudioContext = window.AudioContext || windows.webkitAudioContext;
var audioContext = new AudioContext;

var recordButton = document.getElementById("recordButton");
var stopButton = document.getElementById("stopButton")
var pauseButton = document.getElementById("pauseButton");

recordButton.addEventListener("click", startRecording);
stopButton.addEventListener("click", stopRecording);
pauseButton.addEventListener("click", pauseRecording);

function startRecording() {
    var constraints = {
        audio: true,
        video: false
    }

    recordButton.disabled = true
    stopButton.disabled = false
    pauseButton.disabled = false

    navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
        console.log("stream created, initializing Record.js")

        gumStream = stream;

        input = audioContext.createMediaStreamSource(stream)
        rec = new Recorder(input, {
            numChannel: 1
        })

        rec.record()
        console.log("Recording started");
    }).catch(function(err) {
        recordButton.disabled = false;
        stopButton.disabled = true;
        pauseButton.disabled = true;
    })
}

function pauseRecording() {
    console.log("pausebutton clicked rec.recording=", rec.recording);
    if (rec.recording) {
        rec.stop()
        pauseButton.innerHTML = "Resume"
    } else {
        rec.record()
        pauseButton.innerHTML = "Pause"
    }
}

function stopRecording() {
    console.log("stopButton clicked");

    stopButton.disabled = true;
    recordButton.disabled = false;
    pauseButton.disabled = true;

    rec.stop();
    gumStream.getAudioTracks()[0].stop();
    
    rec.exportWAV(createDownloadLink);
}

function createDownloadLink(blob) {
    var url = URL.createObjectURL(blob);
    var au = document.createElement('audio');
    var li = document.createElement('li');
    var link = document.createElement('a');

    //add controls to the <audio> element 
    au.controls = true;
    au.src = url;

    //link the a element to the blob 
    link.href = url;
    link.download = new Date().toISOString() + '.wav';
    link.innerHTML = link.download;

    //add the new audio and a elements to the li element 
    li.appendChild(au);
    li.appendChild(link);


    var filename = new Date().toISOString();
    //filename to send to server without extension 
    //upload link 
    var upload = document.createElement('a');
    upload.href = "#";
    upload.innerHTML = "Upload";
    upload.addEventListener("click", function(event) {
        var xhr = new XMLHttpRequest();
        xhr.onload = function(e) {
            if (this.readyState === 4) {
                // console.log("Server returned: ", e.target.responseText);
                document.body.innerHTML = e.target.responseText;
            }
        };
        var fd = new FormData();
        fd.append("file", blob, filename);
        xhr.open("POST", "/uploader", true);
        xhr.send(fd);
    })
    li.appendChild(document.createTextNode(" ")) //add a space in between 
    li.appendChild(upload) //add the upload link to li


    //add the li element to the ordered list 
    recordingsList.appendChild(li);
}

