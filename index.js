var emitter = require('emitter');
var hasTransitions = require('has-transitions');
var afterTransition = require('after-transition');

var Accordion = function(options){
  this.el = options.el;
  this.button = this.el.querySelector(this.buttonElement);
  this.body = this.el.querySelector(this.bodyElement);
  this.id = this.el.getAttribute('data-accordion-id');

  this.button.addEventListener('click', this._onTriggerClick.bind(this));

  // Set the initial state
  if( this.el.classList.contains(this.openClass) ) {
    this.open();
  }
  else {
    this.close();
  }

  // --- adding a is-transitioning class for the backend devs to test ---

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
  openClass: 'is-open',
  closedClass: 'is-closed',
  buttonElement: '.js-accordion-trigger', //needs to be the immediate child - nested doesn't work
  bodyElement: '.js-accordion-body', //needs to be the immediate child - nested doesn't work
  isOpen: false,


  open: function(){
    var self = this;
    this.isOpen = true;
    var bodyEl = this.body;

    // We need to disable the transitions before setting the
    // height to auto so that the transition doesn't flicker
    // and start from the start again.
    // We set the height to auto after the transitions so that
    // the content inside of accordion can create more height.
    afterTransition(bodyEl, function(){
      if( self.isOpen ) {
        bodyEl.classList.add('no-transitions');
        bodyEl.style.height = 'auto';
        self.emit('opened');
      }
    });

    if( hasTransitions ) {
      var bodyHeight = bodyEl.scrollHeight;
      this.body.style.height = bodyHeight;
    }

    this.el.classList.add(this.openClass)
    this.el.classList.remove(this.closedClass);
    this.button.classList.add(this.openClass);
    this.button.classList.remove(this.closedClass);

    self.emit('open');
  },
  close: function(){
    var self = this;
    this.isOpen = false;

    // We need to set the height of the body to a fixed pixel dimension
    // instead of auto as browsers can't transition from auto.
    var bodyHeight = window.getComputedStyle(this.body).getPropertyValue('height');

    if( hasTransitions ) {
      this.body.style.height = bodyHeight;
    }

    // We wait until the end of the callstack to perform the transition
    // so that it actually happens. If we don't do this the accordion
    // will just close immediately.
    setTimeout(function(){
      self.el.classList.add(self.closedClass);
      self.el.classList.remove(self.openClass);

      if( hasTransitions ) {
        self.body.classList.remove('no-transitions');

        // Setting a tiny timeout so that Firefox correctly
        // applies the transition properties onto the element again
        setTimeout(function(){
          self.body.style.height = 0;
        }, 50);

        afterTransition(self.body, function(){
          if( !self.isOpen ) {
            self.emit('closed');
          }
        });
      }

      self.emit('close');
    }, 0);

    this.button.classList.add(this.closedClass);
    this.button.classList.remove(this.openClass);
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