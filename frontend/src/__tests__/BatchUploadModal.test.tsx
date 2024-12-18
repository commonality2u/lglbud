import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BatchUploadModal } from '@/components/BatchUploadModal';
import { vi } from 'vitest';

// Mock XMLHttpRequest
const xhrMock = {
  open: vi.fn(),
  send: vi.fn(),
  setRequestHeader: vi.fn(),
  upload: {
    addEventListener: vi.fn(),
  },
  addEventListener: vi.fn(),
};

// Mock file data
const createMockFile = (name: string, size: number, type: string) => {
  return new File([new ArrayBuffer(size)], name, { type });
};

describe('BatchUploadModal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    onUploadComplete: vi.fn(),
    uploadType: 'legal_filing',
    caseNumber: 'CASE-123',
  };

  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks();
    // Mock XMLHttpRequest
    global.XMLHttpRequest = vi.fn(() => xhrMock) as any;
  });

  it('renders correctly', () => {
    render(<BatchUploadModal {...defaultProps} />);
    expect(screen.getByText(/Upload legal filing Documents/i)).toBeInTheDocument();
    expect(screen.getByText(/Click to select files or drag and drop/i)).toBeInTheDocument();
  });

  it('handles file selection', async () => {
    render(<BatchUploadModal {...defaultProps} />);
    
    const file = createMockFile('test.pdf', 1024, 'application/pdf');
    const input = screen.getByLabelText(/Choose files to upload/i);
    
    fireEvent.change(input, { target: { files: [file] } });
    
    expect(screen.getByText('test.pdf')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Upload/i })).not.toBeDisabled();
  });

  it('handles successful upload', async () => {
    render(<BatchUploadModal {...defaultProps} />);
    
    const file = createMockFile('test.pdf', 1024, 'application/pdf');
    const input = screen.getByLabelText(/Choose files to upload/i);
    
    // Mock successful upload response
    const mockResponse = {
      message: 'File uploaded successfully',
      file_url: 'http://example.com/test.pdf',
      document: {
        id: '123',
        title: 'test.pdf',
        storage_path: '/legal_filing/CASE-123/test.pdf',
      },
    };

    // Setup XHR mock for success
    xhrMock.addEventListener.mockImplementation((event, callback) => {
      if (event === 'load') {
        callback({
          target: {
            status: 200,
            responseText: JSON.stringify(mockResponse),
          },
        });
      }
    });

    xhrMock.upload.addEventListener.mockImplementation((event, callback) => {
      if (event === 'progress') {
        callback({
          lengthComputable: true,
          loaded: 1024,
          total: 1024,
        });
      }
    });

    // Trigger file selection and upload
    fireEvent.change(input, { target: { files: [file] } });
    fireEvent.click(screen.getByRole('button', { name: /Upload/i }));

    // Wait for upload to complete
    await waitFor(() => {
      expect(screen.getByText('Pending')).toBeInTheDocument();
    });

    expect(defaultProps.onUploadComplete).toHaveBeenCalled();
  });

  it('handles upload error', async () => {
    render(<BatchUploadModal {...defaultProps} />);
    
    const file = createMockFile('test.pdf', 1024, 'application/pdf');
    const input = screen.getByLabelText(/Choose files to upload/i);

    // Setup XHR mock for error
    xhrMock.addEventListener.mockImplementation((event, callback) => {
      if (event === 'load') {
        callback({
          target: {
            status: 500,
            responseText: JSON.stringify({ detail: 'Server error' }),
          },
        });
      }
    });

    // Trigger file selection and upload
    fireEvent.change(input, { target: { files: [file] } });
    fireEvent.click(screen.getByRole('button', { name: /Upload/i }));

    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText('Server error')).toBeInTheDocument();
    });
  });

  it('handles network error', async () => {
    render(<BatchUploadModal {...defaultProps} />);
    
    const file = createMockFile('test.pdf', 1024, 'application/pdf');
    const input = screen.getByLabelText(/Choose files to upload/i);

    // Setup XHR mock for network error
    xhrMock.addEventListener.mockImplementation((event, callback) => {
      if (event === 'error') {
        callback({});
      }
    });

    // Trigger file selection and upload
    fireEvent.change(input, { target: { files: [file] } });
    fireEvent.click(screen.getByRole('button', { name: /Upload/i }));

    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText('Network error occurred')).toBeInTheDocument();
    });
  });

  it('handles multiple file uploads', async () => {
    render(<BatchUploadModal {...defaultProps} />);
    
    const files = [
      createMockFile('test1.pdf', 1024, 'application/pdf'),
      createMockFile('test2.pdf', 2048, 'application/pdf'),
    ];
    const input = screen.getByLabelText(/Choose files to upload/i);

    // Mock successful upload response
    const mockResponse = {
      message: 'File uploaded successfully',
      file_url: 'http://example.com/test.pdf',
      document: {
        id: '123',
        title: 'test.pdf',
        storage_path: '/legal_filing/CASE-123/test.pdf',
      },
    };

    // Setup XHR mock for success
    xhrMock.addEventListener.mockImplementation((event, callback) => {
      if (event === 'load') {
        callback({
          target: {
            status: 200,
            responseText: JSON.stringify(mockResponse),
          },
        });
      }
    });

    // Trigger file selection and upload
    fireEvent.change(input, { target: { files: files } });
    fireEvent.click(screen.getByRole('button', { name: /Upload/i }));

    // Wait for both uploads to complete
    await waitFor(() => {
      expect(screen.getAllByText('Pending')).toHaveLength(2);
    });
  });

  it('allows removing files before upload', () => {
    render(<BatchUploadModal {...defaultProps} />);
    
    const files = [
      createMockFile('test1.pdf', 1024, 'application/pdf'),
      createMockFile('test2.pdf', 2048, 'application/pdf'),
    ];
    const input = screen.getByLabelText(/Choose files to upload/i);

    // Add files
    fireEvent.change(input, { target: { files: files } });
    expect(screen.getByText('test1.pdf')).toBeInTheDocument();
    expect(screen.getByText('test2.pdf')).toBeInTheDocument();

    // Remove first file
    fireEvent.click(screen.getAllByLabelText(/Remove/i)[0]);
    expect(screen.queryByText('test1.pdf')).not.toBeInTheDocument();
    expect(screen.getByText('test2.pdf')).toBeInTheDocument();
  });
}); 