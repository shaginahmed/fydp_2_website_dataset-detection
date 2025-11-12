from flask import Flask, request, jsonify
from flask_cors import CORS
import uuid
from datetime import datetime
import random

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

# Mock data store (in production, this would be Firestore)
mock_tests = []

def generate_mock_stats():
    """Generate realistic mock statistics"""
    if len(mock_tests) == 0:
        # Default mock data when no tests exist
        return {
            'totalTests': 0,
            'percentageDepressed': 0,
            'percentageNotDepressed': 0,
            'percentageNeutral': 0,
            'statusDistribution': [
                {'name': 'Depressed', 'value': 0},
                {'name': 'Not Depressed', 'value': 0},
                {'name': 'Neutral', 'value': 0}
            ],
            'ageDistribution': [
                {'ageGroup': '18-25', 'count': 0},
                {'ageGroup': '26-40', 'count': 0},
                {'ageGroup': '41+', 'count': 0}
            ]
        }
    
    # Calculate real stats from mock_tests
    total = len(mock_tests)
    
    # Mock classification (in production, this would come from ML model)
    depressed = int(total * 0.35)
    not_depressed = int(total * 0.45)
    neutral = total - depressed - not_depressed
    
    # Age group distribution
    age_groups = {'18-25': 0, '26-40': 0, '41+': 0}
    for test in mock_tests:
        age = test.get('age', 25)
        if 18 <= age <= 25:
            age_groups['18-25'] += 1
        elif 26 <= age <= 40:
            age_groups['26-40'] += 1
        else:
            age_groups['41+'] += 1
    
    return {
        'totalTests': total,
        'percentageDepressed': round((depressed / total) * 100, 1) if total > 0 else 0,
        'percentageNotDepressed': round((not_depressed / total) * 100, 1) if total > 0 else 0,
        'percentageNeutral': round((neutral / total) * 100, 1) if total > 0 else 0,
        'statusDistribution': [
            {'name': 'Depressed', 'value': depressed},
            {'name': 'Not Depressed', 'value': not_depressed},
            {'name': 'Neutral', 'value': neutral}
        ],
        'ageDistribution': [
            {'ageGroup': '18-25', 'count': age_groups['18-25']},
            {'ageGroup': '26-40', 'count': age_groups['26-40']},
            {'ageGroup': '41+', 'count': age_groups['41+']},
        ]
    }

@app.route('/api/stats', methods=['GET'])
def get_stats():
    """
    GET /api/stats
    Returns aggregate statistics for the dashboard
    """
    try:
        stats = generate_mock_stats()
        return jsonify(stats), 200
    except Exception as e:
        print(f"Error generating stats: {str(e)}")
        return jsonify({'error': 'Failed to generate statistics'}), 500

@app.route('/api/submit_test', methods=['POST'])
def submit_test():
    """
    POST /api/submit_test
    Accepts user data and audio blob, generates test ID
    
    Expected JSON payload:
    {
        "fullName": "string",
        "age": int,
        "question1": int (0-3),
        "question2": int (0-3),
        "question3": int (0-3),
        "audioData": "base64_string"
    }
    """
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['fullName', 'age', 'question1', 'question2', 'question3', 'audioData']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        # Validate age
        if data['age'] < 18:
            return jsonify({'error': 'Age must be 18 or older'}), 400
        
        # Generate unique test ID
        test_id = str(uuid.uuid4())
        
        # Create test record (without storing full audio blob in mock store)
        test_record = {
            'testId': test_id,
            'fullName': data['fullName'],
            'age': data['age'],
            'question1': data['question1'],
            'question2': data['question2'],
            'question3': data['question3'],
            'status': 'processing',
            'timestamp': datetime.now().isoformat(),
            'audioSize': len(data['audioData'])  # Store only size, not full audio
        }
        
        # Add to mock store
        mock_tests.append(test_record)
        
        # Log successful receipt
        print(f"✓ Test received successfully")
        print(f"  Test ID: {test_id}")
        print(f"  Name: {data['fullName']}")
        print(f"  Age: {data['age']}")
        print(f"  Audio blob size: {len(data['audioData'])} characters")
        print(f"  PHQ-2 Scores: Q1={data['question1']}, Q2={data['question2']}, Q3={data['question3']}")
        print(f"  Status: Processing (simulated)")
        print(f"  Total tests in system: {len(mock_tests)}")
        print("-" * 60)
        
        # In production, here you would:
        # 1. Store audio in Firebase Storage
        # 2. Add document to Firestore: /artifacts/{appId}/public/data/voice_tests
        # 3. Trigger ML model processing
        
        # Return success response
        return jsonify({
            'testId': test_id,
            'status': 'processing',
            'message': 'Test submitted successfully'
        }), 201
        
    except Exception as e:
        print(f"Error submitting test: {str(e)}")
        return jsonify({'error': 'Failed to submit test'}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'totalTests': len(mock_tests)
    }), 200

@app.route('/', methods=['GET'])
def index():
    """Root endpoint"""
    return jsonify({
        'message': 'Depression Detection API',
        'version': '1.0.0',
        'endpoints': {
            '/api/stats': 'GET - Retrieve dashboard statistics',
            '/api/submit_test': 'POST - Submit voice test',
            '/api/health': 'GET - Health check'
        }
    }), 200

if __name__ == '__main__':
    print("=" * 60)
    print("Depression Detection Flask API Server")
    print("=" * 60)
    print("Server starting on http://127.0.0.1:5000")
    print("Endpoints available:")
    print("  GET  /api/stats       - Dashboard statistics")
    print("  POST /api/submit_test - Submit voice test")
    print("  GET  /api/health      - Health check")
    print("=" * 60)
    app.run(debug=True, host='127.0.0.1', port=5000) 
