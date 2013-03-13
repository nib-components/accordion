var Accordion = component('accordion');

describe('Accordion', function(){

  beforeEach(function(){
    var el = $('<div>');
    var trigger = $('<div class="js-accordion-trigger" />');
    var body = $('<div class="js-accordion-body" />');
    el.append(trigger).append(body);

    this.view = new Accordion({
      el: el
    });
  });

  it('should have a trigger', function(){
    expect(this.view.button.length).to.equal(1);
  });

  it('should have a body', function(){
    expect(this.view.body.length).to.equal(1);
  });

  it('should be closed by default if there is no class present', function(){
    expect(this.view.isOpen).to.equal(false);
  });

  it('should be open by default if the open class is present', function(){
    var el = $('<div class="is-open">');
    var body = $('<div class="js-accordion-body" />');
    body.appendTo(el);
    var view = new Accordion({ el: el });
    expect(view.isOpen).to.equal(true);
  });

  it('should be closed by default if the closed class is present', function(){
    var el = $('<div class="is-closed">');
    var view = new Accordion({ el: el });
    expect(view.isOpen).to.equal(false);
  });

  it('should toggle when clicking the trigger', function(){
    var stub = sinon.stub(this.view, 'toggle');
    this.view.el.find('.js-accordion-trigger').click();
    expect(stub.called).to.equal(true);
  });

  it('should open', function(){
    this.view.open(); 
    expect(this.view.button.hasClass('is-open')).to.equal(true);
    expect(this.view.el.hasClass('is-open')).to.equal(true);
    expect(this.view.button.hasClass('is-closed')).to.equal(false);
    expect(this.view.el.hasClass('is-closed')).to.equal(false);
  });

  it('should close', function(done){
    this.view.once('close', function(){
      expect(this.view.button.hasClass('is-open')).to.equal(false);
      expect(this.view.el.hasClass('is-open')).to.equal(false);
      expect(this.view.button.hasClass('is-closed')).to.equal(true);
      expect(this.view.el.hasClass('is-closed')).to.equal(true);  
      done();    
    }, this);
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