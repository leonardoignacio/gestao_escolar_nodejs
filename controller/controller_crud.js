export default {
    sql_ler: (tabela)=>`SELECT * FROM ${tabela}`, 
    sql_inserir: (tabela, campos, placeholders)=>
        `INSERT INTO 
        ${tabela} (${campos}) 
        VALUES (${placeholders})
        RETURNING id;`,
    sql_atualizar:(tabela, placeholders, id )=>
        `UPDATE ${tabela} 
         SET ${placeholders} 
         WHERE id=$${id};`,

    sql_delete: (id)=>`DELETE FROM ${tabela} WHERE id = $1;`
}