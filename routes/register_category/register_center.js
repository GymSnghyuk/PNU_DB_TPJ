const dbClient = require('../../lib/db')
const get_id_num = require('./id_num_min')

let rc = {}

rc.center_register = async function (name, address, user_id){
    const center_id = await get_id_num.GET_ID_NUM('center')+1;
    
    querystring = `
        INSERT INTO center values (${center_id}, '${name}','${address}',${false} , '${user_id}');
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

module.exports = rc;