var expect = require('chai').expect;
var Accordion = require('accordion');

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
    expect(this.view.button).not.to.be.null;
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
    var stub = sinon.stub(this.view, 'toggle');
    this.view.el.querySelector('.js-accordion-trigger').click();
    expect(stub.called).to.equal(true);
  });

  it('should open', function(){
    this.view.open(); 
    expect(this.view.button.classList.contains('is-open')).to.equal(true);
    expect(this.view.el.classList.contains('is-open')).to.equal(true);
    expect(this.view.button.classList.contains('is-closed')).to.equal(false);
    expect(this.view.el.classList.contains('is-closed')).to.equal(false);
  });

  it('should close', function(done){
    var self = this;
    this.view.once('close', function(){
      console.log(self.view.button);
      expect(self.view.button.classList.contains('is-open')).to.equal(false);
      expect(self.view.el.classList.contains('is-open')).to.equal(false);
      expect(self.view.button.classList.contains('is-closed')).to.equal(true);
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