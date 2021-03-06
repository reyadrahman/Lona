// Generated by BUCKLESCRIPT VERSION 2.1.0, PLEASE EDIT WITH CARE
'use strict';

var List                       = require("bs-platform/lib/js/list.js");
var Block                      = require("bs-platform/lib/js/block.js");
var Curry                      = require("bs-platform/lib/js/curry.js");
var Js_json                    = require("bs-platform/lib/js/js_json.js");
var Js_option                  = require("bs-platform/lib/js/js_option.js");
var Json_decode                = require("bs-json/src/Json_decode.js");
var Caml_exceptions            = require("bs-platform/lib/js/caml_exceptions.js");
var Types$LonaCompilerCore     = require("./types.bs.js");
var Caml_builtin_exceptions    = require("bs-platform/lib/js/caml_builtin_exceptions.js");
var StringMap$LonaCompilerCore = require("../containers/stringMap.bs.js");

var parameterTypeMap = StringMap$LonaCompilerCore.fromList(/* :: */[
      /* tuple */[
        "text",
        Types$LonaCompilerCore.stringType
      ],
      /* :: */[
        /* tuple */[
          "visible",
          Types$LonaCompilerCore.booleanType
        ],
        /* :: */[
          /* tuple */[
            "numberOfLines",
            Types$LonaCompilerCore.numberType
          ],
          /* :: */[
            /* tuple */[
              "backgroundColor",
              Types$LonaCompilerCore.colorType
            ],
            /* :: */[
              /* tuple */[
                "image",
                Types$LonaCompilerCore.urlType
              ],
              /* :: */[
                /* tuple */[
                  "alignItems",
                  Types$LonaCompilerCore.stringType
                ],
                /* :: */[
                  /* tuple */[
                    "alignSelf",
                    Types$LonaCompilerCore.stringType
                  ],
                  /* :: */[
                    /* tuple */[
                      "flex",
                      Types$LonaCompilerCore.numberType
                    ],
                    /* :: */[
                      /* tuple */[
                        "flexDirection",
                        Types$LonaCompilerCore.stringType
                      ],
                      /* :: */[
                        /* tuple */[
                          "font",
                          Types$LonaCompilerCore.textStyleType
                        ],
                        /* :: */[
                          /* tuple */[
                            "justifyContent",
                            Types$LonaCompilerCore.stringType
                          ],
                          /* :: */[
                            /* tuple */[
                              "marginTop",
                              Types$LonaCompilerCore.numberType
                            ],
                            /* :: */[
                              /* tuple */[
                                "marginRight",
                                Types$LonaCompilerCore.numberType
                              ],
                              /* :: */[
                                /* tuple */[
                                  "marginBottom",
                                  Types$LonaCompilerCore.numberType
                                ],
                                /* :: */[
                                  /* tuple */[
                                    "marginLeft",
                                    Types$LonaCompilerCore.numberType
                                  ],
                                  /* :: */[
                                    /* tuple */[
                                      "paddingTop",
                                      Types$LonaCompilerCore.numberType
                                    ],
                                    /* :: */[
                                      /* tuple */[
                                        "paddingRight",
                                        Types$LonaCompilerCore.numberType
                                      ],
                                      /* :: */[
                                        /* tuple */[
                                          "paddingBottom",
                                          Types$LonaCompilerCore.numberType
                                        ],
                                        /* :: */[
                                          /* tuple */[
                                            "paddingLeft",
                                            Types$LonaCompilerCore.numberType
                                          ],
                                          /* :: */[
                                            /* tuple */[
                                              "borderRadius",
                                              Types$LonaCompilerCore.numberType
                                            ],
                                            /* :: */[
                                              /* tuple */[
                                                "width",
                                                Types$LonaCompilerCore.numberType
                                              ],
                                              /* :: */[
                                                /* tuple */[
                                                  "height",
                                                  Types$LonaCompilerCore.numberType
                                                ],
                                                /* :: */[
                                                  /* tuple */[
                                                    "pressed",
                                                    Types$LonaCompilerCore.booleanType
                                                  ],
                                                  /* :: */[
                                                    /* tuple */[
                                                      "hovered",
                                                      Types$LonaCompilerCore.booleanType
                                                    ],
                                                    /* :: */[
                                                      /* tuple */[
                                                        "onPress",
                                                        Types$LonaCompilerCore.handlerType
                                                      ],
                                                      /* [] */0
                                                    ]
                                                  ]
                                                ]
                                              ]
                                            ]
                                          ]
                                        ]
                                      ]
                                    ]
                                  ]
                                ]
                              ]
                            ]
                          ]
                        ]
                      ]
                    ]
                  ]
                ]
              ]
            ]
          ]
        ]
      ]
    ]);

