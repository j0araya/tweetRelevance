const correlation = require('correlation-rank');
const SpearmanRHO = require('spearman-rho');

module.exports = {
    getPearson: (req, res) => {
        sails.log('asdadasd');
        let rank = correlation.rank([1, 2, 3, 4, 5], [-5, 25, 10, 20, 100]);
        let determination = correlation.determination([1, 2, 3, 4, 5], [-5, 25, 10, 20, 100]);
        return res.send({ rank, determination });
    },
    getSpearman: (req, res) => {
        const x = [2.0, 3.0, 3.0, 5.0, 5.5, 8.0, 10.0, 10.0];
        const y = [1.5, 1.5, 4.0, 3.0, 1.0, 5.0, 5.0, 9.5];

        const spearmanRHO = new SpearmanRHO(x, y);
        return spearmanRHO.calc()
            .then(value => {
                sails.log(value);
                return res.send({value});
            })
            .catch(err => {
                return res.serverError(err);
            });
    }
};