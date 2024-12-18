import pytest
from fastapi.testclient import TestClient
import tempfile
import os
from ..app.main import app
from ..app.config import settings

@pytest.fixture
def client():
    return TestClient(app)

@pytest.fixture
def test_file():
    # Create a temporary test file
    with tempfile.NamedTemporaryFile(suffix='.pdf', delete=False) as tmp:
        tmp.write(b'Test content')
        tmp_path = tmp.name
    yield tmp_path
    # Cleanup after test
    if os.path.exists(tmp_path):
        os.unlink(tmp_path)

@pytest.fixture
def large_test_file():
    # Create a temporary large file (6MB)
    with tempfile.NamedTemporaryFile(suffix='.pdf', delete=False) as tmp:
        tmp.write(b'0' * (6 * 1024 * 1024))  # 6MB of zeros
        tmp_path = tmp.name
    yield tmp_path
    # Cleanup after test
    if os.path.exists(tmp_path):
        os.unlink(tmp_path)

@pytest.fixture
def empty_test_file():
    # Create an empty file
    with tempfile.NamedTemporaryFile(suffix='.pdf', delete=False) as tmp:
        tmp_path = tmp.name
    yield tmp_path
    # Cleanup after test
    if os.path.exists(tmp_path):
        os.unlink(tmp_path)

@pytest.fixture
def mock_supabase(monkeypatch):
    class MockSupabase:
        def __init__(self):
            self.storage = MockStorage()
            self.table = MockTable()

    class MockStorage:
        def from_(self, bucket):
            return self

        def upload(self, path, file):
            return {"path": path}

        def get_public_url(self, path):
            return f"https://example.com/{path}"

    class MockTable:
        def insert(self, data):
            return self

        def execute(self):
            return {"data": [data]}

    monkeypatch.setattr("app.api.upload.route.supabase", MockSupabase()) 