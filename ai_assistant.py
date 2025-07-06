"""
AI Assistant Module for Mycology Research Pipeline.

This module provides integration with Google's Gemini model to assist with research,
data analysis, and code generation for mycological applications.
"""

import os
import logging
import json
from typing import Dict, List, Any, Optional

from gemini_integration import GeminiAI

logger = logging.getLogger(__name__)

class AIAssistant:
    """Class for interacting with Google's Gemini model."""
    
    def __init__(self):
        """Initialize the AI assistant with the Gemini client."""
        try:
            self.client = GeminiAI()
            logger.info("AIAssistant (Gemini) initialized successfully")
        except Exception as e:
            logger.error(f"Failed to initialize AIAssistant (Gemini): {str(e)}")
            raise
    
    def _perform_analysis(self, prompt: str) -> Dict[str, Any]:
        """Helper function to perform analysis and handle responses."""
        try:
            response = self.client.perform_analysis(prompt)
            
            if "error" in response:
                raise Exception(response["error"])

            analysis_text = response.get("response")

            # Try to extract structured data if possible
            try:
                if analysis_text:
                    json_start = analysis_text.find("{")
                    json_end = analysis_text.rfind("}") + 1
                    
                    if json_start >= 0 and json_end > json_start:
                        json_str = analysis_text[json_start:json_end]
                        structured_data = json.loads(json_str)
                        return {
                            "raw_response": analysis_text,
                            "structured_data": structured_data
                        }
            except json.JSONDecodeError:
                pass # Return unstructured response if JSON parsing fails
            
            return {
                "raw_response": analysis_text,
                "structured_data": None
            }

        except Exception as e:
            logger.error(f"Error during AI analysis: {str(e)}")
            return {
                "error": str(e),
                "raw_response": None,
                "structured_data": None
            }

    def analyze_sample_data(self, sample_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Analyze sample data and provide insights.
        
        Args:
            sample_data: Dictionary containing sample information
            
        Returns:
            Dict: Analysis results and insights
        """
        system_prompt = "You are a mycology research assistant with expertise in analyzing fungal samples and compounds."
        user_prompt = self._construct_sample_analysis_prompt(sample_data)
        full_prompt = f"{system_prompt}\n\n{user_prompt}"
        return self._perform_analysis(full_prompt)
    
    def analyze_compounds(self, compound_data: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Analyze compound data and provide insights about bioactivity and potential applications.
        
        Args:
            compound_data: List of dictionaries containing compound information
            
        Returns:
            Dict: Analysis results and insights about compounds
        """
        system_prompt = "You are a mycology research assistant with expertise in fungal compounds, bioactivity, and medicinal applications."
        user_prompt = self._construct_compound_analysis_prompt(compound_data)
        full_prompt = f"{system_prompt}\n\n{user_prompt}"
        return self._perform_analysis(full_prompt)
    
    def generate_research_hypothesis(self, context_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Generate research hypotheses based on existing data.
        
        Args:
            context_data: Dictionary containing research context
            
        Returns:
            Dict: Generated hypotheses and rationale
        """
        system_prompt = "You are a mycology research assistant specializing in generating novel research hypotheses based on existing data."
        user_prompt = self._construct_hypothesis_prompt(context_data)
        full_prompt = f"{system_prompt}\n\n{user_prompt}"
        return self._perform_analysis(full_prompt)
    
    def analyze_species_similarity(self, species_data: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Analyze similarities between different fungal species.
        
        Args:
            species_data: List of dictionaries containing species information
            
        Returns:
            Dict: Analysis of similarities and differences
        """
        system_prompt = "You are a mycology research assistant with expertise in fungal taxonomy and comparative biology."
        user_prompt = self._construct_species_comparison_prompt(species_data)
        full_prompt = f"{system_prompt}\n\n{user_prompt}"
        return self._perform_analysis(full_prompt)
    
    def generate_code_sample(self, task_description: str, language: str = "python") -> Dict[str, Any]:
        """
        Generate code samples for common research tasks.
        
        Args:
            task_description: Description of the coding task
            language: Programming language (default: python)
            
        Returns:
            Dict: Generated code sample
        """
        system_prompt = f"You are a programming assistant specializing in generating {language} code for scientific research."
        user_prompt = self._construct_code_generation_prompt(task_description, language)
        full_prompt = f"{system_prompt}\n\n{user_prompt}"
        return self._perform_analysis(full_prompt)

    def _construct_sample_analysis_prompt(self, sample_data: Dict[str, Any]) -> str:
        """
        Construct a prompt for sample analysis.
        
        Args:
            sample_data: Dictionary containing sample information
            
        Returns:
            str: Formatted prompt
        """
        prompt = "Analyze the following mycological sample data and provide insights:\n\n"
        
        # Add sample details
        prompt += f"Sample ID: {sample_data.get('id', 'Unknown')}\n"
        prompt += f"Name: {sample_data.get('name', 'Unknown')}\n"
        prompt += f"Species: {sample_data.get('species', 'Unknown')}\n"
        prompt += f"Collection Date: {sample_data.get('collection_date', 'Unknown')}\n"
        prompt += f"Location: {sample_data.get('location', 'Unknown')}\n"
        
        # Add sample metadata if available
        if sample_data.get('sample_metadata'):
            prompt += "\nMetadata:\n"
            for key, value in sample_data['sample_metadata'].items():
                prompt += f"- {key}: {value}\n"
        
        # Add compounds if available
        if sample_data.get('compounds'):
            prompt += "\nCompounds:\n"
            for compound in sample_data['compounds']:
                prompt += f"- {compound.get('name', 'Unknown Compound')}"
                if compound.get('formula'):
                    prompt += f" (Formula: {compound['formula']})"
                if compound.get('bioactivity_index'):
                    prompt += f" (Bioactivity Index: {compound['bioactivity_index']})"
                prompt += "\n"
        
        # Analysis requests
        prompt += "\nPlease provide the following analysis:\n"
        prompt += "1. Overall assessment of the sample\n"
        prompt += "2. Notable characteristics and potential research value\n"
        prompt += "3. Recommendations for further analysis\n"
        prompt += "4. Potential applications or significance\n"
        
        # Request structured format
        prompt += "\nPlease include a structured JSON summary with the following schema:\n"
        prompt += "{\n"
        prompt += '  "overall_assessment": "text",\n'
        prompt += '  "notable_characteristics": ["item1", "item2", ...],\n'
        prompt += '  "recommended_analyses": ["analysis1", "analysis2", ...],\n'
        prompt += '  "potential_applications": ["application1", "application2", ...],\n'
        prompt += '  "research_value_score": 1-10 (integer),\n'
        prompt += '  "confidence_level": "high/medium/low"\n'
        prompt += "}\n"
        
        return prompt
    
    def _construct_compound_analysis_prompt(self, compound_data: List[Dict[str, Any]]) -> str:
        """
        Construct a prompt for compound analysis.
        
        Args:
            compound_data: List of dictionaries containing compound information
            
        Returns:
            str: Formatted prompt
        """
        prompt = "Analyze the following compounds from mycological samples and provide insights on bioactivity and potential applications:\n\n"
        
        for i, compound in enumerate(compound_data, 1):
            prompt += f"Compound {i}:\n"
            prompt += f"- Name: {compound.get('name', 'Unknown')}\n"
            prompt += f"- Formula: {compound.get('formula', 'Unknown')}\n"
            prompt += f"- Molecular Weight: {compound.get('molecular_weight', 'Unknown')}\n"
            prompt += f"- Bioactivity Index: {compound.get('bioactivity_index', 'Unknown')}\n"
            prompt += f"- Concentration: {compound.get('concentration', 'Unknown')}\n"
            
            # Add compound metadata if available
            if compound.get('compound_metadata'):
                prompt += "- Additional Properties:\n"
                for key, value in compound['compound_metadata'].items():
                    prompt += f"  * {key}: {value}\n"
            prompt += "\n"
        
        # Analysis requests
        prompt += "\nPlease provide the following analysis:\n"
        prompt += "1. Bioactivity assessment for each compound\n"
        prompt += "2. Potential medicinal applications\n"
        prompt += "3. Structural similarities and differences between compounds\n"
        prompt += "4. Recommendations for further characterization\n"
        prompt += "5. Comparison with known medicinal compounds if applicable\n"
        
        return prompt
    
    def _construct_hypothesis_prompt(self, context_data: Dict[str, Any]) -> str:
        """
        Construct a prompt for generating research hypotheses.
        
        Args:
            context_data: Dictionary containing research context
            
        Returns:
            str: Formatted prompt
        """
        prompt = "Generate novel research hypotheses based on the following mycological research context:\n\n"
        
        # Add research area
        prompt += f"Research Area: {context_data.get('research_area', 'General Mycology')}\n"
        
        # Add existing findings
        if context_data.get('existing_findings'):
            prompt += "\nExisting Findings:\n"
            for finding in context_data['existing_findings']:
                prompt += f"- {finding}\n"
        
        # Add target objectives
        if context_data.get('objectives'):
            prompt += "\nResearch Objectives:\n"
            for objective in context_data['objectives']:
                prompt += f"- {objective}\n"
        
        # Add available resources/methods
        if context_data.get('available_methods'):
            prompt += "\nAvailable Methods and Resources:\n"
            for method in context_data['available_methods']:
                prompt += f"- {method}\n"
        
        # Analysis requests
        prompt += "\nPlease generate 3-5 novel research hypotheses that are:\n"
        prompt += "1. Scientifically plausible based on existing data\n"
        prompt += "2. Testable with available methods\n"
        prompt += "3. Aligned with the research objectives\n"
        prompt += "4. Novel and contribute to advancing the field\n"
        
        prompt += "\nFor each hypothesis, please provide:\n"
        prompt += "- The hypothesis statement\n"
        prompt += "- Rationale based on existing data\n"
        prompt += "- Suggested experimental approach\n"
        prompt += "- Potential significance if confirmed\n"
        
        return prompt
    
    def _construct_species_comparison_prompt(self, species_data: List[Dict[str, Any]]) -> str:
        """
        Construct a prompt for species comparison.
        
        Args:
            species_data: List of dictionaries containing species information
            
        Returns:
            str: Formatted prompt
        """
        prompt = "Analyze and compare the following fungal species:\n\n"
        
        for i, species in enumerate(species_data, 1):
            prompt += f"Species {i}:\n"
            prompt += f"- Scientific Name: {species.get('scientific_name', 'Unknown')}\n"
            prompt += f"- Common Name: {species.get('common_name', 'Unknown')}\n"
            
            # Add habitat if available
            if species.get('habitat'):
                prompt += f"- Habitat: {species['habitat']}\n"
            
            # Add properties if available
            if species.get('properties'):
                prompt += "- Properties:\n"
                for key, value in species['properties'].items():
                    prompt += f"  * {key}: {value}\n"
            
            # Add compounds if available
            if species.get('compounds'):
                prompt += "- Known Compounds:\n"
                for compound in species['compounds']:
                    prompt += f"  * {compound}\n"
            
            prompt += "\n"
        
        # Analysis requests
        prompt += "\nPlease provide the following comparative analysis:\n"
        prompt += "1. Taxonomic relationships between the species\n"
        prompt += "2. Ecological and habitat similarities/differences\n"
        prompt += "3. Common compounds or biochemical pathways\n"
        prompt += "4. Evolutionary insights\n"
        prompt += "5. Research or commercial significance of each species\n"
        prompt += "6. Recommendations for comparative studies\n"
        
        return prompt
    
    def _construct_code_generation_prompt(self, task_description: str, language: str) -> str:
        """
        Construct a prompt for code generation.
        
        Args:
            task_description: Description of the coding task
            language: Programming language
            
        Returns:
            str: Formatted prompt
        """
        return f"Generate {language} code for the following task in mycology research:\n\n{task_description}\n\nProvide code with comments explaining each step."


# Utility functions for direct use
def analyze_sample(sample_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Utility function to analyze a sample.
    
    Args:
        sample_data: Dictionary containing sample information
        
    Returns:
        Dict: Analysis results
    """
    assistant = AIAssistant()
    return assistant.analyze_sample_data(sample_data)


def generate_hypothesis(context_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Utility function to generate research hypotheses.
    
    Args:
        context_data: Dictionary containing research context
        
    Returns:
        Dict: Generated hypotheses
    """
    assistant = AIAssistant()
    return assistant.generate_research_hypothesis(context_data)


def generate_code(task_description: str, language: str = "python") -> Dict[str, Any]:
    """
    Utility function to generate code.
    
    Args:
        task_description: Description of the coding task
        language: Programming language (default: python)
        
    Returns:
        Dict: Generated code
    """
    assistant = AIAssistant()
    return assistant.generate_code_sample(task_description, language)