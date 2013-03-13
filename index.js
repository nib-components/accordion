var utils = require('utils');
var events = require('events');
var hasTransitions = utils.hasTransitions();

var Accordion = function(options){
  this.el = options.el;
  this.button = this.el.find(this.buttonElement);
  this.body = this.el.find(this.bodyElement);
  this.id = this.el.attr('data-accordion-id');

  this.el.on('click', this.buttonElement, _.bind(this._onTriggerClick, this));

  // Set the initial state
  if( this.el.hasClass(this.openClass) ) {
    this.open();
  }
  else {
    this.close();
  }
};

Accordion.create = function(selector, context) {
  var items = [];
  $(selector, context).each(function(){
    if(this.hasAttribute('data-accordion-loaded') === false) {
      var accordion = new Accordion({ el: $(this) });
      this.setAttribute('data-accordion-loaded', true);
      items.push(accordion);
    }
  });
  return items;
};

_.extend(Accordion.prototype, events, {
  openClass: 'is-open',
  closedClass: 'is-closed',
  buttonElement: '> .js-accordion-trigger',
  bodyElement: '> .js-accordion-body',
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
    utils.afterTransition(bodyEl, function(){
      if( self.isOpen ) {
        bodyEl.addClass('no-transitions').css('height', 'auto');
      }
    });

    if( hasTransitions ) {
      var bodyHeight = bodyEl[0].scrollHeight;
      this.body.css('height', bodyHeight);      
    }

    this.el.addClass(this.openClass).removeClass(this.closedClass);
    this.button.addClass(this.openClass).removeClass(this.closedClass);
  },
  close: function(){
    var self = this;
    this.isOpen = false;

    // We need to set the height of the body to a fixed pixel dimension
    // instead of auto as browsers can't transition from auto.
    var bodyHeight = this.body.height();

    if( hasTransitions ) {
      this.body.css('height', bodyHeight);
    }

    // We wait until the end of the callstack to perform the transition
    // so that it actually happens. If we don't do this the accordion
    // will just close immediately.
    setTimeout(function(){
      self.el.addClass(self.closedClass).removeClass(self.openClass);

      if( hasTransitions ) {
        self.body.removeClass('no-transitions');

        // Setting a tiny timeout so that Firefox correctly
        // applies the transition properties onto the element again
        setTimeout(function(){
          self.body.css('height', 0);
        }, 50);
      }

      self.trigger('close');
    }, 0);

    this.button.addClass(this.closedClass).removeClass(this.openClass);
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
    this.trigger('toggle', this.id);
  }
});

module.exports = Accordion;