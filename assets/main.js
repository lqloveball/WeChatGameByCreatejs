(function (cjs, an) {

var p; // shortcut to reference prototypes
var lib={};var ss={};var img={};
lib.ssMetadata = [
		{name:"main_atlas_P_", frames: [[587,408,105,91],[563,0,404,67],[747,178,234,68],[694,408,78,96],[563,275,254,60],[0,322,492,67],[494,337,220,69],[716,337,220,69],[190,408,395,27],[563,178,182,95],[563,69,203,107],[768,69,182,107],[0,0,561,320],[819,248,121,57],[774,408,67,67],[0,391,188,60]]}
];


// symbols:



(lib.a_img_000001 = function() {
	this.spriteSheet = ss["main_atlas_P_"];
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.a_img_000002 = function() {
	this.spriteSheet = ss["main_atlas_P_"];
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.a_img_000003 = function() {
	this.spriteSheet = ss["main_atlas_P_"];
	this.gotoAndStop(2);
}).prototype = p = new cjs.Sprite();



(lib.a_img_000004 = function() {
	this.spriteSheet = ss["main_atlas_P_"];
	this.gotoAndStop(3);
}).prototype = p = new cjs.Sprite();



(lib.a_img_000005 = function() {
	this.spriteSheet = ss["main_atlas_P_"];
	this.gotoAndStop(4);
}).prototype = p = new cjs.Sprite();



(lib.a_img_000006 = function() {
	this.spriteSheet = ss["main_atlas_P_"];
	this.gotoAndStop(5);
}).prototype = p = new cjs.Sprite();



(lib.a_img_000007 = function() {
	this.spriteSheet = ss["main_atlas_P_"];
	this.gotoAndStop(6);
}).prototype = p = new cjs.Sprite();



(lib.a_img_000008 = function() {
	this.spriteSheet = ss["main_atlas_P_"];
	this.gotoAndStop(7);
}).prototype = p = new cjs.Sprite();



(lib.a_img_000009 = function() {
	this.spriteSheet = ss["main_atlas_P_"];
	this.gotoAndStop(8);
}).prototype = p = new cjs.Sprite();



(lib.a_img_000010 = function() {
	this.initialize(img.a_img_000010);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,1500,750);


(lib.a_img_000011 = function() {
	this.spriteSheet = ss["main_atlas_P_"];
	this.gotoAndStop(9);
}).prototype = p = new cjs.Sprite();



(lib.a_img_000012 = function() {
	this.spriteSheet = ss["main_atlas_P_"];
	this.gotoAndStop(10);
}).prototype = p = new cjs.Sprite();



(lib.a_img_000013 = function() {
	this.spriteSheet = ss["main_atlas_P_"];
	this.gotoAndStop(11);
}).prototype = p = new cjs.Sprite();



(lib.a_img_000014 = function() {
	this.spriteSheet = ss["main_atlas_P_"];
	this.gotoAndStop(12);
}).prototype = p = new cjs.Sprite();



(lib.a_img_000015 = function() {
	this.spriteSheet = ss["main_atlas_P_"];
	this.gotoAndStop(13);
}).prototype = p = new cjs.Sprite();



(lib.a_img_000016 = function() {
	this.spriteSheet = ss["main_atlas_P_"];
	this.gotoAndStop(14);
}).prototype = p = new cjs.Sprite();



(lib.a_img_000017 = function() {
	this.spriteSheet = ss["main_atlas_P_"];
	this.gotoAndStop(15);
}).prototype = p = new cjs.Sprite();
// helper functions:

function mc_symbol_clone() {
	var clone = this._cloneProps(new this.constructor(this.mode, this.startPosition, this.loop));
	clone.gotoAndStop(this.currentFrame);
	clone.paused = this.paused;
	clone.framerate = this.framerate;
	return clone;
}

function getMCSymbolPrototype(symbol, nominalBounds, frameBounds) {
	var prototype = cjs.extend(symbol, cjs.MovieClip);
	prototype.clone = mc_symbol_clone;
	prototype.nominalBounds = nominalBounds;
	prototype.frameBounds = frameBounds;
	return prototype;
	}


(lib.MainBg = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.a_img_000010();
	this.instance.parent = this;
	this.instance.setTransform(-750,0);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

}).prototype = getMCSymbolPrototype(lib.MainBg, new cjs.Rectangle(-750,0,1500,750), null);


(lib.a_mc_000023 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.label = new cjs.Text("确定", "bold 28px 'Arial'", "#FACF88");
	this.label.name = "label";
	this.label.textAlign = "center";
	this.label.lineHeight = 41;
	this.label.lineWidth = 144;
	this.label.parent = this;
	this.label.setTransform(92,9.7);

	this.instance = new lib.a_img_000017();
	this.instance.parent = this;

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance},{t:this.label}]}).wait(1));

}).prototype = getMCSymbolPrototype(lib.a_mc_000023, new cjs.Rectangle(0,0,188,60), null);


