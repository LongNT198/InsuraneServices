import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../shared/components/ui/card';
import { Label } from '../../shared/components/ui/label';
import { Input } from '../../shared/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../shared/components/ui/select';
import { Button } from '../../shared/components/ui/button';
import { Wallet, CheckCircle, AlertCircle, IndianRupee } from 'lucide-react';
import { Alert, AlertDescription } from '../../shared/components/ui/alert';
import { Badge } from '../../shared/components/ui/badge';

export function LoanFacility() {
  const [loanData, setLoanData] = useState({
    policyNumber: '',
    policyType: '',
    policyValue: '',
    loanAmount: '',
    tenure: '',
  });
  const [eligibility, setEligibility] = useState(null);
  const [applicationSubmitted, setApplicationSubmitted] = useState(false);

  const checkEligibility = () => {
    const policyValue = parseInt(loanData.policyValue) || 0;
    const maxLoan = policyValue * 0.9; // 90% of policy value
    const minLoan = 10000;
    const interestRate = 9.5; // Annual interest rate

    setEligibility({
      eligible: policyValue >= 100000,
      maxLoanAmount: Math.floor(maxLoan),
      minLoanAmount: minLoan,
      interestRate: interestRate,
      policyValue: policyValue,
    });
  };

  const calculateEMI = () => {
    if (!eligibility) return 0;
    
    const principal = parseInt(loanData.loanAmount) || 0;
    const tenure = parseInt(loanData.tenure) || 12;
    const monthlyRate = eligibility.interestRate / 12 / 100;
    
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenure)) / 
                (Math.pow(1 + monthlyRate, tenure) - 1);
    
    return Math.round(emi);
  };

  const handleSubmit = () => {
    setApplicationSubmitted(true);
  };

  const benefits = [
    'Quick processing within 2-3 working days',
    'Competitive interest rates starting from 9.5%',
    'Flexible repayment tenure up to 5 years',
    'No prepayment charges',
    'Minimal documentation required',
    'Continue policy benefits while loan is active',
  ];

  const mockPolicies = [
    { number: 'LI-2024-0001', type: 'Life Insurance', value: 1000000 },
    { number: 'MI-2024-0042', type: 'Medical Insurance', value: 500000 },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <Wallet className="size-12 text-purple-600 mx-auto mb-4" />
          <h1 className="mb-2">Loan Facility</h1>
          <p className="text-gray-600">Get loans against your insurance policies with competitive rates</p>
        </div>

        {!applicationSubmitted ? (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Loan Application Form */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Apply for Loan</CardTitle>
                  <CardDescription>Fill in the details to check your loan eligibility</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="policyNumber">Policy Number</Label>
                    <Select 
                      value={loanData.policyNumber}
                      onValueChange={(value) => {
                        const policy = mockPolicies.find(p => p.number === value);
                        setLoanData({
                          ...loanData,
                          policyNumber: value,
                          policyType: policy?.type || '',
                          policyValue: policy?.value.toString() || '',
                        });
                        setEligibility(null);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your policy" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockPolicies.map(policy => (
                          <SelectItem key={policy.number} value={policy.number}>
                            {policy.number} - {policy.type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {loanData.policyNumber && (
                    <>
                      <div>
                        <Label>Policy Type</Label>
                        <Input value={loanData.policyType} disabled />
                      </div>

                      <div>
                        <Label>Policy Value (₹)</Label>
                        <Input value={parseInt(loanData.policyValue).toLocaleString()} disabled />
                      </div>

                      <Button onClick={checkEligibility} className="w-full">
                        Check Eligibility
                      </Button>
                    </>
                  )}

                  {eligibility && (
                    <>
                      {eligibility.eligible ? (
                        <Alert className="bg-green-50 border-green-200">
                          <CheckCircle className="size-5 text-green-600" />
                          <AlertDescription className="ml-2">
                            <p className="font-semibold text-green-800">You are eligible for a loan!</p>
                            <p className="text-sm text-green-700 mt-1">
                              Maximum loan amount: ₹{eligibility.maxLoanAmount.toLocaleString()}
                            </p>
                            <p className="text-sm text-green-700">
                              Interest rate: {eligibility.interestRate}% p.a.
                            </p>
                          </AlertDescription>
                        </Alert>
                      ) : (
                        <Alert variant="destructive">
                          <AlertCircle className="size-5" />
                          <AlertDescription className="ml-2">
                            Policy value must be at least ₹1,00,000 to be eligible for a loan.
                          </AlertDescription>
                        </Alert>
                      )}

                      {eligibility.eligible && (
                        <>
                          <div>
                            <Label htmlFor="loanAmount">Loan Amount (₹)</Label>
                            <Input
                              id="loanAmount"
                              type="number"
                              placeholder={`Max: ${eligibility.maxLoanAmount.toLocaleString()}`}
                              value={loanData.loanAmount}
                              onChange={(e) => setLoanData({ ...loanData, loanAmount: e.target.value })}
                              max={eligibility.maxLoanAmount}
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              Up to 90% of policy value
                            </p>
                          </div>

                          <div>
                            <Label htmlFor="tenure">Repayment Tenure (months)</Label>
                            <Select 
                              value={loanData.tenure}
                              onValueChange={(value) => setLoanData({ ...loanData, tenure: value })}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select tenure" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="12">12 months (1 year)</SelectItem>
                                <SelectItem value="24">24 months (2 years)</SelectItem>
                                <SelectItem value="36">36 months (3 years)</SelectItem>
                                <SelectItem value="48">48 months (4 years)</SelectItem>
                                <SelectItem value="60">60 months (5 years)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          {loanData.loanAmount && loanData.tenure && (
                            <div className="bg-blue-50 p-4 rounded-lg">
                              <div className="flex items-center gap-2 mb-2">
                                <IndianRupee className="size-5 text-blue-600" />
                                <span className="font-semibold">Estimated Monthly EMI</span>
                              </div>
                              <p className="text-2xl text-blue-600">
                                ₹{calculateEMI().toLocaleString()}
                              </p>
                              <p className="text-xs text-gray-600 mt-2">
                                Total amount payable: ₹{(calculateEMI() * parseInt(loanData.tenure)).toLocaleString()}
                              </p>
                            </div>
                          )}

                          <Button 
                            onClick={handleSubmit} 
                            className="w-full"
                            disabled={!loanData.loanAmount || !loanData.tenure}
                          >
                            Submit Application
                          </Button>
                        </>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Benefits and Information */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Loan Benefits</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="size-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Eligibility Criteria</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div>
                    <p className="font-semibold mb-1">Policy Requirements:</p>
                    <ul className="space-y-1 text-gray-600 ml-4">
                      <li>• Policy must be active and in force</li>
                      <li>• Minimum policy value: ₹1,00,000</li>
                      <li>• At least 3 years of premiums paid</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold mb-1">Loan Amount:</p>
                    <ul className="space-y-1 text-gray-600 ml-4">
                      <li>• Minimum: ₹10,000</li>
                      <li>• Maximum: 90% of policy surrender value</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold mb-1">Interest Rate:</p>
                    <p className="text-gray-600 ml-4">Starting from 9.5% per annum</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Important Notes</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-gray-600 space-y-2">
                  <p>• Your policy remains active during the loan period</p>
                  <p>• All policy benefits continue except surrender value</p>
                  <p>• Interest is charged on outstanding loan amount</p>
                  <p>• Loan can be prepaid anytime without charges</p>
                  <p>• Failure to repay may result in policy lapse</p>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <Card className="text-center py-8">
            <CardContent>
              <CheckCircle className="size-16 text-green-500 mx-auto mb-4" />
              <h2 className="mb-2">Application Submitted Successfully!</h2>
              <p className="text-gray-600 mb-6">
                Your loan application has been received and is being processed.
              </p>
              <div className="bg-blue-50 p-6 rounded-lg max-w-md mx-auto mb-6">
                <p className="text-sm text-gray-600 mb-2">Application Details</p>
                <div className="space-y-2 text-left">
                  <div className="flex justify-between">
                    <span>Policy Number:</span>
                    <span className="font-semibold">{loanData.policyNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Loan Amount:</span>
                    <span className="font-semibold">₹{parseInt(loanData.loanAmount).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tenure:</span>
                    <span className="font-semibold">{loanData.tenure} months</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Monthly EMI:</span>
                    <span className="font-semibold">₹{calculateEMI().toLocaleString()}</span>
                  </div>
                  <div className="pt-2 border-t">
                    <Badge variant="secondary">Processing</Badge>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                You will receive a confirmation email within 2-3 working days. Our team will contact you if any additional information is required.
              </p>
              <div className="flex gap-3 justify-center">
                <Button variant="outline" onClick={() => {
                  setApplicationSubmitted(false);
                  setLoanData({
                    policyNumber: '',
                    policyType: '',
                    policyValue: '',
                    loanAmount: '',
                    tenure: '',
                  });
                  setEligibility(null);
                }}>
                  Apply for Another Loan
                </Button>
                <Button onClick={() => window.location.href = '/dashboard'}>
                  Go to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}



