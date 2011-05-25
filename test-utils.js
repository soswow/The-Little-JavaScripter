var utils = require("./utils.js");

function p(o){ console.log(o); }
function dofalse(o1,o2){p(o1 + " != " + o2); return false;}

exports.test = test = function(o1, o2){
    var i=0;
    if(utils.is_array(o1) && utils.is_array(o2) && o1.length === o2.length){
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
};
exports.fail = function(msg){
    throw msg;
};
exports.testp = function(){
    p(test.apply(null, utils.copy_arr(arguments)));
};