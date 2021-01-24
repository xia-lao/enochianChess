$(function() {
  Array.prototype.rotate = function (steps, direction) {
    if (steps >= this.length) {
      steps = steps % this.length;
    }
    if (direction) {
      return this.slice(this.length - steps, this.length).concat(this.slice(0, this.length - steps));
    } else {
      return this.slice(steps, this.length).concat(this.slice(0, steps));
    }
  };

//////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////
  $("#mainWindow").tabs({
    active: 0,
    animate: 200
  });
  $(".acc").accordion({
    animate: 200,
    heightStyle: "content"
  });

  $.fn.coordE = function () {
    if ($(this).hasClass("cell")) {
      //console.log($(this).attr('id'));
      var cq = Judge.cell_get_data($(this).attr('id'));
      switch (cq.cQua) {
        case "W":
          cq.cCel += 4;
          break;
        case "E":
          cq.cRow += 4;
          break;
        case "F":
          cq.cRow += 4;
          cq.cCel += 4;
          break;
      }
      $(this).data("cCel", cq.cCel).data("cRow", cq.cRow);
      return {cRow: $(this).data('cRow'), cCel: $(this).data('cCel')};
    }else{
      return null;
    }
  };

  $.fn.chessN = function () {
    if ($(this).hasClass("cell")){
      var cq = Judge.cell_get_data($(this).attr('id'));
      var cn = "ABCD".split("");
      switch (cq.cQua) {
        case "A":
          cq.cCel = cn[cq.cCel];
          cq.cRow += 1;
          cq.cRow = [cq.cCel, (cq.cCel = cq.cRow)][0]; //swap variables for better representation
          break;
        case "W":
          cq.cCel = 4 - cq.cCel;
          cq.cRow = cn[cq.cRow];
          break;
        case "E":
          cq.cCel = 4 - cq.cCel;
          cq.cRow = cn.reverse()[cq.cRow];
          break;
        case "F":
          cq.cRow = 4 - cq.cRow;
          cq.cCel = cn.reverse()[cq.cCel];
          cq.cRow = [cq.cCel, (cq.cCel = cq.cRow)][0]; //swap variables for better representation
          break;
      }
      return "" + cq.cRow + cq.cCel;
    }else{
      return null;
    }
  };

  var cellNext = function (id, direction) {
    var cq = $("#"+id).coordE();
    var cc = Judge.cell_get_data(id);
    var ret = cq;
    switch (direction){
      case "L":
        if (cq.cCel === 0) {
          return -1;
        }
        ret.cCel -= 1;
        break;
      case "R":
        if (cq.cCel === Rules.CELLS_IN_A_ROW * Rules.FIELDS_IN_HALF-1) {
          return -1;
        }
        ret.cCel += 1;
        break;
      case "U":
        if (cq.cRow === 0) {
          return -1;
        }
        ret.cRow -= 1;
        break;
      case "D":
        if (cq.cRow === Rules.CELLS_IN_A_ROW * Rules.FIELDS_IN_HALF-1)  {
          return -1;
        }
        ret.cRow += 1;
        break;
      case "UR":
        if (cq.cRow === 0 | cq.cCel === Rules.CELLS_IN_A_ROW * Rules.FIELDS_IN_HALF-1) {
          return -1;
        }
        ret.cRow -=1; ret.cCel += 1;
        break;
      case "UL":
        if (cq.cRow === 0 | cq.cCel === 0) {
          return -1;
        }
        ret.cRow -= 1; ret.cCel -= 1;
        break;
      case "DR":
        if (cq.cRow === Rules.CELLS_IN_A_ROW * Rules.FIELDS_IN_HALF-1 | 
            cq.cCel === Rules.CELLS_IN_A_ROW * Rules.FIELDS_IN_HALF-1) {
          return -1;
        }
        ret.cRow += 1; ret.cCel += 1;
        break;
      case "DL":
        if (cq.cRow === Rules.CELLS_IN_A_ROW * Rules.FIELDS_IN_HALF-1 | 
            cq.cCel === 0) {
          return -1;
        }
        ret.cRow += 1; ret.cCel -= 1;
        break;
    }
    var retcq = Judge.cell_get_data(Judge.cell_find_by_coordE(ret));
    ret.cNam = "c_"+retcq.cQua+"_"+retcq.cRow+"_"+retcq.cCel;
    return ret.cNam;
  };

  var Judge = {
    neighbours: ["U","D","L","R","UL","UR","DL","DR"],
    eat: function (what) {
      var fq = Judge.figure_qualities(what);
      Eaten.Enochian[fq.Col][Eaten.Enochian[fq.Col].length] = what;
      $("#"+what).remove();
      moves_informer(-1, "", "V#"+globMoveNo+") R.I.P.: "+what);
    /*
      //      $("#" + what).appendTo($("#fieldCemetary"+fq.Col));
      //      $("#"+what).css({
      //        position: "absolute"
      //      });
      //      if (Eaten.Enochian[fq.Col].length > 0) {
      //        $('#'+what).position ({
      //          my: "top left",
      //          at: "top right",
      //          // stick to previous sepulture
      //          of: Eaten.Enochian[fq.Col][Eaten.Enochian[fq.Col].length-2] //-2 because we are -1 )))
      //        });
      //      }else{
      //        $('#'+what).position ({
      //          //stick to fence
      //          my: "top left",
      //          at: "top left",
      //          of: "fieldCemetary"+fq.Col
      //        });
      //        }*/
    },
    cell_find_by_coordE: function (coordE) {
      if (coordE.cCel > 3) {
        //
        if (coordE.cRow > 3) {
          //
          return "c_"+"F"+"_"+(coordE.cRow-4)+"_"+(coordE.cCel-4);
        } else {
          //
          return "c_"+"W"+"_"+(coordE.cRow)+"_"+(coordE.cCel-4);
        }
      } else {
        //
        if (coordE.cRow > 3) {
          //
          return "c_"+"E"+"_"+(coordE.cRow-4)+"_"+(coordE.cCel);
        } else {
          //
          return "c_"+"A"+"_"+(coordE.cRow)+"_"+(coordE.cCel);
        }
      }
    },
    absolute: function (x) {
      if (x < 0) {
        return -x;
      }
      return x;
    },
    cell_get_data: function (id) {
      var data = id.split("_");
      //half_YY, table_Y, etc_Y, sqh_Y_ZZ, sqc_Y_Z, sq_Y_Z, row_Y_Z_N, c_Z_N_I
      //where Y - table, Z - quadrant, N - row, I - cel
      if (data[0] === 'row') {
        return {cTab: data[1], cQua: data[2], cRow: parseInt(data[3], 10)};
      } else {
        // try{
        return {cQua: data[1], cRow: parseInt(data[2], 10), cCel: parseInt(data[3], 10),
          cTab: ($("#" + id).parent().parent().parent().parent().parent().parent().attr("id").split("_")[1]),
          cHalf: ($("#" + id).parent().parent().parent().parent().parent().parent().parent().attr("id").split("_")[1]),
          Associations: $("#"+id).data("Associations")
        };
        // }catch (e){
        //   console.log ($("#"+id).data());
        // }
      }
    },
    figure_qualities: function (f_id) {
      //fig_" + figs[a] + "_" + cq.cQua + "_" + i
      var qualities = f_id.split("_");
      if (qualities[0] === 'PTAX') {return {Fig: "PTAX"};}
      var figure = qualities[1];
      var color = qualities[2];
      var ret = {};
      if (typeof($("#"+f_id).data("Tooltip")) !== "undefined") {
        ret.Tooltip = $("#"+f_id).data("Tooltip");
      }else{
        ret.Tooltip = "";
      }
      ret.coordE = function(){
        return  $("#"+f_id).parent().coordE();
      };
      ret.Col = color;
      ret.Fig = figure;
      ret.Num = qualities[3];
      return ret;
    },
    move_is_horizontalP: function (start, end)  {
      if ($("#"+start).coordE().cRow === $("#"+end).coordE().cRow) {
        return true;
      }
      return false;
    },
    move_is_verticalP: function (start, end) {
      if ($("#"+start).coordE().cCel === $("#"+end).coordE().cCel) {
        return true;
      }
      return false;
    },
    move_is_diagonalP: function (start, end) {

      if (Judge.absolute($("#"+start).coordE().cCel-$("#"+end).coordE().cCel) 
              === 
          Judge.absolute($("#"+start).coordE().cRow-$("#"+end).coordE().cRow)) {
        return true;
      }
      return false;
    },
    move_is_knightlyP: function (start, end) {
      for (i=0;i<Judge.neighbours.length;i++) {
        var dest = Judge.neighbours[i];
        var nc = $("#"+start).data(dest);
        for (j=0;j<Judge.neighbours.length;j++) {
          var dest2 = Judge.neighbours[j];
          if ($("#"+nc).data(dest2) === end) {
            if (dest.length !== dest2.length & (dest2.indexOf(dest) > -1 | dest.indexOf(dest2) > -1)) {
              return true;
            }
          }
        }
      }
      return false;
    },
    move_pawn_strictP: function (fig, move_direction) {
      var fq = Judge.figure_qualities(fig);
      var directions = {
        A: "D", W: "L", E: "R", F: "U"
      };
      if (move_direction === directions(fq.Col)) {
        return true;
      }
      return false;
    },
    one_cell_moveP: function (start, end) {
      var res = false;
      for (i=0;i<Judge.neighbours.length;i++) {
        if ($("#"+start).data(Judge.neighbours[i]) === end) {res = Judge.neighbours[i]; break;}
      }
      return res;
    },
    trace_path: function (start, end) { 
      //we don't need to trace knight, for him we just need to have 
      // target cell free or canJoinFigures = true the goal of the function 
      // is to find, whether there are busy cells on the way
      var sC = $("#"+start).coordE();
      var eC = $("#"+end).coordE();
      var path = new Array();
      if (Judge.move_is_diagonalP(start, end)) {
        //we need to find direction
        if (sC.cCel < eC.cCel) {
          //right
          if (sC.cRow < eC.cRow) {
            //DR
            o = cellNext(start, "DR");
            do {
              path[path.length] = o;
              if (o === end) {
                break;
              }
              o = cellNext(o, "DR");
            } while (true);
          } else {
            //UR
            o = cellNext(start, "UR");
            do {
              path[path.length] = o;
              if (o === end) {
                break;
              }
              o = cellNext(o, "UR");
            } while (true);
          }
        } else {
          //left
          if (sC.cRow < eC.cRow) {
            //DL
            o = cellNext(start, "DL");
            do {
              path[path.length] = o;
              if (o === end) {
                break;
              }
              o = cellNext(o, "DL");
            } while (true);
          } else {
            //UL
            o = cellNext(start, "UL");
            do {
              path[path.length] = o;
              if (o === end) {
                break;
              }
              o = cellNext(o, "UL");
            } while (true);
          }
        }
      } else if (Judge.move_is_horizontalP(start, end)) {
        if (sC.cCel < eC.cCel) {
          //R
            var o = cellNext(start, "R");
            do {
              path[path.length] = o;
              if (o === end) {
                break;
              }
              o = cellNext(o, "R");
            } while (true);
        } else {
          //L
            o = cellNext(start, "L");
            do {
              path[path.length] = o;
              if (o === end) {
                break;
              }
              o = cellNext(o, "L");
            } while (true);
        }
      } else if (Judge.move_is_verticalP(start, end)) {
        if (sC.cRow < eC.cRow) {
          //D
            o = cellNext(start, "D");
            do {
              path[path.length] = o;
              if (o === end) {
                break;
              }
              o = cellNext(o, "D");
            } while (true);
        } else {
          //U
            o = cellNext(start, "U");
            do {
              path[path.length] = o;
              if (o === end) {
                break;
              }
              o = cellNext(o, "U");
            } while (true);
        }
      } else if (Judge.move_is_knightlyP(start, end)) {
        path = [end]; //we don't need to know the whole path, since Knight can jump over
      }
      return path;
    },
    is_move_validP: function (fig, start, end) {
      if (fig === "PTAX") {
        return true;
      }
      if (start === end) {
        //there must be the second check of the move in stop() in case the move was considered invalid, to not change turn
        if (!Rules.canTouchOther) {
          //this will be considered a move and turn will be changed
          return true;
        }
      } else {
        var fq = Judge.figure_qualities(fig);
        var path = Judge.trace_path(start, end);
        for (i=0;i<path.length-1;i++) { //end cell occupation is checked in draggable.revert
          if ($("#"+path[i]).hasClass('occupied')){
            return false;
          }
        }
        switch (fq.Fig) {
          case "P":
            var m = Judge.one_cell_moveP(start, end);
            if (m) {
              if (["RL","UR","DL","DR"].indexOf(m) !== -1 & $("#"+end).hasClass("occupied")) {
                //is diagonal move and occupied cell - eats
                return true;
              } else if (["U","D","L","R"].indexOf(m) !== -1 & !$("#"+end).hasClass("occupied")) {
                if (Rules.AirTowardsWater) {
                  return true;
                } else {
                  if (Judge.move_pawn_strictP()) {
                    //if is set Rules.AirTowardsWater === false, the Pawns may go only CCWise
                    return true;
                  }
                }
              }
            }
            break;
          case "K":
            if (Judge.one_cell_moveP(start, end)) {
              return true;
            }
            break;
          case "Q":
            if (Judge.move_is_diagonalP(start, end) 
              | Judge.move_is_horizontalP(start,end) 
              | Judge.move_is_verticalP(start, end)) {
              return true;
            }
            break;
          case "N":
            if (Judge.move_is_knightlyP(start, end)) {
              return true;
            }
            break;
          case "B":
            if (Judge.move_is_diagonalP(start, end)) {
              return true;
            }
            break;
          case "R":
            if (Judge.move_is_horizontalP(start, end)
              | Judge.move_is_verticalP(start, end)) {
              return true;
            }
            break;
        }
      }
      return false;
    },
    setNextActiveQuarter: function () {
      Rules.setWhosTurn();
      $(".fig").each(function(i,o){
        if ($(this).hasClass(Rules.Goer)){
          $(o).draggable("option", "disabled", false).css({opacity: 1});
        } else {
          $(o).draggable("option", "disabled", true).css({opacity: 0.5});
        }
      });
    },
  };
  var Rules = {
    DrawWaer: false,
    CELLS_IN_A_ROW: 4,
    ROWS_IN_A_FIELD: 4,
    FIELDS_IN_HALF: 2,
    readableElement: function (Col){ //to get "red" out of "R" without need to do each time Rules.Tables[Rules.Tables[x]]
      return Rules.TABLES[Rules.TABLES[Col]];
    },
    Figures: {
      P: "Пешка", Q: "Краля", K: "Краль", B: "Слондъ", N: "Конь", R: "Ладья"
    },
    TABLES: {
      F: 'Red', W: 'Blue', A: 'Yellow', E: 'Black',
      Red: "Огонь", Blue: "Вода", Yellow: "Воздух", Black: "Земля",
      below: function (t){
        if (t === "A") {return "E";}
        if (t === "W") {return "F";}
        return false;
      },
      above: function (t){
        if (t === "E") {return "A";}
        if (t === "F") {return "W";}
        return false;
      }, 
      lefter: function(t){
        if (t === "F") {return "E";}
        if (t === "W") {return "A";}
        return false;
      },
      righter:function(t){
        if (t === "A") {return "W";}
        if (t === "E") {return "F";}
        return false;
      }
    }, //Fire, Water, Air, Earth
    //PARTS: ["C", "G", "S", "R"], //Calvary, Great, Servient, aRchangels
    SETUPS: {
      AW: {F: "KN R B Q", W: "KQ B R N", A: "KB Q N R", E: "KR N Q B"},
      //      cells         rows          cells           rows
      EF: {F: "KN Q B R", W: "KQ N R B", A: "KB R N Q", E: "KR B Q N"}
    },
    CurrentTable: "E",
    CellSize: 31,
    canTouchOther: false,
    AirTowardsWater: true,
    qWhoStarts: "E",
    Goer: "E",
    GoerSaid: false,
    SuddenInformerOpen: {
      A: false, W: false, F: false, E: false
    },
    RotateHaShem: false,
    Goal: "c_W_3_0",
    GameIsOn: false,
    gameDirection: true, //clockwize, set false for counterclockwize
    ObeyRand: false,
    setWhosTurn: function () {
      if (!this.GameIsOn) {
        this.GameIsOn = true;
        return;
      }
      var list = "EFWA".split("");
      list = list.rotate(list.indexOf(Rules.qWhoStarts), false);
      list = list.rotate(globMoveNo, this.gameDirection);
      this.Goer = list[0];
      this.GoerSaid = false;
      $("#btnSendProtocolMessage").attr("disabled", false).html("Отправить");
      //  if ($("#sudden_inform").dialog('isOpen')) {
      //    $("#sudden_inform").dialog('close');
      //  }
    }
  };
  var Eaten = {
    Enochian: {F: [], W: [], A: [], E: []}
  };
  var old_msg = "", globMoveNo = 0, moves_informer = function(ui, dest_id, info) {
    var res_string;
    if (ui !== -1) {
      var fq = Judge.figure_qualities($(ui).attr('id'));
      var cq = Judge.cell_get_data($(ui).data('LeftCell'));
      var eq = Judge.cell_get_data(dest_id),
          cc = Rules.readableElement(cq.cQua),
          cn = $("#"+dest_id).chessN();
      if (fq.Fig === "PTAX") {
        res_string = $('#fpos').val() + "Птах был установлен в стихии '"+cc+"' в клетке "+cn+"\n\n";
      } else {
        cq.cCoo = $("#"+$(ui).data('LeftCell')).chessN();
        eq.cCoo = $("#"+dest_id).chessN();
        res_string = $('#fpos').val() +
                "#" + globMoveNo + ") " + Rules.TABLES[fq.Col]+" "+Rules.Figures[fq.Fig] +
                ": " + Rules.TABLES[Rules.TABLES[cq.Associations.Quadrant]] + " " + cq.cCoo +
                " > "+ Rules.TABLES[Rules.TABLES[eq.Associations.Quadrant]] + " " + eq.cCoo + 
                (typeof info !== 'undefined' ? "\n\t(" + info + ")" : "") + 
                "\n";
      }
    } else {
      res_string = $("#fpos").val()+info+"\n";
    }
    if (old_msg !== res_string) {
      $('#fpos').val(res_string);
      $("#fpos").animate({
        scrollTop: $("#fpos")[0].scrollHeight - $("#fpos").height()
      }, 666);
      old_msg = res_string;
      if (ui !== -1 && fq.Fig !== "PTAX") { //setting PTAX is not a move!
        globMoveNo += 1;
      }
    }
  };
  var random_draw, randomizer = function () {
    random_draw = new fabric.Canvas('rand', {
      isDrawingMode: true
    });
    random_draw.on("after:render", function(){ random_draw.calcOffset(); });
    random_draw.freeDrawingBrush.color = "#005e7a";
    random_draw.freeDrawingBrush.width = 5;
    random_draw.freeDrawingBrush.shadowColor = "#ff0000";
    random_draw.freeDrawingBrush.shadowWidth = 8;
    random_draw.freeDrawingBrush.shadowWidth = 12;
  };
  var enochian_colorize = function () {
      var right = true;
      var left = false;
    var YHVH = {
      AW: {//half_YY
        A: ['A', 'W', 'F', 'E'], W: ['F', 'E', 'A', 'W'], //rotates cCW - 2 subquads
        E: ['E', 'F', 'W', 'A'], F: ['W', 'A', 'E', 'F']  //rotates CW - 2 subquads
      },
      EF: {
        A: ['A', 'E', 'F', 'W'], W: ['A', 'E', 'F', 'W'], //rotates CW - 2 subquads
        E: ['E', 'A', 'W', 'F'], F: ['E', 'A', 'W', 'F']  //rotates cCW - 2 subquads
      },
      Directions: {
        AW: {A: left, W: left, 
             E: right,  F: right}, 
        EF: {A: right,  W: right, 
             E: left, F: left}
      }
    };
    $('.cell').each(function (i, c) {
      var half = $(c).parent().parent().parent().parent().parent().parent().parent().attr('id').split("_")[1];
      var quad = Judge.cell_get_data($(c).attr('id')).cQua;
      var subquad = (Rules.CellSize / 3) + "px solid " + Rules.TABLES[quad];
      var table = (Rules.CellSize / 3) + "px solid " + Rules.TABLES[Rules.CurrentTable];
      var cq = Judge.cell_get_data($(c).attr('id'));
      var rq = Judge.cell_get_data($(c).parent().attr('id'));
      var haShem = YHVH[half][quad];
      //    BY THE WAY - LOOKS LIKE GOOD IDEA, NOT USED BY GOLDEN DAWN, IF THERE WAS SOMEONE TO CONSULT ON THE TOPIC...
      //any way, we decided to include the rotation for test 
      if (Rules.RotateHaShem) {
        var direction = YHVH.Directions[half][quad];
        haShem = haShem.rotate(rq.cRow, direction);
      }
      var upper_color = (Rules.CellSize / 3) + "px solid " + Rules.TABLES[haShem[cq.cCel]];
      var val = haShem.length - rq.cRow - 1;
      var lower_color = (Rules.CellSize / 3) + "px solid " + Rules.TABLES[haShem[val]];
      $(c).css({"border-right": subquad, 'border-left': table, 'border-bottom': lower_color, 'border-top': upper_color});
      $(c).data("Associations", {
        Quadrant: quad,
        haShemRowValue: haShem[cq.cCel],
        haShemColValue: haShem[val]
      });
    });
  };
  var enochian_write = function () {
    var table = {
      F: {
        F: ["nlrx", "xpcn", "vasa", "dapi", "raiL"],
        W: ["tdim", "magm", "leoc", "vssn", "rvoi"],
        A: ["taad", "toco", "nhod", "paax", "saix"],
        E: ["magl", "paco", "ndzn", "iipo", "xrnh"]
      },
      W: {
        F: ["asmt", "msap", "iaba", "izxp", "stim"],
        W: ["phra", "omgg", "gbal", "rlmu", "iahl"],
        A: ["boza", "aira", "ormn", "rsni", "iznr"],
        E: ["ocnc", "opna", "doop", "rxao", "axir"]
      },
      A: {
        F: ["xgsd", "acca", "npnt", "otoi", "pmox"],
        W: ["ytpa", "oyub", "paoc", "rbnb", "atdi"],
        A: ["rzla", "czns", "tott", "sias", "fmnd"],
        E: ["tnbr", "abmo", "naco", "ocnm", "shal"]
      },
      E: {
        F: ["ziza", "adre", "sisp", "pali", "acar"],
        W: ["anaa", "gmnm", "ecop", "amox", "brap"],
        A: ["dopa", "opmn", "apst", "scio", "vasg"],
        E: ["psac", "datt", "diom", "oopz", "rgan"]
      }
    };
    var enoc2waer = function (letter) {
      if (!Rules.DrawWaer) {return letter;}
      var w2e = [
        "э ы ь я з а ъ м ю г к т в у щ б о Р ш л с ё р ж й п х е и В ц д н",
        ". g z . f l t r b m . . h s x . p c . d i . y . e . u a . q n . o"
      ];
      var arrw = w2e[0].split(" "),
          arre = w2e[1].split(" "),
          res = "", iol = -1;
      iol = arre.indexOf(letter);
      if (iol !== -1) {
        res = arrw[iol];
      }
      return res;
    };
    $('.cell').each(function (i, o) {
      var cq = Judge.cell_get_data($(o).attr('id'));
      var quad = Rules.CurrentTable;
      var subquad = cq.cQua;
      if (Rules.Filled) {
        $("#"+$(o).attr('id') + "_letter").html(table[quad][subquad][cq.cRow].split("")[cq.cCel]);
      } else {
        $(o).html(
                "<span class='"+(Rules.DrawWaer===true?"Waer":"Enochian")+"' id='" + $(o).attr('id') + "_letter'>"
              + enoc2waer(table[quad][subquad][cq.cRow].split("")[cq.cCel]) + "</span>"
                );
      }
      var assoc = $(o).data("Associations");
      assoc.Letter = enoc2waer(table[quad][subquad][cq.cRow].split("")[cq.cCel]);
      $(o).data("Associations", assoc);
    });
  };
  var draw_enochian_cells = function () {
    //half_YY, table_Y, etc_Y, sqh_Y_ZZ, sqc_Y_Z, sq_Y_Z, row_Y_Z_N, c_Z_N_I //where Y - table, Z - quadrant, N - row, I - cel
    $("#cfield").append("<div class='half' id='half_AW'></div>").append("<div class='half' id='half_EF'></div>");
    $("#half_AW").append("<div class='element_table' id='table_A'></div>").append("<div class='element_table' id='table_W'></div>");
    $("#half_EF").append("<div class='element_table' id='table_E'></div>").append("<div class='element_table' id='table_F'></div>");
    $(".element_table").each(function (i, o) {
      var table = $(o).attr('id').split("_")[1]; //here we have [etc, X]
      $(o).append("<div class='et_container' id='etc_" + table + "'></div>");
    });
    $(".et_container").each(function (i, o) {
      var et = $(o).attr('id').split("_")[1];
      //var table = $(o).parent().attr('id').split("_")[1];
      $(o).append("<div class='sq_half' id='sqh_" + et + "_AW'></div>").append("<div class='sq_half' id='sqh_" + et + "_EF'></div>");
    });
    $(".sq_half").each(function (i, o) {
      var name = $(o).attr('id').split("_");
      if (name[2] === "AW") { //////////////////////   ////table//elem
        $(o).append("<div class='sq_container' id='sqc_" + name[1] + "_" + "A'></div>")
                .append("<div class='sq_container' id='sqc_" + name[1] + "_" + "W'></div>");
      } else {
        $(o).append("<div class='sq_container' id='sqc_" + name[1] + "_" + "E'></div>")
                .append("<div class='sq_container' id='sqc_" + name[1] + "_" + "F'></div>");
      }
    });
    $(".sq_container").each(function (i, o) {
      var name = $(o).attr('id').split("_");
      $(o).append("<div class='subquad' id='sq_" + name[1] + "_" + name[2] + "'></div>");
    });
    $(".subquad").each(function (i, o) {
      var base = $(o).attr('id').substr(3);
      for (i = 0; i < Rules.ROWS_IN_A_FIELD; i++) {
        $(o).append("<div class='row' id='row_" + base + "_" + i + "'></div>");
      }
    });
    $(".row").each(function (i, o) {
      var rq = Judge.cell_get_data($(o).attr('id'));
      if (rq.cTab === Rules.CurrentTable) {
        var base = $(o).attr("id").split("_");
        for (a = 0; a < Rules.CELLS_IN_A_ROW; a++) {
          $(o).append("<div class='cell' id='c_" + rq.cQua + "_" + rq.cRow + "_" + a + "'></div>");
        }
      }//fill only one subquadrant
    });
    $('.cell').each (function (i, o) {
      $(o)
        .css({
          width: Rules.CellSize,
          height: Rules.CellSize,
          position: "relative"
        })
        .data("QtyParked", 0)
        .addClass(Judge.figure_qualities($(o).attr('id')).cQua);
    });
    
    enochian_colorize();
    enochian_write();
    
    /*$(".cell").each(function(i,o){
        $(o).qtip({
          show: {
            event: 'dblclick',
            solo: true
          },
          hide: {
            fixed: true
          },
          content: {
            text: function (event, api) {
              var cq = Judge.cell_get_data($(this).attr("id"));
              if (cq.Tooltip === "") {
                $.ajax({
                  url: "lib/action.php",
                  type: "post",
                  dataType: "json",
                  data: {
                    action: "get_cel",
                    qua: cq.cCol, //letter
                    row: cq.cRow, //integer < 4
                    cel: cq.cCel, //integer < 4
                    tab: cq.cTab, //letter
                    hav: cq.cHalf, //tow letters
                    qualities: JSON.stringify(cq),
                    assoc: JSON.stringify($(this).data("Associations")) //color-words + 4 letters
                  },
                  success: function (data, textStatus) {
                    var imgname = fq.Fig+fq.Col;
                    if (fq.Fig === "P") {
                      var ce = fq.coordE();
                      switch(fq.Col) {
                        case "A":
                          ce.cRow -= 1;
                          break;
                        case "W":
                          ce.cCel += 1;
                          break;
                        case "E":
                          ce.cCel -= 1;
                          break;
                        case "F":
                          ce.cRow +=1;
                          break;
                      }
                      var parent = $("#"+Judge.cell_find_by_coordE(ce)).data("ParkedFigure_1"); //the King will have at start position his number _2
                      imgname = fq.Fig+Judge.figure_qualities(parent).Fig; //so Kings are not parents for pawns
                    }
                    fq.Tooltip = "<img width='100' src='css/img/enochian/"+imgname+".png'>"
                            +"<span style='color: '"+Rules.TABLES[fq.Col]+"; '><h1>"
                            +Rules.Figures[fq.Fig]+"</h1></span><p>"
                            +data.info+"</p>";
                    //console.log("Success: "+fq.Tooltip);
                    $(this).data("Tooltip", fq.Tooltip);
                    api.set ("content.text", fq.Tooltip);
                  },
                  error: function (data, textStatus) {
                    api.set("content.text", "Server communication failure: "+textStatus);
                    console.log("AJAX fail: "+textStatus);  
                  }
                });
              }else {
                console.log("Success: loaded .data()");
                api.set("content.text", cq.Tooltip);
              }
              return "Загружается...";
            }
          }
        });
    });*/

    var find_neighbours = function () {
      $(".cell").each(function (i,o) {
        var me = {};
        me.co = $(o).coordE();
        me.name = $(o).attr('id');
        var param = $(o).coordE();
        if (me.co.cCel < 7) { //no R for cell 7 (W/F_*_3)
          param.cCel += 1;
          me.r = Judge.cell_find_by_coordE(param); //returns string!
          $("#"+me.name).data("R", me.r);
          $("#"+me.r).data("L", me.name);
        }
        param = $(o).coordE();
        if (me.co.cRow < 7) { //no D for row 7 (E/F_3_*)
          param.cRow += 1;
          me.d = Judge.cell_find_by_coordE(param);
          $("#"+me.name).data("D", me.d);
          $("#"+me.d).data("U", me.name);
          if (typeof (me.r) !== "undefined") { //we may set UR and DL
            $("#"+me.d).data("UR", me.r);
            $("#"+me.r).data("DL", me.d); //checked on next step
          }
        }
        param = $(o).coordE();
        if (typeof(me.r) !== "undefined" & typeof(me.d) !== "undefined") {
          param.cRow += 1; param.cCel += 1;
          me.dr = Judge.cell_find_by_coordE(param);
          $("#"+me.name).data("DR", me.dr);
          $("#"+me.dr).data("UL", me.name);
        }
      });
    };
    find_neighbours();

    var initProtocol = function () {
      $("#fpos")
              .val("Do what thou wilt shall be the whole of the Law.\n")
              .width($("#mainWindow").width()/4.2)
              .height($(".tabula").height()/3.5)
              .css({fontSize: "9px"});
      $("#itMoveComment").width($("#fpos").width() - $("#btnSendProtocolMessage").width()).css({fontSize: "9px"});
      $("#btnSendProtocolMessage").css({fontSize: "9px"});
    };
    initProtocol();
  };
  var put_enochian_figures = function () {
    // on Air and Fire we put figures by cells, on Earth and Water - by rows
    $('.cell').each(function (i, o) { //row_Y_Z_N, c_Z_N_I //where Y - table, Z - quadrant, N - row, I - cel
      var cq = Judge.cell_get_data($(o).attr('id'));
      var setup = Rules.SETUPS[cq.cHalf][cq.cQua].split(" ");
      var figs = [];
      switch (cq.cQua) {
        case "F": //row #3 for figures and #2 for pawns - counted in opposite direction
          if (cq.cRow < 2) {
            return;
          }
          setup = setup.reverse();
          if (cq.cRow == 2) { //just pawn
            figs[0] = "P";
          }//put figures, depenging on row
          if (cq.cRow == 3) {
            if (cq.cCel == 3) {
              figs = setup[3].split("");
            } else {
              figs[0] = setup[cq.cCel];
            }
          }
          //we need to give right chess notation to the $(o)
          break;
        case "W": //cell #3 for figures, cell #2 for pawns - with rows counted directly
          if (cq.cCel < 2) {
            return;
          } else {
            if (cq.cCel == 3) {
              if (cq.cRow == 0) {//king+
                figs = setup[0].split("");
              } else {
                figs[0] = setup[cq.cRow];
              }
            } else {
              figs[0] = "P";
            }
          }
          break;
        case "A": //row #0 for figures and #1 for pawns - counted directly
          if (cq.cRow > 1) {
            return;
          }
          else {
            if (cq.cRow == 1) { //pawns
              figs[0] = "P";
            } else {
              if (cq.cCel == 0) {//king+
                figs = setup[0].split("");
              } else {
                figs[0] = setup[cq.cCel];
              }
            }
          }
          break;
        case "E": //cell #0 for figures and #1 for pawns - counted in ooopsite direction
          if (cq.cCel > 1) {
            return;
          }
          setup = setup.reverse();
          if (cq.cCel == 1) {
            figs[0] = "P";
          } else {
            if (cq.cRow == 3) { //king+
              figs = setup[3].split("");
            } else {
              figs[0] = setup[cq.cRow];
            }
          }
          break;
      }
      for (a = 0; a < figs.length; a++) {
        var name = "#fig_" + figs[a] + "_" + cq.cQua + "_" + i; //fig_Kind_Color_Ordinal_number (last one - just for fun :)
        var imgname = "img_" + figs[a] + "_" + cq.cQua + "_" + i;
        $(o)
          .append("<div class='fig' id='fig_" + figs[a] + "_" + cq.cQua + "_" + i + "'></div>") //figure id: fig_F_Y_O
          .addClass('occupied')
          .data("QtyParked", $(o).data("QtyParked")+1)
          .data("ParkedFigure_"+$(o).data("QtyParked"), name.substring(1));
        $(name)
          .append("<img class='chess_img' src='css/img/enochian/small/" + figs[a] + cq.cQua + ".png' id='" + imgname + "'/>")
          .css({
            width: Rules.CellSize / 3, 
            zIndex: 2000 + a, 
            position: "absolute"
          })
          .addClass(cq.cQua)
          .addClass("tooltip")
          .data('ParkingCell', $(o).attr('id'))
          .data('LeftCell', $(o).attr('id'))
          .data('moveNo', 0)
          .offset({
            top: $(name).offset().top - Rules.CellSize*.3, 
            left: $(name).offset().left - Rules.CellSize
          })
          /*.qtip({
            show: {
              event: 'dblclick',
              solo: true
            },
            hide: {
              fixed: true
            },
            content: {
              text: function (event, api) {
                var fq = Judge.figure_qualities($(this).attr("id"));
                if (fq.Tooltip === "") {
                  $.ajax({
                    url: "lib/action.php",
                    type: "post",
                    dataType: "json",
                    data: {
                      action: "get_fig",
                      qua: fq.Col,
                      fig: fq.Fig
                    },
                    success: function (data, textStatus) {
                      var imgname = fq.Fig+fq.Col;
                      if (fq.Fig === "P") {
                        var ce = fq.coordE();
                        switch(fq.Col) {
                          case "A":
                            ce.cRow -= 1;
                            break;
                          case "W":
                            ce.cCel += 1;
                            break;
                          case "E":
                            ce.cCel -= 1;
                            break;
                          case "F":
                            ce.cRow +=1;
                            break;
                        }
                        var parent = $("#"+Judge.cell_find_by_coordE(ce)).data("ParkedFigure_1"); //the King will have at start position his number _2
                        imgname = fq.Fig+Judge.figure_qualities(parent).Fig; //so Kings are not parents for pawns
                      }
                      fq.Tooltip = "<img width='100' src='css/img/enochian/"+imgname+".png'>"
                              +"<span style='color: '"+Rules.TABLES[fq.Col]+"; '><h1>"
                              +Rules.Figures[fq.Fig]+"</h1></span><p>"
                              +data.info+"</p>";
                      //console.log("Success: "+fq.Tooltip);
                      $(this).data("Tooltip", fq.Tooltip);
                      api.set ("content.text", fq.Tooltip);
                    },
                    error: function (data, textStatus) {
                      api.set("content.text", "Server communication failure: "+textStatus);
                      //console.log("AJAX fail: "+textStatus);  
                    }
                  });
                }else {
                  console.log("Success: loaded .data()");
                  api.set("content.text", fq.Tooltip);
                }
                return "Загружается...";
              }
            }
          });*/
        $("#"+imgname).css({
          width: Rules.CellSize, 
          height: Rules.CellSize
        });
        if (figs.length === 2 && a === 1) {
          $(name).offset({
            left: $(name).offset().left + Rules.CellSize * 0.6
          });
        }
      }
    });
  };
  var Ptax = function () {
    $("#"+Rules.Goal).append("<div class='fig' id='PTAX'></div>");
    $("#PTAX")
      .append("<img class='chess_img' src='css/img/enochian/PTAX.png' id='imgPTAX'/>")
      .css({
        width: Rules.CellSize, 
        zIndex: 3000, 
        position: "absolute"
      })
      .data('LeftCell', "c_W_2_0")
      .offset({
        top: $("#PTAX").offset().top - Rules.CellSize*0.2, 
        left: $("#PTAX").offset().left - Rules.CellSize
      });
    $("#imgPTAX").css({
      width: Rules.CellSize*2,
      height: Rules.CellSize*1.5
    });
    $(".fig").each(function (i,o){
      if ($(this).attr("id") !== "PTAX") {
        $(this).css({
          opacity: 0
        });
      }
    });
  };
  var fnChoosePtaxCell = function() {
    $("#sudden_inform").html("<center>Чтобы начать игру, установите Птаха "+
            "на нужную позицию. Вы можете сделать только одно перемещение. "+
            "Двойное нажатие на клетке позволяет узнать основные характеристики клетки</center>");
    $("#sudden_inform").dialog({
      dialogClass: "no-close",
      resizable: false,
      hide: { effect: "explode", duration: 666 },
      draggable: false,
      position: {
        my: "right top",
        at: "left top",
        of: ".tabula"
      }
    }); $(".ui-dialog-titlebar").hide();
  };
  var StartEverything = function () {
    $("#sudden_inform").dialog('close');
    var pc = $("#PTAX").data("ParkingCell");
    $("#"+pc)
      .removeClass("occupied");
      //.css({backgroundColor: "green"});
    Rules.Goal = pc;
    Rules.Goer = Rules.qWhoStarts = Judge.cell_get_data(pc).cQua;
//    moves_informer($("#PTAX"), pc, "");
    $("#PTAX")
      .draggable('disable')
      .position({
        my: "right bottom",
        at: "right bottom",
        of: "#"+pc
      });
    $("#PTAX").children().css({ //just make picture smaller, it is an only child of the figure itself
      width: $("#PTAX").children().width()/2,
      height: $("#PTAX").children().height()/2
    }).position({
      my: "right bottom",
      at: "right bottom",
      of: "#"+pc
    });
    $("#sudden_inform").html("");
  };
  var fnSuddenInform = function (data) {
    $("#sudden_inform").html("<center>"+data+"</center>");
    $("#sudden_inform").dialog({
      modal: true,
      dialogClass: 'no-close',
      buttons: [{
        text: "Приём!",
        click: function () {
          $(this).dialog('close');
        }
      }],
      resizable: false,
      hide: { effect: "puff", percent: 450, duration: 666 },
      draggable: false,
      position: {
        my: "right",
        at: "left",
        of: ".tabula"
      }
    }); $(".ui-dialog-titlebar").hide();
  };
  var check_PF_2 = function (from) { 
    var res = $("#"+from).data('ParkedFigure_2');
    var iif = (typeof res !== 'undefined');
    if (iif) {
      $("#"+from).data('ParkedFigure_1', $("#"+$("#"+from).data('ParkedFigure_2')));
    }
  };
  var showProtocol = function () {
    $("#tabProtocol").dialog({
      dialogClass: "no-close",
      resizable: false,
      draggable: false,
      position: {
        my: "left top",
        at: "right top",
        of: ".tabula"
      }
    }); $(".ui-dialog-titlebar").hide();
  };
//////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////
randomizer();
draw_enochian_cells();
put_enochian_figures();
Ptax(); fnChoosePtaxCell();
showProtocol();
//////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////
  $(".fig").draggable({
    containment: ".tabula",
    scroll: true,
    revertDuration: 500,
    start: function () {
      $(this).data('LeftCell', $(this).data('ParkingCell'));
      $(this).data('moveNo', $(this).data('moveNo') + 1);
      //here we may show appropriate cells
    },
    revert: function () {
      var who = $(this).attr('id'), 
          from = $(this).data('LeftCell'), 
          to = $(this).data('ParkingCell');
      var bad_move = function () {
            $(this).data('ParkingCell', $(this).data('LeftCell'));
            $(this).data('moveNo', $(this).data('moveNo') - 1);
            $(this).data('reverted', true);
          },
          good_move = function () {
            $("#" + from).removeClass('occupied');
            $("#" + to).addClass('occupied');
            $("#" + to).data("ParkedFigure_1", who);
          };
      if (Judge.is_move_validP(who, from, to)) { //checks only for formal validity of move's path
        if (who === 'PTAX') {
          return false;
        }
        if ($("#"+to).hasClass('occupied')) { //heck for obstacles in the end
          var visavis = $("#"+to).data('ParkedFigure_1'),
              vq = Judge.figure_qualities(visavis),
              wq = Judge.figure_qualities(who);
          if (vq.Col !== wq.Col) { //can just eat the figure from enemy's army
            //EAT!!!
            Judge.eat(visavis);
            check_PF_2(to); //if there is a king also, we should unveil him, setting to PF_1 position, so now he's eatable
            //there cannot be any other king in -=from=-, since if K goes somewhere, he is already PF_1
          } else {
            bad_move(); return true;
          }
        }
        check_PF_2(from);
        good_move();
        return false;
      }
      bad_move(); return true;
    },
    stop: function () { //is executed after DROP event, so we already know, where we stand
      if ($(this).data('reverted') === true) {
        if (Rules.canTouchOther) {
          alert('Такой ход невозможен!');
          return;
        }
        $(this).removeData('reverted');
        return;
      }
      var who = $(this).attr('id'), 
          from = $(this).data('LeftCell'), 
          to = $(this).data('ParkingCell');
      if (who === "PTAX") {
        StartEverything();
      } else {
        if (from === to) {
          if (Rules.canTouchOther) { //no change of turn is made
            return;
          } else {
            //case one cannot touch a figure, we just inform him of his failure
            //fnSuddenInform
            alert("Нельзя касаться фигуры, не сделав ею ход! \nХод засчитан.");
          }
        }
      }
      moves_informer(this, $(this).data('ParkingCell'));
      Judge.setNextActiveQuarter();
    }
  });
  $('.cell').droppable({
    greedy: true,
    tolerance: "intersect",
    drop: function (e, o) {
      //write down where did I land )))
      $(o.draggable).data('ParkingCell', $(this).attr('id'));
    }
  });
//////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////
  $('#bthrow').click(function (e) {
    var data = random_draw.freeDrawingBrush._points;
    //безбожная потеря данных :-D
    var x = 0, y = 0;
    for (i=0;i<data.length;i++) {
      x ^= data[i].x;
      y ^= data[i].y;
    }
    //    console.log("x", x, base_convert(x, 10, 2), "y", y, baseConvert(y, 10, 2));
    var bdata = [x & 6, (x >> 4) & 6], info="";
    //info += ("x", x, base_convert(x, 10, 2), "y", y, baseConvert(y, 10, 2))+"\n";
    //    console.log(bdata);
    //select figure to go
    switch(bdata[1]) {
      case 0:
        info += "King or Pawn";
        break;
      case 1:
        info += "Knight";
        break;
      case 2:
        info += "Bishop";
        break;
      case 3:
        info += "Cwene";
        break;
      case 4: 
        info += "Rook";
        break;
      case 5:
        info += "Pawn";
        break;
      default: //just a reverence - for She is in and after the END (just like out of her the beginning and none of her within)
        info += "Cwene";
        break;
    }
    info += " to go!";
    moves_informer(-1, "undefined", info);
    $("#mainWindow").tabs({active: 2});
  });
  $('#bclear').click(function(e) {
    random_draw.clear();
  });
  $("#btnSendProtocolMessage").click(function(e){
    if (Rules.GoerSaid) {
      return;
    }
    var who = Rules.readableElement(Rules.Goer);
    moves_informer(-1, "undefined", who+" сообщает: "+$("#itMoveComment").val());
    Rules.GoerSaid = true; $("#itMoveComment").val("");
    $(this).html("Молчи!");
  });
  $("#mainWindow").tabs({
    activate: function (e, ui) {
      switch($("#mainWindow").tabs('option', 'active')) {
        case 0: //its field - show the protocol window
          $("#tabProtocol").dialog('open');
          break;
        case 1:  //hide elsewhere
          $("#tabProtocol").dialog('close');
          break;
        case 2:
          $("#tabProtocol").dialog('close');
          break;
      }
    }
  });

  var State = {
    lzw_encode: function (s) {
        var dict = {};
        var data = (s + "").split("");
        var out = [];
        var currChar;
        var phrase = data[0];
        var code = 256;
        for (var i=1; i<data.length; i++) {
            currChar=data[i];
            if (dict[phrase + currChar] != null) {
                phrase += currChar;
            }
            else {
                out.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0));
                dict[phrase + currChar] = code;
                code++;
                phrase=currChar;
            }
        }
        out.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0));
        for (var i=0; i<out.length; i++) {
            out[i] = String.fromCharCode(out[i]);
        }
        return out.join("");
    },
    lzw_decode: function (s) {
        var dict = {};
        var data = (s + "").split("");
        var currChar = data[0];
        var oldPhrase = currChar;
        var out = [currChar];
        var code = 256;
        var phrase;
        for (var i=1; i<data.length; i++) {
            var currCode = data[i].charCodeAt(0);
            if (currCode < 256) {
                phrase = data[i];
            }
            else {
               phrase = dict[currCode] ? dict[currCode] : (oldPhrase + currChar);
            }
            out.push(phrase);
            currChar = phrase.charAt(0);
            dict[code] = oldPhrase + currChar;
            code++;
            oldPhrase = phrase;
        }
        return out.join("");
    },
    Base64: {
      // private property
      _keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

      // public method for encoding
      encode : function (input) {
          var output = "";
          var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
          var i = 0;

          input = State.Base64._utf8_encode(input);

          while (i < input.length) {

              chr1 = input.charCodeAt(i++);
              chr2 = input.charCodeAt(i++);
              chr3 = input.charCodeAt(i++);

              enc1 = chr1 >> 2;
              enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
              enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
              enc4 = chr3 & 63;

              if (isNaN(chr2)) {
                  enc3 = enc4 = 64;
              } else if (isNaN(chr3)) {
                  enc4 = 64;
              }

              output = output +
              State.Base64._keyStr.charAt(enc1) + State.Base64._keyStr.charAt(enc2) +
              State.Base64._keyStr.charAt(enc3) + State.Base64._keyStr.charAt(enc4);

          }

          return output;
      },

      // public method for decoding
      decode : function (input) {
          var output = "";
          var chr1, chr2, chr3;
          var enc1, enc2, enc3, enc4;
          var i = 0;

          input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

          while (i < input.length) {

              enc1 = State.Base64._keyStr.indexOf(input.charAt(i++));
              enc2 = State.Base64._keyStr.indexOf(input.charAt(i++));
              enc3 = State.Base64._keyStr.indexOf(input.charAt(i++));
              enc4 = State.Base64._keyStr.indexOf(input.charAt(i++));

              chr1 = (enc1 << 2) | (enc2 >> 4);
              chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
              chr3 = ((enc3 & 3) << 6) | enc4;

              output = output + String.fromCharCode(chr1);

              if (enc3 != 64) {
                  output = output + String.fromCharCode(chr2);
              }
              if (enc4 != 64) {
                  output = output + String.fromCharCode(chr3);
              }

          }

          output = State.Base64._utf8_decode(output);

          return output;

      },

      // private method for UTF-8 encoding
      _utf8_encode : function (string) {
          string = string.replace(/\r\n/g,"\n");
          var utftext = "";

          for (var n = 0; n < string.length; n++) {

              var c = string.charCodeAt(n);

              if (c < 128) {
                  utftext += String.fromCharCode(c);
              }
              else if((c > 127) && (c < 2048)) {
                  utftext += String.fromCharCode((c >> 6) | 192);
                  utftext += String.fromCharCode((c & 63) | 128);
              }
              else {
                  utftext += String.fromCharCode((c >> 12) | 224);
                  utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                  utftext += String.fromCharCode((c & 63) | 128);
              }

          }

          return utftext;
      },

      // private method for UTF-8 decoding
      _utf8_decode : function (utftext) {
          var string = "";
          var i = 0;
          var c = c1 = c2 = 0;

          while ( i < utftext.length ) {

              c = utftext.charCodeAt(i);

              if (c < 128) {
                  string += String.fromCharCode(c);
                  i++;
              }
              else if((c > 191) && (c < 224)) {
                  c2 = utftext.charCodeAt(i+1);
                  string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                  i += 2;
              }
              else {
                  c2 = utftext.charCodeAt(i+1);
                  c3 = utftext.charCodeAt(i+2);
                  string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                  i += 3;
              }

          }
          return string;
      }
    },
    saveGState: function () {
      var figures = [], figure;
      var cols = ['A', 'E', 'F', 'W'];
      for (var col in cols) {
        figures[col] = [];
      }
      var gskeys = [
        "GameIsOn", "globMoveNo", "gameDirection", "RotateHaShem",
        "qWhoStarts", "Goer", "GoerSaid", "Goal", "DrawWaer", 
        "canTouchOther", "canJumpOver", "AirTowardsWater", "ObeyRand"
      ];
      $(".fig").each(function(i,o){
        //figures[figures.length]
        figure = {
          ParkingCell: $(o).data("ParkingCell"),
          LeftCell: $(o).data("LeftCell"),
          moveNo: $(o).data("moveNo"),
          parent: $(o).parent().attr('id'),
          class: $(o).attr('class'),
          id: $(o).attr('id'),
          style: $(o).attr('style')
        };
        for (var col in cols) {
          if ($(o).hasClass(col)) {
            figures[col][figures[col].length] = figure;
          }
        }
      });
      var globalState = {
        GameIsOn: Rules.GameIsOn,
        globMoveNo: globMoveNo,
        gameDirection: Rules.gameDirection,
        RotateHaShem: Rules.RotateHaShem,
        qWhoStarts: Rules.qWhoStarts,
        Goer: Rules.Goer,
        GoerSaid: Rules.GoerSaid,
        Goal: Rules.Goal,
        DrawWaer: Rules.DrawWaer,
        canTouchOther: Rules.canTouchOther,
        canJumpOver: Rules.canJumpOver,
        AirTowardsWater: Rules.AirTowardsWater,
        ObeyRand: Rules.ObeyRand
      };
      var protocol = $("#fpos").val();
      //  var data = {figures: figures, gstate: globalState, eaten: Eaten.Enochian, gskeys: gskeys, log: protocol};
      //  var jcdata = JSON.stringify(data);
      //  var cjdata = State.Base64.encode(State.lzw_encode(jcdata)); //State.Base64.encode
      var gsJ = State.Base64.encode(State.lzw_encode(JSON.stringify(globalState)));
      var figJA = State.Base64.encode(State.lzw_encode(JSON.stringify(figures.A)));
      var figJE = State.Base64.encode(State.lzw_encode(JSON.stringify(figures.E)));
      var figJF = State.Base64.encode(State.lzw_encode(JSON.stringify(figures.F)));
      var figJW = State.Base64.encode(State.lzw_encode(JSON.stringify(figures.W)));
      var othJ = State.Base64.encode(State.lzw_encode(JSON.stringify({eaten: Eaten, protocol: protocol})));
      
      $.cookie.raw = true;
      $.cookie('EC_GS', gsJ, {expires: 2147483647});
      $.cookie('EC_fA', figJA, {expires: 2147483647});
      $.cookie('EC_fE', figJE, {expires: 2147483647});
      $.cookie('EC_fF', figJF, {expires: 2147483647});
      $.cookie('EC_fW', figJW, {expires: 2147483647});
      $.cookie('EC_oth', othJ, {expires: 2147483647});
      
      console.table(document.cookie);
      
    },
    resetGState: function() {
    },

  };

});