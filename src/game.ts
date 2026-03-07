import {Logger} from "./logger";
import {createNQuestionsOfCategory, QuestionCategory} from "./question";
import {Player} from "./player";

export class Game implements Logger {

    private readonly players: Array<Player> = [];
    private currentPlayerIndex: number = 0;

    public static readonly BOARD_SIZE = 12;
    private static readonly NUMBER_OF_GOLD_COINS_TO_WIN = 6;

    private static readonly BOARD: Record<number, QuestionCategory | undefined> = {
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

    private static readonly QUESTIONS_BY_CATEGORY: Record<QuestionCategory, string[]> = Object.values(QuestionCategory)
        .reduce((acc, category) => ({
            ...acc,
            [category]: createNQuestionsOfCategory(50, category)
        }), {} as Record<QuestionCategory, string[]>)

    constructor(playerNames: string[], private readonly logger: Logger = this) {
        this.players = playerNames.map(((name, index) => {
            const isBuggyPlayer = index === 0
            // FIXME: NaN is very likely to be a bug
            return isBuggyPlayer ?
                new Player(name, index + 1, NaN, NaN) :
                new Player(name, index + 1)
        }));

        this.players.forEach(player => {
            this.logger.log(player.name + " was added");
            this.logger.log("They are player number " + (player.number));
        })
    }

    public playCurrentPlayerTurn(roll: number) {
        this.logger.log(this.currentPlayer.name + " is the current player");
        this.logger.log("They have rolled a " + roll);
        this.currentPlayer.registerLastRoll(roll);

        if (this.currentPlayer.isInPenaltyBoxAndCannotGetOut()) {
            this.logger.log(this.currentPlayer.name + " is not getting out of the penalty box");
            return;
        }

        if (this.currentPlayer.isInPenaltyBoxAndCanGetOut()) {
            this.logger.log(this.currentPlayer.name + " is getting out of the penalty box");
        }

        this.currentPlayer.move(roll)
        this.logger.log(this.currentPlayer.name + "'s new location is " + this.currentPlayer.location);

        const currentCategory = Game.BOARD[this.currentPlayer.location];
        this.logger.log("The category is " + currentCategory);

        const questionToAsk = Game.QUESTIONS_BY_CATEGORY[currentCategory].shift()
        this.logger.log(questionToAsk);
    }

    public handleCorrectAnswer(): void {
        if (this.currentPlayer.isInPenaltyBoxAndCannotGetOut()) {
            this.moveToNextPlayer()
            return;
        }

        const correctAnswerLogMessage = this.currentPlayer.isInPenaltyBoxAndCanGetOut() ?
            'Answer was correct!!!!' :
            // FIXME: probable typo
            'Answer was corrent!!!!';
        this.logger.log(correctAnswerLogMessage)

        this.currentPlayer.addGoldCoin()
        this.logger.log(this.currentPlayer.name + " now has " + this.currentPlayer.numberOfGoldCoins + " Gold Coins.");

        this.moveToNextPlayer()
    }

    public handleWrongAnswer(): void {
        this.logger.log('Question was incorrectly answered');

        this.currentPlayer.sendToPenaltyBox();
        this.logger.log(this.currentPlayer.name + " was sent to the penalty box");

        this.moveToNextPlayer();
    }

    private get currentPlayer(): Player {
        return this.players[this.currentPlayerIndex];
    }

    private moveToNextPlayer() {
        this.currentPlayerIndex += 1;
        this.currentPlayerIndex %= this.players.length;
    }

    public doesNotHaveWinner() {
        return !(this.players.some(p => p.numberOfGoldCoins === Game.NUMBER_OF_GOLD_COINS_TO_WIN));
    }

    public log(message: string) {
        console.log(message);
    }
}
