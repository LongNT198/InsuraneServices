import { useState } from 'react';
import PaymentFrequencySelector from '../components/PaymentFrequencySelector';
import { ArrowLeft } from 'lucide-react';

/**
 * Demo page for Payment Frequency Selector
 */
const PaymentFrequencyDemo = () => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [formData, setFormData] = useState({
    productId: 1,
    termYears: 10,
    coverageAmount: 500000
  });

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    console.log('Selected payment option:', option);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'productId' ? parseInt(value) : 
              name === 'termYears' ? parseInt(value) :
              parseFloat(value)
    }));
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button 
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại
          </button>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Lựa Chọn Phương Thức Thanh Toán
          </h1>
          <p className="text-gray-600 text-lg">
            Chọn phương thức thanh toán phí bảo hiểm phù hợp với bạn
          </p>
        </div>

        {/* Configuration Form */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Thông Tin Bảo Hiểm
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sản phẩm
              </label>
              <select
                name="productId"
                value={formData.productId}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value={1}>Life Insurance Premium</option>
                <option value={2}>Health Insurance Plus</option>
                <option value={3}>Family Protection Plan</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kỳ hạn (năm)
              </label>
              <input
                type="number"
                name="termYears"
                value={formData.termYears}
                onChange={handleInputChange}
                min="1"
                max="30"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Số tiền bảo hiểm (VND)
              </label>
              <input
                type="number"
                name="coverageAmount"
                value={formData.coverageAmount}
                onChange={handleInputChange}
                min="100000"
                step="100000"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Sản phẩm:</span>
                <span className="ml-2 font-semibold">#{formData.productId}</span>
              </div>
              <div>
                <span className="text-gray-600">Kỳ hạn:</span>
                <span className="ml-2 font-semibold">{formData.termYears} năm</span>
              </div>
              <div>
                <span className="text-gray-600">Số tiền:</span>
                <span className="ml-2 font-semibold">{formatCurrency(formData.coverageAmount)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Frequency Selector */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <PaymentFrequencySelector
            productId={formData.productId}
            termYears={formData.termYears}
            coverageAmount={formData.coverageAmount}
            onSelect={handleOptionSelect}
          />
        </div>

        {/* Selected Option Summary */}
        {selectedOption && (
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4">✅ Lựa Chọn Của Bạn</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-2 opacity-90">
                  Phương thức thanh toán
                </h3>
                <p className="text-2xl font-bold">{selectedOption.displayName}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2 opacity-90">
                  {selectedOption.isLumpSum ? 'Tổng thanh toán' : 'Mỗi kỳ thanh toán'}
                </h3>
                <p className="text-2xl font-bold">
                  {formatCurrency(selectedOption.paymentPerPeriod)}
                </p>
                {!selectedOption.isLumpSum && (
                  <p className="text-sm opacity-90 mt-1">
                    × {selectedOption.numberOfPayments} lần
                  </p>
                )}
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2 opacity-90">
                  Tổng chi phí
                </h3>
                <p className="text-2xl font-bold">
                  {formatCurrency(selectedOption.grandTotal)}
                </p>
              </div>
              {selectedOption.savingsVsMonthly > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-2 opacity-90">
                    Tiết kiệm được
                  </h3>
                  <p className="text-2xl font-bold text-green-300">
                    {formatCurrency(selectedOption.savingsVsMonthly)}
                  </p>
                  <p className="text-sm opacity-90 mt-1">
                    ({selectedOption.savingsPercentageVsMonthly.toFixed(1)}% so với trả hàng tháng)
                  </p>
                </div>
              )}
            </div>
            <div className="mt-6">
              <button className="bg-white text-blue-600 font-bold py-3 px-8 rounded-lg hover:bg-blue-50 transition-colors shadow-md">
                Tiếp Tục Đăng Ký →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentFrequencyDemo;
