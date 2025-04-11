import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axios';
import {
  TextField,
  Paper,
  Typography,
  CircularProgress,
  Grid,
  Checkbox,
  Button,
  RadioGroup,
  Radio,
  FormControlLabel,
  FormLabel,
} from '@mui/material';

interface StudentData {
  STUDENT_ID?: string;
  NAME: string;
  SURNAME: string;
  INSTITUTE: string;
  BRANCH_ID: string;
  YEAR_SEM_ID: string;
  ADMISSION_CATEGORY: string;
  ADMN_QUOTA_ID: string;
  CASTE: string;
  [key: string]: any;
}

interface ChecklistDoc {
  RECORD_ID: number;
  NAME: string;
  IS_MANDATORY: boolean;
}

const StudentDocument: React.FC = () => {
  const [studentId, setStudentId] = useState('');
  const [student, setStudent] = useState<StudentData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [branchName, setBranchName] = useState('');
  const [yearSemName, setYearSemName] = useState('');
  const [quotaName, setQuotaName] = useState('');

  const [checklistDocs, setChecklistDocs] = useState<ChecklistDoc[]>([]);
  const [selectedDocs, setSelectedDocs] = useState<number[]>([]);
  const [submittedDocs, setSubmittedDocs] = useState<number[]>([]);

  const [docFilter, setDocFilter] = useState<'submitted' | 'not_submitted' | ''>('');

  const fetchChecklistDocuments = async () => {
    try {
      const response = await axiosInstance.get('/api/master/checklist');
      setChecklistDocs(response.data || []);
    } catch (err) {
      console.error('Failed to fetch checklist documents:', err);
    }
  };

  useEffect(() => {
    fetchChecklistDocuments();
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (studentId.trim()) {
        fetchStudentById();
      } else {
        setStudent(null);
        setError(null);
      }
    }, 600);
    return () => clearTimeout(delayDebounce);
  }, [studentId]);

  const fetchSubmittedDocs = async (studId: string) => {
    try {
      const res = await axiosInstance.get(`/api/master/document-submission/?student_id=${studId}`);
      const docIds = res.data.map((doc: any) => doc.DOCUMENT_ID);
      setSubmittedDocs(docIds);
    } catch (err) {
      console.error('Error fetching submitted documents:', err);
      setSubmittedDocs([]);
    }
  };

  const fetchStudentById = async () => {
    setLoading(true);
    setStudent(null);
    setError(null);
    setBranchName('');
    setYearSemName('');
    setQuotaName('');
    setSelectedDocs([]);
    setSubmittedDocs([]);

    try {
      const response = await axiosInstance.get(`/api/student/${studentId}/`);
      if (response.data) {
        setStudent(response.data);
        fetchSubmittedDocs(response.data.STUDENT_ID);
      } else {
        setError('Student not found');
      }
    } catch (err) {
      setError('Student not found');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (student) {
      if (student.BRANCH_ID) {
        axiosInstance
          .get(`/api/master/branch/${student.BRANCH_ID}/`)
          .then((res) => setBranchName(res.data.name || res.data.NAME || 'Unknown Branch'))
          .catch(() => setBranchName('Unknown Branch'));
      }

      if (student.YEAR_SEM_ID) {
        axiosInstance
          .get(`/api/master/year/${student.YEAR_SEM_ID}/`)
          .then((res) => setYearSemName(res.data.name || res.data.YEAR || 'Unknown Year/Sem'))
          .catch(() => setYearSemName('Unknown Year/Sem'));
      }

      if (student.ADMN_QUOTA_ID) {
        axiosInstance
          .get(`/api/master/quota/${student.ADMN_QUOTA_ID}/`)
          .then((res) => setQuotaName(res.data.name || res.data.NAME || 'Unknown Quota'))
          .catch(() => setQuotaName('Unknown Quota'));
      }
    }
  }, [student]);

  const handleCheckboxChange = (id: number) => {
    setSelectedDocs((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((docId) => docId !== id)
        : [...prevSelected, id]
    );
  };

  const handleSubmitDocuments = async () => {
    if (!student?.STUDENT_ID) return;

    try {
      const documentsToSubmit = selectedDocs.map((docId) => {
        const doc = checklistDocs.find((d) => d.RECORD_ID === docId);
        return {
          STUDENT_ID: student.STUDENT_ID,
          DOCUMENT_ID: doc?.RECORD_ID,
          DOC_NAME: doc?.NAME,
        };
      });

      await Promise.all(
        documentsToSubmit.map((doc) =>
          axiosInstance.post('/api/master/document-submission/', doc)
        )
      );

      alert('✅ Documents submitted successfully!');
      fetchSubmittedDocs(student.STUDENT_ID); // Refresh after submission
      setSelectedDocs([]);
    } catch (err: any) {
      if (err.response) {
        const status = err.response.status;
        if (status === 400) {
          alert('⚠️ Bad Request: Please check the data being submitted.');
        } else if (status === 409) {
          alert('❌ Document already submitted.');
        } else {
          alert(`❌ Error ${status}: Something went wrong.`);
        }
      } else {
        alert('❌ Unknown error occurred.');
      }
    }
  };

  return (
    <Paper elevation={3} sx={{ padding: 4, borderRadius: 3, maxWidth: 1000, margin: 'auto', marginTop: 4 }}>
      <Typography variant="h5" gutterBottom>
        Student Information Lookup
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FormLabel component="legend">Filter by Submission Status</FormLabel>
          <RadioGroup
            row
            value={docFilter}
            onChange={(e) => setDocFilter(e.target.value as 'submitted' | 'not_submitted' | '')}
          >
            <FormControlLabel value="submitted" control={<Radio />} label="Submitted" />
            <FormControlLabel value="not_submitted" control={<Radio />} label="Not Submitted" />
            <FormControlLabel value="" control={<Radio />} label="All" />
          </RadioGroup>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Enter Student ID"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            variant="outlined"
            fullWidth
          />
        </Grid>

        {loading && (
          <Grid item xs={12}>
            <CircularProgress />
          </Grid>
        )}

        {error && (
          <Grid item xs={12}>
            <Typography color="error">{error}</Typography>
          </Grid>
        )}

        {student && (
          <>
            <Grid item xs={12} sm={6}>
              <TextField label="Full Name" value={`${student.NAME} ${student.SURNAME}`} fullWidth InputProps={{ readOnly: true }} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Institute" value={student.INSTITUTE} fullWidth InputProps={{ readOnly: true }} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Branch" value={branchName} fullWidth InputProps={{ readOnly: true }} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Year / Semester" value={yearSemName} fullWidth InputProps={{ readOnly: true }} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Category" value={student.CASTE} fullWidth InputProps={{ readOnly: true }} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Quota" value={quotaName} fullWidth InputProps={{ readOnly: true }} />
            </Grid>
          </>
        )}

        <Grid item xs={12} sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Checklist Documents
          </Typography>

          {checklistDocs.length === 0 ? (
            <Typography>No documents available.</Typography>
          ) : (
            <Paper elevation={1} sx={{ p: 2 }}>
              <Grid container sx={{ fontWeight: 'bold', borderBottom: '2px solid #ccc', pb: 1 }}>
                <Grid item xs={1}>ADD</Grid>
                <Grid item xs={7}>Document Name</Grid>
                <Grid item xs={4}>Mandatory</Grid>
              </Grid>

              {checklistDocs
                .filter((doc) => {
                  if (docFilter === 'submitted') {
                    return submittedDocs.includes(doc.RECORD_ID);
                  } else if (docFilter === 'not_submitted') {
                    return !submittedDocs.includes(doc.RECORD_ID);
                  }
                  return true;
                })
                .map((doc) => (
                  <Grid
                    container
                    key={doc.RECORD_ID}
                    alignItems="center"
                    sx={{ borderBottom: '1px solid #eee', py: 1 }}
                  >
                    <Grid item xs={1}>
                      <Checkbox
                        checked={selectedDocs.includes(doc.RECORD_ID)}
                        onChange={() => handleCheckboxChange(doc.RECORD_ID)}
                      />
                    </Grid>
                    <Grid item xs={7}>
                      <Typography>{doc.NAME}</Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography color={doc.IS_MANDATORY ? 'error' : 'textSecondary'}>
                        {doc.IS_MANDATORY ? 'Mandatory' : 'Optional'}
                      </Typography>
                    </Grid>
                  </Grid>
                ))}

              <Button
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
                onClick={handleSubmitDocuments}
                disabled={!student || selectedDocs.length === 0}
              >
                Submit Documents
              </Button>
            </Paper>
          )}
        </Grid>
      </Grid>
    </Paper>
  );
};

export default StudentDocument;
