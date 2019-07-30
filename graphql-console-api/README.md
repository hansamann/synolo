# graphql-console-api

This is the API part for the `graphql-console`. Please note that this does not currently use any security and directly interfaces the kubernetes api server via the node.js k8s APIs. It exposes the capabilities to read and write to the `types` and `resolvers` ConfigMaps as well as allows the user to kill all graphql server pods so that they can be restarted with the updated ConfigMap configuration. 

To change the used K8S namespace for ConfigMap operations, please provide the `K8S_NAMESPACE` environment varible. The default is set to `stage`. 

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