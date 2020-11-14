
export const baseUrl = 'http://172.20.10.14';

export function waitFor(conditionFunction) {
    const poll = resolve => {
        if (conditionFunction()) {
            resolve();
        } else {
            setTimeout(function () {
                poll(resolve);
            }, 50);
        }
    };

    return new Promise(poll);
}

export function updateTreeContent(object, pathArray, replace) {
    Object.keys(object).forEach(function (k) {
        if (object[k] && typeof object[k] === 'object') {
            return updateTreeContent(object[k], pathArray, replace)
        }
        var currentPath = pathArray[0];
        if (object["type"] == "dir" && k == "name" && object[k] === currentPath) {
            if (pathArray.length == 1) {
                object["contents"] = replace[0]["contents"]
            } else {
                pathArray.shift();
                return updateTreeContent(object[k], pathArray, replace)
            }
        }
    });
}

export function triFichiers(tab) {
    tab.forEach(function (el) {
        if (el.type == 'dir' && el.contents.length) {
            triFichiers(el.contents);
        }
    });
    triParNom(tab);
    triParType(tab);
}

export function triParNomInverse(tab) {
    tab.sort(function (a, b) {
        return b.name.localeCompare(a.name);
    });
}

export function triParNom(tab) {
    tab.sort(function (a, b) {
        return a.name.localeCompare(b.name);
    });
}


export function triParType(tab) {
    tab.sort(function (a, b) {
        return a.type.localeCompare(b.type);
    });
}


export function sumByKey(value, key) {
    return _.sumBy(value, key);
}

export function sumFlightsDuration(flights) {
    let dur = "00:00:00";
    flights.forEach((d) => {
        dur = getTimeInterval(d.start_flight_time, d.end_flight_time, dur);
    });
    return dur;
}

export function sumDuration(data) {
    let dur = "00:00:00";
    const start = "00:00:00";
    data.forEach((d) => {
        dur = getTimeInterval(start, d.duration, dur);
    });
    return dur;
}

export function getTimeInterval(startTime, endTime, addTime) {
    var start = moment(startTime, "HH:mm:ss");
    var end = moment(endTime, "HH:mm:ss");
    var seconds = end.diff(start, 'seconds');
    var interval = moment().hour(0).minute(0).second(seconds);
    var delta = moment.duration(addTime).asSeconds()
    interval.add(delta, "s");
    return interval.format("HH:mm:ss");
}


export function compareFlight(a, b) {
    if (a.flight_date > b.flight_date) {
        return -1;
    }
    if (a.flight_date < b.flight_date) {
        return 1;
    }

    if (a.start_flight_time < b.start_flight_time) {
        return -1;
    }
    if (a.start_flight_time > b.start_flight_time) {
        return 1;
    }
    return 0;
}