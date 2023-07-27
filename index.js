const http = require('http');
let fs = require('fs');
const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
});

server.listen(port, hostname, () => {
    createFile();
    transformData();
    server.close();
});

function appendText(text) {
    fs.appendFileSync('чеки_по_папкам.txt', text, function (error) {
        if (error) throw error;
    });
}

function createFile() {
    if (fs.existsSync('чеки_по_папкам.txt')) {
        fs.truncateSync('чеки_по_папкам.txt');
    } else {
        fs.open('чеки_по_папкам.txt', 'w', (err) => {
            if (err) throw err;
        });
        console.log('чеки_по_папкам.txt created');
    }
}

function appendServicesUnpaid(servicesUnpaid) {
    appendText(`не оплачены:\r\n`);
    for (var el in servicesUnpaid) {
        let index = 0;
        appendText(`${el}:\r\n`);
        while (servicesUnpaid[el][index]) {
            appendText(`${servicesUnpaid[el][index]}\r\n`);
            index++;
        }
    }
}

let fileContent = fs.readFileSync('чеки.txt', 'utf8');
let data = fileContent.split('\n');
var months = ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'];

function getServices() {
    let services = [];
    data.forEach(string => {
        if (string == '') {
            return
        }
        let service = string.split('_')[0];
        if (!services.includes(service)) services.push(service);
    })
    if (services.length > 1) {
        services.splice(0, 1);
    }
    return services;
}

function transformData() {
    let services = getServices();
    var transferedData = [];
    let servicesUnpaid = [];
    months.forEach((month) => {
        let servicesPaid = [];
        data.forEach((string) => {
            if (string.includes(month)) {
                let service = string.split('_')[0];
                servicesPaid.push(service);
                transferedData.push(`/${month}/${string}\r\n`);
            }
        })
        let servicesUnpaidMonth = services.filter(el => !servicesPaid.includes(el))
        if (servicesUnpaidMonth.length > 0) {
            servicesUnpaid[month] = servicesUnpaidMonth;
        }
    })
    transferedData.forEach((string) => appendText(string));
    if (Object.keys(servicesUnpaid).length > 0) {
        appendServicesUnpaid(servicesUnpaid);
    }
}
