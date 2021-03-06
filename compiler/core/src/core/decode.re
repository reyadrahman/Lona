include Types;

open Json.Decode;

let parameterTypeMap =
  [
    ("text", Types.stringType),
    ("visible", Types.booleanType),
    ("numberOfLines", Types.numberType),
    ("backgroundColor", Types.colorType),
    ("image", Types.urlType),
    /* Styles */
    ("alignItems", Types.stringType),
    ("alignSelf", Types.stringType),
    ("flex", Types.numberType),
    ("flexDirection", Types.stringType),
    ("font", Types.textStyleType),
    ("justifyContent", Types.stringType),
    ("marginTop", Types.numberType),
    ("marginRight", Types.numberType),
    ("marginBottom", Types.numberType),
    ("marginLeft", Types.numberType),
    ("paddingTop", Types.numberType),
    ("paddingRight", Types.numberType),
    ("paddingBottom", Types.numberType),
    ("paddingLeft", Types.numberType),
    ("borderRadius", Types.numberType),
    ("width", Types.numberType),
    ("height", Types.numberType),
    /* Interactivity */
    ("pressed", Types.booleanType),
    ("hovered", Types.booleanType),
    ("onPress", Types.handlerType)
  ]
  |> StringMap.fromList;

exception UnknownParameter(string);

exception UnknownType(string);

let parameterType = name =>
  switch (StringMap.find(name, parameterTypeMap)) {
  | item => item
  | exception Not_found =>
    /* Js.log2("Unknown built-in parameter when deserializing:", name);
       Reference("BuiltIn-Null") */
    raise(UnknownParameter(name))
  };

module Types = {
  let rec lonaType = json => {
    let namedType = json => {
      let named = field("alias", string, json);
      let ltype = field("of", lonaType, json);
      Named(named, ltype);
    };
    let functionType = json => {
      let argumentType = json => {
        "label": field("label", string, json),
        "type": field("type", lonaType, json)
      };
      let arguments =
        switch (json |> optional(field("arguments", list(argumentType)))) {
        | Some(decoded) => decoded
        | None => []
        };
      let returnType =
        switch (
          json |> optional(field("arguments", field("returnType", lonaType)))
        ) {
        | Some(decoded) => decoded
        | None => Types.undefinedType
        };
      Function(arguments, returnType);
    };
    let referenceType = json => json |> string |> (x => Reference(x));
    let otherType = json => {
      let name = field("name", string, json);
      switch name {
      | "Named" => namedType(json)
      | "Function" => functionType(json)
      | _ => raise(UnknownType(name))
      };
    };
    json |> oneOf([referenceType, otherType]);
  };
};

module Parameters = {
  let parameter = json => {
    name: json |> field("name", string),
    ltype: json |> field("type", Types.lonaType),
    defaultValue: json |> optional(field("defaultValue", x => x))
  };
};

module Layer = {
  let layerType = json =>
    switch (string(json)) {
    | "Lona:View" => View
    | "Lona:Text" => Text
    | "Lona:Image" => Image
    | "Lona:Animation" => Animation
    | "Lona:Children" => Children
    | value => Component(value)
    };
  let rec layer = json => {
    let parameterDictionary = json =>
      json
      |> Js.Json.decodeObject
      |> Js.Option.getExn
      |> StringMap.fromJsDict
      |> StringMap.mapi((key, value) =>
           {ltype: parameterType(key), data: value}
         );
    {
      typeName: field("type", layerType, json),
      name: field("id", string, json),
      parameters: field("params", parameterDictionary, json),
      children:
        switch (field("children", list(layer), json)) {
        | result => result
        | exception _ => []
        }
    };
  };
};

exception UnknownExprType(string);

