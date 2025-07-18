"""
Medical publication-quality visualization engine for drug design research.
"""
import matplotlib.pyplot as plt
import matplotlib.patches as patches
from matplotlib.patches import FancyBboxPatch, Circle, Rectangle, Polygon, Arrow
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageEnhance
import plotly.graph_objects as go
import plotly.express as px
from plotly.subplots import make_subplots
import seaborn as sns
from typing import Dict, List, Tuple, Any
import base64
from io import BytesIO

class MedicalVisualizationEngine:
    """
    Advanced medical visualization engine for drug design research.
    """
    
    def __init__(self):
        """Initialize medical visualization engine."""
        self.medical_color_scheme = {
            'primary': '#2C3E50',
            'secondary': '#3498DB',
            'accent': '#E74C3C',
            'success': '#27AE60',
            'warning': '#F39C12',
            'info': '#8E44AD',
            'light': '#ECF0F1',
            'dark': '#34495E'
        }
        
        self.journal_specifications = {
            'nature': {
                'dpi': 300,
                'max_width': 180,  # mm
                'font_family': 'Arial',
                'font_sizes': {'title': 12, 'axis': 10, 'legend': 9}
            },
            'science': {
                'dpi': 600,
                'max_width': 180,  # mm
                'font_family': 'Helvetica',
                'font_sizes': {'title': 12, 'axis': 10, 'legend': 9}
            },
            'cell': {
                'dpi': 300,
                'max_width': 180,  # mm
                'font_family': 'Arial',
                'font_sizes': {'title': 11, 'axis': 9, 'legend': 8}
            }
        }
    
    def create_compound_activity_heatmap(self, activity_data: Dict) -> plt.Figure:
        """Create publication-quality compound activity heatmap."""
        
        # Prepare data for heatmap
        compounds = list(activity_data.keys())
        targets = []
        activity_matrix = []
        
        for compound, data in activity_data.items():
            compound_targets = data.get('therapeutic_targets', {})
            if not targets:
                targets = list(compound_targets.keys())
            
            activities = [compound_targets.get(target, 0) for target in targets]
            activity_matrix.append(activities)
        
        activity_matrix = np.array(activity_matrix)
        
        # Create figure with journal specifications
        fig, ax = plt.subplots(figsize=(8, 6))
        
        # Create heatmap
        im = ax.imshow(activity_matrix, cmap='RdYlBu_r', aspect='auto')
        
        # Set ticks and labels
        ax.set_xticks(np.arange(len(targets)))
        ax.set_yticks(np.arange(len(compounds)))
        ax.set_xticklabels([t.replace('_', ' ').title() for t in targets], rotation=45, ha='right')
        ax.set_yticklabels([c.replace('_', ' ').title() for c in compounds])
        
        # Add colorbar
        cbar = plt.colorbar(im, ax=ax)
        cbar.set_label('Activity Score', rotation=270, labelpad=20)
        
        # Add text annotations
        for i in range(len(compounds)):
            for j in range(len(targets)):
                text = ax.text(j, i, f'{activity_matrix[i, j]:.1f}',
                             ha="center", va="center", color="white" if activity_matrix[i, j] > 5 else "black")
        
        ax.set_title('Compound-Target Activity Profile', fontweight='bold', pad=20)
        ax.set_xlabel('Therapeutic Targets')
        ax.set_ylabel('Lead Compounds')
        
        plt.tight_layout()
        return fig
    
    def create_pharmacokinetic_profile(self, pk_data: Dict) -> plt.Figure:
        """Create pharmacokinetic profile visualization."""
        
        # Create subplot figure
        fig, axes = plt.subplots(2, 2, figsize=(12, 10))
        fig.suptitle('Pharmacokinetic Profile Analysis', fontsize=16, fontweight='bold')
        
        # Plot 1: Plasma concentration over time
        ax1 = axes[0, 0]
        time_points = np.linspace(0, 24, 25)  # 24 hours
        
        # Simulate PK curves for different doses
        doses = [10, 25, 50, 100]  # mg
        colors = ['#3498DB', '#27AE60', '#F39C12', '#E74C3C']
        
        for dose, color in zip(doses, colors):
            # Simplified PK model (first-order absorption, first-order elimination)
            ka = 0.5  # absorption rate constant
            ke = 0.1  # elimination rate constant
            
            concentrations = []
            for t in time_points:
                if t == 0:
                    c = 0
                else:
                    c = (dose * ka / (ka - ke)) * (np.exp(-ke * t) - np.exp(-ka * t))
                concentrations.append(max(0, c))
            
            ax1.plot(time_points, concentrations, color=color, linewidth=2, label=f'{dose} mg')
        
        ax1.set_xlabel('Time (hours)')
        ax1.set_ylabel('Plasma Concentration (ng/mL)')
        ax1.set_title('Plasma Concentration vs Time')
        ax1.legend()
        ax1.grid(True, alpha=0.3)
        
        # Plot 2: Dose-response relationship
        ax2 = axes[0, 1]
        doses_response = np.array([1, 5, 10, 25, 50, 100, 200])
        
        # Simulate dose-response curve (Hill equation)
        ec50 = 25  # Half-maximal effective concentration
        hill_slope = 1.5
        max_response = 100
        
        responses = max_response * (doses_response ** hill_slope) / (ec50 ** hill_slope + doses_response ** hill_slope)
        
        ax2.semilogx(doses_response, responses, 'o-', color='#8E44AD', linewidth=2, markersize=6)
        ax2.axhline(y=50, color='red', linestyle='--', alpha=0.7, label='EC50')
        ax2.axvline(x=ec50, color='red', linestyle='--', alpha=0.7)
        
        ax2.set_xlabel('Dose (mg)')
        ax2.set_ylabel('Response (%)')
        ax2.set_title('Dose-Response Relationship')
        ax2.grid(True, alpha=0.3)
        ax2.legend()
        
        # Plot 3: ADME properties radar chart
        ax3 = axes[1, 0]
        adme_props = ['Absorption', 'Distribution', 'Metabolism', 'Excretion']
        values = [0.8, 0.7, 0.6, 0.9]  # Example values
        
        angles = np.linspace(0, 2 * np.pi, len(adme_props), endpoint=False).tolist()
        values += values[:1]
        angles += angles[:1]
        
        ax3 = plt.subplot(2, 2, 3, projection='polar')
        ax3.plot(angles, values, 'o-', linewidth=2, color='#2ECC71')
        ax3.fill(angles, values, alpha=0.25, color='#2ECC71')
        ax3.set_xticks(angles[:-1])
        ax3.set_xticklabels(adme_props)
        ax3.set_ylim(0, 1)
        ax3.set_title('ADME Properties', fontweight='bold', pad=20)
        
        # Plot 4: Safety margin analysis
        ax4 = axes[1, 1]
        safety_endpoints = ['Hepatotoxicity', 'Cardiotoxicity', 'Nephrotoxicity', 'Neurotoxicity']
        therapeutic_dose = 50  # mg
        toxic_doses = [500, 750, 1000, 800]  # mg
        safety_margins = [td / therapeutic_dose for td in toxic_doses]
        
        bars = ax4.bar(safety_endpoints, safety_margins, color=['#E74C3C', '#F39C12', '#3498DB', '#9B59B6'])
        ax4.axhline(y=10, color='green', linestyle='--', alpha=0.7, label='Acceptable Margin')
        ax4.set_ylabel('Safety Margin (fold)')
        ax4.set_title('Safety Profile')
        ax4.set_xticklabels(safety_endpoints, rotation=45, ha='right')
        ax4.legend()
        
        # Add value labels on bars
        for bar, margin in zip(bars, safety_margins):
            ax4.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.5,
                    f'{margin:.1f}x', ha='center', va='bottom', fontweight='bold')
        
        plt.tight_layout()
        return fig
    
    def create_clinical_trial_design_figure(self, trial_data: Dict) -> Image.Image:
        """Create clinical trial design flowchart."""
        
        width, height = 1400, 1000
        img = Image.new('RGB', (width, height), color='white')
        draw = ImageDraw.Draw(img)
        
        # Color scheme
        colors = {
            'phase1': '#3498DB',
            'phase2': '#27AE60',
            'phase3': '#F39C12',
            'regulatory': '#E74C3C',
            'background': '#ECF0F1',
            'text': '#2C3E50',
            'arrow': '#34495E'
        }
        
        try:
            title_font = ImageFont.truetype("arial.ttf", 24)
            header_font = ImageFont.truetype("arial.ttf", 18)
            body_font = ImageFont.truetype("arial.ttf", 14)
            small_font = ImageFont.truetype("arial.ttf", 12)
        except:
            title_font = ImageFont.load_default()
            header_font = ImageFont.load_default()
            body_font = ImageFont.load_default()
            small_font = ImageFont.load_default()
        
        # Title
        title = "Clinical Development Strategy - Substrate-Derived Therapeutics"
        title_bbox = draw.textbbox((0, 0), title, font=title_font)
        title_width = title_bbox[2] - title_bbox[0]
        draw.text(((width - title_width) // 2, 30), title, fill=colors['text'], font=title_font)
        
        # Define phase boxes
        phases = [
            {
                'name': 'Preclinical',
                'color': colors['background'],
                'position': (100, 150),
                'size': (200, 120),
                'details': ['Safety testing', 'ADME studies', 'Toxicology', 'IND preparation']
            },
            {
                'name': 'Phase I',
                'color': colors['phase1'],
                'position': (400, 150),
                'size': (200, 120),
                'details': ['n=20-30', 'Safety & dosing', '6-12 months', 'Healthy volunteers']
            },
            {
                'name': 'Phase II',
                'color': colors['phase2'],
                'position': (700, 150),
                'size': (200, 120),
                'details': ['n=100-200', 'Efficacy testing', '1-2 years', 'Patient population']
            },
            {
                'name': 'Phase III',
                'color': colors['phase3'],
                'position': (1000, 150),
                'size': (200, 120),
                'details': ['n=1000-3000', 'Confirmatory trials', '2-4 years', 'Multiple centers']
            },
            {
                'name': 'FDA Review',
                'color': colors['regulatory'],
                'position': (400, 400),
                'size': (500, 120),
                'details': ['NDA submission', 'Standard review (12 months)', 'Priority review (8 months)', 'Approval decision']
            }
        ]
        
        # Draw phase boxes
        for phase in phases:
            x, y = phase['position']
            w, h = phase['size']
            
            # Draw main box
            draw.rectangle([x, y, x + w, y + h], fill=phase['color'], outline=colors['text'], width=2)
            
            # Draw phase name
            name_bbox = draw.textbbox((0, 0), phase['name'], font=header_font)
            name_width = name_bbox[2] - name_bbox[0]
            draw.text((x + (w - name_width) // 2, y + 10), phase['name'], 
                     fill='white' if phase['color'] != colors['background'] else colors['text'], 
                     font=header_font)
            
            # Draw details
            for i, detail in enumerate(phase['details']):
                draw.text((x + 10, y + 40 + i * 18), f"• {detail}", 
                         fill='white' if phase['color'] != colors['background'] else colors['text'], 
                         font=small_font)
        
        # Draw arrows between phases
        arrow_positions = [
            ((300, 210), (400, 210)),  # Preclinical to Phase I
            ((600, 210), (700, 210)),  # Phase I to Phase II
            ((900, 210), (1000, 210)), # Phase II to Phase III
            ((800, 270), (650, 400)),  # Phase II to FDA Review
            ((1100, 270), (650, 400))  # Phase III to FDA Review
        ]
        
        for start, end in arrow_positions:
            # Draw arrow line
            draw.line([start, end], fill=colors['arrow'], width=3)
            
            # Draw arrowhead
            angle = np.arctan2(end[1] - start[1], end[0] - start[0])
            arrow_length = 15
            arrow_angle = np.pi / 6
            
            arrow_point1 = (
                end[0] - arrow_length * np.cos(angle - arrow_angle),
                end[1] - arrow_length * np.sin(angle - arrow_angle)
            )
            arrow_point2 = (
                end[0] - arrow_length * np.cos(angle + arrow_angle),
                end[1] - arrow_length * np.sin(angle + arrow_angle)
            )
            
            draw.polygon([end, arrow_point1, arrow_point2], fill=colors['arrow'])
        
        # Add timeline
        timeline_y = 600
        draw.text((100, timeline_y), "Timeline:", fill=colors['text'], font=header_font)
        
        timeline_phases = [
            ("Preclinical", 0, 2, colors['background']),
            ("Phase I", 2, 3, colors['phase1']),
            ("Phase II", 3, 5, colors['phase2']),
            ("Phase III", 5, 9, colors['phase3']),
            ("FDA Review", 9, 10, colors['regulatory'])
        ]
        
        timeline_start_x = 100
        timeline_width = 1000
        year_width = timeline_width / 10
        
        for phase_name, start_year, end_year, color in timeline_phases:
            x = timeline_start_x + start_year * year_width
            width_px = (end_year - start_year) * year_width
            
            draw.rectangle([x, timeline_y + 30, x + width_px, timeline_y + 60], 
                          fill=color, outline=colors['text'], width=1)
            
            # Add year labels
            for year in range(int(start_year), int(end_year) + 1):
                year_x = timeline_start_x + year * year_width
                draw.text((year_x, timeline_y + 70), str(year), fill=colors['text'], font=small_font)
        
        # Add cost estimates
        cost_y = 750
        draw.text((100, cost_y), "Estimated Costs:", fill=colors['text'], font=header_font)
        
        costs = [
            ("Preclinical", "$2-5M"),
            ("Phase I", "$5-10M"),
            ("Phase II", "$10-30M"),
            ("Phase III", "$50-100M"),
            ("Total", "$70-150M")
        ]
        
        for i, (phase, cost) in enumerate(costs):
            y_pos = cost_y + 30 + i * 25
            draw.text((100, y_pos), f"{phase}:", fill=colors['text'], font=body_font)
            draw.text((250, y_pos), cost, fill=colors['text'], font=body_font)
        
        # Add success rates
        success_y = 750
        draw.text((500, success_y), "Success Rates:", fill=colors['text'], font=header_font)
        
        success_rates = [
            ("Preclinical → Phase I", "85%"),
            ("Phase I → Phase II", "65%"),
            ("Phase II → Phase III", "40%"),
            ("Phase III → Approval", "85%"),
            ("Overall Success", "20%")
        ]
        
        for i, (phase, rate) in enumerate(success_rates):
            y_pos = success_y + 30 + i * 25
            draw.text((500, y_pos), f"{phase}:", fill=colors['text'], font=body_font)
            draw.text((700, y_pos), rate, fill=colors['text'], font=body_font)
        
        # Add research credit
        credit = f"Clinical Development Strategy | MichaelCrowe11 | Generated: {datetime.now().strftime('%Y-%m-%d')}"
        draw.text((100, height - 50), credit, fill='#7F8C8D', font=small_font)
        
        return img
    
    def create_competitive_analysis_chart(self, competitive_data: Dict) -> plt.Figure:
        """Create competitive landscape analysis chart."""
        
        fig, axes = plt.subplots(2, 2, figsize=(14, 10))
        fig.suptitle('Competitive Landscape Analysis', fontsize=16, fontweight='bold')
        
        # Plot 1: Market positioning (efficacy vs safety)
        ax1 = axes[0, 0]
        
        # Example competitive data
        competitors = {
            'Our Drug': {'efficacy': 8.5, 'safety': 8.2, 'market_share': 0},
            'Competitor A': {'efficacy': 7.8, 'safety': 7.5, 'market_share': 35},
            'Competitor B': {'efficacy': 8.0, 'safety': 6.8, 'market_share': 28},
            'Competitor C': {'efficacy': 7.2, 'safety': 8.8, 'market_share': 20},
            'Generic': {'efficacy': 6.5, 'safety': 7.0, 'market_share': 17}
        }
        
        colors = ['#E74C3C', '#3498DB', '#27AE60', '#F39C12', '#9B59B6']
        
        for i, (name, data) in enumerate(competitors.items()):
            size = max(100, data['market_share'] * 10) if data['market_share'] > 0 else 200
            ax1.scatter(data['efficacy'], data['safety'], s=size, 
                       color=colors[i], alpha=0.7, label=name)
        
        ax1.set_xlabel('Efficacy Score')
        ax1.set_ylabel('Safety Score')
        ax1.set_title('Efficacy vs Safety Positioning')
        ax1.legend()
        ax1.grid(True, alpha=0.3)
        
        # Plot 2: Development timeline comparison
        ax2 = axes[0, 1]
        
        development_data = {
            'Our Drug': {'phase': 'Preclinical', 'timeline': 2025},
            'Competitor A': {'phase': 'Phase III', 'timeline': 2024},
            'Competitor B': {'phase': 'Phase II', 'timeline': 2026},
            'Competitor C': {'phase': 'Approved', 'timeline': 2020},
            'Generic': {'phase': 'Approved', 'timeline': 2018}
        }
        
        phases = ['Preclinical', 'Phase I', 'Phase II', 'Phase III', 'Approved']
        phase_colors = ['#E74C3C', '#F39C12', '#3498DB', '#27AE60', '#2ECC71']
        
        for i, (name, data) in enumerate(development_data.items()):
            phase_idx = phases.index(data['phase'])
            ax2.scatter(data['timeline'], phase_idx, s=150, 
                       color=phase_colors[phase_idx], alpha=0.8)
            ax2.text(data['timeline'], phase_idx + 0.1, name, 
                    ha='center', va='bottom', fontsize=9)
        
        ax2.set_xlabel('Year')
        ax2.set_ylabel('Development Phase')
        ax2.set_title('Development Timeline Comparison')
        ax2.set_yticks(range(len(phases)))
        ax2.set_yticklabels(phases)
        ax2.grid(True, alpha=0.3)
        
        # Plot 3: Market share projection
        ax3 = axes[1, 0]
        
        years = [2025, 2026, 2027, 2028, 2029, 2030]
        market_projections = {
            'Our Drug': [0, 5, 15, 25, 35, 40],
            'Competitor A': [35, 32, 28, 25, 22, 20],
            'Competitor B': [28, 30, 30, 28, 25, 22],
            'Competitor C': [20, 18, 15, 12, 10, 8],
            'Generic': [17, 15, 12, 10, 8, 10]
        }
        
        for i, (name, projections) in enumerate(market_projections.items()):
            ax3.plot(years, projections, marker='o', linewidth=2, 
                    color=colors[i], label=name)
        
        ax3.set_xlabel('Year')
        ax3.set_ylabel('Market Share (%)')
        ax3.set_title('Market Share Projections')
        ax3.legend()
        ax3.grid(True, alpha=0.3)
        
        # Plot 4: Pricing analysis
        ax4 = axes[1, 1]
        
        pricing_data = {
            'Our Drug (Projected)': 250,
            'Competitor A': 320,
            'Competitor B': 280,
            'Competitor C': 380,
            'Generic': 85
        }
        
        names = list(pricing_data.keys())
        prices = list(pricing_data.values())
        
        bars = ax4.bar(range(len(names)), prices, color=colors)
        ax4.set_xlabel('Competitor')
        ax4.set_ylabel('Price