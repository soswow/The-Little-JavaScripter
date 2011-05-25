var utils = require("./utils.js");

exports.car = car = function(list){
    return list[0];
};

exports.cdr = cdr = function(list){
    return list.slice(1);
};

exports.cons = cons = function(atom, list){
    tmp = utils.copy_arr(list);
    if (!utils.is_array(list)){
        throw "cons second arg must be a lists";
    }
    tmp.splice(0,0,atom);
    return tmp;
};

exports.is_null = is_null = function(list){
    if (!utils.is_array(list)){
        throw "is_null only for lists";
    }
    return list.length === 0;
};

exports.quote = quote = function(){return [];};

exports.is_atom = is_atom = function(atom){
    return !utils.is_array(atom);
};

exports.is_eq = is_eq = function(o1, o2){
    //if (typeof(o1) == "string" && typeof(o2) == "string"){
    //    return o1 === o2;
    //}
    //throw "both args should be strings";
    return o1 === o2;
};

function de(obj){
    return utils.is_function(obj)?obj():obj;
}

exports.Else = true;
exports.cond = cond = function(){
    var args = utils.copy_arr(arguments), i=0;
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

exports.is_lat = is_lat = function(l){
    return cond(
        [is_null(l), true],
        [is_atom(car(l)), 
            function(){
                return is_lat(cdr(l));
            }],
        false
    );
};

exports.or = or = function (){
	for(var i=0; i<arguments.length;i++){
		if(de(arguments[i])){
			return true;
		}
	}
	return false;
};

function pr(a){
    console.log(a);
    return a;
}
exports.is_member = is_member = function (a, lat){
	return cond(
        [is_null(lat), false],
        function(){ 
            return or(is_eq(a, car(lat)),
                function(){
                    return is_member(a, cdr(lat));
                });
        }
	);
};
