import {describe, expect, it} from 'vitest';
import {GameRunner} from '../src/game-runner';
import {GameMaster} from "../src/game-master";
import {Logger} from "../src/logger";

describe('The test environment', () => {
    it("should do something with the game", function () {
        let currentRoll = 0;
        const gameMasterStub: GameMaster = {
            getNextRoll: function (): number {
                currentRoll++;
                return currentRoll;
            },
            isWrongAnswer: function (): boolean {
                return false;
            }
        }

        const capturedOutput = []
        const loggerSpy: Logger = {
            log: function (message: string): void {
                capturedOutput.push(message)
            }
        }

        const gameRunner = new GameRunner(gameMasterStub, loggerSpy);

        gameRunner.runGame()

        expect(capturedOutput.join('\n')).toBe(GOLDEN_MASTER.trim())
    });

    const GOLDEN_MASTER = `
Chet was added
They are player number 1
Pat was added
They are player number 2
Sue was added
They are player number 3
Chet is the current player
They have rolled a 1
Chet's new location is NaN
The category is Rock
Rock Question 0
Answer was corrent!!!!
Chet now has NaN Gold Coins.
Pat is the current player
They have rolled a 2
Pat's new location is 2
The category is Sports
Sports Question 0
Answer was corrent!!!!
Pat now has 1 Gold Coins.
Sue is the current player
They have rolled a 3
Sue's new location is 3
The category is Rock
Rock Question 1
Answer was corrent!!!!
Sue now has 1 Gold Coins.
Chet is the current player
They have rolled a 4
Chet's new location is NaN
The category is Rock
Rock Question 2
Answer was corrent!!!!
Chet now has NaN Gold Coins.
Pat is the current player
They have rolled a 5
Pat's new location is 7
The category is Rock
Rock Question 3
Answer was corrent!!!!
Pat now has 2 Gold Coins.
Sue is the current player
They have rolled a 6
Sue's new location is 9
The category is Science
Science Question 0
Answer was corrent!!!!
Sue now has 2 Gold Coins.
Chet is the current player
They have rolled a 7
Chet's new location is NaN
The category is Rock
Rock Question 4
Answer was corrent!!!!
Chet now has NaN Gold Coins.
Pat is the current player
They have rolled a 8
Pat's new location is 3
The category is Rock
Rock Question 5
Answer was corrent!!!!
Pat now has 3 Gold Coins.
Sue is the current player
They have rolled a 9
Sue's new location is 6
The category is Sports
Sports Question 1
Answer was corrent!!!!
Sue now has 3 Gold Coins.
Chet is the current player
They have rolled a 10
Chet's new location is NaN
The category is Rock
Rock Question 6
Answer was corrent!!!!
Chet now has NaN Gold Coins.
Pat is the current player
They have rolled a 11
Pat's new location is 2
The category is Sports
Sports Question 2
Answer was corrent!!!!
Pat now has 4 Gold Coins.
Sue is the current player
They have rolled a 12
Sue's new location is 6
The category is Sports
Sports Question 3
Answer was corrent!!!!
Sue now has 4 Gold Coins.
Chet is the current player
They have rolled a 13
Chet's new location is NaN
The category is Rock
Rock Question 7
Answer was corrent!!!!
Chet now has NaN Gold Coins.
Pat is the current player
They have rolled a 14
Pat's new location is 4
The category is Pop
Pop Question 0
Answer was corrent!!!!
Pat now has 5 Gold Coins.
Sue is the current player
They have rolled a 15
Sue's new location is 9
The category is Science
Science Question 1
Answer was corrent!!!!
Sue now has 5 Gold Coins.
Chet is the current player
They have rolled a 16
Chet's new location is NaN
The category is Rock
Rock Question 8
Answer was corrent!!!!
Chet now has NaN Gold Coins.
Pat is the current player
They have rolled a 17
Pat's new location is 9
The category is Science
Science Question 2
Answer was corrent!!!!
Pat now has 6 Gold Coins.
    `
});
