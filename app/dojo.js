var fs = require('fs');
var objects = require ("./objects")

const dojo = {
rooms:[],
persons:[],
addPerson: function(firstName, surname, category, accomodation="N"){
    name = this.toTitleCase(firstName) + " " + this.toTitleCase(surname);
    category = String(category).toUpperCase();
    accomodation = accomodation.toUpperCase();
    var personIsInvalid = this.checkPersonInvalid(name, category, accomodation)
    if (personIsInvalid){
        return personIsInvalid;
    }
    var idno = String(this.persons.length + 1);
    if (category === "FELLOW"){
        var newPerson = Object.create(objects.Fellow);
        newPerson.setUp(name, idno, accomodation);
    }else{
        var newPerson = Object.create(objects.Staff);
        newPerson.setUp(name, idno);
    }
    var office = this.allocateOffice(newPerson)
    accomodation = "None"
    if (newPerson.accomodation === "Unallocated"){
        accomodation = this.allocateAccomodation(newPerson);
    }
    this.persons.push(newPerson);
    return (`Successfully added ${name} to the Dojo.
    \tAllocated Office:${office}\n\tAllocated Accomodation:${accomodation}`)
},

toTitleCase: function(str){
//to convert strings into title case
    str = String(str);
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
},

checkPersonInvalid: function(name, category, accomodation){
//This function is used to check if the person's parameters are invalid.
    var allNames = this.persons.map(person => person.name);
    if (allNames.includes(name)){
        return "The name already exists!";
    }
    if (!["FELLOW","STAFF"].includes(category)){
        return "The specified category doesn't exist!";
    }
    if (!["Y","N"].includes(accomodation)){
        return "Choose either 'Y' or 'N' for accomodation!";
    }
    if (!/^[A-Za-z\s]+$/.test(name)){
        return "Names must be made up of alphabetic characters!";
    }
    if (accomodation === "Y" && category === "STAFF"){
        return "Only fellows are allowed accomodation!";
    }
},

allocateOffice: function(person){
    var office = this.checkAvailableRoom("Office");
    if (office == "None"){
        return "None";
    }
    office.capacity -= 1;
    office.occupants.push(person);
    person.office = office;
    return office.name;
},

allocateAccomodation: function(person){
    var accomodation = this.checkAvailableRoom("Living Space");
    if (accomodation == "None"){
        return "None";
    }
    accomodation.capacity -= 1;
    accomodation.occupants.push(person);
    person.accomodation = accomodation;
    return accomodation.name;
},

checkAvailableRoom: function(category){
    var availableRooms = this.rooms.filter(
        room => room.capacity > 0 && room.category == category);
    if (availableRooms == false){
        return "None";
    }
    var room = availableRooms[Math.floor(Math.random() * availableRooms.length)];
    return room
},
createRoom: function(name, category){
    name = this.toTitleCase(name);
    category = category.toUpperCase();
    let roomIsInvalid = this.checkRoomInvalid(name, category)
    if (roomIsInvalid){
        return roomIsInvalid
    }
    if(category === "OFFICE"){
        var newRoom = Object.create(objects.Office);
        newRoom.setUp(name)
    }else{
        var newRoom = Object.create(objects.LivingSpace);
        newRoom.setUp(name)
    }
    this.rooms.push(newRoom)
    return (`Successfully created ${category} ${name}.`)
},

checkRoomInvalid: function(name, category){
    if (!["OFFICE", "LIVING"].includes(category)){
        return "The specified room category doesn't exist!"
    }
    if (!/^[A-Za-z]+$/.test(name)){
        return "Invalid room name. Only alphabets allowed!";
    }
    var allNames = this.rooms.map(room => room.name);
    if (allNames.includes(name)){
        return "A room with the same name already exists";
    }
    
},

printRoom: function(roomName){
    roomName = this.toTitleCase(roomName);
    var room = this.rooms.find(room => room.name === roomName);
    if (room == undefined){
        return `There is no room with the name '${roomName}'`;
    }
    var occupants = room.occupants.map(occupant => occupant.name);
    var output = `Room Name:    ${room.name}\n`;
    var len = occupants.length;
    if (len === 0){
        return `${roomName} is currently unoccupied`
    }
    for(var count = 0; count < len; count++){
        output += (occupants[count] + "\n");
    }
    return output
},
printAllocations: function(filename=undefined){
    var headingOffice = "\nALLOCATIONS - OFFICES\n"
    var subheading = "\nROOM NAME \t\tROLE"
    var headingLivingspace = "\nALLOCATIONS - LIVING SPACES\n"
    var officesString = ""
    var livingString = ""
    var officeWithOccupants = this.rooms.filter(
        office => (office.category == "Office" && office.capacity < 6));
    for (let office of officeWithOccupants){
        officesString += (`${office.name}\n=============================\n`) + 
        (office.occupants.map(occupant =>
        `${occupant.name}\t\t${occupant.category}`)).join("\n");
    }
    var livingWithOccupants = this.rooms.filter(
        living => (living.category == "Living Space" && living.capacity < 4));
    for (let living of livingWithOccupants){
        livingString += (`${living.name}\n=============================\n`) + 
        (living.occupants.map(occupant =>
        `${occupant.name}\t\t${occupant.category}`)).join("\n");
    }

    var output = (`${headingOffice}\n${subheading}\n${officesString}\n
        ${headingLivingspace}\n${subheading}\n${livingString}`);
    if (filename===undefined){
        console.log(output);
        return "...complete";
    }
    fs.writeFile(filename, output);
    console.log(`Successfully saved the information in ${filename}`);
    
},

printUnallocated: function(filename=undefined){
    var headingOffice = "\nUNALLOCATED - OFFICES"
    var headingLivingspace = "\nUNALLOCATED - LIVING SPACES"
    var subHeading = "\nPERSON NAME\t\tROLE\n"
    var unallocatedOffice = this.persons.filter(
        person => person.office === "Unallocated").map(
            person => `${person.name}\t\t${person.category}\n`
        ).join("\n")
    var unallocatedAccomodation = this.persons.filter(
        person => person.accomodation === "Unallocated").map(
            person => `${person.name}\t\t${person.category}\n`
        ).join("\n")
    var output = (`${headingOffice}${subHeading}${unallocatedOffice}
        ${headingLivingspace}${subHeading}${unallocatedAccomodation}`)
    if (filename===undefined){
        console.log(output);
        return "...complete";
    }else{
        fs.writeFile(filename, output);
        console.log(`Successfully saved the information in ${filename}`);
    }
},

reallocate: function(idno, roomName){
    roomName = this.toTitleCase(roomName);
    var person = this.persons.find(person => person.idno === idno);
    if (person === undefined){
        return "You have entered an invalid of non-existent idno";
    }
    var room = this.rooms.find(room => room.name === roomName);
    if (room === undefined){
        return "You have entered a non-existing room";
    }
    if (room.capacity === 0){
        return `${room.name} is currently full`;
    }
    if (person.accomodation == room ||person.office == room){
        return "You are trying to rellocate a person to his current room";
    }
    if (room.category === "Living Space" && person.category === "Staff"){
        return "Invalid request. Staff do not have accomodation";
    }
    if (room.category === "Office"){
        var current = person.office;
        person.office = room;
        room.occupants.push(person);
        if (current !== "Unallocated"){
            var occ = current.occupants;
            occ.splice(occ.indexOf(person), 1)
        }

    }else{
        var current = person.accomodation;
        person.accomodation = room;
        room.occupants.push(person);
        if (current !== "Unallocated"){
            var occ = current.occupants;
            occ.splice(occ.indexOf(person), 1)
        }
    return `Successfully rellocated ${person.name} to room ${roomName};`
    }

}
    
} 

module.exports = dojo