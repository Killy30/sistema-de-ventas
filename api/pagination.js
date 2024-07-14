


function dataSplit(inputArray, len) {
    let limit = len;
    let outputArray = [];
    let start_index = 0;
    let end_index = limit;

    let num_splits = Math.floor(inputArray.length / limit);
    let num_piece = inputArray.length % limit == 0 ? num_splits : num_splits + 1;

    outputArray.length = 0
    for (let i = 0; i < num_piece; i++) {
        let my_array = inputArray.slice(start_index, end_index);
        outputArray.push(my_array);
        start_index = end_index;
        end_index = end_index + limit;
    }
    return outputArray;
}


function pagination(dataArray, pageLength, index) {
    let outputData = {
      outputArray: [],
      totalDataLength: 0,
      totalPage: 0,
      start_index: 0,
      end_index: 0,
      btn_previous: false,
      btn_next: false,
      error: null,
    };
  
    if (dataArray.length == 0) return outputData;
  
    let pageLengthxx = Math.floor(dataArray.length / pageLength);
    outputData.totalDataLength = dataArray.length;
    outputData.totalPage = (outputData.totalDataLength % pageLength == 0)
        ? pageLengthxx
        : pageLengthxx + 1;
  
    if (outputData.totalPage < index) {
      outputData.error = 'El indice debe ser menor o igual a las contidad de paginas que haya';
      return outputData;
    }
  
    outputData.start_index = (index - 1) * pageLength;
    outputData.end_index = outputData.start_index + pageLength;
  
    if (outputData.totalPage >= index) {
      let the_array = dataArray.slice(
        outputData.start_index,
        outputData.end_index
      );
      if (the_array.length < outputData.end_index) {
        let x = pageLength - the_array.length;
        outputData.end_index = outputData.end_index - x;
      }
      outputData.start_index = outputData.start_index + 1;
      outputData.outputArray = the_array;
    }
  
    if (outputData.totalPage > 1) outputData.btn_next = true;
    if (outputData.totalPage == index) outputData.btn_next = false;
    if (index > 1) outputData.btn_previous = true;
    if (index == 1) outputData.btn_previous = false;
  
    return outputData;
  }
  

module.exports = pagination