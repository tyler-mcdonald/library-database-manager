/** Store each record in a page */
module.exports = function createPages(data) {
  const recordsPerPage = 10;
  const pages = []; // 2d array

  // Loop through all data
  for (let i = 0; i < data.length; i += recordsPerPage) {
    let totalRecords = pages.flat(2).length;
    let page = [];
    // Push records into "page"
    for (
      let k = totalRecords;
      k < totalRecords + recordsPerPage && k < data.length;
      k++
    ) {
      data[k] ? page.push(data[k]) : null;
    }
    pages.push(page);
  }
  return pages;
};
