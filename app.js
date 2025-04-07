const display = document.getElementById("display");
const alarmSound = document.getElementById("alarmSound");
const snoozeBtn = document.getElementById("snoozeBtn");
const alarmBtn = document.getElementById("alarmBtn");
const alarmInput = document.getElementById("alarmTime");

let timer = null;
let startTime = 0;
let elapsedTime = 0;
let isRunning = false;

let alarmTime = null;
let alarmInterval = null;

// Toggle Buttons
document.getElementById("toggleStopwatchBtn").addEventListener("click", () => {
  document.getElementById("stopwatchControls").style.display = "block";
  document.getElementById("alarmControls").style.display = "none";
});

document.getElementById("toggleAlarmBtn").addEventListener("click", () => {
  document.getElementById("alarmControls").style.display = "block";
  document.getElementById("stopwatchControls").style.display = "none";
});

// Stopwatch Functions
function start() {
  if (!isRunning) {
    startTime = Date.now() - elapsedTime;
    timer = setInterval(update, 10);
    isRunning = true;
  }
}

function stop() {
  if (isRunning) {
    clearInterval(timer);
    elapsedTime = Date.now() - startTime;
    isRunning = false;
  }
}

function reset() {
  clearInterval(timer);
  startTime = 0;
  elapsedTime = 0;
  isRunning = false;
  display.textContent = "00:00:00:00";
}

function update() {
  const currentTime = Date.now();
  elapsedTime = currentTime - startTime;

  let hours = Math.floor(elapsedTime / (1000 * 60 * 60));
  let minutes = Math.floor((elapsedTime % (1000 * 60 * 60)) / (1000 * 60));
  let seconds = Math.floor((elapsedTime % (1000 * 60)) / 1000);
  let milliseconds = Math.floor((elapsedTime % 1000) / 10);

  display.textContent = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}:${String(milliseconds).padStart(2, "0")}`;
}

// Alarm Functions
function setAlarm() {
  const alarmVal = alarmInput.value;
  if (!alarmVal) {
    document.getElementById("alarmMessage3").style.display = "block";
    return;
  }

  const now = moment();
  const [hours, minutes] = alarmVal.split(":").map(Number);
  alarmTime = moment().set({ hour: hours, minute: minutes, second: 0 });

  if (alarmTime.isBefore(now)) alarmTime.add(1, "day");

  // UI updates
  alarmInput.style.display = "none";
  alarmBtn.style.display = "none";
  document.getElementById("alarmMessage").style.display = "block";
  document.getElementById("alarmTimeDisplay").textContent = alarmTime.format("hh:mm A");
  document.getElementById("alarmMessage2").style.display = "none";
  document.getElementById("alarmMessage3").style.display = "none";

  alarmInterval = setInterval(() => {
    const now = moment();
    const diff = moment.duration(alarmTime.diff(now));

    if (diff.asMilliseconds() <= 0) {
      triggerAlarm();
    } else {
      display.textContent = `${String(diff.hours()).padStart(2, "0")}:${String(diff.minutes()).padStart(2, "0")}:${String(diff.seconds()).padStart(2, "0")}:00`;
    }
  }, 1000);
}

function triggerAlarm() {
  clearInterval(alarmInterval);
  alarmSound.play();
  snoozeBtn.style.display = "inline-block";
}

function snoozeAlarm() {
  clearInterval(alarmInterval);
  alarmSound.pause();
  alarmSound.currentTime = 0;
  snoozeBtn.style.display = "none";

  // Set alarm 5 minutes from now
  alarmTime = moment().add(5, "minutes");

  document.getElementById("alarmMessage").style.display = "block";
  document.getElementById("alarmTimeDisplay").textContent = alarmTime.format("hh:mm A");

  alarmInterval = setInterval(function () {
    var now = moment();
    var diff = moment.duration(alarmTime.diff(now));

    if (diff.asMilliseconds() <= 0) {
      triggerAlarm();
    } else {
      display.textContent =
        String(diff.hours()).padStart(2, "0") + ":" +
        String(diff.minutes()).padStart(2, "0") + ":" +
        String(diff.seconds()).padStart(2, "0") + ":00";
    }
  }, 1000);
}
