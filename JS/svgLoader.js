var s = Snap('#svg'), circles = [],
bg = s.rect(0, 0, 800, 200);

bg.attr({
'fill': '#fff'
});

var circleGroup = s.group(bg);

// create 200 circles
for(var i=0; i<400; i++) {
var size = Math.random()*5 + 3,
  cx = Math.random()*800,
  cy = Math.random()*200,
  opacity = Math.random(),
  fill = '#9d77da',
  counter = Math.random()*360;
  circ = s.circle(cx, cy, size);
circ.attr({
'fill': fill,
'fill-opacity': opacity
});
circ.data('xOffset', cx); 
circ.data('cx', cx);
circ.data('yOffset', cy); 
circ.data('cy', cy);
circ.data('counter', counter); 
circles.push(circ);
circleGroup.add(circ);

}

state_name = localStorage.getItem("userRegion").toUpperCase()
var increase = Math.PI * 2 /80,
text = s.text(70, 120, state_name);



circleGroup.attr({
mask: text
});

function draw() {
for(var i=0, l=circles.length; i<l; i++) {
var circ = circles[i];

if(circ.data('cy') < 0) {
  circ.data('cy', 200);
} else {
  circ.data('cy', (circ.data('cy')-2));
}
circ.data('cx', (circ.data('xOffset') + (50*(Math.sin( circ.data('counter')) / 5))));
circ.attr({
  cx: circ.data('cx'),
  cy: circ.data('cy')
});

circ.data('counter',      circ.data('counter')+increase);
}  

}

function animate() {
draw();
window.requestAnimationFrame(animate);
}

animate();  var s = Snap('#svg'), circles = [],
bg = s.rect(0, 0, 800, 200);

bg.attr({
'fill': '#fff'
});

var circleGroup = s.group(bg);

// create 200 circles
for(var i=0; i<400; i++) {
var size = Math.random()*5 + 3,
  cx = Math.random()*800,
  cy = Math.random()*200,
  opacity = Math.random(),
  fill = '#9d77da',
  counter = Math.random()*360;
  circ = s.circle(cx, cy, size);
circ.attr({
'fill': fill,
'fill-opacity': opacity
});
circ.data('xOffset', cx); 
circ.data('cx', cx);
circ.data('yOffset', cy); 
circ.data('cy', cy);
circ.data('counter', counter); 
circles.push(circ);
circleGroup.add(circ);

}
state_name = localStorage.getItem("userRegion").toUpperCase()
var increase = Math.PI * 2 /80,
text = s.text(70, 120, state_name);



circleGroup.attr({
mask: text
});

function draw() {
for(var i=0, l=circles.length; i<l; i++) {
var circ = circles[i];

if(circ.data('cy') < 0) {
  circ.data('cy', 200);
} else {
  circ.data('cy', (circ.data('cy')-2));
}
circ.data('cx', (circ.data('xOffset') + (50*(Math.sin( circ.data('counter')) / 5))));
circ.attr({
  cx: circ.data('cx'),
  cy: circ.data('cy')
});

circ.data('counter',      circ.data('counter')+increase);
}  

}

function animate() {
draw();
window.requestAnimationFrame(animate);
}

animate();