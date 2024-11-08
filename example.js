import axios from "axios";
import puppeter from "puppeteer";
import data from "./data/data-1.json"
const baseURL = "https://pddikti.kemdikbud.go.id/search/mahasiswa/Mohamad%20Rizky%20Isa";

const main = async () => {
    const browser = await puppeter.launch({
        headless:false,
        // args: ['--no-startup-window']

    });
    const page = await browser.newPage();
    await page.goto(baseURL,{
        waitUntil:"networkidle0",
        timeout:60000
    });
    const getData = await page.$("table");
    const text = await page.evaluate(getData => h1.textContent, h1);
    console.log(text);
    await browser.close();
};
console.log(data)

// main();
