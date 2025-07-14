import * as FaIcons from "react-icons/fa";

const ProductCategoryTable = ({
  currentProducts,
  handleEdit,
  indexOfFirstItem,
  categories,
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr>
            {[
              "#",
              "Mã sản phẩm",
              "Tên sản phẩm",
              "Min",
              "Max",
              "Tồn kho",
              "Tình trạng",
              "Danh mục",
            ].map((header, index) => (
              <th key={index}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {currentProducts.map((product, index) => {
            let statusColor = "text-gray-700";
            if (product.status === "Dư thừa")
              statusColor = "text-blue-600 font-semibold";
            else if (product.status === "Sắp hết hàng")
              statusColor = "text-yellow-500 font-semibold";
            else if (product.status === "Còn đủ")
              statusColor = "text-green-600 font-semibold";
            else if (product.status === "Hết hàng")
              statusColor = "text-red-600 font-bold";

            const category = categories.find(
              (cat) => cat.id === product.category_id
            );
            const Icon = FaIcons[category?.icon];

            return (
              <tr key={product.id} onClick={() => handleEdit(product)}>
                <td>{indexOfFirstItem + index + 1}</td>
                <td>{product.product_code}</td>
                <td>{product.product_name}</td>
                <td>{product.min_stock_level || 0}</td>
                <td>{product.max_stock_level || 0}</td>
                <td>{product.stock_quantity}</td>
                <td className={`${statusColor} whitespace-nowrap`}>
                  {product.status}
                </td>
                <td className="h-full whitespace-nowrap">
                  <div className="flex items-center gap-2 h-full">
                    {Icon && <Icon className="text-blue-500 text-lg" />}
                    <span>{category?.categorie_name || "Không xác định"}</span>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ProductCategoryTable;
