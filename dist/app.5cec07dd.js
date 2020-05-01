// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"src/objects/Point.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Point =
/** @class */
function () {
  function Point(row, column) {
    this.col = column;
    this.row = row;
    this.avoid = false;
  }

  Point.prototype.Add_Point = function (toAdd) {
    return new Point(this.row + toAdd.row, this.col + toAdd.col);
  };

  Point.prototype.Inside_Boundries = function (rows, columns) {
    if (this.row < 0 || this.row >= rows || this.col < 0 || this.col >= columns) {
      return false;
    }

    return true;
  };

  Point.prototype.ToString = function () {
    return this.row + "-" + this.col;
  };

  return Point;
}();

exports.Point = Point;
},{}],"src/objects/Field.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Point_1 = require("./Point");

var Field =
/** @class */
function () {
  function Field(row, col) {
    this.pnt = new Point_1.Point(row, col);
    this.btn = this.CreateFieldButton(this.pnt);
    this.isBomb = false;
    this.isFlag = false;
    this.isHidden = true;
    this.nBombs = 0;
  }

  Field.prototype.RestartField = function () {
    this.isBomb = false;
    this.isFlag = false;
    this.isHidden = true;
    this.nBombs = 0;
    this.btn.setAttribute('class', 'hidden');
    this.btn.setAttribute('style', '');
    this.btn.innerHTML = '';
  };

  Field.prototype.CreateFieldButton = function (pnt) {
    var btn = document.createElement('button');
    btn.setAttribute('id', pnt.ToString());
    btn.setAttribute('class', 'hidden');
    return btn;
  };

  return Field;
}();

exports.Field = Field;
},{"./Point":"src/objects/Point.ts"}],"src/objects/MapGenerator.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Point_1 = require("./Point");

var MapGenerator =
/** @class */
function () {
  function MapGenerator(rows, cols, bombs) {
    this.offset = [new Point_1.Point(-1, -1), new Point_1.Point(-1, 0), new Point_1.Point(-1, 1), new Point_1.Point(0, -1), new Point_1.Point(0, 1), new Point_1.Point(1, -1), new Point_1.Point(1, 0), new Point_1.Point(1, 1)];
    this.rows = rows;
    this.cols = cols;
    this.bombs = bombs;
    this.bombCordsConst = this.InitBombCordsConst(this.rows, this.cols);
  }

  MapGenerator.prototype.GenerateMap = function (firstClick, map) {
    var updatedMap = map.slice();
    var workBombCords = this.bombCordsConst.slice();
    var rows = this.rows;
    var cols = this.cols;
    var offset = this.offset;
    workBombCords[firstClick.row * cols + firstClick.col].avoid = true;
    var tempPoint;
    offset.forEach(function (offPoint) {
      tempPoint = firstClick.Add_Point(offPoint);

      if (tempPoint.Inside_Boundries(rows, cols)) {
        workBombCords[tempPoint.row * cols + tempPoint.col].avoid = true;
      }
    });
    workBombCords = workBombCords.filter(function (x) {
      return x.avoid === false;
    });
    var chosenBombs = this.GenerateBombCord(workBombCords);
    chosenBombs.forEach(function (pnt) {
      var fieldWithBomb = updatedMap[pnt.row][pnt.col];
      fieldWithBomb.isBomb = true;
      offset.forEach(function (offPoint) {
        var toAddBomb = pnt.Add_Point(offPoint);

        if (toAddBomb.Inside_Boundries(rows, cols)) {
          var fieldNeighBomb = updatedMap[toAddBomb.row][toAddBomb.col];
          fieldNeighBomb.nBombs += 1;
        }
      });
    });
    console.log(updatedMap);
    console.log(map);
    return updatedMap;
  };

  MapGenerator.prototype.GenerateBombCord = function (bombCords) {
    var chosenPoints = [];
    var index;

    for (var bombCount = 0; bombCount < this.bombs; bombCount++) {
      index = this.GetRandomIndex(0, bombCords.length);
      chosenPoints.push(bombCords[index]);
      bombCords.splice(index, 1);
    }

    return chosenPoints;
  };

  MapGenerator.prototype.GetRandomIndex = function (min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  };

  MapGenerator.prototype.InitBombCordsConst = function (rows, cols) {
    var point;
    var array = [];

    for (var row = 0; row < this.rows; row++) {
      for (var column = 0; column < this.cols; column++) {
        point = new Point_1.Point(row, column);
        array.push(point);
      }
    }

    return array;
  };

  return MapGenerator;
}();

