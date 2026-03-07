import {Logger} from "./logger";
import {QuestionsDeck} from "./questions-deck";
import {Player} from "./player";
import {Board} from "./board";

export class Game implements Logger {

    private readonly players: Array<Player> = [];
    private currentPlayerIndex: number = 0;
    private readonly questionsDeck = new QuestionsDeck();
    private readonly board = new Board();

    private static readonly NUMBER_OF_GOLD_COINS_TO_WIN = 6;

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

    public playNextTurn(roll: number) {
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

        const currentCategory = this.board.readCategoryAtLocation(this.currentPlayer.location);
        this.logger.log("The category is " + currentCategory);

        const questionToAsk = this.questionsDeck.pickQuestionOfCategory(currentCategory)
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

    public hasNoWinnerYet() {
        return !(this.players.some(p => p.numberOfGoldCoins === Game.NUMBER_OF_GOLD_COINS_TO_WIN));
    }

    private get currentPlayer(): Player {
        return this.players[this.currentPlayerIndex];
    }

    private moveToNextPlayer() {
        this.currentPlayerIndex += 1;
        this.currentPlayerIndex %= this.players.length;
    }

    public log(message: string) {
        console.log(message);
    }
}
