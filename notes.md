While JavaScript is not a classical language, ES6 introduced a class declaration syntax. ES6
classes are syntactical sugar over JavaScript’s prototype-based inheritance model.

There are two ways to declare React components:
(1) As ES6 classes (as above)
(2) Importing and using the createReactClass() method
An example of using an ES6 class:
class HelloWorld extends React.Component {
render() { return(<p>Hello, world!</p>) }
}
The same component written using the createReactClass function from the create-react-class library:
import createReactClass from 'create-react-class';
const HelloWorld = createReactClass({
render() { return(<p>Hello, world!</p>) }
})
In React 15 and earlier, this method is available via the react library:
const HelloWorld = React.createClass({
render() { return(<p>Hello, world!</p>) }
}


Even though the JSX above looks exactly like HTML, it’s important to remember that JSX
is actually just compiled into JavaScript (ex: React.createElement('div')).
During runtime React takes care of rendering the actual HTML in the browser for each
component.
React.createElement('div', {className: 'ui items'},
React.createElement('p', null, 'Hello, friend! I am a basic React component.'))
In JSX:
<div className='ui items'>
<p>
Hello, friend! I am a basic React component.
</p>
</div>

setState() is actually asynchronous.
There is no guarantee when React will update the state and re-render our component.



Binding in constructor()
The first thing we do in constructor() is call super(props). The React.Component class that
our Product class is extending defines its own constructor(). By calling super(props), we’re
invoking that constructor() function first.
Importantly, the constructor() function defined by React.Component will bind this inside our
constructor() to the component. Because of this, it’s a good practice to always call super() first
whenever you declare a constructor() for your component.
After calling super(), we call bind() on our custom component method:
this.handleUpVote = this.handleUpVote.bind(this);
Function’s bind() method allows you to specify what the this variable inside a function body
should be set to. What we’re doing here is a common JavaScript pattern. We’re redefining the
component method handleUpVote(), setting it to the same function but bound to this (the
component). Now, whenever handleUpVote() executes, this will reference the component as
opposed to null.
without the property initializer feature we’d write our custom component method
like this:
handleFormOpen() {
this.setState({ isOpen: true });
}
Our next step would be to bind this method to the component inside the constructor, like this:
constructor(props) {
super(props);
this.handleFormOpen = this.handleFormOpen.bind(this);
}
This is a perfectly valid approach and does not use any features beyond ES7

You might wonder: why separate handleCreateFormSubmit() and createTimer()? While
not strictly required, the idea here is that we have one function for handling the event
(handleCreateFormSubmit()) and another for performing the operation of creating a timer
(createTimer()).
This separation follows from the SINGLE RESPONSIBILITY PRINCIPLE and enables us to call
createTimer() from elsewhere if needed.



Treat the state object as immutable. It’s important to understand which Array and Object
methods modify the objects they are called on.

*****ARRAY METHODS*****
Array’s filter() method accepts a function that is used to “test” each element in the array.
It returns a new array containing all the elements that “passed” the test. If the function
returns true, the element is kept.

Array’s sort() method takes an optional function as an argument. If the function is
omitted, it will just sort the array by each item’s Unicode code point value. This is rarely
what a programmer desires. If a function is supplied, elements are sorted according to the
function’s return value.
On each iteration, the arguments a and b are two subsequent elements in the array. Sorting
depends on the return value of the function:
1. If the return value is less than 0, a should come first (have a lower index).
2. If the return value is greater than 0, b should come first.
3. If the return value is equal to 0, leave order of a and b unchanged with respect to
each other.

Array’s map()
Array’s map method takes a function as an argument. It calls this function with each item inside
of the array (in this case, each object inside Seed.products) and builds a new array by using the
return value from each function call.


*****OBJECT METHODS****
Object.assign()
We use Object.assign() often throughout the book. We use it in areas where we want to create a
modified version of an existing object.
Object.assign() accepts any number of objects as arguments. When the function receives two
arguments, it copies the properties of the second object onto the first, like so:
    appendix/es6/object_assign.js
    const coffee = { };
    const noCream = { cream: false };
    const noMilk = { milk: false };
    Object.assign(coffee, noCream);
    // coffee is now: `{ cream: false }`
It is idiomatic to pass in three arguments to Object.assign(). The first argument is a new JavaScript
object, the one that Object.assign() will ultimately return. The second is the object whose
properties we’d like to build off of. The last is the changes we’d like to apply:
195
https://hacks.mozilla.org/2015/08/es6-in-depth-modules/Appendix B: ES6 798
    appendix/es6/object_assign.js
    const coffeeWithMilk = Object.assign({}, coffee, { milk: true });
    // coffeeWithMilk is: `{ cream: false, milk: true }`
    // coffee was not modified: `{ cream: false, milk: false }`
Object.assign() is a handy method for working with “immutable” JavaScript objects.


If an array is passed in as an argument to concat(), its elements are appended to the new
array. For example:
> [ 1, 2, 3 ].concat([ 4, 5 ]);
=> [ 1, 2, 3, 4, 5 ]

array.join() will join items in array with the value passed in the parentheses join('') = HatCatBat, join() = Hat,Cat,Bat, join(":") = Hat:Cat:Bat

array.forEach()



*****STRING METHODS*****

STRING.split() returns an array of strings, split at passed in argument. 
e.g. " " = "Hello you ol so and so" = ["Hello", "you", "ol", etc..]
 "",  = ["H", "e", "l", "l","o"," ", "y","o","u", " ", "o" etc..]
 or as is will just return the string in an array = ["Hello you ol" etc..]


setInterval() accepts two arguments. The first is the function you would like to call
repeatedly. The second is the interval on which to call that function (in milliseconds).
setInterval() returns a unique interval ID. You can pass this interval ID to
clearInterval() at any time to halt the interval.

XMLHttpRequest / Fetch (include fetch library script to wrap for browser compatability) / jquery.ajax()

headers application/url-encoded = SENDING data needs to be name value pairs(e.i. "name=jason&last=expo&age=32")
headers application/json = SENDING data needs to be sent as ({"name": "jason", "last": "expo", "age": 32}) & use JSON.stringify

fs.readfile/fs.writefile needs to be JSON.parse(data) because nodes fs returns a buffer or string only

***JSON.parse(response) vs response.json()***
httpresponse.json is a promise and asyncronous
JSON.parse(response) is syncronous and can parse a json string

