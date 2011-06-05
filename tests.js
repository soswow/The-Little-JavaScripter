var s = require("./schemer.js");
var testUtils = require("./test-utils.js");
function p(o){ console.log(o); }

var car = s.car,
    cdr = s.cdr,
    cons= s.cons,
    cond = s.cond,
    or = s.or,
    
    is_null = s.is_null,
    is_eq = s.is_eq,
    is_atom = s.is_atom,
    is_lat = s.is_lat,
    is_member = s.is_member,
    
    rember = s.rember,
    firsts = s.firsts,
    insertR = s.insertR,
    insertL = s.insertL,
    subst = s.subst,
    subst2 = s.subst2,
    multirember = s.multirember,
    multiinsertR = s.multiinsertR,
    multiinsertL = s.multiinsertL,
    multisubst = s.multisubst,
    
    testp = testUtils.testp,
    fail = testUtils.fail;
    
var arr = [1,2,3,4];
testp(car(arr), 1);
testp(cdr(arr), [2,3,4]);
testp(cons(0,arr), [0,1,2,3,4]);
testp(cons(cdr(arr),arr), [[2,3,4],1,2,3,4]);
testp(cons(['a','b',['c']], []), [['a','b',['c']]]);
testp(cons('a', car([['b'],'c','d'])), ['a','b']);

p("-- is_null, is_eq, is_atom --");

testp(is_null(quote()), true);
testp(is_null([]), true);
testp(is_null([1,2,3]), false);
testp(is_eq("asd","asd"), true);
testp(is_eq("qwe","asd"), false);
testp(is_atom("asd"), true);
testp(is_atom(1), true);
testp(is_atom([1,2,3]), false);

p("-- cond -- ");
testp(cond([false, 10], [false, 20], [true, 30]), 30);
testp(cond([false, 10], [false, 20], 40), 40);
testp(cond([true, 10], [false, 20], 40), 10);
testp(cond( function(){return [true, 10];}, 
            [false, 20]), 10);
testp(cond( [false, function(){return 10;}], 
            function(){return [
                function(){ return 10 == 10;}, 
                function(){ return 20;}
            ]; }), 20);
testp(cond( [false, function(){return 10;}], 
            function(){return [
                function(){ return 10 == 15;}, 
                function(){ return 20;}
            ]; },
            40), 40);
testp(cond( [false, function(){return 10;}], 
            function(){return [
                function(){ return 10 == 15;}, 
                function(){ return 20;}
            ]; },
            function(){return 40;}), 40);
try{
    testp(cond([false, 10], [true, 10, 20]), 10);
    fail("Exception expected");
}catch(e){/*ok*/}

p("-- is_lat --");
testp(is_lat([]), true);
testp(is_lat([1,2,3,4]), true);
testp(is_lat([1,2,[1,2],4]), false);

p("--or--");
testp(or(true, false), true);
testp(or(0, false, ""), false);

p("--is_member--");
testp(is_member(1, [2,3,4,1,5]), true);
testp(is_member(7, [2,3,4,1,5]), false);

p("--rember--");
testp(rember(3, [1,2,3,4,5]), [1,2,4,5]);
testp(rember(3, [1,2,3,4,5,3]), [1,2,4,5,3]);
testp(rember(4, [1,2,3,4,5]), [1,2,3,5]);
testp(rember(7, [1,2,3,4,5]), [1,2,3,4,5]);

p("--firsts--");
testp(firsts([[1,6], [2,8,9], [3,4,5]]), [1,2,3]);

p("--insertR--");
testp(insertR("topping", "fudge", ["ice","cream","with","fudge","for","dessert"]), 
    ["ice","cream","with","fudge","topping","for","dessert"]);

p("--insertL--");
testp(insertL("A","b",["w","q","t","b","y"]), ["w","q","t","A","b","y"]);

p("--subst--");
testp(subst("A","b",["w","q","t","b","y"]), ["w","q","t","A","y"]);

p("--subst2--");
testp(subst2("A", "b", "q", ["w","q","t","b","y"]), ["w","A","t","b","y"]);
testp(subst2("A", "b", "q", ["w","i","t","b","y"]), ["w","i","t","A","y"]);

p("--multirember--");
testp(multirember(1, [1,2,4,1,5,1]), [2,4,5]);

p("--multiinsertR--");
testp(multiinsertR(2, 1, [0,1,0,1,2]), [0,1,2,0,1,2,2]);

p("--multiinsertL--");
testp(multiinsertL(2, 1, [0,1,0,1,2]), [0,2,1,0,2,1,2]);

p("--multisubst--");
testp(multisubst(2, 1, [0,1,0,1,2]), [0,2,0,2,2]);
