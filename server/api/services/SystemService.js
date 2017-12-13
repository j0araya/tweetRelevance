
const si = require('systeminformation');

module.exports = {
    cpu: () => {
        return si.cpu();
    },
    mem: () => {
        return si.mem();
    },
    sys: () => {
        return si.osInfo();
    },
    fsStats: (cb) => {
        return si.fsStats(cb);
    },
    disksIO: (cb) => {
        return si.disksIO(cb);
    },
    diskLayout: (cb) => {
        return si.diskLayout(cb);
    },
    memLayout: (cb) => {
        return si.memLayout(cb);
    },
    networkConnections: (cb) => {
        return si.networkConnections(cb);
    },
    currentLoad: (cb) => {
        return si.currentLoad(cb);
    },
    fullLoad: (cb) => {
        return si.fullLoad(cb);
    },
    networkStats: (cb) => {
        return si.networkStats(cb);
    },
    getStaticData: (cb) => {
        return si.getStaticData(cb);
    },
    getDinamicData: (cb) => {
        return Promise.all([
            si.disksIO(),
            si.fsStats(),
            si.currentLoad(),
            si.fsSize()
        ]);
    }
}
