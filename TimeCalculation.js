const data = require("../src/stops-data");
const moment = require("moment");

const TimeObj = function (stopId, line) {
    const arr = data[stopId].lines.filter(o => o.lineName === line);
    if (arr.length === 1) {
        return arr[0];
    } else {
        return null;
    }
}
const TimeLeft = function (stopId, line, date, time) {

    const times = TimeObj(stopId, line).times.sort((a, b) => {
        return parseInt(a.split(":")[0]) - parseInt(b.split(":")[0]);
    });

    const today = moment(`${date} ${time}`, 'YYYY-MM-DD hh:mm a');

    const timeLeft = times.filter(str => {
        return moment(`${today.format("YYYY-MM-DD")} ${str}`, 'YYYY-MM-DD hh:mm a').isAfter(today, 'minute');
    })
    // console.log(timeLeft)
    if (timeLeft.length === 0) {
        // check next days
        const tomorrowObj = today.clone();
        tomorrowObj.add(1, "day")
        const tomorrow = moment(`${tomorrowObj.format("YYYY-MM-DD")} ${times[0]}`, "YYYY-MM-DD hh:mm");
        // console.log("today: ", today)
        // console.log("tomorrow: ", tomorrow)
        const diff = tomorrow.diff(today);
        const difDur = moment.duration(diff);
        const min = difDur.hours() * 60 + difDur.minutes();
        return min;
    } else if (timeLeft.length >= 1) {
        // check next time today
        const whenStop = moment(`${today.format("YYYY-MM-DD")} ${timeLeft[0]}`, "YYYY-MM-DD hh:mm:ss")
        const diff = whenStop.diff(today)
        const difDur = moment.duration(diff)
        const min = difDur.hours() * 60 + difDur.minutes()
        return min;
    } else {
        return -1;
    }

}

console.log(TimeLeft(0, "C1B", "2018-04-28", "10:00:00 AM"));
console.log(TimeLeft(0, "C1B", "2018-04-28", "10:00:00 PM"));
console.log(TimeLeft(0, "C1B", "2018-04-28", "12:30:00 AM"));


console.log(TimeLeft(0, "E1", "2018-04-22", "10:00:00 PM"));

console.log(TimeLeft(0, "E2", "2018-04-22", "12:00:00 PM"));

console.log(TimeLeft(0, "HeritageExpressWeekdays", "2018-05-07", "5:00:00 AM"));

console.log(TimeLeft(16, "C2", "2018-05-07", "11:20:00 PM"));
