<template>
<form method="GET" @submit.prevent="submitForm">
  <div class="content">
    <div class="md-layout">
      <div
        class="md-layout-item md-medium-size-120 md-xsmall-size-120 md-size-120"
      >
        <md-card>
          <md-card-header data-background-color="green">
            <h4 class="title">Auditoria de Lote</h4>
            <p class="category">Histórico de Movimentações</p>
          </md-card-header>
          <md-card-content>

          <div class="md-layout-item md-small-size-100 md-size-33">
            <md-field :class="getValidationClass('id')">
              <label>ID do Lote</label>
               <md-input v-model="id" id="id"  type="text"></md-input>
               <span class="md-error" v-if="!$v.id.required">Informe o número do lote a ser auditado!</span>
            </md-field>

            <md-button class="md-raised md-success" type ="submit" 
              >Auditar</md-button
            >
          </div>

          <div>
            <md-table  md-card v-show="exibir">
            <md-table-toolbar>
              <h1 class="md-title">Histórico</h1>
            </md-table-toolbar>

            <md-table-row>
              <md-table-head>Tipo Vestuario</md-table-head>
              <md-table-head>Tamanho</md-table-head>
              <md-table-head>Estoque</md-table-head>
              <md-table-head>Status</md-table-head>
              <md-table-head>Operação</md-table-head>
              <md-table-head>Operador</md-table-head>
              <md-table-head>Organizacao</md-table-head>
              <md-table-head>Defeito Encontrado</md-table-head>
              <md-table-head>Data da Operação</md-table-head>
             </md-table-row>

            <md-table-row v-for="(row, index) in lotes" :key="index"  :md-item="row" >
              <md-table-cell> {{row.TipoVestuario}}</md-table-cell>
              <md-table-cell> {{row.Tamanho}}</md-table-cell>
              <md-table-cell> {{row.Estoque}} </md-table-cell> 
              <md-table-cell> {{row.Status}} </md-table-cell> 
              <md-table-cell> {{row.TipoOperacao}} </md-table-cell>    
              <md-table-cell> {{row.Operador}} </md-table-cell>
              <md-table-cell> {{row.OrganizacaoPosseAtual}} </md-table-cell>  
              <md-table-cell> {{row.DefeitoEncontrado}} </md-table-cell> 
              <md-table-cell> {{row.DataOperacao}} </md-table-cell>              
            </md-table-row>
          </md-table>
          </div>
          </md-card-content>
        </md-card>
      </div>

    </div>
  </div>
  </form>
</template>

<script>


import {
    required    
   
  } from "vuelidate/lib/validators";


export default {
  
  components: {
    //SimpleTable
  },
  props: {
    tableHeaderColor: {
      type: String,
      default: ""
    }
    },


  data() {
    return {
      lote:{
       ID: "",
       TipoVestuario: "",
       Tamanho: "",
       QuantidadeFabricadaLote: "",
       Estoque: "",
       NumeroLote: "",
       Status: "",
       TipoOperacao: "",
       DefeitoEncontrado:"",
       DataOPeracao: "",
       Operador: "",
       OrganizacaoPosseAtual:""

      },

      id:"",
      lotes: [],
      exibir: false,
      
    };
  },

  validations: {
      
         id: {
           required
               
        },         
      
      },

   
  methods:{

    getValidationClass (fieldName) {
        const field = this.$v[fieldName]

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
             
               const response = await this.$http.get('http://localhost:8083/api/AuditarLote/'+this.id)  ; 
                 console.log(response.data);
                 
                 const retorno = response.data;

                 var lotesConvert = JSON.parse(retorno.response);

                  for(var i = 0; i < lotesConvert.length; i++) {

                    this.lotes.push(lotesConvert[i]);
  
                  }

                  this.exibir = true;
  
                  } catch(e) {
                      console.error(e);
                  }
        }
                 
    },
  }
 
};
</script>
