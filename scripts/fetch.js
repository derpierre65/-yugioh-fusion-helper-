import axios from 'axios';
import path from 'path';
import fs from "fs";
import {load} from "cheerio";
import {fileURLToPath} from "node:url";

const baseDirname = path.resolve(path.dirname(fileURLToPath(import.meta.url))) + '/';

let cards = Object.create(null);

try {
    cards = JSON.parse(fs.readFileSync(`${baseDirname}cards.json`).toString());
} catch (e) {
}

const urls = [
    'https://yugipedia.com/wiki/List_of_Yu-Gi-Oh!_Forbidden_Memories_Fusions_(001%E2%80%93200)',
    'https://yugipedia.com/wiki/List_of_Yu-Gi-Oh!_Forbidden_Memories_Fusions_(201%E2%80%93400)',
    'https://yugipedia.com/wiki/List_of_Yu-Gi-Oh!_Forbidden_Memories_Fusions_(401%E2%80%93600)',
    'https://yugipedia.com/wiki/List_of_Yu-Gi-Oh!_Forbidden_Memories_Fusions_(601%E2%80%93722)',
];

function saveCards() {
    fs.writeFileSync(`${baseDirname}cards.json`, JSON.stringify(cards));
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

async function getIds($, td) {
    const ids = [];
    const fetching = [];
    td.each((_, el) => {
        let result = $(el).text().match(/#(\d+): "(.+)"/);
        const cardId = parseInt(result[1]);
        ids.push(cardId);
        fetching.push([cardId, result[2]]);
    });

    for (const [cardId, cardName] of fetching) {
        await fetchCard(cardId, cardName)
    }

    return ids;
}

async function fetchUrl(url) {
    const base = `${urls.indexOf(url)}_${btoa(url)}.txt`;
    const cacheFile = `${baseDirname}/${base}`;
    try {
        return fs.readFileSync(cacheFile).toString();
    } catch (e) {
    }

    console.log(`Fetching from url ${url}`);
    const data = (await axios.get(url)).data;

    fs.writeFileSync(cacheFile, data);

    return data;
}

async function fetchFusionPage(url, possibleFusions) {
    const html = await fetchUrl(url);
    const $ = load(html);

    const titleElements = $('h2');
    const resultCards = [];

    for (const el of titleElements) {
        let text = $(el).text();
        const result = text.match(/^(\d+): "(.+)"/);
        if (!result) {
            continue;
        }

        const cardId = parseInt(result[1]);
        resultCards.push(cardId);
        await fetchCard(cardId, result[2]);
    }

    for (const [tableIndex, table] of $('table.wikitable').toArray().entries()) {
        const resultCard = resultCards[tableIndex];
        const thisFusions = possibleFusions[resultCard] || [];
        for (const [index, tr] of $(table).find('tr').toArray().entries()) {
            if (index === 0) {
                continue;
            }

            const material1 = $(tr).find('td:first').find('li');
            const material2 = $(tr).find('td:last').find('li');
            const material1List = await getIds($, material1);
            const material2List = await getIds($, material2);

            for (const material1Id of material1List) {
                for (const material2Id of material2List) {
                    const minId = Math.min(material1Id, material2Id);
                    const maxId = Math.max(material1Id, material2Id);
                    const fusion = `${minId}+${maxId}`;
                    thisFusions.push(fusion);
                }
            }
        }

        possibleFusions[resultCard] = thisFusions;
    }
}

async function fetchFusions() {
    console.log('Fetch fusions from yugipedia.com');

    const possibleFusions = {};
    for (const [index, url] of urls.entries()) {
        console.log(`Fetch page ${index + 1}`);
        await fetchFusionPage(url, possibleFusions);
    }

    fs.writeFileSync(`${baseDirname}fusions.json`, JSON.stringify(possibleFusions));
}

fetchFusions();