const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const parseDate = (datetime_str) => {
  const dt = Date.parse(datetime_str);
  return dt;
}

const estimate_future_block_time = ({future_height, current_height, current_time, previous_time, diff_block}) => {
  const avg_block_time = (current_time - previous_time)/diff_block;
  const diff_height = future_height - current_height;
  const future_time = current_time + Math.floor(avg_block_time * diff_height);
  console.log(`avg_block_time=${avg_block_time}, diff_height=${diff_height}, future_time=${future_time}`);
  return future_time;
}

module.exports = {sleep, parseDate, estimate_future_block_time};
