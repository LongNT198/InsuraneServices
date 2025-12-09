import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Input } from '../../../../shared/components/ui/input';
import { Label } from '../../../../shared/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../shared/components/ui/select';
import { Checkbox } from '../../../../shared/components/ui/checkbox';
import { Alert, AlertDescription } from '../../../../shared/components/ui/alert';
import { Users, Plus, Trash2, ArrowLeft, ArrowRight, Info } from 'lucide-react';

const RELATIONSHIPS = [
  'Spouse', 'Son', 'Daughter', 'Father', 'Mother', 
  'Brother', 'Sister', 'Father-in-law', 'Mother-in-law',
  'Grandfather', 'Grandmother', 'Uncle', 'Aunt', 'Other'
];

export default function NomineesStep({ data, onNext, onBack }) {
  const [nominees, setNominees] = useState(
    data?.nominees?.length > 0
      ? data.nominees
      : [{ 
          name: '', 
          relationship: '', 
          dateOfBirth: '', 
          percentage: 100,
          hasPreExistingCondition: false,
          conditionDetails: ''
        }]
  );
  const [errors, setErrors] = useState({});

  const addNominee = () => {
    if (nominees.length < 5) {
      const currentTotal = nominees.reduce((sum, n) => sum + (parseInt(n.percentage) || 0), 0);
      const remainingPercentage = Math.max(0, 100 - currentTotal);
      
      setNominees([
        ...nominees,
        { 
          name: '', 
          relationship: '', 
          dateOfBirth: '', 
          percentage: remainingPercentage,
          hasPreExistingCondition: false,
          conditionDetails: ''
        }
      ]);
    }
  };

  const removeNominee = (index) => {
    if (nominees.length > 1) {
      const newNominees = nominees.filter((_, i) => i !== index);
      // Redistribute percentages
      const equalPercentage = Math.floor(100 / newNominees.length);
      const remainder = 100 - (equalPercentage * newNominees.length);
      
      newNominees.forEach((nominee, i) => {
        nominee.percentage = equalPercentage + (i === 0 ? remainder : 0);
      });
      
      setNominees(newNominees);
      
      // Clear errors for removed nominee
      const newErrors = { ...errors };
      Object.keys(newErrors).forEach(key => {
        if (key.startsWith(`nominee_${index}_`)) {
          delete newErrors[key];
        }
      });
      setErrors(newErrors);
    }
  };

  const handleNomineeChange = (index, field, value) => {
    const newNominees = [...nominees];
    newNominees[index] = { ...newNominees[index], [field]: value };
    setNominees(newNominees);
    
    // Clear specific error
    setErrors(prev => ({
      ...prev,
      [`nominee_${index}_${field}`]: ''
    }));
  };

  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return null;
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const validate = () => {
    const newErrors = {};

    // Validate each nominee
    nominees.forEach((nominee, index) => {
      if (!nominee.name || nominee.name.trim() === '') {
        newErrors[`nominee_${index}_name`] = 'Name is required';
      }

      if (!nominee.relationship) {
        newErrors[`nominee_${index}_relationship`] = 'Relationship is required';
      }

      if (!nominee.dateOfBirth) {
        newErrors[`nominee_${index}_dateOfBirth`] = 'Date of birth is required';
      } else {
        const age = calculateAge(nominee.dateOfBirth);
        if (age < 0 || age > 120) {
          newErrors[`nominee_${index}_dateOfBirth`] = 'Invalid date of birth';
        }
      }

      if (!nominee.percentage || nominee.percentage <= 0 || nominee.percentage > 100) {
        newErrors[`nominee_${index}_percentage`] = 'Percentage must be between 1 and 100';
      }

      if (nominee.hasPreExistingCondition && (!nominee.conditionDetails || nominee.conditionDetails.trim() === '')) {
        newErrors[`nominee_${index}_conditionDetails`] = 'Please provide condition details';
      }
    });

    // Validate total percentage
    const totalPercentage = nominees.reduce((sum, n) => sum + (parseInt(n.percentage) || 0), 0);
    if (totalPercentage !== 100) {
      newErrors.totalPercentage = `Total percentage must equal 100% (currently ${totalPercentage}%)`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) {
      onNext({ nominees });
    }
  };

  const totalPercentage = nominees.reduce((sum, n) => sum + (parseInt(n.percentage) || 0), 0);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Nominee Information
          </CardTitle>
          <CardDescription>
            Add the family members or individuals who will benefit from this health insurance policy
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Important:</strong> You can add up to 5 nominees. The total percentage allocation must equal 100%.
              Nominees will receive claim benefits in case of the policyholder's demise.
            </AlertDescription>
          </Alert>

          {nominees.map((nominee, index) => (
            <Card key={index} className="p-4 bg-gray-50">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-semibold">Nominee {index + 1}</h4>
                {nominees.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeNominee(index)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Remove
                  </Button>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {/* Name */}
                <div>
                  <Label htmlFor={`nominee_${index}_name`}>Full Name *</Label>
                  <Input
                    id={`nominee_${index}_name`}
                    value={nominee.name}
                    onChange={(e) => handleNomineeChange(index, 'name', e.target.value)}
                    placeholder="Enter full name"
                  />
                  {errors[`nominee_${index}_name`] && (
                    <p className="text-sm text-red-600 mt-1">{errors[`nominee_${index}_name`]}</p>
                  )}
                </div>

                {/* Relationship */}
                <div>
                  <Label htmlFor={`nominee_${index}_relationship`}>Relationship *</Label>
                  <Select
                    value={nominee.relationship}
                    onValueChange={(value) => handleNomineeChange(index, 'relationship', value)}
                  >
                    <SelectTrigger id={`nominee_${index}_relationship`}>
                      <SelectValue placeholder="Select relationship" />
                    </SelectTrigger>
                    <SelectContent>
                      {RELATIONSHIPS.map(rel => (
                        <SelectItem key={rel} value={rel}>
                          {rel}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors[`nominee_${index}_relationship`] && (
                    <p className="text-sm text-red-600 mt-1">{errors[`nominee_${index}_relationship`]}</p>
                  )}
                </div>

                {/* Date of Birth */}
                <div>
                  <Label htmlFor={`nominee_${index}_dateOfBirth`}>Date of Birth *</Label>
                  <Input
                    id={`nominee_${index}_dateOfBirth`}
                    type="date"
                    value={nominee.dateOfBirth}
                    onChange={(e) => handleNomineeChange(index, 'dateOfBirth', e.target.value)}
                    max={new Date().toISOString().split('T')[0]}
                  />
                  {nominee.dateOfBirth && (
                    <p className="text-xs text-gray-600 mt-1">
                      Age: {calculateAge(nominee.dateOfBirth)} years
                    </p>
                  )}
                  {errors[`nominee_${index}_dateOfBirth`] && (
                    <p className="text-sm text-red-600 mt-1">{errors[`nominee_${index}_dateOfBirth`]}</p>
                  )}
                </div>

                {/* Percentage */}
                <div>
                  <Label htmlFor={`nominee_${index}_percentage`}>Benefit Percentage (%) *</Label>
                  <Input
                    id={`nominee_${index}_percentage`}
                    type="number"
                    min="1"
                    max="100"
                    value={nominee.percentage}
                    onChange={(e) => handleNomineeChange(index, 'percentage', e.target.value)}
                    placeholder="Enter percentage"
                  />
                  {errors[`nominee_${index}_percentage`] && (
                    <p className="text-sm text-red-600 mt-1">{errors[`nominee_${index}_percentage`]}</p>
                  )}
                </div>
              </div>

              {/* Pre-existing Condition */}
              <div className="mt-4 space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`nominee_${index}_hasPreExistingCondition`}
                    checked={nominee.hasPreExistingCondition}
                    onCheckedChange={(checked) => handleNomineeChange(index, 'hasPreExistingCondition', checked)}
                  />
                  <Label htmlFor={`nominee_${index}_hasPreExistingCondition`} className="cursor-pointer">
                    This nominee has pre-existing medical conditions
                  </Label>
                </div>

                {nominee.hasPreExistingCondition && (
                  <div>
                    <Label htmlFor={`nominee_${index}_conditionDetails`}>Condition Details *</Label>
                    <Input
                      id={`nominee_${index}_conditionDetails`}
                      value={nominee.conditionDetails}
                      onChange={(e) => handleNomineeChange(index, 'conditionDetails', e.target.value)}
                      placeholder="Describe the pre-existing conditions"
                    />
                    {errors[`nominee_${index}_conditionDetails`] && (
                      <p className="text-sm text-red-600 mt-1">{errors[`nominee_${index}_conditionDetails`]}</p>
                    )}
                  </div>
                )}
              </div>
            </Card>
          ))}

          {/* Add Nominee Button */}
          {nominees.length < 5 && (
            <Button
              type="button"
              variant="outline"
              onClick={addNominee}
              className="w-full"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Another Nominee
            </Button>
          )}

          {/* Percentage Summary */}
          <Card className={`p-4 ${totalPercentage === 100 ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}>
            <div className="flex items-center justify-between">
              <span className="font-medium">Total Percentage Allocation:</span>
              <span className={`text-lg font-bold ${totalPercentage === 100 ? 'text-green-600' : 'text-yellow-600'}`}>
                {totalPercentage}%
              </span>
            </div>
            {errors.totalPercentage && (
              <p className="text-sm text-red-600 mt-2">{errors.totalPercentage}</p>
            )}
          </Card>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button type="button" onClick={handleNext}>
          Continue to Documents
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
