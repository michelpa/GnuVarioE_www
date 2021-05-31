
const smooth = require("./smooth.js");

function distance(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1); // deg2rad below
    var dLon = deg2rad(lon2 - lon1);
    var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}

export function getSeriesFromIgcData(data, $i18n) {
    //les données pour le graph altitude
    let da = data.pressureAltitude.map((a, i) => [
        data.recordTime[i].getTime(),
        a,
    ]);

    //les données pour le graph vitesse
    let nbVal = data.latLong.length;
    let speed = [];
    let climbRate = [];
    for (var i = 1; i < nbVal; i++) {
        var dist = distance(
            data.latLong[i - 1][0],
            data.latLong[i - 1][1],
            data.latLong[i][0],
            data.latLong[i][1]
        );
        var altDiff =
            data.pressureAltitude[i] - data.pressureAltitude[i - 1];
        var interv =
            (data.recordTime[i].getTime() -
                data.recordTime[i - 1].getTime()) /
            1000;

        var temps = interv / 3600;

        var sp = (dist / temps).toFixed(2);

        var climbRateUnit = altDiff / interv;
        climbRate.push([data.recordTime[i - 1].getTime(), climbRateUnit]);
        speed.push([data.recordTime[i - 1].getTime(), sp]);
    }
    speed.push([data.recordTime[nbVal - 1].getTime(), sp]);
    const windowSize = 2;
    const getter = (item) => parseFloat(item[1]);
    const setter = (item, itemSomoothed) => [item[0], itemSomoothed.toFixed(2)];
    const arrSmoothed = smooth(speed, windowSize, getter, setter);
    const climbSmoothed = smooth(climbRate, 1, getter, setter);

    return [
        {
            name: $i18n.t("mesvols.ALTITUDE"),
            data: da,
            type: "area",
        },
        {
            name: $i18n.t("mesvols.SPEED"),
            data: arrSmoothed,
            //type: "line"
        },
        {
            name: $i18n.t("mesvols.CLIMBRATE"),
            data: climbSmoothed,
            //type: "bar",
        },
    ];
}

export function getChartOptions(altMin, altMax, $i18n) {
    return {
        chart: {
            id: "vuechart-example",
            type: "line",
        },
        fill: {
            type: "solid",
            opacity: [0.35, 1],
        },
        stroke: {
            show: true,
            curve: ["smooth", "smooth", "smooth"],
            lineCap: "butt",
            colors: "#17A2B8",
            width: 2,
            dashArray: 0,
        },
        dataLabels: {
            enabled: false,
        },
        xaxis: {
            type: "datetime",
            title: {
                text: $i18n.t("mesvols.TIME"),
            },
            axisTicks: {
                show: true,
                borderType: "solid",
                color: "#666",
                height: 10,
                offsetX: 0,
                offsetY: -5,
            },

            labels: {
                show: true,
                // eslint-disable-next-line
                formatter: function (value, timestamp, index) {
                    return moment(new Date(timestamp)).format("HH:mm:ss");
                },
            },
        },
        yaxis: [
            {
                forceNiceScale: true,
                min: altMin - 50,
                max: altMax + 50,
                labels: {
                    show: true,
                    // eslint-disable-next-line
                    formatter: function (value, val, index) {
                        return value + " m";
                    },
                },
                title: {
                    text: $i18n.t("mesvols.ALTITUDE"),
                },
            },
            {
                opposite: true,
                labels: {
                    show: true,
                    // eslint-disable-next-line
                    formatter: function (value, val, index) {
                        return value + " km/h";
                    },
                },
                title: {
                    text: $i18n.t("mesvols.SPEED"),
                },
            },
            {
                // opposite: true,
                labels: {
                    show: true,
                    // eslint-disable-next-line
                    formatter: function (value, val, index) {
                        return value + " m/s";
                    },
                },
                title: {
                    text: $i18n.t("mesvols.CLIMBRATE"),
                },
            },
        ],
    }
}