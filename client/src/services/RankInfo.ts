export const getRankInfo = ( totalScore:number) => {
    let rank = "newbie"

    if (totalScore>1000){
        rank = "beginner"
    }
    if (totalScore>10000){
        rank = "apprentice"
    }
    if (totalScore>100000){
        rank = "skilled"
    }
    if (totalScore>1000000){
        rank = "veteran"
    }
    if (totalScore>10000000){
        rank = "professional"
    }
    if (totalScore>100000000){
        rank = "master"
    }
    if (totalScore>1000000000){
        rank = "expert"
    }

    if (totalScore>10000000000){
        rank = "grandmaster"
    }

    if (totalScore>100000000000){
        rank = "legend"
    }

    if (totalScore>1000000000000){
        rank = "gamegod"
    }
    return rank
}