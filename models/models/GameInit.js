import { DataTypes } from 'sequelize'

export default (sequelize) => {
    const GameInitialization = sequelize.define('GameInitialization', {
       // user_id: { type: DataTypes.INTEGER, references: { model: 'User', key: 'id' } },
        user_id: { type: DataTypes.INTEGER },
        foxArr: DataTypes.JSON,
        start_time: DataTypes.DATE,
        end_time: DataTypes.DATE,
        result: DataTypes.STRING,
    }, { timestamps: true })

    return GameInitialization
}

