export enum GameStatusEnum {
    NOT_STARTED = "not_started",
    IN_PROGRESS = "in_progress",
    REVIEW_PENDING = "review_pending",
    COMPLETED = "completed"
}

export type GameStatus = {
    status: GameStatusEnum;
    statusColor: string;
    statusText: string;
};

export const GameStatusMapping: Record<GameStatusEnum, GameStatus> = {
    [GameStatusEnum.NOT_STARTED]: {
        status: GameStatusEnum.NOT_STARTED,
        statusColor: "grey-lighten-2",
        statusText: "游戏未开始"
    },
    [GameStatusEnum.IN_PROGRESS]: {
        status: GameStatusEnum.IN_PROGRESS,
        statusColor: "blue-lighten-4",
        statusText: "游戏进行中"
    },
    [GameStatusEnum.REVIEW_PENDING]: {
        status: GameStatusEnum.REVIEW_PENDING,
        statusColor: "red-darken-4",
        statusText: "审核中"
    },
    [GameStatusEnum.COMPLETED]: {
        status: GameStatusEnum.COMPLETED,
        statusColor: "green-darken-3",
        statusText: "游戏结束"
    }
};