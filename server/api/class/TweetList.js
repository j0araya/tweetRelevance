class TweetList {
    constructor(size, substraction) {
        this.list = [];
        this.max = 1;
        this.substraction = substraction/100;
        this.size = size || 10;
    }
}
TweetList.prototype.norm = function () {
    for (let i = 0; i < this.list.length; i++) {
        if (this.list[i].value > this.max) {
            this.max = this.list[i].value;
        }
        this.list[i].normValue = this.list[i].value / this.max;
    }
    // this.list.forEach(t => {
    //     if (t.value > max) {
    //         max = t.value;
    //     }
    //     t.normValue = t.value / max;
    // });
};
TweetList.prototype.substract = function () {
    this.list.forEach(t => {
        t.value = t.value * this.substraction;
    });
};

TweetList.prototype.setSubstract = function (value) {
    this.substraction = value;
};

// TweetList.prototype.normalizeList = function (attribute) {
//     this.list.forEach(t => {
//         t[attribute] = t[attribute] / this.max;
//     });
// };

TweetList.prototype.add = function (tweet, value) {
    let list = this.list;
    let indexFound = -1;
    let indexToAdd = list.length ? -1 : 0;
    let oneTimeFlag = true;
    for (let i = 0; i < list.length; i++) {
        let element = list[i];
        if (element.id === tweet.id) {
            indexFound = i;
        }
        if (oneTimeFlag && value >= element.value) {
            indexToAdd = i;
            oneTimeFlag = false;
        }
    }
    tweet.value = value;
    tweet.added = new Date();
    if (~indexFound && ~indexToAdd) { // si existe el elemento en la lista;
        if (indexToAdd < indexFound) {
            list.splice(indexFound, 1);
            list.splice(indexToAdd, 0, tweet);
        } else if (indexToAdd > indexFound) {
            list.splice(indexToAdd, 1);
            list.splice(indexFound, 0, tweet);
        } else {
            list[indexToAdd] = tweet;
        }
    } else if (list.length <= this.size) { // si la lista aun no esta llena.
        list.splice(indexToAdd, 0, tweet);
    }
    if (list.length > this.size) { // si no existe el tweet se agrega y se elimina el ultimo
        list.pop();
    }
};

// TweetList.prototype.reponderate = function (attribute) {
//     let tempList = Array.from(this.list);
//     console.log(1, tempList[0][attribute]);
//     // console.log(1, tempList[1].normTotal);
//     this.list.forEach((l, index) => {
//         if (index < (tempList.length - 1)) {
//             l.attribute = tempList[index + 1].attribute - this.substraction;
//         } else {
//             l.attribute -= l.attribute - (this.substraction * 2);
//         }
//         // return l;
//     });
//     console.log(2, tempList[0][attribute]);
//     // console.log(2, tempList[1].normTotal);
// };


TweetList.prototype.getMax = function () {
    return this.max;
};

TweetList.prototype.getLast = function () {
    return this.list[this.list.length - 1] || { value: 0 };
};

TweetList.prototype.getFirst = function () {
    return this.list[0];
};
module.exports.TweetList = TweetList;