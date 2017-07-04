joint.shapes.basic.DecoratedRect = joint.shapes.basic.Generic.extend({
    
    markup: '<g class="rotatable"><g class="scalable"><rect/></g><image pointer-events="none"/><text/>' +
    '<g class="inPorts"><g class="port1"><circle/></g><g class="port2"><circle/></g><g class="port3"><circle/></g><g class="port4"><circle/></g></g></g>',
     
   defaults: joint.util.deepSupplement({
       type: 'basic.DecoratedRect',
       attrs: {
           '.': { magnet: false },
           rect:{width:96,height:96 ,fill:"transparent", x:0 , y:0 },
           circle: {
               r: 4,
               magnet: true,
               stroke: 'none'
           },
           text : { 
               'font-size': 12,
               ref: 'rect',
               'ref-y': .5,
               'ref-x': .5,
               y:'46',
               fill: 'black',
               'font-family': 'Arial, helvetica, sans-serif',
               'y-alignment': 'middle', 
               'x-alignment': 'middle'
           },
           'image': { 'ref-x': 1, 'ref-y': 1, ref: 'rect', width: 96, height: 96 },
           '.label': { text: 'Model', dx: 5, dy: 5 },
           '.inPorts circle': { fill: '#607D8B' , visibility:"hidden"},
           '.port1 circle': {cx: 0 , cy:48},
           '.port2 circle': {cx: 48 , cy:0},
           '.port3 circle': {cx: 96 , cy:48},
           '.port4 circle': {cx: 48 , cy:96}
       }
   }, joint.shapes.basic.Generic.prototype.defaults)
});
 