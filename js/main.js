var layerIds = [];
var $layerSelectors = $('#layer_selectors');
var $layerTable = $('#layer_table');
var $mainSvg = $("#main_svg");
var svgMaxX = $mainSvg.width();
var svgMaxY = $mainSvg.height();
var activeLayerId = '';

console.log("width", svgMaxX);
console.log("height", svgMaxY);

function makeSvg(tag, attrs) {
    var el= document.createElementNS('http://www.w3.org/2000/svg', tag);
    for (var k in attrs)
        el.setAttribute(k, attrs[k]);
    return el;
}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function getRandomNumberOfSpikes() {
    return 1+getRandomInt(20);
}

function getRandomYOffset() {
    return getRandomInt(svgMaxY);
}

function getRandomRange() {
    return getRandomInt(svgMaxY/30);
}

function init() {
    //var yOffset =

    //var iterations = 1+getRandomInt(5);
    var iterations = 1;
    for (var i=0; i<iterations; i++) {
        var layerData = {
            id: 'layer' + i,
            numbersOfSpikes: getRandomNumberOfSpikes(),
            yOffset: getRandomYOffset(100),
            yRandomRange: getRandomRange(),
            color: getRandomColor()
        };

        addLayer(
            'main_svg',
            layerData.id,
            getRandomNumberOfSpikes(),
            layerData.yOffset,
            layerData.yRandomRange,
            layerData.color
        );

        layerData.yOffset += getRandomInt(Math.floor(svgMaxY/iterations));
        layerIds.push(layerData);
    }

    if (layerIds.length >= 1) {
        activeLayerId = layerIds[0];
    }

    updateLayerSelectors();
}

function updateLayerSelectors() {

    var tmpArray = [];
    $.each(layerIds, function(index, layerData) {
        var tmpId = 'input_y_number_of_spikes_' + layerData.id;

        tmpArray.push('<tr class="layer_selection_box" id="selection_' + layerData.id + '">');
        tmpArray.push('   <td>' + layerData.id + '</td>');
        tmpArray.push('   <td><input id="' + tmpId + '" value="' + layerData.numbersOfSpikes + '" type="number" step="1" min="0" class="input_number_of_spikes"></td>');
        tmpArray.push('   <td><input id="' + tmpId + '" value="' + layerData.yOffset + '" type="number" class="input_y_offset"></td>');
        tmpArray.push('   <td><input id="' + tmpId + '" value="' + layerData.yRandomRange + '" type="number" min="0" class="input_y_random_range"></td>');
        tmpArray.push('   <td>');
        tmpArray.push('      <button class="update_from_input_fields_button">Update</button>');
        tmpArray.push('      <button class="update_with_random_values_button" title="Randomize"><span class="fa fa-dice"></span></button>');
        tmpArray.push('      <button class="remove_button" title="Remove"><span class="fa fa-trash"></span></button>');
        tmpArray.push('   </td>');
        tmpArray.push('</tr>');
    });

    $layerTable.find('tbody').html(tmpArray.join(""));
}

function addLayer(svgId, layerId, numbersOfSpikes, yOffset, yRandomRange, color) {
    console.log("addLayer called with parameters");
    console.log({svgId: svgId, numbersOfSpikes: numbersOfSpikes, yOffset:yOffset, yRandomRange:yRandomRange, color:color})

    var pointsArray = getRandomPointsArray(numbersOfSpikes, yOffset, yRandomRange);

    var polygon = makeSvg(
        'polygon',
        {id: layerId, points: pointsArray.join(" "), style:'fill:' + color, stroke: 'purple', 'stroke-width':  '2'}
    );

    document.getElementById(svgId).appendChild(polygon);
}

function updateLayer(layerId, numbersOfSpikes, yOffset, yRandomRange, color) {
    console.log("updateLayer");
    console.log($("#" + layerId));
    console.log("numbersOfSpikes", numbersOfSpikes);
    console.log("yOffset", yOffset);
    console.log("yRandomRange", yRandomRange);
    console.log("color", color);

    var pointsArray = getRandomPointsArray(numbersOfSpikes, yOffset, yRandomRange);
    var pointsString = pointsArray.join(" ");
    console.log("updateLayer");
    console.log("pointsString", pointsString);

    $("#" + layerId).attr("points", pointsString);
}

