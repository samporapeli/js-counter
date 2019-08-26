var counters = [];

class Counter {
    constructor(div, goal) {
        this.div = div;
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
    render() {
        const html = this.html(this.timeDifference(this.goal));
        const element = document.getElementById(this.div);
        element.innerHTML = html;
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
            counterBlock + this.zeroPadding(d) +
            counterDescription + "days" +
            closingDivs + counterBlock + this.zeroPadding(h) +
            counterDescription + "hours" +
            closingDivs + counterBlock + this.zeroPadding(m) +
            counterDescription + "minutes" +
            closingDivs + counterBlock + this.zeroPadding(s) + 
            counterDescription + "seconds" + closingDivs
        );
    }
    zeroPadding(i) {
        if (i.toString().length == 1) {
            return "0" + i;
        } else {
            return i;
        }
    }
    timeDifference(goal) {
        var currentTime = new Date();
        var currentSeconds = Math.floor(currentTime.getTime() / 1000);
        var goalSeconds = Math.floor(goal.getTime() / 1000);
        return Math.max(goalSeconds - currentSeconds, 0);
    }
}

function renderCounters() {
    for (let i = 0; i < counters.length; i++) {
        counters[i].render();
    }
}

onload = setInterval(renderCounters, 500);
var counter1 = new Counter("counter1", new Date(2320, 2, 27, 18));
var counter2 = new Counter("counter2", new Date(2019, 11, 27, 22, 22, 22));