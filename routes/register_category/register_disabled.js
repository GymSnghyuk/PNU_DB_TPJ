const dbClient = require('../../lib/db')


let rd = {}

rd.disabled_register = async function (is_parent, is_center, hobby, kind_of_disabled, user_id){
    
    querystring = `
        INSERT INTO disabled (is_parent, is_center, hobby, kind_of_disabled, user_id)
            values (${is_parent}, ${is_center}, '${hobby}', '${kind_of_disabled}', '${user_id}');
    `

    console.log(querystring);

    await dbClient
        .query(querystring)
        .then(()=>{
            console.log(`insert complete`);
        })
        .catch((e) =>{
            console.error(e.stack)
           
        })
}

module.exports = rd;