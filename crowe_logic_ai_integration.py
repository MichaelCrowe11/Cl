"""
Crowe Logic AI Integration Module
Advanced PhD-Level Mycologist AI System for Enhanced Research Analysis

This module integrates Google's Gemini Pro for advanced mycological reasoning
and research analysis.
"""

import os
import json
import logging
from typing import Dict, List, Any, Optional
from dataclasses import dataclass
from datetime import datetime

from gemini_integration import GeminiAI

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
    Advanced PhD-Level Mycologist AI System using Google's Gemini Pro.
    Specialized for complex mycological research and analysis.
    """
    
    def __init__(self):
        """Initialize Crowe Logic AI with the Gemini client."""
        try:
            self.client = GeminiAI()
            self.phd_mycologist_persona = self._initialize_expert_persona()
            logger.info("Crowe Logic AI (Gemini) initialized successfully")
        except Exception as e:
            logger.error(f"Failed to initialize Crowe Logic AI (Gemini): {str(e)}")
            raise
    
    def _initialize_expert_persona(self) -> str:
        """Initialize the PhD-level mycologist persona for Gemini."""
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
        
        logger.info(f"Starting Crowe Logic AI (Gemini) analysis for {analysis_request.analysis_type}")
        
        # Construct comprehensive analysis prompt
        analysis_prompt = self._construct_analysis_prompt(analysis_request)
        
        try:
            response = self.client.perform_analysis(analysis_prompt)
            
            if "error" in response:
                raise Exception(response["error"])

            # Attempt to parse the response as JSON for structured output
            try:
                analysis_result = json.loads(response["response"])
            except json.JSONDecodeError:
                logger.warning("Gemini response was not valid JSON, returning raw text.")
                analysis_result = {"raw_text": response["response"]}

            return {
                "status": "success",
                "analysis_id": f"CL-GEMINI-{datetime.utcnow().timestamp()}",
                "model_used": "gemini-pro",
                "results": analysis_result
            }
            
        except Exception as e:
            logger.error(f"Crowe Logic AI (Gemini) analysis failed: {str(e)}")
            return {
                "status": "error",
                "message": str(e)
            }

    def _construct_analysis_prompt(self, analysis_request: MycologicalAnalysisRequest) -> str:
        """Construct comprehensive analysis prompt for Gemini."""
        
        prompt = f"""
        {self.phd_mycologist_persona}

        **Analysis Request: {analysis_request.analysis_type}**
        **Priority: {analysis_request.priority_level}**
        **Timestamp: {datetime.utcnow().isoformat()}Z**

        **Research Context:**
        ```json
        {json.dumps(analysis_request.research_context, indent=2)}
        ```

        **Specimen Data:**
        ```json
        {json.dumps(analysis_request.specimen_data, indent=2)}
        ```

        **Instructions:**
        Based on all the provided data, perform a comprehensive `{analysis_request.analysis_type}`.
        Your response MUST be a valid JSON object containing your detailed analysis, findings, and recommendations.
        The JSON object should be structured logically with clear keys and values.
        For example:
        {{
          "analysis_summary": {{
            "key_finding_1": "...",
            "key_finding_2": "..."
          }},
          "detailed_assessment": {{
            "taxonomy": {{ ... }},
            "bioactivity": {{ ... }}
          }},
          "recommendations": ["...", "..."]
        }}
        """
        return prompt

    def get_model_info(self) -> Dict[str, str]:
        """Returns information about the currently configured AI model."""
        return {
            "provider": "Google",
            "model": "gemini-pro"
        }

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

# Example Usage (for testing purposes)
if __name__ == '__main__':
    logging.basicConfig(level=logging.INFO)
    
    # This requires GOOGLE_API_KEY to be set in the environment
    if not os.environ.get("GOOGLE_API_KEY"):
        print("Error: GOOGLE_API_KEY environment variable not set.")
        print("Please set it to your Google API key to run this example.")
    else:
        try:
            crowe_ai = CroweLogicAI()
            
            # Example 1: Authenticate a commercial specimen
            specimen_data_auth = {
                "name": "Golden Chanterelle",
                "claimed_species": "Cantharellus cibarius",
                "supplier": "Organic Fungi Co.",
                "lot_number": "OF-2024-GC-105",
                "lab_results": {
                    "dna_barcode": "ITS sequence matching C. cibarius with 99.8% identity",
                    "chemical_profile": "High levels of ergosterol, low levels of amanitins"
                }
            }
            
            research_context_auth = {
                "objective": "Verify authenticity of a commercial mushroom batch.",
                "market_data": "Recent reports of Cantharellus californicus being sold as C. cibarius.",
                "regulatory_standards": "FDA Food Safety Modernization Act (FSMA)"
            }
            
            auth_request = MycologicalAnalysisRequest(
                specimen_data=specimen_data_auth,
                analysis_type="Commercial Specimen Authenticity Analysis",
                research_context=research_context_auth,
                priority_level="premium"
            )
            
            print("\n--- Running Commercial Specimen Authenticity Analysis ---")
            auth_result = crowe_ai.analyze_complex_specimen(auth_request)
            print(json.dumps(auth_result, indent=2))
            
            # Example 2: Analyze a novel research specimen
            specimen_data_novel = {
                "field_id": "SWM-2024-UNK-001",
                "location": "Southwest Mahteb, High-Altitude Pine Forest",
                "morphology": {
                    "cap": "Convex, reddish-brown, slimy texture",
                    "gills": "Adnate, cream-colored",
                    "stipe": "White, fibrous, with a partial veil"
                },
                "spore_print": "Rusty brown",
                "preliminary_gcms": ["ergosterol", "psilocybin (trace)", "unknown compound at 2.3 min"]
            }
            
            research_context_novel = {
                "objective": "Identify and characterize a potentially novel psychoactive fungus.",
                "related_literature": ["Gymnopilus species of the Southwest", "Cortinarius species with orellanine"],
                "hypothesis": "This may be a novel, toxic Cortinarius species misidentified as a Gymnopilus."
            }
            
            novel_request = MycologicalAnalysisRequest(
                specimen_data=specimen_data_novel,
                analysis_type="Novel Specimen Identification and Bioactivity Assessment",
                research_context=research_context_novel,
                priority_level="research_grade"
            )
            
            print("\n--- Running Novel Specimen Identification Analysis ---")
            novel_result = crowe_ai.analyze_complex_specimen(novel_request)
            print(json.dumps(novel_result, indent=2))

        except Exception as e:
            print(f"An error occurred during the example run: {e}")