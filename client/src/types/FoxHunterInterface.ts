// Types
export type GridCell = {
    index: number;
    clicked: boolean;
    result: string;
    flagged: boolean;
    withFox: boolean;
    findBlink: boolean;
}

export type ResultInfo =  {
    time: number,
    count: number,
    score : number
}
