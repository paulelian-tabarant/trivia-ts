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

const BOARD_SIZE = 12;

export class Game implements Logger {

    private playerNames: Array<string> = [];
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
        this.playerNames.push(name);
        this.places[this.howManyPlayers()] = 0;
        this.purses[this.howManyPlayers()] = 0;
        this.inPenaltyBox[this.howManyPlayers()] = false;

        this.logger.log(name + " was added");
        this.logger.log("They are player number " + this.playerNames.length);

        return true;
    }

    public roll(roll: number) {
        const currentPlayerName = this.playerNames[this.currentPlayerIndex];
        this.logger.log(currentPlayerName + " is the current player");
        this.logger.log("They have rolled a " + roll);

        this.isGettingOutOfPenaltyBox = this.inPenaltyBox[this.currentPlayerIndex] && roll % 2 != 0;

        if (this.inPenaltyBox[this.currentPlayerIndex] && !this.isGettingOutOfPenaltyBox) {
            this.logger.log(currentPlayerName + " is not getting out of the penalty box");
            return;
        }

        if (this.isGettingOutOfPenaltyBox) {
            this.logger.log(currentPlayerName + " is getting out of the penalty box");
        }

        this.movePlayerAccordingTo(roll)
    }

    private movePlayerAccordingTo(roll: number) {
        this.places[this.currentPlayerIndex] += roll;
        this.places[this.currentPlayerIndex] %= BOARD_SIZE

        this.logger.log(this.playerNames[this.currentPlayerIndex] + "'s new location is " + this.places[this.currentPlayerIndex]);
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
        this.logger.log(this.playerNames[this.currentPlayerIndex] + " now has " +
            this.purses[this.currentPlayerIndex] + " Gold Coins.");

        const didPlayerWin = !(this.purses[this.currentPlayerIndex] == 6);
        this.moveToNextPlayer()

        return didPlayerWin;
    }

    public wrongAnswer(): boolean {
        this.logger.log('Question was incorrectly answered');
        this.logger.log(this.playerNames[this.currentPlayerIndex] + " was sent to the penalty box");

        this.inPenaltyBox[this.currentPlayerIndex] = true;

        this.moveToNextPlayer();

        return true;
    }

    private moveToNextPlayer() {
        this.currentPlayerIndex += 1;
        if (this.currentPlayerIndex == this.playerNames.length)
            this.currentPlayerIndex = 0;
    }

    private createFiftyQuestionsOf(category: QuestionCategory) {
        for (let i = 0; i < 50; i++) {
            this.QUESTIONS_BY_CATEGORY[category].push(nameOfQuestionWith(category, i));
        }
    }

    private howManyPlayers(): number {
        return this.playerNames.length;
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

    public log(message: string) {
        console.log(message);
    }
}
