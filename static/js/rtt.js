//init
const SpeechRecognition = window.SpeechRecognition || webkitSpeechRecognition;
const SpeechGrammarList = window.SpeechGrammarList || webkitSpeechGrammarList;
const SpeechRecognitionEvent = window.SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

const recognition = new SpeechRecognition();
recognition.continuous = true;
recognition.interimResults = true;
let startbtn = document.getElementById("start");
let stopbtn = document.getElementById("stop");

startbtn.addEventListener("click", start);
stopbtn.addEventListener("click", stop);
stopbtn.disabled = true;
function start(){
	recognition.lang = document.getElementById('lang').value;
	recognition.start();
	startbtn.disabled = true;
	stopbtn.disabled = false;
}
function stop(){
	recognition.stop();
	startbtn.disabled = false;
	stopbtn.disabled = true;
}
recognition.addEventListener('result', function(event){
	const txtresult = Array.from(event.results)
	.map(result => result[0])
	.map(result => result.transcript)
	.join(' ');
	console.log(txtresult);
	document.getElementById('transcribe').value = txtresult;
});