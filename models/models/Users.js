import { DataTypes } from 'sequelize'

export default (sequelize) => {
    const Users = sequelize.define('users', {
        user_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        telegram_id         : { type: DataTypes.INTEGER, unique: true },
        language_code       : DataTypes.STRING,
        last_name           : DataTypes.STRING,
        first_name          : DataTypes.STRING,
        username            : DataTypes.STRING,        
        total_balance       : DataTypes.INTEGER,
        current_game_id     : DataTypes.STRING,
        current_game_type   : DataTypes.TINYINT,
    }, { 
        timestamps: true,
        underscored: true, 
    })

    return Users
}