let rec decodeExpr = json => {
  open LonaLogic;
  let decodePlaceholder = (_) => PlaceholderExpression;
  let decodeIdentifier = json => IdentifierExpression(json |> string);
  let decodeMemberExpression = json =>
    MemberExpression(json |> list(decodeExpr));
  let decodeTypedExpr = json => {
    let exprType = json |> field("type", string);
    switch exprType {
    | "AssignExpr" =>
      AssignmentExpression({
        "assignee": json |> field("assignee", decodeExpr),
        "content": json |> field("content", decodeExpr)
      })
    | "IfExpr" =>
      IfExpression({
        "condition": json |> field("condition", decodeExpr),
        "body": json |> field("body", list(decodeExpr))
      })
    | "VarDeclExpr" =>
      VariableDeclarationExpression({
        "content": json |> field("content", decodeExpr),
        "identifier": json |> field("identifier", decodeExpr)
      })
    | "BinExpr" =>
      BinaryExpression({
        "left": json |> field("left", decodeExpr),
        "op": json |> field("op", decodeExpr),
        "right": json |> field("right", decodeExpr)
      })
    | "LitExpr" =>
      LiteralExpression({
        ltype: json |> at(["value", "type"], Types.lonaType),
        data: json |> at(["value", "data"], json => json)
      })
    | _ => raise(UnknownExprType(exprType))
    };
  };
  oneOf([
    decodeTypedExpr,
    decodeIdentifier,
    decodeMemberExpression,
    decodePlaceholder
  ]) @@
  json;
};

exception UnknownLogicValue(string);

let rec logicNode = json => {
  let cmp = str =>
    switch str {
    | "==" => Eq
    | "!=" => Neq
    | ">" => Gt
    | ">=" => Gte
    | "<" => Lt
    | "<=" => Lte
    | _ => Unknown
    };
  let identifierFromExpr = expr =>
    switch expr {
    | LonaLogic.IdentifierExpression(str) => str
    | _ => raise(UnknownExprType("Expected identifier"))
    };
  let rec logicValueFromExpr = expr =>
    switch expr {
    | LonaLogic.MemberExpression(items) =>
      let ltype = Reference("???");
      let path = items |> List.map(identifierFromExpr);
      Logic.Identifier(ltype, path);
    | LonaLogic.LiteralExpression(value) => Logic.Literal(value)
    | _ => raise(UnknownExprType("Failed to convert logic value"))
    }
  and fromExpr = expr =>
    LonaLogic.(
      switch expr {
      | AssignmentExpression(o) =>
        let content = o##content |> logicValueFromExpr;
        let assignee = o##assignee |> logicValueFromExpr;
        Logic.Assign(content, assignee);
      | IfExpression(o) =>
        let body = o##body |> List.map(fromExpr);
        switch o##condition {
        | VariableDeclarationExpression(decl) =>
          raise(UnknownExprType("TODO: Support VarDeclExpr"))
        | BinaryExpression(bin) =>
          let left = bin##left |> logicValueFromExpr;
          let right = bin##right |> logicValueFromExpr;
          let op = bin##op |> identifierFromExpr |> cmp;
          Logic.If(left, op, right, Logic.Block(body));
        | _ => raise(UnknownExprType("Unknown IfExpr"))
        };
      | _ => Logic.None
      }
    );
  fromExpr(decodeExpr(json));
  /* switch (at(["function", "name"], string, json)) {
     | "assign(lhs, to rhs)" =>
       Logic.Assign(arg(["lhs"], value), arg(["rhs"], value))
     | "if(lhs, is cmp, rhs)" =>
       If(
         arg(["lhs"], value),
         arg(["cmp", "value", "data"], cmp),
         arg(["rhs"], value),
         Block(nodes)
       )
     | "if(value)" => IfExists(arg(["value"], value), Block(nodes))
     | "add(lhs, to rhs, and assign to value)" =>
       Add(arg(["lhs"], value), arg(["rhs"], value), arg(["value"], value))
     | _ => None
     }; */
};

module Component = {
  let parameters = json => field("params", list(Parameters.parameter), json);
  let rootLayer = json => field("root", Layer.layer, json);
  let logic = json => Logic.Block(field("logic", list(logicNode), json));
};

/* For JS API */
let decodeParameters = Component.parameters;

let decodeRootLayer = Component.rootLayer;

let decodeLogic = Component.logic;