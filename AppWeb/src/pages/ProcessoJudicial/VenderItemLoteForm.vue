<template>
    <form> 
      <md-card>
        <md-card-header :data-background-color="dataBackgroundColor">
          <h4 class="title">NerdStore</h4>
          <p class="category">Vender Item Lote</p>
        </md-card-header>
  
        <md-card-content>
          <div class="md-layout">
  
            <div class="md-layout-item md-small-size-100 md-size-33">
              <md-field :class="getValidationClass('id')">
                <label>Id do Lote</label>
                <md-input v-model="lote.id" id="id" type="text"></md-input>
                <span class="md-error" v-if="!$v.lote.id.required">Informe o id do lote para realizar a pesquisa</span>
              </md-field>
            </div>
  
             <div class="md-layout-item md-size-100 text-right">
              <md-button class="md-raised md-success" type ="submit" @click.prevent="PesquisarLote"
                >Pesquisar Lote</md-button>
            </div>
           
            <div class="md-layout-item md-small-size-100 md-size-33">
              <md-field>
                <label>Tipo Vestuario</label>
                <md-input v-model="lote.tipoVestuario" type="text" disabled></md-input>
              </md-field>
            </div>
            <div class="md-layout-item md-small-size-100 md-size-50">
              <md-field>
                <label>Número Lote</label>
                <md-input v-model="lote.numeroLote" type="text" disabled></md-input>
              </md-field>
            </div>
            <div class="md-layout-item md-small-size-100 md-size-50">
              <md-field>
                <label>Tamanho</label>
                <md-input v-model="lote.tamanho" type="text" disabled></md-input>
              </md-field>
            </div>
  
            <div class="md-layout-item md-small-size-100 md-size-100">
              <md-field>
                <label>Caracteristicas Design</label>
                <md-input v-model="lote.caracteristicasDesign" type="text" disabled></md-input>
              </md-field>
            </div>
  
            <div class="md-layout-item md-small-size-100 md-size-100">
              <md-field>
                <label>Quantidade Fabricada</label>
                <md-input v-model="lote.quantidadeFabricadaLote" type="text" disabled></md-input>
              </md-field>
            </div>
  
            <div class="md-layout-item md-small-size-100 md-size-100">
              <md-field>
                <label>Organização Atual</label>
                <md-input v-model="lote.organizacaoPosseAtual" type="text" disabled></md-input>
              </md-field>
            </div>

            <div class="md-layout-item md-small-size-100 md-size-100">
              <md-field>
                <label>Status</label>
                <md-input v-model="lote.status" type="text" disabled></md-input>
              </md-field>
            </div>

            <div class="md-layout-item md-small-size-100 md-size-100">
              <md-field>
                <label>Estoque</label>
                <md-input v-model="lote.estoque" type="text" disabled></md-input>
              </md-field>
            </div>
  
            <div class="md-layout-item md-small-size-100 md-size-100">
              <md-field>
                <label>Informe a Quantidade de Itens Para esta Venda:</label>
                <md-input v-model="lote.quantidadeVendidaLote" type="text"></md-input>
              </md-field>
            </div>

            <div class="md-layout-item md-small-size-100 md-size-100">
              <md-field>
                <label>Operador</label>
                 <md-input v-model="lote.operador" type="text"></md-input>
              </md-field>
            </div>
  
            <div class="md-layout-item md-size-100 text-right">
              <md-button class="md-raised md-success" type ="submit" @click.prevent="ConfirmarVendaItemLote" 
                >Confirmar Venda</md-button
              >
            </div>
           
          </div>
        </md-card-content>
      </md-card>
    </form>
  
  </template>
  
  <script>
  
  
  import { validationMixin } from 'vuelidate';
  
  import {
      required,   
      minLength
     
    } from "vuelidate/lib/validators";
  
  export default {
  
    name: "edit-profile-form",
    mixins: [validationMixin],
    props: {
      dataBackgroundColor: {
        type: String,
        default: "",
      },
      tableHeaderColor: {
        type: String,
        default: ""
      },
    },
  
    data() {
      return {
  
        lote:{
  
        id: null,
        numeroLote: null,
        tipoVestuario: null,
        quantidadeFabricadaLote: null,
        quantidadeVendidaLote: null,
        estoque: null,
        status:null,
        tamanho: null,
        caracteristicasDesign: null,
        organizacaoPosseAtual: null,
        operador: null
  
        },
  
        lotes: [],
  
        type: ["", "info", "success", "warning", "danger"],
        notifications: {
          topCenter: false
        },
           
      };
    },
  
    validations: {
        lote: {
           id: {
             required,
             minLength: minLength(3)
          },    
  
        }
        },
  
  
   methods:{
  
     getValidationClass (fieldName) {
          const field = this.$v.lote[fieldName]
  
          if (field) {
            return {
              'md-invalid': field.$invalid && field.$dirty
            }
          }
        },
           async PesquisarLote(){
  
              this.$v.$touch();
  
              if (!this.$v.$invalid) {
                     
                try {
               
                 const response = await this.$http.get('http://localhost:8083/api/PesquisarLotePorNumero/'+this.lote.id)  ; 
                
                   console.log(response.data);
                   
                   const retorno = response.data;
  
                   var convert = JSON.parse(retorno.response);
  
                    console.log(convert);
  
                    this.lote.numeroLote = convert.NumeroLote;
                    this.lote.tipoVestuario = convert.TipoVestuario;
                    this.lote.quantidadeFabricadaLote = convert.QuantidadeFabricadaLote;
                    this.lote.estoque = convert.Estoque;
                    this.lote.status = convert.Status;
                    this.lote.tamanho = convert.Tamanho;
                    this.lote.caracteristicasDesign = convert.CaracteristicasDesign;
                    this.lote.organizacaoPosseAtual = convert.OrganizacaoPosseAtual;
                    this.lote.operador = convert.Operador;
                    
                    this.lotes[0] = this.lote;           
                
             } catch(e) {
                console.error(e);
            }
              }
                   
          },
  
         async ConfirmarVendaItemLote(){
  
  
            if (!this.$v.$invalid) {

              await this.$http.put('http://localhost:8083/api/ConfirmarVendaLote/',this.lote)    
                  
                    .then(() => {
                       this.salvoSucessoNotify('top', 'center');
                  })
                  
                    .catch(() => {
                       this.erroSalvarNotify('top', 'center');
                   }).finally(() => {
                   });
              }
          },
  
       
      salvoSucessoNotify(verticalAlign, horizontalAlign) {
        this.$notify({
          message:
            "Venda realizada com sucesso na blockchain.",
          icon: "add_alert",
          horizontalAlign: horizontalAlign,
          verticalAlign: verticalAlign,
          type: "success"
        });
      },
  
      erroSalvarNotify(verticalAlign, horizontalAlign) {
        this.$notify({
          message:
            "ATENÇÃO: Erro na venda do(s) iten(s) na Blockchain, verifique se o estoque é suficiente para a esta venda.",
          icon: "add_alert",
          horizontalAlign: horizontalAlign,
          verticalAlign: verticalAlign,
          type: "danger"
        });
      },
             
      }, 
  
  };
  </script>
  <style></style>
  