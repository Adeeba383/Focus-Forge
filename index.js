
//stopwatch
const display = document.getElementById("display");

//countdown
const display1 = document.getElementById("display-countdown");
let hrs = document.getElementById("hours");
let mins = document.getElementById("minutes");
let secs = document.getElementById("seconds");

//pomodoro
const display2 = document.getElementById("display-pomodoro");
const stopResumeBtn = document.getElementById("stopResumeBtn");
const short = document.getElementById("shortBreak");
const long = document.getElementById("longBreak");

let timeLeft = 0;
let timer = null;
let startTime = 0;
let elapsedTime = 0;
let endTime;

let isRunning = false;
let isPaused = false;
let isBreak = false;

let duration = 2 * 60 * 60 * 1000;
let remainingTime = 25 * 60;


//Start button for stopwatch
function start(){
    if (!isRunning){
        startTime = Date.now() - elapsedTime;
        timer = setInterval(update , 10);
        isRunning = true;
    }
}

//Set button
function set(){
    const hrs1 = hrs.value;
    const mins1 = mins.value;
    const secs1 = secs.value;

    display1.textContent = `${hrs1.padStart(2,0)}:${mins1.padStart(2,0)}:${secs1.padStart(2,0)}`;
}

//Start button for countdown
function start1(){
    if (isRunning) return;

    const hrs1 = parseInt(hrs.value) || 0;
    const mins1 = parseInt(mins.value) || 0;
    const secs1 = parseInt(secs.value) || 0;

    duration = (hrs1 * 3600 + mins1 * 60 + secs1) * 1000;

    if (duration > 0) {
        endTime = Date.now() + duration;
        timer = setInterval(updateCountdown, 1000);
        isRunning = true;
        isPaused = false;
    } else {
        alert("Please enter a valid time.");
    }
}


//Start button for pomodoro
function start2() {
    if (isRunning || remainingTime <= 0) return;

    isRunning = true;
    isPaused = false;

    timer = setInterval(() => {
        if (remainingTime > 0) {
            remainingTime--;
            updatePomodoro();
        } else {
            clearInterval(timer);
            isRunning = false;
            
            pomodoroCycle();
        }
    }, 1000);
}


//Toggle Pause/Resume button for countdown
function togglePauseResume(button){
    if (!isRunning && !isPaused) return;

    if (isRunning) {
        clearInterval(timer);
        timeLeft = endTime - Date.now();
        isRunning = false;
        isPaused = true;
        button.textContent = "Resume";
    } else if (isPaused) {
        endTime = Date.now() + timeLeft;
        timer = setInterval(updateCountdown, 1000);
        isRunning = true;
        isPaused = false;
        button.textContent = "Pause";
    }
}


//Toggle Pause/Resume button for pomodoro
function togglePauseResume2(button) {
    if (!isRunning && !isPaused) return;

    if (isRunning) {
        clearInterval(timer);
        isRunning = false;
        isPaused = true;
        button.textContent = "Resume";
    } else if (isPaused) {
        isRunning = true;
        isPaused = false;
        button.textContent = "Pause";

        timer = setInterval(() => {
            if (remainingTime > 0) {
                remainingTime--;
                updatePomodoro();
            } else {
                clearInterval(timer);
                isRunning = false;
                button.textContent = "Pause";
                pomodoroCycle();
            }
        }, 1000);
    }
}

//Stop button for stopwatch
function stop(){
    if (isRunning){
        clearInterval(timer);
        elapsedTime = Date.now() - startTime;
        isRunning = false;
    }
}

//Reset button for stopwatch and countdown
function reset(){
    clearInterval(timer);
    startTime = 0;
    elapsedTime = 0;
    isRunning = false;

    if (display) display.textContent = "00:00:00:00";
    if (display1) display1.textContent = "00:00:00";

    hrs.value = "";
    mins.value = "";
    secs.value = "";

}

//Reset button for pomodoro
function reset2() {

    clearInterval(timer);
    isRunning = false;
    isPaused = false;
    remainingTime = 25 * 60;
    
    updatePomodoro();
}

//Update function for stopwatch
function update(){
    const currentTime = Date.now();
    elapsedTime = currentTime - startTime;

    let hours = Math.floor(elapsedTime/(1000 * 60 * 60));
    let minutes = Math.floor(elapsedTime/(1000*60)%60);
    let seconds = Math.floor(elapsedTime/(1000)%60);
    let milliseconds = Math.floor(elapsedTime % 1000 / 10);

    hours = hours.toString().padStart(2, 0);
    minutes = minutes.toString().padStart(2, 0);
    seconds = seconds.toString().padStart(2, 0);
    milliseconds = milliseconds.toString().padStart(2, 0);

    display.textContent = `${hours}:${minutes}:${seconds}:${milliseconds}`;
}

//Update function for countdown
function updateCountdown(){
    const timeLeft = endTime - Date.now();

    let hours = Math.floor(timeLeft / (1000 * 60 * 60));
    let minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    hours = hours.toString().padStart(2, 0);
    minutes = minutes.toString().padStart(2, 0);
    seconds = seconds.toString().padStart(2, 0);

    display1.textContent = `${hours}:${minutes}:${seconds}`;
}

//Pomodoro cycle function
function pomodoroCycle() {

    if (remainingTime === 0) {
        if(isBreak){
            remainingTime = 25 * 60;
            isBreak = false;
            updatePomodoro();
            start2();
        }
        
        else {
            if (short.checked) {
            remainingTime = 5 * 60;
            isBreak = true;
            updatePomodoro();
            start2(); 
        } else if (long.checked) {
            remainingTime = 10 * 60;
            isBreak = true;
            updatePomodoro();
            start2(); 
        } else {
            remainingTime = 25 * 60;
            isBreak = true;
            updatePomodoro();
            start2(); 
        }
    }
    }
}


//Update function for pomodoro
function updatePomodoro() {
    let  minutes = Math.floor(remainingTime / 60);
    let seconds = remainingTime % 60;

    if (minutes < 10) minutes = "0" + minutes;
    if (seconds < 10) seconds = "0" + seconds;

    display2.textContent = minutes + ":" + seconds;
} 
updatePomodoro();