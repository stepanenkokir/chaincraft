import { DataTypes } from 'sequelize'

export default (sequelize) => {
    const User = sequelize.define('User', {
        telegram_id: { type: DataTypes.INTEGER, unique: true },
        username: DataTypes.STRING,
        token: DataTypes.STRING,
    }, { timestamps: true })

    return User
}