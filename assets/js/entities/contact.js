ContactManager.module('Entities', function(Entities, ContactManager, Backbone, Marionette, $, _){
  Entities.Contact = Backbone.Model.extend({
    urlRoot: "contacts",
    
    defaults: {
      first_name: '',
      last_name: '',
      phone_number: ''
    },
    
    validate: function(attrs, options) {
      var errors = {}
      if (! attrs.first_name) {
        errors.first_name = "can't be blank";
      }
      if (! attrs.last_name) {
        errors.last_name = "can't be blank";
      }
      else{
        if (attrs.last_name.length < 2) {
          errors.last_name = "is too short";
        }
      }
      if( ! _.isEmpty(errors)){
        return errors;
      }
    }
  });
  
  Entities.configureStorage(Entities.Contact);

  Entities.ContactCollection = Backbone.Collection.extend({
    url: "contacts",
    model: Entities.Contact,
    comparator: "first_name"
  });
  
  Entities.configureStorage(Entities.ContactCollection);
  
  var initializeContacts = function(){
    var contacts = new Entities.ContactCollection([
      { id: 1, first_name: 'Alice', last_name: 'Arten', phone_number: '555-0184' },
      { id: 2, first_name: 'Bob', last_name: 'Brigham', phone_number: '555-0163' },
      { id: 3, first_name: 'Charlie', last_name: 'Campbell', phone_number: '555-0129' }
    ]);
    contacts.forEach(function(contact){
      contact.save();
    });
    return contacts.models;
  };
  
  var API = {
    getContactEntities: function(){
      var contacts = new Entities.ContactCollection();
      var defer = $.Deferred();
      contacts.fetch({
        success: function(data){
          defer.resolve(data);
        }
      });
      var promise = defer.promise();
      $.when(promise).done(function(contacts){
        if(contacts.length === 0){
          // if we don't have any contacts yet, create some for convenience
          var models = initializeContacts();
          contacts.reset(models);
        }
      });
      return promise;
    },

    getContactEntity: function(contactId){
      var contact = new Entities.Contact({id: contactId});
      var defer = $.Deferred();
      setTimeout(function(){
        contact.fetch({
          success: function(data){
            defer.resolve(data);
          },
          error: function(data){
            defer.resolve(undefined);
          }
        });
      }, 2000);
      return defer.promise();
    }
  };
  
  ContactManager.reqres.setHandler("contact:entities", function(){
    return API.getContactEntities();
  });
  
  ContactManager.reqres.setHandler("contact:entity", function(id){
    return API.getContactEntity(id);
  });
});