const dbClient = require('../../lib/db')

let rc = {}

rc.center_register = async function (address, user_id, dis_data){
    const querystring = `
        INSERT INTO center (address, certificated, user_id) values ('${address}',${false} , '${user_id}');
    `

    await dbClient
        .query(querystring)
        .then(()=>{
            console.log(`insert complete`);
        })
        .catch((e) =>{
            console.error(e.stack)
        });
        
    const centerid_query = `
        SELECT max(center_id)
        FROM center;
    `;

    let centerid;
    await dbClient.query(centerid_query)
        .then((results)=>{
            centerid = results.rows[0].max;
        })
        .catch((err)=>{
            console.error(err);
        })

    for(let i=0; i<dis_data.length; ++i){
        let check_disabled_id = `
            SELECT disabled_id
            FROM disabled
            WHERE user_id = '${dis_data[i]}';
        `;
        
        await dbClient.query(check_disabled_id)
            .then((results)=>{
                if(results.rowCount==1){
                    console.log(results.rows[0].disabled_id);
                    const insert_take_center = `
                        INSERT INTO take_center VALUES (${centerid}, ${results.rows[0].disabled_id});
                    `;

                    dbClient.query(insert_take_center)
                        .then((results)=>{
                            console.log(`insert take_center`);
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

module.exports = rc;