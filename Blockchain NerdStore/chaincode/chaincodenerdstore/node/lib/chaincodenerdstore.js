/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
   ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    Chaincode que gerencia uma cadeia de produtos de vestuário da marca ficticia "NerdStore" 
	
	Regras de Negócio:
	
	0 - Três Organizações: Fábrica, Distribuidor e Vendedor
	1 - O lote será o ativo 
    2 - Apenas a fábrica deve criar o lote
	3 - Apenas a fábrica e o distribuidor devem movimentar o lote
	4 - Qualquer organização pode realizar a venda
    5 - O lote deve ser bloqueado para vendas caso seja identificado um defeito de fabricação
    6 - Apenas a Fábrica pode bloquear um lote	
   ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
 */

'use strict';

const { Contract } = require('fabric-contract-api');

const shim = require('fabric-shim');

const ClientIdentity = require('fabric-shim').ClientIdentity;

class ChaincodeNerdStore extends Contract {
	
    async IniciarLedger(ctx) {
		
		var data = new Date();

        const assets = [
             {
                ID: 'inicialN001',
                NumeroLote: 'InicializacaoLedger',
				TipoVestuario: 'InicializacaoLedger', 
                QuantidadeFabricadaLote: 'InicializacaoLedger',
				Estoque: 'InicializacaoLedger',
				Tamanho: 'InicializacaoLedger',
                OrganizacaoPosseAtual: 'FABRICA',
                Status: 'InicializacaoLedger',
				CaracteristicasDesign: 'InicializacaoLedger',
				TipoOperacao: 'InicializacaoLedger',
				Operador: 'InicializacaoLedger',
				DataOperacao: data.toString(),
            }, 
			        
        ];

        for (const asset of assets) {
            asset.docType = 'asset';
            await ctx.stub.putState(asset.ID, Buffer.from(JSON.stringify(asset)));
            console.info(`Asset ${asset.ID} initialized`);
        }
    }
	
	async CriarLote(ctx, id, numeroLote, tipoVestuario, quantidadeFabricadaLote, tamanho, caracteristicasDesign, operador) {
        
		var data = new Date();
		
        const exists = await this.AssetExists(ctx, id);
        if (exists) {
			console.log('O  lote de número  ' + id +' já foi cadastrado e não pode ser repetido.');
            throw new Error(`O  lote de número ${id} já foi cadastrado e não pode ser repetido.`);  
        }

        const cid = ctx.clientIdentity;
        let MSPID_ORIGEM = cid.getMSPID();

        if (MSPID_ORIGEM !='fabrica-nerdstore-com-br') { 
			console.log('Usuário você pertence a organização ' + MSPID_ORIGEM + 'apenas usuários da fábrica podem cadastrar um lote.');
            throw new Error(`Usuário você pertence a organização  ${MSPID_ORIGEM} apenas usuários da fábrica podem cadastrar um lote.`);            
        }             
        else {
        const asset = {
                ID: id,
                NumeroLote: numeroLote,
				TipoVestuario: tipoVestuario, 
                QuantidadeFabricadaLote: quantidadeFabricadaLote,
				Estoque: quantidadeFabricadaLote,
				Tamanho: tamanho,
                OrganizacaoPosseAtual: 'FABRICA',
                Status: 'Comercializavel',
				CaracteristicasDesign: caracteristicasDesign,
				TipoOperacao: 'Cadastro',
				Operador: operador,
				DataOperacao: data.toString(),
        };
            ctx.stub.putState(id, Buffer.from(JSON.stringify(asset)));
            return JSON.stringify(asset);
        }
    }
	
	async PesquisarLotePorNumero(ctx, id) {
        const assetJSON = await ctx.stub.getState(id);
        if (!assetJSON || assetJSON.length === 0) {         
          console.log('O Lote de número ' + id +' não existe.');
          return;

        }
        return assetJSON.toString();
    }
	
