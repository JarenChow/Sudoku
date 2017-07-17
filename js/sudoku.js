/**
 * 数独算法 (Sudoku Solution) created by JarenChow on 07/17/2017
 * @param {Object} sudoku
 * {
 *   numbers: string or Array, length === 36 or 81
 *   width: number, such as 6 or 9,
 *   height: like width,
 *   subGridWidth: number, such as 3
 *   subGridHeight: number, such as 3 or 2
 * }
 * @returns {{complete: boolean, loopCount: number, eTime: number, numbers: Array, message: Array, readable: string}}
 */
function solveSudoku(sudoku) {
  "use strict";
  var startTime = new Date().getTime();                                         // 开始时间
  var numbers = [],                                                             // 数独数据
    numbersBackup = [],                                                         // 数独数据备份
    possibleValue = [],                                                         // 可能性数据
    possibleValueBackup = [],                                                   // 可能性数据备份
    length = sudoku.numbers.length,                                             // 数独数据长度
    width = sudoku.width || 9,                                                  // 数独宽度
    height = sudoku.height || 9,                                                // 数独高度
    subGridWidth = sudoku.subGridWidth || 3,                                    // 宫宽度
    subGridHeight = sudoku.subGridHeight || 3,                                  // 宫高度
    standard = [1, 2, 3, 4, 5, 6, 7, 8, 9],                                     // 标准数独
    count = 0,                                                                  // 循环计数
    maxCount = 62,                                                              // 最大循环次数
    maxCountStep = maxCount,                                                    // 最大循环次数递增数
    operations = ["original", "asc", "desc", "random"],                         // 试错法获取的数组顺序
    depth = -1,                                                                 // 递归深度
    stopLoop = false,                                                           // 是否停止循环
    message = [];                                                               // 程度操作信息

  for (var index = 0; index < length; index++) {                                // 初始化
    numbers[index] = 0;
    possibleValue[index] = standard.slice(0, width);
  }

  function updateState(index, value, type) {                                    // 每次设置值之后更新状态
    numbers[index] = value;
    possibleValue[index] = 0;
    if (type) message.push(type + " R" + (parseInt(index / width) + 1) +
      "C" + (index % width + 1) + "=" + value);

    var row = parseInt(index / width),
      rowIndex = row * width,
      rowEndIndex = rowIndex + width;
    for (var i = rowIndex; i < rowEndIndex; i++) {
      update(i);
    }

    var column = index % width,
      columnEndIndex = width * height;
    for (var j = column; j < columnEndIndex; j += width) {
      update(j);
    }

    var subGridRow = parseInt(row / subGridHeight),
      subGridColumn = parseInt(column / subGridWidth),
      subGridIndex = subGridRow * subGridHeight * width +
        subGridColumn * subGridWidth;
    for (i = 0; i < subGridHeight; i++) {
      for (j = 0; j < subGridWidth; j++) {
        update(subGridIndex + i * width + j);
      }
    }

    function update(cursor) {
      if (numbers[cursor] !== 0) return;
      var hasValue = possibleValue[cursor].indexOf(numbers[index]);
      if (hasValue > -1) {
        possibleValue[cursor].splice(hasValue, 1);
      }
    }
  }

  for (index = 0; index < length; index++) {                                    // 根据原始数据初始化
    var value = parseInt(sudoku.numbers[index]);
    if (value === 0) continue;
    updateState(index, value);
  }

  function nakedSingle() {                                                      // 唯一余数的解法
    for (var index = 0; index < length; index++) {
      if (possibleValue[index].length == 1) {
        updateState(index, possibleValue[index][0], "唯余解法");
      }
    }
  }

  function hiddenSingle() {                                                     // 行/列/宫摒除解法
    var isUniqueNumber;
    for (var index = 0; index < length; index++) {
      if (numbers[index] != 0) continue;
      var row = parseInt(index / width),
        column = index % width;

      rowOrColumn(index, row * width, (row + 1) * width, 1);

      if (isUniqueNumber) continue;

      rowOrColumn(index, column, column + width * height, width);

      if (isUniqueNumber) continue;

      var subGridIndex = parseInt(row / subGridHeight) * subGridHeight * width +
        parseInt(column / subGridWidth) * subGridWidth;
      for (var i = 0; i < possibleValue[index].length; i++) {
        isUniqueNumber = true;
        UniqueFlag:
          for (var j = 0; j < subGridHeight; j++) {
            for (var k = 0; k < subGridWidth; k++) {
              var c = subGridIndex + j * width + k;
              if (numbers[c] !== 0 || c === index) continue;
              if (possibleValue[c].indexOf(possibleValue[index][i]) > -1) {
                isUniqueNumber = false;
                break UniqueFlag;
              }
            }
          }
        if (isUniqueNumber) {
          updateState(index, possibleValue[index][i], "宫摒除法");
        }
      }
    }

    function rowOrColumn(index, startIndex, endIndex, step) {
      for (var i = 0; i < possibleValue[index].length; i++) {
        isUniqueNumber = true;
        for (var j = startIndex; j < endIndex; j += step) {
          if (numbers[j] !== 0 || j === index) continue;
          if (possibleValue[j].indexOf(possibleValue[index][i]) > -1) {
            isUniqueNumber = false;
            break;
          }
        }
        if (isUniqueNumber) {
          updateState(index, possibleValue[index][i], (step == 1 ? "行" : "列") + "摒除法");
          break;
        }
      }
    }
  }

  function loopSolveSudoku() {                                                  // 循环解数独的方法
    while (true) {
      var temp = numbers.slice();
      loopSolve(nakedSingle);
      loopSolve(hiddenSingle);
      if (unchanged(numbers, temp)) {
        break;
      }
    }

    function loopSolve(code) {
      if (stopLoop) return;
      var temp = numbers.slice();
      code();
      if (!unchanged(numbers, temp)) {
        count++;
        if (count === maxCount) stopLoop = true;
        loopSolve(code);
      }
    }

    function unchanged(arr1, arr2) {
      return arr1.every(function (value, index) {
        return value === arr2[index];
      });
    }
  }

  loopSolveSudoku();

  var complete = sudokuComplete();

  if (!complete) {                                                              // 如果数独未完成则使用假设法解数独
    maxCount += count;
    depth = -1;
    stopLoop = false;

    for (var i = 0; i < operations.length - 1; i++) {
      tryNumber(operations[i]);
      if (!complete) {
        restoreData();
      } else {
        break;
      }
    }

    if (!complete) {
      for (i = 0; i < 618; i++) {
        tryNumber("random");
        if (!complete) {
          restoreData();
        } else {
          break;
        }
      }
    }
  }

  function tryNumber(operation) {                                               // 假设法
    depth++;
    numbersBackup[depth] = numbers.slice();
    possibleValueBackup[depth] = arrayDeepCopy(possibleValue);
    var possibleArray = getPossibleArray(operation);
    for (var i = 0; i < possibleArray.length && !stopLoop; i++) {
      var index = possibleArray[i].index,
        arr = possibleValue[index],
        error = 0;
      for (var j = 0; j < arr.length && !stopLoop; j++) {
        updateState(index, arr[j], "假设法假设");
        loopSolveSudoku();
        if (!possibleValue.some(function (arr) {
            if (arr instanceof Array) return arr.length === 0;
          })) {
          if (sudokuComplete()) {
            complete = true;
          } else {
            tryNumber(operation);
            depth--;
          }
        } else {
          error++;
        }
        if (complete) break;
        numbers = numbersBackup[depth].slice();
        possibleValue = arrayDeepCopy(possibleValueBackup[depth]);
      }
      if (error === arr.length) break;
      if (complete) break;
    }

    function getPossibleArray(operation) {
      var arr = [];
      possibleValue.forEach(function (value, index) {
        if (value instanceof Array) {
          arr.push({
            index: index,
            length: value.length
          });
        }
      });
      switch (operation) {
        case "original":
          break;
        case "asc":
        case "desc":
          var asc = operation === "asc" ? -1 : 1;
          arr.sort(function (o1, o2) {
            if (o1.length < o2.length) {
              return asc;
            } else if (o1.length > o2.length) {
              return -asc;
            } else {
              return 0;
            }
          });
          break;
        case "random":
          arr.sort(function () {
            return 0.5 - Math.random();
          });
          break;
        default:
          break;
      }
      return arr;
    }
  }

  function restoreData() {                                                      // 每次假设都会造成数据变动，在此进行数据还原
    maxCount += maxCountStep;
    depth = -1;
    stopLoop = false;
    numbers = numbersBackup[0].slice();
    possibleValue = arrayDeepCopy(possibleValueBackup[0]);
  }

  function arrayDeepCopy(source) {                                              // 数组深度拷贝的算法
    var copy = [];
    loopCopy(copy, source);
    return copy;

    function loopCopy(copy, source) {
      source.forEach(function (item, index) {
        if (item instanceof Array) {
          copy[index] = [];
          loopCopy(copy[index], item);
        } else {
          copy[index] = item;
        }
      });
    }
  }

  function sudokuComplete() {
    return numbers.indexOf(0) === -1;
  }

  function arrayToReadable(arr) {
    var msg = "\n";
    for (var i = 0; i < height; i++) {
      for (var j = 0; j < width; j++) {
        var index = i * width + j;
        if (arr[index] instanceof Array) {
          msg += "(" + arr[index] + ")";
        } else {
          msg += arr[index];
        }
        msg += " | ";
      }
      msg = msg.substring(0, msg.lastIndexOf(" | ")) + "\n";
    }
    return msg;
  }

  var eTime = new Date().getTime() - startTime;

  return {
    complete: complete,
    loopCount: count,
    eTime: eTime,
    numbers: numbers,
    message: message,
    readable: arrayToReadable(numbers)
  };
}
