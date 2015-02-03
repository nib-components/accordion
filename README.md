accordion
=========

Trigger show and hide of content.

Used in conjunction with [nib-styles/accordion](https://github.com/nib-styles/accordion) styles component.

    component install nib-components/accordion

##API

    var Accordion = require('accordion');
    
    Accordion.create('.js-accordion');
    
    // or
    
    Accordion.create('.js-accordion', { 
      context: document
    });

Example markup

    <div class="accordion is-closed js-accordion">
      <div class="accordion__trigger js-trigger">Click me</div>
      <div class="accordion__body js-body">
          Show and hide me
      </div>
    </div>

