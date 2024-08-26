import config from 'config'
import { Sequelize } from 'sequelize'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const dbConfig = config.get('dbConfig')
const db = {}

console.log("Connect to DB", dbConfig.HOST)

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle,
    },
})

db.sequelize = sequelize
db.Sequelize = Sequelize

// Path to the directory containing your model files
const modelsDirectory = path.join(__dirname, 'models')

// Load all model files
// const loadModels = async () => {
//     const files = fs.readdirSync(modelsDirectory)
   
//     for (const file of files) {
//         const modelPath = path.join(modelsDirectory, file)
//         const model = (await import(modelPath)).default(sequelize, Sequelize.DataTypes)
//        // console.log(model, model.name, modelPath)
//         db[model.name] = model
//     }

//     // Optional: If you have associations, initialize them here
//     Object.keys(db).forEach((modelName) => {
//        // console.log(modelName)
//         if (db[modelName].associate) {
//             db[modelName].associate(db);
//         }
//     })
// }

// Load all model files
const loadModels = async () => {
    const files = fs.readdirSync(modelsDirectory)
   
    for (const file of files) {
        const modelPath = path.join(modelsDirectory, file)
        const module = await import(modelPath)
        const model = module.default(sequelize, Sequelize.DataTypes)
        const modelName = model.name.charAt(0).toUpperCase() + model.name.slice(1)
        db[modelName] = model
    }

    // This part is needed only if you have associations defined between models
    // Object.keys(db).forEach((modelName) => {
    //     if (db[modelName].associate) {
    //         db[modelName].associate(db);
    //     }
    // })
}

await loadModels()

//db.User.hasMany(db.GameInitialization, { foreignKey: 'user_id' })
//db.GameInitialization.belongsTo(db.User, { foreignKey: 'user_id' })

export const createAllDB = async (force=false) =>{
    await db.sequelize.sync({ force: force }) // Set to true to drop and recreate the tables
    console.log('Database & tables created!')
}

export default db
