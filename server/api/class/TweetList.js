class TweetList {

    constructor(size, substraction) {
        // this.maxRetweet = 0;
        // this.maxReply = 0;
        // this.maxQuote = 0;
        // this.maxFavorite = 0;
        this.substraction = substraction / 1000;
        this.list = [];
        this.size = size || 10;
    }
}
TweetList.prototype.add = function (tweet) {
    let list = this.list;
    // let index = list.findIndex(l => tweet.normTotal > l.normTotal);
    let indexFound = -1;
    let indexToAdd = list.length ? -1 : 0;
    let oneTimeFlag = true;
    for (let i = 0; i < list.length; i++) {
        let element = list[i];
        console.log('element', element.id , element.id_srt, tweet.id);
        if (element.id === tweet.id) {
            console.log('equal');
            indexFound = i;
        }
        if (tweet.normTotal > element.normTotal && oneTimeFlag) {
            // console.log('mayor',tweet.normTotal, element.normTotal);
            indexToAdd = i;
            oneTimeFlag = false;
        }
    }
    tweet.added = new Date();
     // si el valor de normalizacion no es mayor a ningun elemento en la lista se retorna.
     console.log('indextoad', indexToAdd, 'indexfound', indexFound);
    if (!~indexToAdd) {
        return;
    }
    if (list.length >= this.size) {
        // si existe el elemento en la lista y es mayor se cambia de posicion;
        if (~indexFound) {
            if (indexToAdd > indexFound) {
                list.splice(indexToAdd, 0, tweet);
                list.splice(indexFound, 1);
                console.log('list <', list);
            } else if (indexToAdd < indexFound) {
                list.splice(indexFound, 1);
                list.splice(indexToAdd, 0, tweet);
                console.log('list >', list);
            } else {
                list[indexToAdd] = tweet;
            }
        } else { // si no existe el tweet se agrega y se elimina el ultimo
            list.splice(indexToAdd, 0, tweet);
            list.pop();
        }
    } else if (list.length && list.length < this.size) {
        list.splice(indexToAdd, 0, tweet);
    } else {
        list.push(tweet);
    }
};
TweetList.prototype.reponderate = function () {
    let tempList = Array.from(this.list);
    console.log(1, tempList[0].normTotal);
    console.log(1, tempList[1].normTotal);
    this.list.forEach((l, index) => {
        if (index < (tempList.length - 1)) {
            l.normTotal = tempList[index + 1].normTotal - this.substraction;
        } else {
            l.normTotal -= l.normTotal - (this.substraction * 2);
        }
        // return l;
    });
    console.log(2, tempList[0].normTotal);
    console.log(2, tempList[1].normTotal);
};


TweetList.prototype.getMaxValues = function () {
    return this.list[this.list.length - 1];
};

TweetList.prototype.getLast = function () {
    return this.list[this.list.length - 1];
};

TweetList.prototype.getFirst = function () {
    return this.list[0];
};
module.exports.TweetList = TweetList;