exports.MapGenerator = MapGenerator;
},{"./Point":"src/objects/Point.ts"}],"../../../AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/bundle-url.js":[function(require,module,exports) {
var bundleURL = null;

function getBundleURLCached() {
  if (!bundleURL) {
    bundleURL = getBundleURL();
  }

  return bundleURL;
}

function getBundleURL() {
  // Attempt to find the URL of the current script and use that as the base URL
  try {
    throw new Error();
  } catch (err) {
    var matches = ('' + err.stack).match(/(https?|file|ftp|chrome-extension|moz-extension):\/\/[^)\n]+/g);

    if (matches) {
      return getBaseURL(matches[0]);
    }
  }

  return '/';
}

function getBaseURL(url) {
  return ('' + url).replace(/^((?:https?|file|ftp|chrome-extension|moz-extension):\/\/.+)\/[^/]+$/, '$1') + '/';
}

exports.getBundleURL = getBundleURLCached;
exports.getBaseURL = getBaseURL;
},{}],"../../../AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/css-loader.js":[function(require,module,exports) {
var bundle = require('./bundle-url');

function updateLink(link) {
  var newLink = link.cloneNode();

  newLink.onload = function () {
    link.remove();
  };

  newLink.href = link.href.split('?')[0] + '?' + Date.now();
  link.parentNode.insertBefore(newLink, link.nextSibling);
}

var cssTimeout = null;

function reloadCSS() {
  if (cssTimeout) {
    return;
  }

  cssTimeout = setTimeout(function () {
    var links = document.querySelectorAll('link[rel="stylesheet"]');

    for (var i = 0; i < links.length; i++) {
      if (bundle.getBaseURL(links[i].href) === bundle.getBundleURL()) {
        updateLink(links[i]);
      }
    }

    cssTimeout = null;
  }, 50);
}

module.exports = reloadCSS;
},{"./bundle-url":"../../../AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/bundle-url.js"}],"src/styles.scss":[function(require,module,exports) {
var reloadCSS = require('_css_loader');

module.hot.dispose(reloadCSS);
module.hot.accept(reloadCSS);
},{"./img\\noise.png":[["noise.0957db02.png","src/img/noise.png"],"src/img/noise.png"],"_css_loader":"../../../AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/css-loader.js"}],"src/components/game.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Game = function Game() {
  var template = "\n    <div class=\"background\">\n        <div class=\"gameContainer\" id=\"gameContainer\">\n            <div class=\"menu\">\n                <div class=\"counter\">\n                    <h1 id=\"bombCounter\">091</h1>\n                </div>\n                <div>\n                    <button class=\"uibtn\" id=\"newGameBtn\"> \n                        <span class=\"material-icons\" style=\"font-size:36px;\">\n                            fiber_new\n                        </span>\n                    </button> \n                    <button class=\"uibtn\" id=\"settingBtn\">\n                        <span class=\"material-icons\" style=\"font-size:36px;\">\n                            settings\n                        </span>\n                    </button>\n                </div>\n                <div class=\"counter\">\n                    <h1 id=\"timeCounter\">012</h1>\n                </div>\n            </div>\n            \n            <div class=\"grid\" id=\"grid\">\n            </div>\n            \n        </div>  \n\n        <div class=\"dropdown-content\" id=\"dropdown-content\">\n            <div class=\"bg\">\n            </div>\n\n\n            <h1>Mineswepper</h1>\n            <button id=\"changeSizeBtn\">Change size</button>\n            <input type=\"range\" min=\"10\" max=\"50\" value=\"30\" class=\"slider rangeInput\" id=\"squareSizeSlider\">\n            <label for\"nameInput\">Nickname</label>\n            <input class=\"nameInput\" type=\"text\" id=\"nameInput\">\n            </div>\n        \n    </div>\n    ";
  return template;
};

