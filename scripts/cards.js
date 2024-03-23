import axios from "axios";
import {load} from "cheerio";
import fs from "fs";
import path from "path";
import {fileURLToPath} from "node:url";

const baseDirname = path.resolve(path.dirname(fileURLToPath(import.meta.url))) + '/';
let cards = Object.create(null);

try {
    cards = JSON.parse(fs.readFileSync(`${baseDirname}cards.json`).toString());
} catch (e) {
}


function fetchCardDetails($) {
    const tableDetails = {};
    for ( const tr of $(`.infocolumn table.innertable tr`)) {
        const title = $(tr).find('th').text().trim();
        if ( !title ) {
            continue;
        }

        tableDetails[title.toLowerCase()] = $(tr).find('td').text().trim();
    }

    const image = $('.cardtable-main_image-wrapper .image img').attr('src');
    const password = tableDetails.password || null;
    const cost = tableDetails['star chip cost'] ? parseInt(tableDetails['star chip cost']) : null;
    const atkDef = tableDetails['atk / def'] ? tableDetails['atk / def'].split('/') : null;
    const stars = tableDetails.level ? parseInt(tableDetails.level) : null;

    return {
        name: $('div.heading').text().trim(),
        image,
        atk: atkDef ? parseInt(atkDef[0].trim()) : null,
        def: atkDef ? parseInt(atkDef[1].trim()) : null,
        stars,
        password,
        cost,
    }
}

async function fetchCard(cardId, cardName) {
    if (cards[cardId] && cards[cardId].image) {
        return cards[cardId];
    }

    const urlPathName = cardName.replace(/#/g, "");
    const urls = [
        `https://yugipedia.com/wiki/${urlPathName} (FMR)`,
        `https://yugipedia.com/wiki/${urlPathName}`,
    ];
    for (const url of urls) {
        console.log(`Fetching card ${cardName} (${url})`)
        try {
            const {data} = await axios.get(url);
            const $ = load(data);
            cards[cardId] = fetchCardDetails($);
            saveCards();

            console.log(`Fetched card ${cardName}.`);

            return cards[cardId];
        } catch (e) {
            console.log(`${url} FAILED`, e.message);
            if (e?.response?.status === 429) {
                process.exit();
            }
        }
    }

    return null;
}

function saveCards() {
    fs.writeFileSync(`${baseDirname}cards.json`, JSON.stringify(cards));
}

export {
    cards,
    baseDirname,
    fetchCard,
    fetchCardDetails,
};