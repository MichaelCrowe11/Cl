"""
Crowe Logic GPT Routes for the Mycology Research Platform.

This module provides web routes for interacting with Crowe Logic GPT,
including mycology research, species identification, and protocol design.
"""

import json
import logging
from datetime import datetime
from flask import Blueprint, render_template, request, redirect, url_for, jsonify, flash, session
from flask_login import login_required, current_user

from crowe_logic_gpt import get_crowe_response

logger = logging.getLogger(__name__)
ai_bp = Blueprint('ai', __name__, url_prefix='/ai')


@ai_bp.route('/chat', methods=['POST'])
def chat():
    """Chat endpoint for Crowe Logic GPT"""
    try:
        data = request.get_json()
        if not data or 'message' not in data:
            return jsonify({'error': 'Message is required'}), 400
        
        message = data['message']
        config = data.get('config', {})
        
        # Get response from Crowe Logic GPT
        response = get_crowe_response(message, config)
        
        # Log the interaction
        logger.info(f"Crowe Logic GPT query: {message[:100]}...")
        
        return jsonify({
            'response': response,
            'timestamp': datetime.now().isoformat(),
            'model': 'crowe-logic-gpt'
        })
        
    except Exception as e:
        logger.error(f"Error in chat endpoint: {str(e)}")
        return jsonify({
            'error': 'Internal server error',
            'message': 'Unable to process your research query at this time.'
        }), 500


@ai_bp.route('/health', methods=['GET'])
def health():
    """Health check endpoint for Crowe Logic GPT"""
    return jsonify({
        'status': 'healthy',
        'service': 'crowe-logic-gpt',
        'timestamp': datetime.now().isoformat()
    })


@ai_bp.route('/analyze-sample/<int:sample_id>', methods=['GET', 'POST'])
def analyze_sample_route(sample_id):
    """Analyze a sample using AI."""
    sample = Sample.query.get_or_404(sample_id)
    
    if request.method == 'POST':
        try:
            # Prepare sample data for analysis
            sample_data = {
                'id': sample.id,
                'name': sample.name,
                'species': sample.species,
                'collection_date': sample.collection_date.isoformat() if sample.collection_date else None,
                'location': sample.location,
                'sample_metadata': sample.sample_metadata,
                'compounds': [
                    {
                        'id': compound.id,
                        'name': compound.name,
                        'formula': compound.formula,
                        'molecular_weight': compound.molecular_weight,
                        'bioactivity_index': compound.bioactivity_index,
                        'concentration': compound.concentration
                    }
                    for compound in sample.compounds
                ]
            }
            
            # Get analysis from AI assistant
            analysis_result = analyze_sample(sample_data)
            
            # Create a record of this query
            query = AIAssistantQuery()
            query.query_type = 'sample_analysis'
            query.input_data = json.dumps(sample_data)
            query.result_data = json.dumps(analysis_result)
            query.sample_id = sample.id
            query.user_id = current_user.id if hasattr(current_user, 'is_authenticated') and current_user.is_authenticated else None
            db.session.add(query)
            db.session.commit()
            
            return render_template(
                'ai/sample_analysis_result.html',
                sample=sample,
                analysis_result=analysis_result,
                query_id=query.id
            )
            
        except Exception as e:
            logger.error(f"Error analyzing sample with AI: {str(e)}")
            flash(f"Error analyzing sample: {str(e)}", "error")
    
    return render_template('ai/analyze_sample.html', sample=sample)


@ai_bp.route('/chat', methods=['POST'])
def chat():
    """Generic chat endpoint to interact with the AI Assistant."""
    data = request.get_json()
    if not data or not data.get('message'):
        return jsonify({"error": "Message is required."}), 400

    message = data['message']
    
    # For simplicity, we'll use a generic prompt structure.
    # In a real application, you might have more sophisticated prompt engineering.
    try:
        assistant = AIAssistant()
        # We can use generate_research_hypothesis as a generic text-generation endpoint for now
        # or create a new method in AIAssistant for generic chat.
        # Let's assume a simple prompt for now.
        prompt = f"""The user has sent the following message. Please provide a helpful and relevant response.

User message: {message}
"""
        
        # Using a generic method in AIAssistant. Let's use `generate_research_hypothesis`
        # as a stand-in for a generic chat method.
        context_data = {"query": prompt}
        response = assistant.generate_research_hypothesis(context_data)

        if response.get("error"):
            raise Exception(response["error"])

        return jsonify({"response": response.get("raw_response")})

    except Exception as e:
        logger.error(f"Error in chat endpoint: {str(e)}")
        return jsonify({"error": "An error occurred while processing your request."}), 500


