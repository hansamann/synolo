# graphql-console-ui

This is a simple vue frontend web application that exposes a simple management UI for the graphql types and resolvers. It is including Luigi to make it compatible with the Kyma console UI. 

Once you've built your docker image and deployed to your Kyma cluster, the UI will look similar to the following image:

<img src="resources/ui2.png"/>

## Deployment to your Kyma Cluster
You can use the default docker container in `all.yaml` but you will need to change a few settings:
- make sure the namespace for all resources is correct, we use `stage` by default
- change the backend url to the graphql-server-api (which needs to be deployed first) in the ConfigMap which is prat of `all.yaml`. 
- you will most likely also have to change the API resource, e.g. change the hostname to your cluster hostname. 

## Running locally

To run thsi locally, first install via 

```
yarn install
```
and then run 

```
yarn run serve
```

This will start the dev server. 

Please note: the backend URL is set via the `public/config.js` file. For development purposes, the backend URL is set to `localhost:3000`. When running the container in the cluster, be sure to replace the config.js file via a ConfigMap. The file `k8s/all.yaml` will replace the config.js via a ConfigMap,be sure to change the ConfigMap settings when you deploy to your cluster. 