(lib.a_mc_000022 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.a_img_000016();
	this.instance.parent = this;

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

}).prototype = getMCSymbolPrototype(lib.a_mc_000022, new cjs.Rectangle(0,0,67,67), null);


(lib.a_mc_000021 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.a_img_000015();
	this.instance.parent = this;

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

}).prototype = getMCSymbolPrototype(lib.a_mc_000021, new cjs.Rectangle(0,0,121,57), null);


(lib.a_mc_000020 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.a_img_000014();
	this.instance.parent = this;

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

}).prototype = getMCSymbolPrototype(lib.a_mc_000020, new cjs.Rectangle(0,0,561,320), null);


(lib.a_mc_000016 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#FEB316").s().p("A/hB4QgxAAgkgkQgjgiAAgyQAAgwAjgkQAkgjAxAAMA/DAAAQAxAAAkAjQAjAkAAAwQAAAygjAiQgkAkgxAAg");
	this.shape.setTransform(213.8,12);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

}).prototype = getMCSymbolPrototype(lib.a_mc_000016, new cjs.Rectangle(0,0,427.6,24), null);


(lib.a_mc_000014 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.a_img_000009();
	this.instance.parent = this;

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

}).prototype = getMCSymbolPrototype(lib.a_mc_000014, new cjs.Rectangle(0,0,395,27), null);


(lib.a_mc_000012 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.a_img_000008();
	this.instance.parent = this;

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

}).prototype = getMCSymbolPrototype(lib.a_mc_000012, new cjs.Rectangle(0,0,220,69), null);


(lib.a_mc_000011 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.a_img_000007();
	this.instance.parent = this;

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

}).prototype = getMCSymbolPrototype(lib.a_mc_000011, new cjs.Rectangle(0,0,220,69), null);


(lib.a_mc_000010 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.a_img_000006();
	this.instance.parent = this;

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

}).prototype = getMCSymbolPrototype(lib.a_mc_000010, new cjs.Rectangle(0,0,492,67), null);


(lib.a_mc_000009 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.a_img_000005();
	this.instance.parent = this;

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

}).prototype = getMCSymbolPrototype(lib.a_mc_000009, new cjs.Rectangle(0,0,254,60), null);


(lib.a_mc_000008 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.a_img_000004();
	this.instance.parent = this;

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

}).prototype = getMCSymbolPrototype(lib.a_mc_000008, new cjs.Rectangle(0,0,78,96), null);


(lib.a_mc_000007 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.a_img_000003();
	this.instance.parent = this;

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

}).prototype = getMCSymbolPrototype(lib.a_mc_000007, new cjs.Rectangle(0,0,234,68), null);


(lib.a_mc_000006 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.a_img_000002();
	this.instance.parent = this;

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

}).prototype = getMCSymbolPrototype(lib.a_mc_000006, new cjs.Rectangle(0,0,404,67), null);


(lib.a_mc_000005 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.a_img_000001();
	this.instance.parent = this;

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

}).prototype = getMCSymbolPrototype(lib.a_mc_000005, new cjs.Rectangle(0,0,105,91), null);


(lib.a_mc_000001 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#000000").s().p("EiZqA6mQilAAAAiJMAAAhw4QAAiKClAAMEzVAAAQClAAAACKMAAABw4QAACJilAAg");
	this.shape.setTransform(1000,375);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

}).prototype = getMCSymbolPrototype(lib.a_mc_000001, new cjs.Rectangle(0,0,2000,750), null);


