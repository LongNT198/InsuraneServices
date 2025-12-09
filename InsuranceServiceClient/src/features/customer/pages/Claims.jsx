import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../shared/components/ui/card';
import { Button } from '../../shared/components/ui/button';
import { Input } from '../../shared/components/ui/input';
import { Label } from '../../shared/components/ui/label';
import { Textarea } from '../../shared/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../shared/components/ui/select';
import { Badge } from '../../shared/components/ui/badge';
import { FileText, Upload, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '../../shared/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../shared/components/ui/tabs';

export function Claims() {
  const [showForm, setShowForm] = useState(false);
  const [claimData, setClaimData] = useState({
    policyNumber: '',
    claimType: '',
    incidentDate: '',
    amount: '',
    description: '',
  });
  const [uploadedFiles, setUploadedFiles] = useState([]);

  // Mock claims data
  const mockClaims = [
    {
      id: 'CLM-2024-001',
      policyNumber: 'LI-2024-0001',
      type: 'Life Insurance',
      claimType: 'Critical Illness',
      amount: 500000,
      status: 'Approved',
      submittedDate: '2024-10-15',
      approvedDate: '2024-11-05',
      paymentDate: '2024-11-10',
    },
    {
      id: 'CLM-2024-002',
      policyNumber: 'MI-2024-0042',
      type: 'Medical Insurance',
      claimType: 'Hospitalization',
      amount: 85000,
      status: 'Processing',
      submittedDate: '2024-11-18',
      approvedDate: null,
      paymentDate: null,
    },
    {
      id: 'CLM-2024-003',
      policyNumber: 'MI-2024-0156',
      type: 'Motor Insurance',
      claimType: 'Accident Damage',
      amount: 45000,
      status: 'Documents Required',
      submittedDate: '2024-11-20',
      approvedDate: null,
      paymentDate: null,
    },
  ];

  const handleFileUpload = (e) => {
    const files = e.target.files;
    if (files) {
      const fileNames = Array.from(files).map(file => file.name);
      setUploadedFiles([...uploadedFiles, ...fileNames]);
    }
  };

  const handleSubmitClaim = () => {
    // In real app, this would submit to backend
    alert('Claim submitted successfully! You will receive a confirmation email shortly.');
    setShowForm(false);
    setClaimData({
      policyNumber: '',
      claimType: '',
      incidentDate: '',
      amount: '',
      description: '',
    });
    setUploadedFiles([]);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Approved':
        return <CheckCircle className="size-5 text-green-500" />;
      case 'Processing':
        return <Clock className="size-5 text-blue-500" />;
      case 'Documents Required':
        return <AlertCircle className="size-5 text-orange-500" />;
      case 'Rejected':
        return <XCircle className="size-5 text-red-500" />;
      default:
        return <Clock className="size-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      'Approved': 'default',
      'Processing': 'secondary',
      'Documents Required': 'outline',
      'Rejected': 'destructive',
    };
    return <Badge variant={variants[status] || 'secondary'}>{status}</Badge>;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="mb-2">Claims Management</h1>
            <p className="text-gray-600">File new claims and track existing ones</p>
          </div>
          <Button onClick={() => setShowForm(!showForm)}>
            <FileText className="size-4 mr-2" />
            {showForm ? 'View Claims' : 'File New Claim'}
          </Button>
        </div>

        {showForm ? (
          <Card>
            <CardHeader>
              <CardTitle>File New Claim</CardTitle>
              <CardDescription>Fill in the details to submit your insurance claim</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="policyNumber">Policy Number</Label>
                  <Select 
                    value={claimData.policyNumber}
                    onValueChange={(value) => setClaimData({ ...claimData, policyNumber: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select policy" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LI-2024-0001">LI-2024-0001 - Life Insurance</SelectItem>
                      <SelectItem value="MI-2024-0042">MI-2024-0042 - Medical Insurance</SelectItem>
                      <SelectItem value="MI-2024-0156">MI-2024-0156 - Motor Insurance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="claimType">Claim Type</Label>
                  <Select 
                    value={claimData.claimType}
                    onValueChange={(value) => setClaimData({ ...claimData, claimType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select claim type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hospitalization">Hospitalization</SelectItem>
                      <SelectItem value="accident">Accident</SelectItem>
                      <SelectItem value="critical-illness">Critical Illness</SelectItem>
                      <SelectItem value="theft">Theft</SelectItem>
                      <SelectItem value="natural-disaster">Natural Disaster</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="incidentDate">Incident Date</Label>
                  <Input
                    id="incidentDate"
                    type="date"
                    value={claimData.incidentDate}
                    onChange={(e) => setClaimData({ ...claimData, incidentDate: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="amount">Claim Amount (₹)</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="50000"
                    value={claimData.amount}
                    onChange={(e) => setClaimData({ ...claimData, amount: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Provide detailed information about the incident..."
                  rows={4}
                  value={claimData.description}
                  onChange={(e) => setClaimData({ ...claimData, description: e.target.value })}
                />
              </div>

              <div>
                <Label>Upload Documents</Label>
                <div className="border-2 border-dashed rounded-lg p-6 text-center">
                  <Upload className="size-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-600 mb-2">
                    Upload supporting documents (Medical bills, FIR, Photos, etc.)
                  </p>
                  <Input
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="max-w-xs mx-auto"
                  />
                </div>
                {uploadedFiles.length > 0 && (
                  <div className="mt-3 space-y-2">
                    <p className="text-sm font-semibold">Uploaded Files:</p>
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm bg-gray-50 p-2 rounded">
                        <FileText className="size-4" />
                        {file}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Alert>
                <AlertCircle className="size-4" />
                <AlertDescription>
                  Please ensure all information is accurate. False claims may result in policy cancellation.
                </AlertDescription>
              </Alert>

              <div className="flex gap-3">
                <Button onClick={() => setShowForm(false)} variant="outline" className="flex-1">
                  Cancel
                </Button>
                <Button 
                  onClick={handleSubmitClaim} 
                  className="flex-1"
                  disabled={!claimData.policyNumber || !claimData.claimType || !claimData.incidentDate}
                >
                  Submit Claim
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All Claims ({mockClaims.length})</TabsTrigger>
              <TabsTrigger value="processing">Processing (1)</TabsTrigger>
              <TabsTrigger value="approved">Approved (1)</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4 mt-6">
              {mockClaims.map((claim) => (
                <Card key={claim.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        {getStatusIcon(claim.status)}
                        <div>
                          <CardTitle className="text-lg">{claim.id}</CardTitle>
                          <CardDescription>
                            {claim.type} - {claim.claimType}
                          </CardDescription>
                        </div>
                      </div>
                      {getStatusBadge(claim.status)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600">Policy Number</p>
                        <p className="font-semibold">{claim.policyNumber}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Claim Amount</p>
                        <p className="font-semibold">₹{claim.amount.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Submitted Date</p>
                        <p>{new Date(claim.submittedDate).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Status Updated</p>
                        <p>{claim.approvedDate ? new Date(claim.approvedDate).toLocaleDateString() : 'Pending'}</p>
                      </div>
                    </div>

                    {claim.status === 'Documents Required' && (
                      <Alert className="mb-4">
                        <AlertCircle className="size-4" />
                        <AlertDescription>
                          Additional documents required. Please upload missing documents to proceed.
                        </AlertDescription>
                      </Alert>
                    )}

                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">View Details</Button>
                      {claim.status === 'Documents Required' && (
                        <Button size="sm">Upload Documents</Button>
                      )}
                      {claim.status === 'Approved' && (
                        <Button size="sm">Download Settlement Letter</Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="processing" className="space-y-4 mt-6">
              {mockClaims.filter(c => c.status === 'Processing').map((claim) => (
                <Card key={claim.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        {getStatusIcon(claim.status)}
                        <div>
                          <CardTitle className="text-lg">{claim.id}</CardTitle>
                          <CardDescription>
                            {claim.type} - {claim.claimType}
                          </CardDescription>
                        </div>
                      </div>
                      {getStatusBadge(claim.status)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Policy Number</p>
                        <p className="font-semibold">{claim.policyNumber}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Claim Amount</p>
                        <p className="font-semibold">₹{claim.amount.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Submitted Date</p>
                        <p>{new Date(claim.submittedDate).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Expected Resolution</p>
                        <p>5-7 business days</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="approved" className="space-y-4 mt-6">
              {mockClaims.filter(c => c.status === 'Approved').map((claim) => (
                <Card key={claim.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        {getStatusIcon(claim.status)}
                        <div>
                          <CardTitle className="text-lg">{claim.id}</CardTitle>
                          <CardDescription>
                            {claim.type} - {claim.claimType}
                          </CardDescription>
                        </div>
                      </div>
                      {getStatusBadge(claim.status)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600">Policy Number</p>
                        <p className="font-semibold">{claim.policyNumber}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Approved Amount</p>
                        <p className="font-semibold text-green-600">₹{claim.amount.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Payment Date</p>
                        <p>{claim.paymentDate ? new Date(claim.paymentDate).toLocaleDateString() : 'Processing'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Payment Status</p>
                        <Badge variant="default">Paid</Badge>
                      </div>
                    </div>
                    <Button size="sm">Download Settlement Letter</Button>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}



