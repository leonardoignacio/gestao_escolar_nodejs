import express from 'express'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
const app = express()
const PORT = 3000
const __filename = fileURLToPath(import.meta.url)
console.log("FileName: ",__filename)
const __dirname = path.dirname(__filename)
console.log("DirName: ", __dirname)
const baseDir = path.join(__dirname, 'templates')
console.log("BaseDir: ", baseDir)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res)=>res.sendFile(path.join(baseDir, 'index.html')))

app.listen(PORT, () => {console.log('Server is running on http://localhost:'+PORT)})
