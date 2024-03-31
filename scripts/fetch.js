import axios from 'axios';
import fs from "fs";
import {load} from "cheerio";
import {baseDirname, fetchCard} from "./cards.js";

const urls = [
    'https://yugipedia.com/wiki/List_of_Yu-Gi-Oh!_Forbidden_Memories_Fusions_(001%E2%80%93200)',
    'https://yugipedia.com/wiki/List_of_Yu-Gi-Oh!_Forbidden_Memories_Fusions_(201%E2%80%93400)',
    'https://yugipedia.com/wiki/List_of_Yu-Gi-Oh!_Forbidden_Memories_Fusions_(401%E2%80%93600)',
    'https://yugipedia.com/wiki/List_of_Yu-Gi-Oh!_Forbidden_Memories_Fusions_(601%E2%80%93722)',
];

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

fetchFusions().catch(() => console.error('Fetch Fusions failed.'));