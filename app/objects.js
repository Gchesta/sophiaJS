
const LivingSpace = {
    setUp: function(name){
        this.name = name;
        this.capacity = 6;
        this.category = "Living Space";
        this.occupants = [];
    }
};

const Office = {
    setUp: function(name){
        this.name = name;
        this.capacity = 4;
        this.category = "Office";
        this.occupants = [];
    }
};

const Staff = {
    setUp: function(name, idno){
        this.name = name;
        this.idno = idno;
        this.office = "Unallocated";
        this.category = "Staff";
                
    }
};

const Fellow = {
    setUp: function(name, idno, accomodation="N"){
        this.name = name;
        this.idno = idno;
        this.office = "Unallocated";
        this.accomodation = accomodation === "Y"? "Unallocated":""
        this.category = "Fellow";
        
    }
};

module.exports = {LivingSpace, Office, Staff, Fellow}