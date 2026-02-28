import {Logger} from "./logger";
import {createFiftyQuestionsOf, QuestionCategory} from "./question";

const BOARD_SIZE = 12;

export class Game implements Logger {

    private readonly playerNames: Array<string> = [];
    private readonly places: Array<number> = [];
    private readonly purses: Array<number> = [];
    private readonly isPlayerInPenaltyBox: Array<boolean> = [];
    private currentPlayerIndex: number = 0;
    private currentPlayerRoll: number = 0;

    private QUESTIONS_BY_CATEGORY: Record<QuestionCategory, string[]> = {
        [QuestionCategory.POP]: [],
        [QuestionCategory.SCIENCE]: [],
        [QuestionCategory.SPORTS]: [],
        [QuestionCategory.ROCK]: [],
    }

    constructor(players: string[], private readonly logger: Logger = this) {
        Object.values(QuestionCategory).forEach(category => {
            this.QUESTIONS_BY_CATEGORY[category] = createFiftyQuestionsOf(category);
        })

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
        this.currentPlayerRoll = roll;

        this.logger.log(currentPlayerName + " is the current player");
        this.logger.log("They have rolled a " + roll);

        if (this.isPlayerInPenaltyBox[this.currentPlayerIndex]) {
            if (roll % 2 === 0) {
                this.logger.log(currentPlayerName + " is not getting out of the penalty box");
                return;
            }

            this.logger.log(currentPlayerName + " is getting out of the penalty box");
        }

        this.places[this.currentPlayerIndex] += roll;
        this.places[this.currentPlayerIndex] %= BOARD_SIZE

        this.logger.log(this.playerNames[this.currentPlayerIndex] + "'s new location is " + this.places[this.currentPlayerIndex]);
        this.logger.log("The category is " + this.currentCategory());

        const questionToAsk = this.QUESTIONS_BY_CATEGORY[this.currentCategory()].shift()
        this.logger.log(questionToAsk);
    }

    private currentCategory(): string {
        const CATEGORY_BY_PLACE: Record<number, QuestionCategory | undefined> = {
            NaN: QuestionCategory.ROCK, // probable bug
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

        return CATEGORY_BY_PLACE[this.places[this.currentPlayerIndex]];
    }

    public handleCorrectAnswer(): void {
        if (this.isPlayerInPenaltyBox[this.currentPlayerIndex] && !this.isCurrentPlayerGettingOutOfPenaltyBox()) {
            this.moveToNextPlayer()
            return;
        }

        // FIXME: 'corrent' is very likely to be a typo
        this.logger.log(this.isCurrentPlayerGettingOutOfPenaltyBox() ? 'Answer was correct!!!!' : 'Answer was corrent!!!!');

        this.purses[this.currentPlayerIndex] += 1;
        this.logger.log(this.playerNames[this.currentPlayerIndex] + " now has " +
            this.purses[this.currentPlayerIndex] + " Gold Coins.");

        this.moveToNextPlayer()
    }

    private isCurrentPlayerGettingOutOfPenaltyBox() {
        return this.isPlayerInPenaltyBox[this.currentPlayerIndex] && this.currentPlayerRoll % 2 != 0;
    }

    public handleWrongAnswer(): void {
        this.logger.log('Question was incorrectly answered');
        this.logger.log(this.playerNames[this.currentPlayerIndex] + " was sent to the penalty box");

        this.isPlayerInPenaltyBox[this.currentPlayerIndex] = true;

        this.moveToNextPlayer();
    }

    private moveToNextPlayer() {
        this.currentPlayerIndex += 1;
        if (this.currentPlayerIndex == this.playerNames.length)
            this.currentPlayerIndex = 0;
    }

    public doesNotHaveWinner() {
        return !(this.purses.some(p => p == 6));
    }

    public log(message: string) {
        console.log(message);
    }
}
