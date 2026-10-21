import express from 'express'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import dotenv from 'dotenv'
import validar_req from './controller/controller_validacao_tabela.js'
import crud from './controller/controller_crud.js'
dotenv.config()
const app = express()
const { sql_ler, sql_inserir, sql_atualizar, sql_delete } = crud
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
app.get('/form/:tabela', (req, res)=>res.sendFile(path.join(baseDir, `form-${
        validar_req(req.params.tabela)?
        req.params.tabela: pg404
    }.html`)))


app.get('/listar/:tabela', async (req,res)=>{
    const { tabela } = req.params
    try {
        if (!validar_req(tabela)){
            res.status(400).json({Code:400, message:'Bad Request.'})
        }
        const dados = await sql_ler(tabela)
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
        let resp = await sql_inserir(body, tabela)
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
       let resp = await sql_atualizar(req.body, tabela, id)
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
        let resp = await sql_delete(id)
       res.status(200).json([{Code:200, Message:'Dados excluídos com sucesso.', linhasAfetadas:resp.rowCount}])
    } catch (erro) {
        res.status(500).json([{Code:500, Message:'Erro do servidor.'}, erro]) 
    }
})
app.listen(PORT, () => {console.log('Server is running on http://localhost:'+PORT)})


