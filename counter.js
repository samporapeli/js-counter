var counters = [];

class Counter {
    constructor(goal, title = null) {
        const nextID = counters.length + 1;
        this.div = "counter-" + nextID;
        this.title = title === null ? "Counter " + nextID : title;
        this.titleID = this.div + "-title";
        this.containerID = this.div + "-container";
        this.removeID = this.div + "-remove";
        this.goal = goal;
        this.start();
    }
    start() {
        if (!counters.includes(this)) {
            counters.push(this);
        }
    }
    stop() {
        if (counters.includes(this)) {
            const index = counters.indexOf(this);
            counters.splice(index, 1);
        }
    }
    delete() {
        this.stop();
        var container = document.getElementById(this.containerID);
        container.remove();
    }
    render() {
        const html = this.html(this.timeDifference(this.goal));
        const element = document.getElementById(this.div);
        const title = document.getElementById(this.titleID);
        element.innerHTML = html;
        title.innerHTML = this.title;
    }
    html(seconds) {
        var s = seconds;
        var d = Math.floor(s / 86400);
        s = seconds - 86400 * d;
        var h = Math.floor(s / 3600);
        s -= 3600 * h;
        var m = Math.floor(s / 60);
        s -= m * 60;
        const counterBlock = '<div class="counter-block"><div class="counter-value">';
        const counterDescription = '</div><div class="counter-description">';
        const closingDivs = '</div></div>';
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
    }
    timeDifference(goal) {
        var currentTime = new Date();
        var currentSeconds = Math.floor(currentTime.getTime() / 1000);
        var goalSeconds = Math.floor(goal.getTime() / 1000);
        return Math.max(goalSeconds - currentSeconds, 0);
    }
}

function addCounter(goal, title = null) {
    const countersDiv = document.getElementById("counters");
    const currentDiv = countersDiv.innerHTML;
    const added = new Counter(goal, title);
    countersDiv.innerHTML = currentDiv + 
        '<div class="full-counter-container" id="' + added.containerID + '">' +
        '<div class="counter-titlebar">' +
        '<h3 class="counter-title" id="' + added.titleID + '">' + added.title + '</h3>' +
        '<img class="counter-remove-icon" src="assets/ic_delete_24px.svg" alt="Delete this counter" title="Delete this counter" id="' + 
        added.removeID + `" onclick="deleteCounter('` + added.div + `')">` +
        '</div>' +
        '<div id="' + added.div + '" class="counter-wrapper"></div>' +
        '</div>';
    return added;
}

function LSLoad() {
    var ls = window.localStorage;
    var data = ls.getItem("counters");
    if (data === null) {
        return false;
    }
    while (counters.length > 0) {
        counters[0].delete();
    }
    var jsonData = JSON.parse(data);
    for (let i = 0; i < jsonData.length; i++) {
        addCounter(new Date(jsonData[i].goal), jsonData[i].title);
    }
    return true;
}

function LSSave() {
    var ls = window.localStorage;
    var result = [];
    for (let i = 0; i < counters.length; i++) {
        var current = counters[i];
        result.push({
            goal: current.goal.toString(),
            title: current.title
        });
    }
    ls.setItem("counters", JSON.stringify(result));
}

function deleteCounter(divID) {
    for (let i = 0; i < counters.length; i++) {
        var candidate = counters[i];
        if (candidate.div === divID) {
            candidate.delete();
        }
    }
}

function renderCounters() {
    if (counters.length === 0) {
        var countersDiv = document.getElementById("counters");
        countersDiv.innerHTML = 'No counters';
    } else {
        for (let i = 0; i < counters.length; i++) {
            counters[i].render();
        }
    }
    LSSave();
}

function userAddCounter() {
    const messageElement = document.getElementById("new-counter-message");
    const titleElement = document.getElementById("new-counter-title");
    const dateElement = document.getElementById("new-counter-date");
    const timeElement = document.getElementById("new-counter-time");
    const title = titleElement.value == "" ? null : titleElement.value;
    const date = dateElement.value;
    const time = timeElement.value;
    if (date == "") {
        messageElement.innerHTML = "Please input a goal date and time";
    } else {
        addCounter(new Date(date + "T" + time + minutesToTimezone(new Date().getTimezoneOffset())), title);
        toggleCreateDialog("close");
    }
}

function minutesToTimezone(initialMinutes) {
    const sign = initialMinutes > 0 ? "-" : "+";
    initialMinutes = Math.abs(initialMinutes);
    const minutes = initialMinutes % 60;
    const hours = Math.floor(initialMinutes / 60);
    return sign + zeroPadding(hours) + ":" + zeroPadding(minutes);
}

function zeroPadding(i) {
    if (i.toString().length == 1) {
        return "0" + i;
    } else {
        return i;
    }
}

function toggleCreateDialog(action) {
    var dialog = document.getElementById("new-counter");
    var icon = document.getElementById("create-icon");
    dialog.style.display = action == "show" ? "grid" : "none";
    icon.style.display = action == "show" ? "none" : "inline";

}

function init() {
    setInterval(renderCounters, 500);
    var createIconElement = document.getElementById("create-icon");
    var createCounterButton = document.getElementById("new-counter-add-button");
    createIconElement.addEventListener("click", function() { toggleCreateDialog("show"); });
    createCounterButton.addEventListener("click", userAddCounter);
    if (!LSLoad()) {
        addCounter(new Date(2020, 0, 1), "New Year 2020");
        addCounter(new Date(2126, 9, 16, 13, 14, 15), "Next total solar eclipse in Finland");
    }
    renderCounters();
}

onload = init;