	async MovimentarLote(ctx, id, numeroLote, tipoVestuario, quantidadeFabricadaLote, tamanho, caracteristicasDesign, operador, organizacaoDestino) {
        
		var data = new Date();
		
		const exists = await this.AssetExists(ctx, id);
        if (!exists) {
            throw new Error(`O  lote de número ${id} não existe.`);			
        }

        const cid = ctx.clientIdentity;
        let MSPID_ORIGEM = cid.getMSPID();
		
		 if (MSPID_ORIGEM =='vendedor-nerdstore-com-br') { 
			console.log('Usuário você pertence a organização ' + MSPID_ORIGEM + 'apenas usuários da fabrica ou da distribuidor podem movimentar um lote.');
            throw new Error(`Usuário você pertence a organização  ${MSPID_ORIGEM} apenas usuários da fábrica ou da distribuidora podem movimentar um lote.`);                       
        }     
		
        else 
        {
            const updatedAsset = {
              ID: id,
                NumeroLote: numeroLote,
				TipoVestuario: tipoVestuario, 
                QuantidadeFabricadaLote: quantidadeFabricadaLote,
				Estoque: quantidadeFabricadaLote,
				Tamanho: tamanho,
                OrganizacaoPosseAtual: organizacaoDestino,
                Status: 'Comercializável',
				CaracteristicasDesign: caracteristicasDesign,
				TipoOperacao: 'Movimentacao',
				Operador: operador,
				DataOperacao: data.toString(),
              
          };
        		
		 ctx.stub.putState(id, Buffer.from(JSON.stringify(updatedAsset)));
		 return JSON.stringify(updatedAsset);
          
      }
    }
	
	async ConfirmarVendaLote(ctx, id, numeroLote, tipoVestuario, status, quantidadeFabricadaLote, estoque, tamanho, caracteristicasDesign, operador, quantidadeVendidaLote) {
        
		var data = new Date();
        var orgAtual = "";
		
		const exists = await this.AssetExists(ctx, id);
        if (!exists) {
            throw new Error(`O  lote de número ${id} não existe.`);
        }

        const cid = ctx.clientIdentity;
        let MSPID_ORIGEM = cid.getMSPID();
		
        if (MSPID_ORIGEM =='fabrica-nerdstore-com-br')
            orgAtual = "FABRICA";
        else if (MSPID_ORIGEM =='vendedor-nerdstore-com-br')
            orgAtual = "VENDEDOR";
        else if (MSPID_ORIGEM =='distribuidor-nerdstore-com-br')
            orgAtual = "DISTRIBUIDOR";

		
		  if (estoque < quantidadeVendidaLote) {
            throw new Error(`O  lote de número ${id} não possui estoque suficiente para esta venda, o estoque atual deste lote possui  ${estoque} itens.`);		
        }
		
		if (status == 'BloqueadoParaVenda') { 
			console.log('O lote de numero ' + numeroLote + ' esta bloqueado para vendas.');
            throw new Error(`O  lote de número ${id} esta bloqueado para vendas.`);                      
        }  
	
        else 
        {
            const updatedAsset = {
              ID: id,
                NumeroLote: numeroLote,
				TipoVestuario: tipoVestuario,
				QuantidadeFabricadaLote: quantidadeFabricadaLote,
                Estoque: estoque - quantidadeVendidaLote,
				Tamanho: tamanho,
                OrganizacaoPosseAtual:orgAtual,
                Status: 'Comercializável',
				CaracteristicasDesign: caracteristicasDesign,
				TipoOperacao: 'Venda',
				Operador: operador,
				DataOperacao: data.toString(),
              
          };
        
		 ctx.stub.putState(id, Buffer.from(JSON.stringify(updatedAsset)));
		 return JSON.stringify(updatedAsset);
          
      }
    }
	
	async BloquearLoteVenda(ctx, id, numeroLote, tipoVestuario, quantidadeFabricadaLote, estoque, tamanho, caracteristicasDesign, operador, organizacaoDestino, defeitoEncontrado) {
        
		var data = new Date();
		
		const exists = await this.AssetExists(ctx, id);
        if (!exists) {
            throw new Error(`O  lote de número ${id} não existe.`); 
        }

        const cid = ctx.clientIdentity;
        let MSPID_ORIGEM = cid.getMSPID();
		
		if (MSPID_ORIGEM !='fabrica-nerdstore-com-br') { 
			console.log('Usuário você pertence a organização ' + MSPID_ORIGEM + 'apenas usuários do Fábrica podem bloquear um lote.');
            throw new Error(`Usuário você pertence a organização  ${MSPID_ORIGEM} apenas usuários do Fábrica podem bloquear um lote.`);                    
        }     
		
        else 
        {
            const updatedAsset = {
              ID: id,
                NumeroLote: numeroLote,
                QuantidadeFabricadaLote: quantidadeFabricadaLote,
				TipoVestuario: tipoVestuario,
				Estoque: estoque,
				Tamanho: tamanho,
                OrganizacaoPosseAtual: organizacaoDestino,
                Status: 'BloqueadoParaVenda',
				CaracteristicasDesign: caracteristicasDesign,
				TipoOperacao: 'BloqueioVendaLote',
				Operador: operador,
				DefeitoEncontrado: defeitoEncontrado,
				DataOperacao: data.toString(),
              
          };
		  
		  ctx.stub.putState(id, Buffer.from(JSON.stringify(updatedAsset)));
		 return JSON.stringify(updatedAsset);
          
      }
    }

