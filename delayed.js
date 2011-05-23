function is_function(obj){
    return toString.call(obj) === "[object Function]";
}

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

var inc = delayed(function(p){
    return p + 1;
});
var plus = delayed(function(a,b){
    return a + b;
});

console.log(
    inc(function (){ return 5; }),
    inc(5),
    plus(2, 4),
    plus(function(){ return 3;}, function(){ return 3;})
);

function copy_arr(arr){return Array.prototype.slice.call(arr);}
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
console.log(
    cond([])
);