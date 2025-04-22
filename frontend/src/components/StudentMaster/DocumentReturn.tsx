import React, { useState } from 'react';
import { getStudentById } from '../../api/studentService';
import axiosInstance from '../../api/axios';

type StudentDocument = {
  DOC_NAME: string;
  DOCUMENT_ID: number;
  RETURN: string; // added
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
      const filteredDocs = res.data.filter((doc: any) => doc.STUDENT_ID === studId);
      const docs = filteredDocs.map((doc: any) => ({
        DOC_NAME: doc.DOC_NAME || 'Unknown Document',
        DOCUMENT_ID: doc.DOCUMENT_ID,
        RETURN: doc.RETURN || 'N', // include RETURN value
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
    try {
      const selectedDocs = documents.filter(doc => doc.selected && doc.RETURN === 'N'); // only update 'N'
      await Promise.all(
        selectedDocs.map(doc =>
          axiosInstance.patch(`/api/master/document-submission/${doc.DOCUMENT_ID}/`, {
            RETURN: 'Y',
            STUDENT_ID: studentId,
            DOC_NAME: doc.DOC_NAME,
          })
        )
      );
  
      alert('Selected documents updated as returned!');
  
      // Optionally refresh list after update:
      await fetchDocumentsByStudentId(studentId);
    } catch (error) {
      console.error('Error updating documents:', error);
      alert('Error updating documents');
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

  const handleDocSelect = (index: number) => {
    const updated = documents.map((doc, idx) =>
      idx === index ? { ...doc, selected: !doc.selected } : doc
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
            <div className="form-check mb-2 mt-4">
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
                </tr>
              </thead>
              <tbody>
                {documents.map((doc, index) => (
                  <tr key={index}>
                    <td>
                      <input
                        type="checkbox"
                        checked={doc.selected}
                        onChange={() => handleDocSelect(index)}
                      />
                    </td>
                    <td>{doc.DOC_NAME}</td>
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
