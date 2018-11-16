/** 
 * Guesstimator.model() produces plots based on inputs.
 * */

var guesstimator = {};

guesstimator.copyright = "(c) Michelangelo von Dassow, 2018. All rights reserved."

guesstimator.version = "0.0.0"

guesstimator.distributions = {
    /** Generate length n array of value params.
     * @param {int} n : How many numbers to generate
     * @param {array} params : mode of delta distribution
     * @returns {array} Array of random numbers with specified distribution
    */ 
    nDelta : function (n, params) {
        var k, out = [];
        for (k = 0; k < n; k++) {
            out.push(params[0]);
        }; 
        return out; 
    },
    /** Generate m uniformly distributed random variables
     * @param {int} n : How many random numbers to generate
     * @param {array} params : [lower, upper] bounds
     * @returns {array} Array of random numbers with specified distribution
    */ 
    nRandUniform : function (n, params) {
        var k, width = params[1] - params[0], lb = params[0], out = [];
        for (k=0; k<n; k++) {
            out.push(width*Math.random() + lb);
        }
        return out;
    },
    /** Generate m normally distributed random variables, with optional transform
     * @param {int} m : How many random numbers to generate
     * @param {array} params : [mu, sigma] (mu and sigma are mean and standard 
     * deviation of normal distribution before transformation.
     * @param {function} transformFunction : Transformation function on normal variate
     * @returns {array} Array of random numbers with specified distribution
    */ 
    nRandTrnsNorm : function (m, params, transformFunction) {
        var k, r1, r2, f, mu = params[0], sigma = params[1];
        var out = [];
        if (transformFunction) {
            if (typeof transformFunction === 'function') {
                f = transformFunction;
            } else {
                throw new Error("'transformFunction' argument for nRandTrnsNorm should be a function, blank, or falsy")
            }
        } else {
            f = function(x) {return x};
        }
    
        for (k=0; k<m/2; k++) {
            r1 = sigma*Math.pow(-2*Math.log(Math.random()), 0.5);
            r2 = 2*Math.PI*Math.random();
            out.push( f(mu + r1*Math.sin(r2)) );
            out.push( f(mu + r1*Math.cos(r2)) );
        }
    
        if (out.length > m) {out.pop();};
        
        return out; 
    }
}

/** Generate m normally distributed random variable with mean mu and variance sigma
* @param {int} m : How many random numbers to generate
* @param {array} params : [mu, sigma] (mu and sigma are mean and standard 
* deviation of normal distribution.
* @returns {array} Array of random numbers with specified distribution
*/ 
guesstimator.distributions.nRandNorm = function (m, params) {
    return guesstimator.distributions.nRandTrnsNorm(m, params);
};
/** Generate m lognormally distributed random numbers with mean mu and variance sigma
* @param {int} m : How many random numbers to generate
* @param {array} params : [mu, sigma] (mu and sigma are mean and standard 
* deviation of normal distribution before transformation).
* @returns {array} Array of random numbers with specified distribution
*/ 
guesstimator.distributions.nRandLognorm = function (m, params) {
    return guesstimator.distributions.nRandTrnsNorm(m, params, Math.exp);
};

/**
 * Apply function (fun) to every pair of a and b. if a and b are arrays,
 * apply fun(a[j], b[j]) for all elements (j < a.length); if only one
 * is array apply fun(a[j], b) or fun(a, b[j]) depending on which is array,
 * or fun(a, b) if neither are arrays.
 * One can make somewhat speedier but at the cost of loss of generality and
 * simplicity.
 * @param {*} a : array or number
 * @param {*} b : array or number
 * @param {function} fun : function that takes two arguments
 * @returns array
 */