@ai_bp.route('/generate-hypothesis', methods=['GET', 'POST'])
def generate_hypothesis_route():
    """Generate research hypotheses using AI."""
    if request.method == 'POST':
        try:
            # Get form data
            research_area = request.form.get('research_area')
            existing_findings = request.form.get('existing_findings', '').strip().split('\n')
            objectives = request.form.get('objectives', '').strip().split('\n')
            available_methods = request.form.get('available_methods', '').strip().split('\n')
            
            # Filter out empty lines
            existing_findings = [f for f in existing_findings if f.strip()]
            objectives = [o for o in objectives if o.strip()]
            available_methods = [m for m in available_methods if m.strip()]
            
            # Prepare context data
            context_data = {
                'research_area': research_area,
                'existing_findings': existing_findings,
                'objectives': objectives,
                'available_methods': available_methods
            }
            
            # Get hypotheses from AI assistant
            hypothesis_result = generate_hypothesis(context_data)
            
            # Create a record of this query
            query = AIAssistantQuery()
            query.query_type = 'hypothesis_generation'
            query.input_data = json.dumps(context_data)
            query.result_data = json.dumps(hypothesis_result)
            query.user_id = current_user.id if hasattr(current_user, 'is_authenticated') and current_user.is_authenticated else None
            db.session.add(query)
            db.session.commit()
            
            return render_template(
                'ai/hypothesis_result.html',
                context_data=context_data,
                hypothesis_result=hypothesis_result,
                query_id=query.id
            )
            
        except Exception as e:
            logger.error(f"Error generating hypotheses with AI: {str(e)}")
            flash(f"Error generating hypotheses: {str(e)}", "error")
    
    return render_template('ai/generate_hypothesis.html')


@ai_bp.route('/literature-insights', methods=['GET', 'POST'])
def literature_insights():
    """Generate insights from literature using AI."""
    if request.method == 'POST':
        try:
            # Get form data
            reference_ids = request.form.getlist('reference_ids')
            
            if not reference_ids:
                flash("Please select at least one literature reference", "error")
                return redirect(url_for('ai.literature_insights'))
            
            # Get literature data
            literature_data = []
            for ref_id in reference_ids:
                ref = LiteratureReference.query.get(ref_id)
                if ref:
                    ref_data = {
                        'id': ref.id,
                        'title': ref.title,
                        'authors': ref.authors,
                        'journal': ref.journal,
                        'year': ref.year,
                        'abstract': ref.abstract,
                        'url': ref.url,
                        'keywords': ref.reference_metadata.get('keywords', []) if ref.reference_metadata else []
                    }
                    literature_data.append(ref_data)
            
            # Create AI assistant and analyze
            assistant = AIAssistant()
            analysis_result = assistant.analyze_research_literature(literature_data)
            
            # Create a record of this query
            query = AIAssistantQuery(
                query_type='literature_analysis',
                input_data=json.dumps({'references': [ref['id'] for ref in literature_data]}),
                result_data=json.dumps(analysis_result),
                user_id=current_user.id if hasattr(current_user, 'is_authenticated') and current_user.is_authenticated else None
            )
            db.session.add(query)
            db.session.commit()
            
            return render_template(
                'ai/literature_insights_result.html',
                literature_data=literature_data,
                analysis_result=analysis_result,
                query_id=query.id
            )
            
        except Exception as e:
            logger.error(f"Error analyzing literature with AI: {str(e)}")
            flash(f"Error analyzing literature: {str(e)}", "error")
    
    # Get all literature references for selection
    references = LiteratureReference.query.order_by(LiteratureReference.year.desc()).all()
    
    return render_template('ai/literature_insights.html', references=references)


@ai_bp.route('/code-generator', methods=['GET', 'POST'])
def code_generator():
    """Generate code samples using AI."""
    if request.method == 'POST':
        try:
            # Get form data
            task_description = request.form.get('task_description')
            language = request.form.get('language', 'python')
            
            if not task_description:
                flash("Please enter a task description", "error")
                return redirect(url_for('ai.code_generator'))
            
            # Generate code
            code_result = generate_code(task_description, language)
            
            # Create a record of this query
            query = AIAssistantQuery(
                query_type='code_generation',
                input_data=json.dumps({
                    'task_description': task_description,
                    'language': language
                }),
                result_data=json.dumps(code_result),
                user_id=current_user.id if hasattr(current_user, 'is_authenticated') and current_user.is_authenticated else None
            )
            db.session.add(query)
            db.session.commit()
            
            return render_template(
                'ai/code_result.html',
                task_description=task_description,
                language=language,
                code_result=code_result,
                query_id=query.id
            )
            
        except Exception as e:
            logger.error(f"Error generating code with AI: {str(e)}")
            flash(f"Error generating code: {str(e)}", "error")
    
    # Languages supported
    languages = ['python', 'r', 'sql', 'javascript', 'bash']
    
    return render_template('ai/code_generator.html', languages=languages)