(lib.a_graphic_000003 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.a_img_000011();
	this.instance.parent = this;
	this.instance.setTransform(-91,-47.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-91,-47.5,182,95);


(lib.a_graphic_000002 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.a_img_000013();
	this.instance.parent = this;
	this.instance.setTransform(-91,-53.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-91,-53.5,182,107);


(lib.a_graphic_000001 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.a_img_000012();
	this.instance.parent = this;
	this.instance.setTransform(-101.5,-53.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-101.5,-53.5,203,107);


(lib.a_mc_000019 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.a_graphic_000003("synched",0);
	this.instance.parent = this;
	this.instance.setTransform(91,47.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).to({x:85},34).to({x:91},35).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,182,95);


(lib.a_mc_000018 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.a_graphic_000002("synched",0);
	this.instance.parent = this;
	this.instance.setTransform(91,53.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).to({x:83},37).to({x:91},46).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,182,107);


(lib.a_mc_000017 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.a_graphic_000001("synched",0);
	this.instance.parent = this;
	this.instance.setTransform(101.5,53.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).to({x:113.5},39).to({x:101.5},40).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,203,107);


(lib.a_mc_000015 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.btn1 = new lib.a_mc_000012();
	this.btn1.name = "btn1";
	this.btn1.parent = this;
	this.btn1.setTransform(110,112.5,1,1,0,0,0,110,34.5);

	this.btn0 = new lib.a_mc_000011();
	this.btn0.name = "btn0";
	this.btn0.parent = this;
	this.btn0.setTransform(110,34.5,1,1,0,0,0,110,34.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.btn0},{t:this.btn1}]}).wait(1));

}).prototype = getMCSymbolPrototype(lib.a_mc_000015, new cjs.Rectangle(0,0,220,147), null);


(lib.a_mc_000013 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// label
	this.label = new cjs.Text("98%", "bold 28px 'Arial'", "#FFFFFF");
	this.label.name = "label";
	this.label.textAlign = "center";
	this.label.lineHeight = 33;
	this.label.lineWidth = 148;
	this.label.parent = this;
	this.label.setTransform(11,44.2);

	this.timeline.addTween(cjs.Tween.get(this.label).wait(100));

	// 图层 46 (mask)
	var mask = new cjs.Shape();
	mask._off = true;
	mask.graphics.p("A8rBpQgrAAgfgfQgfgfABgrQgBgrAfgeQAfgfArAAMA5WAAAQAsAAAeAfQAgAeAAArQAAArggAfQgeAfgsAAg");
	mask.setTransform(-0.2,13.5);

	// Layer_6
	this.instance = new lib.a_mc_000016();
	this.instance.parent = this;
	this.instance.setTransform(-598.8,1.5);

	var maskedShapeInstanceList = [this.instance];

	for(var shapedInstanceItr = 0; shapedInstanceItr < maskedShapeInstanceList.length; shapedInstanceItr++) {
		maskedShapeInstanceList[shapedInstanceItr].mask = mask;
	}

	this.timeline.addTween(cjs.Tween.get(this.instance).to({x:-226.7},99).wait(1));

	// 图层 47
	this.instance_1 = new lib.a_mc_000014();
	this.instance_1.parent = this;
	this.instance_1.setTransform(0,13.5,1,1,0,0,0,197.5,13.5);

	this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(100));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-197.5,0,395,77.5);


