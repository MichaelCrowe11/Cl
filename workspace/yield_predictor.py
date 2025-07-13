#!/usr/bin/env python3
"""
Yield Predictor for Mycology Lab
Predicts mushroom yields based on substrate and environmental conditions
"""

import sys
import math
from datetime import datetime, timedelta

def predict_yield(species, substrate_weight, temperature, humidity, co2_level):
    """Predict mushroom yield based on cultivation parameters"""
    
    # Base yield ratios (kg mushrooms per kg substrate)
    base_yields = {
        'oyster': 0.25,
        'shiitake': 0.20,
        'lions_mane': 0.15,
        'reishi': 0.10
    }
    
    # Optimal conditions
    optimal_conditions = {
        'oyster': {'temp': 22, 'humidity': 85, 'co2': 800},
        'shiitake': {'temp': 18, 'humidity': 80, 'co2': 1000},
        'lions_mane': {'temp': 20, 'humidity': 90, 'co2': 600},
        'reishi': {'temp': 25, 'humidity': 85, 'co2': 1200}
    }
    
    if species.lower() not in base_yields:
        return None
    
    base_yield = base_yields[species.lower()]
    optimal = optimal_conditions[species.lower()]
    
    # Calculate efficiency factors
    temp_factor = 1 - abs(temperature - optimal['temp']) * 0.02
    humidity_factor = 1 - abs(humidity - optimal['humidity']) * 0.01
    co2_factor = 1 - abs(co2_level - optimal['co2']) * 0.0001
    
    # Ensure factors don't go below 0.3
    temp_factor = max(0.3, temp_factor)
    humidity_factor = max(0.3, humidity_factor)
    co2_factor = max(0.3, co2_factor)
    
    # Calculate predicted yield
    efficiency = temp_factor * humidity_factor * co2_factor
    predicted_yield = substrate_weight * base_yield * efficiency
    
    # Estimate harvest timing
    harvest_days = {
        'oyster': 7,
        'shiitake': 14,
        'lions_mane': 10,
        'reishi': 21
    }
    
    days_to_harvest = harvest_days[species.lower()]
    
    return {
        'predicted_yield_kg': round(predicted_yield, 2),
        'efficiency_percent': round(efficiency * 100, 1),
        'days_to_harvest': days_to_harvest,
        'harvest_date': (datetime.now() + timedelta(days=days_to_harvest)).strftime('%Y-%m-%d'),
        'factors': {
            'temperature': round(temp_factor, 2),
            'humidity': round(humidity_factor, 2),
            'co2': round(co2_factor, 2)
        }
    }

def main():
    print("=== Crowe Logic AI Yield Predictor ===")
    print("Predicting mushroom yields based on environmental conditions")
    print("-" * 55)
    
    if len(sys.argv) >= 6:
        species = sys.argv[1]
        substrate_weight = float(sys.argv[2])
        temperature = float(sys.argv[3])
        humidity = float(sys.argv[4])
        co2_level = float(sys.argv[5])
    else:
        print("Available species: oyster, shiitake, lions_mane, reishi")
        species = input("Enter mushroom species: ").strip()
        substrate_weight = float(input("Enter substrate weight (kg): "))
        temperature = float(input("Enter temperature (°C): "))
        humidity = float(input("Enter humidity (%): "))
        co2_level = float(input("Enter CO2 level (ppm): "))
    
    results = predict_yield(species, substrate_weight, temperature, humidity, co2_level)
    
    if results:
        print(f"\nYield Prediction for {species.capitalize()} Mushrooms:")
        print("-" * 45)
        print(f"Substrate Weight: {substrate_weight} kg")
        print(f"Predicted Yield: {results['predicted_yield_kg']} kg")
        print(f"Efficiency: {results['efficiency_percent']}%")
        print(f"Days to Harvest: {results['days_to_harvest']} days")
        print(f"Expected Harvest Date: {results['harvest_date']}")
        
        print(f"\nEnvironmental Factor Analysis:")
        print(f"Temperature Factor: {results['factors']['temperature']}")
        print(f"Humidity Factor: {results['factors']['humidity']}")
        print(f"CO2 Factor: {results['factors']['co2']}")
        
        if results['efficiency_percent'] < 70:
            print(f"\n⚠️  Warning: Low efficiency predicted")
            print("Consider adjusting environmental conditions for better yield")
        elif results['efficiency_percent'] > 90:
            print(f"\n✅ Excellent conditions! High yield expected")
        
    else:
        print(f"Error: Unknown species '{species}'")
        print("Available species: oyster, shiitake, lions_mane, reishi")

if __name__ == "__main__":
    main()
