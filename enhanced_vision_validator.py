"""
Enhanced Mycology Vision Validation with OpenAI Computer Vision

Combines OpenAI's vision model with specialized mycology expertise for 
comprehensive image validation and specimen analysis.
"""

import os
import json
import base64
import logging
from typing import Dict, List, Any, Optional, Tuple
from pathlib import Path
import cv2
import numpy as np
from openai import OpenAI
from mycology_data_validator import MycologyDataValidator

logger = logging.getLogger(__name__)

class EnhancedVisionValidator:
    """Advanced vision validation system for mycological specimens using OpenAI vision models."""
    
    def __init__(self):
        self.client = OpenAI(api_key=os.environ.get('OPENAI_API_KEY'))
        self.vision_model = 'gpt-4o'  # Latest model with vision capabilities
        self.data_validator = MycologyDataValidator()
        
    def encode_image_to_base64(self, image_path: str) -> str:
        """
        Encode image to base64 for OpenAI vision API.
        
        Args:
            image_path: Path to the image file
            
        Returns:
            str: Base64 encoded image
        """
        try:
            with open(image_path, "rb") as image_file:
                return base64.b64encode(image_file.read()).decode('utf-8')
        except Exception as e:
            logger.error(f"Failed to encode image {image_path}: {str(e)}")
            raise
    
    def validate_specimen_image(self, image_path: str, specimen_metadata: Dict[str, Any] = None) -> Dict[str, Any]:
        """
        Comprehensive validation of specimen image using OpenAI vision + mycology expertise.
        
        Args:
            image_path: Path to specimen image
            specimen_metadata: Optional metadata about the specimen
            
        Returns:
            Dict: Comprehensive validation results
        """
        
        logger.info(f"Starting enhanced vision validation for: {image_path}")
        
        # Encode image for OpenAI
        base64_image = self.encode_image_to_base64(image_path)
        
        # Create comprehensive validation prompt
        validation_prompt = self._create_vision_validation_prompt(specimen_metadata)
        
        try:
            response = self.client.chat.completions.create(
                model=self.vision_model,
                messages=[
                    {
                        "role": "user",
                        "content": [
                            {
                                "type": "text",
                                "text": validation_prompt
                            },
                            {
                                "type": "image_url",
                                "image_url": {
                                    "url": f"data:image/jpeg;base64,{base64_image}",
                                    "detail": "high"  # High detail for accurate analysis
                                }
                            }
                        ]
                    }
                ],
                max_tokens=2000,
                temperature=0.1  # Low temperature for consistent analysis
            )
            
            # Parse the structured response
            response_content = response.choices[0].message.content.strip()
            
            # Clean JSON if wrapped in code blocks
            if response_content.startswith('```json'):
                response_content = response_content[7:-3]
            
            vision_results = json.loads(response_content)
            
            # Add image processing metrics
            image_quality_metrics = self._analyze_image_quality(image_path)
            vision_results['image_quality'] = image_quality_metrics
            
            # Cross-validate with metadata if provided
            if specimen_metadata:
                metadata_validation = self._cross_validate_with_metadata(vision_results, specimen_metadata)
                vision_results['metadata_consistency'] = metadata_validation
            
            logger.info(f"Vision validation completed for {image_path}")
            return vision_results
            
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse vision response: {response_content}")
            return self._create_error_response(f"Vision analysis parsing failed: {str(e)}")
        except Exception as e:
            logger.error(f"Vision validation error: {str(e)}")
            return self._create_error_response(f"Vision validation failed: {str(e)}")
    
    def validate_dried_specimen_image(self, image_path: str, claimed_species: str = None) -> Dict[str, Any]:
        """
        Specialized validation for dried specimens - addressing the high-value market opportunity.
        
        Args:
            image_path: Path to dried specimen image
            claimed_species: Optional claimed species name
            
        Returns:
            Dict: Specialized dried specimen validation results
        """
        
        base64_image = self.encode_image_to_base64(image_path)
        
        dried_specimen_prompt = f"""
You are a world-class mycology expert specializing in dried mushroom specimen identification and validation. 
This analysis is for a premium research service ($199.99) requiring expert-level accuracy.

**CRITICAL ANALYSIS REQUIREMENTS:**

1. **Dried Specimen Morphology Assessment:**
   - Evaluate shrinkage patterns and structural preservation
   - Assess color changes typical of drying process
   - Identify preserved diagnostic features (gills, pores, stems, caps)
   - Note any artificial coloring or preservation artifacts

2. **Authentication Validation:**
   - Look for signs of specimen tampering or artificial enhancement
   - Assess preservation quality and storage conditions
   - Identify potential contamination or degradation
   - Evaluate specimen completeness and integrity

3. **Species Identification Confidence:**
   - Provide detailed morphological observations
   - Note diagnostic features visible in dried state
   - Assess identification confidence based on visible characteristics
   - Flag any features inconsistent with claimed species

4. **Quality Assessment for Research Use:**
   - Evaluate suitability for bioactivity analysis
   - Assess preservation state affecting compound integrity
   - Note any factors affecting research reliability

5. **Market Authenticity (Anti-Fraud):**
   - Look for signs of common dried specimen fraud
   - Assess if specimen matches claimed origin/species
   - Identify any suspicious enhancement or adulteration

{f'**CLAIMED SPECIES:** {claimed_species}' if claimed_species else '**SPECIES:** To be determined from image'}

**RETURN STRUCTURED JSON:**
{{
  "is_authentic": boolean,
  "identification_confidence": float (0-1),
  "species_assessment": {{
    "most_likely_species": "string",
    "alternative_species": ["array of alternatives"],
    "diagnostic_features_observed": ["array of features"],
    "features_inconsistent_with_claim": ["array if any"]
  }},
  "preservation_quality": {{
    "overall_score": float (0-1),
    "structural_integrity": "excellent/good/fair/poor",
    "color_preservation": "excellent/good/fair/poor",
    "research_suitability": "excellent/good/fair/poor"
  }},
  "authenticity_assessment": {{
    "fraud_risk_score": float (0-1),
    "suspicious_indicators": ["array of concerns"],
    "authentication_confidence": float (0-1)
  }},
  "detailed_observations": {{
    "cap_characteristics": "string",
    "gill_or_pore_structure": "string", 
    "stem_features": "string",
    "overall_morphology": "string",
    "preservation_artifacts": "string"
  }},
  "research_recommendations": {{
    "suitable_for_bioactivity": boolean,
    "recommended_analyses": ["array of suitable tests"],
    "preparation_notes": "string"
  }},
  "validation_summary": {{
    "overall_assessment": "string",
    "confidence_level": "high/medium/low",
    "red_flags": ["array of concerns"],
    "commercial_grade": "premium/standard/below_standard/reject"
  }}
}}
        """
        
        try:
            response = self.client.chat.completions.create(
                model=self.vision_model,
                messages=[
                    {
                        "role": "user",
                        "content": [
                            {"type": "text", "text": dried_specimen_prompt},
                            {
                                "type": "image_url",
                                "image_url": {
                                    "url": f"data:image/jpeg;base64,{base64_image}",
                                    "detail": "high"
                                }
                            }
                        ]
                    }
                ],
                max_tokens=2500,
                temperature=0.05  # Very low temperature for consistent professional analysis
            )
            
            response_content = response.choices[0].message.content.strip()
            if response_content.startswith('```json'):
                response_content = response_content[7:-3]
                
            results = json.loads(response_content)
            
            # Add premium service metadata
            results['service_type'] = 'premium_dried_analysis'
            results['analysis_timestamp'] = str(pd.Timestamp.now())
            results['service_value'] = '$199.99'
            
            return results
            
        except Exception as e:
            logger.error(f"Dried specimen validation error: {str(e)}")
            return self._create_error_response(f"Dried specimen analysis failed: {str(e)}")
    
    def batch_validate_images(self, image_paths: List[str], metadata_list: List[Dict] = None) -> Dict[str, Any]:
        """
        Validate multiple specimen images in batch with rate limiting.
        
        Args:
            image_paths: List of image file paths
            metadata_list: Optional list of metadata for each image
            
        Returns:
            Dict: Batch validation results
        """
        
        logger.info(f"Starting batch validation of {len(image_paths)} images")
        
        results = []
        successful_validations = 0
        failed_validations = 0
        
        for i, image_path in enumerate(image_paths):
            try:
                metadata = metadata_list[i] if metadata_list and i < len(metadata_list) else None
                
                # Use appropriate validation method based on specimen type
                if metadata and metadata.get('specimen_type') == 'dried':
                    result = self.validate_dried_specimen_image(
                        image_path, 
                        metadata.get('claimed_species')
                    )
                else:
                    result = self.validate_specimen_image(image_path, metadata)
                
                result['image_path'] = image_path
                result['batch_index'] = i
                results.append(result)
                successful_validations += 1
                
                # Rate limiting - small delay between API calls
                if i > 0 and i % 5 == 0:
                    import time
                    time.sleep(1)
                    
            except Exception as e:
                logger.error(f"Failed to validate image {image_path}: {str(e)}")
                results.append({
                    'image_path': image_path,
                    'batch_index': i,
                    'is_authentic': False,
                    'error': str(e),
                    'validation_summary': {'overall_assessment': 'Processing failed'}
                })
                failed_validations += 1
        
        # Calculate batch metrics
        authentic_count = sum(1 for r in results if r.get('is_authentic', False))
        avg_confidence = np.mean([r.get('identification_confidence', 0) for r in results])
        
        batch_summary = {
            'total_images': len(image_paths),
            'successful_validations': successful_validations,
            'failed_validations': failed_validations,
            'authentic_specimens': authentic_count,
            'authenticity_rate': authentic_count / len(image_paths) if image_paths else 0,
            'average_confidence': float(avg_confidence),
            'detailed_results': results
        }
        
        logger.info(f"Batch validation completed. Authenticity rate: {batch_summary['authenticity_rate']:.2%}")
        
        return batch_summary
    
    def _create_vision_validation_prompt(self, specimen_metadata: Dict[str, Any] = None) -> str:
        """Create comprehensive validation prompt for general specimens."""
        
        metadata_context = ""
        if specimen_metadata:
            metadata_context = f"""
**PROVIDED SPECIMEN METADATA:**
{json.dumps(specimen_metadata, indent=2)}

**CROSS-VALIDATION REQUIRED:** Compare visual observations with provided metadata and flag any inconsistencies.
            """
        
        return f"""
You are an expert mycologist analyzing a mushroom specimen image for scientific research validation.

**ANALYSIS REQUIREMENTS:**

1. **Species Identification:**
   - Identify the most likely species based on visible morphological features
   - Note diagnostic characteristics (cap, gills/pores, stem, spores if visible)
   - Provide confidence level for identification

2. **Morphological Assessment:**
   - Detailed description of visible structures
   - Size estimation and proportions
   - Color patterns and variations
   - Surface textures and features

3. **Specimen Quality:**
   - Freshness and preservation state
   - Completeness of specimen
   - Suitability for research/analysis
   - Any signs of damage or contamination

4. **Authentication Validation:**
   - Assess if specimen appears natural vs artificially altered
   - Look for signs of enhancement or manipulation
   - Evaluate photographic authenticity

5. **Research Suitability:**
   - Assess value for bioactivity research
   - Note any factors affecting compound analysis
   - Recommend appropriate research applications

{metadata_context}

**RETURN STRUCTURED JSON:**
{{
  "is_authentic": boolean,
  "identification_confidence": float (0-1),
  "species_identification": {{
    "primary_species": "string",
    "alternative_species": ["array"],
    "diagnostic_features": ["array of observed features"],
    "identification_notes": "string"
  }},
  "morphological_analysis": {{
    "cap_description": "string",
    "gill_or_pore_details": "string",
    "stem_characteristics": "string",
    "overall_condition": "excellent/good/fair/poor"
  }},
  "specimen_quality": {{
    "freshness_score": float (0-1),
    "completeness_score": float (0-1),
    "research_grade": "premium/standard/low/unsuitable"
  }},
  "validation_summary": {{
    "overall_assessment": "string",
    "red_flags": ["array of concerns"],
    "research_recommendations": ["array of recommendations"]
  }}
}}
        """
    
    def _analyze_image_quality(self, image_path: str) -> Dict[str, Any]:
        """Analyze technical image quality metrics."""
        
        try:
            # Load image with OpenCV
            image = cv2.imread(image_path)
            if image is None:
                return {"error": "Could not load image"}
            
            # Convert to different color spaces for analysis
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
            
            # Calculate sharpness (Laplacian variance)
            laplacian_var = cv2.Laplacian(gray, cv2.CV_64F).var()
            
            # Calculate brightness and contrast
            brightness = np.mean(gray)
            contrast = np.std(gray)
            
            # Image dimensions
            height, width = gray.shape
            total_pixels = height * width
            
            # Color distribution analysis
            color_channels = cv2.split(image)
            color_balance = {
                'blue_mean': float(np.mean(color_channels[0])),
                'green_mean': float(np.mean(color_channels[1])),
                'red_mean': float(np.mean(color_channels[2]))
            }
            
            return {
                'sharpness_score': float(laplacian_var),
                'brightness': float(brightness),
                'contrast': float(contrast),
                'resolution': f"{width}x{height}",
                'total_pixels': total_pixels,
                'color_balance': color_balance,
                'quality_assessment': self._assess_technical_quality(laplacian_var, brightness, contrast)
            }
            
        except Exception as e:
            logger.error(f"Image quality analysis failed: {str(e)}")
            return {"error": f"Quality analysis failed: {str(e)}"}
    
    def _assess_technical_quality(self, sharpness: float, brightness: float, contrast: float) -> str:
        """Assess overall technical quality based on metrics."""
        
        quality_score = 0
        
        # Sharpness assessment (higher is better, typical range 0-3000+)
        if sharpness > 500:
            quality_score += 2
        elif sharpness > 100:
            quality_score += 1
        
        # Brightness assessment (optimal range 80-180)
        if 80 <= brightness <= 180:
            quality_score += 2
        elif 50 <= brightness <= 220:
            quality_score += 1
        
        # Contrast assessment (higher is generally better, typical range 0-100+)
        if contrast > 40:
            quality_score += 2
        elif contrast > 20:
            quality_score += 1
        
        if quality_score >= 5:
            return "excellent"
        elif quality_score >= 3:
            return "good"
        elif quality_score >= 2:
            return "fair"
        else:
            return "poor"
    
    def _cross_validate_with_metadata(self, vision_results: Dict, metadata: Dict) -> Dict[str, Any]:
        """Cross-validate vision analysis with provided metadata."""
        
        inconsistencies = []
        consistency_score = 1.0
        
        # Check species consistency
        if 'species' in metadata and 'species_identification' in vision_results:
            claimed_species = metadata['species'].lower()
            identified_species = vision_results['species_identification']['primary_species'].lower()
            
            if claimed_species not in identified_species and identified_species not in claimed_species:
                inconsistencies.append(f"Species mismatch: claimed '{metadata['species']}' vs identified '{vision_results['species_identification']['primary_species']}'")
                consistency_score -= 0.3
        
        # Check morphological consistency
        if 'description' in metadata and 'morphological_analysis' in vision_results:
            # This would require more sophisticated NLP comparison
            # For now, flag for manual review
            inconsistencies.append("Manual review recommended for morphology-metadata consistency")
        
        # Check preservation state consistency
        if 'specimen_state' in metadata:
            claimed_state = metadata['specimen_state'].lower()
            if 'dried' in claimed_state and vision_results.get('specimen_quality', {}).get('freshness_score', 0) > 0.7:
                inconsistencies.append("Claimed dried specimen appears fresh in image")
                consistency_score -= 0.4
        
        return {
            'consistency_score': max(0.0, consistency_score),
            'inconsistencies': inconsistencies,
            'requires_manual_review': len(inconsistencies) > 0
        }
    
    def _create_error_response(self, error_message: str) -> Dict[str, Any]:
        """Create standardized error response."""
        
        return {
            'is_authentic': False,
            'identification_confidence': 0.0,
            'error': error_message,
            'validation_summary': {
                'overall_assessment': 'Analysis failed',
                'red_flags': ['Processing error'],
                'research_recommendations': ['Re-submit with better image quality']
            }
        }

# Integration function for your existing pipeline
def validate_uploaded_specimen_image(image_path: str, metadata: Dict[str, Any] = None) -> Dict[str, Any]:
    """
    Main integration function for specimen image validation.
    
    Args:
        image_path: Path to uploaded specimen image
        metadata: Optional specimen metadata
        
    Returns:
        Dict: Comprehensive validation results
    """
    
    validator = EnhancedVisionValidator()
    
    # Determine validation type based on metadata
    if metadata and metadata.get('specimen_type') == 'dried':
        return validator.validate_dried_specimen_image(
            image_path, 
            metadata.get('species')
        )
    else:
        return validator.validate_specimen_image(image_path, metadata)

# Example usage
if __name__ == "__main__":
    # Test with sample specimen image
    validator = EnhancedVisionValidator()
    
    # Test general specimen validation
    # results = validator.validate_specimen_image("uploads/specimen_sample.jpg")
    
    # Test premium dried specimen validation
    # results = validator.validate_dried_specimen_image("uploads/dried_cordyceps.jpg", "Cordyceps militaris")
    
    print("Enhanced Vision Validator ready for integration!")