guesstimator.elementByElement = function (a, b, fun) {
    var out= [], k, arr, scal;
    var kmax = a.length || b.length;
    if (typeof fun !== 'function') {
        throw new Error("Third argument to 'elementByElement' must be a function")
    }

    if (Array.isArray(a) && Array.isArray(b) && a.length === b.length) {
        for (k = 0; k < kmax; k++) {
            out.push(fun(a[k], b[k]));
        }
    } else if (typeof a === 'number' && typeof b === 'number') {
        out = fun(a, b);
    } else if (Array.isArray(a) && typeof b === 'number') {
        for (k = 0; k < kmax; k++) {
            out.push(fun(a[k], b));
        }
    } else if (typeof a === 'number' && Array.isArray(b)) {
        for (k = 0; k < kmax; k++) {
            out.push(fun(a, b[k]));
        }
    } else {
        throw new Error("elementByElement expects two equal length arrays, two numbers, or an array and a number")
    }
    return out;
}
/**
 * Element by element array multiplication; if a or b is scalar, equivalent to
 * scalar multiplication.
 * @param {*} a 
 * @param {*} b 
 * @returns array
 */
guesstimator.mult = function (a, b) {
    return guesstimator.elementByElement(a, b, function (x, y) {return x * y});
}
/**
 * Element by element array addition; if a or b is scalar, adds scalar to every
 * element of other argument
 * @param {*} a 
 * @param {*} b 
 * @returns array
 */
guesstimator.add = function (a, b) {
    return guesstimator.elementByElement(a, b, function (x, y) {return x + y});
}
/**
 * Element by element array subtraction; if a or b is scalar, subtracts scalar from
 * every element of other argument
 * @param {*} a 
 * @param {*} b 
 * @returns array
 */
guesstimator.subt = function (a, b) {
    return guesstimator.elementByElement(a, b, function (x, y) {return x - y});
};

guesstimator.mean = function (arr) {
    return (Array.isArray(arr)) ? 
        arr.reduce(function (total, x) {return total + x;}, 0)/arr.length : 
        (typeof arr === "number") ? arr : Number.NaN;
};


guesstimator.sqr = function (x) {
    return x*x;
}

guesstimator.sumOfSqrs = function (arr) {
    return (Array.isArray(arr)) ? 
    arr.reduce(function (total, x) {return total + x*x;}, 0) : 
    (typeof arr === "number") ? arr*arr : Number.NaN;
};

guesstimator.variance = function (arr) {
    return Array.isArray(arr) ? 
        (guesstimator.sumOfSqrs(arr) - arr.length * guesstimator.sqr(guesstimator.mean(arr)))/(arr.length-1) : Number.NaN;
}

guesstimator.stdev = function (arr) {
    return Math.pow(guesstimator.variance(arr), 0.5)
}

/**
 * Calculate log normal parameters from mean and variance
 * @param {number} m : mean, untransformed
 * @param {number} v : variance, untransformed
 * @returns array : [mean, SD] of normal distribution generating lognorm
 */
guesstimator.lognormFromMeanAndVariance = function(m, v) {
    return [Math.log(m/Math.pow(1+(v/(m*m)), 0.5)), Math.log(1+(v/(m*m)))]
}

/**
 * Calculate log normal parameters from 10th and 90th percentile.
 * Based on " https://en.wikipedia.org/wiki/Standard_deviation#Rules_for_normally_distributed_data 00"
 * @param {array} p10p90 : [10th percentile (untransformed), 90th percentile (untransformed)]
 * @returns array : [mean, SD] of normal distribution generating lognorm
 */
guesstimator.lognormFrom10thAnd90thPercentiles = function(p10p90) {
    // Transform to normal distribution
    var ex10 = Math.log(p10p90[0]), ex90 = Math.log(p10p90[1]);
    var normMean = (ex10 + ex90)/2;
    var normSD = (ex90 - normMean)/1.282;
    return [normMean, normSD];
}

/**
 * Test how fast browser is to determine sample size.
 * @param {number} ms : number of milliseconds to run test for
 * @returns {number}
 */
guesstimator.timeTest = function(ms) {
    var t0;
    var k = 0, n=100;
    var arr0, arr1;
    t0 = Date.now();
    while ((Date.now() - t0)<ms) {
        arr0 = guesstimator.distributions.nRandLognorm(n, [0,0.2]);
        arr1 = guesstimator.distributions.nRandLognorm(n, [0,0.2]);
        guesstimator.add(arr0, arr1);
        k++;
    }
    return k*n;
}

