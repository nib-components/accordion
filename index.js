var emitter = require('emitter');
var transition = require('transition-auto');

var Accordion = function(options){
  this.el         = options.el;
  this.id         = this.el.getAttribute('data-accordion-id');
  this.trigger    = this.el.querySelector(this.triggerElement);
  this.body       = this.el.querySelector(this.bodyElement);
  this._disabled  = false;

  if (this.trigger) {
    this.trigger.addEventListener('click', this._onTriggerClick.bind(this));
  }

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
  var elements  = parent.querySelectorAll(selector);

  for (var i=0; i<elements.length; ++i) {

    var element = elements[i];

    if(element.hasAttribute('data-accordion-loaded') === false) {
      var accordion = new Accordion({ el: element });
      element.setAttribute('data-accordion-loaded', true);
      items.push(accordion);
      if(options.afterEach) {
        options.afterEach.call(this, accordion);
      }
    }

  }

  return items;
};

Accordion.prototype = {

  openClass:      'is-open',
  closedClass:    'is-closed',
  triggerElement:  '.js-trigger, .js-accordion-trigger', //needs to be the immediate child otherwise nested accordians won't work - #querySelector() should handle this by only selecting the first element
  bodyElement:    '.js-body, .js-accordion-body',       //needs to be the immediate child otherwise nested accordians won't work - #querySelector() should handle this by only selecting the first element
  isOpen: false,


  /**
   * Get whether the accordion is disabled
   * @signature `accordion.disabled()`
   * @returns   {Boolean}
   *
   * Set whether the accordion is disabled
   * @signature `accordion.disabled(disabled)`
   * @param     {Boolean} disabled
   * @returns   {Accordion}
   */
  disabled: function() {
    if (arguments.length === 0) {
      return this._disabled;
    } else {
      this._disabled = arguments[0];
      return this;
    }
  },

  open: function(){
    var self       = this;
    var isChanging = (this.isOpen != true);
    this.isOpen    = true;

    this.el.classList.add(this.openClass)
    this.el.classList.remove(this.closedClass);

    if (this.trigger) {
      this.trigger.classList.add(this.openClass);
      this.trigger.classList.remove(this.closedClass);
    }

    self.emit('open', isChanging);

    transition(this.body, 'height', 'auto', function() {
      if(self.isOpen) {
        self.emit('opened', isChanging);
      }
    });

  },

  close: function(){
    var self       = this;
    var isChanging = (this.isOpen != false);
    this.isOpen    = false;

    this.el.classList.add(this.closedClass)
    this.el.classList.remove(this.openClass);

    if (this.trigger) {
      this.trigger.classList.add(this.closedClass);
      this.trigger.classList.remove(this.openClass);
    }

    self.emit('close', isChanging);

    transition(this.body, 'height', 0, function() {
      if(!self.isOpen) {
        self.emit('closed', isChanging);
      }
    });

  },

  _onTriggerClick: function(event) {
    event.preventDefault();
    if (!this.disabled()) {
      this.toggle();
    }
  },

  toggle: function(){
    if(this.isOpen === true) {
      this.close();
    } else {
      this.open();
    }
    this.emit('toggle', this.id);
  }

};

emitter(Accordion.prototype);

module.exports = Accordion;