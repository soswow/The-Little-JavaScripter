function p(o){ console.log(o); }
function dofalse(o1,o2){p(o1 + " != " + o2); return false;}
function isArray(obj){return toString.call(obj) === "[object Array]";}
function is_function(obj){
    return toString.call(obj) === "[object Function]";
}
function test(o1, o2){ 
    var i=0;
    if(isArray(o1) && isArray(o2) && o1.length === o2.length){
        for(;i<o1.length;i++){
            if (!test(o1[i], o2[i])){
                return dofalse(o1,o2);
            }
        }
        return true;
    }else{
        if (o1 === o2){
            return true;
        }else{
            return dofalse(o1,o2);
        }
    }
}
function fail(msg){
    throw msg;
}
function copy_arr(arr){return Array.prototype.slice.call(arr);}
function testp(){
    p(test.apply(null, copy_arr(arguments)));
}

function car(list){
    return list[0];
}
function cdr(list){
    return list.slice(1);
}
function cons(atom, list){
    tmp = copy_arr(list);
    if (!isArray(list)){
        throw "cons second arg must be a lists";
    }
    tmp.splice(0,0,atom);
    return tmp;
}
function is_null(list){
    if (!isArray(list)){
        throw "is_null only for lists";
    }
    return list.length === 0;
}
function quote(){return [];}
function is_atom(atom){
    return !isArray(atom);
}
function is_eq(o1, o2){
    if (typeof(o1) == "string" && typeof(o2) == "string"){
        return o1 === o2;
    }
    throw "both args should be strings";
}



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
var delayed = function(f, that){
    return function(){
        var i=0, args=[], arg;
        for(;i<arguments.length;i+=1){
            arg = arguments[i];
            if(is_function(arg)){
                arg = arg();
            }
            args.push(arg);
        }
        return f.apply(that || this, args);
    };
};
var Else = true;
var de = function(obj){
    return is_function(obj)?obj():obj;
};
var cond = function(){
    var args = copy_arr(arguments), i=0;
    for(;i<args.length;i++){
        args[i] = de(args[i]);
        if (is_atom(args[i])){
            return args[i];
        }else{
            if (args[i].length == 1){
                return de(args[i][0]);
            }else if(args[i].length == 2){
                if (de(args[i][0])){
                    return de(args[i][1]);
                }
            }else{
                throw "Each element of should be 1 or 2 length array";
            }
        }
    }
};

testp(cond([false, 10], [false, 20], [true, 30]), 30);
testp(cond([false, 10], [false, 20], [30]), 30);
testp(cond([false, 10], [false, 20], [Else, 30]), 30);
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
function is_lat(l){
    return cond(
        [is_null(l), true],
        [is_atom(car(l)), 
            function(){
                return is_lat(cdr(l));
            }],
        false
    );
}
testp(is_lat([]), true);
testp(is_lat([1,2,3,4]), true);
testp(is_lat([1,2,[1,2],4]), false);