exports.default = Game;
},{}],"src/app.ts":[function(require,module,exports) {
"use strict";

var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

var __generator = this && this.__generator || function (thisArg, body) {
  var _ = {
    label: 0,
    sent: function sent() {
      if (t[0] & 1) throw t[1];
      return t[1];
    },
    trys: [],
    ops: []
  },
      f,
      y,
      t,
      g;
  return g = {
    next: verb(0),
    "throw": verb(1),
    "return": verb(2)
  }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
    return this;
  }), g;

  function verb(n) {
    return function (v) {
      return step([n, v]);
    };
  }

  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");

    while (_) {
      try {
        if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
        if (y = 0, t) op = [op[0] & 2, t.value];

        switch (op[0]) {
          case 0:
          case 1:
            t = op;
            break;

          case 4:
            _.label++;
            return {
              value: op[1],
              done: false
            };

          case 5:
            _.label++;
            y = op[1];
            op = [0];
            continue;

          case 7:
            op = _.ops.pop();

            _.trys.pop();

            continue;

          default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
              _ = 0;
              continue;
            }

            if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }

            if (op[0] === 6 && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }

            if (t && _.label < t[2]) {
              _.label = t[2];

              _.ops.push(op);

              break;
            }

            if (t[2]) _.ops.pop();

            _.trys.pop();

            continue;
        }

        op = body.call(thisArg, _);
      } catch (e) {
        op = [6, e];
        y = 0;
      } finally {
        f = t = 0;
      }
    }

    if (op[0] & 5) throw op[1];
    return {
      value: op[0] ? op[1] : void 0,
      done: true
    };
  }
};

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Point_1 = require("./objects/Point");

var Field_1 = require("./objects/Field");

var MapGenerator_1 = require("./objects/MapGenerator");

require("./styles.scss");

var game_1 = __importDefault(require("./components/game"));

var mapGrid;
var mapGenerator;
var firstClick = true;
var gameOver = false;
var run = false;
var mouseDownField;
var lmbDown = false;
var rmbDown = false;
var rows = 0;
var columns = 0;
var bombs = 0;
var chosenSize = 0;
var squareSize = 32;
var time;
var bombsRemaining;
var shownFieldsCount;
var bombCounter;
var timeCounter;
var slider;
var offset = [new Point_1.Point(-1, -1), new Point_1.Point(-1, 0), new Point_1.Point(-1, 1), new Point_1.Point(0, -1), new Point_1.Point(0, 1), new Point_1.Point(1, -1), new Point_1.Point(1, 0), new Point_1.Point(1, 1)];

