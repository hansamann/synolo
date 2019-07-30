
<script>
export default {
  data() {
    return {
      apiBase: process.env.VUE_APP_BACKEND,
      types: []
    };
  },
  methods: {
    restGetTypes() {
      console.log("restGetTypes()");
      var that = this;
      fetch(`${this.apiBase}/types`)
        .then(function(response) {
          return response.json();
        })
        .then(function(json) {
          console.log(json);
          that.types = json.keys;
        });
    },
    restLoadByType() {
      console.log("restLoadByType()", this.currentType, this.currentResolver);
      var that = this;
      fetch(`${this.apiBase}/types/` + encodeURIComponent(this.currentType))
        .then(response => {
          return response.json();
        })
        .then(data => {
          that.typeValue = data.value;
          that.originalTypeValue = data.value;
        })
        .catch(err => {
          console.error("Unable to fetch type key ", this.currentType, err);
        });

      //load resolver
      fetch(`${this.apiBase}/resolvers/` + encodeURIComponent(this.currentResolver))
        .then(response => {
          return response.json();
        })
        .then(data => {
          that.resolverValue = data.value
          that.originalResolverValue = data.value;
        })
        .catch(err => {
          console.error("Unable to fetch resolver key ", this.currentResolver, err);
        });
    },
    restUpdateConfigMaps() {
        console.log("updating config maps, using type ", this.currentType, this.currentResolver)

        //type
        let updateTypes = fetch(`${this.apiBase}/types/` + encodeURIComponent(this.currentType), 
            {
                method: "POST", 
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({value:this.typeValue}) 
            })
            .then(response => {
                return response.json()
            })
            .then(data => {
                console.log(data)
            })
            .catch(err => {
                console.error("Unable to update type data ", err)
            })


        //resolver
        let updateResolvers = fetch(`${this.apiBase}/resolvers/` + encodeURIComponent(this.currentResolver), 
            {
                method: "POST", 
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({value:this.resolverValue}) 
            })
            .then(response => {
                return response.json()
            })
            .then(data => {
                console.log(data)
            })
            .catch(err => {
                console.error("Unable to update resolver data ", err)
            })

        return Promise.all([updateTypes, updateResolvers])
        .then(() => {
          this.restGetTypes();
        }) 
    },
    restDeleteType() {
        console.log("deleting type ", this.currentType, this.currentResolver)

        //type
        let updateTypes = fetch(`${this.apiBase}/types/` + encodeURIComponent(this.currentType), 
            {
                method: "DELETE", 
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                } 
            })
            .then(response => {
                return response.json()
            })
            .then(data => {
                console.log(data)
            })
            .catch(err => {
                console.error("Unable to delete type ", err)
            })

        //resolver
        let updateResolvers = fetch(`${this.apiBase}/resolvers/` + encodeURIComponent(this.currentResolver), 
            {
                method: "DELETE", 
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                return response.json()
            })
            .then(data => {
                console.log(data)
            })
            .catch(err => {
                console.error("Unable to delete resolver ", err)
            })

        return Promise.all([updateTypes, updateResolvers])
        .then(() => {
          this.restGetTypes();
        }) 

    },
    restRestart() {
        console.log("Restarting graphql-server pods")
        fetch(`${this.apiBase}/kill`, { method: "POST" })
            .then(response => {
                return response.json()
            })
            .then(data => {
                console.log(data)
            })
            .catch(err => {
                console.error("Unable to kill graphql pod ", err)
            })
    },
    restIntrospect(q) {
      return fetch('https://graphql-server.mega.cluster.extend.cx.cloud.sap/', {
        method: "POST",
        headers : {
          "Content-Type" : "application/json"
        },
        body: JSON.stringify({query: q})
      }).then(response => {
        return response.json();
      }).catch(err => {
        console.error("Unable to introspect GraphQL server", err);
      })
    }
  }
};
</script>