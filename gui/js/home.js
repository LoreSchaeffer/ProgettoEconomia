const query = require('querystring');
const data = JSON.parse(decode_b64(query.parse(global.location.search)['?data']));

let bManufacturers = [];
let rHost = [];
let bStorages = [];
let rStorages = [];
let bRam = [];
let rRam = [];
let bCores = [];
let rCores = [];

data.buy.forEach((item) => {
    if (!bManufacturers.includes(item.manufacturer))
        bManufacturers.push(item.manufacturer);
    if (!bStorages.includes(item.storage))
        bStorages.push(item.storage);
    if (!bRam.includes(item.ram))
        bRam.push(item.ram);
    if (!bCores.includes(item.cores))
        bCores.push(item.cores);
});

data.rent.forEach((item) => {
    if (!rHost.includes(item.host))
        rHost.push(item.host);
    if (!rStorages.includes(item.storage))
        rStorages.push(item.storage);
    if (!rRam.includes(item.ram))
        rRam.push(item.ram);
    if (!rCores.includes(item.cores))
        rCores.push(item.cores);
});

const optionHTML = `<div class="btn-group" role="group" aria-label="Type selector">
    <button id="rentSelector-{id}" type="button" class="btn btn-primary type-selector">Rent</button>
    <button id="buySelector-{id}" type="button" class="btn btn-primary type-selector">Buy</button>
</div>
<form id="rentForm-{id}" class="server-form">
    <div class="row">
        <div class="col-4">
            <label for="hostSelector-{id}" class="form-label">Host</label>
        </div>
        <div class="col-8">
            <select id="hostSelector-{id}" class="form-select form-select-sm" aria-label="Host"></select>
        </div>
    </div>
    <div class="row">
        <div class="col-4">
            <label for="rStorageSelector-{id}" class="form-label">Storage</label>
        </div>
        <div class="col-8">
            <select id="rStorageSelector-{id}" class="form-select form-select-sm" aria-label="Storage"></select>
        </div>
    </div>
    <div class="row">
        <div class="col-4">
            <label for="rRamSelector-{id}" class="form-label">RAM</label>
        </div>
        <div class="col-8">
            <select id="rRamSelector-{id}" class="form-select form-select-sm" aria-label="Ram"></select>
        </div>
    </div>
    <div class="row">
        <div class="col-4">
            <label for="rCoresSelector-{id}" class="form-label">CPU Cores</label>
        </div>
        <div class="col-8">
            <select id="rCoresSelector-{id}" class="form-select form-select-sm" aria-label="Cores"></select>
        </div>
    </div>
    <div class="row">
        <div class="col-4">
            <label for="rPrice-{id}" class="form-label">Monthly Price</label>
        </div>
        <div class="col-8">
            <input id="rPrice-{id}" type="text" class="form-control form-control-sm" aria-label="Monthly Price" readonly/>
        </div>
    </div>
</form>

<form id="buyForm-{id}" class="server-form">
    <div class="row">
        <div class="col-4">
            <label for="manufacturerSelector-{id}" class="form-label">Manufacturer</label>
        </div>
        <div class="col-8">
            <select id="manufacturerSelector-{id}" class="form-select form-select-sm" aria-label="Manufacturer"></select>
        </div>
    </div>
    <div class="row">
        <div class="col-4">
            <label for="bStorageSelector-{id}" class="form-label">Storage</label>
        </div>
        <div class="col-8">
            <select id="bStorageSelector-{id}" class="form-select form-select-sm" aria-label="Storage"></select>
        </div>
    </div>
    <div class="row">
        <div class="col-4">
            <label for="bRamSelector-{id}" class="form-label">RAM</label>
        </div>
        <div class="col-8">
            <select id="bRamSelector-{id}" class="form-select form-select-sm" aria-label="Ram"></select>
        </div>
    </div>
    <div class="row">
        <div class="col-4">
            <label for="bCoresSelector-{id}" class="form-label">CPU Cores</label>
        </div>
        <div class="col-8">
            <select id="bCoresSelector-{id}" class="form-select form-select-sm" aria-label="Cores"></select>
        </div>
    </div>
    <div class="row">
        <div class="col-4">
            <label for="bPrice-{id}" class="form-label">Price</label>
        </div>
        <div class="col-8">
            <input id="bPrice-{id}" type="text" class="form-control form-control-sm" aria-label="Price" readonly/>
        </div>
    </div>
</form>`;

const newOption = $('#newOption');
const chartCanvas = $('#chart');
const optionsContainer = $('#optionsContainer');
const chartCtx = chartCanvas[0].getContext('2d');

