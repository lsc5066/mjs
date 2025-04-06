import React, { useEffect, useState } from 'react';
import {
  Container, Paper, Typography, Card, CardContent,
  Button, Grid, Chip, Box
} from '@mui/material';
import { collection, onSnapshot, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase-config';
import { symptoms } from '../data/symptoms';

interface QueueItem {
  id: string;
  name: string;
  grade: string;
  class: string;
  symptoms: string[];
  description: string;
  status: 'waiting' | 'in-progress' | 'completed';
  timestamp: any;
}

const TeacherDashboard = () => {
  const [queue, setQueue] = useState<QueueItem[]>([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'queue'), (snapshot) => {
      const queueData = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() } as QueueItem))
        .sort((a, b) => a.timestamp.seconds - b.timestamp.seconds);
      setQueue(queueData);
    });

    return () => unsubscribe();
  }, []);

  const handleStatusUpdate = async (studentId: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, 'queue', studentId), {
        status: newStatus
      });
    } catch (error) {
      console.error('Error:', error);
      alert('상태 업데이트 중 오류가 발생했습니다.');
    }
  };

  const getSymptomName = (symptomId: string) => {
    for (const category of symptoms) {
      const symptom = category.items.find(item => item.id === symptomId);
      if (symptom) return symptom.name;
    }
    return symptomId;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'waiting': return 'warning';
      case 'in-progress': return 'info';
      case 'completed': return 'success';
      default: return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'waiting': return '대기 중';
      case 'in-progress': return '진료 중';
      case 'completed': return '완료';
      default: return status;
    }
  };

  return (
    <Container maxWidth="lg">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          보건실 대기 현황
        </Typography>
        <Grid container spacing={3}>
          {queue.map(student => (
            <Grid item xs={12} md={6} key={student.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6">
                      {student.grade}학년 {student.class}반 {student.name}
                    </Typography>
                    <Chip
                      label={getStatusText(student.status)}
                      color={getStatusColor(student.status)}
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    증상: {student.symptoms.map(getSymptomName).join(', ')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    설명: {student.description}
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    {student.status === 'waiting' && (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleStatusUpdate(student.id, 'in-progress')}
                        sx={{ mr: 1 }}
                      >
                        진료 시작
                      </Button>
                    )}
                    {student.status === 'in-progress' && (
                      <Button
                        variant="contained"
                        color="success"
                        onClick={() => handleStatusUpdate(student.id, 'completed')}
                      >
                        완료
                      </Button>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Container>
  );
};

export default TeacherDashboard; 