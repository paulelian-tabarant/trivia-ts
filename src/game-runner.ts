import {Game} from './game';

interface GameMaster {
    getNextRoll(): number
    isWrongAnswer(): boolean
}

export class GameRunner {
    public static main(): void {
        const game = new Game();
        game.add("Chet");
        game.add("Pat");
        game.add("Sue");

        let notAWinner;
        do {

            game.roll(this.getNextRoll());

            if (this.isWrongAnswer()) {
                notAWinner = game.wrongAnswer();
            } else {
                notAWinner = game.wasCorrectlyAnswered();
            }

        } while (notAWinner);
    }

    private static getNextRoll() {
        return Math.floor(Math.random() * 6) + 1;
    }

    private static isWrongAnswer() {
        return Math.floor(Math.random() * 10) == 7;
    }
}

GameRunner.main();

  