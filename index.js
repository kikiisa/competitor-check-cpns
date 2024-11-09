import puppeter from "puppeteer";
import * as fs from "fs";
import readline from "readline";
import xlsx from "xlsx";
import Table from "cli-table";

const table = new Table({
    head: ['No', 'Nama', 'Lokasi', 'Jurusan']
});
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
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
const dataExcel = readExcel("./data/dataset.xlsx")

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
    let greetUser = `${await new Promise(resolve => rl.question('Masukkan nama Anda: ', resolve))}`;
    const response = await checkData(greetUser)
    table.push([1,response.nama,"null",response.jurusan]);
    console.log(table.toString());  
    rl.close();
}
const scannerWithInput = async () => {
    const result = [];
    
    console.log(`Jumlah data : ${dataExcel.length}`);
    let step1 = `${await new Promise(resolve => rl.question('Masukkan jumlah data 1 : ', resolve))}`;
    let step2 = `${await new Promise(resolve => rl.question('Masukkan jumlah data 2 : ', resolve))}`; 
    if(step2 - step1 > 100){
        console.log("Jumlah data tidak boleh lebih dari 100");
    }else{
        if(result.length == 0){
            console.log("Data tidak ditemukan Silahkan Upload File Excel, Atau Memasukkan Data Manual Pada Menu 1");
        }
        console.time('checkDataProcess');
        for (let i = Number(step1); i < Number(step2); i++) {
            try {
                const res = await checkData(dataExcel[i].Nama,dataExcel[i].Lokasi);
                table.push([i+1,res.nama,res.lokasi,res.jurusan]);
                // console.log(` ${dataExcel[i].Nama} jurusan : ${res.jurusan} Titik Lokasi : ${dataExcel[i].Lokasi} `);
            } catch (err) {
                console.log(err);
            }
        } 
        console.log(table.toString());
        console.timeEnd('checkDataProcess');
    }
}
// scannerWithOutputExcel();
const main = async () => {
    console.log('=======================================');
    console.log('Selamat Datang Di Check Jurusan V.1.1');
    console.log('=======================================');
    console.log('Pilih Menu');
    console.log('1. Scanner dengan inputan manual');
    console.log('2. Scanner dengan inputan automatis');
    console.log('=======================================');
    const answer2 = await new Promise(resolve => rl.question('Input : ', resolve));
    
    switch (answer2) {
        case '1':
            inputData();
            main();
            break;
        case '2':
            scannerWithInput();
            main()
            break;
        default:
            break;
    }
}
main();
