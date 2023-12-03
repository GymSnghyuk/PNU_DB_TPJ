const dbClient = require('../../lib/db')

let rt = {}

rt.teacher_register = async function (user_id){
    
    querystring = `
        INSERT INTO teacher (certificated, user_id)
         values (false , '${user_id}');
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

module.exports = rt;