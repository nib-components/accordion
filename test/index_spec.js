var expect = require('chai').expect;
var Accordion = require('..');

function createAccordionElement() {

  var trigger = document.createElement('div');
  trigger.className = 'js-accordion-trigger';

  var body = document.createElement('div');
  body.className = 'js-accordion-body';

  var el = document.createElement('div');
  el.appendChild(trigger);
  el.appendChild(body);

  return el;
}

describe('Accordion', function(){

  beforeEach(function(){

    this.view = new Accordion({
      el: createAccordionElement()
    });

  });

  it('should have a trigger', function(){
    expect(this.view.trigger).not.to.be.null;
  });

  it('should have a body', function(){
    expect(this.view.body.length).not.to.be.null;
  });

  it('should be closed by default if there is no class present', function(){
    expect(this.view.isOpen).to.equal(false);
  });

  it('should be open by default if the open class is present', function(){

    var el = createAccordionElement();
    el.className = 'is-open';

    var view = new Accordion({ el: el });
    expect(view.isOpen).to.equal(true);
  });

  it('should be closed by default if the closed class is present', function(){

    var el = createAccordionElement();
    el.className = 'is-closed';

    var view = new Accordion({ el: el });
    expect(view.isOpen).to.equal(false);
  });

  it('should toggle when clicking the trigger', function(){
    expect(this.view.isOpen).to.equal(false);
    this.view.el.querySelector('.js-accordion-trigger').click();
    expect(this.view.isOpen).to.equal(true);
  });

  it('should not toggle when clicking the trigger and the accordion is disabled', function(){
    expect(this.view.isOpen).to.equal(false);
    this.view.disabled(true);
    this.view.el.querySelector('.js-accordion-trigger').click();
    expect(this.view.isOpen).to.equal(false);
  });

  it('should open', function(){
    this.view.open(); 
    expect(this.view.trigger.classList.contains('is-open')).to.equal(true);
    expect(this.view.el.classList.contains('is-open')).to.equal(true);
    expect(this.view.trigger.classList.contains('is-closed')).to.equal(false);
    expect(this.view.el.classList.contains('is-closed')).to.equal(false);
  });

  it('should close', function(done){
    var self = this;
    this.view.once('close', function(){
      expect(self.view.trigger.classList.contains('is-open')).to.equal(false);
      expect(self.view.el.classList.contains('is-open')).to.equal(false);
      expect(self.view.trigger.classList.contains('is-closed')).to.equal(true);
      expect(self.view.el.classList.contains('is-closed')).to.equal(true);
      done();    
    });
    this.view.close();
  });

  it('should toggle the state', function(){
    expect(this.view.isOpen).to.equal(false);
    this.view.toggle();
    expect(this.view.isOpen).to.equal(true);
    this.view.toggle();
    expect(this.view.isOpen).to.equal(false);
  });

});