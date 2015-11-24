///////////////////////////////////////////////////////////////////////////
// Copyright © 2014 Esri. All Rights Reserved.
//
// Licensed under the Apache License Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
///////////////////////////////////////////////////////////////////////////

define([
  'dojo/_base/declare',
  'dojo/_base/lang',
  'dojo/_base/array',
  'dojo/dom-construct',
  'jimu/BaseWidgetSetting',
  'dijit/_WidgetsInTemplateMixin',
  'jimu/LayerInfos/LayerInfos',
  'dijit/form/CheckBox',
  'dijit/form/TextBox',
  'dijit/form/MultiSelect',
  'dijit/form/SimpleTextarea',
  'jimu/dijit/CheckBox'
  ],
  function(
    declare,lang,array,domConstruct,
    BaseWidgetSetting,
    _WidgetsInTemplateMixin,
    LayerInfos, CheckBox, TextBox, MultiSelect, SimpleTextarea) {
    return declare([BaseWidgetSetting, _WidgetsInTemplateMixin], {

      baseClass: 'jimu-widget-customlayers-setting',

      operLayerInfos: null,

      startup: function() {
        this.inherited(arguments);
        

        if (this.map.itemId) {
          LayerInfos.getInstance(this.map, this.map.itemInfo)
          .then(lang.hitch(this, function(operLayerInfos) {

            this.operLayerInfos = operLayerInfos;
            console.log("so far all good")

            // var multiLayerList = dom.byId('multiLayerList');
            

            
            array.forEach(this.operLayerInfos.getLayerInfoArray(), function(layerInfo) {
              // console.log(layerInfo.title);
              domConstruct.create('option', {
               'innerHTML': layerInfo.title,
               'value': layerInfo.title
             }, this.multiLayerList);
            }, this);

            // var myMultiSelect = new MultiSelect({ name: 'multiLayerList' }, this.multiLayerList).startup();
            // myMultiSelect.setValue(["CoastalDevelopment,CulturalCharacteristics"])
            
          }))};

          this.setConfig(this.config);

        },

        setConfig: function(config) {
          this.showLegend.setValue(config.showLegend);
                  
          for(var i = 0; i < this.multiLayerList.length; i++)
          {
            if(this.config.VisibleLayers.indexOf(this.multiLayerList.options[i].value) != -1)
              this.multiLayerList.options[i].selected = true;
          }

          this.textarea2.value = this.config.description;

          if(config.contextMenu) {
            this.zoomto.setValue(config.contextMenu.ZoomTo);
            this.transparency.setValue(config.contextMenu.Transparency);
            this.controlPopup.setValue(config.contextMenu.EnableOrDisablePopup);
            this.moveupDown.setValue(config.contextMenu.MoveupOrMovedown);
            this.table.setValue(config.contextMenu.OpenAttributeTable);
            this.url.setValue(config.contextMenu.DescriptionOrShowItemDetailsOrDownload);
          }
        },

        getConfig: function() {
          this.config.showLegend = this.showLegend.getValue();
          
          // this.config.VisibleLayers = this.myMultiSelect;
          var visibleLayers = "";
          for(var i = 0; i < this.multiLayerList.length; i++)
          {
            if(this.multiLayerList.options[i].selected == true)
            {
              console.log("Adding Item to Visible Layers")
              console.log(this.multiLayerList.options[i].value)
              visibleLayers =  visibleLayers + this.multiLayerList.options[i].value + ","
            }
              
          }
          console.log("Saving below string to config.VisibleLayers")
          console.log(visibleLayers);
          this.config.VisibleLayers = visibleLayers;
          // console.log(this.multiLayerList)

          this.config.description = this.textarea2.value;
          
          if(!this.config.contextMenu) {
            this.config.contextMenu = {};
          }
          this.config.contextMenu.ZoomTo = this.zoomto.getValue();
          this.config.contextMenu.Transparency = this.transparency.getValue();
          this.config.contextMenu.EnableOrDisablePopup = this.controlPopup.getValue();
          this.config.contextMenu.MoveupOrMovedown = this.moveupDown.getValue();
          this.config.contextMenu.OpenAttributeTable = this.table.getValue();
          this.config.contextMenu.DescriptionOrShowItemDetailsOrDownload = this.url.getValue();
          return this.config;
        }

      });
});
