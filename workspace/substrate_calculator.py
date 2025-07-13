#!/usr/bin/env python3
"""
Substrate Calculator for Mycology Lab
Calculates optimal substrate ratios for mushroom cultivation
"""

import sys
import json
from datetime import datetime

def calculate_substrate_ratio(mushroom_type, total_weight_kg):
    """Calculate substrate composition based on mushroom type"""
    
    substrate_ratios = {
        'oyster': {
            'straw': 0.5,
            'sawdust': 0.3,
            'bran': 0.15,
            'lime': 0.05
        },
        'shiitake': {
            'sawdust': 0.7,
            'bran': 0.2,
            'supplements': 0.1
        },
        'lions_mane': {
            'sawdust': 0.6,
            'straw': 0.25,
            'supplements': 0.15
        },
        'reishi': {
            'sawdust': 0.8,
            'supplements': 0.2
        }
    }
    
    if mushroom_type.lower() not in substrate_ratios:
        return None
    
    ratios = substrate_ratios[mushroom_type.lower()]
    results = {}
    
    for component, ratio in ratios.items():
        weight = total_weight_kg * ratio
        results[component] = round(weight, 2)
    
    return results

def main():
    print("=== Crowe Logic AI Substrate Calculator ===")
    print("Optimizing substrate composition for mushroom cultivation")
    print("-" * 50)
    
    if len(sys.argv) >= 3:
        mushroom_type = sys.argv[1]
        total_weight = float(sys.argv[2])
    else:
        print("Available mushroom types: oyster, shiitake, lions_mane, reishi")
        mushroom_type = input("Enter mushroom type: ").strip()
        total_weight = float(input("Enter total substrate weight (kg): "))
    
    results = calculate_substrate_ratio(mushroom_type, total_weight)
    
    if results:
        print(f"\nSubstrate composition for {total_weight}kg of {mushroom_type} substrate:")
        print("-" * 40)
        
        total_calculated = 0
        for component, weight in results.items():
            print(f"{component.capitalize()}: {weight} kg")
            total_calculated += weight
        
        print("-" * 40)
        print(f"Total: {round(total_calculated, 2)} kg")
        
        # Generate protocol
        print(f"\nMixing Protocol:")
        print("1. Prepare all components separately")
        print("2. Hydrate dry materials to 60-65% moisture")
        print("3. Mix components thoroughly")
        print("4. Sterilize at 121°C for 90 minutes")
        print("5. Cool to room temperature before inoculation")
        
    else:
        print(f"Error: Unknown mushroom type '{mushroom_type}'")
        print("Available types: oyster, shiitake, lions_mane, reishi")

if __name__ == "__main__":
    main()
