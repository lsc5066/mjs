import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import StudentKiosk from './components/StudentKiosk';
import TeacherDashboard from './components/TeacherDashboard';
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';

function App() {
  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            보건실 관리 시스템
          </Typography>
          <Button color="inherit" component={Link} to="/">
            학생 접수
          </Button>
          <Button color="inherit" component={Link} to="/teacher">
            교사 대시보드
          </Button>
        </Toolbar>
      </AppBar>

      <Container>
        <Routes>
          <Route path="/" element={<StudentKiosk />} />
          <Route path="/teacher" element={<TeacherDashboard />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App; 