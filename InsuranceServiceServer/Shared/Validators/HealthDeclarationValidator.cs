using InsuranceServiceServer.Shared.DTOs;

namespace InsuranceServiceServer.Shared.Validators;

public static class HealthDeclarationValidator
{
    public class ValidationResult
    {
        public bool IsValid { get; set; }
        public List<string> Errors { get; set; } = new();
    }

    public static ValidationResult Validate(HealthDeclarationDto health)
    {
        var result = new ValidationResult { IsValid = true };

        // Validate Height (100-250 cm)
        if (!string.IsNullOrEmpty(health.Height))
        {
            if (decimal.TryParse(health.Height, out var height))
            {
                if (height < 100 || height > 250)
                {
                    result.IsValid = false;
                    result.Errors.Add("Height must be between 100 and 250 cm");
                }
            }
            else
            {
                result.IsValid = false;
                result.Errors.Add("Height must be a valid number");
            }
        }

        // Validate Weight (30-300 kg)
        if (!string.IsNullOrEmpty(health.Weight))
        {
            if (decimal.TryParse(health.Weight, out var weight))
            {
                if (weight < 30 || weight > 300)
                {
                    result.IsValid = false;
                    result.Errors.Add("Weight must be between 30 and 300 kg");
                }
            }
            else
            {
                result.IsValid = false;
                result.Errors.Add("Weight must be a valid number");
            }
        }

        // Validate Blood Pressure Systolic (70-200 mmHg)
        if (!string.IsNullOrEmpty(health.BloodPressureSystolic))
        {
            if (int.TryParse(health.BloodPressureSystolic, out var systolic))
            {
                if (systolic < 70 || systolic > 200)
                {
                    result.IsValid = false;
                    result.Errors.Add("Systolic blood pressure must be between 70 and 200 mmHg");
                }
            }
            else
            {
                result.IsValid = false;
                result.Errors.Add("Systolic blood pressure must be a valid number");
            }
        }

        // Validate Blood Pressure Diastolic (40-130 mmHg)
        if (!string.IsNullOrEmpty(health.BloodPressureDiastolic))
        {
            if (int.TryParse(health.BloodPressureDiastolic, out var diastolic))
            {
                if (diastolic < 40 || diastolic > 130)
                {
                    result.IsValid = false;
                    result.Errors.Add("Diastolic blood pressure must be between 40 and 130 mmHg");
                }
            }
            else
            {
                result.IsValid = false;
                result.Errors.Add("Diastolic blood pressure must be a valid number");
            }
        }

        // Validate both BP values are provided together
        var hasSystolic = !string.IsNullOrEmpty(health.BloodPressureSystolic);
        var hasDiastolic = !string.IsNullOrEmpty(health.BloodPressureDiastolic);
        if (hasSystolic != hasDiastolic)
        {
            result.IsValid = false;
            result.Errors.Add("Both systolic and diastolic blood pressure must be provided together");
        }

        // Validate systolic > diastolic
        if (hasSystolic && hasDiastolic)
        {
            if (int.TryParse(health.BloodPressureSystolic, out var sys) &&
                int.TryParse(health.BloodPressureDiastolic, out var dia))
            {
                if (sys <= dia)
                {
                    result.IsValid = false;
                    result.Errors.Add("Systolic blood pressure must be higher than diastolic");
                }
            }
        }

        // Validate Cholesterol (100-400 mg/dL)
        if (!string.IsNullOrEmpty(health.CholesterolLevel))
        {
            if (int.TryParse(health.CholesterolLevel, out var cholesterol))
            {
                if (cholesterol < 100 || cholesterol > 400)
                {
                    result.IsValid = false;
                    result.Errors.Add("Cholesterol level must be between 100 and 400 mg/dL");
                }
            }
            else
            {
                result.IsValid = false;
                result.Errors.Add("Cholesterol level must be a valid number");
            }
        }

        // Validate Resting Heart Rate (40-120 bpm)
        if (!string.IsNullOrEmpty(health.RestingHeartRate))
        {
            if (int.TryParse(health.RestingHeartRate, out var heartRate))
            {
                if (heartRate < 40 || heartRate > 120)
                {
                    result.IsValid = false;
                    result.Errors.Add("Resting heart rate must be between 40 and 120 bpm");
                }
            }
            else
            {
                result.IsValid = false;
                result.Errors.Add("Resting heart rate must be a valid number");
            }
        }

        // Validate Average Sleep Hours (3-12 hours)
        if (!string.IsNullOrEmpty(health.AverageSleepHours))
        {
            if (decimal.TryParse(health.AverageSleepHours, out var sleepHours))
            {
                if (sleepHours < 3 || sleepHours > 12)
                {
                    result.IsValid = false;
                    result.Errors.Add("Average sleep hours must be between 3 and 12 hours");
                }
            }
            else
            {
                result.IsValid = false;
                result.Errors.Add("Average sleep hours must be a valid number");
            }
        }

        // Validate Exercise Hours (0-50 hours per week)
        if (!string.IsNullOrEmpty(health.ExerciseHoursPerWeek))
        {
            if (decimal.TryParse(health.ExerciseHoursPerWeek, out var exerciseHours))
            {
                if (exerciseHours < 0 || exerciseHours > 50)
                {
                    result.IsValid = false;
                    result.Errors.Add("Exercise hours per week must be between 0 and 50 hours");
                }
            }
            else
            {
                result.IsValid = false;
                result.Errors.Add("Exercise hours per week must be a valid number");
            }
        }

        // Validate HbA1c (4.0-15.0%)
        if (!string.IsNullOrEmpty(health.DiabetesHbA1c))
        {
            if (decimal.TryParse(health.DiabetesHbA1c, out var hba1c))
            {
                if (hba1c < 4.0m || hba1c > 15.0m)
                {
                    result.IsValid = false;
                    result.Errors.Add("HbA1c level must be between 4.0 and 15.0%");
                }
            }
            else
            {
                result.IsValid = false;
                result.Errors.Add("HbA1c level must be a valid number");
            }
        }

        // Validate enum values
        var validSmokingStatus = new[] { "non-smoker", "occasional", "regular", "heavy" };
        if (!validSmokingStatus.Contains(health.SmokingStatus?.ToLower()))
        {
            result.IsValid = false;
            result.Errors.Add($"Smoking status must be one of: {string.Join(", ", validSmokingStatus)}");
        }

        var validAlcoholLevels = new[] { "none", "light", "moderate", "heavy" };
        if (!validAlcoholLevels.Contains(health.AlcoholConsumptionLevel?.ToLower()))
        {
            result.IsValid = false;
            result.Errors.Add($"Alcohol consumption level must be one of: {string.Join(", ", validAlcoholLevels)}");
        }

        var validExerciseLevels = new[] { "sedentary", "light", "moderate", "active", "very-active" };
        if (!validExerciseLevels.Contains(health.ExerciseLevel?.ToLower()))
        {
            result.IsValid = false;
            result.Errors.Add($"Exercise level must be one of: {string.Join(", ", validExerciseLevels)}");
        }

        var validSleepQuality = new[] { "poor", "fair", "good", "excellent" };
        if (!validSleepQuality.Contains(health.SleepQuality?.ToLower()))
        {
            result.IsValid = false;
            result.Errors.Add($"Sleep quality must be one of: {string.Join(", ", validSleepQuality)}");
        }

        var validStressLevels = new[] { "low", "moderate", "high", "very-high" };
        if (!validStressLevels.Contains(health.StressLevel?.ToLower()))
        {
            result.IsValid = false;
            result.Errors.Add($"Stress level must be one of: {string.Join(", ", validStressLevels)}");
        }

        var validDietQuality = new[] { "poor", "fair", "balanced", "healthy", "very-healthy" };
        if (!validDietQuality.Contains(health.DietQuality?.ToLower()))
        {
            result.IsValid = false;
            result.Errors.Add($"Diet quality must be one of: {string.Join(", ", validDietQuality)}");
        }

        return result;
    }
}
