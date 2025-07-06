"""
Crowe Logic GPT - Mycology Research Platform
Enhanced AI assistant with specialized mycology knowledge and research capabilities
"""

import google.generativeai as genai
import os
import json
from typing import Dict, List, Optional, Any
from datetime import datetime
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class CroweLogicGPT:
    """Enhanced AI assistant specialized in mycology and biotechnology research"""
    
    def __init__(self):
        """Initialize the Crowe Logic GPT system"""
        self.api_key = os.getenv('GOOGLE_API_KEY')
        if not self.api_key:
            raise ValueError("GOOGLE_API_KEY environment variable is required")
        
        genai.configure(api_key=self.api_key)
        self.model = genai.GenerativeModel('gemini-pro')
        
        # Mycology knowledge base
        self.mycology_context = self._load_mycology_knowledge()
        
        # Research capabilities
        self.research_tools = {
            'species_identification': self._species_identification,
            'substrate_analysis': self._substrate_analysis,
            'protocol_design': self._protocol_design,
            'yield_optimization': self._yield_optimization,
            'literature_search': self._literature_search,
            'environmental_impact': self._environmental_impact
        }
    
    def _load_mycology_knowledge(self) -> str:
        """Load mycology-specific knowledge base"""
        return """
        MYCOLOGY KNOWLEDGE BASE - CROWE LOGIC GPT
        
        🍄 FUNGAL TAXONOMY & IDENTIFICATION
        - Morphological characteristics: cap, gills, stem, spores, habitat
        - Molecular identification: DNA barcoding, phylogenetic analysis
        - Key identification features: spore prints, microscopic structures
        - Common genera: Agaricus, Pleurotus, Shiitake, Reishi, Cordyceps
        
        🔬 CULTIVATION PROTOCOLS
        - Sterile technique and contamination prevention
        - Substrate preparation: sterilization, nutrient composition
        - Inoculation methods: agar transfer, liquid culture, grain spawn
        - Environmental controls: temperature, humidity, CO2, lighting
        
        🌱 SUBSTRATE OPTIMIZATION
        - Carbon sources: cellulose, lignin, sugars, agricultural waste
        - Nitrogen sources: proteins, amino acids, urea, organic matter
        - pH optimization: species-specific requirements (4.5-8.0)
        - Moisture content: optimal ranges for different species
        
        🧬 BIOTECHNOLOGY APPLICATIONS
        - Bioactive compounds: polysaccharides, terpenoids, proteins
        - Fermentation optimization: bioreactor design, scale-up
        - Product extraction: purification methods, concentration
        - Quality control: analytical methods, standardization
        
        🌍 ENVIRONMENTAL APPLICATIONS
        - Mycoremediation: heavy metals, pesticides, hydrocarbons
        - Carbon sequestration: soil improvement, ecosystem restoration
        - Biodegradation: organic pollutants, plastic degradation
        - Sustainable materials: mycelium leather, packaging, construction
        
        📊 RESEARCH METHODOLOGY
        - Experimental design: controls, replication, statistical analysis
        - Data collection: growth measurements, yield analysis, composition
        - Quality assurance: standardized protocols, reproducibility
        - Publication standards: peer review, data sharing, methodology
        """
    
    def _species_identification(self, query: str) -> Dict[str, Any]:
        """Enhanced species identification with morphological analysis"""
        prompt = f"""
        As a mycology expert, help identify this mushroom species:
        
        Query: {query}
        
        Please provide:
        1. Most likely species identification
        2. Confidence level (%)
        3. Key identifying characteristics
        4. Similar species to consider
        5. Additional tests recommended
        6. Safety considerations
        
        Use systematic approach based on morphological features.
        """
        return self._generate_response(prompt, response_type='identification')
    
    def _substrate_analysis(self, query: str) -> Dict[str, Any]:
        """Analyze substrate composition and optimization strategies"""
        prompt = f"""
        As a mycology cultivation expert, analyze this substrate query:
        
        Query: {query}
        
        Please provide:
        1. Substrate composition analysis
        2. Nutritional assessment (C:N ratio, pH, moisture)
        3. Optimization recommendations
        4. Potential contamination risks
        5. Expected yield predictions
        6. Cost-effectiveness analysis
        
        Base recommendations on established cultivation protocols.
        """
        return self._generate_response(prompt, response_type='analysis')
    
    def _protocol_design(self, query: str) -> Dict[str, Any]:
        """Design detailed cultivation or research protocols"""
        prompt = f"""
        As a mycology protocol specialist, design a detailed protocol for:
        
        Query: {query}
        
        Please provide:
        1. Step-by-step protocol
        2. Materials and equipment list
        3. Safety considerations
        4. Quality control checkpoints
        5. Troubleshooting guide
        6. Expected timeline and outcomes
        
        Ensure protocols are scientifically rigorous and reproducible.
        """
        return self._generate_response(prompt, response_type='protocol')
    
    def _yield_optimization(self, query: str) -> Dict[str, Any]:
        """Optimize growing conditions for maximum yield"""
        prompt = f"""
        As a mycology optimization expert, analyze yield improvement for:
        
        Query: {query}
        
        Please provide:
        1. Current yield assessment
        2. Limiting factors identification
        3. Environmental optimization strategies
        4. Substrate enhancement recommendations
        5. Harvest timing optimization
        6. Economic impact analysis
        
        Focus on practical, evidence-based improvements.
        """
        return self._generate_response(prompt, response_type='optimization')
    
    def _literature_search(self, query: str) -> Dict[str, Any]:
        """Search and synthesize mycological research literature"""
        prompt = f"""
        As a mycology research specialist, provide literature review for:
        
        Query: {query}
        
        Please provide:
        1. Recent research findings (2020-2024)
        2. Key research papers and authors
        3. Emerging trends and technologies
        4. Research gaps and opportunities
        5. Practical applications
        6. Future research directions
        
        Synthesize information from peer-reviewed sources.
        """
        return self._generate_response(prompt, response_type='research')
    
    def _environmental_impact(self, query: str) -> Dict[str, Any]:
        """Assess environmental benefits and applications"""
        prompt = f"""
        As an environmental mycology expert, assess environmental impact for:
        
        Query: {query}
        
        Please provide:
        1. Environmental benefits analysis
        2. Sustainability assessment
        3. Carbon footprint evaluation
        4. Ecosystem impact prediction
        5. Scale-up feasibility
        6. Policy and regulatory considerations
        
        Focus on quantifiable environmental metrics.
        """
        return self._generate_response(prompt, response_type='environmental')
    
    def _generate_response(self, prompt: str, response_type: str = 'general') -> Dict[str, Any]:
        """Generate enhanced AI response with mycology context"""
        try:
            # Enhanced prompt with context
            full_prompt = f"""
            {self.mycology_context}
            
            SPECIALIZED MYCOLOGY RESEARCH ASSISTANT
            
            You are Crowe Logic GPT, an advanced AI specialized in mycology, biotechnology, and environmental research. 
            You have access to cutting-edge fungal biotechnology knowledge and research methodologies.
            
            Please respond to the following query with scientific accuracy, practical applications, and research-grade detail:
            
            {prompt}
            
            Response Type: {response_type}
            
            Format your response with:
            - Clear headings and structure
            - Scientific terminology with explanations
            - Practical recommendations
            - Research citations when relevant
            - Safety considerations
            - Future research directions
            
            Maintain scientific rigor while being accessible to researchers at all levels.
            """
            
            response = self.model.generate_content(full_prompt)
            
            return {
                'response': response.text,
                'type': response_type,
                'timestamp': datetime.now().isoformat(),
                'model': 'crowe-logic-gpt',
                'confidence': 'high',
                'specialty': 'mycology'
            }
            
        except Exception as e:
            logger.error(f"Error generating response: {str(e)}")
            return {
                'response': f"I apologize, but I encountered an error processing your mycology research query. Please try rephrasing your question or contact our research support team.\n\nError details: {str(e)}",
                'type': 'error',
                'timestamp': datetime.now().isoformat(),
                'model': 'crowe-logic-gpt'
            }
    
    def chat(self, message: str, config: Optional[Dict] = None) -> Dict[str, Any]:
        """Main chat interface for Crowe Logic GPT"""
        try:
            # Detect query type and route to appropriate specialist
            query_lower = message.lower()
            
            if any(keyword in query_lower for keyword in ['identify', 'species', 'classification']):
                return self._species_identification(message)
            elif any(keyword in query_lower for keyword in ['substrate', 'growing medium', 'nutrition']):
                return self._substrate_analysis(message)
            elif any(keyword in query_lower for keyword in ['protocol', 'procedure', 'method']):
                return self._protocol_design(message)
            elif any(keyword in query_lower for keyword in ['yield', 'optimization', 'improve']):
                return self._yield_optimization(message)
            elif any(keyword in query_lower for keyword in ['research', 'literature', 'study']):
                return self._literature_search(message)
            elif any(keyword in query_lower for keyword in ['environment', 'sustainability', 'impact']):
                return self._environmental_impact(message)
            else:
                # General mycology query
                return self._generate_response(message, 'general')
                
        except Exception as e:
            logger.error(f"Error in chat interface: {str(e)}")
            return {
                'response': "I'm experiencing technical difficulties with the Crowe Logic research network. Please try again shortly or contact our support team.",
                'type': 'error',
                'timestamp': datetime.now().isoformat()
            }

# Global instance
crowe_logic_gpt = CroweLogicGPT()

def get_crowe_response(message: str, config: Optional[Dict] = None) -> str:
    """Get response from Crowe Logic GPT"""
    result = crowe_logic_gpt.chat(message, config)
    return result.get('response', 'Error generating response')