var UnknownParameter = Caml_exceptions.create("Decode-LonaCompilerCore.UnknownParameter");

var UnknownType = Caml_exceptions.create("Decode-LonaCompilerCore.UnknownType");

function parameterType(name) {
  try {
    return Curry._2(StringMap$LonaCompilerCore.find, name, parameterTypeMap);
  }
  catch (exn){
    if (exn === Caml_builtin_exceptions.not_found) {
      throw [
            UnknownParameter,
            name
          ];
    } else {
      throw exn;
    }
  }
}

function lonaType(json) {
  var referenceType = function (json) {
    return /* Reference */Block.__(0, [Json_decode.string(json)]);
  };
  var otherType = function (json) {
    var name = Json_decode.field("name", Json_decode.string, json);
    switch (name) {
      case "Function" : 
          var json$1 = json;
          var argumentType = function (json) {
            return {
                    label: Json_decode.field("label", Json_decode.string, json),
                    type: Json_decode.field("type", lonaType, json)
                  };
          };
          var match = Json_decode.optional((function (param) {
                  return Json_decode.field("arguments", (function (param) {
                                return Json_decode.list(argumentType, param);
                              }), param);
                }), json$1);
          var $$arguments = match ? match[0] : /* [] */0;
          var match$1 = Json_decode.optional((function (param) {
                  return Json_decode.field("arguments", (function (param) {
                                return Json_decode.field("returnType", lonaType, param);
                              }), param);
                }), json$1);
          var returnType = match$1 ? match$1[0] : Types$LonaCompilerCore.undefinedType;
          return /* Function */Block.__(2, [
                    $$arguments,
                    returnType
                  ]);
      case "Named" : 
          var json$2 = json;
          var named = Json_decode.field("alias", Json_decode.string, json$2);
          var ltype = Json_decode.field("of", lonaType, json$2);
          return /* Named */Block.__(1, [
                    named,
                    ltype
                  ]);
      default:
        throw [
              UnknownType,
              name
            ];
    }
  };
  return Json_decode.oneOf(/* :: */[
              referenceType,
              /* :: */[
                otherType,
                /* [] */0
              ]
            ], json);
}

var Types = /* module */[/* lonaType */lonaType];

function parameter(json) {
  return /* record */[
          /* name */Json_decode.field("name", Json_decode.string, json),
          /* ltype */Json_decode.field("type", lonaType, json),
          /* defaultValue */Json_decode.optional((function (param) {
                  return Json_decode.field("defaultValue", (function (x) {
                                return x;
                              }), param);
                }), json)
        ];
}

var Parameters = /* module */[/* parameter */parameter];

function layerType(json) {
  var value = Json_decode.string(json);
  switch (value) {
    case "Lona:Animation" : 
        return /* Animation */3;
    case "Lona:Children" : 
        return /* Children */4;
    case "Lona:Image" : 
        return /* Image */2;
    case "Lona:Text" : 
        return /* Text */1;
    case "Lona:View" : 
        return /* View */0;
    default:
      return /* Component */[value];
  }
}

function layer(json) {
  var parameterDictionary = function (json) {
    return Curry._2(StringMap$LonaCompilerCore.mapi, (function (key, value) {
                  return /* record */[
                          /* ltype */parameterType(key),
                          /* data */value
                        ];
                }), StringMap$LonaCompilerCore.fromJsDict(Js_option.getExn(Js_json.decodeObject(json))));
  };
  var tmp;
  try {
    tmp = Json_decode.field("children", (function (param) {
            return Json_decode.list(layer, param);
          }), json);
  }
  catch (exn){
    tmp = /* [] */0;
  }
  return /* record */[
          /* typeName */Json_decode.field("type", layerType, json),
          /* name */Json_decode.field("id", Json_decode.string, json),
          /* parameters */Json_decode.field("params", parameterDictionary, json),
          /* children */tmp
        ];
}