/**
 * Bin data for histograms.
 * @param {array} arr : array of numbers
 * @param {array} rng : 2 element array for min, max
 * @param {number} kmax : number of bins.
 * @return {object} {bins : <label array>, counts : <count array>} ; elements of
 * bins array are upper bound on the bin ([xmin, ..., xmax, +infinity]), so counts represent:
 *   [n(x<=xmin), n(xmin<x<=bins[0]),..., n(bins[kmax-1]<x<=xmax), n(x>xmax)]
 */
guesstimator.binData = function (arr, rng, kmax, scale) {
    var out = {bins : [], counts : []};
    var k, j, jmax = arr.length;
    var width = Math.abs((rng[1] - rng[0])/kmax);
    var xmin = Math.min(rng[0], rng[1]);
    var h;
    // Generate bins
    for (k=0; k<=kmax; k++) {
        out.bins.push(xmin + k*width);
        out.counts.push(0);
    }
    out.bins.push(Number.POSITIVE_INFINITY);
    out.counts.push(0);

    // Sort into bins
    if (jmax) {
        for (j=0; j<jmax; j++) {
            k = Math.min(kmax + 1, Math.max(0, Math.ceil((arr[j]-xmin)/width)));
            out.counts[k] += 1;
        }
    } else if (typeof arr === "number") {
        k = Math.min(kmax + 1, Math.max(0, Math.ceil((arr-xmin)/width)));
        out.counts[k] += 1;
    }

    if (scale === "normalize") {
        h = Math.max.apply(null, out.counts);
        out.counts = out.counts.map(function (x) {return x/h});;
    }
    return out;
};

/**
 * Convert 6-character hex code to rgba string with given opacity
 * @param {string} str 
 * @param {number} op
 */
guesstimator.hexToRGBA = function (str, op) {
    var s, sl= str.length, step, rgba = [], k;

    if (typeof str !== 'string' || (sl !== 7 && sl !== 4) && str[0] !== "#") {
        throw new Error("Not valid hex color string beginning with '#'");
    } else if ((typeof op !== 'undefined') && (isNaN(op) || op > 1 || op < 0)) {
        throw new Error("Opacity 'num' should be between 0 and 1")
    } else {
        sl -= 1;
        step = sl/3;
        s=str.replace('#', '');

        // Convert hex string to decimal
        for(k=0; k<sl; k += step) {
            rgba.push(parseInt(sl === 6 ? s[k] + s[k+1] : s[k], 16));
        }
        op = (typeof op === 'undefined') ? 0 : op;
        // Add opacity
        rgba.push(op);

        return 'rgba('+rgba.join(',')+')';
    }
}

guesstimator.isValidNum = function (x) {
    return (typeof x !== 'undefined') && !isNaN(x)
}

guesstimator.histogram = function (obj) {
    return function () {
        var bins, j, seriesName, seriesData, allSeries = [];
        var binCount = (obj.options && obj.options.binCount) ? obj.options.binCount : Math.max(obj.n/100, 10);
        var curSeries;
        // Get element in which to put chart
        var ctx = document.getElementById(obj.chartElementID);

        // Reformat data for Chart.js
        for (seriesName in obj.plotSeries) {
            curSeries = obj.plotSeries[seriesName];

            // Group into histogram bins
            seriesData = guesstimator.binData(
                curSeries.vals, obj.options.range, binCount, "normalize"
            );

            // Check that bins matches for each series.
            if (!bins) {
                bins = seriesData.bins;
            } else if (!seriesData.bins.every(function (x, k) {return x === bins[k]})) {
                throw new Error("Error in binning data: bins don't match for all series")
            }

            allSeries.push({
                data : seriesData.counts, label : seriesName,
                borderColor : curSeries.color || "#000000",
                backgroundColor : guesstimator.hexToRGBA(
                    curSeries.color || "#000000", 
                    guesstimator.isValidNum(curSeries.opacity) ? curSeries.opacity : 0.4
                ),
                pointRadius : 0,
                borderWidth : guesstimator.isValidNum(curSeries.borderWidth) ? curSeries.borderWidth : 1,
                showLine : true, lineTension : 0, 
                //steppedLine : 'before',
            });
        };

        // Pretty-up the ends of the labels
        bins[0] = "<" + obj.options.range[0];
        bins[bins.length-1] = ">" + obj.options.range[1];

        if (!obj.chart) {
            obj.chart = new Chart(ctx, {
                type : 'line', //'bar', 
                data : {  
                    labels : bins,
                    datasets: allSeries,
                },
                options: {
                    scales : {
                        yAxes : [{type : 'linear', display : false, 
                            gridLines : false, ticks : {min : 0, max : 1.1,}}], 
                        xAxes : [{
                            display: true,
                            gridLines : {display : false, tickMarkLength : 10},
                            ticks : {maxTicksLimit : obj.options.maxTicksLimit || 9 },
                            scaleLabel : {labelString : obj.options.xLabel, display : true},
                            //barPercentage: allSeries.length,
                            //categoryPercentage: 1,
						}],
                    },
                    animation : {
                        duration : 0, // general animation time
                    },
                    hover : {
                        animationDuration : 0, // duration of animations when hovering an item
                    },
                    responsiveAnimationDuration : 0, // animation duration after a resize
                }});
        } else {
            for (j = 0; j<allSeries.length; j++) {
                for (q = 0; q<obj.chart.data.datasets.length; q++) {
                    if (allSeries[j].label === obj.chart.data.datasets[q].label) {
                        obj.chart.data.datasets[q] = allSeries[j];
                    }
                }
            }
            obj.chart.update();
        }
    };
};

