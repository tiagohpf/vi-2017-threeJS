$(window).load(function () {
    $("#title").css("visibility", "visible");
    actualInfo = data.slice();
    putIdsInSelect();
    updateOutput();
    setMaxsMins();
});

var data = [];
var actualInfo = [];

function loadData() {
    return $.getJSON('data/data.json');
}

loadData().done(function (json) {
    for (var i in json) {
        for (var j in json[i]) {
            data.push(json[i][j]);
            actualInfo.push(json[i][j]);
        }
    }
});

function putIdsInSelect() {
    var selectBox = document.getElementById('idSelector');
    var ids = [];
    for (var i in data) {
        if(ids.indexOf(data[i].id) == -1)
            ids.push(data[i].id);
    }
    ids.sort()
    for (var i in ids)
        selectBox.options.add(new Option(ids[i], ids[i], false));
}

function setMaxsMins() {
    $("#minWeight").val(getMinWeight());
    $("#maxWeight").val(getMaxWeight());
    $("#minWeight").slider("refresh");
    $("#maxWeight").slider("refresh");
    $("#minSpeed").val(getMinSpeed());
    $("#maxSpeed").val(getMaxSpeed());
    $("#minSpeed").slider("refresh");
    $("#maxSpeed").slider("refresh");
}

function filterSearch() {
    alert("ID: " + $("#idSelector").val() + "\n" +
        "Coordenadas: " + $("#latitude").val() + ", " + $("#longitude").val() + "\n" +
        "Peso: " + $("#minWeight").val() + ", " + $("#maxWeight").val() + "\n" +
        "Velocidade: " + $("#minSpeed").val() + ", " + $("#maxSpeed").val());

    var newIds = getNewId($("#idSelector").val());
    var newLatitudes = getNewLatitude($("#latitude").val());
    var newLongitude = getNewLongitude($("#longitude").val());
    var newWeight = getNewWeight($("#minWeight").val(), $("#maxWeight").val());
    var newSpeed = getNewSpeed($("#minSpeed").val(), $("#maxSpeed").val());

    actualInfo = [];

    for (var i in data) {
        if (newIds.indexOf(data[i]) != -1
            && newLatitudes.indexOf(data[i]) != -1 && newLongitude.indexOf(data[i]) != -1
            && newWeight.indexOf(data[i]) != -1 && newSpeed.indexOf(data[i]) != -1) {
            actualInfo.push(data[i]);
        }
    }

    updateOutput();
}

function getMinWeight() {
    var min = Number.MAX_VALUE;
    for (var i in data) {
        if (data[i].weight < min)
            min = data[i].weight;
    }
    return min;
}

function getMaxWeight() {
    var max = Number.MIN_VALUE;
    for (var i in data) {
        if (data[i].weight > max)
            max = data[i].weight;
    }
    return max;
}

function getMinSpeed() {
    var min = Number.MAX_VALUE;
    for (var i in data) {
        if (data[i].speed < min)
            min = data[i].speed;
    }
    return min;
}

function getMaxSpeed() {
    var max = Number.MIN_VALUE;
    for (var i in data) {
        if (data[i].speed > max)
            max = data[i].speed;
    }
    return max;
}

function getNewId(newId) {
    if (newId == 'all')
        return data;
    else
        return data.filter(function (row) {
            return row.id == newId;
        });
}

function getNewLatitude(newLatitude) {
    if (newLatitude.trim().length == 0)
        return data;
    else
        return data.filter(function (row) {
            return row.latitude == newLatitude;
        });
}

function getNewLongitude(newLongitude) {
    if (newLongitude.trim().length == 0)
        return data;
    else
        return data.filter(function (row) {
            return row.longitude == newLongitude;
        });
}

function getNewWeight(newMinWeight, newMaxWeight) {
    return data.filter(function (row) {
        return row.weight >= newMinWeight && row.weight <= newMaxWeight;
    });
}

function getNewSpeed(newMinSpeed, newSpeed) {
    return data.filter(function (row) {
        return row.speed >= newMinSpeed && row.speed <= newSpeed;
    });
}

function updateOutput() {
    $("#output").empty();
    $("#output").append("<p>" + JSON.stringify(actualInfo) + "</p>");
}

function resetSearch() {
    document.getElementById('searchFilterForm').reset();
    setMaxsMins();
}