var Layer = /* module */[
  /* layerType */layerType,
  /* layer */layer
];

var UnknownExprType = Caml_exceptions.create("Decode-LonaCompilerCore.UnknownExprType");

function decodeExpr(json) {
  var decodePlaceholder = function () {
    return /* PlaceholderExpression */0;
  };
  var decodeIdentifier = function (json) {
    return /* IdentifierExpression */Block.__(5, [Json_decode.string(json)]);
  };
  var decodeMemberExpression = function (json) {
    return /* MemberExpression */Block.__(4, [Json_decode.list(decodeExpr, json)]);
  };
  var decodeTypedExpr = function (json) {
    var exprType = Json_decode.field("type", Json_decode.string, json);
    switch (exprType) {
      case "AssignExpr" : 
          return /* AssignmentExpression */Block.__(0, [{
                      assignee: Json_decode.field("assignee", decodeExpr, json),
                      content: Json_decode.field("content", decodeExpr, json)
                    }]);
      case "BinExpr" : 
          return /* BinaryExpression */Block.__(3, [{
                      left: Json_decode.field("left", decodeExpr, json),
                      op: Json_decode.field("op", decodeExpr, json),
                      right: Json_decode.field("right", decodeExpr, json)
                    }]);
      case "IfExpr" : 
          return /* IfExpression */Block.__(1, [{
                      condition: Json_decode.field("condition", decodeExpr, json),
                      body: Json_decode.field("body", (function (param) {
                              return Json_decode.list(decodeExpr, param);
                            }), json)
                    }]);
      case "LitExpr" : 
          return /* LiteralExpression */Block.__(6, [/* record */[
                      /* ltype */Curry._1(Json_decode.at(/* :: */[
                                "value",
                                /* :: */[
                                  "type",
                                  /* [] */0
                                ]
                              ], lonaType), json),
                      /* data */Curry._1(Json_decode.at(/* :: */[
                                "value",
                                /* :: */[
                                  "data",
                                  /* [] */0
                                ]
                              ], (function (json) {
                                  return json;
                                })), json)
                    ]]);
      case "VarDeclExpr" : 
          return /* VariableDeclarationExpression */Block.__(2, [{
                      content: Json_decode.field("content", decodeExpr, json),
                      identifier: Json_decode.field("identifier", decodeExpr, json)
                    }]);
      default:
        throw [
              UnknownExprType,
              exprType
            ];
    }
  };
  return Json_decode.oneOf(/* :: */[
              decodeTypedExpr,
              /* :: */[
                decodeIdentifier,
                /* :: */[
                  decodeMemberExpression,
                  /* :: */[
                    decodePlaceholder,
                    /* [] */0
                  ]
                ]
              ]
            ], json);
}

var UnknownLogicValue = Caml_exceptions.create("Decode-LonaCompilerCore.UnknownLogicValue");

