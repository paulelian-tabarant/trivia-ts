import {Logger} from "./logger";

enum QuestionCategory {
    POP = 'Pop',
    SCIENCE = 'Science',
    SPORTS = 'Sports',
    ROCK = 'Rock',
}

function nameOfQuestionWith(questionCategory: QuestionCategory, questionNumber: number) {
    return `${questionCategory} Question ${questionNumber}`;
}

export class Game implements Logger {

    private players: Array<string> = [];
    private places: Array<number> = [];
    private purses: Array<number> = [];
    private inPenaltyBox: Array<boolean> = [];
    private currentPlayerIndex: number = 0;
    private isGettingOutOfPenaltyBox: boolean = false;

    private popQuestions: Array<string> = [];
    private scienceQuestions: Array<string> = [];
    private sportsQuestions: Array<string> = [];
    private rockQuestions: Array<string> = [];

    private QUESTIONS_BY_CATEGORY: Record<QuestionCategory, string[]> = {
        [QuestionCategory.POP]: this.popQuestions,
        [QuestionCategory.SCIENCE]: this.scienceQuestions,
        [QuestionCategory.SPORTS]: this.sportsQuestions,
        [QuestionCategory.ROCK]: this.rockQuestions,
    }

    constructor(private readonly logger: Logger = this) {
        [
            QuestionCategory.POP,
            QuestionCategory.SCIENCE,
            QuestionCategory.SPORTS,
            QuestionCategory.ROCK,
        ].forEach(category => this.createFiftyQuestionsOf(category))
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
        this.logger.log(this.players[this.currentPlayerIndex] + " is the current player");
        this.logger.log("They have rolled a " + roll);

        if (this.inPenaltyBox[this.currentPlayerIndex]) {
            if (roll % 2 != 0) {
                this.isGettingOutOfPenaltyBox = true;

                this.logger.log(this.players[this.currentPlayerIndex] + " is getting out of the penalty box");
                this.extracted(roll);
            } else {
                this.logger.log(this.players[this.currentPlayerIndex] + " is not getting out of the penalty box");
                this.isGettingOutOfPenaltyBox = false;
            }
        } else {

            this.extracted(roll)
        }
    }

    private extracted(roll: number) {
        this.places[this.currentPlayerIndex] = this.places[this.currentPlayerIndex] + roll;
        if (this.places[this.currentPlayerIndex] > 11) {
            this.places[this.currentPlayerIndex] = this.places[this.currentPlayerIndex] - 12;
        }

        this.logger.log(this.players[this.currentPlayerIndex] + "'s new location is " + this.places[this.currentPlayerIndex]);
        this.logger.log("The category is " + this.currentCategory());
        this.askQuestion();
    }

    public wasCorrectlyAnswered(): boolean {
        if (this.inPenaltyBox[this.currentPlayerIndex] && !this.isGettingOutOfPenaltyBox) {
            this.moveToNextPlayer()
            return true;
        }

        this.purses[this.currentPlayerIndex] += 1;

        this.logger.log(this.inPenaltyBox[this.currentPlayerIndex] && this.isGettingOutOfPenaltyBox ?
            'Answer was correct!!!!' : 'Answer was corrent!!!!');
        this.logger.log(this.players[this.currentPlayerIndex] + " now has " +
            this.purses[this.currentPlayerIndex] + " Gold Coins.");

        const didPlayerWin = !(this.purses[this.currentPlayerIndex] == 6);
        this.moveToNextPlayer()

        return didPlayerWin;
    }

    public wrongAnswer(): boolean {
        this.logger.log('Question was incorrectly answered');
        this.logger.log(this.players[this.currentPlayerIndex] + " was sent to the penalty box");

        this.inPenaltyBox[this.currentPlayerIndex] = true;

        this.moveToNextPlayer();

        return true;
    }

    private moveToNextPlayer() {
        this.currentPlayerIndex += 1;
        if (this.currentPlayerIndex == this.players.length)
            this.currentPlayerIndex = 0;
    }

    private createFiftyQuestionsOf(category: QuestionCategory) {
        for (let i = 0; i < 50; i++) {
            this.QUESTIONS_BY_CATEGORY[category].push(nameOfQuestionWith(category, i));
        }
    }

    private howManyPlayers(): number {
        return this.players.length;
    }

    private askQuestion(): void {
        this.logger.log(this.QUESTIONS_BY_CATEGORY[this.currentCategory()].shift());
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

        return CATEGORY_BY_PLACE[this.places[this.currentPlayerIndex]];
    }

    private didCurrentPlayerWin(): boolean {
        return !(this.purses[this.currentPlayerIndex] == 6)
    }

    public log(message: string) {
        console.log(message);
    }
}
