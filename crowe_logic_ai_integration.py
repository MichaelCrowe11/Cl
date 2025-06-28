"""
Crowe Logic AI Integration Module
Advanced PhD-Level Mycologist AI System for Enhanced Research Analysis

This module integrates Anthropic's Claude API for advanced mycological reasoning
and research analysis, complementing the existing OpenAI vision capabilities.
"""

import os
import json
import logging
from typing import Dict, List, Any, Optional
import anthropic
from dataclasses import dataclass
from datetime import datetime

logger = logging.getLogger(__name__)

@dataclass
class MycologicalAnalysisRequest:
    """Structure for mycological analysis requests to Crowe Logic AI."""
    specimen_data: Dict[str, Any]
    analysis_type: str
    research_context: Dict[str, Any]
    priority_level: str = "standard"  # standard, premium, research_grade

class CroweLogicAI:
    """
    Advanced PhD-Level Mycologist AI System using Anthropic Claude.
    Specialized for complex mycological research and analysis.
    """
    
    def __init__(self):
        """Initialize Crowe Logic AI with Anthropic client."""
        try:
            self.client = anthropic.Anthropic(
                api_key=os.environ.get("ANTHROPIC_API_KEY")
            )
            self.model = "claude-3-5-sonnet-20241022"  # Latest Claude model
            self.phd_mycologist_persona = self._initialize_expert_persona()
            logger.info("Crowe Logic AI initialized successfully")
        except Exception as e:
            logger.error(f"Failed to initialize Crowe Logic AI: {str(e)}")
            raise
    
    def _initialize_expert_persona(self) -> str:
        """Initialize the PhD-level mycologist persona for Claude."""
        return """
You are Dr. Michael Crowe's advanced AI system - Crowe Logic AI, a PhD-level mycologist with decades of specialized research experience. You possess:

**EXPERTISE AREAS:**
- Advanced fungal taxonomy and phylogenetics
- Bioactive compound identification and analysis
- Mycological specimen authentication
- Research methodology and experimental design
- Literature analysis and hypothesis generation
- Commercial mushroom market analysis

**ANALYTICAL APPROACH:**
- Apply rigorous scientific methodology
- Cross-reference multiple taxonomic databases
- Consider biogeographic distribution patterns
- Evaluate morphological and chemical evidence
- Assess commercial authenticity and fraud detection
- Provide evidence-based recommendations

**COMMUNICATION STYLE:**
- Precise scientific terminology when appropriate
- Clear explanations for complex concepts
- Confidence levels for all assessments
- Detailed reasoning for conclusions
- Practical recommendations for research

**QUALITY STANDARDS:**
- Maintain highest scientific integrity
- Question inconsistent data
- Highlight areas requiring further investigation
- Provide multiple hypotheses when appropriate
- Consider both traditional and molecular approaches
        """
    
    def analyze_complex_specimen(self, analysis_request: MycologicalAnalysisRequest) -> Dict[str, Any]:
        """
        Perform complex mycological analysis using advanced AI reasoning.
        
        Args:
            analysis_request: Structured request containing specimen data and context
            
        Returns:
            Dict: Comprehensive analysis results with expert-level insights
        """
        
        logger.info(f"Starting Crowe Logic AI analysis for {analysis_request.analysis_type}")
        
        # Construct comprehensive analysis prompt
        analysis_prompt = self._construct_analysis_prompt(analysis_request)
        
        try:
            response = self.client.messages.create(
                model=self.model,
                max_tokens=4000,
                temperature=0.2,  # Lower temperature for scientific accuracy
                messages=[
                    {
                        "role": "user",
                        "content": [
                            {
                                "type": "text",
                                "text": analysis_prompt
                            }
                        ]
                    }
                ],
                system=self.phd_mycologist_persona
            )
            
            # Parse the response content
            analysis_content = response.content[0].text if response.content else ""
            
            # Structure the response
            structured_results = self._parse_analysis_response(analysis_content)
            
            # Add metadata
            structured_results.update({
                'analysis_timestamp': datetime.now().isoformat(),
                'crowe_logic_version': '1.0',
                'analysis_type': analysis_request.analysis_type,
                'priority_level': analysis_request.priority_level,
                'tokens_used': response.usage.input_tokens + response.usage.output_tokens if hasattr(response, 'usage') else 0
            })
            
            logger.info("Crowe Logic AI analysis completed successfully")
            return structured_results
            
        except Exception as e:
            logger.error(f"Crowe Logic AI analysis failed: {str(e)}")
            return {
                'error': f"Analysis failed: {str(e)}",
                'status': 'failed',
                'analysis_timestamp': datetime.now().isoformat()
            }
    
    def research_literature_synthesis(self, research_query: Dict[str, Any]) -> Dict[str, Any]:
        """
        Synthesize research literature and generate expert insights.
        
        Args:
            research_query: Dictionary containing research parameters and context
            
        Returns:
            Dict: Literature synthesis with expert analysis
        """
        
        synthesis_prompt = f"""
As Crowe Logic AI, perform an expert-level synthesis of mycological research literature.

**RESEARCH QUERY:**
{json.dumps(research_query, indent=2)}

**SYNTHESIS REQUIREMENTS:**
1. Identify key research trends and gaps
2. Evaluate methodological approaches
3. Assess conflicting findings and propose resolutions
4. Generate novel research hypotheses
5. Recommend experimental approaches
6. Consider commercial applications

**OUTPUT FORMAT (JSON):**
{{
  "literature_synthesis": {{
    "key_findings": ["array of important discoveries"],
    "research_gaps": ["array of identified gaps"],
    "methodological_concerns": ["array of issues"],
    "conflicting_evidence": ["array of contradictions"]
  }},
  "expert_hypotheses": {{
    "novel_hypotheses": ["array of new research ideas"],
    "testable_predictions": ["array of experimental predictions"],
    "commercial_opportunities": ["array of market applications"]
  }},
  "recommendations": {{
    "immediate_research": ["array of priority studies"],
    "long_term_directions": ["array of strategic goals"],
    "collaboration_opportunities": ["array of interdisciplinary connections"]
  }},
  "confidence_assessment": {{
    "overall_confidence": float (0-1),
    "evidence_quality": "excellent/good/fair/limited",
    "areas_requiring_validation": ["array of uncertain areas"]
  }}
}}
        """
        
        try:
            response = self.client.messages.create(
                model=self.model,
                max_tokens=3000,
                temperature=0.3,
                messages=[{"role": "user", "content": synthesis_prompt}],
                system=self.phd_mycologist_persona
            )
            
            content = response.content[0].text if response.content else ""
            return self._parse_json_response(content)
            
        except Exception as e:
            logger.error(f"Literature synthesis failed: {str(e)}")
            return {"error": f"Synthesis failed: {str(e)}"}
    
    def validate_research_methodology(self, methodology_description: str) -> Dict[str, Any]:
        """
        Expert validation of research methodology and experimental design.
        
        Args:
            methodology_description: Detailed description of proposed methodology
            
        Returns:
            Dict: Expert validation with recommendations
        """
        
        validation_prompt = f"""
As Crowe Logic AI, provide expert validation of this mycological research methodology:

**METHODOLOGY TO EVALUATE:**
{methodology_description}

**VALIDATION CRITERIA:**
1. Scientific rigor and validity
2. Appropriate controls and statistical methods
3. Potential confounding variables
4. Reproducibility considerations
5. Ethical and safety considerations
6. Cost-effectiveness and feasibility

**PROVIDE STRUCTURED FEEDBACK (JSON):**
{{
  "methodology_assessment": {{
    "overall_score": float (0-10),
    "strengths": ["array of strong points"],
    "weaknesses": ["array of concerns"],
    "critical_issues": ["array of serious problems"]
  }},
  "improvements": {{
    "essential_changes": ["array of required modifications"],
    "recommended_enhancements": ["array of suggested improvements"],
    "alternative_approaches": ["array of different methods"]
  }},
  "feasibility": {{
    "technical_feasibility": "high/medium/low",
    "resource_requirements": "reasonable/challenging/excessive",
    "timeline_assessment": "realistic/optimistic/unrealistic"
  }},
  "expert_recommendations": {{
    "proceed": boolean,
    "conditions": ["array of prerequisites"],
    "next_steps": ["array of immediate actions"]
  }}
}}
        """
        
        try:
            response = self.client.messages.create(
                model=self.model,
                max_tokens=2500,
                temperature=0.1,
                messages=[{"role": "user", "content": validation_prompt}],
                system=self.phd_mycologist_persona
            )
            
            content = response.content[0].text if response.content else ""
            return self._parse_json_response(content)
            
        except Exception as e:
            logger.error(f"Methodology validation failed: {str(e)}")
            return {"error": f"Validation failed: {str(e)}"}
    
    def _construct_analysis_prompt(self, request: MycologicalAnalysisRequest) -> str:
        """Construct comprehensive analysis prompt for Claude."""
        
        return f"""
As Crowe Logic AI, perform expert-level mycological analysis of this specimen:

**SPECIMEN DATA:**
{json.dumps(request.specimen_data, indent=2)}

**ANALYSIS TYPE:** {request.analysis_type}

**RESEARCH CONTEXT:**
{json.dumps(request.research_context, indent=2)}

**PRIORITY LEVEL:** {request.priority_level}

**ANALYSIS REQUIREMENTS:**
1. Species identification with confidence assessment
2. Morphological analysis and diagnostic features
3. Bioactive compound evaluation
4. Research and commercial potential
5. Quality assessment for scientific use
6. Authenticity validation
7. Recommendations for further analysis

**OUTPUT FORMAT (JSON):**
{{
  "species_identification": {{
    "primary_identification": "string",
    "confidence_level": float (0-1),
    "alternative_species": ["array"],
    "diagnostic_reasoning": "string"
  }},
  "morphological_analysis": {{
    "key_features": ["array of characteristics"],
    "unusual_traits": ["array of notable features"],
    "preservation_quality": "excellent/good/fair/poor"
  }},
  "bioactivity_assessment": {{
    "known_compounds": ["array of compounds"],
    "potential_bioactivities": ["array of activities"],
    "research_priority": "high/medium/low"
  }},
  "authenticity_evaluation": {{
    "authenticity_score": float (0-1),
    "fraud_indicators": ["array of concerns"],
    "verification_methods": ["array of tests"]
  }},
  "commercial_assessment": {{
    "market_value": "high/medium/low",
    "applications": ["array of uses"],
    "regulatory_considerations": ["array of factors"]
  }},
  "research_recommendations": {{
    "immediate_tests": ["array of analyses"],
    "long_term_studies": ["array of research directions"],
    "collaboration_opportunities": ["array of partnerships"]
  }},
  "expert_conclusion": {{
    "overall_assessment": "string",
    "confidence_rating": "high/medium/low",
    "key_uncertainties": ["array of unknowns"]
  }}
}}
        """
    
    def _parse_analysis_response(self, content: str) -> Dict[str, Any]:
        """Parse Claude's analysis response into structured format."""
        
        try:
            # Try to extract JSON from the response
            if '```json' in content:
                json_start = content.find('```json') + 7
                json_end = content.find('```', json_start)
                json_content = content[json_start:json_end].strip()
            else:
                # Look for JSON-like content
                json_content = content
            
            return json.loads(json_content)
            
        except json.JSONDecodeError:
            # Fallback to structured text parsing
            return {
                'raw_analysis': content,
                'structured_format': False,
                'parsing_note': 'Response could not be parsed as JSON'
            }
    
    def _parse_json_response(self, content: str) -> Dict[str, Any]:
        """Parse JSON response from Claude."""
        
        try:
            if '```json' in content:
                json_start = content.find('```json') + 7
                json_end = content.find('```', json_start)
                json_content = content[json_start:json_end].strip()
                return json.loads(json_content)
            else:
                return json.loads(content)
        except:
            return {'raw_content': content, 'parse_error': True}

