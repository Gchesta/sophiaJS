//test dojo
var test = require('tape').test
var dojo = require("../app/dojo")
var objects = require("../app/objects")

function reset(){
    dojo.rooms = [];
    dojo.persons = [];
}
//Testing addPerson function
test("No duplicate names", function(assert){
     dojo.addPerson("Ernest", "Blue", "Fellow", "Y")
     let actual = dojo.addPerson("Ernest", "Blue", "Fellow", "Y");
     let expected = "The name already exists!"
     msg = "addPerson should not allow duplicate names"
     assert.equal(actual, expected, msg);
     assert.end();
});

test("No invalid person category", function(assert){
     let actual = dojo.addPerson("Ernest", "Greens", "Teacher", "Y");
     let expected = "The specified category doesn't exist!"
     let msg = "addPerson should not allow invalid person category"
     assert.equal(actual, expected, msg);
     assert.end();
});

test("No invalid accomodation category", function(assert){
     let actual = dojo.addPerson("Samuel", "Greens", "Fellow", "T");
     let expected = "Choose either 'Y' or 'N' for accomodation!"
     let msg = "addPerson should not allow invalid accomodation category"
     assert.equal(actual, expected, msg);
     assert.end();
});

test("No non-alphabet characters in names", function(assert){
     let actual = dojo.addPerson("Samuel25", "Greens", "Fellow", "Y");
     let expected = "Names must be made up of alphabetic characters!"
     let msg = "addPerson should not allow non-alphabet charcters in names"
     assert.equal(actual, expected, msg);
     assert.end();
});

test("Successfully adds a fellow", function(assert){
     dojo.addPerson("Alfred", "Greens", "Fellow", "Y");
     let msg = "addPerson should Successfully add a fellow to the dojo"
     let personsNames = dojo.persons.map(person => person.name)
     assert.true(personsNames.includes("Alfred Greens"));
     assert.end();
});

test("Successfully adds a staff", function(assert){
     dojo.addPerson("Alfred", "Blue", "Staff");
     let msg = "addPerson should Successfully add a staff to the dojo"
     let personsNames = dojo.persons.map(person => person.name)
     assert.true(personsNames.includes("Alfred Blue"));
     assert.end();
});

test("Does not allocate accomodation to staff", function(assert){
     let actual = dojo.addPerson("Albert", "Greens", "STAFF", "Y");
     let expected = "Only fellows are allowed accomodation!"
     let msg = "addPerson should not allocate accomodation to staff"
     assert.equal(actual, expected, msg);
     assert.end();
});

test("Fellow Object is the prototype of new fellow", function(assert){
     reset()
     dojo.addPerson("Albert", "Greens", "Fellow");
     let actual = Object.getPrototypeOf(dojo.persons[0]);
     let expected = objects.Fellow
     let msg = "Fellow Object Should be the prototype of new fellow"
     assert.equal(actual, expected, msg);
     assert.end();
});

test("Staff Object is the prototype of new staff", function(assert){
     reset()
     dojo.addPerson("Albert", "Greens", "Staff");
     let actual = Object.getPrototypeOf(dojo.persons[0]);
     let expected = objects.Staff
     let msg = "Staff Object Should be the prototype of new staff"
     assert.equal(actual, expected, msg);
     assert.end();
});

test("addPerson allocates rooms to fellows", function(assert){
     reset()
     dojo.createRoom("Sodium", "LIVING");
     dojo.createRoom("Metal", "Office");
     dojo.addPerson("Albert", "Greens", "Fellow", "Y");
     dojo.addPerson("Bilfil", "Spoons", "Fellow");
     let msg = "addPerson should allocate a room to fellow correctly"
     assert.deepEqual(dojo.persons[0].office, dojo.rooms[1], msg)
     assert.deepEqual(dojo.persons[1].office, dojo.rooms[1], msg)
     assert.deepEqual(dojo.persons[0].accomodation, dojo.rooms[0], msg)
     assert.deepEqual(dojo.persons[1].accomodation, "", msg)
     assert.end();
});

test("addPerson allocates rooms to fellows", function(assert){
     reset()
     dojo.createRoom("Metal", "Office");
     dojo.addPerson("Albert", "Greens", "Staff");
     let msg = "addPerson should allocate a room to staff correctly"
     assert.deepEqual(dojo.persons[0].office, dojo.rooms[0], msg)
     assert.deepEqual(dojo.persons[0].accomodation, undefined, msg)
     assert.end();
});

//Testing createRoom function
test("createRoom rejects invalid room category", function(assert){
     let actual = dojo.createRoom("Marley", "Hostel");
     let expected = "The specified room category doesn't exist!"
     let msg = "createRoom should reject an invalid room category"
     assert.equal(actual, expected, msg);
     assert.end();
});

test("createRoom rejects invalid room name", function(assert){
     let actual = dojo.createRoom("Marley22", "LIVING");
     let expected = "Invalid room name. Only alphabets allowed!"
     let msg = "createRoom should reject an invalid room name"
     assert.equal(actual, expected, msg);
     assert.end();
});

test("createRoom rejects duplicate room name", function(assert){
     reset()
     dojo.createRoom("Bob", "Living")
     let actual = dojo.createRoom("Bob", "Office");
     let expected = "A room with the same name already exists"
     let msg = "createRoom should reject a duplicate room name"
     assert.equal(actual, expected, msg);
     assert.end();
});

test("Rooms are created from their prototypes", function(assert){
     reset()
     dojo.createRoom("Bob", "Living")
     dojo.createRoom("Tosh", "Office")
     let actual1 = Object.getPrototypeOf(dojo.rooms[0]);
     let actual2 = Object.getPrototypeOf(dojo.rooms[1]);
     let expected1 = objects.LivingSpace
     let expected2 = objects.Office
     let msg1 = "'LivingSpace' should be the prototype of 'Bob'"
     let msg2 = "'Office' should be the prototype of 'Tosh'"
     assert.equal(actual1, expected1, msg1);
     assert.equal(actual2, expected2, msg2);
     assert.end();
});








