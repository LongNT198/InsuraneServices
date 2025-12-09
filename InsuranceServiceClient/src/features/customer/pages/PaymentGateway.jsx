import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../shared/components/ui/card';
import { Button } from '../../shared/components/ui/button';
import { Input } from '../../shared/components/ui/input';
import { Label } from '../../shared/components/ui/label';
import { RadioGroup, RadioGroupItem } from '../../shared/components/ui/radio-group';
import { CreditCard, Wallet, Building, Smartphone, Shield, CheckCircle, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '../../shared/components/ui/alert';

export function PaymentGateway() {
  const navigate = useNavigate();
  const location = useLocation();
  const paymentData = location.state || { amount: 25000, purpose: 'Premium Payment' };

  const [paymentMethod, setPaymentMethod] = useState('card');
  const [processing, setProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
  });

  const [upiId, setUpiId] = useState('');
  const [netBankingBank, setNetBankingBank] = useState('');

  const banks = [
    'State Bank of India',
    'HDFC Bank',
    'ICICI Bank',
    'Axis Bank',
    'Punjab National Bank',
    'Bank of Baroda',
    'Canara Bank',
    'Union Bank of India',
  ];

  const handlePayment = () => {
    setProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      setProcessing(false);
      setPaymentSuccess(true);
      
      // Redirect to success page after 2 seconds
      setTimeout(() => {
        navigate('/dashboard', { state: { paymentSuccess: true } });
      }, 2000);
    }, 2000);
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  if (paymentSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="max-w-md w-full text-center">
          <CardContent className="pt-12 pb-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="size-12 text-green-600" />
            </div>
            <h2 className="mb-2">Payment Successful!</h2>
            <p className="text-gray-600 mb-1">
              Amount: <span className="font-semibold">₹{paymentData.amount.toLocaleString()}</span>
            </p>
            <p className="text-sm text-gray-500 mb-6">{paymentData.purpose}</p>
            <p className="text-xs text-gray-500 mb-6">
              Transaction ID: TXN{Date.now()}
            </p>
            <p className="text-sm text-gray-600">
              Redirecting to dashboard...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Payment Header */}
          <Card className="mb-6">
            <CardContent className="py-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2>Secure Payment</h2>
                  <p className="text-gray-600">{paymentData.purpose}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Amount to Pay</p>
                  <p className="text-3xl font-bold text-blue-600">₹{paymentData.amount.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Payment Methods */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Select Payment Method</CardTitle>
                  <CardDescription>Choose your preferred payment option</CardDescription>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-gray-50">
                        <RadioGroupItem value="card" id="card" />
                        <Label htmlFor="card" className="flex items-center gap-3 cursor-pointer flex-1">
                          <CreditCard className="size-6 text-blue-600" />
                          <div>
                            <p className="font-semibold">Credit / Debit Card</p>
                            <p className="text-sm text-gray-500">Visa, Mastercard, RuPay</p>
                          </div>
                        </Label>
                      </div>

                      <div className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-gray-50">
                        <RadioGroupItem value="upi" id="upi" />
                        <Label htmlFor="upi" className="flex items-center gap-3 cursor-pointer flex-1">
                          <Smartphone className="size-6 text-purple-600" />
                          <div>
                            <p className="font-semibold">UPI</p>
                            <p className="text-sm text-gray-500">PhonePe, Google Pay, Paytm</p>
                          </div>
                        </Label>
                      </div>

                      <div className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-gray-50">
                        <RadioGroupItem value="netbanking" id="netbanking" />
                        <Label htmlFor="netbanking" className="flex items-center gap-3 cursor-pointer flex-1">
                          <Building className="size-6 text-green-600" />
                          <div>
                            <p className="font-semibold">Net Banking</p>
                            <p className="text-sm text-gray-500">All major banks</p>
                          </div>
                        </Label>
                      </div>

                      <div className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-gray-50">
                        <RadioGroupItem value="wallet" id="wallet" />
                        <Label htmlFor="wallet" className="flex items-center gap-3 cursor-pointer flex-1">
                          <Wallet className="size-6 text-orange-600" />
                          <div>
                            <p className="font-semibold">Wallets</p>
                            <p className="text-sm text-gray-500">Paytm, PhonePe, Amazon Pay</p>
                          </div>
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>

              {/* Payment Form */}
              <Card>
                <CardHeader>
                  <CardTitle>
                    {paymentMethod === 'card' && 'Card Details'}
                    {paymentMethod === 'upi' && 'UPI Details'}
                    {paymentMethod === 'netbanking' && 'Select Bank'}
                    {paymentMethod === 'wallet' && 'Select Wallet'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {paymentMethod === 'card' && (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input
                          id="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          value={cardDetails.cardNumber}
                          onChange={(e) => setCardDetails({ 
                            ...cardDetails, 
                            cardNumber: formatCardNumber(e.target.value) 
                          })}
                          maxLength={19}
                        />
                      </div>
                      <div>
                        <Label htmlFor="cardName">Cardholder Name</Label>
                        <Input
                          id="cardName"
                          placeholder="JOHN DOE"
                          value={cardDetails.cardName}
                          onChange={(e) => setCardDetails({ ...cardDetails, cardName: e.target.value.toUpperCase() })}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="expiry">Expiry Date</Label>
                          <Input
                            id="expiry"
                            placeholder="MM/YY"
                            value={cardDetails.expiryDate}
                            onChange={(e) => {
                              let value = e.target.value.replace(/\D/g, '');
                              if (value.length >= 2) {
                                value = value.slice(0, 2) + '/' + value.slice(2, 4);
                              }
                              setCardDetails({ ...cardDetails, expiryDate: value });
                            }}
                            maxLength={5}
                          />
                        </div>
                        <div>
                          <Label htmlFor="cvv">CVV</Label>
                          <Input
                            id="cvv"
                            type="password"
                            placeholder="123"
                            value={cardDetails.cvv}
                            onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value.replace(/\D/g, '') })}
                            maxLength={3}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'upi' && (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="upiId">UPI ID</Label>
                        <Input
                          id="upiId"
                          placeholder="yourname@upi"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Enter your UPI ID (e.g., username@paytm, username@ybl)
                        </p>
                      </div>
                      <div className="border rounded-lg p-4 text-center">
                        <p className="text-sm text-gray-600 mb-2">Or scan QR code</p>
                        <div className="w-48 h-48 bg-gray-100 mx-auto rounded-lg flex items-center justify-center">
                          <p className="text-gray-400">QR Code</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'netbanking' && (
                    <div>
                      <Label>Select Your Bank</Label>
                      <select
                        className="w-full border rounded-md p-2 mt-1"
                        value={netBankingBank}
                        onChange={(e) => setNetBankingBank(e.target.value)}
                      >
                        <option value="">Choose a bank</option>
                        {banks.map((bank) => (
                          <option key={bank} value={bank}>
                            {bank}
                          </option>
                        ))}
                      </select>
                      <p className="text-xs text-gray-500 mt-2">
                        You will be redirected to your bank's website
                      </p>
                    </div>
                  )}

                  {paymentMethod === 'wallet' && (
                    <div className="space-y-3">
                      <button className="w-full border rounded-lg p-4 text-left hover:bg-gray-50">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Wallet className="size-6 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-semibold">Paytm Wallet</p>
                            <p className="text-sm text-gray-500">Balance: ₹5,000</p>
                          </div>
                        </div>
                      </button>
                      <button className="w-full border rounded-lg p-4 text-left hover:bg-gray-50">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                            <Wallet className="size-6 text-purple-600" />
                          </div>
                          <div>
                            <p className="font-semibold">PhonePe Wallet</p>
                            <p className="text-sm text-gray-500">Balance: ₹3,500</p>
                          </div>
                        </div>
                      </button>
                      <button className="w-full border rounded-lg p-4 text-left hover:bg-gray-50">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                            <Wallet className="size-6 text-orange-600" />
                          </div>
                          <div>
                            <p className="font-semibold">Amazon Pay</p>
                            <p className="text-sm text-gray-500">Balance: ₹2,000</p>
                          </div>
                        </div>
                      </button>
                    </div>
                  )}

                  <Button 
                    onClick={handlePayment} 
                    className="w-full mt-6" 
                    size="lg"
                    disabled={processing}
                  >
                    {processing ? 'Processing...' : `Pay ₹${paymentData.amount.toLocaleString()}`}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Purpose</span>
                    <span className="font-semibold">{paymentData.purpose}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount</span>
                    <span>₹{paymentData.amount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Gateway Fee</span>
                    <span>₹0</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between">
                    <span className="font-semibold">Total Amount</span>
                    <span className="font-semibold text-xl text-blue-600">
                      ₹{paymentData.amount.toLocaleString()}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Alert>
                <Shield className="size-4" />
                <AlertDescription>
                  <p className="font-semibold mb-1">Secure Payment</p>
                  <p className="text-xs">
                    Your payment information is encrypted and secure. We never store your card details.
                  </p>
                </AlertDescription>
              </Alert>

              <Card>
                <CardContent className="pt-6">
                  <p className="text-xs text-gray-600 text-center">
                    By proceeding, you agree to our Terms of Service and Privacy Policy
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



