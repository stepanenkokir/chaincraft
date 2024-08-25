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
        user_id: DataTypes.INTEGER,
        fox_arr: DataTypes.JSON,
        start_time: DataTypes.DATE,
        end_time: DataTypes.DATE,
        count_result: DataTypes.STRING,
        score: DataTypes.INTEGER,
    }, { timestamps: true })

    return FoxGame
}

