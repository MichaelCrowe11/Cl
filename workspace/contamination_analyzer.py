#!/usr/bin/env python3
"""
Contamination Analyzer for Mycology Lab
Analyzes contamination risks and provides preventive measures
"""

import sys
import random
from datetime import datetime

def analyze_contamination_risk(environment_data):
    """Analyze contamination risk based on environmental factors"""
    
    risk_factors = []
    risk_score = 0
    
    # Temperature analysis
    temp = environment_data.get('temperature', 20)
    if temp > 28:
        risk_factors.append("High temperature increases bacterial growth risk")
        risk_score += 3
    elif temp < 15:
        risk_factors.append("Low temperature may slow mycelium growth")
        risk_score += 1
    
    # Humidity analysis
    humidity = environment_data.get('humidity', 80)
    if humidity > 95:
        risk_factors.append("Excessive humidity promotes mold growth")
        risk_score += 4
    elif humidity < 60:
        risk_factors.append("Low humidity may stress mycelium")
        risk_score += 2
    
    # Air circulation
    air_flow = environment_data.get('air_flow', 'moderate')
    if air_flow == 'poor':
        risk_factors.append("Poor air circulation increases contamination risk")
        risk_score += 3
    
    # Sterilization time
    sterilization_time = environment_data.get('sterilization_minutes', 90)
    if sterilization_time < 60:
        risk_factors.append("Insufficient sterilization time")
        risk_score += 5
    
    # Work environment cleanliness
    cleanliness = environment_data.get('cleanliness_score', 8)
    if cleanliness < 7:
        risk_factors.append("Work environment cleanliness below optimal")
        risk_score += 2
    
    # Calculate risk level
    if risk_score == 0:
        risk_level = "Very Low"
    elif risk_score <= 3:
        risk_level = "Low"
    elif risk_score <= 6:
        risk_level = "Moderate"
    elif risk_score <= 10:
        risk_level = "High"
    else:
        risk_level = "Very High"
    
    return {
        'risk_level': risk_level,
        'risk_score': risk_score,
        'risk_factors': risk_factors,
        'recommendations': get_recommendations(risk_level, risk_factors)
    }

def get_recommendations(risk_level, risk_factors):
    """Provide recommendations based on risk analysis"""
    
    recommendations = []
    
    if "High temperature" in str(risk_factors):
        recommendations.append("Reduce temperature to 18-25°C range")
        recommendations.append("Improve ventilation and cooling")
    
    if "humidity" in str(risk_factors).lower():
        recommendations.append("Adjust humidity to 75-85% for optimal growth")
        recommendations.append("Use humidity controllers and monitors")
    
    if "air circulation" in str(risk_factors).lower():
        recommendations.append("Install HEPA filtration system")
        recommendations.append("Increase air exchange rate")
    
    if "sterilization" in str(risk_factors).lower():
        recommendations.append("Extend sterilization to 90-120 minutes at 121°C")
        recommendations.append("Verify autoclave calibration")
    
    if "cleanliness" in str(risk_factors).lower():
        recommendations.append("Implement stricter sanitation protocols")
        recommendations.append("Use 70% isopropyl alcohol for surface disinfection")
    
    # General recommendations
    if risk_level in ["High", "Very High"]:
        recommendations.extend([
            "Consider batch isolation until conditions improve",
            "Increase monitoring frequency",
            "Review entire contamination prevention protocol"
        ])
    
    return recommendations

def main():
    print("=== Crowe Logic AI Contamination Analyzer ===")
    print("Analyzing contamination risks in mycology cultivation")
    print("-" * 50)
    
    # Sample data or user input
    if len(sys.argv) > 1 and sys.argv[1] == "sample":
        # Use sample data for demonstration
        environment_data = {
            'temperature': 24,
            'humidity': 82,
            'air_flow': 'good',
            'sterilization_minutes': 90,
            'cleanliness_score': 8
        }
        print("Using sample environmental data...")
    else:
        print("Enter environmental parameters:")
        environment_data = {
            'temperature': float(input("Temperature (°C): ") or "22"),
            'humidity': float(input("Humidity (%): ") or "80"),
            'air_flow': input("Air flow (poor/moderate/good): ") or "moderate",
            'sterilization_minutes': int(input("Sterilization time (minutes): ") or "90"),
            'cleanliness_score': int(input("Cleanliness score (1-10): ") or "8")
        }
    
    print(f"\nAnalyzing contamination risk...")
    print("-" * 35)
    
    results = analyze_contamination_risk(environment_data)
    
    print(f"Risk Level: {results['risk_level']}")
    print(f"Risk Score: {results['risk_score']}/15")
    
    if results['risk_factors']:
        print(f"\nIdentified Risk Factors:")
        for i, factor in enumerate(results['risk_factors'], 1):
            print(f"{i}. {factor}")
    else:
        print(f"\n✅ No significant risk factors identified")
    
    if results['recommendations']:
        print(f"\nRecommendations:")
        for i, rec in enumerate(results['recommendations'], 1):
            print(f"{i}. {rec}")
    
    print(f"\nAnalysis completed at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")

if __name__ == "__main__":
    main()
