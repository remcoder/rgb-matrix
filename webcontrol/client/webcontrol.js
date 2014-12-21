Template.main.helpers({
    matrix : function() {
	   return Matrix.findOne('42');
    },

    arduino : function() {
	   return Arduinos.findOne();
    }
});

