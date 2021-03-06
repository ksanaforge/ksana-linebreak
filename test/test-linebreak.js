var Linebreak=require("../linebreak");
var assert=require("assert");
var data=
  "01~~45678~\n"+
	"~12345~~89\n"+
	"012~~5678~\n"+
	"~12345~~89";


describe("linebreak",function(){
	it("load",function(){
		var lb=new Linebreak(data);
		assert.equal(lb.length,40);
	});

	it("pos2lineoff",function(){
		var lb=new Linebreak(data);
		assert.deepEqual( lb.pos2lineoff(0), [0,0] );
		assert.deepEqual( lb.pos2lineoff(10), [1,0] );
		assert.deepEqual( lb.pos2lineoff(39), [3,9] );
		assert.deepEqual( lb.pos2lineoff(40), null );
	});

	it("lineoff2pos",function(){
		var lb=new Linebreak(data);
		assert.equal( lb.lineoff2pos([0,0]), 0 );
		assert.equal( lb.lineoff2pos([1,0]), 10 );
		assert.equal( lb.lineoff2pos([3,9]), 39 );
		assert.equal( lb.lineoff2pos([4,1]), -1 ); //exceed line
		assert.equal( lb.lineoff2pos([0,10]), 9 ); //return max length of the line
	});
	it("insert text",function(){
		var lb=new Linebreak(data);
		lb.insert(2,"QQ");
		assert.deepEqual(lb.getArray(), ["01QQ~~45678~","~12345~~89","012~~5678~","~12345~~89"]);
	});

	it("remove text",function(){
		var lb=new Linebreak(data);
		lb.remove(16,2);
		assert.deepEqual(lb.getArray(), ["01~~45678~","~1234589","012~~5678~","~12345~~89"]);

		lb.remove(2,2);
		assert.deepEqual(lb.getArray(), ["0145678~","~1234589","012~~5678~","~12345~~89"]);
	});	


	it("find normal string",function(){
		var lb=new Linebreak(data);
		var idx=lb.find("~~");
		assert.equal(idx,2);
	});


	it("find regular expression",function(){
		var lb=new Linebreak(data);
		var idx=lb.find(/[45]/);
		assert.equal(idx,4);
	});


	it("find regular expression from ",function(){
		var lb=new Linebreak(data);
		var idx=lb.find(/[45]/,6);
		assert.equal(idx,14);
	});

	it("replace same width",function(){
		var lb=new Linebreak(data);
		var text=lb.replace(/~~/g,function(m){
			return "##";
		});
		assert.deepEqual(lb.getArray(), ["01##45678#","#12345##89","012##5678#","#12345##89"]);
	});

	it("replace less width",function(){
		var lb=new Linebreak(data);
		var text=lb.replace(/~~/g,function(m){
			return "";
		});
		//console.log(lb.getArray());
		assert.deepEqual(lb.getArray(), ["0145678","1234589","0125678","1234589"]);
	});
	it("replace more width",function(){
		var lb=new Linebreak(data);
		var text=lb.replace(/~~/g,function(m){
			return "@@@";
		});
		//console.log(lb.getArray());
		assert.deepEqual(lb.getArray(), ["01@@@45678@","@@12345@@@89","012@@@5678@","@@12345@@@89"]);
	});

	it("replace multiple line",function(){
		var lb=new Linebreak("ab1\n11\n11\n1f");
		var text=lb.replace(/1+/g,function(m){
			return "";
		});
		assert.deepEqual(lb.getArray(), ["ab","","","f"]);
	});

	it("replace multiple line 2",function(){
		var lb=new Linebreak("ab1\n11\n11\n1f");
		var text=lb.replace(/1+/g,function(m){
			return "qq";
		});
		assert.deepEqual(lb.getArray(), ["abq","q","","f"]);
	});

	it("replace multiple line 3",function(){
		var lb=new Linebreak("ab1\n11\n11\n1f");
		var text=lb.replace(/1+/g,function(m){
			return "xxxxxxx";
		});
		assert.deepEqual(lb.getArray(), ["abx","xx","xx","xxf"]);
	});

});
