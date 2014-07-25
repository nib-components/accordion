var emitter = require('emitter');
var transition = require('transition-auto');

var Accordion = function(options){
  this.el = options.el;
  this.button = this.el.querySelector(this.buttonElement);
  this.body = this.el.querySelector(this.bodyElement);
  this.id = this.el.getAttribute('data-accordion-id');

  this.button.addEventListener('click', this._onTriggerClick.bind(this));

  // --- add an `is-transitioning class` for the backend devs to wait ---

  var self = this;

  function transitionStarted() {
    self.el.classList.add('is-transitioning');
  }

  function transitionFinished() {
    self.el.classList.remove('is-transitioning');
  }

  this
    .on('open', transitionStarted)
    .on('close', transitionStarted)
    .on('opened', transitionFinished)
    .on('closed', transitionFinished)
  ;

  // --- set the initial state ---

  if (this.el.classList.contains(this.openClass)) {
    this.open();
  } else {
    this.close();
  }

};

Accordion.create = function(selector, options) {
  var items = [];
  var options = options || {};

  var parent    = options.context ? options.context : document;
  var elements  = Array.prototype.slice.call(parent.querySelectorAll(selector), 0);

  elements.forEach(function(element){
    if(element.hasAttribute('data-accordion-loaded') === false) {
      var accordion = new Accordion({ el: element });
      element.setAttribute('data-accordion-loaded', true);
      items.push(accordion);
      if(options.afterEach) {
        options.afterEach.call(this, accordion);
      }
    }
  });
  return items;
};

Accordion.prototype = {

  openClass:      'is-open',
  closedClass:    'is-closed',
  buttonElement:  '.js-trigger, .js-accordion-trigger', //needs to be the immediate child otherwise nested accordians won't work - #querySelector() should handle this by only selecting the first element
  bodyElement:    '.js-body, .js-accordion-body',       //needs to be the immediate child otherwise nested accordians won't work - #querySelector() should handle this by only selecting the first element
  isOpen: false,

  open: function(){
    var self    = this;
    this.isOpen = true;

    this.el.classList.add(this.openClass)
    this.el.classList.remove(this.closedClass);
    this.button.classList.add(this.openClass);
    this.button.classList.remove(this.closedClass);

    self.emit('open');

    transition(this.body, 'height', 'auto', function() {
      if(self.isOpen) {
        self.emit('opened');
      }
    });

  },

  close: function(){
    var self    = this;
    this.isOpen = false;

    this.el.classList.add(this.closedClass)
    this.el.classList.remove(this.openClass);
    this.button.classList.add(this.closedClass);
    this.button.classList.remove(this.openClass);

    self.emit('close');

    transition(this.body, 'height', 0, function() {
      if(!self.isOpen) {
        self.emit('closed');
      }
    });

  },

  _onTriggerClick: function(event) {
    event.preventDefault();
    this.toggle();
  },

  toggle: function(){
    if(this.isOpen === true) {
      this.close();
    }
    else {
      this.open();
    }
    this.emit('toggle', this.id);
  }

};

emitter(Accordion.prototype);

module.exports = Accordion;