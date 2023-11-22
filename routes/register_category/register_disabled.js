const dbClient = require('../../lib/db')
const get_id_num = require('./id_num_min')

let rd = {}

rd.disabled_register = async function (name, is_parent, is_center, hobby, kind_of_disabled, user_id){
    const disabled_id = await get_id_num.GET_ID_NUM('disabled')+1;
    
    querystring = `
        INSERT INTO disabled values (${disabled_id}, '${name}', ${is_parent},
        ${is_center}, '${hobby}', '${kind_of_disabled}', '${user_id}');
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

module.exports = rd;