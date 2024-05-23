const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

// Configuração para o Hyperledger Fabric
const { Wallets, Gateway } = require('fabric-network');
const fs = require('fs');
const path = require('path');
const ccpPath = path.resolve(__dirname, '.',  'mychannel_connection_for_nodesdk.json');

app.post('/api/CriarLote/', async function (req, res) {
    try {

        let ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

         // Create a new file system based wallet for managing identities.
        const walletPath = path.join('/home/mario/mywork/API/wallets/', 'fabrica.nerdstore.com.br');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        const identity = await wallet.get('Admin');
        if (!identity) {
            console.log('Não existe uma identidade para o usuário "Admin" na carteira informada');    
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'Admin', discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        const contract = network.getContract('chaincodenerdstore');

        /** Atenção na ordem dos parametros */
        await contract.submitTransaction('CriarLote', req.body.id, req.body.numeroLote, req.body.tipoVestuario, req.body.quantidadeFabricadaLote, req.body.tamanho, req.body.caracteristicasDesign, req.body.operador);
        console.log('Transaction has been submitted');
        res.send('Transaction has been submitted'); 

        // Disconnect from the gateway.
        await gateway.disconnect();

    } catch (error) {
        console.error(`Falha ao submeter transação: ${error}`);        
		 res.status(500).json({error: error});
    }
});

app.get('/api/BuscarTodosLotes', async function (req, res) {
    try {

        let ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // Create a new file system based wallet for managing identities.
         const walletPath = path.join('/home/mario/mywork/API/wallets/', 'fabrica.nerdstore.com.br');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const identity = await wallet.get('Admin');
        if (!identity) {
            console.log('Não existe uma identidade para o usuário "Admin" na carteira');
            //console.log('Run the registerUser.js application before retrying');
            return;
        }
// Create a new gateway for connecting to our peer node.
const gateway = new Gateway();
await gateway.connect(ccp, { wallet, identity: 'Admin', discovery: { enabled: true, asLocalhost: true } });

// Get the network (channel) our contract is deployed to.
const network = await gateway.getNetwork('mychannel');

// Get the contract from the network.
const contract = network.getContract('chaincodenerdstore');

// Evaluate the specified transaction.
const result = await contract.evaluateTransaction('GetAllAssets');
console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
res.status(200).json({response: result.toString()});

// Disconnect from the gateway.
await gateway.disconnect();

} catch (error) {
console.error(`Failed to evaluate transaction: ${error}`);
res.status(500).json({error: error});
process.exit(1);
}
});

app.get('/api/PesquisarLotePorNumero/:numero_lote', async function (req, res) {
    try {

          let ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
        // Create a new file system based wallet for managing identities.
         const walletPath = path.join('/home/mario/mywork/API/wallets/', 'fabrica.nerdstore.com.br');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const identity = await wallet.get('Admin');
        if (!identity) {
            console.log('Não existe uma identidade para o usuário "Admin" na carteira');
           // console.log('Run the registerUser.js application before retrying');
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'Admin', discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        const contract = network.getContract('chaincodenerdstore');

        // Evaluate the specified transaction.
        const result = await contract.evaluateTransaction('PesquisarLotePorNumero', req.params.numero_lote);
        console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
        res.status(200).json({response: result.toString()});

        // Disconnect from the gateway.
        await gateway.disconnect();

    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        res.status(500).json({error: error});
    }
});

app.put('/api/MovimentarLote/', async function (req, res) {
    try {

        let ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join('/home/mario/mywork/API/wallets/', 'fabrica.nerdstore.com.br');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const identity = await wallet.get('Admin');
        if (!identity) {
            console.log('Não existe uma identidade para o usuário "Admin" na carteira');
            console.log('Run the registerUser.js application before retrying');
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'Admin', discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        const contract = network.getContract('chaincodenerdstore');

        // Submit the specified transaction.
        await contract.submitTransaction('MovimentarLote', req.body.id,req.body.numeroLote, req.body.tipoVestuario, req.body.quantidadeFabricadaLote, req.body.tamanho, req.body.caracteristicasDesign, req.body.operador, req.body.organizacaoDestino);
		
        console.log('Transaction has been submitted');
        res.send('Transaction has been submitted');

        // Disconnect from the gateway.
        await gateway.disconnect();

    } catch (error) {
       console.error(`Falha ao submeter transação: ${error}`);
        res.status(500).json({error: error});
        
    }
});

app.put('/api/ConfirmarVendaLote/', async function (req, res) {
    try {

        let ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join('/home/mario/mywork/API/wallets/', 'fabrica.nerdstore.com.br');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const identity = await wallet.get('Admin');
        if (!identity) {
            console.log('Não existe uma identidade para o usuário "Admin" na carteira');
            console.log('Run the registerUser.js application before retrying');
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'Admin', discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        const contract = network.getContract('chaincodenerdstore');

        // Submit the specified transaction.
        await contract.submitTransaction('ConfirmarVendaLote', req.body.id,req.body.numeroLote, req.body.tipoVestuario, req.body.status, req.body.quantidadeFabricadaLote, req.body.estoque, req.body.tamanho, req.body.caracteristicasDesign, req.body.operador, req.body.quantidadeVendidaLote);
		
        console.log('Transaction has been submitted');
        res.send('Transaction has been submitted');

        // Disconnect from the gateway.
        await gateway.disconnect();

    } catch (error) {
       console.error(`Falha ao submeter transação: ${error}`);
        res.status(500).json({error: error});
        
    }
});

app.put('/api/BloquearLoteVenda/', async function (req, res) {
    try {

        let ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join('/home/mario/mywork/API/wallets/', 'fabrica.nerdstore.com.br');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const identity = await wallet.get('Admin');
        if (!identity) {
            console.log('Não existe uma identidade para o usuário "Admin" na carteira');
            console.log('Run the registerUser.js application before retrying');
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'Admin', discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        const contract = network.getContract('chaincodenerdstore');

        // Submit the specified transaction.
        await contract.submitTransaction('BloquearLoteVenda', req.body.id,req.body.numeroLote, req.body.tipoVestuario, req.body.quantidadeFabricadaLote, req.body.estoque, req.body.tamanho, req.body.caracteristicasDesign, req.body.operador, req.body.organizacaoDestino, req.body.defeitoEncontrado);
		
        console.log('Transaction has been submitted');
        res.send('Transaction has been submitted');

        // Disconnect from the gateway.
        await gateway.disconnect();

    } catch (error) {
       console.error(`Falha ao submeter transação: ${error}`);
        res.status(500).json({error: error});
        
    }
});

app.get('/api/AuditarLote/:id', async function (req, res) {
    try {

        let ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // Create a new file system based wallet for managing identities.
       const walletPath = path.join('/home/mario/mywork/API/wallets/', 'fabrica.nerdstore.com.br');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const identity = await wallet.get('Admin');
        if (!identity) {
            console.log('Não existe uma identidade para o usuário "Admin" na carteira');
            console.log('Run the registerUser.js application before retrying');
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'Admin', discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        const contract = network.getContract('chaincodenerdstore');

        // Evaluate the specified transaction.
        const result = await contract.evaluateTransaction('AuditarLote', req.params.id);
        console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
        res.status(200).json({response: result.toString()});
        
        // Disconnect from the gateway.
        await gateway.disconnect();

    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        res.status(500).json({error: error});
    }
});

app.listen(8083);
