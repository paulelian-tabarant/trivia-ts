import {QuestionCategory} from "./questions-deck";

export class Board {
    public static readonly BOARD_SIZE = 12;

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
}
