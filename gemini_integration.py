"""
Gemini AI Integration Module for advanced reasoning.
"""

import os
import logging
import google.generativeai as genai
from typing import Dict, Any

logger = logging.getLogger(__name__)

class GeminiAI:
    """
    AI System using Google's Gemini Pro.
    """
    
    def __init__(self):
        """
        Initialize Gemini AI with Google API.
        """
        try:
            self.api_key = os.environ.get("GOOGLE_API_KEY")
            if not self.api_key:
                raise ValueError("GOOGLE_API_KEY environment variable not set.")
            genai.configure(api_key=self.api_key)
            self.model = genai.GenerativeModel('gemini-pro')
            logger.info("Gemini AI initialized successfully")
        except Exception as e:
            logger.error(f"Failed to initialize Gemini AI: {str(e)}")
            raise

    def perform_analysis(self, prompt: str) -> Dict[str, Any]:
        """
        Perform analysis using Gemini.
        
        Args:
            prompt: The prompt to send to the AI.
            
        Returns:
            Dict: The analysis result.
        """
        
        logger.info("Starting Gemini AI analysis.")
        
        try:
            response = self.model.generate_content(prompt)
            return {
                "response": response.text
            }
        except Exception as e:
            logger.error(f"Error during Gemini analysis: {str(e)}")
            return {
                "error": str(e)
            }
