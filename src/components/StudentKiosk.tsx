import React, { useState } from 'react';
import { 
  Container, Paper, Typography, TextField, 
  Checkbox, FormGroup, FormControlLabel, Button,
  Box, Grid, Divider 
} from '@mui/material';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase-config';
import { symptoms } from '../data/symptoms';

const StudentKiosk = () => {
  const [studentInfo, setStudentInfo] = useState({
    name: '',
    grade: '',
    class: '',
    symptoms: [] as string[],
    description: ''
  });

  const handleSymptomChange = (symptomId: string) => {
    setStudentInfo(prev => ({
      ...prev,
      symptoms: prev.symptoms.includes(symptomId)
        ? prev.symptoms.filter(id => id !== symptomId)
        : [...prev.symptoms, symptomId]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'queue'), {
        ...studentInfo,
        status: 'waiting',
        timestamp: new Date()
      });
      alert('접수가 완료되었습니다. 순서를 기다려주세요.');
      setStudentInfo({
        name: '',
        grade: '',
        class: '',
        symptoms: [],
        description: ''
      });
    } catch (error) {
      console.error('Error:', error);
      alert('접수 중 오류가 발생했습니다.');
    }
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          보건실 방문 접수
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="이름"
                value={studentInfo.name}
                onChange={(e) => setStudentInfo(prev => ({...prev, name: e.target.value}))}
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="학년"
                value={studentInfo.grade}
                onChange={(e) => setStudentInfo(prev => ({...prev, grade: e.target.value}))}
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="반"
                value={studentInfo.class}
                onChange={(e) => setStudentInfo(prev => ({...prev, class: e.target.value}))}
                required
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              증상 선택
            </Typography>
            {symptoms.map(category => (
              <Box key={category.category} sx={{ mb: 3 }}>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  {category.category}
                </Typography>
                <FormGroup>
                  {category.items.map(symptom => (
                    <FormControlLabel
                      key={symptom.id}
                      control={
                        <Checkbox
                          checked={studentInfo.symptoms.includes(symptom.id)}
                          onChange={() => handleSymptomChange(symptom.id)}
                        />
                      }
                      label={symptom.name}
                    />
                  ))}
                </FormGroup>
                <Divider sx={{ mt: 2 }} />
              </Box>
            ))}
          </Box>

          <TextField
            fullWidth
            multiline
            rows={4}
            label="추가 설명"
            value={studentInfo.description}
            onChange={(e) => setStudentInfo(prev => ({...prev, description: e.target.value}))}
            sx={{ mt: 3 }}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            fullWidth
            sx={{ mt: 4 }}
          >
            접수하기
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default StudentKiosk; 