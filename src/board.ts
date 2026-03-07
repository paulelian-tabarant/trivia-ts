import {QuestionCategory} from "./questions-deck";

export class Board {
    private readonly categoryByLocation: Record<number, QuestionCategory | undefined> = {
        NaN: QuestionCategory.ROCK, // FIXME probable bug
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

    public readCategoryAtLocation(location: number): QuestionCategory | undefined {
        return this.categoryByLocation[location];
    }

    get size() {
        return Object.keys(this.categoryByLocation).length - 1 // FIXME: this is a workaround to ignore the NaN key, but it is very likely to be a bug
    }
}
