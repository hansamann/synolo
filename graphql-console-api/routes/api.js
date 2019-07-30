var express = require('express');
var router = express.Router();

const k8sApi = require('../util/k8sApi.js')

//var namespace = 'stage';
const namespace = process.env['K8S_NAMESPACE'] ? process.env['K8S_NAMESPACE'] : 'stage';
console.log("K8S Namespace is set to", namespace);

router.get('/', function(req, res, next) {
	res.json({success:true, msg:"Ready. Go change the world."})
});


/* Kill the graphql pods for the server. The deployment is supposed to restart these pods.  */
router.post('/kill', function(req, res, next) {
	k8sApi.listNamespacedPod(namespace, false, null, null, null, "app=graphql-server").then(listReponse => {
		pods = listReponse.body.items.map(pod => pod.metadata.name);
		console.log("Pods to delete: ", pods)
		pods.forEach(pod => {
			k8sApi.deleteNamespacedPod(pod, namespace).then(res => {
				console.log(res.body.metadata.name + "was deleted, deployment will restart it!");
			})
		});

		if (pods.length > 0)
		{
			res.json({success: true, msg: "killing " + pods.join(",")});
		} else {
			res.json({success: false, msg: "no pods matched"});
		}

	}).catch(err => {
		console.log(err);
		res.json({success:false, msg:"Unable to retrieve graphql-server pods."})
	});
});

/* 
	Retrieve a list of all graphql type keys based on the type configmap. 
	If this cm does not exist, it will be created and an empty array is returned. 
*/
router.get('/types', function(req, res, next) {
	let configMapName = 'graphql-types'
	k8sApi.readNamespacedConfigMap(configMapName, namespace).then(kubeResponse => {
		let cm = kubeResponse.body
		res.json({success:true, keys:Object.keys(cm.data)})
	}).catch(err => {
		if (err.body && err.body.reason == "NotFound"){
			console.log("ConfigMap", configMapName, "not found, creating it")
	
			let cm =  { 
				kind: 'ConfigMap',
				apiVersion: 'v1',
				metadata:
				{ 
					name: configMapName,
					namespace: namespace
				},
				data: {
					"query.graphql": "type Query {\n  product(id: String) : Product\n}\n",
					"product.graphql": "type Product {\n  id: ID\n  name: String\n  description : String\n  manufacturer : String\n  price : String\n  images : [Image]\n  reviews : [Review]\n}",
					"image.graphql": "type Image {\n  url: String\n  type: String\n}",
					"review.graphql": "type Review {\n  author: String\n  rating: Int\n}\n\n\n"
				}
			}
	
			k8sApi.createNamespacedConfigMap(namespace, cm).then(createResponse => {
				console.log("Initial CM created.")
				console.log(createResponse.body)
				res.json({success:true, created:true, keys:Object.keys(cm.data)})
			})
		}
	})
});

/* 
	Get the code of one specific type key via the types configmap. 
*/
router.get('/types/:key', function(req, res, next) {
	k8sApi.readNamespacedConfigMap('graphql-types', namespace).then(kubeResponse => {
		let cm = kubeResponse.body
		if (cm.data[req.params.key]) {
			res.json({success:true, key:req.params.key, value:cm.data[req.params.key]})
		} else {
			res.json({success: false, msg: `Key ${req.params.key} does not exist.`})	
		}
	}).catch (err => {
		res.json({success: false, msg: 'Unable to retrieve configmap.'})
	})
});

/* 
	Delete a type
*/
router.delete('/types/:key', function(req, res, next) {
	console.log(`Deletign type ${req.params.key}`)

	k8sApi.readNamespacedConfigMap('graphql-types', namespace).then(kubeResponse => {
		
		let cm = kubeResponse.body;

		delete cm.data[req.params.key];
		
		k8sApi.replaceNamespacedConfigMap('graphql-types', namespace, cm).then(replaceResponse => {
			res.json({success:true, obj:replaceResponse.body})
		}).catch(replaceError => {
			console.log(replaceError)
			res.json({success:false, msg: "Unable to update configmap."})
		})
		
	}).catch (err => {
		res.json({success: false, msg: 'Unable to retrieve configmap.'})
	})
});

/*
Update a type key in the types configmap. 
*/

router.post('/types/:key', function(req, res, next) {
	console.log(`Updating type ${req.params.key}`)
	console.log(req.body)

	k8sApi.readNamespacedConfigMap('graphql-types', namespace).then(kubeResponse => {
		
		let cm = kubeResponse.body;

		cm.data[req.params.key] = req.body.value
		
		k8sApi.replaceNamespacedConfigMap('graphql-types', namespace, cm).then(replaceResponse => {
			res.json({success:true, obj:replaceResponse.body})
		}).catch(replaceError => {
			console.log(replaceError)
			res.json({success:false, msg: "Unable to replace/update configmap."})
		})
		
	}).catch (err => {
		res.json({success: false, msg: 'Unable to retrieve configmap.'})
	})
});

