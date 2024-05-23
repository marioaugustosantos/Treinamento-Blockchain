<template>

  <form novalidate class="md-layout" @submit.prevent="submitForm">
    <md-card>


      <md-card-header :data-background-color="dataBackgroundColor">
        <h4 class="title">NerdStore Vestuário</h4>
        <p class="category">Cadastro de Lote</p>
      </md-card-header>


      <md-card-content>

         <!--<md-progress-spinner class="md-accent" md-mode="indeterminate"  v-show="showProgressBar"> </md-progress-spinner> -->

        <div class="md-layout">

          <div class="md-layout-item md-small-size-100 md-size-33">
            
            <md-field :class="getValidationClass('id')">            
              <label>Id do Lote (ID)</label>
              <md-input v-model="form.id" id="id" type="text" :disabled="sending"></md-input>
              <span class="md-error" v-if="!$v.form.id.required">O id do lote é obrigatório!</span>
              <!--<span class="md-error" v-else-if="!$v.form.id.minlength">Invalid first name</span>-->
            </md-field>

          </div>

          <div class="md-layout-item md-small-size-100 md-size-50">
            <md-field :class="getValidationClass('numeroLote')">
              <label>Número do Lote</label>
              <md-input v-model="form.numeroLote" id="numeroLote" type="text" :disabled="sending"></md-input>
              <span class="md-error" v-if="!$v.form.numeroLote.required">O numero do lote é obrigatório!</span>           
            </md-field>
          </div>

          <div class="md-layout-item md-small-size-100 md-size-33">
            <md-field>
              <label>Quantidade Fabricada</label>
              <md-input v-model="form.quantidadeFabricadaLote" type="text"></md-input>
            </md-field>
          </div>

          <div class="md-layout-item md-small-size-100 md-size-50">
            <md-field>
              <label>Tipo Vestuario</label>
              <md-input v-model="form.tipoVestuario" type="text"></md-input>
            </md-field>
          </div>

          <div class="md-layout-item md-small-size-100 md-size-50">
            <md-field>
              <label>Operador</label>
              <md-input v-model="form.operador" type="text"></md-input>
            </md-field>
          </div>
          
          <div class="md-layout-item md-small-size-100 md-size-33">

          <md-field :class="getValidationClass('caracteristicasDesign')">
            
             <label>Caracteristicas Design</label>
             <md-input v-model="form.caracteristicasDesign" id="caracteristicasDesign" type="text"></md-input>
             <span class="md-error" v-if="!$v.form.caracteristicasDesign.required">As caracteristicas do vestuário são obrigatórias!</span>           
          </md-field>

          <div class="md-layout-item md-small-size-100 md-size-50">
            <md-field>
              <label>Tamanho</label>
              <md-input v-model="form.tamanho" type="text"></md-input>
            </md-field>
          </div>

          </div>
          
                      
          <div class="md-layout-item md-size-100 text-right">
            <md-button class="md-raised md-success" type ="submit"
              >Cadastrar</md-button
            >
          </div>
        </div>
        

      </md-card-content>
    </md-card>
  </form>
</template>

<script>

import axios from 'axios';
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
  },
  data() {
    return {

      form:{
      id: null,
      numeroLote: null,
      tipoVestuario: null,
      quantidadeFabricadaLote: null,
      tamanho: null,
      caracteristicasDesign: null,
      operador: null

      },

      type: ["", "info", "success", "warning", "danger"],
      notifications: {
        topCenter: false
      },

      sending: false,
      showProgressBar: false

      
         
    };
  },

  validations: {
      form: {
         id: {
           required,
           minLength: minLength(3)
        },
          numeroLote: {
           required        
        },
        caracteristicasDesign: {
           required        
        }
      }
      },

 methods:{

getValidationClass (fieldName) {
        const field = this.$v.form[fieldName]

        if (field) {
          return {
            'md-invalid': field.$invalid && field.$dirty
          }
        }
      },


    submitForm(){

      this.saveUser();
  
      this.$v.$touch();


      if (!this.$v.$invalid) {

    
            axios.post('http://localhost:8083/api/CriarLote/', this.form)
                //.then((res) => {
                 .then(() => {
                     this.salvoSucessoNotify('top', 'center');
                 })
                .catch((error) => {

                   var str = JSON.stringify(error.response.data.error.responses);
                   var parsed = JSON.parse(str);
                   var erro = parsed[0]; 
                     
                   //alert (JSON.stringify(erro.response.message));
                   var mensagemErro = erro.response.message;

                 this.erroSalvarNotify('top', 'center', mensagemErro);

                 }).finally(() => {
                     //Perform action in always
                 });
    }

    this.sending = false;
 


        },

        saveUser () {

        //this.showProgressBar = true;
        this.sending = true

        // Instead of this timeout, here you can call your API
        //window.setTimeout(() => {
         // this.lastUser = `${this.form.firstName} ${this.form.lastName}`
          //this.userSaved = true
          //this.sending = false
        //  this.showProgressBar = false
          //this.clearForm()
       // }, 6000)
      },

    salvoSucessoNotify(verticalAlign, horizontalAlign) {

      this.sending = false;
      
      this.$notify({
        message:
          "Lote salvo com sucesso na blockchain.",
        icon: "add_alert",
        horizontalAlign: horizontalAlign,
        verticalAlign: verticalAlign,
        type: "success"
      });
    },

    erroSalvarNotify(verticalAlign, horizontalAlign, mensagemErro) {
      
      this.$notify({
        message:
          mensagemErro,
        icon: "add_alert",
        horizontalAlign: horizontalAlign,
        verticalAlign: verticalAlign,
        type: "danger"
      });
    },
        
    },


};
</script>

<style lang="scss" scoped>
  .md-progress-bar {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
  }
</style>
