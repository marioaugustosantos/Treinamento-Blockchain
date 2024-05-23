<template>
    <form> 
      <md-card>
        <md-card-header :data-background-color="dataBackgroundColor">
          <h4 class="title">NerdStore</h4>
          <p class="category">Boquear Lote</p>
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
                <label>Descreva o(s) defeito(s) encontrado(s)</label>
                <md-input v-model="lote.defeitoEncontrado" type="text"></md-input>
              </md-field>
            </div>

            <div class="md-layout md-gutter">
            <div class="md-layout-item md-small-size-100">
                <md-field> 
                <label for="organizacaoDestino">Selecione a Organização Destino</label>
                <md-select name="organizacaoDestino" id="organizacaoDestino" v-model="lote.organizacaoDestino" md-dense>
                  <md-option></md-option>
                  <md-option value="FABRICA">FÁBRICA</md-option>
                  <md-option value="DISTRIBUIDOR">DISTRIBUIDOR</md-option>             
                </md-select>
              </md-field>
            </div>
          </div>
            
            <div class="md-layout-item md-small-size-100 md-size-100">
              <md-field>
                <label>Último Operador</label>
                 <md-input v-model="lote.operador" type="text"></md-input>
              </md-field>
            </div>
  
            <div class="md-layout-item md-size-100 text-right">
              <md-button class="md-raised md-success" type ="submit" @click.prevent="BloquearLote" 
                >Bloquear</md-button
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
        tamanho: null,
        caracteristicasDesign: null,
        organizacaoPosseAtual: null,
        organizacaoDestino: null,
        defeitoEncontrado: null,
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
                    this.lote.tamanho = convert.Tamanho;
                    this.lote.caracteristicasDesign = convert.CaracteristicasDesign;
                    this.lote.organizacaoPosseAtual = convert.OrganizacaoPosseAtual;
                    this.lote.organizacaoDestino = convert.OrganizacaoDestino;
                    this.lote.operador = convert.Operador;
                    this.lote.defeitoEncontrado = convert.defeitoEncontrado;
                    
                    this.lotes[0] = this.lote;           
                
             } catch(e) {
                console.error(e);
            }
              }
                   
          },
  
         async BloquearLote(){
  
  
            if (!this.$v.$invalid) {
            
              await this.$http.put('http://localhost:8083/api/BloquearLoteVenda/',this.lote)    
                  
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
            "Lote bloqueado com sucesso na blockchain.",
          icon: "add_alert",
          horizontalAlign: horizontalAlign,
          verticalAlign: verticalAlign,
          type: "success"
        });
      },
  
      erroSalvarNotify(verticalAlign, horizontalAlign) {
        this.$notify({
          message:
            "ATENÇÃO: O Lote não pôde ser bloqueado na Blockchain.",
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
  