    async ExcluirLote(ctx, id) {
        const exists = await this.AssetExists(ctx, id);
        if (!exists) {
            throw new Error(`The asset ${id} does not exist`);
        }
        return ctx.stub.deleteState(id);
    }

    async AuditarLote(ctx, id) {
        console.info('Buscando historico do lote pela chave: ' + id);
        let iterator = await ctx.stub.getHistoryForKey(id);
        let result = [];
        let res = await iterator.next();
        while (!res.done) { 

            if (res.value) {
                console.info(`Histórico ---->: ${res.value.value.toString('utf8')}`);
                const obj = JSON.parse(res.value.value.toString('utf8'));
                result.push(obj);
            }
          res = await iterator.next();
        }
        await iterator.close();
        return result;
      }

    async AuditarLote2(ctx, id) {
        
        let promiseOfIterator =  await ctx.stub.getHistoryForKey(id);
        let res = await promiseOfIterator.next();
        let result = [];

        while (!res.done) {  
              const resp = {
                        timestamp: res.timestamp,
                        txid: res.tx_id
                        }
            if (res.is_delete) {
                resp.data = 'Chave Excluida';
            } 
			
		   else {
            resp.data = res.value.value.toString('utf8');
            }  
			
            const obj = JSON.parse(resp.value.value.toString('utf8'));    
            result.push(obj);
            res = await iterator.next();
        }

        await iterator.close();
        return result;

      } 

	   // -------------------------------------  Funções Genéricas ----------------------------------------------------------------//
	  
	 // GetAllAssets returns all assets found in the world state.
    async GetAllAssets(ctx) {
        const allResults = [];
        // range query with empty string for startKey and endKey does an open-ended query of all assets in the chaincode namespace.
        const iterator = await ctx.stub.getStateByRange('', '');
        let result = await iterator.next();
        while (!result.done) {
            const strValue = Buffer.from(result.value.value.toString()).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            allResults.push({ Key: result.value.key, Record: record });
            result = await iterator.next();
        }
        return JSON.stringify(allResults);
    }
	
	// AssetExists returns true when asset with given ID exists in world state.
    async AssetExists(ctx, id) {
        const assetJSON = await ctx.stub.getState(id);
        return assetJSON && assetJSON.length > 0;
    }

    // TransferAsset updates the owner field of asset with given id in the world state.
    async TransferAsset(ctx, id, newInstancia) {
        const assetString = await this.ReadAsset(ctx, id);
        const asset = JSON.parse(assetString);
        asset.Instancia = newInstancia;
        return ctx.stub.putState(id, Buffer.from(JSON.stringify(asset)));
    }

// ReadAsset returns the asset stored in the world state with given id.
    async ReadAsset(ctx, id) {
        const assetJSON = await ctx.stub.getState(id); // get the asset from chaincode state
        if (!assetJSON || assetJSON.length === 0) {
            throw new Error(`The asset ${id} does not exist`);
        }
        return assetJSON.toString();
    }
  
    // UpdateAsset updates an existing asset in the world state with provided parameters.
    async UpdateAsset(ctx, id, numRename, nomeComercialMedicamento, instancia, status) {
        const exists = await this.AssetExists(ctx, id);
        if (!exists) {
            throw new Error(`The asset ${id} does not exist`);
        }

        // overwriting original asset with new asset
        const updatedAsset = {
            ID: id,
            NumRename: numRename,
            NomeComercialMedicamento: nomeComercialMedicamento,
            Instancia: instancia,
            Status: status,
        };
        return ctx.stub.putState(id, Buffer.from(JSON.stringify(updatedAsset)));
    }

}

module.exports = ChaincodeNerdStore;