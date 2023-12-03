const dbClient = require('../../lib/db')

let rc = {}

rc.center_register = async function (address, user_id){
    querystring = `
        INSERT INTO center (address, certificated, user_id) values ('${address}',${false} , '${user_id}');
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

module.exports = rc;