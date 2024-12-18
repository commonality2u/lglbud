import pytest
from fastapi.testclient import TestClient
from pathlib import Path
import os
import tempfile
from ..app.main import app
from ..app.config import settings

client = TestClient(app)

@pytest.fixture
def test_file():
    # Create a temporary test file
    with tempfile.NamedTemporaryFile(suffix='.pdf', delete=False) as tmp:
        tmp.write(b'Test content')
        tmp_path = tmp.name
    yield tmp_path
    # Cleanup after test
    os.unlink(tmp_path)

def test_upload_endpoint_success(test_file):
    # Prepare test data
    with open(test_file, 'rb') as f:
        files = {'file': ('test.pdf', f, 'application/pdf')}
        data = {
            'uploadType': 'legal_filing',
            'caseNumber': 'TEST-123'
        }
        
        response = client.post('/api/upload', files=files, data=data)
        
        assert response.status_code == 202
        assert 'message' in response.json()
        assert 'file_url' in response.json()
        assert 'document' in response.json()
        
        # Verify document data
        document = response.json()['document']
        assert document['title'] == 'test.pdf'
        assert document['type'] == 'legal_filing'
        assert document['case_number'] == 'TEST-123'
        assert document['status'] == 'pending'

def test_upload_endpoint_missing_file():
    data = {
        'uploadType': 'legal_filing',
        'caseNumber': 'TEST-123'
    }
    
    response = client.post('/api/upload', data=data)
    assert response.status_code == 422  # Validation error

def test_upload_endpoint_missing_data(test_file):
    with open(test_file, 'rb') as f:
        files = {'file': ('test.pdf', f, 'application/pdf')}
        
        response = client.post('/api/upload', files=files)
        assert response.status_code == 422  # Validation error

def test_upload_endpoint_invalid_type(test_file):
    with open(test_file, 'rb') as f:
        files = {'file': ('test.pdf', f, 'application/pdf')}
        data = {
            'uploadType': 'invalid_type',  # Invalid type
            'caseNumber': 'TEST-123'
        }
        
        response = client.post('/api/upload', files=files, data=data)
        assert response.status_code == 400  # Bad request

def test_upload_endpoint_large_file():
    # Create a temporary large file (6MB)
    with tempfile.NamedTemporaryFile(suffix='.pdf', delete=False) as tmp:
        tmp.write(b'0' * (6 * 1024 * 1024))  # 6MB of zeros
        tmp_path = tmp.name
    
    try:
        with open(tmp_path, 'rb') as f:
            files = {'file': ('large.pdf', f, 'application/pdf')}
            data = {
                'uploadType': 'legal_filing',
                'caseNumber': 'TEST-123'
            }
            
            response = client.post('/api/upload', files=files, data=data)
            assert response.status_code == 202
            
            # Verify chunked upload was used
            document = response.json()['document']
            assert document['title'] == 'large.pdf'
            assert document['status'] == 'pending'
    finally:
        os.unlink(tmp_path)

def test_upload_endpoint_concurrent_uploads(test_file):
    import concurrent.futures
    
    def upload_file():
        with open(test_file, 'rb') as f:
            files = {'file': ('test.pdf', f, 'application/pdf')}
            data = {
                'uploadType': 'legal_filing',
                'caseNumber': 'TEST-123'
            }
            return client.post('/api/upload', files=files, data=data)
    
    # Test 5 concurrent uploads
    with concurrent.futures.ThreadPoolExecutor(max_workers=5) as executor:
        futures = [executor.submit(upload_file) for _ in range(5)]
        responses = [f.result() for f in futures]
        
        for response in responses:
            assert response.status_code == 202
            assert response.json()['document']['status'] == 'pending'

def test_upload_endpoint_invalid_file_type(test_file):
    with open(test_file, 'rb') as f:
        # Try to upload with incorrect mime type
        files = {'file': ('test.pdf', f, 'text/plain')}
        data = {
            'uploadType': 'legal_filing',
            'caseNumber': 'TEST-123'
        }
        
        response = client.post('/api/upload', files=files, data=data)
        assert response.status_code == 400  # Bad request

def test_upload_endpoint_empty_file():
    # Create empty file
    with tempfile.NamedTemporaryFile(suffix='.pdf', delete=False) as tmp:
        tmp_path = tmp.name
    
    try:
        with open(tmp_path, 'rb') as f:
            files = {'file': ('empty.pdf', f, 'application/pdf')}
            data = {
                'uploadType': 'legal_filing',
                'caseNumber': 'TEST-123'
            }
            
            response = client.post('/api/upload', files=files, data=data)
            assert response.status_code == 400  # Bad request
    finally:
        os.unlink(tmp_path)

def test_upload_endpoint_special_characters(test_file):
    with open(test_file, 'rb') as f:
        files = {'file': ('test@#$%.pdf', f, 'application/pdf')}
        data = {
            'uploadType': 'legal_filing',
            'caseNumber': 'TEST-123'
        }
        
        response = client.post('/api/upload', files=files, data=data)
        assert response.status_code == 202
        assert 'file_url' in response.json()

def test_upload_endpoint_duplicate_upload(test_file):
    # Try to upload the same file twice
    with open(test_file, 'rb') as f:
        files = {'file': ('test.pdf', f, 'application/pdf')}
        data = {
            'uploadType': 'legal_filing',
            'caseNumber': 'TEST-123'
        }
        
        # First upload
        response1 = client.post('/api/upload', files=files, data=data)
        assert response1.status_code == 202
        
        # Reset file pointer
        f.seek(0)
        
        # Second upload
        response2 = client.post('/api/upload', files=files, data=data)
        assert response2.status_code == 202
        
        # Verify different document IDs
        assert response1.json()['document']['id'] != response2.json()['document']['id'] 