router.get('/resolvers', function(req, res, next) {
	let configMapName = 'graphql-resolvers'
	k8sApi.readNamespacedConfigMap(configMapName, namespace).then(kubeResponse => {
		let cm = kubeResponse.body
		res.json({success:true, keys:Object.keys(cm.data)})
	}).catch(err => {
		if (err.body && err.body.reason == "NotFound"){
			console.log("ConfigMap", configMapName, "not found, creating it")
	
			let cm =  { 
				kind: 'ConfigMap',
				apiVersion: 'v1',
				metadata:
				{ 
					name: configMapName,
					namespace: namespace
				},
				data: {
					"Query.js": "\nfunction product(parent, {id}) { \n\treturn {\n\t\tid : id,\n\t\tname : `Product ${id}`,\n\t\tdescription : `This is the description of product ${id}`,\n\t\tmanufacturer :  'HolyMoly Inc,.',\n\t\tprice : \"$25.95\"\n\t}\n}\n\nmodule.exports = {\n\tQuery : {\n\t\tproduct\n\t}\n}\n",
					"Product.js": "\n\nfunction images(parent) { \n\treturn [\n\t\t{url : \"https://placeholder.pics/svg/300x300\", type: \"thumbnail\"},\n\t\t{url : \"https://placeholder.pics/svg/1200x1200\", type: \"normal\"},\n\t\t{url : \"https://placeholder.pics/svg/2400x2400\", type: \"detail\"}\n\t]\n}\n\nfunction reviews(parent) { \n\treturn [\n\t\t{author: \"Sven\", rating: 5},\n\t\t{author: \"Andreas\", rating: 4}\n\t]\n}\n\nmodule.exports = {\n\timages,\n\treviews,\n}\n\nmodule.exports = {\n\tProduct : {\n\t\timages,\n\t\treviews\n\t}\n}"					
				}
			}
	
			k8sApi.createNamespacedConfigMap(namespace, cm).then(createResponse => {
				console.log("Initial CM created.")
				console.log(createResponse.body)
				res.json({success:true, created:true, keys:Object.keys(cm.data)})
			})
		}
	})
});

/*
	Load the resolver javascript code based on ConfigMap Key
*/

router.get('/resolvers/:key', function(req, res, next) {
	k8sApi.readNamespacedConfigMap('graphql-resolvers', namespace).then(kubeResponse => {
		let cm = kubeResponse.body
		if (cm.data[req.params.key]) {
			res.json({success:true, key:req.params.key, value:cm.data[req.params.key]})
		} else {
			res.json({success: false, msg: `Key ${req.params.key} does not exist.`})	
		}
	}).catch (err => {
		res.json({success: false, msg: 'Unable to retrieve configmap.'})
	})
});


/*
	Update the resolvers ConfigMap based on the Key
*/
router.post('/resolvers/:key', function(req, res, next) {
	console.log(`Updating resolver ${req.params.key}`)
	console.log(req.body)

	k8sApi.readNamespacedConfigMap('graphql-resolvers', namespace).then(kubeResponse => {
		
		let cm = kubeResponse.body;

		cm.data[req.params.key] = req.body.value
		
		k8sApi.replaceNamespacedConfigMap('graphql-resolvers', namespace, cm).then(replaceResponse => {
			res.json({success:true, obj:replaceResponse.body})
		}).catch(replaceError => {
			console.log(replaceError)
			res.json({success:false, msg: "Unable to replace/update configmap."})
		})
		
	}).catch (err => {
		res.json({success: false, msg: 'Unable to retrieve configmap.'})
	})
});

/*
	Delete the resolvers ConfigMap based on the Key
*/
router.delete('/resolvers/:key', function(req, res, next) {
	console.log(`Deleting resolver ${req.params.key}`)

	k8sApi.readNamespacedConfigMap('graphql-resolvers', namespace).then(kubeResponse => {
		
		let cm = kubeResponse.body;

		delete cm.data[req.params.key];
		
		k8sApi.replaceNamespacedConfigMap('graphql-resolvers', namespace, cm).then(replaceResponse => {
			res.json({success:true, obj:replaceResponse.body})
		}).catch(replaceError => {
			console.log(replaceError)
			res.json({success:false, msg: "Unable to update resolvers."})
		})
		
	}).catch (err => {
		res.json({success: false, msg: 'Unable to retrieve configmap.'})
	})
});


module.exports = router;
