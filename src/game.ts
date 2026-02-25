import {Logger} from "./logger";

enum QuestionCategory {
    POP = 'Pop',
    SCIENCE = 'Science',
    SPORTS = 'Sports',
    ROCK = 'Rock',
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
            const questionCategory = QuestionCategory.POP
            this.popQuestions.push(this.getItems(questionCategory, i));
            this.scienceQuestions.push("Science Question " + i);
            this.sportsQuestions.push("Sports Question " + i);
            this.rockQuestions.push("Rock Question " + i);
        }
    }

    private getItems(questionCategory: QuestionCategory.POP, i: number) {
        return `${questionCategory} Question ${i}`;
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

    public wrongAnswer(): boolean {
        this.logger.log('Question was incorrectly answered');
        this.logger.log(this.players[this.currentPlayer] + " was sent to the penalty box");
        this.inPenaltyBox[this.currentPlayer] = true;

        this.currentPlayer += 1;
        if (this.currentPlayer == this.players.length)
            this.currentPlayer = 0;
        return true;
    }

    private howManyPlayers(): number {
        return this.players.length;
    }

    private askQuestion(): void {
        this.logger.log(this.QUESTIONS_BY_CATEGORY[this.currentCategory()].shift());
    }

    private QUESTIONS_BY_CATEGORY: Record<QuestionCategory, string[]> = {
        [QuestionCategory.POP]: this.popQuestions,
        [QuestionCategory.SCIENCE]: this.scienceQuestions,
        [QuestionCategory.SPORTS]: this.sportsQuestions,
        [QuestionCategory.ROCK]: this.rockQuestions,
    }

    private currentCategory(): string {
        const CATEGORY_BY_PLACE: Record<number, QuestionCategory | undefined> = {
            NaN: QuestionCategory.ROCK, // probable bug
            0: QuestionCategory.POP,
            1: QuestionCategory.SCIENCE,
            2: QuestionCategory.SPORTS,
            3: QuestionCategory.ROCK,
            4: QuestionCategory.POP,
            5: QuestionCategory.SCIENCE,
            6: QuestionCategory.SPORTS,
            7: QuestionCategory.ROCK,
            8: QuestionCategory.POP,
            9: QuestionCategory.SCIENCE,
            10: QuestionCategory.SPORTS,
            11: QuestionCategory.ROCK,
        }

        return CATEGORY_BY_PLACE[this.places[this.currentPlayer]];
    }

    private didPlayerWin(): boolean {
        return !(this.purses[this.currentPlayer] == 6)
    }

    public log(message: string) {
        console.log(message);
    }
}
