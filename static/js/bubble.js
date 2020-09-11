Plotly = [];

// function buildplot() {
//     var trace1 = {
//         x: [1, 2, 3, 4],
//         y: [10, 11, 12, 13],
//         mode: 'markers',
//         marker: {
//             size: [40, 60, 80, 100]
//         }
//     };

//     var data = [trace1];

//     var layout = {
//         title: 'Marker Size',
//         showlegend: false,
//         height: 600,
//         width: 600
//     };

//     Plotly.newPlot('myDiv', data, layout);
// }

// import my geojason data 
(async function () {
    const data = await d3.json("http://127.0.0.1:5000/api/v1.0/causa-mortis");
    // Once we get a response, send the data.features object to the createFeatures function
})()

// function buildplot() {
    console.log("hello world again")
    d3.json('http://127.0.0.1:5000/api/v1.0/causa-mortis', function (err, data) {
        // Create a lookup table to sort and regroup the columns of data,
        // first by year, then by state:
        var lookup = {};

        function data(year, state,) {
            var byYear, trace;
            if (!(byYear = lookup[year])) {
                ;
                byYear = lookup[year] = {};
            }
            // If a container for this year + state doesn't exist yet,
            // then create one:
            if (!(trace = byYear[state])) {
                trace = byYear[state] = {
                    x: [],
                    y: [],
                    id: [],
                    text: [],
                    marker: { size: [] }
                };
            }
            return trace;
        }

        // Go through each row, get the right trace, and append the data:
        for (var i = 0; i < data.length; i++) {
            var datum = data[i];
            var trace = data(datum.year, datum.state);
            trace.text.push(datum.cause);
            trace.id.push(datum.cause);
            trace.x.push(datum.lifeExp);
            trace.y.push(datum.gdpPercap);
            trace.marker.size.push(datum.pop);
        }

        // Get the group names:
        var years = Object.keys(lookup);
        // In this case, every year includes every state, so we
        // can just infer the states from the *first* year:
        var firstYear = lookup[years[0]];
        var states = Object.keys(firstYear);

        // Create the main traces, one for each state:
        var traces = [];
        for (i = 0; i < states.length; i++) {
            var data = firstYear[states[i]];
            // One small note. We're creating a single trace here, to which
            // the frames will pass data for the different years. It's
            // subtle, but to avoid data reference problems, we'll slice
            // the arrays to ensure we never write any new data into our
            // lookup table:
            traces.push({
                name: states[i],
                x: data.x.slice(),
                y: data.y.slice(),
                id: data.id.slice(),
                text: data.text.slice(),
                mode: 'markers',
                marker: {
                    size: data.marker.size.slice(),
                    sizemode: 'area',
                    sizeref: 200000
                }
            });
        }

        // Create a frame for each year. Frames are effectively just
        // traces, except they don't need to contain the *full* trace
        // definition (for example, appearance). The frames just need
        // the parts the traces that change (here, the data).
        var frames = [];
        for (i = 0; i < years.length; i++) {
            frames.push({
                name: years[i],
                data: states.map(function (state) {
                    return data(years[i], state);
                })
            })
        }

        // Now create slider steps, one for each frame. The slider
        // executes a plotly.js API command (here, Plotly.animate).
        // In this example, we'll animate to one of the named frames
        // created in the above loop.
        var sliderSteps = [];
        for (i = 0; i < years.length; i++) {
            sliderSteps.push({
                method: 'animate',
                label: years[i],
                args: [[years[i]], {
                    mode: 'immediate',
                    transition: { duration: 300 },
                    frame: { duration: 300, redraw: false },
                }]
            });
        }

        var layout = {
            xaxis: {
                title: 'Life Expectancy',
                range: [30, 85]
            },
            yaxis: {
                title: 'GDP per Capita',
                type: 'log'
            },
            hovermode: 'closest',
            // We'll use updatemenus (whose functionality includes menus as
            // well as buttons) to create a play button and a pause button.
            // The play button works by passing `null`, which indicates that
            // Plotly should animate all frames. The pause button works by
            // passing `[null]`, which indicates we'd like to interrupt any
            // currently running animations with a new list of frames. Here
            // The new list of frames is empty, so it halts the animation.
            updatemenus: [{
                x: 0,
                y: 0,
                yanchor: 'top',
                xanchor: 'left',
                showactive: false,
                direction: 'left',
                type: 'buttons',
                pad: { t: 87, r: 10 },
                buttons: [{
                    method: 'animate',
                    args: [null, {
                        mode: 'immediate',
                        fromcurrent: true,
                        transition: { duration: 300 },
                        frame: { duration: 500, redraw: false }
                    }],
                    label: 'Play'
                }, {
                    method: 'animate',
                    args: [[null], {
                        mode: 'immediate',
                        transition: { duration: 0 },
                        frame: { duration: 0, redraw: false }
                    }],
                    label: 'Pause'
                }]
            }],
            // Finally, add the slider and use `pad` to position it
            // nicely next to the buttons.
            sliders: [{
                pad: { l: 130, t: 55 },
                currentvalue: {
                    visible: true,
                    prefix: 'Year:',
                    xanchor: 'right',
                    font: { size: 20, color: '#666' }
                },
                steps: sliderSteps
            }]
        };

    });
// }

// buildplot();