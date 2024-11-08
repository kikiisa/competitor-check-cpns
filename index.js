import puppeter from "puppeteer";
import * as fs from "fs";
import readline from "readline";
import xlsx from "xlsx";
import { log } from "console";

const readExcel = (filePath) => {
    const file = xlsx.readFile(filePath);
    let data = []
    const sheets = file.SheetNames
    for (let i = 0; i < sheets.length; i++) {
        const temp = xlsx.utils.sheet_to_json(file.Sheets[file.SheetNames[i]])
        data.push(temp) 
    }
    return data[0];
}



const jsonData = JSON.parse(fs.readFileSync("./data/data.json", "utf-8"));

const DumyData = [
    "Mohamad Rizky Isa",
    "Sofyan Isa",
    "Kasmawaty Wartabone"
]

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});


const checkData = async (params) => {
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
    const result = `Nama : ${params}\n Jurusan: ${text}`
    await browser.close();
    return result
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
    const data = readExcel("./data/dataset.xlsx");
    DumyData.map(async(item) => {
        console.time('checkDataProcess');
        try {
            const res = await checkData(item);
            console.log(res);
        } catch (err) {
            console.log(err);
        }
        console.timeEnd('checkDataProcess');
    })
    
}

scannerWithOutputExcel();

