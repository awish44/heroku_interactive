    
function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel
  d3.json(`/metadata/${sample}`).then((data) => { // Use `d3.json` to fetch the metadata for a sample
    var samplepanel = d3.select("#sample-metadata"); // Use d3 to select the panel with id of `#sample-metadata`
    samplepanel.html("") // Use `.html("") to clear any existing metadata
    Object.entries(data).forEach(([key, value]) => { // Use `Object.entries` to add each key and value pair to the panel
    samplepanel.append("p").text(`${key} : ${value}`);
    });
  });
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json(`/samples/${sample}`).then((data) => {
    var otuIds = data.otu_ids;
    var sampleValues = data.sample_values;
    var otuLabels = data.otu_labels;

    // @TODO: Build a Bubble Chart using the sample data
    var bubbleLayout = {
      xaxis: { title: "OTU ID" }
    };
    var bubbleData = [
      {
        x: otuIds,
        y: sampleValues,
        text: otuLabels,
        mode: "markers",
        marker: {
          size: sampleValues,
          color: otuIds,
        }
      }
    ];

    Plotly.plot("bubble", bubbleData, bubbleLayout);

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    var pieData = [
      {
        values: sampleValues.slice(0, 10),
        labels: otuIds.slice(0, 10),
        hovertext: otuLabels.slice(0, 10),
        type: "pie"
      }
    ];

    var pieLayout = {
      height: 900,
      width: 900
    };

    // var pieLayout = {
    //   margin: { t: 0, l: 0 }
    // };

    Plotly.plot("pie", pieData, pieLayout);
  });
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
