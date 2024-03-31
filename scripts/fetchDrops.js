import axios from 'axios';
import fs from "fs";
import {baseDirname, fetchCard} from "./cards.js";
import {load} from "cheerio";

function dd(...args) {
    console.log(...args);
    process.exit();
}

const wikiUrl = 'https://yugipedia.com/wiki/';
const persons = [
    // 'Simon_Muran_(FMR)',
    // 'Teana',
    // 'Jono',
    // 'Villager1',
    // 'Villager2',
    // 'Villager3',
    // 'Seto_(FMR)',
    // 'Heishin',
    // 'Rex_Raptor_(FMR)',
    // 'Weevil_Underwood_(FMR)',
    // 'Mai_Valentine_(FMR)',
    // 'Bandit_Keith_(FMR)',
    // 'Shadi_(FMR)',
    // 'Yami_Bakura_(FMR)',
    // 'Pegasus_(FMR)',
    // 'Isis_(FMR)',
    // 'Kaiba_(FMR)',
    // 'Mage Soldier',
    // 'Jono 2nd',
    // 'Teana 2nd',
    // 'Ocean Mage',
    // 'High Mage Secmeton',
    // 'Forest Mage',
    // 'High Mage Anubisius',
    // 'Mountain Mage',
    // 'High Mage Atenza',
    // 'Desert Mage',
    // 'High Mage Martis',
    // 'Meadow Mage',
    // 'High Mage Kepura',
    // 'Labyrinth Mage',
    // 'Seto 2nd',
    // 'Sebek',
    'Neku',
    // 'Heishin 2nd',
    // 'Seto 3rd',
    // 'DarkNite',
    // 'Nitemare',
    'Duel Master K',
];
let personDecks = [];

try {
    personDecks = JSON.parse(fs.readFileSync(`${baseDirname}persons.json`).toString());
} catch (error) {
}

function savePersons() {
    fs.writeFileSync(`${baseDirname}persons.json`, JSON.stringify(personDecks));
}

function formatPersonName(personName) {
    return personName.replace('(FMR)', '').replace(/_/g, ' ').trim();
}

async function fetchPersonDetails($, personName, deckTbody, tabs, urlPath) {
    const personIndex = personDecks.findIndex((person) => person.name === personName);
    const person = personIndex >= 0 ? personDecks[personIndex] : {
        name: personName,
        urlPath,
        deck: [],
        drops: [],
    };

    // fetch deck of the person
    const deck = [];

    if ( $(deckTbody).parent().parent().hasClass('mw-parser-output') ) {
        for (const tr of $(deckTbody).find('tr')) {
            const tds = $(tr).find('td');
            const id = parseInt($(tds[0]).text());
            if (isNaN(id)) {
                continue;
            }

            await fetchCard(id, $(tds[1]).text());

            deck.push(id);
        }
    }

    person.deck = deck;

    const drops = {};
    for (const tab of tabs) {
        const tabElement = $(tab);
        const dropType = tabElement.attr('title').trim();
        for (const tr of tabElement.find('tbody').find('tr')) {
            const tds = $(tr).find('td');
            const id = parseInt($(tds[0]).text());
            if (isNaN(id)) {
                continue;
            }

            if (!drops[id]) {
                drops[id] = {};
            }

            drops[id][dropType] = {
                percent: parseFloat($(tds[7]).text()),
                2048: parseInt($(tds[8]).text()),
            };
        }
    }

    person.drops = drops;
    person.urlPath = urlPath;

    if (personIndex === -1) {
        personDecks.push(person);
    }

    savePersons();
}

async function fetchPerson(urlPath, html) {
    const $ = load(html);
    const npcNames = [];
    for (const element of $('.toclevel-1.tocsection-2 li .toctext')) {
        npcNames.push($(element).text());
    }

    const tabs = $('.tabbertab');
    if (!npcNames.length) {
        const npcName = formatPersonName($('#firstHeading').text());
        console.log('fetch as single person:', npcName);

        return await fetchPersonDetails(
            $,
            npcName,
            $('table.card-list:first').find('tbody'),
            tabs,
            urlPath,
        );
    }

    console.log('fetch as multiple persons:', npcNames);

    const deckTables = $('table.card-list').filter((_, element) => $(element.parent).hasClass('mw-parser-output'));
    for (const [index, npcName] of npcNames.entries()) {
        await fetchPersonDetails(
            $,
            npcName,
            $(deckTables[index]).find('tbody'),
            tabs.slice(index * 3, (index + 1) * 3),
            urlPath,
        );
    }
}

async function fetchDrops() {
    console.log(`Fetching ${persons.length} persons...`);
    for (const person of persons) {
        if (person.includes('2nd') || person.includes('3rd')) {
            continue;
        }

        const url = wikiUrl + person;

        console.log(`Fetching person ${person} (${url})`);

        try {
            const {data} = await axios.get(url);
            await fetchPerson(person, data);
        } catch (error) {
            console.error(error.message)
        }
    }
}

fetchDrops();