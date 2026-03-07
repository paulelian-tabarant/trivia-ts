export enum QuestionCategory {
    POP = 'Pop',
    SCIENCE = 'Science',
    SPORTS = 'Sports',
    ROCK = 'Rock',
}

export function createNQuestionsOfCategory(n: number, category: QuestionCategory): string[] {
    return [...Array(n)].map((_, index) => `${category} Question ${index}`);
}
