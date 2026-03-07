export class Player {
    public readonly name: string;
    public readonly number: number;
    private readonly boardSize: number;

    private _location: number;
    private _numberOfGoldCoins: number;
    private isInPenaltyBox: boolean = false;
    private lastRoll: number;

    private static readonly NUMBER_OF_GOLD_COINS_TO_WIN = 6;

    constructor(name: string, number: number, boardSize: number, numberOfGoldCoins: number = 0, location: number = 0) {
        this.name = name;
        this.number = number;
        this.boardSize = boardSize;

        this._location = location;
        this._numberOfGoldCoins = numberOfGoldCoins;
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
        this._location %= this.boardSize;
    }

    registerLastRoll(roll: number) {
        this.lastRoll = roll;
    }

    hasWon(): boolean {
        return this.numberOfGoldCoins === Player.NUMBER_OF_GOLD_COINS_TO_WIN;
    }
}