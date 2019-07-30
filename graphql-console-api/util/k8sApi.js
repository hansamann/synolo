const k8s = require('@kubernetes/client-node');

const kc = new k8s.KubeConfig();

if (process.env.DEBUG) {
    kc.loadFromDefault()
} else {
    kc.loadFromCluster()
}

module.exports = kc.makeApiClient(k8s.Core_v1Api);