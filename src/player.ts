import {Board} from "./board";

export class Player {
    public readonly name: string;
    public readonly number: number;

    private _numberOfGoldCoins: number;
    private _location: number;
    private isInPenaltyBox: boolean;
    private lastRoll: number;

    private static readonly NUMBER_OF_GOLD_COINS_TO_WIN = 6;

    constructor(name: string, number: number, numberOfGoldCoins: number = 0, location: number = 0) {
        this.name = name;
        this.number = number;
        this.isInPenaltyBox = false;
        this._numberOfGoldCoins = numberOfGoldCoins;
        this._location = location;
    }

    get numberOfGoldCoins(): number {
        return this._numberOfGoldCoins;
    }

    get location(): number {
        return this._location;
    }

    isInPenaltyBoxAndCannotGetOut(): boolean {
        return this.isInPenaltyBox && !this.canGetOutOfPenaltyBox();
    }

    isInPenaltyBoxAndCanGetOut(): boolean {
        return this.isInPenaltyBox && this.canGetOutOfPenaltyBox();
    }

    private canGetOutOfPenaltyBox() {
        return this.lastRoll % 2 !== 0;
    }

    sendToPenaltyBox(): void {
        this.isInPenaltyBox = true;
    }

    addGoldCoin(): void {
        this._numberOfGoldCoins += 1;
    }

    move(roll: number): void {
        this._location += roll;
        this._location %= Board.BOARD_SIZE;
    }

    registerLastRoll(roll: number) {
        this.lastRoll = roll;
    }

    hasWon(): boolean {
        return this.numberOfGoldCoins === Player.NUMBER_OF_GOLD_COINS_TO_WIN;
    }
}