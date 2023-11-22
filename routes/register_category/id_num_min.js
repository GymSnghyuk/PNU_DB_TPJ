const dbClient = require(`../../lib/db`)

module.exports.GET_ID_NUM = async function(relation){
    let value;
    querystring = `
        SELECT count(*) FROM ${relation};
    `;

    await dbClient
        .query(querystring)
        .then((res)=>{
            console.log(`가입된 disabled 수 : ${res.rows[0]["count"]}`)
            value = res.rows[0]["count"];
        })
        .catch((e)=>{
            console.error(e.stack);
        })

    return value;
}