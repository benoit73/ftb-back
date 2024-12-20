const sql = require("../helper/sqlHelper");
const tcpPortUsed = require('tcp-port-used');

async function chooseFreePort()
{
    const checkAvailablePortSQLResult = await checkAvailablePortSQL();

    if (checkAvailablePortSQLResult.success == false || !checkAvailablePortSQLResult.port)
    {
        console.log('Impossible de trouver un port via SQL.')
        return {success: false}
    }
    let port = checkAvailablePortSQLResult.port

    let resultCheckPort;
    do 
    {
        resultCheckPort = await checkPort(port)
        if (resultCheckPort.success != true)
        {
            port++
        }
        if (resultCheckPort.critic == true)
        {
            return {success: false}
        }
    }
    while (resultCheckPort.success != true)
    
    return {success: true, port: port}
}

async function checkAvailablePortSQL()
{   
    const query = 'SELECT portNum FROM servers ORDER BY portNum DESC LIMIT 1';
    const result = await sql.queryWithParams(query);
    if (result.data[0])
    {
        return {success: true, port: result.data[0].portNum + 1}
    }
    if (result.data)
        {
            return {success: true, port: 58100}
        }
    console.log('Erreur dans les résultats de checkAvailablePortSQL : ')
    console.log(result)
    return {success: false}
}

async function checkPort(port) {
    try {
        const inUse = await tcpPortUsed.check(port, '127.0.0.1');
        if (!inUse) {
            return { success: true };
        }
        return { success: false };
    } catch (err) {
        console.error('Error on check:', err.message);
        return { success: false, critic: true };
    }
}


module.exports = {chooseFreePort}