function getRandomPointsArray(numbersOfSpikes, yOffset, yRandomRange) {

    console.log("getRandomPointsArray");
    console.log("numberOfSpikes", numbersOfSpikes);
    console.log("yOffset", yOffset);
    console.log("yRandomRange", yRandomRange);
    var pointsArray = [];

    var x = 0;
    var y = svgMaxY;
    var stepX = svgMaxX/numbersOfSpikes;
    //loop here
    for (var i = 0; i<=numbersOfSpikes; i++) {

        y = yOffset - yRandomRange + Math.floor(Math.random() * yRandomRange);
        pointsArray.push(x + ',' + y);
        x += stepX;
    }

    // Bottom right
    pointsArray.push(svgMaxX + ',' + svgMaxY);

    // Bottom left
    pointsArray.push('0,' + svgMaxY);

    return pointsArray;
}

function updateFromInputFields($layerSelectionBox) {
    var layerId = $layerSelectionBox.attr('id').substr(("selection_").length);
    var numbersOfSpikes = $layerSelectionBox.find(".input_number_of_spikes").val();
    var yOffset = $layerSelectionBox.find(".input_y_offset").val();
    var yRandomRange = $layerSelectionBox.find(".input_y_random_range").val();

    //TODO Get from Inputfield
    var color = getRandomColor();

    console.log("numbersOfSpikes", numbersOfSpikes);

    updateLayer(layerId, numbersOfSpikes, yOffset, yRandomRange, color);
}

$(document).on('click', '.update_from_input_fields_button', function(event) {
    var $layerSelectionBox = $(this).closest('.layer_selection_box');
    updateFromInputFields($layerSelectionBox);
});

$(document).on('click', '.remove_button', function(event) {
    var $layerSelectionTr = $(this).closest('tr');
    var selectionId = $layerSelectionTr.attr('id');
    console.log("selectionId", selectionId);
    var layerId = $layerSelectionTr.attr('id').substr(("selection_").length);
    console.log("layerId", layerId);

    //TODO Implement by removing entry from layerIds
});

$(document).on('click', '.update_with_random_values_button', function(event) {
    var $layerSelectionTr = $(this).closest('tr');
    $layerSelectionTr.find(".input_number_of_spikes").val(getRandomNumberOfSpikes());
    $layerSelectionTr.find(".input_y_offset").val(getRandomYOffset());
    $layerSelectionTr.find(".input_y_random_range").val(getRandomRange());
    $layerSelectionTr.find('.update_from_input_fields_button').click();
});

$(document).on('click', '#add_layer_button', function(event) {
    event.preventDefault();
    console.log("add_layer_button");

    var layerData = {
        id: 'layer_' + (layerIds.length+1),
        numbersOfSpikes: getRandomNumberOfSpikes(),
        yOffset: getRandomYOffset(100),
        yRandomRange: getRandomRange(),
        color: getRandomColor()
    };

    addLayer(
        'main_svg',
        layerData.id,
        getRandomNumberOfSpikes(),
        layerData.yOffset,
        layerData.yRandomRange,
        layerData.color
    );

    layerData.yOffset += getRandomInt(Math.floor(svgMaxY/layerIds.length));
    layerIds.push(layerData);

    updateLayerSelectors();
});

$(document).on('click', '.layer_selection_box', function(event) {
    $(".layer_selection_box").removeClass("active");
    $(this).addClass("active");
});

$(document).on('change', '.layer_selection_box input', function(event) {
    console.log("change");
    var $layerSelectionBox = $(this).closest('.layer_selection_box');
    updateFromInputFields($layerSelectionBox);
});


$(document).on('wheel', '.layer_selection_box input', function(event) {
    console.log("event", event);
    console.log(event.originalEvent);
    if (event.originalEvent.deltaY > 0) {
        this.value = parseInt(this.value) + 10;
    } else {
        this.value = parseInt(this.value) - 10;
    }

    $(this).change();
    return false;

});

$( document ).ready(function() {
    init();
});