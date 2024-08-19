import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import config from 'config'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT =  config.has('port')? config.get('port'): 50007

app.use(express.static(path.join(__dirname, 'client', 'dist')))

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})
