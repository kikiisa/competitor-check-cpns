import puppeter from "puppeteer";
import * as fs from "fs";
import { log } from "console";
import readline from "readline";
const jsonData = JSON.parse(fs.readFileSync("./data/data-1.json", "utf-8"));
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
const checkData = async (params) => {
    let baseURL = `https://pddikti.kemdikbud.go.id/search/mahasiswa/${params}`;
    const browser = await puppeter.launch({
        headless:false
    });
    const page = await browser.newPage();
    await page.goto(baseURL,{
        waitUntil:"networkidle0",
        timeout:60000
    });
    // ambil element jurusan
    const tableElement = await page.$('table tr:nth-child(1) td:nth-child(4)');
    // ambil text
    const text = await page.evaluate(tableElement => tableElement.textContent, tableElement);
    // output
    console.log(`Nama : ${params}\n Jurusan: ${text}`);
    await browser.close();
};

const inputData = async () => {
    console.log("*** Selamat Datang di CPNS Competitor Checker V.1.1  ***");
    console.log("*** DI KEMBANGKAN OLEH : MOHAMAD RIZKY ISA ***");
    console.log("------------------------------------------------")
    while (true) {
        let greetUser = `${await new Promise(resolve => rl.question('Masukkan nama Anda: ', resolve))}`;
        await checkData(greetUser);
    }
    rl.close();
}
inputData();

