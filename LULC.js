var values = [1, 2, 4, 5, 7, 8, 9, 10, 11];

// Define class names
var names = [
  "Water",
  "Trees",
  "Flooded Vegetation",
  "Crops",
  "Built Area",
  "Bare Ground",
  "Snow/Ice",
  "Clouds",
  "Rangeland"
];

// Define color palette
var palette = [
  "1a5bab",
  "358221",
  "87d19e",
  "ffdb5c",
  "ed022a",
  "ede9e4",
  "f2faff",
  "c8c8c8",
  "cfba77"
];


legend(palette, values, names);

function legend(palette, values, names) {
  // Define legend panel
  var legendPanel = ui.Panel({
    style: {
      position: 'bottom-left',
      padding: '8px 15px'
    }
  });

  // Add legend title
  var legendTitle = ui.Label({
    value: 'Legend',
    style: {
      fontWeight: 'bold',
      fontSize: '18px',
      margin: '0 0 4px 0',
      padding: '0'
    }
  });
  legendPanel.add(legendTitle);

  // Add color and label for each class
  for (var i = 0; i < values.length; i++) {
    var color = '#' + palette[i];
    var value = values[i];
    var name = names[i];
    var colorBox = ui.Label({
      style: {
        backgroundColor: color,
        padding: '8px',
        margin: '0 0 4px 0'
      }
    });
    var description = ui.Label({
      value: name,
      style: {margin: '0 0 4px 6px'}
    });
    legendPanel.add(colorBox);
    legendPanel.add(description);
  }

  // Add legend to map
  Map.add(legendPanel);
}

// Land cover dictionary for visualization
var lulcDict = {
  'LULC_class_palette': palette,
  'LULC_class_values': values,
  'LULC_class_names': names
};

// Put the land cover in a list
var lulcList = [
  { year: 2020, image: lulc2020},
  { year: 2021, image: lulc2021}
];

var lulc2017hyd = lulc2022org.visualize(imageVisParam2);
Export.image.toDrive({
  image: lulc2017hyd,
  description: 'lulc2017hyd',
  region: hyd
});

Map.addLayer(lulc2017hyd.clip(hyd));

// Show the 2019 and 2022 land cover
lulcList.map(function(dict){
  Map.addLayer(dict.image.set(lulcDict), {}, 'LULC ' + dict.year);
});

// Create land cover change map
var changeValues = [];
var changeNames = [];
var changeMap = ee.Image(0);
values.map(function(value1, index1){
  values.map(function(value2, index2){
    var changeValue = value1 * 1e2 + value2;
    changeValues.push(changeValue);
    
    var changeName = names[index1] + ' -> ' + names[index2];
    changeNames.push(changeName);
    
    changeMap = changeMap.where(lulcList[0].image.eq(value1).and(lulcList[1].image.eq(value2)), changeValue);
  });
});

// Show the change map
changeMap = changeMap.selfMask();
Map.addLayer(changeMap, { min: 101, max: 1010, palette: palette }, 'Land cover change map');

// Print the change dictionary
var changeDict = ee.Dictionary.fromLists(changeValues.map(function(value){ return String(value) }), changeNames);
print('Land cover change values', changeDict);

// Create images with variables to predict land cover change
var variables = ee.Image([
  lulc2020.rename('start'),
  lulc2021.rename('end'),
  changeMap.rename('transition'),
  ee.Image(2021).multiply(lulc2020.neq(lulc2021)).rename('year')
]);

// Property names for prediction
var propNames = ['start', 'transition', 'year'];

// Propert names to predict
var predictName = 'end';

// Sample image
var sample = variables.stratifiedSample({
  numPoints: 10000,
  classBand: 'transition', 
  scale: 100,
  region: roi
}).randomColumn();

// Split train and test
var train = sample.filter(ee.Filter.lte('random', 0.72));
var test = sample.filter(ee.Filter.gt('random', 0.72));
print(
  ee.String('Sample train: ').cat(ee.String(train.size())),
  ee.String('Sample test: ').cat(ee.String(test.size()))
);

// Build random forest model for prediction
var model = ee.Classifier.smileRandomForest(60).train(train, predictName, propNames);

// Test model accuracy
var cm = test.classify(model, 'prediction').errorMatrix('end', 'prediction');
print(
  'Confusion matrix', cm,
  ee.String('Accuracy: ').cat(ee.String(cm.accuracy())),
  ee.String('Kappa: ').cat(ee.String(cm.kappa()))
);

// Variables for predict for year 2025
var variables2022 = ee.Image([
  lulc2020.rename('start'),
  changeMap.rename('transition'),
  ee.Image(2022).multiply(lulc2021.neq(lulc2020)).rename('year')
]);

