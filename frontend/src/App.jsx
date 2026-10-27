import React, { useState, useEffect } from 'react';

function App() {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    employeeId: '',
    fullName: '',
    gender: 'Nam',
    dateOfBirth: '',
    department: '',
    position: '',
    email: '',
    phone: '',
    status: 'Đang làm việc'
  });

  const API_URL = '/api/employees';

  // Lấy danh sách nhân viên
  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}?search=${encodeURIComponent(search)}`);
      const data = await res.json();
      if (res.ok) setEmployees(data);
    } catch (err) {
      console.error('Lỗi kết nối Backend API:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [search]);

  // Xử lý Thay đổi ô nhập liệu
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Xử lý Thêm mới hoặc Cập nhật
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.employeeId || !form.fullName || !form.email) {
      alert('Vui lòng nhập đầy đủ Mã NV, Họ tên và Email!');
      return;
    }

    try {
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId ? `${API_URL}/${editingId}` : API_URL;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const result = await res.json();

      if (res.ok) {
        alert(editingId ? 'Cập nhật thành công!' : 'Thêm nhân viên thành công!');
        resetForm();
        fetchEmployees();
      } else {
        alert(result.message || 'Thao tác thất bại!');
      }
    } catch (err) {
      alert('Lỗi hệ thống hoặc không kết nối được Backend!');
    }
  };

  // Nạp dữ liệu vào Form để Chỉnh sửa
  const handleEdit = (emp) => {
    setEditingId(emp._id);
    setForm({
      employeeId: emp.employeeId,
      fullName: emp.fullName,
      gender: emp.gender || 'Nam',
      dateOfBirth: emp.dateOfBirth || '',
      department: emp.department || '',
      position: emp.position || '',
      email: emp.email || '',
      phone: emp.phone || '',
      status: emp.status || 'Đang làm việc'
    });
  };

  // Xóa nhân viên (Có yêu cầu xác nhận)
  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa hồ sơ nhân viên này?')) {
      try {
        const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        if (res.ok) {
          alert('Xóa nhân viên thành công!');
          fetchEmployees();
        } else {
          alert('Xóa thất bại!');
        }
      } catch (err) {
        alert('Lỗi khi gửi yêu cầu xóa!');
      }
    }
  };

  // Reset Form về trạng thái ban đầu
  const resetForm = () => {
    setEditingId(null);
    setForm({
      employeeId: '', fullName: '', gender: 'Nam', dateOfBirth: '',
      department: '', position: '', email: '', phone: '', status: 'Đang làm việc'
    });
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '20px auto', fontFamily: 'Arial, sans-serif', padding: '0 15px' }}>
      <h2 style={{ textAlign: 'center', color: '#0056b3' }}>HỆ THỐNG QUẢN LÝ NHÂN SỰ</h2>

      {/* Thanh Tìm Kiếm */}
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <input
          type="text"
          placeholder="Tìm theo Mã nhân viên hoặc Họ tên..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex: 1, padding: '10px', fontSize: '15px' }}
        />
      </div>

      {/* Biểu mẫu Thêm / Cập nhật */}
      <form onSubmit={handleSubmit} style={{ background: '#f8f9fa', padding: '15px', borderRadius: '5px', marginBottom: '20px', border: '1px solid #ddd' }}>
        <h3>{editingId ? 'Cập nhật thông tin nhân viên' : 'Thêm hồ sơ nhân viên mới'}</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <input name="employeeId" placeholder="Mã nhân viên (*)" value={form.employeeId} onChange={handleChange} disabled={!!editingId} required style={{ padding: '8px' }} />
          <input name="fullName" placeholder="Họ và tên (*)" value={form.fullName} onChange={handleChange} required style={{ padding: '8px' }} />
          <input name="email" type="email" placeholder="Email (*)" value={form.email} onChange={handleChange} required style={{ padding: '8px' }} />
          <input name="phone" placeholder="Số điện thoại" value={form.phone} onChange={handleChange} style={{ padding: '8px' }} />
          <input name="department" placeholder="Phòng ban" value={form.department} onChange={handleChange} style={{ padding: '8px' }} />
          <input name="position" placeholder="Chức vụ" value={form.position} onChange={handleChange} style={{ padding: '8px' }} />
          <select name="gender" value={form.gender} onChange={handleChange} style={{ padding: '8px' }}>
            <option value="Nam">Nam</option>
            <option value="Nữ">Nữ</option>
          </select>
          <select name="status" value={form.status} onChange={handleChange} style={{ padding: '8px' }}>
            <option value="Đang làm việc">Đang làm việc</option>
            <option value="Nghỉ việc">Nghỉ việc</option>
          </select>
        </div>
        <div style={{ marginTop: '12px', display: 'flex', gap: '10px' }}>
          <button type="submit" style={{ padding: '8px 15px', backgroundColor: editingId ? '#28a745' : '#007bff', color: '#fff', border: 'none', cursor: 'pointer' }}>
            {editingId ? 'Lưu cập nhật' : 'Thêm mới'}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} style={{ padding: '8px 15px', backgroundColor: '#6c757d', color: '#fff', border: 'none', cursor: 'pointer' }}>
              Hủy
            </button>
          )}
        </div>
      </form>

      {/* Bảng Danh Sách */}
      {loading ? <p>Đang tải dữ liệu...</p> : (
        <table border="1" cellPadding="8" cellSpacing="0" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ backgroundColor: '#e9ecef' }}>
            <tr>
              <th>Mã NV</th>
              <th>Họ tên</th>
              <th>Phòng ban</th>
              <th>Chức vụ</th>
              <th>Email</th>
              <th>SĐT</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {employees.length === 0 ? (
              <tr><td colSpan="8" style={{ textAlign: 'center' }}>Không có dữ liệu nhân viên</td></tr>
            ) : (
              employees.map(emp => (
                <tr key={emp._id}>
                  <td><b>{emp.employeeId}</b></td>
                  <td>{emp.fullName}</td>
                  <td>{emp.department}</td>
                  <td>{emp.position}</td>
                  <td>{emp.email}</td>
                  <td>{emp.phone}</td>
                  <td>{emp.status}</td>
                  <td>
                    <button onClick={() => handleEdit(emp)} style={{ marginRight: '5px', cursor: 'pointer' }}>Sửa</button>
                    <button onClick={() => handleDelete(emp._id)} style={{ color: 'red', cursor: 'pointer' }}>Xóa</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;