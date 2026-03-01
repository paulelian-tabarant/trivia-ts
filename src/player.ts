export class Player {
    public readonly name: string;
    public readonly number: number;
    private _isInPenaltyBox: boolean;
    private _numberOfGoldCoins: number;

    constructor(name: string, number: number, numberOfGoldCoins: number = 0) {
        this.name = name;
        this.number = number;
        this._isInPenaltyBox = false;
        this._numberOfGoldCoins = numberOfGoldCoins;
    }

    putToPenaltyBox(): void {
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
}