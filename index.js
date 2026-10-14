import express from 'express'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import dotenv from 'dotenv'
import db from './db.js'
dotenv.config()
const app = express()
const PORT = process.env.PORT || 3000
const __filename = fileURLToPath(import.meta.url)
console.log("FileName: ",__filename)
const __dirname = path.dirname(__filename)
console.log("DirName: ", __dirname)
const baseDir = path.join(__dirname, 'templates')
console.log("BaseDir: ", baseDir)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const tabelas = ['aluno', 'curso', 'docente']

app.get('/', (req, res)=>res.sendFile(path.join(baseDir, 'index.html')))
app.get('/form/aluno', (req, res)=>res.sendFile(path.join(baseDir, 'form-aluno.html')))
app.get('/form/curso', (req, res)=>res.sendFile(path.join(baseDir, 'form-curso.html')))
app.get('/form/docente', (req, res)=>res.sendFile(path.join(baseDir, 'form-docente.html')))

app.get('/listar/:tabela', async (req,res)=>{
    const { tabela } = req.params
    try {
        if (!tabelas.includes(tabela.toLowerCase())){
            res.status(400).json({Code:400, message:'Bad Request.'})
        }
        const dados = await db.query(`SELECT * FROM ${tabela};`)
        
        res.status(200).json([{Code:200, Message:'Sucesso.'}, dados.rows])
    } catch (erro) {
        res.status(500).json([{Code:500, Message:'Erro do servidor.'}, erro])
    }
})

app.post('/cadastrar/:tabela', async (req, res)=>{
    try {
        let { tabela } = req.params
        if (!tabelas.includes(tabela.toLowerCase())){
            res.status(400).json({Code:400, message:'Bad Request.'})
        }
        
        let campos = Object.keys(req.body).join(', ') // Extração dos campos dinâmica
        let dados = Object.values(req.body) // Extração de dados dinâmica
        let placeholders = dados.map((dado, i)=>`$${i+1}`).join(', ') 
        // '$1, $2, $3'
        let sql = `INSERT INTO 
                    ${tabela} (${campos}) 
                    VALUES (${placeholders})
                    RETURNING id;
        `
        let resp = await db.query(sql, dados)
        res.status(201).json([{Code:201, Message:'Dados gravados com sucesso.'}, resp.rows[0]])
    } catch (erro) {
        res.status(500).json([{Code:500, Message:'Erro do servidor.'}, erro])
    }
})




app.listen(PORT, () => {console.log('Server is running on http://localhost:'+PORT)})


/*
    const campos = Object.keys(req.body)
    const valores = Object.values(req.body)
    valores.map((_, i) => `$${i + 1}`).join(', ')
*/