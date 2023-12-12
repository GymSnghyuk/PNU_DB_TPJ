const dbClient = require('../../lib/db')


let rp = {}

rp.parent_register = async function (user_id, dis_data){
    
    querystring = `
        INSERT INTO parent(user_id)
         values ('${user_id}');
    `

    await dbClient
        .query(querystring)
        .then(()=>{
            console.log(`insert complete`);
        })
        .catch((e) =>{
            console.error(e.stack)
        });

    const parentid_query = `
        SELECT max(parent_id)
        FROM parent;
    `;

    let parentid;
    await dbClient.query(parentid_query)
        .then((results)=>{
            parentid = results.rows[0].max;
        })
        .catch((err)=>{
            console.error(err);
        })

    for(let i=0; i<dis_data.length; ++i){
        const check_disabled_id = `
            SELECT disabled_id
            FROM disabled
            WHERE user_id = '${dis_data[i]}';
        `;
        console.log(dis_data[i]);
        await dbClient.query(check_disabled_id)
            .then((results)=>{
                if(results.rowCount==1){
                    console.log(results.rows[0].disabled_id);
                    const insert_take_parent = `
                        INSERT INTO relationship VALUES (${parentid}, ${results.rows[0].disabled_id});
                    `;

                    dbClient.query(insert_take_parent)
                        .then((results)=>{
                            console.log(`insert relationship`);
                        })
                        .catch((err)=>{
                            console.error(err);
                        });
                }
            })
            .catch((err)=>{
                console.error(err);
            })
    };

}

module.exports = rp;