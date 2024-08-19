export type LeaderBoardListType = {
    id: number,
    name: string,
    score: number
}

export type LeaderBoardType = {
    caption: string,
    listInfo: LeaderBoardListType[]
}
