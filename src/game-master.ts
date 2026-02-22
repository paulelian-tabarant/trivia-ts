export interface GameMaster {
    getNextRoll(): number
    isWrongAnswer(): boolean
}