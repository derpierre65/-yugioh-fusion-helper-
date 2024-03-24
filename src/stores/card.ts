import {defineStore} from 'pinia';
import cards from 'assets/cards.json';
import {formatFusionList, fusionList} from 'src/lib/fusions';
import {Notify} from 'quasar';

type YugiohCard = {
    name: string;
    image: string;
    atk: number | null;
    def: number | null;
    stars: number | null;
    password: string | null;
    cost: number | null;
};

const useCardStore = defineStore('card', {
    state() {
        return {
            showFusionDialog: false,
            showFusionCard: '',
            cards: cards as Record<string, YugiohCard>,
        };
    },
    actions: {
        showFusion(id: string) {
            this.showFusionCard = id;
            if ( this.selectedCardFusions.with.length + this.selectedCardFusions.to.length === 0 ) {
                Notify.create({
                    color: 'red',
                    message: `No fusions available for this card.`,
                    position: 'top-right',
                });
                return;
            }

            this.showFusionDialog = true;
        },
    },
    getters: {
        allFusions(): string[] {
            const keys = Object.keys(fusionList);

            return keys.reduce((prev, key) => prev.concat(...fusionList[key].map((fusion) => `${fusion}=${key}`)), []);
        },
        selectedCardFusions(state): { with: string[], to: string[] } {
            const cardId = state.showFusionCard;
            const cardFusions = this.allFusions.filter((fusionId: string) => fusionId.startsWith(`${cardId}+`) || fusionId.includes(`+${cardId}=`));

            return {
                to: formatFusionList((fusionList[cardId] || []).map((fusion) => `${fusion}=${cardId}`)),
                with: formatFusionList(cardFusions || []),
            };
        },
    },
});

export {
    useCardStore as default,
    type YugiohCard,
};