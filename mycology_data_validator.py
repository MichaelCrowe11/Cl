"""
Mycology Data Validation Using AI Reasoning

Adapted from OpenAI's medical data validation approach for mycological research.
This module validates consistency and authenticity of fungal research data.
"""

import os
import json
import logging
from typing import Dict, List, Any, Optional
from concurrent.futures import ThreadPoolExecutor, as_completed
import pandas as pd
from openai import OpenAI
from sklearn.metrics import precision_score, recall_score, f1_score

logger = logging.getLogger(__name__)

class MycologyDataValidator:
    """AI-powered validator for mycological research data using reasoning models."""
    
    def __init__(self):
        self.client = OpenAI(api_key=os.environ.get('OPENAI_API_KEY'))
        self.model = 'gpt-4o'  # Using production model for reliability
        
    def validate_specimen_data(self, specimen_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Validate a single specimen record for consistency and authenticity.
        
        Args:
            specimen_data: Dictionary containing specimen information
            
        Returns:
            Dict: Validation results with is_valid flag and issue description
        """
        
        # Convert specimen data to validation string
        data_string = self._format_specimen_for_validation(specimen_data)
        
        messages = [
            {
                "role": "user",
                "content": f"""
You are a mycology expert designed to validate the quality of fungal research datasets. You will be given a single row of mycological data, and your task is to determine whether the data is scientifically valid and consistent.

**Analyze the data for these specific mycology issues:**

1. **Species-Compound Contradictions**: Compounds that are not known to be produced by the specified species (e.g., psilocybin in Ganoderma lucidum)
2. **Bioactivity-Compound Mismatch**: Bioactivities that don't match known properties of the compounds (e.g., psychoactive properties for beta-glucans)
3. **Extraction Method Incompatibility**: Extraction methods inappropriate for the target compounds (e.g., water extraction for lipophilic compounds)
4. **Target Pathway Inconsistency**: Claimed target pathways that don't align with compound mechanisms (e.g., GABA pathway for polysaccharides)
5. **Geographic-Species Mismatch**: Species claimed from regions where they don't naturally occur
6. **Morphological Inconsistencies**: Physical descriptions that don't match known characteristics
7. **Literature Reference Issues**: Citations that don't support the claimed findings
8. **Bioactivity Concentration Implausibility**: Unrealistic bioactivity levels for given concentrations

**Use your mycological knowledge to assess:**
- Species authenticity and geographic distribution
- Compound biosynthesis pathways in fungi
- Known bioactive properties of fungal metabolites
- Standard extraction and analysis methods
- Realistic concentration ranges for bioactivity

**Return only a JSON object** with these properties:
- `"is_valid"`: boolean indicating if data is scientifically valid
- `"confidence_score"`: float 0-1 indicating confidence in assessment
- `"issue"`: if invalid, brief explanation; if valid, null
- `"validation_category"`: category of issue if found (e.g., "compound_mismatch", "species_error")

MYCOLOGICAL DATA:
{data_string}
                """
            }
        ]
        
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                temperature=0.1  # Lower temperature for more consistent validation
            )
            
            response_content = response.choices[0].message.content.strip()
            
            # Clean up response if wrapped in code blocks
            if response_content.startswith('```json'):
                response_content = response_content[7:]
            if response_content.endswith('```'):
                response_content = response_content[:-3]
            
            result = json.loads(response_content)
            
            # Ensure all required fields are present
            required_fields = ['is_valid', 'confidence_score', 'issue', 'validation_category']
            for field in required_fields:
                if field not in result:
                    result[field] = None
                    
            return result
            
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse validation response: {response_content}")
            return {
                'is_valid': False,
                'confidence_score': 0.0,
                'issue': 'Validation system error',
                'validation_category': 'system_error'
            }
        except Exception as e:
            logger.error(f"Validation error: {str(e)}")
            return {
                'is_valid': False,
                'confidence_score': 0.0,
                'issue': f'Validation failed: {str(e)}',
                'validation_category': 'system_error'
            }
    
    def validate_bioactivity_consistency(self, bioactivity_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Validate bioactivity data for scientific consistency.
        
        Args:
            bioactivity_data: Dictionary containing bioactivity information
            
        Returns:
            Dict: Validation results
        """
        
        data_string = self._format_bioactivity_for_validation(bioactivity_data)
        
        messages = [
            {
                "role": "user", 
                "content": f"""
You are a biochemistry expert specializing in fungal bioactivity validation. Analyze this bioactivity data for scientific accuracy and consistency.

**Focus on these bioactivity validation criteria:**

1. **Dose-Response Relationships**: Are reported bioactivities realistic for given concentrations?
2. **Mechanism Plausibility**: Do claimed mechanisms align with compound structure and known pathways?
3. **In Vitro vs In Vivo Consistency**: Are results appropriate for the experimental model used?
4. **Statistical Significance**: Are effect sizes and statistical measures reasonable?
5. **Control Group Validity**: Are controls appropriate and properly described?
6. **Methodology Consistency**: Do experimental methods match reported outcomes?
7. **Literature Alignment**: Do results align with established scientific knowledge?

**Bioactivity Red Flags to Identify:**
- Impossibly high potency claims (e.g., nanomolar IC50 for crude extracts)
- Conflicting mechanism claims for same compound
- Inappropriate statistical comparisons
- Missing essential controls
- Unrealistic selectivity indices
- Contradictory dose-response curves

**Return JSON with:**
- `"is_valid"`: boolean for scientific validity
- `"confidence_score"`: float 0-1 for assessment confidence  
- `"issue"`: explanation if invalid, null if valid
- `"validation_category"`: type of issue found
- `"scientific_concerns"`: array of specific concerns identified

BIOACTIVITY DATA:
{data_string}
                """
            }
        ]
        
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                temperature=0.1
            )
            
            response_content = response.choices[0].message.content.strip()
            if response_content.startswith('```json'):
                response_content = response_content[7:-3]
                
            return json.loads(response_content)
            
        except Exception as e:
            logger.error(f"Bioactivity validation error: {str(e)}")
            return {
                'is_valid': False,
                'confidence_score': 0.0,
                'issue': f'Bioactivity validation failed: {str(e)}',
                'validation_category': 'system_error',
                'scientific_concerns': []
            }
    
    def validate_dataset_batch(self, dataset: List[Dict[str, Any]], max_workers: int = 3) -> Dict[str, Any]:
        """
        Validate multiple records concurrently with rate limiting.
        
        Args:
            dataset: List of specimen/bioactivity records
            max_workers: Number of concurrent validation threads
            
        Returns:
            Dict: Batch validation results with metrics
        """
        
        logger.info(f"Starting batch validation of {len(dataset)} records")
        
        results = []
        true_positives = 0
        false_positives = 0
        validation_categories = {}
        
        with ThreadPoolExecutor(max_workers=max_workers) as executor:
            # Submit validation tasks
            future_to_index = {
                executor.submit(self.validate_specimen_data, record): i 
                for i, record in enumerate(dataset)
            }
            
            # Collect results as they complete
            for future in as_completed(future_to_index):
                index = future_to_index[future]
                try:
                    result = future.result()
                    result['record_index'] = index
                    results.append(result)
                    
                    # Track validation categories
                    category = result.get('validation_category')
                    if category:
                        validation_categories[category] = validation_categories.get(category, 0) + 1
                        
                    # Count validity assessments
                    if result['is_valid']:
                        true_positives += 1
                    else:
                        false_positives += 1
                        
                except Exception as e:
                    logger.error(f"Validation failed for record {index}: {str(e)}")
                    results.append({
                        'record_index': index,
                        'is_valid': False,
                        'confidence_score': 0.0,
                        'issue': f'Processing error: {str(e)}',
                        'validation_category': 'system_error'
                    })
        
        # Calculate validation metrics
        total_records = len(dataset)
        validity_rate = true_positives / total_records if total_records > 0 else 0
        avg_confidence = sum(r.get('confidence_score', 0) for r in results) / len(results) if results else 0
        
        validation_summary = {
            'total_records': total_records,
            'valid_records': true_positives,
            'invalid_records': false_positives,
            'validity_rate': validity_rate,
            'average_confidence': avg_confidence,
            'validation_categories': validation_categories,
            'detailed_results': results
        }
        
        logger.info(f"Batch validation completed. Validity rate: {validity_rate:.2%}, Avg confidence: {avg_confidence:.3f}")
        
        return validation_summary
    
    def _format_specimen_for_validation(self, specimen_data: Dict[str, Any]) -> str:
        """Format specimen data for validation prompt."""
        
        formatted_fields = []
        
        # Essential specimen fields
        field_mapping = {
            'Species': 'species',
            'Common Name': 'common_name', 
            'Compound': 'compound',
            'Compound Class': 'compound_class',
            'Molecular Formula': 'molecular_formula',
            'Bioactivity': 'bioactivity',
            'Target Pathway': 'target_pathway',
            'Potential Application': 'potential_application',
            'Extraction Method': 'extraction_method',
            'Known Interactions': 'known_interactions',
            'Reference': 'reference',
            'Geographic Location': 'location',
            'Collection Date': 'collection_date',
            'Morphological Notes': 'morphology'
        }
        
        for display_name, field_key in field_mapping.items():
            value = specimen_data.get(field_key, 'Not specified')
            formatted_fields.append(f"{display_name}: {value}")
            
        return '\n'.join(formatted_fields)
    
    def _format_bioactivity_for_validation(self, bioactivity_data: Dict[str, Any]) -> str:
        """Format bioactivity data for validation prompt."""
        
        formatted_fields = []
        
        bioactivity_fields = {
            'Compound': 'compound',
            'Bioassay Type': 'assay_type',
            'IC50/EC50 Value': 'ic50_value',
            'Units': 'units',
            'Cell Line/Model': 'cell_line',
            'Experimental Conditions': 'conditions',
            'Statistical Significance': 'p_value',
            'Effect Size': 'effect_size',
            'Control Groups': 'controls',
            'Methodology': 'methodology',
            'Mechanism of Action': 'mechanism',
            'Literature Reference': 'reference'
        }
        
        for display_name, field_key in bioactivity_fields.items():
            value = bioactivity_data.get(field_key, 'Not specified')
            formatted_fields.append(f"{display_name}: {value}")
            
        return '\n'.join(formatted_fields)

