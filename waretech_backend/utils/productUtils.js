function getStockStatus(product) {
  const { stock_quantity, min_stock_level, max_stock_level } = product;

  if (stock_quantity === 0) return "Hết hàng";
  if (stock_quantity > max_stock_level) return "Dư thừa";
  if (stock_quantity < min_stock_level) return "Sắp hết hàng";
  return "Còn đủ";
}

module.exports = {
  getStockStatus,
};
