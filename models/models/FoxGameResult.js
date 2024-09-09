import { DataTypes } from 'sequelize'

export default (sequelize) => {
    const FoxGameResult = sequelize.define('fox_game_result', {      
        user_id: DataTypes.INTEGER,
        count: DataTypes.INTEGER,        
        best_click: DataTypes.INTEGER,
        best_time: DataTypes.INTEGER,        
        best_score: DataTypes.INTEGER,
    }, { 
        timestamps: true,
        underscored: true, 
     })

    return FoxGameResult
}

