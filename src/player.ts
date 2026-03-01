import {Game} from "./game";

export class Player {
    public readonly name: string;
    public readonly number: number;
    private _isInPenaltyBox: boolean;
    private _numberOfGoldCoins: number;
    private _location: number;
    private _lastRoll: number;

    constructor(name: string, number: number, numberOfGoldCoins: number = 0, location: number = 0) {
        this.name = name;
        this.number = number;
        this._isInPenaltyBox = false;
        this._numberOfGoldCoins = numberOfGoldCoins;
        this._location = location;
    }

    sendToPenaltyBox(): void {
        this._isInPenaltyBox = true;
    }

    get isInPenaltyBox(): boolean {
        return this._isInPenaltyBox;
    }

    addGoldCoin(): void {
        this._numberOfGoldCoins += 1;
    }

    get numberOfGoldCoins(): number {
        return this._numberOfGoldCoins;
    }

    move(roll: number): void {
        this._location += roll;
        this._location %= Game.BOARD_SIZE;
    }

    get location(): number {
        return this._location;
    }

    registerLastRoll(roll: number) {
        this._lastRoll = roll;
    }

    canGetOutOfPenaltyBox() {
        return this._lastRoll % 2 !== 0;
    }

    isInPenaltyBoxAndCannotGetOut(): boolean {
        return this.isInPenaltyBox && !this.canGetOutOfPenaltyBox();
    }

    isInPenaltyBoxAndCanGetOut(): boolean {
        return this.isInPenaltyBox && this.canGetOutOfPenaltyBox();
    }
}