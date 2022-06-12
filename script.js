var amount = 500;
var gravityConstant = 0.05;
var sf = 1;
var objects = [];
var lockedX;
var lockedY;
var offsetX = 0;
var offsetY = 0;

var findPoint = function(x, y, angle, magnitude) {
  var k = magnitude*cos(angle);
  var r = magnitude*sin(angle);
  var a = x + k;
  var b = y + r;
  return [a, b];
};

var findAngle = function(x1, y1, x2, y2) {
  var h = x2-x1;
  var k = y2-y1;
  return atan2(k, h);
};

var getDistance = function(x1, y1, x2, y2) {
  var dx = x2-x1;
  var dy = y2-y1;
  var a = dx*dx;
  var b = dy*dy;
  return [sqrt(a+b), dx, dy];
};

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  for (var a = 0; a < amount; a++) {
    objects.push([random(-windowHeight, windowHeight*2), random(-windowHeight, windowHeight*2), random(-3, 3), random(-3, 3), random(5, 20)]);
  }
}

function draw() {
  background(0);
  text("FPS: " + frameRate(), 0, 20);
  text("Objects: " + objects.length, 0, 10);
  translate(width/2+offsetX, height/2+offsetY);
  scale(sf);
  fill(255)
  for (var b = objects.length-1; b >= 0; b--) {
    ellipse(objects[b][0], objects[b][1], objects[b][4]/4, objects[b][4]/4);
    for (var c = objects.length-1; c >= 0; c--) {
      if (b != c) {
        var magnitude = getDistance(objects[b][0], objects[b][1], objects[c][0], objects[c][1]);
        var angle = findAngle(objects[b][0], objects[b][1], objects[c][0], objects[c][1]);
        var dstsq = constrain(magnitude[0]*magnitude[0], 10, 1000);
        magnitude[0] = (gravityConstant*(objects[b][4]*objects[c][4]))/dstsq;
        var targetPoint = findPoint(objects[b][0], objects[b][1], angle, magnitude[0]);
        var finalVelocity = getDistance(objects[b][0], objects[b][1], targetPoint[0], targetPoint[1]);
        objects[b][2] += finalVelocity[1]/objects[b][4];
        objects[b][3] += finalVelocity[2]/objects[b][4];
        var dist = getDistance(objects[b][0], objects[b][1], objects[c][0], objects[c][1]);
        var m = max(objects[b][4], objects[c][4]);
        if (dist[0] < (objects[b][4]/8)+(objects[c][4]/8)) {
          if (m == objects[b][4]) {
            objects[b][4] += objects[c][4]/5;
            var index = objects.indexOf(objects[c]);
	    if (objects[c][4] > 20) {
  	      for (var k = 0; k < 10; k++) {
    	        objects.push([objects[b][0] + objects[b][4]/4, objects[b][1] + objects[b][4]/4, objects[c][2]*-1 + random(-5, 5), objects[c][3]*-1 + random(-5, 5), objects[c][4]/10]);
  	      }
	    }
            objects.splice(index, 1);
            if (b > 0) {
              b -= 1;
            }
          } else if (m == objects[c][4]) {
            objects[c][4] += objects[b][4]/5;
            var index = objects.indexOf(objects[b]);
	    if (objects[b][4] > 20) {
  	      for (var k = 0; k < 10; k++) {
    	        objects.push([objects[c][0] + objects[c][4]/4, objects[c][1] + objects[c][4]/4, objects[b][2]*-1 + random(-5, 5), objects[b][3]*-1 + random(-5, 5), objects[b][4]/10]);
  	      }
	    }
            objects.splice(index, 1);
            if (b > 0) {
              b -= 1;
            }
          }
        }
      }
    }
  }
  for (var i = 0; i < objects.length; i++) {
    noStroke();
    objects[i][0] += objects[i][2];
    objects[i][1] += objects[i][3];
  }
}

window.addEventListener("wheel", function(e) {
  if (e.deltaY < 0)
    sf *= 1.05;
  else
    sf *= 0.95;
});

function mousePressed() {
  lockedX = mouseX - offsetX;
  lockedY = mouseY - offsetY;
}

function mouseDragged() {
  offsetX = mouseX - lockedX;
  offsetY = mouseY - lockedY;
}
