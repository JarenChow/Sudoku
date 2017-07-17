(function () {
// Example 1
  var sudoku1 = {
    numbers: "980700600500090070007004000300006000008500060000000302010000000005400080000021900",
    width: 9,
    height: 9,
    subGridWidth: 3,
    subGridHeight: 3
  };
// Example 2
  var sudoku2 = {
    numbers: "400530020000000010200000002006640300",
    width: 6,
    height: 6,
    subGridWidth: 3,
    subGridHeight: 2
  };
// Example 3
  var sudoku3 = {
    numbers: "800000000003600000070090200050007000000045700000100030001000068008500010090000400"
  };
// Example 4
  var sudoku4 = {
    numbers: [
      9, 8, 0, 7, 0, 0, 6, 0, 0,
      7, 0, 0, 0, 0, 0, 0, 8, 0,
      0, 0, 6, 0, 5, 0, 0, 0, 0,
      4, 0, 0, 0, 0, 3, 0, 0, 2,
      0, 0, 7, 9, 4, 0, 0, 6, 0,
      0, 0, 0, 0, 0, 0, 4, 0, 0,
      0, 1, 0, 0, 0, 0, 0, 0, 3,
      0, 0, 9, 5, 0, 0, 0, 7, 0,
      0, 0, 0, 0, 2, 0, 1, 0, 0
    ]
  };
// Example 5 非常难的数独
  var sudoku5 = {
    numbers: "800000000" +
    "003600000" +
    "070090200" +
    "050007000" +
    "000045700" +
    "000100030" +
    "001000068" +
    "008500010" +
    "090000400"
  };

  var sudokus = [sudoku1, sudoku2, sudoku3, sudoku4, sudoku5];

  window.addEventListener("load", function () {
    for (var i = 0; i < sudokus.length; i++) {
      var result = solveSudoku(sudokus[i]);
      dout("Sudoku", i + 1);
      dout("是否完成(boolean)", result.complete);
      dout("循环次数(number)", result.loopCount + " times");
      dout("消耗时间(number)", result.eTime + " ms");
      dout("结果数据(Array)", result.numbers);
      dout("过程数据(Array)", result.message);
      dout("可视化数据(string)", result.readable);
    }
  });

  function dout(message, expectation) {
    var log = document.getElementById("debuglog");
    if (!log) {
      log = document.createElement("div");
      log.id = "debuglog";
      var h1 = document.createElement("h1");
      var h1Text = document.createTextNode("Debug log");
      h1.appendChild(h1Text);
      log.appendChild(h1);
      document.body.appendChild(log);
    }
    var pre = document.createElement("pre");
    pre.style.fontSize = "24px";
    var preText = document.createTextNode(message + " = ");
    var em = document.createElement("em");
    var emText = document.createTextNode(expectation);
    em.style.color = "red";
    em.appendChild(emText);
    pre.appendChild(preText);
    pre.appendChild(em);
    log.appendChild(pre);
  }
})();