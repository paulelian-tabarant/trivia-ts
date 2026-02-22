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
        const game = new Game(this.logger);
        game.add("Chet");
        game.add("Pat");
        game.add("Sue");

        let notAWinner;
        do {

            game.roll(this.gameMaster.getNextRoll());

            if (this.gameMaster.isWrongAnswer()) {
                notAWinner = game.wrongAnswer();
            } else {
                notAWinner = game.wasCorrectlyAnswered();
            }

        } while (notAWinner);
    }

    getNextRoll() {
        return Math.floor(Math.random() * 6) + 1;
    }

    isWrongAnswer() {
        return Math.floor(Math.random() * 10) == 7;
    }
}