/** 
 * Guesstimator.model() produces plots based on inputs.
 * */

/**
 * Want plotting options for: scatter of individual values; color gradient.
 * Need: axis labelling (y: categories; x: values) and rectangles with image
 * space or gradient.
 */

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
 * @param {string} str length 7: 3 or 6 digit hex code for color plus 
 *  hash symbol ('#...... or #...)
 * @param {number} op opacity (0 to 1)
 * @return string "rgba(.,.,.,.)"
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
        op = (typeof op === 'undefined') ? 1 : op;
        // Add opacity
        rgba.push(op);

        return 'rgba('+rgba.join(',')+')';
    }
}

guesstimator.isValidNum = function (x) {
    return (typeof x !== 'undefined') && !isNaN(x)
}

guesstimator.histogram = function (obj) {
    // Create canvas for plotting
    var cvs = document.createElement("canvas");
    var ctx = cvs.getContext("2d");
    obj.chartElement.appendChild(cvs);
    // Make sure has options object within obj.
    obj.options = obj.options || {};
    // Add border demarcation.
    obj.options.border = (typeof obj.options.border === "string") ?
        obj.options.border : "1px solid #000000;";
    cvs.setAttribute("style", "border:" + obj.options.border);

    return function () {
        var bins, j, seriesName, seriesData, allSeries = [];
        var binCount = obj.options.binCount ? obj.options.binCount : Math.max(obj.n/100, 10);
        var curSeries;

        // Reformat data for Chart.js
        for (seriesName in obj.plotSeries) {
            curSeries = obj.plotSeries[seriesName];

            // Group into histogram bins
            seriesData = guesstimator.binData(
                curSeries.vals, obj.range, binCount, "normalize"
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
        bins[0] = "<" + obj.range[0];
        bins[bins.length-1] = ">" + obj.range[1];

        if (!obj.chart) {
            obj.chart = new Chart(ctx, {
                type : 'line', //'bar', 
                data : {  
                    labels : bins,
                    datasets: allSeries,
                },
                options: {
                    tooltips : {enabled : false || obj.options.showToolTips},
                    scales : {
                        yAxes : [{
                            type : 'linear', display : true,
                            gridLines : {display: false},
                            ticks : {
                                min : 0, max : 1.1, 
                                callback : function (tickVal, tickInd, ticks) {
                                    return (tickInd === 0) ? 
                                        "High" : 
                                        (tickInd === (ticks.length -1) ? "Low" : "");
                                }
                            },
                            scaleLabel : {
                                labelString : obj.options.hasOwnProperty("yLabel") ? 
                                    obj.options.yLabel : "", 
                                display : true
                            },
                        }], 
                        xAxes : [{
                            display: true,
                            gridLines : {display : false, tickMarkLength : 10},
                            ticks : {maxTicksLimit : obj.options.maxTicksLimit || 9 },
                            scaleLabel : {
                                labelString : obj.options.hasOwnProperty("xLabel") ? 
                                    obj.options.xLabel : "", 
                                display : true
                            },
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
            obj.chart.data = {  
                labels : bins,
                datasets: allSeries,
            };
            obj.chart.update();
        }
    };
};


// /**
//  * Create a 1D heatmap
//  * @param {object} obj : keys : {highThreshold : h, lowThreshold : l,
//  *  n : <integer>}; h & l are either numbers or 
//  */
// guesstimator.heatBar = function (obj) {
//     // Create canvas for plotting
//     var cvs = document.createElement("canvas");
//     obj.chartElement.appendChild(cvs);

//     return function () {
//         var arr, series, h, l, lmhArr, colors, ctx, xmid, ymid, k, start, end;
//         // Make sure has necessary options
//         function getVal (vOrID, name) {
//             var h;
//             if (vOrID) {
//                 return guesstimator.isValidNum(vOrID) ? 
//                     h : Number(guesstimator.getVal(vOrID));
//             } else {
//                 throw new Error("A " + name + 
//                     " value or input element ID string must be set.")
//             }
//         }

//         // Get values for thresholds; handle case where user sets high threshold below low.
//         h = getVal(obj.options.highThreshold, "highThreshold");
//         l = getVal(obj.options.lowThreshold, "lowThreshold");
//         if (l > h) {
//             l = h;
//             if (typeof "lowThreshold" === "string") {
//                 document.getElementById("lowThreshold").value = h;
//             } else {
//                 alert("lowThreshold was above highThreshold; lowThreshold set to highThreshold");
//             }
//         }

//         // Choose plotSeries to use.
//         if (!obj.options.hasOwnProperty("Total") && !obj.plotSeries["Total"]) {
//             throw new Error("overUnderPlot requires total series set")
//         } else {
//             // Default to using plotSeries with name "Total" if no other name specified.
//             series = obj.options["Total"] || "Total";
//             arr = obj.plotSeries[series].vals;
//         }

//         // Count values above and below low and high thresholds
//         lmhArr = arr.reduce(
//             function(lmh, x, j) {                
//                 lmh[0] += (x <= l);
//                 lmh[1] += ((x > l) && (x <= h));
//                 lmh[2] += (x > h);
//                 return lmh;
//             },
//             [0, 0, 0]
//         );

//         colors = obj.options.thresholdColors || ["#00aa00", "#ffff00", "#ff0000"]
//         // Get element in which to put chart
//         ctx = cvs.getContext("2d");
//         ctx.canvas.width = cvs.parentElement.clientWidth;
//         ctx.canvas.height = 300;
//         xmid = ctx.canvas.width/2;
//         ymid = ctx.canvas.height/2;
//         ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
//         start = 0;
//         end = 0;

//         console.log([ctx.canvas.width, xmid, cvs.width, cvs.parentElement.clientWidth])
//         for (k = 2; k >= 0; k--) {
//             ctx.beginPath();
//             ctx.moveTo(xmid, ymid);
//             start = end;
//             end += (2*Math.PI)*lmhArr[k]/arr.length;
//             ctx.arc(xmid, ymid, Math.min(xmid, ymid), start, end);
//             ctx.fillStyle = colors[k];
//             ctx.fill();
//         }
//     }
// }

/**
 * Create a pie chart with three wedges for over highthreshold, 
 * between high and low threshold, and below low threshold
 * @param {object} obj : keys : {highThreshold : h, lowThreshold : l,
 *  n : <integer>}; h & l are either numbers or 
 */
guesstimator.overUnderPlot = function (obj) {
    // Create canvas for plotting
    var cvs = document.createElement("canvas");
    obj.chartElement.appendChild(cvs);
    cvs.width = "100%";

    /** Given either number or string, either return the number
     * or check the value for the DOM object specified by the string.
     * @param {string/number} vOrID : if number, number to return;
     *  if string, get value of DOM element with that ID.
     * @param {string} name : name of parameter searched for
     * @return {number}
    */
    function getVal (vOrID, name) {
        var h;
        if (vOrID) {
            return guesstimator.isValidNum(vOrID) ? 
                h : Number(guesstimator.getVal(vOrID));
        } else {
            throw new Error("A " + name + 
                " value or input element ID string must be set.")
        }
    }

    // Function to create and update plot
    function createPlot () {
        var arr, series, h, l, lmhArr, colors, ctx, r, k, start, end;
        var dims = {};

        // Get values for thresholds; handle case where user sets high threshold below low.
        h = getVal(obj.options.highThreshold, "highThreshold");
        l = getVal(obj.options.lowThreshold, "lowThreshold");
        if (l > h) {
            l = h;
            if (typeof "lowThreshold" === "string") {
                document.getElementById("lowThreshold").value = h;
            } else {
                alert("lowThreshold was above highThreshold; lowThreshold set to highThreshold");
            }
        }

        // Choose plotSeries to use.
        if (!obj.options.hasOwnProperty("Total") && !obj.plotSeries["Total"]) {
            throw new Error("overUnderPlot requires total series set")
        } else {
            // Default to using plotSeries with name "Total" if no other name specified.
            series = obj.options["Total"] || "Total";
            arr = obj.plotSeries[series].vals;
        }

        // Count values above and below low and high thresholds
        lmhArr = arr.reduce(
            function(lmh, x, j) {                
                lmh[0] += (x <= l);
                lmh[1] += ((x > l) && (x <= h));
                lmh[2] += (x > h);
                return lmh;
            },
            [0, 0, 0]
        );

        colors = obj.options.thresholdColors || ["#005421", "#ffff00", "#ff0000"];
        labels = obj.options.thresholdLabels || ["Under budget", "Watch out", "Over budget"]

        // Get element in which to put chart
        ctx = cvs.getContext("2d");

        // Adjust size of chart
        ctx.canvas.width = Math.min(
            cvs.parentElement.clientWidth,
            guesstimator.getWindowWidth()
        );
        ctx.canvas.height = Math.min(
            300, 
            0.75*guesstimator.getWindowWidth()
        );

        // Set pie dimensions
        dims.xmid = ctx.canvas.width/2;
        dims.ymid = ctx.canvas.height/2;
        dims.r = Math.min(dims.xmid, 0.75*dims.ymid);
        dims.ycent = 1.2*dims.ymid;

        // Set background
        ctx.fillStyle = "#000000";
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
        ctx.fillRect(0,0, ctx.canvas.width, ctx.canvas.height)

        // Set start for pie.
        start = 0;
        end = -Math.PI/2;
        
        // Initialize text.
        ctx.textAlign = "center";
        dims.fontSize = dims.xmid/guesstimator.maxElementLength(labels);
        ctx.font = "bold " + dims.fontSize.toString() + 
            "px Arial, Helvetica, sans-serif";

        for (k = 2; k >= 0; k--) {
            // Make pie wedge
            ctx.beginPath();
            ctx.moveTo(dims.xmid, dims.ycent);
            start = end;
            end += (2*Math.PI)*lmhArr[k]/arr.length;
            ctx.arc(dims.xmid, dims.ycent, dims.r, start, end);
            ctx.fillStyle = colors[k];
            ctx.fill();
            // Make label
            ctx.fillText(labels[k], (1+2*k)*dims.xmid/3, 0.25*dims.ymid);
        }
    }

    // Add event listener using guesstimator event monitor.
    guesstimator.events.addListener(
        window, "resize", createPlot, 
        {set : obj.chartID, debounce : true, ms : 100});

    return createPlot
}

/** Utilities to get window or document height for different browsers */
guesstimator.getWindowHeight = function() {
    return (window.innerHeight
        || document.documentElement.clientHeight
        || document.body.clientHeight)
}
guesstimator.getWindowWidth = function() {
    return (window.innerWidth
        || document.documentElement.clientWidth
        || document.body.clientWidth)
}

/**
 * Get maximum length of elements of arr.
 * @param {array} arr : array or string
 * @return {number} Length of longest element of arr.
 */
guesstimator.maxElementLength = function(arr) {
    return arr.reduce(function (accumulator, curVal, curInd, srcArr) {
        return srcArr[curInd].length ? 
            Math.max(accumulator, srcArr[curInd].length) : 
            accumulator;
    }, 0);
}


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
 *  @param {string} chartID : ID for location to put chart
 *  @param {object} opts : 
 *      {n : number of random samples to generate,
 *      rng : range of chart; numeric 2-element array,
 *      binCount : number, number of bin for histogram
 *      chartType : string, guesstimator method name for plotting function,
 *      maxTicksLimit : max number of ticks to use, 
 *      xLabel : string, name for x-axis,
 *      }
 *  @returns {object}
 */
guesstimator.model = function (xDists, modelFun, chartID, opts){
    var gs = {
        "xDists" : guesstimator.deepCopy(xDists), 
        "modelFun" : guesstimator.deepCopy(modelFun),
        "chartID" : chartID
    };
    var k;
    gs.n = opts.n || 500;

    // Remove any listeners called with model using same DOM element for chart
    guesstimator.events.removeListenersInSet(chartID);
    
    gs.chartElement = document.getElementById(chartID); 

    // Set chart options
    gs["options"] = opts ? guesstimator.deepCopy(opts) : {};
    // clear chart HTML element and associated object
    gs["chartElement"].innerHTML = "";
    gs.chart = null;
    // Choose what type of chart to make.
    gs.options.chartType = gs.options.chartType || "histogram";
    gs.createOrUpdateChart = guesstimator[gs.options.chartType] ? 
        guesstimator[gs.options.chartType](gs) : guesstimator.histogram(gs);

    gs.update = function () {
        var j, curval, item, arr;

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

        for (item in gs.xDists) {
            if (gs.xDists[item].hasOwnProperty("fixed")) {
                // Handle fixed distributions (or constants)
                // Upon initialization only, generate array.
                if (!gs.xs[item]) {
                    gs.xs[item] = recalculate(xDists[item]["fixed"], gs.n);
                };
            } else if (gs.xDists[item].hasOwnProperty("select")) {
                // Handle fields for selecting options
                curval = guesstimator.getVal(item);
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
                    curval.push(Number(guesstimator.getVal(arr[j])));
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

        if (gs.options.chartType === "histogram") {
            gs.range = guesstimator.createRange(
                gs.plotSeries, gs.options.range, gs.options.rangeSDs, "vals");
        }

        gs.createOrUpdateChart();
    }
    gs.update();

    guesstimator.events.addListener(
        document, "change", gs.update,
        {set : chartID}
    );
    //document.addEventListener("change", gs.update);

    return gs;
}; 

guesstimator.getVal = function (IDstr) {
    if (!document.getElementById(IDstr)) {
        throw new Error("No DOM element found for '" + IDstr +"'")
    }
    return document.getElementById(IDstr).value;
}

/**
 * Create a range array based on data or fixed numbers.
 * @param {object} obj : data object : {set1 : , set2 : ...};
 *  dataseries* can be either array or object with array specified by key str
 * @param {array} arr : 2 element array; each element should be either a number 
 *  or a name for a data set in obj.
 * @param {number} sds : min number of standard deviations between data mean and range boundary
 * @param {string} str : optional key to find data array for dataset in obj if data is 
 *  nested, e.g. obj = {set1 : {values : [x1, x2...], color : string, ...}, set2 : {...}, ...}
 * @return array with two numeric values.
 */
guesstimator.createRange = function (obj, arr, sds, str) {
    var rng = [], k, params = {}, curdata, x, xscale;
    var sds = guesstimator.isValidNum(sds) ? sds : 1.5;

    for (k = 0; k<2; k++) {
        // If arr given with a string, check if that is a name for dataset in obj
        if (obj.hasOwnProperty(arr[k])) {
            // If so, if it has not been done before, calculate parameters to define
            // range min and max.
            if (!params.hasOwnProperty(arr[k])) {
                curdata = (typeof str !== undefined) ? obj[arr[k]][str] : obj[arr[k]]
                params[arr[k]] = {
                    "mean" : guesstimator.mean(curdata),
                    "sd" : guesstimator.stdev(curdata),
                }
            }
            // Calculate raw range in or max
            x = params[arr[k]]["mean"] + sds * params[arr[k]]["sd"] *((k === 1) ? 1 : -1);

            // Round to nearest larger/smaller decimal significant figure
            xscale = Math.pow(10, Math.floor(Math.log(Math.abs(x))/Math.log(10)) );
            rng.push( (k===1) ? ( xscale * Math.ceil(x/xscale) ) : ( xscale * (Math.floor(x/xscale)) ) );
            
        } else if (guesstimator.isValidNum(arr[k])) {
            rng.push(arr[k]);
        }
    }

    return rng;
};

/**
 * Copy an object by value (handles circular or anastamosing
 * internal reference structures).
 * It only copies enumerable properties of object.
 * It can copy functions, but cannot copy hidden state variables (e.g.
 * for closures).
 * @param {any} objParent : can be number, string, date, array, object, etc.
 *  objects and arrays can contain other objects or arrays. 
 * @return {any} Same type as parent
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

/** Create object to manage event listeners associated with guesstimator script */
guesstimator.events = (function () {
    var ev = {};
    // Keep track of number of listeners created to make unique keys.
    var numListenersCreated = 0;
    // Store current listeners
    ev.listeners = {};

    /**
     * Function to prevent repeated calls to resize (or other event listeners) during
     * manual size changes (or other events). Code from BGerrissen on Stack Overflow (
     *    https://stackoverflow.com/questions/4298612/jquery-how-to-call-resize-event-only-once-its-finished-resizing
     *)
    * @param {function} func : function to call with event listener
    * @param {number} timeout : ms to wait to call.
    */
    function debounce( func , timeout ) {
        var timeoutID , timeout = timeout || 200;
        return function () {
            var scope = this , args = arguments;
            clearTimeout( timeoutID );
            timeoutID = setTimeout( function () {
                func.apply( scope , Array.prototype.slice.call( args ) );
            } , timeout );
        }
    };

    /**
     * Add a listener to guesstimator.events object
     * @param {DOM object} el : DOM element to add event listener to
     * @param {string} str : event type (e.g. 'resize')
     * @param {function} func : function
     * @param {object} opts : optional arguments
     *  * @param {string/number} set : determine which set to add listener to
        * @param {boolean} debounce : determine whether to delay application
        *  with debounce; must be strictly true to apply.
        * @param {number} ms : number of milliseconds; defaults to 200 if not
        *  given or not a number
     * @returns {string} Name of key in list of event listeners 
     *  (guesstimator.events.listeners)
     */
    ev.addListener = function (el, str, func, opts) {
        // Create a name for the listener.
        var obj = {target : el, event : str};
        var opts = opts || {};
        // Need unique names that will stay unique if a listener is removed.
        var key = "L";
        numListenersCreated ++;
        key += numListenersCreated;

        // Set debounce time.
        var ms = typeof opts.ms === "number" ? opts.ms : 200;
        // Debounce listener if db is strictly true.
        obj.listener = (opts.debounce === true) ? debounce(func, ms) : func;

        // Add event listener
        el.addEventListener(str, obj.listener);

        // If set specified, add set to listener object and list listener in event set
        if (typeof opts.set === "string" || typeof opts.set === "number") {
            obj.set = opts.set;
            // or create event set if it doesn't exist
            if (!ev.sets) {
                ev.sets = {};
            }
            if (!ev.sets[opts.set]) {
                ev.sets[opts.set] = {};
            }
            // Just set value to true to avoid excess references to object
            ev.sets[opts.set][key] = true; 
        }
        
        // Add listener object to ev.listeners and return key if want to remove
        // later.
        ev.listeners[key] = obj;
        return key;
    };

    /** Remove all event listeners associated with guesstimator. 
     * 
    */
    ev.removeAllGuesstimatorListeners = function () {
        var key, obj;
        for (key in ev.listeners) {
            obj = ev.listeners[key];
            // Remove event listener associated with key.
            obj.target.removeEventListener(
                obj.event, obj.listener);
        }
    };

    /**
     * Remove a named set of listeners
     * @param {string} str : name of set of listeners in events.sets
     */
    ev.removeListenersInSet = function (str) {
        var key;
        // Remove each event in set if set exists.
        if (ev.sets && ev.sets[str]) {
            // remove each listener (deletes key from ev.sets[str])
            for (key in ev.sets[str]) {
                ev.removeGuesstimatorListener(key)
            }
            // Delete key for set from ev.sets
            delete ev.sets[str];
        }
    }

    /** Remove a single event listener by its name. 
     * @param {string} key : name of object in 
     * guesstimator.events.listeners associated with event listener
    */
    ev.removeGuesstimatorListener = function (key) {
        var obj = ev.listeners[key];
        // remove listener
        obj.target.removeEventListener(obj.event, obj.listener);
        // remove from listener set if defined
        if (obj.set) {
            delete ev.sets[obj.set][key]
        }
        // Remove key from ev.listeners object
        delete ev.listeners[key];
    }

    return ev;
})();