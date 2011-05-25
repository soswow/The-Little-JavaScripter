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
    //True if "l" is a list consistent only of atoms
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
    //True if one of the arguments is true 
	for(var i=0; i<arguments.length;i++){
		if(de(arguments[i])){
			return true;
		}
	}
	return false;
};
exports.is_member = is_member = function is_member(a, lat){
    //Checks if "a" in part of lat
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
exports.rember = function rember(a, lat){
    //Removes first "a" element from lat
    return cond(
        [is_null(lat), quote()],
        [is_eq(a, car(lat)), cdr(lat)],
        [function(){
            return cons(car(lat), rember(a, cdr(lat)));
        }]
    );
};
exports.firsts = function firsts(lat){
    return cond(
        [is_null(lat), quote()],
        [function(){
            return cons(
                car(car(lat)),
                firsts(cdr(lat))
            );
        }]
    );
};
exports.insertR = function insert(_new, old, lat){
    //Inserts _new element after old in lat.
    return cond(
            [is_null(lat), quote()],
            [cond(
                [is_eq(old, car(lat)), cons(old, cons(_new, cdr(lat)))],
                [function(){
                    return cons(car(lat), insert(_new, old, cdr(lat)));
                }]
            )]
        );
};
exports.insertL = function insert(_new, old, lat){
    //Inserts _new element before old in lat.
    return cond(
            [is_null(lat), quote()],
            [cond(
                [is_eq(old, car(lat)), cons(_new, lat)],
                [function(){
                    return cons(car(lat), insert(_new, old, cdr(lat)));
                }]
            )]
        );
};
exports.subst = function replace(_new, old, lat){
    //Replace old in lat to _new
    return cond(
            [is_null(lat), quote()],
            [cond(
                [is_eq(old, car(lat)), cons(_new, cdr(lat))],
                [function(){
                    return cons(car(lat), replace(_new, old, cdr(lat)));
                }]
            )]
        );
};
exports.subst2 = function replace(_new, old1, old2, lat){
    return cond(
            [is_null(lat), quote()],
            [cond(
                [or(is_eq(old1, car(lat)), 
                    is_eq(old2, car(lat))), cons(_new, cdr(lat))],
                [function(){
                    return cons(car(lat), replace(_new, old1, old2, cdr(lat)));
                }]
            )]
        );
};
exports.multirember = function rember(a, lat){
    return cond(
        [is_null(lat), quote()],
        [is_eq(a, car(lat)), function(){
                return rember(a, cdr(lat));
            }],
        [function(){
            return cons(car(lat), rember(a, cdr(lat)));
        }]
    );
};
