/**
 * Models
 */
 
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var DocumentSchema = new Schema({
    _id				 : String
  , title     		 : String
  , description      : String
  , image            : String
});

DocumentSchema.virtual('id').get(function() {
 return this._id.toHexString();
 });

exports.Document = function(db) {
  return db.model('Document', DocumentSchema);
};