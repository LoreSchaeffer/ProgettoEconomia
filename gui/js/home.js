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
    <button id="rentSelector-{id}" type="button" class="btn btn-primary btn-sm type-selector">Noleggia</button>
    <button id="buySelector-{id}" type="button" class="btn btn-primary btn-sm type-selector">Acquista</button>
</div>
<form id="rentForm-{id}" class="server-form">
    <div class="row">
        <div class="col-5">
            <label for="hostSelector-{id}" class="form-label">Host</label>
        </div>
        <div class="col-7">
            <select id="hostSelector-{id}" class="form-select form-select-sm" aria-label="Host"></select>
        </div>
    </div>
    <div class="row">
        <div class="col-5">
            <label for="rStorageSelector-{id}" class="form-label">Storage</label>
        </div>
        <div class="col-7">
            <select id="rStorageSelector-{id}" class="form-select form-select-sm" aria-label="Storage"></select>
        </div>
    </div>
    <div class="row">
        <div class="col-5">
            <label for="rRamSelector-{id}" class="form-label">RAM</label>
        </div>
        <div class="col-7">
            <select id="rRamSelector-{id}" class="form-select form-select-sm" aria-label="Ram"></select>
        </div>
    </div>
    <div class="row">
        <div class="col-5">
            <label for="rCoresSelector-{id}" class="form-label">CPU Cores</label>
        </div>
        <div class="col-7">
            <select id="rCoresSelector-{id}" class="form-select form-select-sm" aria-label="Cores"></select>
        </div>
    </div>
    <div class="row">
        <div class="col-5">
            <label for="rPrice-{id}" class="form-label">Prezzo mensile</label>
        </div>
        <div class="col-7">
            <input id="rPrice-{id}" type="text" class="form-control form-control-sm" aria-label="Monthly Price"
                   readonly/>
        </div>
    </div>
</form>

<form id="buyForm-{id}" class="server-form">
    <div class="row">
        <div class="col-5">
            <label for="manufacturerSelector-{id}" class="form-label">Produttore</label>
        </div>
        <div class="col-7">
            <select id="manufacturerSelector-{id}" class="form-select form-select-sm"
                    aria-label="Manufacturer"></select>
        </div>
    </div>
    <div class="row">
        <div class="col-5">
            <label for="bStorageSelector-{id}" class="form-label">Storage</label>
        </div>
        <div class="col-7">
            <select id="bStorageSelector-{id}" class="form-select form-select-sm" aria-label="Storage"></select>
        </div>
    </div>
    <div class="row">
        <div class="col-5">
            <label for="bRamSelector-{id}" class="form-label">RAM</label>
        </div>
        <div class="col-7">
            <select id="bRamSelector-{id}" class="form-select form-select-sm" aria-label="Ram"></select>
        </div>
    </div>
    <div class="row">
        <div class="col-5">
            <label for="bCoresSelector-{id}" class="form-label">CPU Cores</label>
        </div>
        <div class="col-7">
            <select id="bCoresSelector-{id}" class="form-select form-select-sm" aria-label="Cores"></select>
        </div>
    </div>
    <div class="row">
        <div class="col-5">
            <label for="bPrice-{id}" class="form-label">Prezzo</label>
        </div>
        <div class="col-7">
            <input id="bPrice-{id}" type="text" class="form-control form-control-sm" readonly/>
        </div>
    </div>
    <div class="row">
        <div class="col-5">
            <label for="bHousing-{id}" class="form-label">Housing <small>&euro; / mese</small></label>
        </div>
        <div class="col-7">
            <input id="bHousing-{id}" type="number" class="form-control form-control-sm" aria-label="Hosuing Cost"
                   min="0" step="0.01" value="0"/>
        </div>
    </div>
    <div class="row">
        <div class="col-5">
            <label for="bEnergy-{id}" class="form-label">Energia <small>&euro; / mese</small></label>
        </div>
        <div class="col-7">
            <input id="bEnergy-{id}" type="number" class="form-control form-control-sm" min="0" step="0.01" value="0"/>
        </div>
    </div>
    
    <div class="form-check">
        <input type="checkbox" class="form-check-input" id="bInstallment-{id}">
        <label class="form-check-label" for="bInstallment-{id}">Rateizzazione</label>
    </div>
    <div id="installmentBlock-{id}" class="installment-block">
        <div class="row">
            <div class="col-5">
                <label for="bInstallmentMonths-{id}" class="form-label"># Rate <small>mesi</small></label>
            </div>
            <div class="col-7">
                <input id="bInstallmentMonths-{id}" type="number" class="form-control form-control-sm" min="0" step="12" value="12"/>
            </div>
        </div>
        <div class="row">
            <div class="col-5">
                <label for="bInterests-{id}" class="form-label">Interessi <small>%</small></label>
            </div>
            <div class="col-7">
                <input id="bInterests-{id}" type="number" class="form-control form-control-sm" min="0" max="100" step="0.1" value="0"/>
            </div>
        </div>
    </div>
