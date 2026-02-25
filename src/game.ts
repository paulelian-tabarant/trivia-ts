import {Logger} from "./logger";

enum QuestionCategory {
    POP = 'Pop',
    SCIENCE = 'Science',
    SPORTS = 'Sports',
    ROCK = "Rock",
}

export class Game implements Logger {

    private players: Array<string> = [];
    private places: Array<number> = [];
    private purses: Array<number> = [];
    private inPenaltyBox: Array<boolean> = [];
    private currentPlayer: number = 0;
    private isGettingOutOfPenaltyBox: boolean = false;

    private popQuestions: Array<string> = [];
    private scienceQuestions: Array<string> = [];
    private sportsQuestions: Array<string> = [];
    private rockQuestions: Array<string> = [];

    constructor(private readonly logger: Logger = this) {

        for (let i = 0; i < 50; i++) {
            this.popQuestions.push("Pop Question " + i);
            this.scienceQuestions.push("Science Question " + i);
            this.sportsQuestions.push("Sports Question " + i);
            this.rockQuestions.push(this.createRockQuestion(i));
        }
    }

    private createRockQuestion(index: number): string {
        return "Rock Question " + index;
    }

    public add(name: string): boolean {
        this.players.push(name);
        this.places[this.howManyPlayers()] = 0;
        this.purses[this.howManyPlayers()] = 0;
        this.inPenaltyBox[this.howManyPlayers()] = false;

        this.logger.log(name + " was added");
        this.logger.log("They are player number " + this.players.length);

        return true;
    }

    private howManyPlayers(): number {
        return this.players.length;
    }

    public roll(roll: number) {
        this.logger.log(this.players[this.currentPlayer] + " is the current player");
        this.logger.log("They have rolled a " + roll);

        if (this.inPenaltyBox[this.currentPlayer]) {
            if (roll % 2 != 0) {
                this.isGettingOutOfPenaltyBox = true;

                this.logger.log(this.players[this.currentPlayer] + " is getting out of the penalty box");
                this.places[this.currentPlayer] = this.places[this.currentPlayer] + roll;
                if (this.places[this.currentPlayer] > 11) {
                    this.places[this.currentPlayer] = this.places[this.currentPlayer] - 12;
                }

                this.logger.log(this.players[this.currentPlayer] + "'s new location is " + this.places[this.currentPlayer]);
                this.logger.log("The category is " + this.currentCategory());
                this.askQuestion();
            } else {
                this.logger.log(this.players[this.currentPlayer] + " is not getting out of the penalty box");
                this.isGettingOutOfPenaltyBox = false;
            }
        } else {

            this.places[this.currentPlayer] = this.places[this.currentPlayer] + roll;
            if (this.places[this.currentPlayer] > 11) {
                this.places[this.currentPlayer] = this.places[this.currentPlayer] - 12;
            }

            this.logger.log(this.players[this.currentPlayer] + "'s new location is " + this.places[this.currentPlayer]);
            this.logger.log("The category is " + this.currentCategory());
            this.askQuestion();
        }
    }

    private askQuestion(): void {
        if (this.currentCategory() == QuestionCategory.POP)
            this.logger.log(this.popQuestions.shift());
        if (this.currentCategory() == QuestionCategory.SCIENCE)
            this.logger.log(this.scienceQuestions.shift());
        if (this.currentCategory() == QuestionCategory.SPORTS)
            this.logger.log(this.sportsQuestions.shift());
        if (this.currentCategory() == 'Rock')
            this.logger.log(this.rockQuestions.shift());
    }

    private currentCategory(): string {
        if (this.places[this.currentPlayer] == 0)
            return QuestionCategory.POP;
        if (this.places[this.currentPlayer] == 4)
            return QuestionCategory.POP;
        if (this.places[this.currentPlayer] == 8)
            return QuestionCategory.POP;
        if (this.places[this.currentPlayer] == 1)
            return QuestionCategory.SCIENCE;
        if (this.places[this.currentPlayer] == 5)
            return QuestionCategory.SCIENCE;
        if (this.places[this.currentPlayer] == 9)
            return QuestionCategory.SCIENCE;
        if (this.places[this.currentPlayer] == 2)
            return QuestionCategory.SPORTS;
        if (this.places[this.currentPlayer] == 6)
            return QuestionCategory.SPORTS;
        if (this.places[this.currentPlayer] == 10)
            return QuestionCategory.SPORTS;
        return 'Rock';
    }

    private didPlayerWin(): boolean {
        return !(this.purses[this.currentPlayer] == 6)
    }

    public wrongAnswer(): boolean {
        this.logger.log('Question was incorrectly answered');
        this.logger.log(this.players[this.currentPlayer] + " was sent to the penalty box");
        this.inPenaltyBox[this.currentPlayer] = true;

        this.currentPlayer += 1;
        if (this.currentPlayer == this.players.length)
            this.currentPlayer = 0;
        return true;
    }

    public wasCorrectlyAnswered(): boolean {
        if (this.inPenaltyBox[this.currentPlayer]) {
            if (this.isGettingOutOfPenaltyBox) {
                this.logger.log('Answer was correct!!!!');
                this.purses[this.currentPlayer] += 1;
                this.logger.log(this.players[this.currentPlayer] + " now has " +
                    this.purses[this.currentPlayer] + " Gold Coins.");

                var winner = this.didPlayerWin();
                this.currentPlayer += 1;
                if (this.currentPlayer == this.players.length)
                    this.currentPlayer = 0;

                return winner;
            } else {
                this.currentPlayer += 1;
                if (this.currentPlayer == this.players.length)
                    this.currentPlayer = 0;
                return true;
            }


        } else {

            this.logger.log("Answer was corrent!!!!");

            this.purses[this.currentPlayer] += 1;
            this.logger.log(this.players[this.currentPlayer] + " now has " +
                this.purses[this.currentPlayer] + " Gold Coins.");

            var winner = this.didPlayerWin();

            this.currentPlayer += 1;
            if (this.currentPlayer == this.players.length)
                this.currentPlayer = 0;

            return winner;
        }
    }

    public log(message: string) {
        console.log(message);
    }
}
