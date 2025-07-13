import tensorflow as tf
import numpy as np
from PIL import Image
import cv2

class MushroomVisionAnalyzer:
    """
    Computer vision system for mushroom identification and growth analysis
    """
    
    def __init__(self, model_path=None):
        self.model = self.load_model(model_path)
        self.species_labels = [
            'Agaricus bisporus',
            'Pleurotus ostreatus', 
            'Shiitake',
            'Reishi',
            'Lion\'s Mane'
        ]
    
    def load_model(self, model_path):
        """Load pre-trained mushroom classification model"""
        if model_path:
            return tf.keras.models.load_model(model_path)
        else:
            # Create a simple CNN for demonstration
            model = tf.keras.Sequential([
                tf.keras.layers.Conv2D(32, 3, activation='relu', input_shape=(224, 224, 3)),
                tf.keras.layers.MaxPooling2D(),
                tf.keras.layers.Conv2D(64, 3, activation='relu'),
                tf.keras.layers.MaxPooling2D(),
                tf.keras.layers.Conv2D(64, 3, activation='relu'),
                tf.keras.layers.Flatten(),
                tf.keras.layers.Dense(64, activation='relu'),
                tf.keras.layers.Dense(len(self.species_labels), activation='softmax')
            ])
            return model
    
    def preprocess_image(self, image_path):
        """Preprocess image for model input"""
        image = Image.open(image_path)
        image = image.resize((224, 224))
        image_array = np.array(image) / 255.0
        return np.expand_dims(image_array, axis=0)
    
    def identify_species(self, image_path):
        """Identify mushroom species from image"""
        processed_image = self.preprocess_image(image_path)
        predictions = self.model.predict(processed_image)
        
        # Get top prediction
        top_prediction = np.argmax(predictions[0])
        confidence = predictions[0][top_prediction]
        
        return {
            'species': self.species_labels[top_prediction],
            'confidence': float(confidence),
            'all_predictions': {
                label: float(pred) for label, pred in 
                zip(self.species_labels, predictions[0])
            }
        }
    
    def analyze_growth_stage(self, image_path):
        """Analyze mushroom growth stage"""
        image = cv2.imread(image_path)
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        
        # Simple contour analysis for size estimation
        contours, _ = cv2.findContours(gray, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        
        if contours:
            largest_contour = max(contours, key=cv2.contourArea)
            area = cv2.contourArea(largest_contour)
            
            # Classify growth stage based on area
            if area < 1000:
                stage = "Pin stage"
            elif area < 5000:
                stage = "Development"
            else:
                stage = "Mature"
            
            return {
                'growth_stage': stage,
                'estimated_area': area,
                'contour_count': len(contours)
            }
        
        return {'growth_stage': 'Unknown', 'estimated_area': 0}

# Example usage
if __name__ == "__main__":
    analyzer = MushroomVisionAnalyzer()
    print("🍄 Mushroom Vision Analyzer Initialized")
    print("Ready for image analysis...")
