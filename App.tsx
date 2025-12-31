import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './views/Dashboard';
import { Upload } from './views/Upload';
import { Report } from './views/Report';
import { ViewState, DockingJob, JobStatus } from './types';
import { MOCK_JOBS } from './constants';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('DASHBOARD');
  const [jobs, setJobs] = useState<DockingJob[]>(MOCK_JOBS);
  const [selectedJob, setSelectedJob] = useState<DockingJob | null>(null);
  const [walletConnected, setWalletConnected] = useState<boolean>(false);

  const toggleWallet = () => {
    setWalletConnected(prev => !prev);
  };

  const handleUpload = (file: File) => {
    // Simulate job creation
    const newJob: DockingJob = {
      id: `job-${Math.floor(Math.random() * 1000)}`,
      filename: file.name,
      uploadDate: new Date().toISOString().split('T')[0],
      status: JobStatus.PROCESSING,
      moleculeName: file.name.split('.')[0] || 'Unknown Compound',
      stats: {
        dockingScore: -(Math.random() * 5 + 5).toFixed(1) as any as number, // Random score between -5 and -10
        bindingEfficiency: parseFloat((Math.random() * 0.5).toFixed(2)),
        molecularWeight: Math.floor(Math.random() * 200 + 300),
        hBondDonors: Math.floor(Math.random() * 5),
        hBondAcceptors: Math.floor(Math.random() * 8)
      }
    };

    setJobs(prev => [newJob, ...prev]);
    setCurrentView('DASHBOARD');
    
    // Simulate completing the job after a delay
    setTimeout(() => {
        setJobs(prev => prev.map(j => j.id === newJob.id ? { ...j, status: JobStatus.COMPLETED } : j));
    }, 3000);
  };

  const handleSelectJob = (job: DockingJob) => {
    setSelectedJob(job);
    // We stay on the current view (likely DASHBOARD), but overlay the report
  };

  const closeReport = () => {
    setSelectedJob(null);
  };

  const handleVerifyOnChain = (jobId: string) => {
      // Simulate blockchain transaction
      setJobs(prev => prev.map(j => {
          if (j.id === jobId) {
              return { 
                  ...j, 
                  status: JobStatus.VERIFIED,
                  txHash: Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join('')
              };
          }
          return j;
      }));
      // Update selected job view as well if it's the one open
      if (selectedJob && selectedJob.id === jobId) {
          setSelectedJob(prev => prev ? ({ 
              ...prev, 
              status: JobStatus.VERIFIED, 
              txHash: 'simulated_tx_hash_updated' 
          }) : null);
      }
  };

  const renderContent = () => {
    switch (currentView) {
      case 'DASHBOARD':
        return (
          <Dashboard 
            jobs={jobs} 
            onSelectJob={handleSelectJob} 
            onNewJob={() => setCurrentView('UPLOAD')} 
          />
        );
      case 'UPLOAD':
        return (
          <Upload 
            onUpload={handleUpload} 
            onCancel={() => setCurrentView('DASHBOARD')} 
          />
        );
      // case 'REPORT': is now handled via overlay
      default:
        return (
          <Dashboard 
            jobs={jobs} 
            onSelectJob={handleSelectJob} 
            onNewJob={() => setCurrentView('UPLOAD')} 
          />
        );
    }
  };

  return (
    <Layout 
      currentView={currentView} 
      setView={(view) => { setCurrentView(view); setSelectedJob(null); }} 
      walletConnected={walletConnected} 
      toggleWallet={toggleWallet}
    >
      {renderContent()}

      {/* Report Drawer Overlay */}
      {selectedJob && (
        <>
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300"
            onClick={closeReport}
          />
          <Report 
            job={jobs.find(j => j.id === selectedJob.id) || selectedJob} 
            onClose={closeReport}
            onVerify={handleVerifyOnChain}
            isWalletConnected={walletConnected}
          />
        </>
      )}
    </Layout>
  );
};

export default App;