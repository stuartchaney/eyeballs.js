var o_O = function(callback){
  
  var class_methods, instance_methods, initializer_methods;
  var validates_presence_of, validates_length_of;
  
  class_methods = {
    validations: {presence: [], lengthliness: []},
    methods: {},
    validates_presence_of: function(field){
      this.validations.presence.push({field: field});
    },
    validates_length_of: function(field, options){
      options.field = field;
      this.validations.lengthliness.push(options);
    }
  }
  
  var config = callback(class_methods);
  
  instance_methods = {
    save: function(){
      if(this.valid())
      {
        return true;
      }
      else
      {
        return false;
      }
    },
    update_attributes: function(attributes){
      for(var attribute in attributes)
      {
        this[attribute] = attributes[attribute];
      }
      return this.save();
    },
    valid: function(){
      this.errors = [];
      // validates_presence_of
      for(i = 0; i < this.validations.presence.length; i++)
      {
        var field = this.validations.presence[i].field;
        if(this[field] == '' || this[field] == null)
        {
          var message = field + ' should be present';
          this.errors.push({field: field, type: 'presence', message: message})
        }
      }
      // validates_length_of
      for(i = 0; i < this.validations.lengthliness.length; i++)
      {
        var field = this.validations.lengthliness[i].field;
        var max = this.validations.lengthliness[i].max
        var min = this.validations.lengthliness[i].min
        if(this[field])
        {
          if(max && this[field].length > max)
          {
            var message = field + ' should be less than ' + max + ' characters';
            this.errors.push({field: field, type: 'length', message: message});
          }
          if(min && this[field].length < min)
          {
            var message = field + ' should be greater than ' + min + ' characters';
            this.errors.push({field: field, type: 'length', message: message});
          }
        }
      }
    },
    errors: [],
    validations: class_methods.validations
  }
  for(method in class_methods.methods)
  {
    instance_methods[method] = class_methods.methods[method]
  }
  
  initializer_methods = {
    initialize: function(attributes){
      if(!attributes) { var attributes = {}; };
      for ( var method in instance_methods ) {
        attributes[method] = instance_methods[method];
      }
      attributes['id'] = o_O.uuid();
      return attributes;
    },
    find: function(id){
      var object = {};
      template = $('[data-id=' + id + ']');
      return this.initialize(o_O.find_attributes(template, function(field){
        return field.text();
      }));
    }
  }
  
  return initializer_methods;
}

o_O.find_attributes = function(template, callback){
  var object = {};
  for(i = 0; i<template.find('[data-attribute]').length; i++)
  {
    field = $(template.find('[data-attribute]')[i]);
    object[field.attr('data-attribute')] = callback(field);
  }
  return object;
}

o_O.form = {
  attributes: function(form){
    return o_O.find_attributes(form, function(field){
      return field.val();
    })
  }
}

o_O.templates = {}

o_O.get_template = function(template, callback){
  if(o_O.templates[template])
  {
    callback(o_O.templates[template]);
  }
  else
  {
    $.get('views/' + template + '.html.mustache', function(response){
      o_O.templates[template] = response;
      callback(response);
    });
  }
}

o_O._uuid_default_prefix = '';

o_O._uuidlet = function () {
  return(((1+Math.random())*0x10000)|0).toString(16).substring(1);
};

o_O.uuid = function (p) {
  if (typeof(p) == 'object' && typeof(p.prefix) == 'string') {
    o_O._uuid_default_prefix = p.prefix;
  } else {
    p = p || o_O._uuid_default_prefix || '';
    return(p+o_O._uuidlet()+o_O._uuidlet()+"-"+o_O._uuidlet()+"-"+o_O._uuidlet()+"-"+o_O._uuidlet()+"-"+o_O._uuidlet()+o_O._uuidlet()+o_O._uuidlet());
  };
};