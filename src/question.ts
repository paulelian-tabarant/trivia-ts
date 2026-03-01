export enum QuestionCategory {
    POP = 'Pop',
    SCIENCE = 'Science',
    SPORTS = 'Sports',
    ROCK = 'Rock',
}

export function createNQuestionsOfCategory(n: number, category: QuestionCategory): string[] {
    return [...(new Array(n))].map(
        (_, index) => nameOfQuestionWith(category, index)
    );
}

function nameOfQuestionWith(questionCategory: QuestionCategory, questionNumber: number) {
    return `${questionCategory} Question ${questionNumber}`;
}