/**
 * Steps : 
 *  Create new object to save model:
 *  Add one function to model object: update.
 *    Save model function as internal variable.
 *    If it doesn't exist, create object to store samples of model variables.
 *    If it doesn't exist, create  object to store new selections for each model variable.
 *      Get current selector values :
 *      If selections changed from previous selections (if they exist) : 
 *        Generate new sample for that model variable
 *    If model changed, recalculate model output based on model function
 *    If plot exists, update it; otherwise, create it in context DOM element. 
 *  Run update when called
 *  Return model object.
 * 
 *  @param {object} xDists : describe inputs to model 
 *      {itemType0 : {
 *          <option0> : {distribution : <string>, params : <array>}, 
 *          <option2> : <number>},
 *      itemType1 : ...}
 *  @param {function} modelFun : function describing how terms in selectors are combined
 *      and colors of charts.
 *      Arguments : xDists object
 *      must return {<label0> : {vals : [y0,y1,...], color : <color>}, <label1> ...}
 *  @param {string} className : name for selectors to read
 *  @param {string} chartDivID : ID for location to put chart
 *  @oaram {object} opts : 
 *      {n : number of random samples to generate,
 *      rng : range of chart; numeric 2-element array,
 *      binCount : number, number of bin for histogram
 *      chartType : string, guesstimator method name for plotting function,
 *      maxTicksLimit : max number of ticks to use, 
 *      xLabel : string, name for x-axis,
 *      }
 *  @returns {object}
 */