def validate_mycology_dataset(dataset_path: str, output_path: str = None) -> Dict[str, Any]:
    """
    Convenience function to validate a mycology dataset from CSV.
    
    Args:
        dataset_path: Path to CSV file containing mycology data
        output_path: Optional path to save validation results
        
    Returns:
        Dict: Validation summary and results
    """
    
    # Load dataset
    df = pd.read_csv(dataset_path)
    dataset = df.to_dict('records')
    
    # Initialize validator
    validator = MycologyDataValidator()
    
    # Run validation
    results = validator.validate_dataset_batch(dataset)
    
    # Save results if output path provided
    if output_path:
        with open(output_path, 'w') as f:
            json.dump(results, f, indent=2)
        logger.info(f"Validation results saved to {output_path}")
    
    return results

# Example usage for your 30,000 record dataset
if __name__ == "__main__":
    # Validate your authentic bioactivity dataset
    results = validate_mycology_dataset(
        dataset_path="uploads/true_datasets_only.csv",
        output_path="results/validation_results.json"
    )
    
    print(f"Dataset Validation Complete!")
    print(f"Total Records: {results['total_records']}")
    print(f"Valid Records: {results['valid_records']} ({results['validity_rate']:.1%})")
    print(f"Average Confidence: {results['average_confidence']:.3f}")
    print(f"Issue Categories: {results['validation_categories']}")