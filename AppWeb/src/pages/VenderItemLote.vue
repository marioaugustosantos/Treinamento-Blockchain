<template>
    <div class="content">
      <div class="md-layout">
        <div class="md-layout-item md-medium-size-100 md-size-66">
          <vender-item-lote-form data-background-color="green"> </vender-item-lote-form>
        </div>
        <div class="md-layout-item md-medium-size-100 md-size-33">
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { VenderItemLoteForm } from "@/pages";
  
  export default {
    components: {
        VenderItemLoteForm
      
    }
  };
  </script>
  