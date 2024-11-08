import puppeter from "puppeteer";
import * as fs from "fs";
import readline from "readline";
import xlsx from "xlsx";
const major = [
    "SISTEM INFORMASI",
    "TEKNOLOGI INFORMASI",
    "TEKNIK INFORMATIKA",
    "TEKNIK KOMPUTER",
    "PENDIDIKAN TEKNOLOGI INFORMASI"
]

const readExcel = (filePath) => {
    const file = xlsx.readFile(filePath);
    let data = []
    const sheets = file.SheetNames
    for (let i = 0; i < sheets.length; i++) {
        const temp = xlsx.utils.sheet_to_json(file.Sheets[file.SheetNames[i]])
        data.push(temp)
    }
    // console.log(data);
    
    return data[0];
}




const DumyData = [
    "Mohamad Rizky Isa",
    "Sofyan Isa",
    "Kasmawaty Wartabone"
]

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});


const checkData = async (params,lokasi) => {
    let baseURL = `https://pddikti.kemdikbud.go.id/search/mahasiswa/${params}`;
    const browser = await puppeter.launch({
        headless: false,
        // args: ['--no-startup-window']

    });
    const page = await browser.newPage();
    await page.goto(baseURL, {
        waitUntil: "networkidle0",
        timeout: 60000
    });
    // ambil element jurusan
    const tableElement = await page.$('table tr:nth-child(1) td:nth-child(4)');
    // ambil text
    const text = await page.evaluate(tableElement => tableElement.textContent, tableElement);
    // output
    await browser.close();
    return {
        nama:params,
        jurusan:text,
        lokasi:lokasi
    }
};

const inputData = async () => {
    console.log("*** Selamat Datang di CPNS Competitor Checker V.1.1  ***");
    console.log("*** DI KEMBANGKAN OLEH : MOHAMAD RIZKY ISA ***");
    console.log("------------------------------------------------")
    while (true) {
        let greetUser = `${await new Promise(resolve => rl.question('Masukkan nama Anda: ', resolve))}`;
        console.log(await checkData(greetUser));
    }
    rl.close();
}

const scannerWithOutputExcel = async () => {
    const result = [];
    const dataExcel = readExcel("./data/dataset.xlsx")
    // console.log(dataExcel[1482]);
    
    for (let i = 80; i < 100; i++) {
        console.time('checkDataProcess');
        try {
            const res = await checkData(dataExcel[i].Nama,dataExcel[i].Lokasi);
            if (major.includes(res.jurusan.toUpperCase())) {
                result.push(res);
                console.log(` ${dataExcel[i].Nama} jurusan : ${res.jurusan} Titik Lokasi : ${dataExcel[i].Lokasi} `);
            } else {
                console.log(` ${dataExcel[i].Nama} tidak termasuk jurusan yang diinginkan.`);
            }
        } catch (err) {
            console.log(err);
        }
        console.timeEnd('checkDataProcess');
    } 
    const ws = xlsx.utils.json_to_sheet(result);
    const wb = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, 'Sheet1');
    xlsx.writeFile(wb, 'hasil.xlsx');
}


inputData()
// scannerWithOutputExcel();

