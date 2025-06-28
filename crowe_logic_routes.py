"""
Crowe Logic AI Web Routes
Integration of advanced PhD-level mycological AI analysis into the platform
"""

import logging
from flask import Blueprint, request, jsonify, render_template, current_app
from crowe_logic_ai_integration import (
    CroweLogicAI, 
    analyze_specimen_with_crowe_logic,
    enhance_literature_research,
    MycologicalAnalysisRequest
)
import json
from datetime import datetime

logger = logging.getLogger(__name__)

crowe_bp = Blueprint('crowe_logic', __name__, url_prefix='/crowe-logic')

@crowe_bp.route('/dashboard')
def crowe_dashboard():
    """Crowe Logic AI analysis dashboard."""
    return render_template('crowe_logic_dashboard.html')

@crowe_bp.route('/analyze-specimen', methods=['POST'])
def analyze_specimen():
    """Advanced specimen analysis using Crowe Logic AI."""
    try:
        data = request.get_json()
        
        specimen_data = data.get('specimen_data', {})
        analysis_type = data.get('analysis_type', 'comprehensive')
        research_context = data.get('research_context', {})
        priority_level = data.get('priority_level', 'standard')
        
        # Create analysis request
        analysis_request = MycologicalAnalysisRequest(
            specimen_data=specimen_data,
            analysis_type=analysis_type,
            research_context=research_context,
            priority_level=priority_level
        )
        
        # Run Crowe Logic AI analysis
        crowe_ai = CroweLogicAI()
        results = crowe_ai.analyze_complex_specimen(analysis_request)
        
        return jsonify({
            'status': 'success',
            'analysis_id': f"crowe_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
            'results': results,
            'ai_system': 'Crowe Logic AI',
            'analysis_type': analysis_type
        })
        
    except Exception as e:
        logger.error(f"Crowe Logic analysis error: {str(e)}")
        return jsonify({
            'status': 'error',
            'error': str(e),
            'ai_system': 'Crowe Logic AI'
        }), 500

@crowe_bp.route('/literature-synthesis', methods=['POST'])
def literature_synthesis():
    """Advanced literature synthesis using Crowe Logic AI."""
    try:
        data = request.get_json()
        research_query = data.get('research_query', {})
        
        # Run literature synthesis
        results = enhance_literature_research(research_query)
        
        return jsonify({
            'status': 'success',
            'synthesis_id': f"lit_synthesis_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
            'results': results,
            'ai_system': 'Crowe Logic AI Literature Synthesis'
        })
        
    except Exception as e:
        logger.error(f"Literature synthesis error: {str(e)}")
        return jsonify({
            'status': 'error',
            'error': str(e)
        }), 500

@crowe_bp.route('/methodology-validation', methods=['POST'])
def methodology_validation():
    """Expert methodology validation using Crowe Logic AI."""
    try:
        data = request.get_json()
        methodology_description = data.get('methodology', '')
        
        if not methodology_description:
            return jsonify({
                'status': 'error',
                'error': 'Methodology description is required'
            }), 400
        
        # Run methodology validation
        crowe_ai = CroweLogicAI()
        results = crowe_ai.validate_research_methodology(methodology_description)
        
        return jsonify({
            'status': 'success',
            'validation_id': f"method_val_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
            'results': results,
            'ai_system': 'Crowe Logic AI Methodology Validator'
        })
        
    except Exception as e:
        logger.error(f"Methodology validation error: {str(e)}")
        return jsonify({
            'status': 'error',
            'error': str(e)
        }), 500