const colors = ['#ffeb3b', '#0f9d58', '#dc3545', '#4285f4'];
let options = [];
let datasets = [];
let lastId = 0;
let chart;

$(window).ready(() => {
    createDefOption();
});

newOption.click(() => {
    createOption(lastId++, null);

    resizeOptions();

    if (options.length >= 4) newOption.attr('disabled', true);
    else newOption.attr('disabled', false);
});

function createOption(id, server) {
    options.push(id);
    const name = options.length;

    let html = `<div id="option-${id}" class="option col-${getOptionsSize()}">`;
    html += `<a id="removeOption-${id}" class="remove-option" data-id="${id}"><i class="fas fa-times"></i></a>`;
    html += `<h4>Option ${name}</h4>`;
    html += optionHTML.replace(/\{id\}/g, id);
    html += '</div>';

    optionsContainer.append($(html));

    const removeOption = $('#removeOption-' + id);
    const rentSelector = $('#rentSelector-' + id);
    const buySelector = $('#buySelector-' + id);
    const rentForm = $('#rentForm-' + id);
    const buyForm = $('#buyForm-' + id);
    const hostSelector = $('#hostSelector-' + id);
    const rStorageSelector = $('#rStorageSelector-' + id);
    const rRamSelector = $('#rRamSelector-' + id);
    const rCoresSelector = $('#rCoresSelector-' + id);
    const rPrice = $('#rPrice-' + id);
    const manufacturerSelector = $('#manufacturerSelector-' + id);
    const bStorageSelector = $('#bStorageSelector-' + id);
    const bRamSelector = $('#bRamSelector-' + id);
    const bCoresSelector = $('#bCoresSelector-' + id);
    const bPrice = $('#bPrice-' + id);

    rHost.forEach((host) => {
        hostSelector.append(`<option value="${host}">${host}</option>`);
    });
    rStorages.forEach((storage) => {
        rStorageSelector.append(`<option value="${storage}">${storage} GB</option>`);
    });
    rRam.forEach((ram) => {
        rRamSelector.append(`<option value="${ram}">${ram} GB</option>`);
    });
    rCores.forEach((cores) => {
        rCoresSelector.append(`<option value="${cores}">${cores}</option>`);
    });
    bManufacturers.forEach((manufacturer) => {
        manufacturerSelector.append(`<option value="${manufacturer}">${manufacturer}</option>`);
    });
    bStorages.forEach((storage) => {
        bStorageSelector.append(`<option value="${storage}">${storage} GB</option>`);
    });
    bRam.forEach((ram) => {
        bRamSelector.append(`<option value="${ram}">${ram} GB</option>`);
    });
    bCores.forEach((cores) => {
        bCoresSelector.append(`<option value="${cores}">${cores}</option>`);
    });

    removeOption.click(() => {
        if (options.length === 1) return;

        removeOption.parent().remove();

        const currentId = parseInt(removeOption.attr('data-id'));
        options.splice(options.indexOf(currentId), 1);

        resizeOptions();
        renameOptions();

        if (options.length < 4) newOption.attr('disabled', false);
    });

    rentSelector.click(() => {
        buySelector.removeClass('active');
        rentSelector.addClass('active');

        buyForm.removeClass('active');
        rentForm.addClass('active');

        updatePrice(id);
        updateChart(id, name);
    });
    buySelector.click(() => {
        rentSelector.removeClass('active');
        buySelector.addClass('active');

        rentForm.removeClass('active');
        buyForm.addClass('active');

        updatePrice(id);
        updateChart(id, name);
    });

    hostSelector.on('change', () => {
        updatePrice(id);
        updateChart(id, name);
    });
    rStorageSelector.on('change', () => {
        updatePrice(id)
        updateChart(id, name);
    });
    rRamSelector.on('change', () => {
        updatePrice(id)
        updateChart(id, name);
    });
    rCoresSelector.on('change', () => {
        updatePrice(id)
        updateChart(id, name);
    });
    rPrice.on('change', () => {
        updatePrice(id)
        updateChart(id, name);
    });
    manufacturerSelector.on('change', () => {
        updatePrice(id)
        updateChart(id, name);
    });
    bStorageSelector.on('change', () => {
        updatePrice(id)
        updateChart(id, name);
    });
    bRamSelector.on('change', () => {
        updatePrice(id)
        updateChart(id, name);
    });
    bCoresSelector.on('change', () => {
        updatePrice(id)
        updateChart(id, name);
    });

    if (server != null) {
        if (server.rent) {
            buySelector.removeClass('active');
            rentSelector.addClass('active');

            buyForm.removeClass('active');
            rentForm.addClass('active');

            hostSelector.select(server.host);
            rStorageSelector.select(server.storage);
            rRamSelector.select(server.ram);
            rCoresSelector.select(server.cores);
            rPrice.val(server.price);
        } else {
            rentSelector.removeClass('active');
            buySelector.addClass('active');

            rentForm.removeClass('active');
            buyForm.addClass('active');

            manufacturerSelector.select(server.manufacturer);
            bStorageSelector.select(server.storage);
            bRamSelector.select(server.ram);
            bCoresSelector.select(server.cores);
            bPrice.val(server.price);
        }
    }
}

