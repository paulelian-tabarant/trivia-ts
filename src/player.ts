export class Player {
    public readonly name: string;
    public readonly number: number;
    private _isInPenaltyBox: boolean;

    constructor(name: string, number: number) {
        this.name = name;
        this.number = number;
        this._isInPenaltyBox = false;
    }

    putToPenaltyBox(): void {
        this._isInPenaltyBox = true;
    }

    moveOutOfPenaltyBox(): void {
        this._isInPenaltyBox = false;
    }

    get isInPenaltyBox(): boolean {
        return this._isInPenaltyBox;
    }
}