export enum QuestionCategory {
    POP = 'Pop',
    SCIENCE = 'Science',
    SPORTS = 'Sports',
    ROCK = 'Rock',
}

export function createFiftyQuestionsOf(category: QuestionCategory) {
    return [...(new Array(50))].map(
        (_, index) => nameOfQuestionWith(category, index)
    );
}

function nameOfQuestionWith(questionCategory: QuestionCategory, questionNumber: number) {
    return `${questionCategory} Question ${questionNumber}`;
}