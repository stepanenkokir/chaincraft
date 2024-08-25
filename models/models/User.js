import { DataTypes } from 'sequelize'

export default (sequelize) => {
    const User = sequelize.define('user', {
        user_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        telegram_id     : { type: DataTypes.INTEGER, unique: true },
        language_code   : DataTypes.STRING,
        last_name       : DataTypes.STRING,
        first_name      : DataTypes.STRING,
        username        : DataTypes.STRING,
        token           : DataTypes.STRING,
        balance         : DataTypes.INTEGER,
    }, { timestamps: true })

    return User
}