@crowe_bp.route('/dual-analysis', methods=['POST'])
def dual_ai_analysis():
    """
    Combined analysis using both OpenAI vision and Crowe Logic AI reasoning.
    This is the premium analysis service that leverages both AI systems.
    """
    try:
        data = request.get_json()
        
        # Extract analysis parameters
        specimen_data = data.get('specimen_data', {})
        image_analysis_results = data.get('image_analysis_results', {})
        research_context = data.get('research_context', {})
        
        # Combine image analysis with specimen data for Crowe Logic AI
        enhanced_specimen_data = {
            **specimen_data,
            'vision_analysis': image_analysis_results,
            'ai_validation_results': image_analysis_results.get('ai_validation', {}),
            'computer_vision_results': image_analysis_results.get('computer_vision', {})
        }
        
        # Run Crowe Logic AI analysis with enhanced data
        results = analyze_specimen_with_crowe_logic(
            enhanced_specimen_data,
            analysis_type='comprehensive_with_vision',
            research_context=research_context
        )
        
        # Create combined analysis summary
        combined_results = {
            'dual_ai_analysis': {
                'openai_vision_results': image_analysis_results,
                'crowe_logic_analysis': results,
                'synthesis': {
                    'confidence_consensus': _calculate_confidence_consensus(
                        image_analysis_results, results
                    ),
                    'species_agreement': _check_species_agreement(
                        image_analysis_results, results
                    ),
                    'research_recommendations': _generate_combined_recommendations(
                        image_analysis_results, results
                    )
                }
            }
        }
        
        return jsonify({
            'status': 'success',
            'dual_analysis_id': f"dual_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
            'results': combined_results,
            'ai_systems': ['OpenAI Vision', 'Crowe Logic AI'],
            'service_tier': 'premium_dual_analysis'
        })
        
    except Exception as e:
        logger.error(f"Dual AI analysis error: {str(e)}")
        return jsonify({
            'status': 'error',
            'error': str(e)
        }), 500

def _calculate_confidence_consensus(openai_results, crowe_results):
    """Calculate consensus confidence between AI systems."""
    
    openai_confidence = openai_results.get('ai_validation', {}).get('identification_confidence', 0)
    crowe_confidence = crowe_results.get('species_identification', {}).get('confidence_level', 0)
    
    # Weight Crowe Logic AI slightly higher due to specialized expertise
    consensus_confidence = (openai_confidence * 0.4) + (crowe_confidence * 0.6)
    
    agreement_level = abs(openai_confidence - crowe_confidence)
    if agreement_level < 0.2:
        consensus_status = "high_agreement"
    elif agreement_level < 0.4:
        consensus_status = "moderate_agreement"
    else:
        consensus_status = "low_agreement"
    
    return {
        'consensus_confidence': consensus_confidence,
        'openai_confidence': openai_confidence,
        'crowe_confidence': crowe_confidence,
        'agreement_level': consensus_status,
        'confidence_difference': agreement_level
    }

def _check_species_agreement(openai_results, crowe_results):
    """Check if both AI systems agree on species identification."""
    
    openai_species = openai_results.get('ai_validation', {}).get('species_identification', {}).get('primary_species', '').lower()
    crowe_species = crowe_results.get('species_identification', {}).get('primary_identification', '').lower()
    
    # Simple agreement check (could be enhanced with taxonomic similarity)
    species_match = openai_species in crowe_species or crowe_species in openai_species
    
    return {
        'species_agreement': species_match,
        'openai_identification': openai_species,
        'crowe_identification': crowe_species,
        'agreement_status': 'confirmed' if species_match else 'divergent'
    }

def _generate_combined_recommendations(openai_results, crowe_results):
    """Generate combined research recommendations from both AI systems."""
    
    openai_recommendations = openai_results.get('ai_validation', {}).get('validation_summary', {}).get('research_recommendations', [])
    crowe_recommendations = crowe_results.get('research_recommendations', {}).get('immediate_tests', [])
    
    # Combine and deduplicate recommendations
    combined = list(set(openai_recommendations + crowe_recommendations))
    
    return {
        'priority_recommendations': combined[:5],  # Top 5 recommendations
        'openai_suggestions': openai_recommendations,
        'crowe_suggestions': crowe_recommendations,
        'total_recommendations': len(combined)
    }

# API endpoints for external integration
@crowe_bp.route('/api/quick-analysis', methods=['POST'])
def api_quick_analysis():
    """API endpoint for quick specimen analysis."""
    try:
        data = request.get_json()
        specimen_data = data.get('specimen_data', {})
        
        results = analyze_specimen_with_crowe_logic(
            specimen_data, 
            analysis_type='quick_assessment'
        )
        
        return jsonify({
            'analysis_results': results,
            'timestamp': datetime.now().isoformat(),
            'api_version': '1.0'
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@crowe_bp.route('/api/research-insights', methods=['POST'])
def api_research_insights():
    """API endpoint for research literature insights."""
    try:
        data = request.get_json()
        research_query = data.get('query', {})
        
        results = enhance_literature_research(research_query)
        
        return jsonify({
            'research_insights': results,
            'timestamp': datetime.now().isoformat(),
            'api_version': '1.0'
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500