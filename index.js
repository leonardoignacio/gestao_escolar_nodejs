import express from 'express'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import dotenv from 'dotenv'
import db from './db.js'
import validar_req from './controller/controller_validacao_tabela.js'
import { sql_ler, sql_inserir, sql_atualizar, sql_delete } from './controller/controller_crud.js'
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

app.get('/', (req, res)=>res.sendFile(path.join(baseDir, 'index.html')))
app.get('/form/aluno', (req, res)=>res.sendFile(path.join(baseDir, 'form-aluno.html')))
app.get('/form/curso', (req, res)=>res.sendFile(path.join(baseDir, 'form-curso.html')))
app.get('/form/docente', (req, res)=>res.sendFile(path.join(baseDir, 'form-docente.html')))

app.get('/listar/:tabela', async (req,res)=>{
    const { tabela } = req.params
    try {
        if (!validar_req(tabela)){
            res.status(400).json({Code:400, message:'Bad Request.'})
        }
        const dados = await db.query(sql_ler)
        res.status(200).json([{Code:200, Message:'Sucesso.'}, dados.rows])
        
    } catch (erro) {
        res.status(500).json([{Code:500, Message:'Erro do servidor.'}, erro])
    }
})

app.post('/cadastrar/:tabela', async (req, res)=>{
    try {
        let { tabela } = req.params
        if (!validar_req(tabela)){
            res.status(400).json({Code:400, message:'Bad Request.'})
        }
        
        let campos = Object.keys(req.body).join(', ') // Extração dos campos dinâmica
        let dados = Object.values(req.body) // Extração de dados dinâmica
        let placeholders = dados.map((dado, i)=>`$${i+1}`).join(', ') // '$1, $2, $3'
        let sql = sql_inserir(tabela, campos, placeholders)
        let resp = await db.query(sql, dados)
        res.status(201).json([{Code:201, Message:'Dados gravados com sucesso.'}, resp.rows[0]])
    } catch (erro) {
        res.status(500).json([{Code:500, Message:'Erro do servidor.'}, erro])
    }
})

app.patch('/atualizar/:tabela/:id', async (req, res)=>{
    try {
       let { tabela, id } = req.params
       if (!validar_req(tabela, id)){
            res.status(400).json({Code:400, message:'Bad Request.'})
        }
        let campos = Object.keys(req.body) // ['matricula', 'nome', 'data_nascimento'] 
        let placeholders = campos.map((c, i)=>`${c}=$${i+1}`).join(', ') // 'matricula=$1, nome=$2, data_nascimento=$3'
        let dados = Object.values(req.body)
        dados.push(id) // ['2027-00098', 'Joaquim', '1997-12-01', '37']
       let sql = sql_atualizar(tabela, placeholders, dados.length)
       let resp = await db.query(sql, dados)
       res.status(200).json([{Code:200, Message:'Dados atualizados com sucesso.', linhasAfetadas:resp.rowCount}])
    } catch (erro) {
        res.status(500).json([{Code:500, Message:'Erro do servidor.'}, erro]) 
    }
})

app.delete('/deletar/:tabela/:id', async(req, res)=>{
    try {
        let { tabela, id } = req.params
       if (!validar_req(tabela, id)){
            res.status(400).json({Code:400, message:'Bad Request.'})
        }
        let sql = sql_delete(id)
        let resp = await db.query(sql, [id])
       res.status(200).json([{Code:200, Message:'Dados excluídos com sucesso.', linhasAfetadas:resp.rowCount}])
    } catch (erro) {
        res.status(500).json([{Code:500, Message:'Erro do servidor.'}, erro]) 
    }
})
app.listen(PORT, () => {console.log('Server is running on http://localhost:'+PORT)})


