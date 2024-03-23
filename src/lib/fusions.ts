import fusionList from 'src/assets/fusions.json';
import useCardStore from 'stores/card';

console.log(`Loaded ${Object.values(fusionList).reduce((prev, val) => val.length + prev, 0)} possible fusions`);

function findFusions(level: number, ids: string[], fusionCombination: string[], mustInclude: string | false): string[] {
    const possibleFusions: string[] = [];
    for (const material1Id of ids) {
        for (const material2Id of ids) {
            if (material1Id === material2Id) {
                continue;
            }

            const thisFusion = `${Math.min(material1Id, material2Id)}+${Math.max(material1Id, material2Id)}`;
            if (!possibleFusions.includes(thisFusion)) {
                possibleFusions.push(thisFusion);
            }
        }
    }

    if (mustInclude) {
        ids = ids.filter(id => id !== mustInclude);
    }

    const availableFusions: string[] = [];
    for (const result of Object.keys(fusionList)) {
        const fusions = fusionList[result];
        for (const fusion of possibleFusions) {
            if (!fusions.includes(fusion)) {
                continue;
            }

            const fusionIds = fusion.split('+');
            if (mustInclude && !fusionIds.includes(mustInclude)) {
                continue;
            }

            const filteredFusionIds = level > 1 ? fusionIds.filter((id) => id !== mustInclude) : fusionIds;
            let newFusionCombination = fusionCombination.concat(filteredFusionIds.join('+'));
            availableFusions.push(
                newFusionCombination.join('+') + ' = ' + result,
            );

            const newIds = ids.filter((id) => !fusionIds.includes(id)).concat(result);
            const nextFusions = findFusions(level + 1, newIds, newFusionCombination, result);
            if (nextFusions) {
                availableFusions.push(...nextFusions);
            }
        }
    }

    return availableFusions;
}

function getIdsByString(cards: string) {
    const cardStore = useCardStore();

    return cards
        .split(',')
        .map((value) => value.split(' '))
        .reduce((prev, value) => {
            // prev.push(...value);

            return prev.concat(...value);
        }, [])
        .filter(value => value && cardStore.cards[value]);
}

// function askForCards(rl) {
//     rl.question('Your cards? ', (cards) => {
//         const ids = cards
//             .split(',')
//             .map((value) => value.split(' '))
//             .reduce((prev, value) => {
//                 prev.push(...value);
//
//                 return prev;
//             }, []).filter(value => value);
//
//         const possible = findFusions(1, ids, []);
//         if (possible.length === 0) {
//             console.log('No fusions available :(');
//         }
//
//         for (const entry of possible) {
//             console.log(`Fusion with ${entry.length + 1} card(s) available: `, entry.join('+'), entry)
//         }
//
//         askForCards(rl);
//     });
// }

function formatFusionList(foundFusions: string[]) {
    const cardStore = useCardStore();
    const fusionList = [];

    for (const possibleFusion of foundFusions) {
        const cards = possibleFusion.split('=');
        fusionList.push({
            merge: cards[0].split('+').map(value => value.trim()),
            final: cards[1].trim(),
        });
    }

    return fusionList.sort((a,b) => {
        const aCard = cardStore.cards[a.final];
        const bCard = cardStore.cards[b.final];
        return aCard.atk < bCard.atk ? 1 : -1;
    });
}

export {
    fusionList,
    findFusions,
    getIdsByString,
    formatFusionList,
};