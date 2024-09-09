// Types
export type ResultInfoStock =  {
    title       : string,    
    heap        : number,
    score       : number,
    goal        : number,
    overkill    : boolean
}

export type NewValue = {
    result  : number;
    color   : string | null;
}
export type GridCell = {
    index   : number;
    result  : number;
    color   : string | null;
    shift   : string | null;
    newValue: NewValue |null;
}

export type NeighbourInfo = {
    gameOver    : boolean;
    win         : boolean
}