const formatter = new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2
});

function updatePrice(id) {
    const rent = $('#rentSelector-' + id).hasClass('active');
    const priceField = rent ? $('#rPrice-' + id) : $('#bPrice-' + id);
    let price = 0.0;

    if (rent) {
        const hostSelector = $('#hostSelector-' + id);
        const rStorageSelector = $('#rStorageSelector-' + id);
        const rRamSelector = $('#rRamSelector-' + id);
        const rCoresSelector = $('#rCoresSelector-' + id);

        data.rent.forEach((server) => {
            if (server.host === hostSelector.val() && server.storage === rStorageSelector.val() && server.ram === rRamSelector.val() && server.cores === rCoresSelector.val()) {
                price = server.price;
            }
        });
    } else {
        const manufacturerSelector = $('#manufacturerSelector-' + id);
        const bStorageSelector = $('#bStorageSelector-' + id);
        const bRamSelector = $('#bRamSelector-' + id);
        const bCoresSelector = $('#bCoresSelector-' + id);

        data.buy.forEach((server) => {
            if (server.manufacturer === manufacturerSelector.val() && server.storage === bStorageSelector.val() && server.ram === bRamSelector.val() && server.cores === bCoresSelector.val()) {
                price = server.price;
            }
        });
    }

    priceField.val(formatter.format(price));
}

function updateChart(id, name) {
    const rent = $('#rentSelector-' + id).hasClass('active');
    const price = rent ? $('#rPrice-' + id).val() : $('#bPrice-' + id).val();
    const data = [];

    if (rent) {
        for (let month = 1; month <= 24; month++) {
            data.push(parseFloat(price) * month);
        }
    } else {
        return;
    }

    const dataset = getDataset(id, 'Option ' + name, colors[id], data);
    datasets.push(dataset);
    if (!createChart(getChartConfig(getChartData(dataset)))) {
        updateData(dataset);
    }
}

function createDefOption() {
    createOption(lastId, null);
    lastId++;
}

function resizeOptions() {
    options.forEach((id) => {
        $('#option-' + id).removeClass('col-6').removeClass('col-4').removeClass('col-3').addClass('col-' + getOptionsSize());
    });
}

function renameOptions() {
    let index = 0;
    options.forEach((id) => {
        console.log('Renaming option ' + id + ' to ' + (index + 1));
        $('#option-' + id).find('h4').text('Option ' + ++index);
    });
}

function getOptionsSize() {
    if (options.length <= 2) return 6;
    else if (options.length === 3) return 4;
    else if (options.length === 4) return 3;
    return 6;
}

function createChart(chartConfig) {
    if (chart != null) return false;
    chart = new Chart(chartCtx, chartConfig);
    return true;
}

function getChartConfig(chartData) {
    return {
        type: 'line',
        data: chartData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                },
                title: {
                    display: false,
                    text: ''
                }
            }
        },
    };
}

function getChartData(datasets) {
    if (!Array.isArray(datasets)) datasets = [datasets];

    return {
        labels: getLabels(24),
        datasets: datasets
    }
}

function getLabels(size) {
    let date = new Date();

    let labels = [];

    for (let i = 0; i < size; i++) {
        let newDate = date;
        newDate = new Date(newDate.setMonth(newDate.getMonth() + i));
        labels.push(newDate.toLocaleString('en-us', {month: 'long'}) + ' ' + newDate.getFullYear());
    }

    return labels;
}

function getDataset(id, label, color, data) {
    return {
        id: id,
        label: label,
        data: data,
        borderColor: color,
        backgroundColor: color
    }
}

function updateData(data) {
    let dataset;
    chart.data.datasets.forEach((ds) => {
        if (ds.id === data.id) dataset = ds;
    });

    if (dataset != null) {
        dataset.data = data.data;
    } else {
        chart.data.datasets.push(data);
    }

    chart.update();
}

function removeData(data) {
    chart.data.labels.pop();
    chart.data.datasets.splice(chart.data.datasets.indexOf(data), 1);
    chart.update();
}