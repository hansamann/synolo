<template>
  <div id="app">
    <FdSection v-show="typeEditorVisible">

      <FdActionBar title="GraphQL Server" description="Use this page to configure the GraphQL Server types and resolvers. A restart is required for changes to go live.">
        <FdButton @click="addType">Add...</FdButton>
        <FdButton @click="restart">Restart</FdButton>
        <FdButton styling="emphasized" type="negative" icon="decline" @click="deleteType" v-show="currentType"/>
        <FdButton styling="emphasized" v-show="buttonUpdateVisible" @click="update">Update</FdButton>
      </FdActionBar>
   

      <FdCol :span="6">
        <FdPanel>
          <FdFormSet>
            <FdFormItem v-bind:label="currentType">
              <FdTextArea v-model="typeValue" :disabled="currentType == ''" placeholder="Type data goes here..." />
            </FdFormItem>
          </FdFormSet>
        </FdPanel>
      </FdCol>
      <FdCol :span="6">
        <FdPanel>
          <FdFormSet>
            <FdFormItem v-bind:label="currentResolver">
              <FdTextArea v-model="resolverValue" :disabled="currentType == ''" placeholder="Resolver data goes here..." />
            </FdFormItem>
          </FdFormSet>
        </FdPanel>
      </FdCol>

    </FdSection>

    <FdSection v-show="typeEditorVisible">
      <div class="fd-section__header">
        <h3 class="fd-section__title">Types</h3>
      </div>
      <FdPanel>
        <span v-for="type in types" v-bind:key="type" class="linkList">
          <span class="fd-badge" @click="change(type)">{{type}}</span>
        </span>
      </FdPanel>
    </FdSection>

  </div>
</template>


<script>
import RestClientVue from "./components/RestClient.vue";

export default {
  name: "app",
  mixins: [RestClientVue],
  data() {
    return {
      typeEditorVisible : true,
      newTypeName : "",
      typeDirty : false,
      resolverDirty : false,
      buttonAddVisible : false,
      buttonRestartVisisble : false,
      currentType: "",
      typeValue : "",
      resolverValue : "",
      originalTypeValue : "",
      originalResolverValue : ""
    };
  },
  computed : {
    buttonUpdateVisible : function() {
      console.log("typeDirty", this.typeDirty);
      console.log("resolverDirty", this.resolverDirty);
      return (this.typeDirty || this.resolverDirty);
    },
    currentResolver : function() {
      if (this.currentType) {
        return (this.currentType.split(".")[0] + ".js");
      } else {
        return ""
      }
    }
  },

  watch : {
    'typeValue' : function(val) {
      this.typeDirty = (val != this.originalTypeValue)
    },
    'resolverValue' : function(val) {
      this.resolverDirty = (val != this.originalResolverValue)
    }
  },
  methods : {
    deleteType() {
     this.restDeleteType()
     .then(() => {
       this.currentType = null;
       this.originalTypeValue = this.originalResolverValue = "";
       this.typeValue = this.resolverValue = "";
     });
    },
    change(type) {
      this.currentType = type;
      this.deleteTypeButtonVisible = true;
      console.log('changed: ' + this.currentType)

      this.restLoadByType(this.currentType)
    },
    restart() {
      console.log('restart()')
      this.restRestart()
    },
    update() {
      console.log("update()")
      this.restUpdateConfigMaps()
      .then(() => {
        this.originalTypeValue = this.typeValue;
        this.originalResolverValue = this.resolverValue;
        this.typeDirty = this.resolverDirty = false;
      });
    },
    addType() {
      console.log("addType()")
      var type = prompt("Please enter the new type name:", "customer");

      if (type != null)
      {
        this.currentType = type + ".graphql"
      }

    }
  },
  created: function() {
    // `this` points to the vm instance
    this.luigiClient.addInitListener(ctx => {
      console.log(ctx);
    });

    console.log("created - requesting initial restGetTypes()");
    this.restGetTypes();
  
  }
};


</script>

<style scoped>
textarea {
  height: 20em;
}

.linkList {
  margin-right: 1em;
}

.linkList .sap-icon--delete {
  margin-left: 0.5em;
}
</style>
