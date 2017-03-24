"Use strict"
//test dojo
var test = require('tape').test;
var dojo = require("../app/dojo");
var objects = require("../app/objects");
var fs = require("fs");

function setup(){
     reset()
     dojo.createRoom("Kenya", "Living")
     dojo.createRoom("Uganda", "Office")
     dojo.addPerson("Baba", "Blue", "Fellow", "Y")
     dojo.addPerson("Mama", "Blue", "Fellow", "Y")
     dojo.addPerson("Toto", "Blue", "Staff")
     dojo.addPerson("Sisi", "Blue", "Staff")
     dojo.addPerson("Tutu", "Blue", "Fellow", "Y")
     dojo.addPerson("Nyenye", "Blue", "Fellow", "Y")
     dojo.createRoom("Arusha", "Living")
     dojo.createRoom("Congo", "Office")
     dojo.addPerson("Mama", "Red", "Fellow", "Y")
     dojo.addPerson("Toto", "Red", "Staff")

}

function reset(){
    dojo.rooms = [];
    dojo.persons = [];
}
//Testing addPerson function
test("No duplicate names", function(assert){
     dojo.addPerson("Ernest", "Blue", "Fellow", "Y");
     let actual = dojo.addPerson("Ernest", "Blue", "Fellow", "Y");
     let expected = "The name already exists!";
     msg = "addPerson should not allow duplicate names";
     assert.equal(actual, expected, msg);
     assert.end();
});

test("No invalid person category", function(assert){
     let actual = dojo.addPerson("Ernest", "Greens", "Teacher", "Y");
     let expected = "The specified category doesn't exist!";
     let msg = "addPerson should not allow invalid person category";
     assert.equal(actual, expected, msg);
     assert.end();
});

test("No invalid accomodation category", function(assert){
     let actual = dojo.addPerson("Samuel", "Greens", "Fellow", "T");
     let expected = "Choose either 'Y' or 'N' for accomodation!";
     let msg = "addPerson should not allow invalid accomodation category";
     assert.equal(actual, expected, msg);
     assert.end();
});

test("No non-alphabet characters in names", function(assert){
     let actual = dojo.addPerson("Samuel25", "Greens", "Fellow", "Y");
     let expected = "Names must be made up of alphabetic characters!";
     let msg = "addPerson should not allow non-alphabet charcters in names";
     assert.equal(actual, expected, msg);
     assert.end();
});

test("Successfully adds a fellow", function(assert){
     dojo.addPerson("Alfred", "Greens", "Fellow", "Y");
     let msg = "addPerson should Successfully add a fellow to the dojo";
     let personsNames = dojo.persons.map(person => person.name);
     assert.true(personsNames.includes("Alfred Greens"));
     assert.end();
});

test("Successfully adds a staff", function(assert){
     dojo.addPerson("Alfred", "Blue", "Staff");
     let msg = "addPerson should Successfully add a staff to the dojo";
     let personsNames = dojo.persons.map(person => person.name);
     assert.true(personsNames.includes("Alfred Blue"));
     assert.end();
});

test("Does not allocate accomodation to staff", function(assert){
     let actual = dojo.addPerson("Albert", "Greens", "STAFF", "Y");
     let expected = "Only fellows are allowed accomodation!";
     let msg = "addPerson should not allocate accomodation to staff";
     assert.equal(actual, expected, msg);
     assert.end();
});

test("Fellow Object is the prototype of new fellow", function(assert){
     reset()
     dojo.addPerson("Albert", "Greens", "Fellow")
     let actual = Object.getPrototypeOf(dojo.persons[0]);
     let expected = objects.Fellow;
     let msg = "Fellow Object Should be the prototype of new fellow";
     assert.equal(actual, expected, msg);
     assert.end();
});

test("Staff Object is the prototype of new staff", function(assert){
     reset()
     dojo.addPerson("Albert", "Greens", "Staff")
     let actual = Object.getPrototypeOf(dojo.persons[0]);
     let expected = objects.Staff;
     let msg = "Staff Object Should be the prototype of new staff";
     assert.equal(actual, expected, msg);
     assert.end();
});

test("addPerson allocates rooms to fellows", function(assert){
     reset()
     dojo.createRoom("Sodium", "LIVING")
     dojo.createRoom("Metal", "Office")
     dojo.addPerson("Albert", "Greens", "Fellow", "Y")
     dojo.addPerson("Bilfil", "Spoons", "Fellow")
     let msg = "addPerson should allocate a room to fellow correctly";
     assert.deepEqual(dojo.persons[0].office, dojo.rooms[1], msg);
     assert.deepEqual(dojo.persons[1].office, dojo.rooms[1], msg);
     assert.deepEqual(dojo.persons[0].accomodation, dojo.rooms[0], msg);
     assert.deepEqual(dojo.persons[1].accomodation, "", msg);
     assert.end();
});

test("addPerson allocates rooms to fellows", function(assert){
     reset()
     dojo.createRoom("Metal", "Office")
     dojo.addPerson("Albert", "Greens", "Staff")
     let msg = "addPerson should allocate a room to staff correctly";
     assert.deepEqual(dojo.persons[0].office, dojo.rooms[0], msg);
     assert.deepEqual(dojo.persons[0].accomodation, undefined, msg);
     assert.end();
});

//Testing createRoom function
test("createRoom rejects invalid room category", function(assert){
     let actual = dojo.createRoom("Marley", "Hostel");
     let expected = "The specified room category doesn't exist!";
     let msg = "createRoom should reject an invalid room category";
     assert.equal(actual, expected, msg);
     assert.end();
});