(lib.a_mc_000004 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// a_mc_000011
	this.instance = new lib.a_mc_000009();
	this.instance.parent = this;
	this.instance.setTransform(423,163,1,1,0,0,0,127,30);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	// a_mc_000010
	this.instance_1 = new lib.a_mc_000008();
	this.instance_1.parent = this;
	this.instance_1.setTransform(363,119,1,1,0,0,0,39,48);

	this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(1));

	// a_mc_000009
	this.instance_2 = new lib.a_mc_000007();
	this.instance_2.parent = this;
	this.instance_2.setTransform(206,125,1,1,0,0,0,117,34);

	this.timeline.addTween(cjs.Tween.get(this.instance_2).wait(1));

	// a_mc_000008
	this.instance_3 = new lib.a_mc_000006();
	this.instance_3.parent = this;
	this.instance_3.setTransform(290,50.5,1,1,0,0,0,202,33.5);

	this.timeline.addTween(cjs.Tween.get(this.instance_3).wait(1));

	// a_mc_000006
	this.instance_4 = new lib.a_mc_000005();
	this.instance_4.parent = this;
	this.instance_4.setTransform(52.5,45.5,1,1,0,0,0,52.5,45.5);

	this.timeline.addTween(cjs.Tween.get(this.instance_4).wait(1));

}).prototype = getMCSymbolPrototype(lib.a_mc_000004, new cjs.Rectangle(0,0,550,193), null);


(lib.a_mc_000002 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// info
	this.info = new cjs.Text("dasdsd", "bold 42px 'Arial'", "#F69607");
	this.info.name = "info";
	this.info.textAlign = "center";
	this.info.lineHeight = 49;
	this.info.lineWidth = 460;
	this.info.parent = this;
	this.info.setTransform(282.1,90.7);

	this.timeline.addTween(cjs.Tween.get(this.info).wait(1));

	// btn0
	this.btn1 = new lib.a_mc_000023();
	this.btn1.name = "btn1";
	this.btn1.parent = this;
	this.btn1.setTransform(398,333,1,1,0,0,0,94,30);

	this.timeline.addTween(cjs.Tween.get(this.btn1).wait(1));

	// btn0
	this.btn0 = new lib.a_mc_000023();
	this.btn0.name = "btn0";
	this.btn0.parent = this;
	this.btn0.setTransform(173,333,1,1,0,0,0,94,30);

	this.timeline.addTween(cjs.Tween.get(this.btn0).wait(1));

	// closeBtn
	this.closeBtn = new lib.a_mc_000022();
	this.closeBtn.name = "closeBtn";
	this.closeBtn.parent = this;
	this.closeBtn.setTransform(546.5,33.5,1,1,0,0,0,33.5,33.5);

	this.timeline.addTween(cjs.Tween.get(this.closeBtn).wait(1));

	// 图层 48
	this.instance = new lib.a_mc_000021();
	this.instance.parent = this;
	this.instance.setTransform(279.5,29.5,1,1,0,0,0,60.5,28.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	// 图层 40
	this.instance_1 = new lib.a_mc_000020();
	this.instance_1.parent = this;
	this.instance_1.setTransform(280.5,184,1,1,0,0,0,280.5,160);

	this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(1));

}).prototype = getMCSymbolPrototype(lib.a_mc_000002, new cjs.Rectangle(0,0,580,363), null);


(lib.Main = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// timeline functions:
	this.frame_0 = function() {
		this.stop();
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(1));

	// btnPanel
	this.btnPanel = new lib.a_mc_000015();
	this.btnPanel.name = "btnPanel";
	this.btnPanel.parent = this;
	this.btnPanel.setTransform(643,456);

	this.timeline.addTween(cjs.Tween.get(this.btnPanel).wait(1));

	// loadPanel
	this.loadPanel = new lib.a_mc_000013();
	this.loadPanel.name = "loadPanel";
	this.loadPanel.parent = this;
	this.loadPanel.setTransform(761.9,472.2);

	this.timeline.addTween(cjs.Tween.get(this.loadPanel).wait(1));

	// title
	this.title = new lib.a_mc_000004();
	this.title.name = "title";
	this.title.parent = this;
	this.title.setTransform(742,314.5,1,1,0,0,0,275,96.5);

	this.timeline.addTween(cjs.Tween.get(this.title).wait(1));

	// a_mc_000004
	this.instance = new lib.a_mc_000019();
	this.instance.parent = this;
	this.instance.setTransform(1325.3,149.5,1,1,0,0,0,91,47.5);

	this.instance_1 = new lib.a_mc_000018();
	this.instance_1.parent = this;
	this.instance_1.setTransform(819.2,126.5,1,1,0,0,0,91,53.5);

	this.instance_2 = new lib.a_mc_000017();
	this.instance_2.parent = this;
	this.instance_2.setTransform(160.5,126.5,1,1,0,0,0,101.5,53.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_2},{t:this.instance_1},{t:this.instance}]}).wait(1));

	// tip
	this.tip = new lib.a_mc_000010();
	this.tip.name = "tip";
	this.tip.parent = this;
	this.tip.setTransform(749,672.5,1,1,0,0,0,246,33.5);

	this.timeline.addTween(cjs.Tween.get(this.tip).wait(1));

	// bg
	this.bg = new lib.MainBg();
	this.bg.name = "bg";
	this.bg.parent = this;
	this.bg.setTransform(750,0);

	this.timeline.addTween(cjs.Tween.get(this.bg).wait(1));

}).prototype = getMCSymbolPrototype(lib.Main, new cjs.Rectangle(0,0,1500,750), null);


