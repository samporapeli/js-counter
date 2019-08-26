var counterGoal = new Date(2320, 2, 27, 18);

onload = initialize;

function initialize() {
  var counter = setInterval(updateCounter, 500);
}

function timeDifference() {
  var currentTime = new Date();
  var currentSeconds = Math.floor(currentTime.getTime() / 1000);
  var goalSeconds = Math.floor(counterGoal.getTime() / 1000);
  return Math.max(goalSeconds - currentSeconds, 0);
}

function updateCounter() {
  var differenceString = ddhhmmssHTML(timeDifference());
  document.getElementById("counter-wrapper").innerHTML = differenceString;
}

function ddhhmmssHTML(seconds) {
  var s = seconds;
  var d = Math.floor(s / 86400);
  s = seconds - 86400 * d;
  var h = Math.floor(s / 3600);
  s -= 3600 * h;
  var m = Math.floor(s / 60);
  s -= m * 60;
  counterBlock = '<div class="counter-block"><div class="counter-value">';
  counterDescription = '</div><div class="counter-description">';
  closingDivs = '</div></div>';
  return (
    counterBlock + zeroPadding(d) +
    counterDescription + "days" +
    closingDivs + counterBlock + zeroPadding(h) +
    counterDescription + "hours" +
    closingDivs + counterBlock + zeroPadding(m) +
    counterDescription + "minutes" +
    closingDivs + counterBlock + zeroPadding(s) + 
    counterDescription + "seconds" + closingDivs
  );
  function zeroPadding(i) {
    if (i.toString().length == 1) {
      return "0" + i;
    } else {
      return i;
    }
  }
}
