const dbClient = require('../../lib/db')
const get_id_num = require('./id_num_min')

let rt = {}

rt.teacher_register = async function (name, user_id){
    const teacher_id = await get_id_num.GET_ID_NUM('teacher')+1;
    
    querystring = `
        INSERT INTO teacher values (${teacher_id}, '${name}', false , '${user_id}');
    `

    dbClient
        .query(querystring)
        .then(()=>{
            console.log(`insert complete`);
        })
        .catch((e) =>{
            console.error(e.stack)
            console.log(`register complete. but cannot insert into disabled`)
        })
}

module.exports = rt;