guesstimator.model = function (xDists, modelFun, className, chartDivID, opts){
    var gs = {"xDists" : xDists, "modelFun" : modelFun,
        "chartElementID" : chartDivID, "options" : opts || {}};
    var k;
    gs.n = opts.n || 500;

    // Choose what type of chart to make.
    gs.createOrUpdateChart = (opts.chartType && guesstimator[opts.chartType]) ? 
        guesstimator[opts.chartType](gs) : guesstimator.histogram(gs);

    gs.update = function () {
        var j, curval, item, obj, arr;

        // Initialize objects for storing selections and samples if they don't exist yet
        gs.xs = gs.xs || {};
        gs.choices = gs.choices || {};

        // Calculate array based on distribution given
        function recalculate(obj, n) {
            var arr, out;
            if (obj["distribution"]) {
                // If given a recognized transform for params, apply the transform
                arr = obj["transform"] ? 
                    guesstimator[obj["transform"]](obj["params"]) : obj["params"];
                out = guesstimator.distributions[obj["distribution"]](n, arr);
            } else if (!isNaN(obj)) {
                // Return the number if is just a number
                out = obj;
            } else {
                throw new Error("Incorrect form for: " + JSON.stringify(obj))
            }
            
            return out;
        }

        function getVal(IDstr) {
            if (!document.getElementById(IDstr)) {
                throw new Error("No DOM element found for '" + IDstr +"'")
            }
            return document.getElementById(IDstr).value;
        }

        for (item in gs.xDists) {
            if (gs.xDists[item].hasOwnProperty("fixed")) {
                // Handle fixed distributions (or constants)
                // Upon initialization only, generate array.
                if (!gs.xs[item]) {
                    gs.xs[item] = recalculate(xDists[item]["fixed"], gs.n);
                };
            } else if (gs.xDists[item].hasOwnProperty("select")) {
                // Handle fields for selecting options
                curval = getVal(item);
                // Check if same selection as before (if no selection for selector before, 
                // should return (falsy !== truthy) is true...
                if (gs.choices[item] !== curval) {
                    // Remember current selection for next update
                    gs.choices[item] = curval;
                    // calculate new entry for xDists either specifies a distribution with 
                    // params, or a number
                    gs.xs[item] = recalculate(gs.xDists[item]["select"][curval], gs.n);
                }
            } else if (gs.xDists[item].hasOwnProperty("input") && gs.xDists[item]["input"].paramIDs) {
                // Handle fields for numeric input
                curval = [];
                arr = gs.xDists[item]["input"].paramIDs;
                for (j = 0; j < arr.length; j++) {
                    curval.push(Number(getVal(arr[j])));
                }

                // Check if same selection as before (if no selection for selector before, 
                // should return (falsy !== truthy) is true...
                if (!gs.choices[item] || !gs.choices[item].every(function(x, k) {return x === curval[k]})) {
                    // Remember current selection for next update
                    gs.choices[item] = curval;
                    // calculate new entry for xDists either specifies a distribution with 
                    // params, or a number
                    gs.xDists[item]["input"]["params"] = curval;
                    gs.xs[item] = recalculate(gs.xDists[item]["input"], gs.n);
                }
            } else {
                throw new Error("Incorrect type for " + gs.xDists[item])
            }
        }

        gs.plotSeries = gs.modelFun(gs.xs);

        gs.createOrUpdateChart();
    }
    gs.update();

    document.addEventListener("change", gs.update);

    return gs;
}; 

/**
 * Range calculation : 
 * 0) User specifies series to calculate range min and max from; can specify number for min or max or both.
 * Simplest form : default enters [<number>, <number>], alternate : [<string>, <string>] (strings are names of series),
 * specify number of sds from mean (warn if <0, but choose 2)
 * 1) get raw range min and range max (can be any numbers) : user should be able to provide either min or max
 * 2) Convert raw range min and max into tidy values
 * 
 * rangeFun (arr, nSDs, obj, key) {
 *  var out = [0,0];
 *  var raw = {};
 *  if (arr is not 2 element array) {
 *      throw new Error("range must be two element array")
 *  } else if (arr.every(!isNaN ) {
 *      
 *  }
 *  for (k=0; k<2; k++) {
 *   if (typeof arr[k] === 'string') {
 *      raw[str] = {};
 *      raw[str].vals = key ? obj[str][key] : obj[str];
 *      raw[str].mean = guesstimator.mean(arr[str].vals);
 *      raw[str].sd = guessimator.stdev(arr[str].vals);
 *      raw[min
 *   }
 *  }
 * }
 * 
 *
 */

