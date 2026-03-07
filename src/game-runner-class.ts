import {GameMaster} from "./game-master";
import {Logger} from "./logger";
import {Game} from "./game";

export class GameRunner implements GameMaster {
    public static main(): void {
        new GameRunner().runGame();
    }

    constructor(private readonly gameMaster: GameMaster = this, private readonly logger?: Logger) {
    }

    public runGame() {
        const players = ["Chet", "Pat", "Sue"]
        const game = new Game(players, this.logger);

        do {
            const roll = this.gameMaster.rollDice();

            game.playNextTurn(roll);

            if (this.gameMaster.gotCorrectAnswer()) {
                game.handleCorrectAnswer();
            } else {
                game.handleWrongAnswer();
            }

        } while (game.hasNoWinnerYet());
    }

    rollDice() {
        return Math.floor(Math.random() * 6) + 1;
    }

    gotCorrectAnswer() {
        return Math.floor(Math.random() * 10) != 7;
    }
}