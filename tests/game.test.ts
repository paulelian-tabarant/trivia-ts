import {describe, expect, it} from 'vitest';
import {GameMaster, GameRunner} from '../src/game-runner';

describe('The test environment', () => {
    it("should do something with the game", function () {
        let currentRoll = 0;
        const gameMaster: GameMaster = {
            getNextRoll: function (): number {
                currentRoll++;
                return currentRoll;
            },
            isWrongAnswer: function (): boolean {
                return false;
            }
        }

        const gameRunner = new GameRunner(gameMaster);

        gameRunner.runGame()

        // where is the output ?
    });

});