// Apply the model for the variables for 2025
var lulc2022 = variables2022.classify(model, 'LULC').set(lulcDict);
Map.addLayer(lulc2022, {}, 'LULC 2022 Prediction');

// Add lulc 2025 to LULC list
lulcList.push({ year: 2022, image: lulc2022 });

// Calculate land cover area per year
var lulcAreafeatures= ee.FeatureCollection(lulcList.map(function(dict){
  var imageArea = ee.Image.pixelArea().multiply(1e-4);
  var reduceArea = imageArea.addBands(dict.image).reduceRegion({
    reducer: ee.Reducer.sum().setOutputs(['area']).group(1, 'class'),
    scale: 100,
    geometry: roi,
    bestEffort: true
  }).get('groups');
  
  var features = ee.FeatureCollection(ee.List(reduceArea).map(function(dictionary){
    dictionary = ee.Dictionary(dictionary);
    var label = ee.List(names).get(ee.Number(dictionary.get('class')).subtract(1));
    dictionary = dictionary.set('year', ee.Number(dict.year).toInt());
    dictionary = dictionary.set('LULC', label);
    return ee.Feature(null, dictionary);
  }));
  
  return features;
})).flatten();

// Make chart for land cover area change
var chartArea = ui.Chart.feature.groups(lulcAreafeatures, 'year', 'area', 'LULC')
  .setOptions({
    title: 'LULC area changes 2013 - 2023 - 2030'
  });
print(chartArea);

var water2022org = lulc2022org.eq(1);
var water2022 = lulc2022.eq(1);

var visParam1 = {
  palette:['#FFFFFF', '#0000FF'],
  min:0,
  max:1
}

var visParam2 = {
  palette:['#FFFFFF', '#FF0000'],
  min:0,
  max:1
}

var image1Vis = water2022org.visualize(visParam1);
var image2Vis = water2022.visualize(visParam2);

var water_final = image1Vis.add(image2Vis);

// Add the blended image to the map
Map.addLayer(water_final, {}, 'Water: Ground Truth vs Prediction');

var builtup2022org = lulc2022.eq(11);
var builtup2022 = lulc2022.eq(7);

var builtArea = lulc2020.eq(11);
var builtArea = builtArea.rename(['built_area']);
var statsTotal = builtArea.reduceRegion({
    reducer: ee.Reducer.count(),
    geometry: roi,
    scale: 10,
    maxPixels: 1e10
    });
var totalPixels = statsTotal.get('built_area');

// Mask 0 pixel values and count remaining pixels.
var builtAreaMasked = builtArea.selfMask();

var statsMasked = builtAreaMasked.reduceRegion({
    reducer: ee.Reducer.count(),
    geometry: roi,
    scale: 10,
    maxPixels: 1e10
    });
var builtAreaPixels = statsMasked.get('built_area');
print(totalPixels)
print(builtAreaPixels);
var fraction = (ee.Number(builtAreaPixels).divide(totalPixels))
  .multiply(100);
print('Percentage Built Area', fraction.format('%.2f'));





var visParam3 = {
  palette:['#FFFFFF', '#FF0000'],
  min:0,
  max:1
}

var visParam4 = {
  palette:['#FFFFFF', '#00FF00'],
  min:0,
  max:1
}

var image3Vis = builtup2022org.visualize(visParam3);
var image4Vis = builtup2022.visualize(visParam4);

var builtup_final = image3Vis.add(image4Vis);

// Add the blended image to the map
Map.addLayer(builtup_final, {}, 'Built-up: Ground Truth vs Prediction');



/*var buildup_area2022_org = builtup2022org.multipy(ee.Image.pixelArea()).divide(1e6);
var buildup_area2022_pred = builtup2022.multipy(ee.Image.pixelArea()).divide(1e6);
var buildup2021 = lulc2021.eq(1).multipy(ee.Image.pixelArea()).divide(1e6);
var buildup2020 = lulc2020.eq(1).multipy(ee.Image.pixelArea()).divide(1e6);
var buildup2019 = lulc2019.eq(1).multipy(ee.Image.pixelArea()).divide(1e6);
var buildup2018 = lulc2018.eq(1).multipy(ee.Image.pixelArea()).divide(1e6);
var buildup2017 = lulc2017.eq(1).multipy(ee.Image.pixelArea()).divide(1e6);

print('Buildup original:', water2022org.multipy(ee.Image.pixelArea()).divide(1e6));
/*var data = ee.List([0, 1, 2, 3, 4, 5, 6]);
var chart = ui.Chart.array.values(data, 0, )
  .setChartType('ColumnChart');
print(chart);*/
