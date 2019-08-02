# graphql-console-api

This is the API part for the `graphql-console-ui` and it needs to be deployed first. Please note that this does not currently use any security and directly interfaces the kubernetes API server via the node.js k8s APIs. It exposes the capabilities to read and write to the `types` and `resolvers` ConfigMaps as well as allows the user to kill all graphql server pods so that they can be restarted with the updated ConfigMap configuration. 

To change the used k8s namespace for ConfigMap operations, please provide the `K8S_NAMESPACE` environment varible. The default is set to `stage`. 

## Deployment to your Kyma Cluster
First, have a look at `k8s/sa.yaml` and check the namespace. Please make sure you're fine with exposing the admin rights to the pods that you will deployed. 

Run 

```
kubectl apply -f k8s/sa.yaml
```

Next, apply a few changes to `all.yaml` based on your specific cluster:
- be sure to change the namespace if you do not want to use the default `stage` namespace. 
- most likely you will need to change the hostname of the API resource for your specific kyma cluster.

Now, simply run 

```
kubectl apply -f k8s/all.yaml
```

Give it a few seconds, then the deployment, service and API resource for the `graphql-console-api` should be running. You can check the API resources and call the URL in the browser - the `/` root should respond with a json output:

```
{"success":true,"msg":"Ready. Go change the world."}
```

Also, for example the `/types` path should be available:

```
{"success":true,"keys":["commercecategory.graphql","commerceimage.graphql","commerceorder.graphql","commerceprice.graphql","commerceproduct.graphql","commerceproductreference.graphql","commercereview.graphql","commercestock.graphql","country.graphql","deliveryaddress.graphql","deliverymode.graphql","language.graphql","orderentry.graphql","root.graphql","weather.graphql"]}
```

You are now ready to deploy the [graphql-console-ui](../graphql-console-ui/README.md).

## Run locally

Please first make sure that you have `kubectl` access to your Kubernetes cluster. If the DEBUG env variable is present, the k8s api will try to extract cluster access from a local KUBECONFIG file. 

```
DEBUG=graphql-console-api:* yarn start
```

## Run in cluster

First, build the docker image and upload it to your registry. Then have a look at the `k8s` folder and update the docker image name. Then simply execute the `all.yaml`. 

You need to make sure that the pod is allowed to talk to the k8s API - therefore a ServiceAccount and ClusterRoleBidning is required. Please note that this PoC simply uses the kyma-admin privileges. 

```
kubectl delete -f .k8s/all.yaml
//update
kubectl apply -f .k8s/all.yaml
```

## Permissions
This app requires access read/write for configmaps and delete access for pods to restart the graphql deployment pods. A serviceaccount and clusterrolebinding was setup with wide open permissions based on kyma-admin. This can be reduced. 