var app = function app() {
  var _a, _b, _c;

  document.getElementById('root').innerHTML = game_1.default();
  (_a = document.getElementById('newGameBtn')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', NewGame);
  document.getElementById('changeSizeBtn').addEventListener('click', SetLevel);
  (_b = document.getElementById('settingBtn')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', SettingsWindowOpener);
  (_c = document.getElementById('dropdown-content')) === null || _c === void 0 ? void 0 : _c.addEventListener('mouseleave', SettingsWindowOpener);
  var nameInput = document.getElementById('nameInput');
  nameInput.addEventListener('input', SetNickname);
  var nick = window.localStorage.getItem('name');

  if (nick != null && nick.trim().length != 0) {
    nameInput.value = nick;
  }

  slider = document.getElementById('squareSizeSlider');
  console.log(slider);
  slider.addEventListener('input', SetSquareSize);
  bombCounter = document.getElementById('bombCounter');
  timeCounter = document.getElementById('timeCounter');
  SetLevel();
};

app();
var settingsOpen = false;

function SetNickname(event) {
  var nick = event.target.value;

  if (nick.length < 50) {
    window.localStorage.setItem('name', "" + event.target.value);
  }

  console.log(window.localStorage.getItem('name'));
}

function SettingsWindowOpener(event) {
  var _a, _b;

  if (settingsOpen) {
    (_a = document.getElementById('dropdown-content')) === null || _a === void 0 ? void 0 : _a.setAttribute('style', 'display: none;');
    settingsOpen = !settingsOpen;
  } else {
    (_b = document.getElementById('dropdown-content')) === null || _b === void 0 ? void 0 : _b.setAttribute('style', 'display: flex;');
    settingsOpen = !settingsOpen;
  }
}

function SetSquareSize(event) {
  if (event === void 0) {
    event = null;
  }

  squareSize = slider === null || slider === void 0 ? void 0 : slider.value;

  if (squareSize * columns + 10 < 236) {
    squareSize = 226 / columns;

    if (event) {
      return;
    }
  }

  var grid = document.getElementById('grid');
  grid.setAttribute('style', "grid-template-columns: repeat(" + columns + ", " + squareSize + "px);\n         grid-template-rows: repeat(" + rows + ", " + squareSize + "px);\n         font-size: " + (squareSize - 2) + "px");
}

function StartTimeCounter() {
  return __awaiter(this, void 0, void 0, function () {
    var interval;
    return __generator(this, function (_a) {
      time = 0;
      interval = setInterval(function () {
        if (run) {
          time++;
          updateCounters();
        } else {
          clearInterval(interval);
        }
      }, 1000);
      return [2
      /*return*/
      ];
    });
  });
}

;

function SetLevel() {
  if (chosenSize < 5) {
    chosenSize++;
  } else {
    chosenSize = 1;
  }

  switch (chosenSize) {
    case 1:
      SetSize(9, 9, 10);
      return;

    case 2:
      SetSize(16, 16, 40);
      return;

    case 3:
      SetSize(16, 30, 99);
      return;

    case 4:
      SetSize(38, 60, 500);
      return;

    case 5:
      SetSize(100, 60, 999);
      return;
  }
}

function updateCounters() {
  bombCounter.innerHTML = ("00" + ("" + bombsRemaining)).slice(-3);

  if (time < 1000) {
    timeCounter.innerHTML = ("00" + ("" + time)).slice(-3);
  } else {
    timeCounter.innerHTML = "999";
  }
}

function SetSize(r, c, b) {
  rows = r;
  columns = c;
  bombs = b;
  SetSquareSize();
  RestartGameInfo();
  mapGrid = new Array(rows);

  for (var i = 0; i < rows; i++) {
    mapGrid[i] = new Array(columns);
  }

  console.log(mapGrid);
  grid.innerHTML = '';

  for (var i = 0; i < rows; i++) {
    for (var j = 0; j < columns; j++) {
      mapGrid[i][j] = new Field_1.Field(i, j);
      var btn = mapGrid[i][j].btn;
      btn.addEventListener('mousedown', MouseDown);
      btn.addEventListener('mouseup', MouseUp);
      btn.addEventListener('contextmenu', ContextMenu);
      grid.append(btn);
    }
  }

  mapGenerator = new MapGenerator_1.MapGenerator(rows, columns, bombs);
}

function ContextMenu(event) {
  event.preventDefault();
}

var temporaryShownFields = [];

function MouseDown(event) {
  event.preventDefault();

  if (gameOver) {
    return;
  }

  console.log(lmbDown);
  console.log(rmbDown);

  if (lmbDown || rmbDown) {
    return;
  }

  var btn = event.target;
  var cords = btn.attributes[0].value.split('-');
  var row = parseInt(cords[0]);
  var col = parseInt(cords[1]);
  mouseDownField = mapGrid[row][col];

  if (event.button == 0) {
    lmbDown = true;

    if (!mouseDownField.isFlag && mouseDownField.isHidden) {
      mouseDownField.btn.setAttribute('class', 'shown');
    } else if (!mouseDownField.isHidden && !mouseDownField.isFlag) {
      offset.forEach(function (offpoint) {
        var tempPoint = mouseDownField.pnt.Add_Point(offpoint);

        if (tempPoint.Inside_Boundries(rows, columns)) {
          var tempField = mapGrid[tempPoint.row][tempPoint.col];

          if (tempField.isHidden && !tempField.isFlag) {
            tempField.btn.setAttribute('class', 'shown');
            temporaryShownFields.push(tempField);
          }
        }
      });
    }
  } else if (event.button == 2) {
    rmbDown = true;

    if (mouseDownField.isHidden) {
      RmbClick(mouseDownField);
    }
  }
}

function MouseUp(event) {
  event.preventDefault();

  if (gameOver == true) {
    return;
  }

  if (event.button == 2) {
    rmbDown = false;
  }

  if (event.button == 0) {
    lmbDown = false;
    var btn = event.target;
    var cords = btn.attributes[0].value.split('-');
    var row = parseInt(cords[0]);
    var col = parseInt(cords[1]);
    var clickedField = mapGrid[row][col];

    if (clickedField.pnt != mouseDownField.pnt) {
      if (mouseDownField.isHidden && !mouseDownField.isFlag) {
        mouseDownField.btn.setAttribute('class', 'hidden');
        return;
      } else if (!mouseDownField.isHidden && !mouseDownField.isFlag) {
        if (temporaryShownFields.length != 0) {
          temporaryShownFields.forEach(function (field) {
            field.btn.setAttribute('class', 'hidden');
          });
          temporaryShownFields = [];
        }
      }
    }

    if (firstClick) {
      FirstClickEvent();
    }

    if (clickedField.isHidden && !clickedField.isFlag) {
      LmbClickHidden(clickedField); // mouseDownField.btn.removeEventListener('mouseleave', MouseLeave)
    } else if (!clickedField.isHidden) {
      LmbClickShown(clickedField);
    }
  }
}

function RestartGameInfo() {
  firstClick = true;
  run = false;
  gameOver = false;
  bombsRemaining = bombs;
  time = 0;
  shownFieldsCount = 0;
  updateCounters();
}

function NewGame() {
  RestartGameInfo();

  for (var i = 0; i < rows; i++) {
    for (var j = 0; j < columns; j++) {
      mapGrid[i][j].RestartField();
    }
  }
}

function FirstClickEvent() {
  firstClick = false;
  run = true;
  mapGrid = mapGenerator.GenerateMap(mouseDownField.pnt, mapGrid);
  StartTimeCounter();
}

var colors = ['lightgray', 'darkcyan', 'green', 'darkred', 'darkslateblue', 'brown', 'seagreen', 'orange', 'black'];

function LmbClickHidden(clickedField) {
  var btn = clickedField.btn;

  if (clickedField.isBomb) {
    btn.innerHTML = 'B';
    btn.setAttribute('class', 'bomb');
    GameOver(false);
    return;
  }

  if (clickedField.isFlag) {
    return;
  }

  clickedField.isHidden = false;
  clickedField.btn.innerHTML = clickedField.nBombs == 0 ? "" : "" + clickedField.nBombs;
  clickedField.btn.setAttribute('style', "color: " + colors[clickedField.nBombs] + ";");
  clickedField.btn.setAttribute('class', 'shown');
  shownFieldsCount++;

  if (clickedField.nBombs == 0) {
    offset.forEach(function (offPoint) {
      var tempPoint = clickedField.pnt.Add_Point(offPoint);

      if (tempPoint.Inside_Boundries(rows, columns)) {
        var tempField = mapGrid[tempPoint.row][tempPoint.col];

        if (tempField.isHidden == true && tempField.isFlag == false) {
          LmbClickHidden(tempField);
        }
      }
    });
  }

  if (shownFieldsCount == columns * rows - bombs) {
    GameOver(true);
  }
}

function LmbClickShown(clickedField) {
  var nearBombs = clickedField.nBombs;
  var flaggedFields = 0;
  var safeFields = [];
  offset.forEach(function (offPoint) {
    var tempPoint = clickedField.pnt.Add_Point(offPoint);

    if (!tempPoint.Inside_Boundries(rows, columns)) {
      return;
    }

    var fieldToBeClicked = mapGrid[tempPoint.row][tempPoint.col];

    if (fieldToBeClicked.isFlag) {
      flaggedFields++;
    } else if (fieldToBeClicked.isHidden) {
      safeFields.push(fieldToBeClicked);
    }
  });

  if (flaggedFields == nearBombs) {
    safeFields.forEach(function (fTC) {
      if (fTC.isHidden) {
        LmbClickHidden(fTC);
      }
    });
  } else {
    console.log(temporaryShownFields);

    if (temporaryShownFields.length != 0) {
      temporaryShownFields.forEach(function (field) {
        field.btn.setAttribute('class', 'hidden');
      });
    }
  }

  temporaryShownFields = [];
}

function RmbClick(clickedField) {
  if (clickedField.isHidden) {
    if (firstClick) {
      FirstClickEvent();
    }

    clickedField.isFlag = !clickedField.isFlag;
    bombsRemaining += clickedField.isFlag ? -1 : 1;
    updateCounters();
    var className = clickedField.isFlag ? 'flagged' : 'hidden';
    clickedField.btn.setAttribute('class', className);
  }
}

exports.RmbClick = RmbClick;

function GameOver(succes) {
  gameOver = true;
  run = false;
  console.log("Win - " + succes);
  console.log("Time - " + time);
}
},{"./objects/Point":"src/objects/Point.ts","./objects/Field":"src/objects/Field.ts","./objects/MapGenerator":"src/objects/MapGenerator.ts","./styles.scss":"src/styles.scss","./components/game":"src/components/game.ts"}],"../../../AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "59831" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../../AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","src/app.ts"], null)
//# sourceMappingURL=/app.5cec07dd.js.map