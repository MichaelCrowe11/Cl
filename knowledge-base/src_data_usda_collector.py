"""
USDA Data Collector - Retrieves data from USDA APIs
"""

import os
import time
import logging
import requests
import pandas as pd
from pathlib import Path
from typing import Dict, List, Optional, Union
from datetime import datetime

from src.utils.database import save_to_database
from src.utils.validators import validate_response

class USDADataCollector:
    """Collector for USDA agricultural data."""
    
    def __init__(self, config_path: Optional[str] = None):
        """
        Initialize the USDA data collector.
        
        Args:
            config_path: Path to configuration file
        """
        self.logger = logging.getLogger(__name__)
        self.base_url = "https://api.nal.usda.gov/fdc/v1"
        self.api_key = os.environ.get("USDA_API_KEY")
        self.data_dir = Path("data/raw/usda")
        self.data_dir.mkdir(parents=True, exist_ok=True)
        
        # Load configuration if provided
        if config_path:
            self._load_config(config_path)
    
    def _load_config(self, config_path: str) -> None:
        """Load configuration from file."""
        import yaml
        
        with open(config_path, 'r') as f:
            config = yaml.safe_load(f)
            
        self.base_url = config.get('base_url', self.base_url)
        self.api_key = config.get('api_key', self.api_key)
    
    def collect(self) -> None:
        """Collect all relevant data from USDA sources."""
        self.logger.info("Starting USDA data collection")
        
        # Collect different types of data
        self.collect_food_data()
        self.collect_nutrient_data()
        self.collect_agricultural_research_data()
        
        self.logger.info("USDA data collection completed")
    
    def collect_food_data(self) -> pd.DataFrame:
        """
        Collect food composition data from USDA FoodData Central.
        
        Returns:
            DataFrame containing food composition data
        """
        self.logger.info("Collecting food composition data")
        
        endpoint = f"{self.base_url}/foods/search"
        
        # Search for plant-based food items
        params = {
            "api_key": self.api_key,
            "query": "seed oil",
            "dataType": ["Foundation", "SR Legacy"],
            "pageSize": 200
        }
        
        response = requests.get(endpoint, params=params)
        validate_response(response)
        
        data = response.json()
        foods = data.get('foods', [])
        
        # Transform to DataFrame
        df = pd.DataFrame(foods)
        
        # Save raw data
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        output_path = self.data_dir / f"food_data_{timestamp}.csv"
        df.to_csv(output_path, index=False)
        
        self.logger.info(f"Saved {len(df)} food items to {output_path}")
        
        return df
    
    def collect_nutrient_data(self) -> pd.DataFrame:
        """
        Collect nutrient data from USDA.
        
        Returns:
            DataFrame containing nutrient data
        """
        self.logger.info("Collecting nutrient data")
        
        endpoint = f"{self.base_url}/nutrients"
        
        params = {
            "api_key": self.api_key
        }
        
