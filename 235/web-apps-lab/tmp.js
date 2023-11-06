let cars = [
	{make:"Toyota",	year:2015},
	{make:"Jeep",	year:1946},
	{make:"Ford",	year:2017},
	{make:"Tesla",	year:2018},
	{make:"Fiat",	year:1982},
	{make:"Dodge",	year:1970},
	{make:"Chevy",	year:1957},
];

// For this exercise you will use Array.filter(), Array.sort(), and Array.map() on
// the cars array above.

/*
 1 - Create a new array named 'classicCars' that contains only those cars with a
 .year of 1970 or earlier. Use Array.filter() on the cars array:
 https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
*/

    //This lets you call a function that acts as a conditional
    let classicCars = cars.filter(car => car.year <= 1970);

/*
 2 - Create a new array named 'sortedByYear' that contains the contents of the
 car array, sorted by .year, ascending (oldest to most recent)
 Use Array.sort() on the cars array - and read about writing a comparison function here:
 https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
 
*/

    //Compares adjacent items in an array. You provide the "conditional" where any positive value means a > b, - a < b, or 0 a = b
    // <0 => a < b
    // >0 => a > b
    // =0 => a = b
    //Note: this also sorts the original array besides returning a sorted new one
    let sortedByYear = cars.sort((a, b) => a.year - b.year);

/*
 3 - Create a new array named 'newerYearsOnly' that contains only the .year property 
 (not the entire car object) of those cars that are .year 2010 or newer. 
 Use Array.map() on the cars array:
 https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map
 
 This will give you a few undefined values. Use Array.filter() to get rid of these 
 undefined values so that newerYearsOnly contains only years (Numbers)
 
 Hint: you could use Number.isInteger() or the typeof operator:
 https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger
 https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof
 
 You could do this additional filter on a separate filter on the different lines,
 or as a "one-liner" by chaining the method calls.
*/

    //This is how I did it originally but I guess I was supposed to map first then filter
    //I think this is both more concise and more faster since it requires only one loop with an if statement.
    //Kind of like trimming before changing capitalization when sanitizing strings
    let newerYearsOnlyMyWay = cars.filter(car => car.year > 2010).map(car => car.year);

    //For each index of an array, it will push the item returned by the function at that same
    //index of the returned array. The function takes in the original item
    let newerYearsOnly = cars.map(car => { if(car.year > 2010) return car.year; }).filter(year => Number.isInteger(year));
    let newerYearsOnly2 = cars.map(car => { if(car.year > 2010) return car.year; }).filter(year => typeof year == "number");


debugger;