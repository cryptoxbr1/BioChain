import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './views/Dashboard';
import { Upload } from './views/Upload';
import { Report } from './views/Report';
import { ViewState, DockingJob, JobStatus } from './types';
import { connectWallet, disconnectWallet, checkWalletConnection, verifyJobOnChain } from './services/solanaService';
import { parseDockingFile } from './services/fileParser';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('DASHBOARD');
  // Initialize jobs from localStorage or empty array
  const [jobs, setJobs] = useState<DockingJob[]>(() => {
    const saved = localStorage.getItem('biochain_jobs');
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedJob, setSelectedJob] = useState<DockingJob | null>(null);
  const [walletConnected, setWalletConnected] = useState<boolean>(false);
  const [walletAddress, setWalletAddress] = useState<string>("");

  // Check for wallet connection on load
  useEffect(() => {
    checkWalletConnection().then(addr => {
      if (addr) {
        setWalletConnected(true);
        setWalletAddress(addr);
      }
    });
  }, []);

  // Persist jobs to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('biochain_jobs', JSON.stringify(jobs));
  }, [jobs]);

  const toggleWallet = async () => {
    if (walletConnected) {
      await disconnectWallet();
      setWalletConnected(false);
      setWalletAddress("");
    } else {
      const addr = await connectWallet();
      if (addr) {
        setWalletConnected(true);
        setWalletAddress(addr);
      }
    }
  };

  const handleUpload = async (file: File) => {
    // 1. Parse the real file
    const realStats = await parseDockingFile(file);

    const newJob: DockingJob = {
      id: `job-${Date.now().toString().slice(-6)}`,
      filename: file.name,
      uploadDate: new Date().toISOString().split('T')[0],
      status: JobStatus.PROCESSING,
      moleculeName: file.name.split('.')[0] || 'Unknown Compound',
      stats: realStats
    };

    setJobs(prev => [newJob, ...prev]);
    setCurrentView('DASHBOARD');
    
    // Simulate processing time for UX, but data is already parsed
    setTimeout(() => {
        setJobs(prev => prev.map(j => j.id === newJob.id ? { ...j, status: JobStatus.COMPLETED } : j));
    }, 2000);
  };

  const handleSelectJob = (job: DockingJob) => {
    setSelectedJob(job);
  };

  const closeReport = () => {
    setSelectedJob(null);
  };

  const handleVerifyOnChain = async (jobId: string) => {
      const jobToVerify = jobs.find(j => j.id === jobId);
      if (!jobToVerify || !jobToVerify.stats) return;

      try {
        const txHash = await verifyJobOnChain(
            jobId, 
            jobToVerify.moleculeName, 
            jobToVerify.stats.dockingScore
        );

        const updatedJobs = jobs.map(j => {
            if (j.id === jobId) {
                return { 
                    ...j, 
                    status: JobStatus.VERIFIED,
                    txHash: txHash
                };
            }
            return j;
        });

        setJobs(updatedJobs);
        
        // Update selected job view
        if (selectedJob && selectedJob.id === jobId) {
            setSelectedJob({ 
                ...selectedJob, 
                status: JobStatus.VERIFIED, 
                txHash: txHash 
            });
        }
        alert("Verification successful! Transaction hash: " + txHash);

      } catch (err) {
          alert("Verification failed: " + (err as Error).message);
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
      walletAddress={walletAddress}
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