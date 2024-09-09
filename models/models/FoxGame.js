import { DataTypes } from 'sequelize'

export default (sequelize) => {
    const FoxGame = sequelize.define('fox_game', {
        fox_game_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
       // user_id: { type: DataTypes.INTEGER, references: { model: 'User', key: 'id' } },       
        user_id         : DataTypes.INTEGER,
        fox_arr         : DataTypes.JSON,
        moves           : DataTypes.BLOB,
        game_time       : DataTypes.INTEGER,        
        count_result    : DataTypes.INTEGER,
        score           : DataTypes.INTEGER,
    }, { 
        timestamps: true,
        underscored: true, 
     })

    return FoxGame
}