test("createRoom rejects invalid room name", function(assert){
     let actual = dojo.createRoom("Marley22", "LIVING");
     let expected = "Invalid room name. Only alphabets allowed!";
     let msg = "createRoom should reject an invalid room name";
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

//Testing printRoom function
test("printRoom rejects non-existent room", function(assert){
     reset()
     let actual = dojo.printRoom("Marley");
     let expected = "There is no room with the name 'Marley'"
     let msg = "printRoom should reject a non-existent room name"
     assert.equal(actual, expected, msg);
     assert.end();
});

test("printRoom alerts on an empty room", function(assert){
     reset()
     dojo.createRoom("Marley", "Office");
     let actual = dojo.printRoom("Marley")
     let expected = "Marley is currently unoccupied"
     let msg = "printRoom should alert on empty room"
     assert.equal(actual, expected, msg);
     assert.end();
});

test("printRoom returns the required string as output", function(assert){
     reset()
     dojo.createRoom("Marley", "Office");
     dojo.addPerson("Albert", "Greens", "Fellow", "Y");
     dojo.addPerson("Bilfil", "Spoons", "Fellow");
     let actual = dojo.printRoom("Marley")
     let heading = "Room Name:    Marley\n"
     let occupants = "Albert Greens\nBilfil Spoons\n"
     let expected = heading + occupants
     let msg = "printRoom returns the required string as output"
     assert.equal(actual, expected, msg);
     assert.end();
});
//Testing printAllocations function
test("printAllocations Successfully prints", function(assert){
     reset()
     dojo.createRoom("Marley", "Office");
     dojo.createRoom("Tipy", "LIVING");
     dojo.addPerson("Albert", "Greens", "Fellow", "Y");
     let actual = dojo.printAllocations();
     let expected = "...complete";
     let msg = "printAllocations should excecute Successfully";
     assert.equal(actual, expected, msg);
     assert.end();
});

test("printAllocations with text file", function(assert){
     reset()
     dojo.createRoom("Marley", "Office");
     dojo.createRoom("Tipy", "LIVING");
     dojo.addPerson("Albert", "Greens", "Fellow", "Y");
     dojo.printAllocations("myfile.txt");
     let msg = "printAllocations should output a text file";
     assert.true(fs.existsSync("myfile.txt"), msg);
     assert.end();
});
//Testing printUnallocations function
test("printUnallocated Successfully prints", function(assert){
     reset()
     dojo.addPerson("Albert", "Greens", "Fellow", "Y");
     let actual = dojo.printUnallocated();
     let expected = "...complete";
     let msg = "printUnallocated should excecute Successfully";
     assert.equal(actual, expected, msg);
     assert.end();
});

test("printUnallocated with text file", function(assert){
     reset()
     dojo.addPerson("Albert", "Greens", "Fellow", "Y");
     dojo.printUnallocated("myfile2.txt");
     let msg = "printUnallocated should output a text file";
     assert.true(fs.existsSync("myfile2.txt"), msg);
     assert.end();
});

//Testing reallocate person function
test("reallocte rejects non-existent idno", function(assert){
     reset()
     let actual = dojo.reallocate("1", "Marley");
     let expected = "You have entered an invalid of non-existent idno";
     let msg = "reallocate should reject invalid/non-existent idno";
     assert.equal(actual, expected, msg)
     assert.end();
});

test("reallocte rejects non-existent room", function(assert){
     reset()
     dojo.addPerson("Ernest", "Blue", "Fellow", "Y")
     let actual = dojo.reallocate("1", "Marley");
     let expected = "You have entered a non-existing room";
     let msg = "reallocate should reject non-existent room";
     assert.equal(actual, expected, msg)
     assert.end();
});

test("reallocte rejects rellocating to full room", function(assert){
     setup()
     dojo.addPerson("Smally", "Big", "Staff")
     let actual = dojo.reallocate("6", "Kenya");
     let expected = "Kenya is currently full";
     let msg = "reallocate should reject rellocating to full room";
     assert.equal(actual, expected, msg)
     assert.end();
});
test("reallocte rejects rellocating to his current room", function(assert){
     setup()
     let expected = "You are trying to rellocate a person to his current room";
     let msg = "reallocte rejects rellocating a person his current room";
     assert.equal(dojo.reallocate("7", "Arusha"), expected, msg)//living
     assert.equal(dojo.reallocate("8", "congo"), expected, msg)//staff office
     assert.equal(dojo.reallocate("7", "Congo"), expected, msg)//fellow office
     assert.end();
});
test("reallocte rejects rellocating staff to living", function(assert){
     setup()
     let expected = "Invalid request. Staff do not have accomodation";
     let msg = "reallocte rejects rellocating staff to living";
     assert.equal(dojo.reallocate("8", "Arusha"), expected, msg)
     assert.end();
});

test("reallocates fellow successfully to living", function(assert){
     setup()
     dojo.reallocate("1", "Arusha")
     let msg = "Should reallocate fellow successfully to living";
     assert.equal(dojo.rooms[2].occupants.length, 2, msg);
     assert.equal(dojo.rooms[0].occupants.length, 3, msg);
     assert.end();
});
test("reallocates fellow successfully to office", function(assert){
     setup()
     dojo.reallocate("1", "conGO")
     let msg = "Should reallocate fellow successfully to office";
     assert.equal(dojo.rooms[3].occupants.length, 3, msg);
     assert.equal(dojo.rooms[1].occupants.length, 5, msg);
     assert.end();
});
test("reallocates staff successfully to office", function(assert){
     setup()
     dojo.reallocate("3", "conGO")
     let msg = "Should reallocate staff successfully to office";
     assert.equal(dojo.rooms[3].occupants.length, 3, msg);
     assert.equal(dojo.rooms[1].occupants.length, 5, msg);
     assert.end();
});



