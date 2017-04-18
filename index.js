const fetch = require('node-fetch');
const co = require('co');

console.log('=========', 'logger1');

function* createLogger1 () {
    console.log('start');
    yield ;
    console.log('end');
}

const logger1 = createLogger1();
console.log(logger1.next());
console.log(logger1.next());

/* ========================================== */

console.log('=========', 'logger2');

function* createLogger2 () {
    yield 'start';
    yield 'end';
}

const logger2 = createLogger2();
console.log(logger2.next());
console.log(logger2.next());
console.log(logger2.next());

/* ========================================== */

console.log('=========', 'counter 1');

function* createCounter1() {
    yield 1;
    const value = yield 2;
    console.log('value is ', value);
    yield value + 1
}
const counterGenerator1 = createCounter1();
console.log('counter next 1', counterGenerator1.next());
console.log('counter next 2', counterGenerator1.next());
console.log('counter next 3', counterGenerator1.next(4));
console.log('counter next 4', counterGenerator1.next());

/* ========================================== */

console.log('=========', 'error handler');

function* createError() {
    try {
        yield ;
    } catch (err) {
        console.log('ERROR: ', err);
    }
}

const error = createError();
console.log('error next 1', error.next());
console.log('error throw 1', error.throw('Something went wrong.'));

/* ========================================== */

console.log('=========', 'counter 2 with iteration');

function* createCounter2() {
    yield 1;
    yield 2;
    yield 3;
}

for (let i of createCounter2()) console.log(i)

/* ========================================== */

console.log('=========', 'counter 3 with iteration and delegation');

function* create3To4() {
    yield 3;
    // yield 4;
    return 4;
}

function* createCounter3() {
    yield 1;
    yield 2;
    const four = yield* create3To4();
    console.log('returned value of the "create3To4"', four);
    yield four;
    yield 5;
}

for (let i of createCounter3()) console.log(i)

/* ========================================== */

console.log('=========', 'quote fetcher');


function* createQuoteFetcher() {
    const response = yield fetch('http://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=json');
    const quote = yield response.json();
    return `${quote.quoteText} —${quote.quoteAuthor}`;
}

const coroutine = (gen) => {
    const generator = gen();

    const handle = (result) => {
        if (result.done) return Promise.resolve(result.value);
        return Promise.resolve(result.value)
        .then(res => handle(generator.next(res)))
    };

    return handle(generator.next())
};

const quoteFetcher1 = coroutine(createQuoteFetcher);
quoteFetcher1.then(quote => console.log(quote));

const quoteFetcher2 = co(createQuoteFetcher);
quoteFetcher2.then(quote => console.log(quote));

