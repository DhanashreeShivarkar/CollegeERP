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

  const fetchDocumentsByStudentId = async (studentId: string) => {
    try {
      const response = await axiosInstance.get(`/api/master/document-submission/${studentId}`);
      if (response.data && Array.isArray(response.data)) {
        const updatedDocs = response.data.map((doc: any) => ({
          ...doc,
          selected: false,
        }));
        setDocuments(updatedDocs);
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
      alert('Failed to fetch documents for the student.');
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
