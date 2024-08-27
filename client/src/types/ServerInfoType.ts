export type ServerInfoType = {
    user_id     : number,
    lang        : string,
    user_name   : string, 
    balance     : number,
    first_time  : Boolean | null
}

export type responseServerInfoType = { 
    success : Boolean, 
    data    : ServerInfoType | null, 
    message : string | null
}
