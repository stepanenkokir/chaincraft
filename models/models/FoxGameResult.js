import { DataTypes } from 'sequelize'

export default (sequelize) => {
    const FoxGameResult = sequelize.define('fox_game_result', {
       // user_id: { type: DataTypes.INTEGER, references: { model: 'User', key: 'id' } },
        user_id: DataTypes.INTEGER,
        count: DataTypes.INTEGER,        
        best_click_count: DataTypes.INTEGER,
        best_click_time: DataTypes.INTEGER,
        best_time_count: DataTypes.INTEGER,
        best_time_time: DataTypes.INTEGER,
        total_score: DataTypes.INTEGER,        
    }, { timestamps: true })

    return FoxGameResult
}

