#!/usr/bin/env python3
"""
Test script to demonstrate dual-AI analysis with authentic cordyceps specimens
"""

import json
import os
from enhanced_vision_validator import validate_uploaded_specimen_image
from crowe_logic_ai_integration import analyze_specimen_with_crowe_logic

def test_cordyceps_analysis():
    """Test the dual-AI system with authentic cordyceps specimens."""
    
    # Specimen metadata for the cordyceps samples
    specimen_metadata = {
        'specimen_type': 'dried',
        'species': 'Cordyceps militaris',
        'location': 'Laboratory cultivation',
        'collection_date': '2024-12-15',
        'description': 'Dried cordyceps specimens for bioactivity research',
        'claimed_species': 'Cordyceps militaris'
    }
    
    # Test both cordyceps images
    test_images = [
        'attached_assets/IMG_9717.jpeg',
        'attached_assets/IMG_9719.jpeg'
    ]
    
    results = {}
    
    for i, image_path in enumerate(test_images, 1):
        print(f"\n{'='*60}")
        print(f"ANALYZING CORDYCEPS SPECIMEN {i}: {os.path.basename(image_path)}")
        print('='*60)
        
        try:
            # OpenAI Vision Analysis
            print("\n🔍 Running OpenAI Vision Analysis...")
            openai_results = validate_uploaded_specimen_image(image_path, specimen_metadata)
            
            print("✅ OpenAI Vision Analysis Complete!")
            print(f"   • Authenticity: {openai_results.get('is_authentic', 'Unknown')}")
            print(f"   • Confidence: {openai_results.get('identification_confidence', 0):.2%}")
            
            # Prepare data for Crowe Logic AI
            enhanced_specimen_data = {
                **specimen_metadata,
                'vision_analysis_results': openai_results,
                'image_path': image_path,
                'specimen_number': i
            }
            
            # Crowe Logic AI Analysis
            print("\n🧠 Running Crowe Logic AI Analysis...")
            crowe_results = analyze_specimen_with_crowe_logic(
                enhanced_specimen_data,
                analysis_type='premium_dried_specimen',
                research_context={
                    'purpose': 'bioactivity_research',
                    'commercial_grade': 'premium',
                    'analysis_depth': 'comprehensive'
                }
            )
            
            print("✅ Crowe Logic AI Analysis Complete!")
            if 'species_identification' in crowe_results:
                print(f"   • Species: {crowe_results['species_identification'].get('primary_identification', 'Unknown')}")
                print(f"   • Expert Confidence: {crowe_results['species_identification'].get('confidence_level', 0):.2%}")
            
            # Calculate consensus
            openai_confidence = openai_results.get('identification_confidence', 0)
            crowe_confidence = crowe_results.get('species_identification', {}).get('confidence_level', 0)
            consensus_confidence = (openai_confidence * 0.4) + (crowe_confidence * 0.6)
            
            print(f"\n🎯 DUAL-AI CONSENSUS:")
            print(f"   • OpenAI Confidence: {openai_confidence:.2%}")
            print(f"   • Crowe Logic Confidence: {crowe_confidence:.2%}")
            print(f"   • Consensus Score: {consensus_confidence:.2%}")
            
            # Store results
            results[f'specimen_{i}'] = {
                'image_path': image_path,
                'openai_analysis': openai_results,
                'crowe_analysis': crowe_results,
                'consensus': {
                    'confidence': consensus_confidence,
                    'openai_confidence': openai_confidence,
                    'crowe_confidence': crowe_confidence
                }
            }
            
        except Exception as e:
            print(f"❌ Error analyzing {image_path}: {str(e)}")
            results[f'specimen_{i}'] = {'error': str(e)}
    
    # Save comprehensive results
    output_file = 'results/cordyceps_dual_ai_analysis.json'
    os.makedirs('results', exist_ok=True)
    
    with open(output_file, 'w') as f:
        json.dump(results, f, indent=2, default=str)
    
    print(f"\n📊 ANALYSIS COMPLETE!")
    print(f"   • Results saved to: {output_file}")
    print(f"   • Specimens analyzed: {len([r for r in results.values() if 'error' not in r])}")
    
    return results

if __name__ == "__main__":
    results = test_cordyceps_analysis()