exports.copy_arr = function(arr){
    return Array.prototype.slice.call(arr);
};
exports.is_function = function(obj){
    return toString.call(obj) === "[object Function]";
};
exports.is_array = function(obj){
    return toString.call(obj) === "[object Array]";
};

exports.delayed = function(f, that){
    return function(){
        for(var i=0;i<arguments.length;i+=1){
            arguments[i] = de(arguments[i]);
        }
        return f.apply(that || this, arguments);
    };
};