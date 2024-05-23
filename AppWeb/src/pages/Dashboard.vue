<template>
  <div class="content">
    <div class="md-layout">
      
       <div
        class="md-layout-item md-medium-size-50 md-xsmall-size-100 md-size-25"
      > 
        <!--Total Lotes Fabricados-->
        <stats-card data-background-color="green">
          <template slot="header">
            <md-icon>factory</md-icon>
          </template>

          <template slot="content">
            <p class="category">Total de Lotes Fabricados</p>
            <h3 class="title">
              {{numeroTotalLotes}}
              <small>Fabricados</small>
            </h3>
          </template>

          <template slot="footer">
            <div class="stats">
              <md-icon>date_range</md-icon>
              Desde de o início da Blockchain
            </div>
          </template>
        </stats-card>
      </div>

      <div
        class="md-layout-item md-medium-size-50 md-xsmall-size-100 md-size-25"
      >
       <!--Lotes Bloqueados-->
        <stats-card data-background-color="red">
          <template slot="header">
           <md-icon>block</md-icon>
          </template>

          <template slot="content">
            <p class="category">Lotes Bloqueados</p>        
            <h3 class="title">
              {{numeroLotesBloqueados}}
              <small>Bloqueados</small>
            </h3>

          </template>

          <template slot="footer">
            <div class="stats">
              <md-icon>update</md-icon>
              Desde de o início da Blockchain
            </div>
          </template>
        </stats-card>
      </div>

      <!--Lotes Ainda Na Fábrica-->
      <div
        class="md-layout-item md-medium-size-50 md-xsmall-size-100 md-size-25"
      >
        <stats-card data-background-color="purple">
          <template slot="header">
            <md-icon>factory</md-icon>
          </template>

          
          <template slot="content">
            <p class="category">Lotes na Fábrica</p>
            <h3 class="title">
              {{numeroLotesNaFabrica}}
              
            </h3>
          </template>

          <template slot="footer">
            <div class="stats">
              <md-icon>date_range</md-icon>
              Desde de o início da Blockchain
            </div>
          </template>

        </stats-card>
      </div>

      <!--Lotes Ainda no Distribuidor-->
      <div
        class="md-layout-item md-medium-size-50 md-xsmall-size-100 md-size-25"
      >       
        <stats-card data-background-color="orange">
          <template slot="header">
            <md-icon>local_shipping</md-icon>
          </template>

          <template slot="content">
            <p class="category">Lotes no Distribuidor </p>
            <h3 class="title">{{numeroLotesNoDistribuidor}}</h3> 
          </template>

          <template slot="footer">
            <div class="stats">
              <md-icon>local_offer</md-icon>
              Desde de o início da Blockchain
            </div>
          </template>
        </stats-card>
      </div>  
      
      <!--Lotes Ainda No Vendedor-->
      <div
        class="md-layout-item md-medium-size-50 md-xsmall-size-100 md-size-25"
      >
        <stats-card data-background-color="blue">
          <template slot="header">
            <md-icon>shopping_cart</md-icon>
          </template>

          
          <template slot="content">
            <p class="category">Lotes no Vendedor</p>
            <h3 class="title">
              {{numeroLotesNoVendedor}}
              
            </h3>
          </template>

          <template slot="footer">
            <div class="stats">
              <md-icon>date_range</md-icon>
              Desde de o início da Blockchain
            </div>
          </template>

        </stats-card>
      </div>

    </div>
  </div>
</template>

<script>

import axios from "axios";

import {
  StatsCard,
  ChartCard,
  
} from "@/components";

export default {

   props: {
    tableHeaderColor: {
      type: String,
      default: "blue"
    }
   },
  
  components: {
    StatsCard,
    ChartCard,
    
  },

created() {
     this.carregaDashboard();
   },

   methods: {
     carregaDashboard() {
       
       axios
         .get("http://localhost:8083/api/BuscarTodosLotes")
         .then((res) => {
            var lotesConvert = JSON.parse(res.data.response);
            
            this.numeroTotalLotes = lotesConvert.length; 

            this.lotes = lotesConvert;
            
            for(var i = 0; i < this.lotes.length; i++) {

                   if(this.lotes[i].Record.Status !=null)
                    if (this.lotes[i].Record.Status =="BloqueadoParaVenda")
                      this.numeroLotesBloqueados ++;
                    if(this.lotes[i].Record.OrganizacaoPosseAtual!=null) 
                     if (this.lotes[i].Record.OrganizacaoPosseAtual =="FABRICA")
                      this.numeroLotesNaFabrica ++; 
                     else if (this.lotes[i].Record.OrganizacaoPosseAtual =="DISTRIBUIDOR")
                      this.numeroLotesNoDistribuidor ++;
                      else if (this.lotes[i].Record.OrganizacaoPosseAtual =="VENDEDOR")
                      this.numeroLotesNoVendedor ++;               
            }
                                              
         })
         .catch((error) => {
           console.log(error);
         });
     },

     
   },

  data() {
    return {
      numeroTotalLotes:0,
      numeroLotesBloqueados:0,
      numeroLotesNaFabrica:0,
      numeroLotesNoDistribuidor:0,
      numeroLotesNoVendedor:0,
      

      dailySalesChart: {
        data: {
          labels: ["M", "T", "W", "T", "F", "S", "S"],
          series: [[12, 17, 7, 17, 23, 18, 38]]
        },
        options: {
          lineSmooth: this.$Chartist.Interpolation.cardinal({
            tension: 0
          }),
          low: 0,
          high: 50, 
          chartPadding: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
          }
        }
      },
      dataCompletedTasksChart: {
        data: {
          labels: ["12am", "3pm", "6pm", "9pm", "12pm", "3am", "6am", "9am"],
          series: [[230, 750, 450, 300, 280, 240, 200, 190]]
        },

        options: {
          lineSmooth: this.$Chartist.Interpolation.cardinal({
            tension: 0
          }),
          low: 0,
          high: 1000, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
          chartPadding: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
          }
        }
      },
    barChartStatusProcessos: {
        data: {
          labels: [
            "Processos SMS",
            "Processos SESAB"        
          ],
          series: [[2,1]]
        },
        options: {
          axisX: {
            showGrid: false
          },
          low: 0,
          high: 10,
          chartPadding: {
            top: 0,
            right: 5,
            bottom: 0,
            left: 0
          }
        },
        responsiveOptions: [
          [
            "screen and (max-width: 640px)",
            {
              seriesBarDistance: 5,
              axisX: {
                labelInterpolationFnc: function(value) {
                  return value[0];
                }
              }
            }
          ]
        ]
      }
    };
  }
};
</script>