@ai_bp.route('/compound-analyzer', methods=['GET', 'POST'])
def compound_analyzer():
    """Analyze compounds using AI."""
    if request.method == 'POST':
        try:
            # Get form data
            compound_ids = request.form.getlist('compound_ids')
            
            if not compound_ids:
                flash("Please select at least one compound", "error")
                return redirect(url_for('ai.compound_analyzer'))
            
            # Get compound data
            compound_data = []
            for comp_id in compound_ids:
                compound = Compound.query.get(comp_id)
                if compound:
                    comp_data = {
                        'id': compound.id,
                        'name': compound.name,
                        'formula': compound.formula,
                        'molecular_weight': compound.molecular_weight,
                        'bioactivity_index': compound.bioactivity_index,
                        'concentration': compound.concentration,
                        'compound_metadata': compound.compound_metadata
                    }
                    compound_data.append(comp_data)
            
            # Create AI assistant and analyze
            assistant = AIAssistant()
            analysis_result = assistant.analyze_compounds(compound_data)
            
            # Create a record of this query
            query = AIAssistantQuery(
                query_type='compound_analysis',
                input_data=json.dumps({'compounds': [comp['id'] for comp in compound_data]}),
                result_data=json.dumps(analysis_result),
                user_id=current_user.id if hasattr(current_user, 'is_authenticated') and current_user.is_authenticated else None
            )
            db.session.add(query)
            db.session.commit()
            
            return render_template(
                'ai/compound_analysis_result.html',
                compound_data=compound_data,
                analysis_result=analysis_result,
                query_id=query.id
            )
            
        except Exception as e:
            logger.error(f"Error analyzing compounds with AI: {str(e)}")
            flash(f"Error analyzing compounds: {str(e)}", "error")
    
    # Get all compounds grouped by sample
    samples_with_compounds = Sample.query.filter(Sample.compounds.any()).all()
    
    return render_template('ai/compound_analyzer.html', samples_with_compounds=samples_with_compounds)


@ai_bp.route('/query-history')
@login_required
def query_history():
    """View AI query history."""
    queries = AIAssistantQuery.query.filter_by(
        user_id=current_user.id
    ).order_by(AIAssistantQuery.created_at.desc()).all()
    
    return render_template('ai/query_history.html', queries=queries)


@ai_bp.route('/query/<int:query_id>')
def view_query(query_id):
    """View a specific AI query result."""
    query = AIAssistantQuery.query.get_or_404(query_id)
    
    # Check permissions
    if query.user_id and (not hasattr(current_user, 'is_authenticated') or 
                         not current_user.is_authenticated or 
                         query.user_id != current_user.id):
        flash("You don't have permission to view this query", "error")
        return redirect(url_for('ai.ai_dashboard'))
    
    # Get related data
    sample = None
    if query.sample_id:
        sample = Sample.query.get(query.sample_id)
    
    return render_template(
        'ai/view_query.html',
        query=query,
        sample=sample,
        input_data=json.loads(query.input_data) if query.input_data else {},
        result_data=json.loads(query.result_data) if query.result_data else {}
    )


@ai_bp.route('/api/analyze-sample/<int:sample_id>', methods=['POST'])
def api_analyze_sample(sample_id):
    """API endpoint to analyze a sample using AI."""
    sample = Sample.query.get_or_404(sample_id)
    
    try:
        # Prepare sample data for analysis
        sample_data = {
            'id': sample.id,
            'name': sample.name,
            'species': sample.species,
            'collection_date': sample.collection_date.isoformat() if sample.collection_date else None,
            'location': sample.location,
            'sample_metadata': sample.sample_metadata,
            'compounds': [
                {
                    'id': compound.id,
                    'name': compound.name,
                    'formula': compound.formula,
                    'molecular_weight': compound.molecular_weight,
                    'bioactivity_index': compound.bioactivity_index,
                    'concentration': compound.concentration
                }
                for compound in sample.compounds
            ]
        }
        
        # Get analysis from AI assistant
        analysis_result = analyze_sample(sample_data)
        
        # Create a record of this query
        query = AIAssistantQuery(
            query_type='sample_analysis_api',
            input_data=json.dumps(sample_data),
            result_data=json.dumps(analysis_result),
            sample_id=sample.id,
            user_id=current_user.id if hasattr(current_user, 'is_authenticated') and current_user.is_authenticated else None
        )
        db.session.add(query)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'sample_id': sample.id,
            'query_id': query.id,
            'result': analysis_result
        })
        
    except Exception as e:
        logger.error(f"API error analyzing sample with AI: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500