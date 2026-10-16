const tabelas = ['aluno', 'curso', 'docente']

function validar_req(tabela, id=0){
    if (!tabelas.includes(tabela.toLowerCase()) || isNaN(Number(id))){
       return false 
    }
    return true
}
export default validar_req