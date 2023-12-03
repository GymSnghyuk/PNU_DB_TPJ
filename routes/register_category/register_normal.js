const dbClient = require('../../lib/db')

let rn = {}

rn.normal_register = async function (user_id){

    querystring = `
        INSERT INTO normal(user_id)
         values ('${user_id}');
    `

    dbClient
        .query(querystring)
        .then(()=>{
            console.log(`insert complete`);
        })
        .catch((e) =>{
            console.error(e.stack)
            
        })
}

module.exports = rn;