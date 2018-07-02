//格式化扁平数据结构为树形结构数据
const __treesData = function(data, idStr, pidStr, chindrenStr) {    
    let r = [], hash = {}, id = idStr, pid = pidStr, children = chindrenStr, i = 0, j = 0, len = data.length;    
    for(; i < len; i++){    
        hash[data[i][id]] = data[i];    
    }    
    for(; j < len; j++){    
        var aVal = data[j], hashVP = hash[aVal[pid]];    
        if(hashVP){    
            !hashVP[children] && (hashVP[children] = []);    
            hashVP[children].push(aVal);    
        }else{    
            r.push(aVal);    
        }    
    }    
    return r;    
}

//格式化树形结构数据为扁平数据结构
const __flatData = function (arr) {
    let newArr = [];

    function plant(arr) {
        for (let i = 0; i<arr.length; i++) {
            if(arr[i].children && arr[i].children.length>0) {
                plant(arr[i].children);
                arr[i].children = [];    
            }
            newArr.push(arr[i]);
        }
    } 

    plant(arr);

    return newArr;
}

//根据经纬度坐标点获取中心点
const __getCenter = function (pathData) {
    let lngArr = [];
    let latArr = [];
    for(let i=0; i<pathData.length; i++) {
      lngArr.push(pathData[i]['lng']);
      latArr.push(pathData[i]['lat']);
    }
    let lngMax = Math.max.apply(null, lngArr);
    let lngMin = Math.min.apply(null, lngArr);
    let latMax = Math.max.apply(null, latArr);
    let latMin = Math.min.apply(null, latArr);
    let lngMid = Number(((lngMax + lngMin)/2).toFixed(6));
    let latMid = Number(((latMax + latMin)/2).toFixed(6));

    return { lng:lngMid, lat:latMid };
}

//数组去重
const __distinct = function (arr,id){
    // var result = [],
    //     len = arr.length;
    // arr.forEach(function(v, i ,arr){  //这里利用map，filter方法也可以实现
    //     var bool = arr.indexOf(v,i+1);  //从传入参数的下一个索引值开始寻找是否存在重复
    //     if(bool === -1){
    //         result.push(v);
    //     }
    // })
    // return result;
    var hash = {}; 
    arr = arr.reduce(function(item, next) { 
      hash[next[id]] ? '' : hash[next[id]] = true && item.push(next); 
      return item
    }, [])

    return arr;
};

//节流函数
const __debounce = function debounce(func, delay) {
    let timer

    return function(...args) {
        if(timer) {
            clearTimeout(timer)
        }

        timer = setTimeout(()=>{
            func.apply(this, args)
        }, delay)
    }
}


export {
    __treesData,
    __flatData,
    __getCenter,
    __distinct,
    __debounce
}