import { DataTypes } from 'sequelize'

export default (sequelize) => {
    const FoxGameMove = sequelize.define('fox_game_move', {
        fox_game_move_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        //game_id: { type: DataTypes.INTEGER, references: { model: 'GameInitialization', key: 'id' } },
        fox_game_id : DataTypes.INTEGER,        
        clicks      : DataTypes.INTEGER,
        game_time   : DataTypes.INTEGER,
        moves       : DataTypes.BLOB
    }, { 
        timestamps: true,
        underscored: true, 
     })

    return FoxGameMove

}