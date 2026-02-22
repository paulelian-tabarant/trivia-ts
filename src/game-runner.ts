import {Game} from './game';
import {GameMaster} from "./game-master";

export class GameRunner implements GameMaster {
    public static main(): void {
        const gameRunner = new GameRunner();
        gameRunner.runGame();
    }

    constructor(private readonly gameMaster: GameMaster = this) {
    }

    public runGame() {
        const game = new Game();
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

GameRunner.main();

  