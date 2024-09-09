export type ResultGameInfo = {
    id: number,
    result : string
}

export type ServerInfoType = {
    user_id     : number,
    lang        : string,
    user_name   : string, 
    balance     : number,
    first_time  : Boolean | null
    result_info : Array<ResultGameInfo>
}

export type responseServerInfoType = { 
    success : Boolean, 
    data    : ServerInfoType | null, 
    message : string | null
}
