<template>
  <form method="GET" @submit.prevent="submitForm">
    <md-card>
      <md-card-header :data-background-color="dataBackgroundColor">
        <h4 class="title">NerdStore</h4>
        <p class="category">Acompanhar Lote</p>
      </md-card-header>

      <md-card-content>
        <div class="md-layout">
          <div class="md-layout-item md-small-size-100 md-size-33">
            <md-field :class="getValidationClass('ID')">
              <label>ID do Lote</label>
               <md-input v-model="lote.ID"  id="id" type="text"></md-input>
            <span class="md-error" v-if="!$v.lote.ID.required">Informe o id do lote!</span>
            </md-field>

            <md-button class="md-raised md-success" type ="submit" 
              >Pesquisar</md-button
            >
          </div>
           
          <div class="md-layout-item md-small-size-100 md-size-50">
            <md-field>
              <label>Número Lote</label>
               <md-input v-model="lote.NumeroLote" type="text" disabled></md-input>
            </md-field>
          </div>

          <div class="md-layout-item md-small-size-100 md-size-33">
            <md-field>
              <label>Tipo Vestuario</label>
               <md-input v-model="lote.TipoVestuario" type="text" disabled></md-input>
            </md-field>
          </div>

          <div class="md-layout-item md-small-size-100 md-size-33">
            <md-field>
              <label>Quantidade Fabricada</label>
               <md-input v-model="lote.QuantidadeFabricadaLote" type="text" disabled></md-input>
            </md-field>
          </div>

          <div class="md-layout-item md-small-size-100 md-size-33">
            <md-field>
              <label>Estoque Atual</label>
               <md-input v-model="lote.Estoque" type="text" disabled></md-input>
            </md-field>
          </div>

          <div class="md-layout-item md-small-size-100 md-size-33">
            <md-field>
              <label>Caracteristicas Design</label>
               <md-input v-model="lote.CaracteristicasDesign" type="text" disabled></md-input>
            </md-field>
          </div>

          <div class="md-layout-item md-small-size-100 md-size-33">
            <md-field>
              <label>Tamanho</label>
               <md-input v-model="lote.Tamanho" type="text" disabled></md-input>
            </md-field>
          </div>

          <div class="md-layout-item md-small-size-100 md-size-100">
            <md-field>
              <label>Útimo Operador</label>
               <md-input v-model="lote.Operador" type="text" disabled ></md-input>
            </md-field>
          </div>

          <div class="md-layout-item md-small-size-100 md-size-100">
            <md-field>
              <label>Útima Operacão</label>
               <md-input v-model="lote.TipoOperacao" type="text" disabled ></md-input>
            </md-field>
          </div>
          
          <div class="md-layout-item md-small-size-100 md-size-50">
            <md-field>
              <label>Status Atual</label>
              <md-input v-model="lote.Status" type="text" disabled></md-input>
            </md-field>
          </div>
          <div class="md-layout-item md-small-size-100 md-size-100">
            <md-field>
              <label>Organização Atual</label>
               <md-input v-model="lote.OrganizacaoPosseAtual" type="text" disabled ></md-input>
            </md-field>
          </div>
        </div>
      </md-card-content>
    </md-card>
  </form>
</template>


<script>

import {
    required,   
   
  } from "vuelidate/lib/validators";

export default {

  name: "edit-profile-form",
  
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

      ID: "",
      NumeroLote: "",
      TipoVestuario: "",
      QuantidadeFabricadaLote: "",
      Estoque: "",
      Tamanho:"",
      Operador:"",
      OrganizacaoPosseAtual:"",
      Status:"",
      CaracteristicasDesign:"",
      TipoOperacao:""

      },

      lotes: [],

      type: ["", "info", "success", "warning", "danger"],
      notifications: {
        topCenter: false
      }
         
    };
  },

  validations: {
      lote: {
         ID: {
           required           
        }
                 
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

      async submitForm(){

        this.$v.$touch();

        if (!this.$v.$invalid) {
                   
          try {
             
               const response = await this.$http.get('http://localhost:8083/api/PesquisarLotePorNumero/'+this.lote.ID)  ; 
              //.then( res => {
                 console.log(response.data);
                 
                 const retorno = response.data;

                 var convert = JSON.parse(retorno.response);

                  this.lote.NumeroLote = convert.NumeroLote;
                  this.lote.TipoVestuario = convert.TipoVestuario;
                  this.lote.QuantidadeFabricadaLote = convert.QuantidadeFabricadaLote;
                  this.lote.Estoque = convert.Estoque;
                  this.lote.Operador = convert.Operador;
                  this.lote.Tamanho = convert.Tamanho;
                  this.lote.OrganizacaoPosseAtual = convert.OrganizacaoPosseAtual;
                  this.lote.Status = convert.Status;
                  this.lote.CaracteristicasDesign = convert.CaracteristicasDesign;
                  this.lote.TipoOperacao = convert.TipoOperacao;

                  this.lotes[0] = this.lote;
           
              
          } catch(e) {
              console.error(e);
          }
        }
                 
        },

        
    notifyVue(verticalAlign, horizontalAlign) {
      var color = Math.floor(Math.random() * 4 + 1);
      this.$notify({
        message:
          "Lote salvo com sucesso na blockchain.",
        icon: "add_alert",
        horizontalAlign: horizontalAlign,
        verticalAlign: verticalAlign,
        type: this.type[color]
      });
    },
        
    },


};
</script>
<style></style>
