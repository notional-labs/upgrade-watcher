const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const parseDate = (datetime_str) => {
  const dt = Date.parse(datetime_str);
  return dt;
}

module.exports = {sleep, parseDate};
