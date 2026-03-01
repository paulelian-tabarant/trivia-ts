import {Logger} from "./logger";
import {createNQuestionsOfCategory, QuestionCategory} from "./question";
import {Player} from "./player";

export class Game implements Logger {

    private readonly players: Array<Player> = [];
    private readonly buggyPlayers: Array<Player> = [];
    private readonly places: Array<number> = [];
    private readonly purses: Array<number> = [];
    private currentPlayerIndex: number = 0;
    private currentPlayerRoll: number = 0;

    private static BOARD_SIZE = 12;
    private static NUMBER_OF_GOLD_COINS_TO_WIN = 6;

    private static BOARD: Record<number, QuestionCategory | undefined> = {
        NaN: QuestionCategory.ROCK, // FIXME probable bug
        0: QuestionCategory.POP,
        1: QuestionCategory.SCIENCE,
        2: QuestionCategory.SPORTS,
        3: QuestionCategory.ROCK,
        4: QuestionCategory.POP,
        5: QuestionCategory.SCIENCE,
        6: QuestionCategory.SPORTS,
        7: QuestionCategory.ROCK,
        8: QuestionCategory.POP,
        9: QuestionCategory.SCIENCE,
        10: QuestionCategory.SPORTS,
        11: QuestionCategory.ROCK,
    }

    private static QUESTIONS_BY_CATEGORY: Record<QuestionCategory, string[]> = Object.values(QuestionCategory)
        .reduce((acc, category) => ({
            ...acc,
            [category]: createNQuestionsOfCategory(50, category)
        }), {} as Record<QuestionCategory, string[] | undefined>)

    constructor(players: string[], private readonly logger: Logger = this) {
        // FIXME: NaN is very likely to be a bug
        this.players = players.map(((name, index) => new Player(name, index + 1)));
        this.buggyPlayers = players.map(((name, index) => {
            const isBuggyPlayer = index === 0
            return isBuggyPlayer ? new Player(name, index + 1, NaN) : new Player(name, index + 1)
        }));
        this.places = [NaN, ...new Array(players.length).fill(0)]
        this.purses = [NaN, ...new Array(players.length).fill(0)]

        this.players.forEach((player, index) => {
            this.logger.log(player.name + " was added");
            this.logger.log("They are player number " + (player.number));
        })
    }

    public playCurrentPlayerTurn(roll: number) {
        this.logger.log(this.currentPlayer.name + " is the current player");

        this.logger.log("They have rolled a " + roll);
        this.currentPlayerRoll = roll;

        if (this.currentPlayer.isInPenaltyBox) {
            if (canPlayerGetOutOfPenaltyBox(roll)) {
                this.logger.log(this.currentPlayer.name + " is getting out of the penalty box");
            } else {
                this.logger.log(this.currentPlayer.name + " is not getting out of the penalty box");
                return;
            }
        }

        this.places[this.currentPlayerIndex] += roll;
        this.places[this.currentPlayerIndex] %= Game.BOARD_SIZE;

        this.logger.log(this.currentPlayer.name + "'s new location is " + this.places[this.currentPlayerIndex]);
        this.logger.log("The category is " + this.readCurrentPlayerCategory());

        const questionToAsk = Game.QUESTIONS_BY_CATEGORY[this.readCurrentPlayerCategory()].shift()
        this.logger.log(questionToAsk);
    }

    private readCurrentPlayerCategory(): string {
        const currentPlayerPlace = this.places[this.currentPlayerIndex];

        return Game.BOARD[currentPlayerPlace];
    }

    public handleCorrectAnswer(): void {
        if (this.currentPlayer.isInPenaltyBox) {
            if (canPlayerGetOutOfPenaltyBox(this.currentPlayerRoll)) {
                this.logger.log('Answer was correct!!!!')
            } else {
                this.moveToNextPlayer()
                return;
            }
        } else {
            // FIXME: 'corrent' is very likely to be a typo
            this.logger.log('Answer was corrent!!!!')
        }

        this.purses[this.currentPlayerIndex] += 1;
        this.currentBuggyPlayer.addGoldCoin()
        this.logger.log(this.currentBuggyPlayer.name + " now has " +
            this.currentBuggyPlayer.numberOfGoldCoins + " Gold Coins.");

        this.moveToNextPlayer()
    }

    private get currentPlayer(): Player {
        return this.players[this.currentPlayerIndex];
    }

    private get currentBuggyPlayer(): Player {
        return this.buggyPlayers[this.currentPlayerIndex];
    }

    public handleWrongAnswer(): void {
        this.logger.log('Question was incorrectly answered');
        this.logger.log(this.currentPlayer.name + " was sent to the penalty box");

        this.currentPlayer.putToPenaltyBox();

        this.moveToNextPlayer();
    }

    private moveToNextPlayer() {
        this.currentPlayerIndex += 1;
        this.currentPlayerIndex %= this.players.length;
    }

    public doesNotHaveWinner() {
        return !(this.purses.some(p => p === Game.NUMBER_OF_GOLD_COINS_TO_WIN));
    }

    public log(message: string) {
        console.log(message);
    }
}

function canPlayerGetOutOfPenaltyBox(playerRoll: number): boolean {
    return playerRoll % 2 !== 0;
}