</form>`;

const newOption = $('#newOption');
const chartCanvas = $('#chart');
const optionsContainer = $('#optionsContainer');
const periodRange = $('#period');
const convenience = $('#convenience');
const periodOutput = $('#periodOutput');
const chartCtx = chartCanvas[0].getContext('2d');

const colors = ['#ffeb3b', '#0f9d58', '#dc3545', '#4285f4'];
const backgroundColors = ['rgba(255, 235, 59, 0.2)', 'rgba(15, 157, 88, 0.2)', 'rgba(220, 53, 69, 0.2)', 'rgba(66, 133, 244, 0.2)'];
let period = periodOutput.val() * 12;
let options = [];
let datasets = {};
let lastId = 0;
let chart;

$(window).ready(() => {
    createDefOption();

    periodOutput.text(periodRange.val());
    period = parseInt(periodRange.val()) * 12;
});

periodRange.on('input', () => {
    periodOutput.text(periodRange.val());
    period = parseInt(periodRange.val()) * 12;

    for (let i = 0; i < options.length; i++) {
        const option = options[i];

        updateChart(option, $('#option-' + option).attr('data-name'));
    }
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

    let html = `<div id="option-${id}" class="option col-${getOptionsSize()}" data-name="${name}">`;
    html += `<a id="removeOption-${id}" class="remove-option" data-id="${id}"><i class="fas fa-times"></i></a>`;
    html += `<h4>Opzione ${name}</h4>`;
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
    const bHousing = $('#bHousing-' + id);
    const bEnergy = $('#bEnergy-' + id);
    const bInstallment = $('#bInstallment-' + id);
    const bInstallmentBlock = $('#installmentBlock-' + id);
    const bInstallmentMonths = $('#bInstallmentMonths-' + id);

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

        if (datasets[currentId]) {
            delete datasets[currentId];
            removeData(datasets[currentId]);
        }

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
    bHousing.on('change', () => {
        updatePrice(id)
        updateChart(id, name);
    });
    bEnergy.on('change', () => {
        updatePrice(id)
        updateChart(id, name);
    });
    bInstallment.on('change', () => {
        if (bInstallment.is(':checked')) bInstallmentBlock.css('display', 'block');
        else bInstallmentBlock.css('display', 'none');

        updatePrice(id)
        updateChart(id, name);
    });
    bInstallmentMonths.on('change', () => {
        updatePrice(id)
        updateChart(id, name);
    });
    bInstallmentBlock.on('change', () => {
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
    priceField.attr('data-value', price);
}

function updateChart(id, name) {
    const rent = $('#rentSelector-' + id).hasClass('active');
    const price = parseFloat(rent ? $('#rPrice-' + id).attr('data-value') : $('#bPrice-' + id).attr('data-value'));
    const data = [];

    if (rent) {
        for (let month = 1; month <= period; month++) {
            data.push(price * month);
        }
    } else {
        const bHousing = parseFloat($('#bHousing-' + id).val());
        const bEnergy = parseFloat($('#bEnergy-' + id).val());
        const bInstallment = $('#bInstallment-' + id).is(':checked');
        const bInstallmentMonths = parseInt($('#bInstallmentMonths-' + id).val());
        const bInterests = parseFloat($('#bInterests-' + id).val()) / 100;

        if (bInstallment) {
            const monthlyPrice = price / bInstallmentMonths;
            const installment = (price * bInterests * bInstallmentMonths / 12) / bInstallmentMonths;

            for (let month = 1; month <= period; month++) {
                data.push((month < bInstallmentMonths ? (monthlyPrice + installment) * month : (price + installment * bInstallmentMonths)) + (bHousing + bEnergy) * month);
            }
        } else {
            for (let month = 1; month <= period; month++) {
                data.push(price + bHousing * month + bEnergy * month);
            }
        }
    }

    const dataset = getDataset(id, 'Opzione ' + name, colors[options.length - 1], backgroundColors[options.length - 1], data);
    datasets[id] = dataset;
    if (!createChart(getChartConfig(getChartData(dataset)))) {
        updateData(dataset);
    }

    updateConvenience();
}

function updateConvenience() {
    if (Object.keys(datasets).length <= 1) {
        convenience.text('');
        return;
    }

    let convenientOptions = {};

    for (let i = 0; i < period; i++) {
        let value = null;
        let convenientId = null;

        Object.keys(datasets).forEach((key) => {
            if (convenientId == null) {
                value = datasets[key].data[i];
                convenientId = datasets[key].label;
            } else if (datasets[key].data[i] < value) {
                value = datasets[key].data[i];
                convenientId = datasets[key].label;
            }
        });

        convenientOptions[i] = convenientId;
    }


    const fConvenientOptions = {};
    let size = 0;

    Object.keys(convenientOptions).forEach((key) => {
        if (size === 0) {
            fConvenientOptions[convenientOptions[key]] = key;
            size++;
        } else {
            if (Object.keys(fConvenientOptions)[size - 1] === convenientOptions[key]) {
                fConvenientOptions[convenientOptions[key]] = key;
            } else {
                fConvenientOptions[convenientOptions[key]] = key;
                size++;
            }
        }
    });


    console.log(fConvenientOptions);

    let text = '';

    if (size === 1) {
        text = 'La migliore opzione è l\'' + Object.keys(fConvenientOptions)[0].toLowerCase() + ' per tutto il periodo selezionato';
    } else {
        const labels = getLabels(period);
        let idx = 0;

        Object.keys(fConvenientOptions).forEach((key) => {
            if (idx === 0) {
                text = 'La migliore opzione è l\'' + key.toLowerCase() + ' fino al mese ' + labels[fConvenientOptions[key]];
            } else {
                if (idx === size - 1) {
                    text += ', l\'' + key.toLowerCase() + ' a seguire.';
                } else {
                    text += ', l\'' + key.toLowerCase() + ' fino al mese ' + labels[fConvenientOptions[key]];
                }
            }

            idx++;
        });
    }

    convenience.text(text);
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
        labels: getLabels(period),
        datasets: datasets
    }
}

function getLabels(size) {
    let date = new Date();

    let labels = [];

    for (let i = 0; i < size; i++) {
        if (i > 0) date = new Date(date.setMonth(date.getMonth() + 1));
        labels.push(date.toLocaleString('it-it', {month: 'long'}) + ' ' + date.getFullYear());
    }

    return labels;
}

function getDataset(id, label, color, backgroundColor, data) {
    return {
        id: id,
        label: label,
        data: data,
        borderColor: color,
        backgroundColor: backgroundColor,
        fill: false
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

    chart.data.labels = getLabels(period);

    chart.update();
}

function removeData(data) {
    chart.data.labels.pop();
    chart.data.datasets.splice(chart.data.datasets.indexOf(data), 1);
    chart.update();
}