import db from '../db.js'
export default {
    sql_ler: async (tabela) => await db.query(`SELECT * FROM ${tabela}`),
    sql_inserir: async (body, tabela) => {
        let campos = Object.keys(body).join(', ')
        let dados = Object.values(body)
        let placeholders = dados.map((dado, i) => `$${i + 1}`).join(', ')
        return `INSERT INTO 
        ${tabela} (${campos}) 
        VALUES (${placeholders})
        RETURNING id;`
        let resp = await db.query(sql, dados)
        return resp
    },
    sql_atualizar: async (body, tabela, id) => {
        let campos = Object.keys(body) 
        let placeholders = campos.map((c, i) => `${c}=$${i + 1}`).join(', ') 
        dados.push(id) 
        let sql = `UPDATE ${tabela} 
                    SET ${placeholders} 
                    WHERE id=$${id};`
        let resp = await db.query(sql, dados)
        return resp
    },

    sql_delete: async (id) => await db.query(`DELETE FROM ${tabela} WHERE id = $1;`, [id])
}