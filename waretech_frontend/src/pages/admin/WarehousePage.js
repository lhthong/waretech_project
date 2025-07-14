import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as faRegularStar } from "@fortawesome/free-regular-svg-icons";
import {
  getWarehousesInfo,
  addPhieuNhap,
  updatePhieuNhap,
  addPhieuXuat,
  updatePhieuXuat,
} from "../../services/WarehouseApi";
import { MemberService } from "../../services/MemberApi";
import { getProducts } from "../../services/ProductApi";
import { getSuppliers } from "../../services/SupplierApi";
import Pagination from "../../components/admin/buttons/Pagination";
import ImportForm from "../../components/admin/forms/ImportForm";
import ExportForm from "../../components/admin/forms/ExportForm";
import WarehouseTable from "../../components/admin/tables/WarehouseTable";

const INITIAL_FORM = {
  product_id: "",
  so_luong: "",
  user_id: "",
  supplier_id: "",
};
const INITIAL_EXPORT_FORM = { product_id: "", so_luong: "", user_id: "" };

const WarehousePage = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [products, setProducts] = useState([]);
  const [members, setMembers] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [filteredWarehouses, setFilteredWarehouses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);

  const [formData, setFormData] = useState(INITIAL_FORM);
  const [exportFormData, setExportFormData] = useState(INITIAL_EXPORT_FORM);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    const [warehouseData, productData, memberData, supplierData] =
      await Promise.all([
        getWarehousesInfo(),
        getProducts(),
        MemberService.getMembers(),
        getSuppliers(),
      ]);
    setWarehouses(warehouseData);
    setFilteredWarehouses(warehouseData);
    setProducts(productData);
    setMembers(memberData);
    setSuppliers(supplierData);
  };

  const formatData = (data) => ({
    ...data,
    product_id: Number(data.product_id),
    so_luong: Number(data.so_luong),
    user_id: Number(data.user_id),
  });

  const resetForm = () => setFormData(INITIAL_FORM);
  const resetExportForm = () => setExportFormData(INITIAL_EXPORT_FORM);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    const filtered = warehouses.filter(
      (w) =>
        w.products?.product_code.toLowerCase().includes(value) ||
        w.products?.product_name.toLowerCase().includes(value)
    );
    setFilteredWarehouses(filtered);
    setCurrentPage(1);
  };

  const handleFormChange = (e, setter) =>
    setter((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e, isExport) => {
    e.preventDefault();
    const data = isExport ? exportFormData : formData;
    if (!data.product_id || !data.so_luong) {
      alert("Vui lòng nhập đầy đủ các trường bắt buộc!");
      return;
    }
    try {
      const formatted = formatData(data);
      isExport ? await addPhieuXuat(formatted) : await addPhieuNhap(formatted);
      fetchInitialData();
      isExport ? resetExportForm() : resetForm();
    } catch (err) {
      console.error("Lỗi khi thêm sản phẩm:", err);
      alert("Có lỗi xảy ra khi thêm sản phẩm!");
    }
  };

  const handleUpdate = async (e, isExport) => {
    e.preventDefault();
    if (
      !selectedWarehouse ||
      (isExport && !selectedWarehouse.products?.phieu_xuat?.id)
    )
      return;
    try {
      const formatted = formatData(isExport ? exportFormData : formData);
      const updateId = isExport
        ? selectedWarehouse.products.phieu_xuat.id
        : selectedWarehouse.id;
      isExport
        ? await updatePhieuXuat(updateId, formatted)
        : await updatePhieuNhap(updateId, formatted);
      fetchInitialData();
      isExport ? resetExportForm() : resetForm();
    } catch (err) {
      console.error("Lỗi khi cập nhật sản phẩm:", err);
      alert("Có lỗi xảy ra khi cập nhật sản phẩm!");
    }
  };

  const handleEdit = (warehouse, type) => {
    setSelectedWarehouse(warehouse);
    window.scrollTo({ top: 50, behavior: "smooth" });
    if (type === "import") {
      setExportFormData(INITIAL_EXPORT_FORM);
      setFormData({
        product_id: warehouse.products?.id || "",
        so_luong: warehouse.so_luong || "",
        supplier_id: warehouse.suppliers?.id || "",
        user_id: warehouse.users?.iduser || "",
      });
    } else {
      setFormData(INITIAL_FORM);
      setExportFormData({
        product_id: warehouse.products?.id || "",
        so_luong: warehouse.products.phieu_xuat?.so_luong || "",
        user_id: warehouse.products.phieu_xuat.users?.iduser || "",
      });
    }
  };

  const pageItems = filteredWarehouses.slice(
    (currentPage - 1) * 5,
    currentPage * 5
  );

  return (
    <div className="w-full bg-white p-4 sm:p-6 rounded-lg shadow-md">
      <div className="flex">
        <FontAwesomeIcon
          icon={faRegularStar}
          className="mt-1 mr-2 text-[#012970] text-lg"
        />
        <h2 className="mb-5">Sản phẩm trong kho</h2>
      </div>
      <hr className="mb-5 border-t-2 border-gray-300" />
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="border p-4 rounded-lg shadow-md">
          <h2 className="ml-2">Nhập hàng</h2>
          <ImportForm
            formData={formData}
            onChange={(e) => handleFormChange(e, setFormData)}
            onSubmit={(e) => handleSubmit(e, false)}
            onUpdate={(e) => handleUpdate(e, false)}
            onReset={resetForm}
            selectedWarehouse={selectedWarehouse}
            products={products}
            members={members}
            suppliers={suppliers}
          />
        </div>
        <div className="border p-4 rounded-lg shadow-md">
          <h2 className="ml-2">Xuất hàng</h2>
          <ExportForm
            exportFormData={exportFormData}
            onChange={(e) => handleFormChange(e, setExportFormData)}
            onSubmit={(e) => handleSubmit(e, true)}
            onUpdate={(e) => handleUpdate(e, true)}
            onReset={resetExportForm}
            selectedWarehouse={selectedWarehouse}
            products={products}
            members={members}
          />
        </div>
      </div>
      <div className="border p-4 rounded-lg shadow-md mt-5">
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="🔍 Tìm kiếm theo mã sản phẩm hoặc tên sản phẩm,..."
            className="border p-2 border-gray-400 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-200"
          />
        </div>
        <hr className="w-full my-4 border-gray-300" />
        <h3 className="text-md font-semibold mb-4">
          Danh sách sản phẩm tồn kho:
        </h3>
        <div className="overflow-x-auto">
          <WarehouseTable
            currentWarehouses={pageItems}
            indexOfFirstItem={(currentPage - 1) * 5}
            onEdit={handleEdit}
          />
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(filteredWarehouses.length / 5)}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default WarehousePage;
