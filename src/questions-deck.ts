export enum QuestionCategory {
    POP = 'Pop',
    SCIENCE = 'Science',
    SPORTS = 'Sports',
    ROCK = 'Rock',
}

export class QuestionsDeck {
    private readonly questionsByCategory: Record<QuestionCategory, string[]> = Object.values(QuestionCategory)
        .reduce((acc, category) => ({
            ...acc,
            [category]: QuestionsDeck.createNQuestionsOfCategory(50, category)
        }), {} as Record<QuestionCategory, string[]>)

    public pickQuestion(category: QuestionCategory): string {
        return this.questionsByCategory[category].shift()
    }

    private static createNQuestionsOfCategory(n: number, category: QuestionCategory): string[] {
        return [...Array(n)].map((_, index) => `${category} Question ${index}`);
    }
}