# Integration functions for your existing platform
def analyze_specimen_with_crowe_logic(specimen_data: Dict[str, Any], 
                                    analysis_type: str = "comprehensive",
                                    research_context: Dict[str, Any] = None) -> Dict[str, Any]:
    """
    Convenience function to analyze specimens with Crowe Logic AI.
    
    Args:
        specimen_data: Dictionary containing specimen information
        analysis_type: Type of analysis to perform
        research_context: Optional research context
        
    Returns:
        Dict: Analysis results from Crowe Logic AI
    """
    
    crowe_ai = CroweLogicAI()
    
    request = MycologicalAnalysisRequest(
        specimen_data=specimen_data,
        analysis_type=analysis_type,
        research_context=research_context or {},
        priority_level="standard"
    )
    
    return crowe_ai.analyze_complex_specimen(request)

def enhance_literature_research(research_query: Dict[str, Any]) -> Dict[str, Any]:
    """
    Enhance literature research with Crowe Logic AI synthesis.
    
    Args:
        research_query: Research parameters and context
        
    Returns:
        Dict: Literature synthesis results
    """
    
    crowe_ai = CroweLogicAI()
    return crowe_ai.research_literature_synthesis(research_query)

# Example usage
if __name__ == "__main__":
    # Example specimen analysis
    sample_specimen = {
        'species': 'Cordyceps militaris',
        'location': 'Laboratory cultivation',
        'morphology': 'Orange-colored stromatic fruiting bodies',
        'compounds': ['cordycepin', 'adenosine', 'mannitol'],
        'bioactivity': ['anti-tumor', 'immunomodulatory']
    }
    
    # Example analysis
    # results = analyze_specimen_with_crowe_logic(sample_specimen)
    print("Crowe Logic AI Integration Ready!")