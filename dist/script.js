var canvas, ctx, w, h;
canvas = document.createElement('canvas');
document.body.appendChild( canvas );
document.body.style.margin = '0px';
document.body.style.padding = '0px';
document.body.style.overflow = 'hidden';
document.body.style.backgroundColor = '#000';
ctx = canvas.getContext('2d');

var part, samples;
document.body.onresize = function() {
	w = canvas.width = innerWidth;
	h = canvas.height = innerHeight;
	part = {
		dist: 0,
		a: 0,
		av: Math.PI/64,
		color: '#ff0',
		r: Math.min(w,h)/15,
		childs: [],
		//childs: [{dist:50,a:0,r:20,av:Math.PI/64}],
	};
	samples = 20;
	while(samples>0)
		gen(part, part.r);
	part.tpos = [w/2, h/2];
	part.ta = part.a;
	clearInterval(loopId);
	loopId = setInterval(loop, 16);
};
var loopId;
var light = [0,0];
function loop() {
	ctx.fillStyle = 'rgba(0,0,0,0.001)';
	ctx.fillRect(0,0,w,h);
	processPart(part);
}

function gen(part, size) {
	if(samples<=0)
		return;
	if(Math.random()<0.6 && part.childs.length > 0)
		gen(part.childs[(Math.random()*part.childs.length)>>0], size/4)
	else {
		--samples;
		part.childs.push({
			dist: size*2 + size*Math.random()*4,
			a: Math.random() * Math.PI * 2,
			av: Math.PI*2*(Math.random()-0.5)/size/size,
			r: size/3 + size/4*Math.random(),
			childs: [],
			color: 'hsl('+((Math.random()*360)>>0)+',100%,50%)',
		});
	}
}
function processPart(part) {
	ctx.beginPath();
	var la = Math.atan2(part.tpos[1]-light[1], part.tpos[0]-light[0]) - Math.PI/2;
	//ctx.arc(part.tpos[0], part.tpos[1], part.r, 0,Math.PI*2, 0);
	ctx.arc(part.tpos[0], part.tpos[1], 1, 0,Math.PI*2, 0);
	ctx.fillStyle = part.color;
	ctx.shadowBlur = 0;
	ctx.fill();
	/*ctx.beginPath();
	ctx.fillStyle = 'rgba(0,0,0, 0.8)';
	ctx.shadowBlur = 15;
	ctx.shadowColor = '#000';
	ctx.arc(part.tpos[0], part.tpos[1], part.r, 0+la,Math.PI+la, 0);
	ctx.fill();*/
	for(var i=0; i<part.childs.length; ++i) {
		var t = part.childs[i];
		t.ta = part.ta + t.a;
		t.tpos = [
			part.tpos[0] + Math.cos(t.ta)*t.dist,
			part.tpos[1] + Math.sin(t.ta)*t.dist
		];
		processPart(t);
		t.a += t.av || 0;
	}
}

document.body.onresize();