(lib.Alert = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.panel = new lib.a_mc_000002();
	this.panel.name = "panel";
	this.panel.parent = this;
	this.panel.setTransform(512,164);

	this.bg = new lib.a_mc_000001();
	this.bg.name = "bg";
	this.bg.parent = this;
	this.bg.setTransform(-275.8,0);
	this.bg.alpha = 0.301;

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.bg},{t:this.panel}]}).wait(1));

}).prototype = getMCSymbolPrototype(lib.Alert, new cjs.Rectangle(-275.8,0,2000,750), null);


// stage content:
(lib.main = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Main
	this.instance = new lib.Main();
	this.instance.parent = this;
	this.instance.setTransform(750,375,1,1,0,0,0,750,375);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	// Alert
	this.instance_1 = new lib.Alert();
	this.instance_1.parent = this;

	this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(474.2,375,2000,750);
// library properties:
lib.properties = {
	id: '9C1FF08D31BD4D4CBDDDF788A80CD69A',
	width: 1500,
	height: 750,
	fps: 60,
	color: "#FFFFFF",
	opacity: 1.00,
	manifest: [
		{src:"images/main/a_img_000010.jpg?1535811374435", id:"a_img_000010"},
		{src:"images/main/main_atlas_P_.png?1535811374380", id:"main_atlas_P_"}
	],
	preloads: []
};



// bootstrap callback support:

(lib.Stage = function(canvas) {
	createjs.Stage.call(this, canvas);
}).prototype = p = new createjs.Stage();

p.setAutoPlay = function(autoPlay) {
	this.tickEnabled = autoPlay;
}
p.play = function() { this.tickEnabled = true; this.getChildAt(0).gotoAndPlay(this.getTimelinePosition()) }
p.stop = function(ms) { if(ms) this.seek(ms); this.tickEnabled = false; }
p.seek = function(ms) { this.tickEnabled = true; this.getChildAt(0).gotoAndStop(lib.properties.fps * ms / 1000); }
p.getDuration = function() { return this.getChildAt(0).totalFrames / lib.properties.fps * 1000; }

p.getTimelinePosition = function() { return this.getChildAt(0).currentFrame / lib.properties.fps * 1000; }

an.bootcompsLoaded = an.bootcompsLoaded || [];
if(!an.bootstrapListeners) {
	an.bootstrapListeners=[];
}

an.bootstrapCallback=function(fnCallback) {
	an.bootstrapListeners.push(fnCallback);
	if(an.bootcompsLoaded.length > 0) {
		for(var i=0; i<an.bootcompsLoaded.length; ++i) {
			fnCallback(an.bootcompsLoaded[i]);
		}
	}
};

an.compositions = an.compositions || {};
an.compositions['9C1FF08D31BD4D4CBDDDF788A80CD69A'] = {
	getStage: function() { return exportRoot.getStage(); },
	getLibrary: function() { return lib; },
	getSpriteSheet: function() { return ss; },
	getImages: function() { return img; }
};

an.compositionLoaded = function(id) {
	an.bootcompsLoaded.push(id);
	for(var j=0; j<an.bootstrapListeners.length; j++) {
		an.bootstrapListeners[j](id);
	}
}

an.getComposition = function(id) {
	return an.compositions[id];
}



})(createjs = createjs||{}, AdobeAn = AdobeAn||{});
var createjs, AdobeAn;