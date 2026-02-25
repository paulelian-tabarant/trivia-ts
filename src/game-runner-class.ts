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
        const game = new Game([
            "Chet", "Pat", "Sue"
        ], this.logger);
/*
        game.addNewPlayer("Chet");
        game.addNewPlayer("Pat");
        game.addNewPlayer("Sue");
*/

        let notAWinner;
        do {

            game.playCurrentPlayerTurn(this.gameMaster.getNextRoll());

            if (this.gameMaster.isWrongAnswer()) {
                game.handleWrongAnswerFromCurrentPlayer();
            } else {
                game.handleCorrectAnswerFromCurrentPlayer();
            }

        } while (game.doesNotHaveWinner());
    }

    getNextRoll() {
        return Math.floor(Math.random() * 6) + 1;
    }

    isWrongAnswer() {
        return Math.floor(Math.random() * 10) == 7;
    }
}