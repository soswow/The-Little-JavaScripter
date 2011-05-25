exports.copy_arr = function(arr){
    return Array.prototype.slice.call(arr);
};
exports.is_function = function(obj){
    return toString.call(obj) === "[object Function]";
};
exports.is_array = function(obj){
    return toString.call(obj) === "[object Array]";
};