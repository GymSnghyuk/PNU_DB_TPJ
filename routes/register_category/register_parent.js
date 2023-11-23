const dbClient = require('../../lib/db')
const get_id_num = require('./id_num_min')

let rp = {}

rp.parent_register = async function (name, user_id){
    const parent_id = await get_id_num.GET_ID_NUM('parent')+1;
    
    querystring = `
        INSERT INTO parent values (${parent_id}, '${name}', '${user_id}');
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

module.exports = rp;