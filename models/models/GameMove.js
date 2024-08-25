import { DataTypes } from 'sequelize'

export default (sequelize) => {
    const GameMove = sequelize.define('GameMove', {
        //game_id: { type: DataTypes.INTEGER, references: { model: 'GameInitialization', key: 'id' } },
        game_id: { type: DataTypes.INTEGER},
        move_number: DataTypes.INTEGER,
        move_time: DataTypes.DATE,
        move_index: DataTypes.INTEGER,
        move_result: DataTypes.STRING,
    }, { timestamps: true })

    return GameMove

}