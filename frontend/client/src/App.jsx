import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import JobDetails from './pages/JobDetails';
import CreateJob from './pages/CreateJob';
import Layout from './components/AppLayout';
import ALayout from './components/AuthLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword'; 
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <Home />
            </Layout>
          }
        />
        <Route
          path="/jobs/:id"
          element={
            <Layout>
              <JobDetails />
            </Layout>
          }
        />
        <Route
          path="/create-job"
          element={
            <ProtectedRoute employerOnly={true}>
              <Layout>
                <CreateJob />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Authentication Routes */}
        <Route
          path="/login"
          element={
            <ALayout>
              <Login />
            </ALayout>
          }
        />
        <Route
          path="/register"
          element={
            <ALayout>
              <Register />
            </ALayout>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <ALayout>
              <ForgotPassword />
            </ALayout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;