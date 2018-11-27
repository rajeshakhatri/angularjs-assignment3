(function () {
'use strict';

angular.module('NarrowItDownApp', [])
.controller('NarrowItDownController', NarrowItDownController)
.service('MenuSearchService', MenuSearchService)
.constant('ApiBasePath', "https://davids-restaurant.herokuapp.com")
.directive('listItem', ListItem);


function ListItem() {
  var ddo = {
    templateUrl: 'listItem.html',
    scope: {
      list: '<myList'
    }

  };

  return ddo;
}

NarrowItDownController.$inject = ['MenuSearchService'];
function NarrowItDownController(MenuSearchService) {
  var menu = this;
  var mitems = [];
  menu.founditems = [];
  menu.searchTerm = "";
  menu.notFound = "";

  var current_item ="";

  menu.removeItem = function (itemIndex)
  {
        menu.founditems.splice(itemIndex,1)
  }

menu.getMatchedMenuItems = function ()
{
  menu.founditems = []
  //menu.notFound =""
  if ( menu.searchTerm != "")
  {
   var promise = MenuSearchService.getMatchedMenuItems(menu.searchTerm );

     promise.then(function (response) {
       //menu.categories = response.data;
       mitems = response;
       //console.log(mitems);

       for (var j = 0; j < mitems.data.menu_items.length; j++){
        //console.log(mitems.data.menu_items[j]);
        //console.log(mitems.data.menu_items[j].name);

         var menuitem = {
           item: mitems.data.menu_items[j].name,
           shortname: mitems.data.menu_items[j].short_name,
           description: mitems.data.menu_items[j].description
         };

         current_item = mitems.data.menu_items[j].name;
         //console.log(current_item.length);
          //current_item = mitems.data.menu_items[j].name.toString();
          //console.log(current_item + "->" + current_item.toLowerCase().indexOf("chicken"));
          if ( current_item.toLowerCase().indexOf( menu.searchTerm) > 0 )
          {
              //founditems.splice(founditems.length,0,mitems.data.menu_items[j].name);
              menu.founditems.push(menuitem);
          }
       }


       for (var j = 0; j < menu.founditems.length; j++){
         console.log( menu.founditems[j]);
          //console.log( menu.founditems[j].item + '-' + menu.founditems[j].description );
       }

       if (menu.founditems.length == 0)
       {
        menu.notFound = "Nothing found"
       }

     })
     .catch(function (error) {
       console.log("Something went terribly wrong.");
     });
   } // if condition
   else {
     console.log(" search term is blank")
     menu.notFound = "Nothing found"
   }
 }// function  menu.getMatchedMenuItems

}


MenuSearchService.$inject = ['$http', 'ApiBasePath'];
function MenuSearchService($http, ApiBasePath) {
  var service = this;

  service.getMatchedMenuItems = function (searchTerm) {
    var response = $http({
      method: "GET",
      url: (ApiBasePath + "/menu_items.json")
            // params: {
      //   category: shortName
      // }
    });
    //console.log ( response);
    //console.log ( mitems);
    return response;
  };

}

})();