guesstimator.deepCopy = function (objParent) {
    //Save identity of object references;
    var prevObjs = [], copiedObjs = [];

    function deepCopyInner (obj) {
        var out, k;
        // Handle primitives and functions
        if ((typeof obj !== 'object') || (obj === null)) {
            out = obj;
        } else if (typeof obj === 'object') {
            // Check if encountered object before
            k = prevObjs.indexOf(obj);
            // If reference to obj already exists, set out to the equivalent reference in
            // the copied object (saved in copiedObjs array)
            if (k>=0) {
                out = copiedObjs[k];
            } 
            // If the object to be copied is not a reference to an object already copied,
            // record the references and copy the object
            else {
                // Record the reference to object to be copied.
                prevObjs.push(obj);
                // handle arrays with recursion to get arrays of objects or arrays of arrays)
                if (Array.isArray(obj)) {
                    out = [];
                    // record reference to the copy of obj (has to occur BEFORE 
                    // next call to deepCopyInner, or messes up reference order)
                    copiedObjs.push(out);
                    for (k=0; k<obj.length; k++) {
                        out.push(deepCopyInner(obj[k]));
                    };
                }
                // handle dates
                else if (obj && Object.prototype.toString.call(obj) === "[object Date]" && !isNaN(obj)) {
                    out = new Date(obj.getTime())
                    // record reference to the copy of obj (has to occur BEFORE 
                    // next call to deepCopyInner, or messes up reference order)
                    copiedObjs.push(out);
                }
                // handle other objects
                else if (obj) {
                    out = {};
                    // record reference to the copy of obj (has to occur BEFORE 
                    // next call to deepCopyInner, or messes up reference order)
                    copiedObjs.push(out);
                    for (k in obj) {
                        out[k] = deepCopyInner(obj[k]);
                    };
                }
            }
        }

        return out;
    }
    return deepCopyInner(objParent);
}

//  /**
//   * Custom error generrator
//   * From " https://humanwhocodes.com/blog/2009/03/10/the-art-of-throwing-javascript-errors-part-2/ "
//   * @param {string} message 
//   */
// function Error(message){
//     this.message = message;
// }
// Error.prototype = new Error();

// /**
//  * Extract data from dataObj sublevels and put in highest level in new object
//  * 
//  * @param {object} dataObj : {<name0> : {... <dataKey> : <data0>}...}
//  * @param {array} keyArr : array of keys (strings) to reach datarray
//  * @return object : {<name0> : <data0>, <name1> : <data1>, ...}
//  */
// guesstimator.sublevelsToPrimary = function (dataObj, keyArr) {
//     var k, key, curData = {};

//     // Extract data from dataObj sublevels and put in highest level in new object
//     for (key in dataObj) {
//         curData[key] = dataObj[key];
//         for (k = 0; k<keyArr.length; k++) {
//             if (curData[key].hasOwnProperty(keyArr[k])) {
//                 curData[key] = curData[key][keyArr[k]];
//             } else {
//                 throw new Error("Data not found for '" + key + "',  with key: " + keyArr[k]);
//             }
//         }
//     }
//     return curData;
// };

// /**
//  * Identify which series is likely to be the largest one based on random sample.
//  * 
//  * @param {object} dataObj : {<name0> : {... <dataKey> : <dataArray>}...}
//  * @param {array} keyArr : array of keys (strings) to reach datarray
//  * @param {number} n : number of random samples to take
//  * @return {string} name of first key in series of keys to reach maximum of data
//  */
// guesstimator.guessMax = function (dataObj, keyArr, n) {
//     var k, key, keyMax;
//     var mn, mnMax;
//     var curLength;
//     var positions = [];
//     // Extract data from dataObj sublevels and put in highest level in new object
//     var curData = guesstimator.sublevelsToPrimary(dataObj, keyArr);

//     // Get and check lengths of data in curData
//     for (key in dataObj) {        
//         if (Array.isArray(curData[key])) {
//             if (!curLength) {
//                 curLength = curData[key].length;
//             } else if (curLength !== curData[key].length) {
//                 throw new Error("Arrays in data object should be same length")
//             }
//         } else if (!typeof curData[key] === "number") {
//             throw new Error("Data must be arrays or numbers")
//         }
//     }

//     // Get random set of positions.
//     if (curLength) {
//         for (k = 0; k < n; k++) {
//             positions.push(Math.floor(Math.random()*curLength))
//         }
//     } else {
//         n = 1;
//         positions.push(0);
//     }

//     // Find which array (comparing scalars as length n arrays of repeated values) 
//     // has larger mean.
//     for (key in curData) {
//         mn = 0;
//         for (k = 0; k<n; k++) {
//             mn += (curData[key].length) ? curData[key][positions[k]] : curData[key];
//         }
//         mnMax = (mnMax && mn<mnMax) ? mnMax : mn;
//         keyMax = (mn === mnMax) ? key : keyMax;
//     }

//     return keyMax;
// };