function logicNode(json) {
  var cmp = function (str) {
    switch (str) {
      case "!=" : 
          return /* Neq */1;
      case "<" : 
          return /* Lt */4;
      case "<=" : 
          return /* Lte */5;
      case "==" : 
          return /* Eq */0;
      case ">" : 
          return /* Gt */2;
      case ">=" : 
          return /* Gte */3;
      default:
        return /* Unknown */6;
    }
  };
  var identifierFromExpr = function (expr) {
    if (typeof expr === "number") {
      throw [
            UnknownExprType,
            "Expected identifier"
          ];
    } else if (expr.tag === 5) {
      return expr[0];
    } else {
      throw [
            UnknownExprType,
            "Expected identifier"
          ];
    }
  };
  var logicValueFromExpr = function (expr) {
    if (typeof expr === "number") {
      throw [
            UnknownExprType,
            "Failed to convert logic value"
          ];
    } else {
      switch (expr.tag | 0) {
        case 4 : 
            var path = List.map(identifierFromExpr, expr[0]);
            return /* Identifier */Block.__(0, [
                      /* Reference */Block.__(0, ["???"]),
                      path
                    ]);
        case 6 : 
            return /* Literal */Block.__(1, [expr[0]]);
        default:
          throw [
                UnknownExprType,
                "Failed to convert logic value"
              ];
      }
    }
  };
  var fromExpr = function (expr) {
    if (typeof expr === "number") {
      return /* None */0;
    } else {
      switch (expr.tag | 0) {
        case 0 : 
            var o = expr[0];
            var content = logicValueFromExpr(o.content);
            var assignee = logicValueFromExpr(o.assignee);
            return /* Assign */Block.__(2, [
                      content,
                      assignee
                    ]);
        case 1 : 
            var o$1 = expr[0];
            var body = List.map(fromExpr, o$1.body);
            var match = o$1.condition;
            if (typeof match === "number") {
              throw [
                    UnknownExprType,
                    "Unknown IfExpr"
                  ];
            } else {
              switch (match.tag | 0) {
                case 2 : 
                    throw [
                          UnknownExprType,
                          "TODO: Support VarDeclExpr"
                        ];
                case 3 : 
                    var bin = match[0];
                    var left = logicValueFromExpr(bin.left);
                    var right = logicValueFromExpr(bin.right);
                    var op = cmp(identifierFromExpr(bin.op));
                    return /* If */Block.__(0, [
                              left,
                              op,
                              right,
                              /* Block */Block.__(6, [body])
                            ]);
                default:
                  throw [
                        UnknownExprType,
                        "Unknown IfExpr"
                      ];
              }
            }
            break;
        default:
          return /* None */0;
      }
    }
  };
  return fromExpr(decodeExpr(json));
}

function parameters(json) {
  return Json_decode.field("params", (function (param) {
                return Json_decode.list(parameter, param);
              }), json);
}

function rootLayer(json) {
  return Json_decode.field("root", layer, json);
}

function logic(json) {
  return /* Block */Block.__(6, [Json_decode.field("logic", (function (param) {
                    return Json_decode.list(logicNode, param);
                  }), json)]);
}

var Component = /* module */[
  /* parameters */parameters,
  /* rootLayer */rootLayer,
  /* logic */logic
];

var reference = Types$LonaCompilerCore.reference;

var named = Types$LonaCompilerCore.named;

var $$function = Types$LonaCompilerCore.$$function;

var undefinedType = Types$LonaCompilerCore.undefinedType;

var referenceFromJs = Types$LonaCompilerCore.referenceFromJs;

var booleanType = Types$LonaCompilerCore.booleanType;

var numberType = Types$LonaCompilerCore.numberType;

var stringType = Types$LonaCompilerCore.stringType;

var colorType = Types$LonaCompilerCore.colorType;

var textStyleType = Types$LonaCompilerCore.textStyleType;

var urlType = Types$LonaCompilerCore.urlType;

var handlerType = Types$LonaCompilerCore.handlerType;

var parameterToJs = Types$LonaCompilerCore.parameterToJs;

var parameterFromJs = Types$LonaCompilerCore.parameterFromJs;

var decodeParameters = parameters;

var decodeRootLayer = rootLayer;

var decodeLogic = logic;

exports.reference         = reference;
exports.named             = named;
exports.$$function        = $$function;
exports.undefinedType     = undefinedType;
exports.referenceFromJs   = referenceFromJs;
exports.booleanType       = booleanType;
exports.numberType        = numberType;
exports.stringType        = stringType;
exports.colorType         = colorType;
exports.textStyleType     = textStyleType;
exports.urlType           = urlType;
exports.handlerType       = handlerType;
exports.parameterToJs     = parameterToJs;
exports.parameterFromJs   = parameterFromJs;
exports.parameterTypeMap  = parameterTypeMap;
exports.UnknownParameter  = UnknownParameter;
exports.UnknownType       = UnknownType;
exports.parameterType     = parameterType;
exports.Types             = Types;
exports.Parameters        = Parameters;
exports.Layer             = Layer;
exports.UnknownExprType   = UnknownExprType;
exports.decodeExpr        = decodeExpr;
exports.UnknownLogicValue = UnknownLogicValue;
exports.logicNode         = logicNode;
exports.Component         = Component;
exports.decodeParameters  = decodeParameters;
exports.decodeRootLayer   = decodeRootLayer;
exports.decodeLogic       = decodeLogic;
/* parameterTypeMap Not a pure module */
