import {Logger} from "./logger";
import {createNQuestionsOfCategory, QuestionCategory} from "./question";
import {Q} from "vitest/dist/chunks/reporters.6vxQttCV";

const BOARD_SIZE = 12;

export class Game implements Logger {

    private readonly playerNames: Array<string> = [];
    private readonly places: Array<number> = [];
    private readonly purses: Array<number> = [];
    private readonly isPlayerInPenaltyBox: Array<boolean> = [];
    private currentPlayerIndex: number = 0;
    private currentPlayerRoll: number = 0;

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
        this.playerNames = [...players]
        this.places = [NaN, ...new Array(players.length).fill(0)]
        this.purses = [NaN, ...new Array(players.length).fill(0)]
        this.isPlayerInPenaltyBox = [NaN, ...new Array(players.length).fill(false)]

        this.playerNames.forEach((name, index) => {
            this.logger.log(name + " was added");
            this.logger.log("They are player number " + (index + 1));
        })
    }

    public playCurrentPlayerTurn(roll: number) {
        const currentPlayerName = this.playerNames[this.currentPlayerIndex];
        this.logger.log(currentPlayerName + " is the current player");

        this.logger.log("They have rolled a " + roll);
        this.currentPlayerRoll = roll;

        if (this.isPlayerInPenaltyBox[this.currentPlayerIndex]) {
            if (canPlayerGetOutOfPenaltyBox(roll)) {
                this.logger.log(currentPlayerName + " is getting out of the penalty box");
            } else {
                this.logger.log(currentPlayerName + " is not getting out of the penalty box");
                return;
            }
        }

        this.places[this.currentPlayerIndex] += roll;
        this.places[this.currentPlayerIndex] %= BOARD_SIZE

        this.logger.log(this.playerNames[this.currentPlayerIndex] + "'s new location is " + this.places[this.currentPlayerIndex]);
        this.logger.log("The category is " + this.currentCategory());

        const questionToAsk = Game.QUESTIONS_BY_CATEGORY[this.currentCategory()].shift()
        this.logger.log(questionToAsk);
    }

    private currentCategory(): string {
        const currentPlayerPlace = this.places[this.currentPlayerIndex];

        return Game.BOARD[currentPlayerPlace];
    }

    public handleCorrectAnswer(): void {
        if (this.isPlayerInPenaltyBox[this.currentPlayerIndex]) {
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
        this.logger.log(this.playerNames[this.currentPlayerIndex] + " now has " +
            this.purses[this.currentPlayerIndex] + " Gold Coins.");

        this.moveToNextPlayer()
    }

    public handleWrongAnswer(): void {
        this.logger.log('Question was incorrectly answered');
        this.logger.log(this.playerNames[this.currentPlayerIndex] + " was sent to the penalty box");

        this.isPlayerInPenaltyBox[this.currentPlayerIndex] = true;

        this.moveToNextPlayer();
    }

    private moveToNextPlayer() {
        this.currentPlayerIndex += 1;
        this.currentPlayerIndex %= this.playerNames.length;
    }

    public doesNotHaveWinner() {
        return !(this.purses.some(p => p == 6));
    }

    public log(message: string) {
        console.log(message);
    }
}

function canPlayerGetOutOfPenaltyBox(playerRoll: number): boolean {
    return playerRoll % 2 !== 0;
}

