/* 
 * Webdungeons
 * Author: Markus J Doetsch
 * version: 0.3
*/
// TODO: refactor to module pattern / prototypal inheritance pattern

var debug           = true;
var debugMovement   = false;
var debugCreation   = false;
var debugActions    = true;
var debugTicker     = false;

var App = {
  padding         :20,
  gatherDist      :100,
  entityTypes     :["violet", "pink", "tree", "diamond", "monster", "flower", "star"],
  tickInterval    :300,
  scriptEl        : document.currentScript
};

var Character = {
  speed           : 150,
  inv             : []
};

var Entities = {};
var UI = {};
var Ticker = {
  obj             : {
    fast  : new Array(),
    slow  : new Array()
  }
};
// TODO: figure out how to get this into initial declaration...
//Ticker.obj = {fast:new Array(), slow:new Array()};

$(window).load(function(){
  liquid();
  setup();
});

$(window).resize(function(){
  liquid();
})

function setup(){
  
  createLayers('#background');
  createEntities();
  createCharacter();
  UI.create();
  bindMouse();
  bindKeyboard();
  
  
  startTicks();
  
}

function liquid(){
  App.height  = $(window).height();
  App.width   = $(window).width();
}



/* =====================================================
 * =====================  Creation  =======================
 */

function createLayers(sel){
  var layerHtml = '<div id="layer0"></div>\n<div id="layer1">\n</div><div id="layer2"></div><div id="layer3"></div>';

  if (typeof App.scriptEl === 'undefined') {
    var css = '<link rel="stylesheet" type="text/css" href="//play.mdular.com/webdungeons/webdungeons.css">';
  } else {
    var css = '<link rel="stylesheet" type="text/css" href="' + (App.scriptEl.getAttribute('src')).replace('.js', '.css') + '">';
  }
  $('head').append(css);
  $(sel).append(layerHtml);
}

function createCharacter(){
  
  Character.el = document.createElement('span');
  Character.el.setAttribute("id", "character");
  
  $char = $(Character.el);
  $('#layer1').append($char);
  
  var x = Math.round( App.width  / 2 );
  var y = Math.round( App.height / 2 );
  
  $char.css({
    left  : x,
    top   : y
  });
  
  Character.pos = $char.position();
}

function createEntities(){
  Entities.violets = new Array();
  
  // 20 random objects
  for(var i = 0; i < 20; i++){
    var x = Math.round( Math.random() * ( App.width  - App.padding ) );
    var y = Math.round( Math.random() * ( App.height - App.padding )  );
    
    
    // TODO: verify proper random mechanics. make a test with 1mill+ results
    
    // TODO: make some thing rarer than others...
    
    // TODO: properly sort entities (not all in Entities.violets...)
    var rand = Math.floor(Math.random() * App.entityTypes.length);
    
    if(debugCreation) console.log("rand: " + rand); 
    var type = App.entityTypes[rand];
    
    var entity = create( type, x, y );
    
    // TODO: createStatic, createDynamic (= some actions attached...)
    
    Entities.violets.push(entity);
    
    $('#layer1').append( entity );
    
    $(entity).css({
      left  : x,
      top   : y
    }); 
  }
}

function create(entityClass, x, y){
  var entity = document.createElement('span');
  entity.setAttribute("class", "entity " + entityClass);
  
  return entity;
}

function removeEntity(entity){
  if(debugCreation) console.log("remove entity: " + typeof(entity.getAttribute("class")));

  $(entity).fadeOut();
    
  Entities.violets.splice( Entities.violets.indexOf(entity), 1 );
  
  if(debugCreation) console.log("Entities: " + Entities.violets.length);
}


/* =====================================================
 * =====================  UI  =======================
 */

// TODO: disable selection on some layers?

UI.create = function(){
  UI.stats = document.createElement('span');
  UI.stats.setAttribute('class', 'ui');
  UI.stats.setAttribute('id', 'stats');
  
  $('#layer3').append(UI.stats);
  
  // TODO: status info.. like score..
}

UI.update = function (){
  // TODO: put collected amount in here..
  
  var output = "";
  
  for(var item in Character.inv){
    var itemObj = Character.inv[item];
    
    // TODO: devise display system.. lists?
    output += item + ": " + itemObj.amount + "<br />";
  }
  $('#stats').html(output);
}

UI.show = function(){
  // TODO: put all containers into 1 parent container and make that accessible..
  // TODO: make it so that each container (including the parent container) have show and hide methods... Classlike..
  
  $('#stats').show();
}

UI.hide = function(){
  
  $('#stats').hide();
}


/* =====================================================
 * =====================  Mouse  =======================
 */

function bindMouse(){
  // TODO: get click relative to viewport, not page
  $(document).click(function(e){
    if(debug) console.log("click: " + e.pageX + "x, " + e.pageY + "y");
    
    mouseClick(e.pageX, e.pageY);
  })
}

function mouseClick(x, y){
  // TODO: find objects under mouse
  
  moveCharacter(x, y);
}

function moveCharacter(targetX, targetY){
  /*if(Character.isMoving !== undefined){
    $char.stop();
  }*/
  /* speed = dist / time;
  0.1 px/ms      = 100px / 1000ms
  0.1px / ms    = 500px /   ???          --> 500 / 0.1 = 5000; */
  Character.pos = $char.position();
  var time = getDistance(Character.pos.left, Character.pos.top, targetX, targetY) / Character.speed * 1000;
  if(debugMovement) console.log("time: " + time);    
  
  $char.stop().animate({
    'left'        : targetX,
    'top'         : targetY 
  }, time, 'linear');
}



/* =====================================================
 * =====================  Keyboard  =======================
 */

