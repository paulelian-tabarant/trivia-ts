import {GameMaster} from "./game-master";
import {Logger} from "./logger";
import {Game} from "./game";

export class GameRunner implements GameMaster {
    public static main(): void {
        const gameRunner = new GameRunner();
        gameRunner.runGame();
    }

    constructor(private readonly gameMaster: GameMaster = this, private readonly logger?: Logger) {
    }

    public runGame() {
        const players = ["Chet", "Pat", "Sue"]
        const game = new Game(players, this.logger);

        do {
            const roll = this.gameMaster.rollDice();
            game.playCurrentPlayerTurn(roll);

            if (this.gameMaster.isCorrectAnswer()) {
                game.handleCorrectAnswerFromCurrentPlayer();
            } else {
                game.handleWrongAnswerFromCurrentPlayer();
            }

        } while (game.doesNotHaveWinner());
    }

    rollDice() {
        return Math.floor(Math.random() * 6) + 1;
    }

    isCorrectAnswer() {
        return Math.floor(Math.random() * 10) != 7;
    }
}