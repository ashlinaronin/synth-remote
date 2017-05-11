const localtunnel = require('localtunnel');
const port = 5000;
let tunnel;


function setupTunnel(subdomain) {
    tunnel = localtunnel(port, {subdomain: subdomain}, (err, tunnel) => {
        if (err) {
            console.log(err);
        }

        console.log(`tunnel exposed at ${tunnel.url}`);
    });

    tunnel.on('close', () => {
        console.log('tunnel closed');
    });
}

module.exports = {
    setupTunnel
};