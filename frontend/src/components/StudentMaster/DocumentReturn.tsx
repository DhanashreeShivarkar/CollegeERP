import React, { useState } from 'react';
import { getStudentById } from '../../api/studentService';
import axiosInstance from '../../api/axios';

type StudentDocument = {
  DOCUMENT_ID: number;
  DOC_NAME: string;
  selected: boolean;
};

const StudentReturnForm = () => {
  const [studentId, setStudentId] = useState('');
  const [name, setName] = useState('');
  const [returnType, setReturnType] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [documents, setDocuments] = useState<StudentDocument[]>([]);

  const fetchDocumentsByStudentId = async (studId: string) => {
    try {
      const res = await axiosInstance.get(`/api/master/document-submission/?student_id=${studId}`);
  
      // Filter out documents that match the given student ID
      const filteredDocs = res.data.filter((doc: any) => doc.STUDENT_ID === studId);
  
      // Map filtered documents
      const docs = filteredDocs.map((doc: any) => ({
        STUDENT_ID: doc.STUDENT_ID,
        DOCUMENT_ID: doc.DOCUMENT_ID,
        DOC_NAME: doc.DOC_NAME || 'Unknown Document',
        selected: false,
      }));
  
      setDocuments(docs);
    } catch (err) {
      console.error('Error fetching submitted documents:', err);
      setDocuments([]);
      alert('Error fetching submitted documents.');
    }
  };
  
  

  const handleBlur = async () => {
    if (!studentId.trim()) return;

    setLoading(true);
    try {
      const student = await getStudentById(studentId);
      if (student && student.NAME) {
        const fullName = `${student.NAME} ${student.PARENT_NAME || ''} ${student.SURNAME || ''}`.trim();
        setName(fullName);
        await fetchDocumentsByStudentId(studentId);
      } else {
        setName('');
        alert('Student not found');
      }
    } catch (error) {
      console.error('Error fetching student:', error);
      alert('Error fetching student');
      setName('');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    const payload = {
      STUDENT_ID: studentId,
      NAME: name,
      TEMPORARY_RETURN: returnType === 'TEMPORARY',
      PERMANENT_RETURN: returnType === 'PERMANENT',
      DOCUMENTS: documents.filter(doc => doc.selected).map(doc => doc.DOCUMENT_ID),
    };

    try {
      await axiosInstance.post('/api/student-return', payload);
      alert('Data saved successfully!');
    } catch (error) {
      console.error('Error saving data:', error);
      alert('Error saving data');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSelectAll = () => {
    const updated = documents.map(doc => ({ ...doc, selected: !selectAll }));
    setDocuments(updated);
    setSelectAll(!selectAll);
  };

  const handleDocSelect = (id: number) => {
    const updated = documents.map(doc =>
      doc.DOCUMENT_ID === id ? { ...doc, selected: !doc.selected } : doc
    );
    setDocuments(updated);
    setSelectAll(updated.every(doc => doc.selected));
  };

  return (
    <div className="container mt-4">
      <div className="card shadow-sm p-4">
        <h4 className="mb-4">Document Return</h4>
        <form>
          <div className="mb-3 d-flex align-items-center gap-4">
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="returnType"
                id="tempReturn"
                value="TEMPORARY"
                checked={returnType === 'TEMPORARY'}
                onChange={(e) => setReturnType(e.target.value)}
              />
              <label className="form-check-label" htmlFor="tempReturn">
                Temporary Return
              </label>
            </div>
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="returnType"
                id="permReturn"
                value="PERMANENT"
                checked={returnType === 'PERMANENT'}
                onChange={(e) => setReturnType(e.target.value)}
              />
              <label className="form-check-label" htmlFor="permReturn">
                Permanent Return
              </label>
            </div>
          </div>

          <div className="mb-3">
            <label htmlFor="studentId" className="form-label">Student ID</label>
            <input
              type="text"
              className="form-control"
              id="studentId"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              onBlur={handleBlur}
              placeholder="Enter Student ID"
            />
          </div>

          <div className="mb-2 d-flex align-items-center">
            <label className="form-label me-2 mb-0">Name:</label>
            <span>{loading ? 'Fetching...' : name}</span>
          </div>

          <div className="d-flex gap-2">
            <button type="button" className="btn btn-primary" onClick={handleSave}>Save</button>
            <button type="button" className="btn btn-secondary" onClick={handlePrint}>Print</button>
          </div>

          {documents.length > 0 && (
            <div className="form-check mb-2" style={{ marginTop: '30px' }}>
              <input
                className="form-check-input"
                type="checkbox"
                id="selectAll"
                checked={selectAll}
                onChange={handleSelectAll}
              />
              <label className="form-check-label" htmlFor="selectAll">
                Select All
              </label>
            </div>
          )}

          <div className="mb-4">
            <table className="table table-bordered table-striped">
              <thead className="table-light">
                <tr>
                  <th style={{ width: '10%' }}>Select</th>
                  <th>Documents Submitted</th>
                  <th style={{ width: '20%' }}>Document ID</th>
                </tr>
              </thead>
              <tbody>
                {documents.map((doc) => (
                  <tr key={doc.DOCUMENT_ID}>
                    <td>
                      <input
                        type="checkbox"
                        checked={doc.selected}
                        onChange={() => handleDocSelect(doc.DOCUMENT_ID)}
                      />
                    </td>
                    <td>{doc.DOC_NAME}</td>
                    <td>{doc.DOCUMENT_ID}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentReturnForm;
function setSubmittedDocs(docIds: any) {
  throw new Error('Function not implemented.');
}