function bindKeyboard(){
  $(document).keypress(function(e){
    if(debug) console.log("keypress:" + e.which);
    
    keyInput(e.which);
  })
}

function keyInput(key){
  if(key == 32){ // space
    spaceBar();
  }
}

function spaceBar(){
  // TODO: different possible actions bound to space bar, depending on .. stuff
  
  Character.gather();
}



/* =====================================================
 * =====================  Ticker  =======================
 */

function startTicks(){
  // final usage ex: Ticker.add(monsterMovement)
  // final usage ex: Ticker.addEffect(heal, 10) // seconds
  
  // make sure to implement proper destroy methods if objects get removed in other code
  
  
  // monsters
  // events
    // spawns
      
  // effects
    // expire time
  
  // TODO: pause interval if browser/tab is out of focus

  Ticker.add("fast", function(){
    console.log("tick!");
  }, 5);
}

Ticker.manage = function (){
  
  // TODO: make pretty (general functions for starting / stopping.. called iterating through ticker types (slow, fast))
  
  if(debugTicker) console.log("Ticker.manage called");
  
  if(Ticker.slow === undefined && Ticker.obj.slow.length > 0){
    if(debugTicker) console.log("starting Ticker.slow interval");
    
    Ticker.slow = setInterval(function(){
      Ticker.tick('slow');
    }, App.tickInterval * 5);
    
  }else if(Ticker.slow !== undefined){
    if(debugTicker) console.log("clearing Ticker.slow interval");
    
    clearInterval(Ticker.slow);
  }
  
  if(Ticker.fast === undefined && Ticker.obj.fast.length > 0){
    if(debugTicker) console.log("starting Ticker.fast interval");
    
    Ticker.fast = setInterval(function(){
      Ticker.tick('fast');
    }, App.tickInterval);
    
  }else if(Ticker.fast !== undefined){
    if(debugTicker) console.log("clearing Ticker.fast interval");
    
    clearInterval(Ticker.fast);
  }
}

Ticker.add = function(intervalType, callback, expiry){
  if(typeof(callback) === 'function'){
    var obj = {};
    obj.callback = callback;
    obj.exp = expiry || -1;
  }else{
    throw new Exception("Could not add to Ticker: no callback defined");
  }
  
  if(intervalType == "fast"){
    Ticker.obj.fast.push(obj);
  }else{
    Ticker.obj.slow.push(obj);
  }
  
  Ticker.manage();
}

Ticker.remove = function(intervalType, obj){
  Ticker.obj.fast.splice(Entities.violets.indexOf(obj), 1);
  
  Ticker.manage();
}

Ticker.tick = function(intervalType){  
  var objects;
  
  if(intervalType == 'fast'){
    objects = Ticker.obj.fast;
  }else{
    objects = Ticker.obj.slow;
  }
  
  if(objects === undefined){
    return;
  }
  
  for(var i = 0, max = objects.length; i < max; i++){
    
    // TODO: optimize expiry check & removal with only 1 if clause
    var obj = objects[i];
    if(obj.exp != 0){
      obj.callback();
      if(obj.exp != -1){
        obj.exp--;
      }
    }else{
      Ticker.remove(intervalType, obj);
    }
  }
}



/* =====================================================
 * =====================  Character Actions  =======================
 */

Character.gather = function (){
  Character.pos = $(Character.el).position();
  
  var nearest = findNearest(Entities.violets, Character.pos.left, Character.pos.top);
  if(debugActions && nearest.obj != -1) console.log("nearest: " + nearest.obj.getAttribute("class") + " distance: " + nearest.dist);


  // TODO: check if object is gatherable .. or other actions for other things.. 
  
  if(nearest.obj != -1 && nearest.dist < App.gatherDist){
    if(debugActions) console.log("gather");
    
    var item = {};
    
    // find item type from class.. (assuming its the 2nd class)
    var classes = nearest.obj.getAttribute("class").split(' ');
    
    item.type = classes[1];
    
    Character.addInventoryItem(item);
    
    removeEntity(nearest.obj);
  }else if(nearest.obj == -1){
    // respawn
    
    createEntities();
  }
    
}

Character.addInventoryItem = function (item){
  // TODO: refactor Items / Entities to proper objects.. (.type, etc...)
  // maybe type should become name and new "type" defines subtype like: enemy, consumable, etc... 
  // new "type" could be used in actions to decide wether to gather or attack.. for example
  
  // TODO: store in local storage
  
  if(Character.inv[item.type] === undefined){
    var inventoryItem = {
      amount      : 0
    };
    
    Character.inv[item.type] = inventoryItem;
  }
  
  var inventoryItem = Character.inv[item.type];
  
  inventoryItem.amount++;
  
  UI.update();
  
  console.log("addInventoryItem: " + item.type + ". New total: " + Character.inv[item.type].amount);
}

/* =====================================================
 * =====================  Tools  =======================
 */

function findNearest(objects, sourceX, sourceY){
  var nearest = {
    obj   : -1,
    dist  : 50000
  };
  
  for(var i = 0, max = objects.length; i < max; i++){
    
    var entity =  objects[i];
    
    var pos = $(entity).position();
    
    var dist = getDistance(sourceX, sourceY, pos.left, pos.top);
    
    if(dist < nearest.dist){
      nearest.obj = entity;
      nearest.dist = dist;
    }
    
  }
  
  return nearest;
}

function getDistance(sourceX, sourceY, targetX, targetY){
  var xDist = Math.max(targetX, sourceX) - Math.min(targetX, sourceX);
  var yDist = Math.max(targetY, sourceY) - Math.min(targetY, sourceY);

  if(debugMovement) console.log("distance: " + xDist + ", " + yDist);
  
  return xDist + yDist;
}
