import { useEffect, useState } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

export function PasswordStrength({ password }) {
  const [strength, setStrength] = useState({
    score: 0,
    label: '',
    color: '',
    checks: {
      length: false,
      uppercase: false,
      lowercase: false,
      number: false,
      special: false,
    },
  });

  useEffect(() => {
    if (!password) {
      setStrength({
        score: 0,
        label: '',
        color: '',
        checks: {
          length: false,
          uppercase: false,
          lowercase: false,
          number: false,
          special: false,
        },
      });
      return;
    }

    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
    };

    const score = Object.values(checks).filter(Boolean).length;
    
    let label = '';
    let color = '';
    
    if (score === 0) {
      label = '';
      color = '';
    } else if (score <= 2) {
      label = 'Weak';
      color = 'text-red-600 bg-red-100';
    } else if (score === 3) {
      label = 'Fair';
      color = 'text-orange-600 bg-orange-100';
    } else if (score === 4) {
      label = 'Good';
      color = 'text-yellow-600 bg-yellow-100';
    } else {
      label = 'Strong';
      color = 'text-green-600 bg-green-100';
    }

    setStrength({ score, label, color, checks });
  }, [password]);

  if (!password) return null;

  return (
    <div className="space-y-2 mt-2">
      {/* Strength indicator bar */}
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((level) => (
          <div
            key={level}
            className={`h-1 flex-1 rounded-full transition-colors ${
              level <= strength.score
                ? strength.score <= 2
                  ? 'bg-red-500'
                  : strength.score === 3
                  ? 'bg-orange-500'
                  : strength.score === 4
                  ? 'bg-yellow-500'
                  : 'bg-green-500'
                : 'bg-gray-200'
            }`}
          />
        ))}
      </div>

      {/* Strength label */}
      {strength.label && (
        <div className="flex items-center justify-between">
          <span className={`text-xs font-medium px-2 py-1 rounded ${strength.color}`}>
            {strength.label}
          </span>
        </div>
      )}

      {/* Requirements checklist */}
      <div className="space-y-1 text-xs">
        <div className="font-medium text-gray-700">Password must contain:</div>
        <div className={`flex items-center gap-1 ${strength.checks.length ? 'text-green-600' : 'text-gray-500'}`}>
          {strength.checks.length ? <CheckCircle className="size-3" /> : <XCircle className="size-3" />}
          <span>At least 8 characters</span>
        </div>
        <div className={`flex items-center gap-1 ${strength.checks.uppercase ? 'text-green-600' : 'text-gray-500'}`}>
          {strength.checks.uppercase ? <CheckCircle className="size-3" /> : <XCircle className="size-3" />}
          <span>One uppercase letter (A-Z)</span>
        </div>
        <div className={`flex items-center gap-1 ${strength.checks.lowercase ? 'text-green-600' : 'text-gray-500'}`}>
          {strength.checks.lowercase ? <CheckCircle className="size-3" /> : <XCircle className="size-3" />}
          <span>One lowercase letter (a-z)</span>
        </div>
        <div className={`flex items-center gap-1 ${strength.checks.number ? 'text-green-600' : 'text-gray-500'}`}>
          {strength.checks.number ? <CheckCircle className="size-3" /> : <XCircle className="size-3" />}
          <span>One number (0-9)</span>
        </div>
        <div className={`flex items-center gap-1 ${strength.checks.special ? 'text-green-600' : 'text-gray-500'}`}>
          {strength.checks.special ? <CheckCircle className="size-3" /> : <XCircle className="size-3" />}
          <span>One special character (!@#$%...)</span>
        </div>
      </div>
    </div>
  );
}


