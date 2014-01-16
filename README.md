accordion
=========

Trigger show and hide of content.

Used in conjunction with [nib-styles/accordion](https://github.com/nib-styles/accordion)

```component install nib-styles/accordion```

##API

```
var Accordion = require('accordion');

Accordion.create('.js-accordion');

// or

Accordion.create('.js-accordion', { 
  context: this.el 
});
```

```
<div class="accordion js-accordion">
  <div class="js-accordion-trigger">Click me</div>
  <div class="accordion__body js-accordion-body">
      Show and hide me
  </div>
</div>
```
