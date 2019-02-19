var LandscapeScroller = {
    layerIds: [],
    $layerSelectors: $('#layer_selectors'),
    $layerTable: $('#layer_table'),
    $mainSvg: $("#main_svg"),
    // svgMaxX: $mainSvg.width(),
    // svgMaxY: $mainSvg.height(),
    svgMaxX: null,
    svgMaxY: null,
    activeLayerId: '',
    makeSvg: function(tag, attrs) {
        var el= document.createElementNS('http://www.w3.org/2000/svg', tag);
        for (var k in attrs)
            el.setAttribute(k, attrs[k]);
        return el;
    },
    getRandomColor: function() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    },
    getRandomInt: function(max) {
        return Math.floor(Math.random() * Math.floor(max));
    },
    getRandomNumberOfSpikes: function(max) {
        return 1+this.getRandomInt(20);
    },
    getRandomYOffset: function() {
        return this.getRandomInt(this.svgMaxY);
    },
    getRandomRange: function() {
        return this.getRandomInt(this.svgMaxY/30);
    },
    initWithRandomLayers: function() {
        var iterations = 1;
        for (var i=0; i<iterations; i++) {
            var layerData = {};
            var layerData = {
                id: 'layer_' + i,
                numbersOfSpikes: this.getRandomNumberOfSpikes(),
                yOffset: this.getRandomYOffset(100),
                yRandomRange: this.getRandomRange(),
                color: this.getRandomColor()
            };

            this.addLayer(
                'main_svg',
                layerData.id,
                this.getRandomNumberOfSpikes(),
                layerData.yOffset,
                layerData.yRandomRange,
                layerData.color
            );

            layerData.yOffset += this.getRandomInt(Math.floor(this.svgMaxY/iterations));
            this.layerIds.push(layerData);
        }

        if (this.layerIds.length >= 1) {
            this.activeLayerId = this.layerIds[0];
        }

        this.updateLayerSelectors();
    },
    updateLayerSelectors: function() {
        var tmpArray = [];
        var that = this;
        $.each(that.layerIds, function(index, layerData) {
            var tmpId = 'input_y_number_of_spikes_' + layerData.id;

            tmpArray.push('<tr class="layer_selection_box" id="selection_' + layerData.id + '">');
            tmpArray.push('   <td>' + layerData.id + '</td>');
            tmpArray.push('   <td><input id="' + tmpId + '" value="' + layerData.numbersOfSpikes + '" type="number" step="1" min="0" class="input_number_of_spikes"></td>');
            tmpArray.push('   <td><input id="' + tmpId + '" value="' + layerData.yOffset + '" type="number" class="input_y_offset"></td>');
            tmpArray.push('   <td><input id="' + tmpId + '" value="' + layerData.yRandomRange + '" type="number" min="0" class="input_y_random_range"></td>');
            tmpArray.push('   <td>');
            tmpArray.push('      <button class="btn btn-secondary btn-sm update_from_input_fields_button">Update</button>');
            tmpArray.push('      <button class="btn btn-secondary btn-sm update_with_random_values_button" title="Randomize"><span class="fa fa-dice"></span></button>');
            tmpArray.push('      <button class="btn btn-secondary btn-sm remove_button" title="Remove"><span class="fa fa-trash"></span></button>');
            // tmpArray.push('      <button class="btn btn-secondary btn-sm move_layer_up_button" title="Move one layer to front"><span class="fa fa-arrow-up"></span></button>');
            tmpArray.push('   </td>');
            tmpArray.push('</tr>');
        });

        this.$layerTable.find('tbody').html(tmpArray.join(""));
    },
    addLayer: function(svgId, layerId, numbersOfSpikes, yOffset, yRandomRange, color) {
        console.log("addLayer called with parameters");
        // console.log({svgId: this.svgId, numbersOfSpikes: this.numbersOfSpikes, yOffset:yOffset, yRandomRange:yRandomRange, color:color})

        var pointsArray = this.getRandomPointsArray(numbersOfSpikes, yOffset, yRandomRange);

        var polygon = this.makeSvg(
            'polygon',
            {id: layerId, points: pointsArray.join(" "), style:'fill:' + color, stroke: 'purple', 'stroke-width':  '2'}
        );

        document.getElementById(svgId).appendChild(polygon);
    },
    updateLayer: function(layerId, numbersOfSpikes, yOffset, yRandomRange, color) {
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
    },
    getRandomPointsArray: function(numbersOfSpikes, yOffset, yRandomRange) {
        console.log("getRandomPointsArray");
        console.log("numberOfSpikes", numbersOfSpikes);
        console.log("yOffset", yOffset);
        console.log("yRandomRange", yRandomRange);
        var pointsArray = [];

        var x = 0;
        var y = this.svgMaxY;
        var stepX = this.svgMaxX/numbersOfSpikes;
        //loop here
        for (var i = 0; i<=numbersOfSpikes; i++) {

            y = yOffset - yRandomRange + Math.floor(Math.random() * yRandomRange);
            pointsArray.push(x + ',' + y);
            x += stepX;
        }

        // Bottom right
        pointsArray.push(this.svgMaxX + ',' + this.svgMaxY);

        // Bottom left
        pointsArray.push('0,' + this.svgMaxY);

        return pointsArray;
    },
    updateFromInputFields: function ($layerSelectionBox) {
        var layerId = $layerSelectionBox.attr('id').substr(("selection_").length);
        var numbersOfSpikes = $layerSelectionBox.find(".input_number_of_spikes").val();
        var yOffset = $layerSelectionBox.find(".input_y_offset").val();
        var yRandomRange = $layerSelectionBox.find(".input_y_random_range").val();

        //TODO Get from Inputfield
        var color = getRandomColor();

        console.log("numbersOfSpikes", numbersOfSpikes);

        this.updateLayer(layerId, numbersOfSpikes, yOffset, yRandomRange, color);
    },
    init: function() {

        var that = this;

        this.svgMaxX = this.$mainSvg.width();
        this.svgMaxY = this.$mainSvg.height();

        $(document).on('click', '.update_from_input_fields_button', function(event) {
            var $layerSelectionBox = $(this).closest('.layer_selection_box');
            this.updateFromInputFields($layerSelectionBox);
        });

        $(document).on('click', '.move_layer_up_button', function(event) {
            var $layerSelectionTr = $(this).closest('tr');
            var selectionId = $layerSelectionTr.attr('id');
            //TODO Implement
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
            $layerSelectionTr.find(".input_number_of_spikes").val(this.getRandomNumberOfSpikes());
            $layerSelectionTr.find(".input_y_offset").val(this.getRandomYOffset());
            $layerSelectionTr.find(".input_y_random_range").val(this.getRandomRange());
            $layerSelectionTr.find('.update_from_input_fields_button').click();
        });

        $(document).on('click', '#add_layer_button', function(event) {
            event.preventDefault();
            console.log("add_layer_button");

            var layerData = {
                id: 'layer_' + (that.layerIds.length),
                numbersOfSpikes: that.getRandomNumberOfSpikes(),
                yOffset: that.getRandomYOffset(100),
                yRandomRange: that.getRandomRange(),
                color: that.getRandomColor()
            };

            that.addLayer(
                'main_svg',
                layerData.id,
                that.getRandomNumberOfSpikes(),
                layerData.yOffset,
                layerData.yRandomRange,
                layerData.color
            );

            layerData.yOffset += that.getRandomInt(Math.floor(that.svgMaxY/that.layerIds.length));
            that.layerIds.push(layerData);

            that.updateLayerSelectors();
        });

        $(document).on('click', '.layer_selection_box', function(event) {
            $(".layer_selection_box").removeClass("active");
            $(this).addClass("active");
        });

        $(document).on('change', '.layer_selection_box input', function(event) {
            console.log("change");
            var $layerSelectionBox = $(this).closest('.layer_selection_box');
            this.updateFromInputFields($layerSelectionBox);
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

    }
};



$( document ).ready(function() {
    LandscapeScroller.init();
    LandscapeScroller.initWithRandomLayers();
});