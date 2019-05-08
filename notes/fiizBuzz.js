function fizzBuzz(num) {
    for (var i = 1; i <= num; i++) {
        if (i % 3 == 0 && i % 5 === 0) {
            console.log("fizzbuzz");
        } else if (i % 5 === 0) {
            console.log("buzz");
        } else if (i % 3 === 0) {
            console.log("fizz");
        }
    }
}

// fizzBuzz(30);

//// with while

function fizzBuzzWithWhile(num) {
    let counter = 1;
    while (counter <= num) {
        if (counter % 3 === 0 && counter % 5 === 0) {
            console.log("fizzbuzz");
        } else if (counter % 5 === 0) {
            console.log("buzz");
        } else if (counter % 3 === 0) {
            console.log("fizz");
        }
        counter++;
    }
}

// fizzBuzzWithWhile(20);

console.log(true == 0);
