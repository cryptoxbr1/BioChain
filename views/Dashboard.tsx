import React, { useState } from 'react';
import { DockingJob, JobStatus } from '../types';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { PlusIcon, FileIcon, CubeIcon, CheckCircleIcon, ChevronRightIcon, SearchIcon } from '../components/Icons';

interface DashboardProps {
  jobs: DockingJob[];
  onSelectJob: (job: DockingJob) => void;
  onNewJob: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ jobs, onSelectJob, onNewJob }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredJobs = jobs.filter(job => 
    job.moleculeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusStyle = (status: JobStatus) => {
    switch (status) {
      case JobStatus.COMPLETED: 
        return 'text-science-300 bg-science-500/10 border-science-500/20';
      case JobStatus.VERIFIED: 
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case JobStatus.PROCESSING: 
        return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case JobStatus.FAILED: 
        return 'text-red-400 bg-red-500/10 border-red-500/20';
      default: 
        return 'text-slate-400 border-slate-700 bg-slate-800/50';
    }
  };

  return (
    <div className="space-y-6 md:space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Overview</h2>
          <p className="text-slate-400 text-sm mt-1">Manage and track your molecular docking experiments.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input 
                    type="text" 
                    placeholder="Search by name or ID..." 
                    className="w-full pl-9 pr-4 py-2 bg-science-900/50 border border-white/10 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-science-500 focus:ring-1 focus:ring-science-500 transition-all"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            <Button onClick={onNewJob} className="whitespace-nowrap shrink-0">
               <PlusIcon className="w-4 h-4" /> <span className="hidden sm:inline">New Analysis</span>
               <span className="sm:hidden">New</span>
            </Button>
        </div>
      </div>

      {/* Stats Cards - Grid adapts automatically */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <Card className="flex flex-row items-center justify-between py-6 group hover:border-science-600 transition-colors">
          <div>
            <span className="text-3xl font-bold text-white block mb-1">{jobs.length}</span>
            <span className="text-sm text-slate-400 font-medium">Total Jobs</span>
          </div>
          <div className="w-12 h-12 rounded-full bg-science-800 border border-science-700 flex items-center justify-center text-science-400 group-hover:text-white transition-colors">
            <FileIcon className="w-6 h-6" />
          </div>
        </Card>
        <Card className="flex flex-row items-center justify-between py-6 group hover:border-solana-secondary/50 transition-colors">
          <div>
            <span className="text-3xl font-bold text-emerald-400 block mb-1">
              {jobs.filter(j => j.status === JobStatus.VERIFIED).length}
            </span>
            <span className="text-sm text-slate-400 font-medium">Verified On-Chain</span>
          </div>
          <div className="w-12 h-12 rounded-full bg-emerald-900/20 border border-emerald-800/50 flex items-center justify-center text-emerald-400">
            <CheckCircleIcon className="w-6 h-6" />
          </div>
        </Card>
        <Card className="flex flex-row items-center justify-between py-6 group hover:border-science-accent/50 transition-colors">
          <div>
            <span className="text-3xl font-bold text-science-accent block mb-1">
               {jobs.reduce((acc, curr) => acc + (curr.stats ? 1 : 0), 0)}
            </span>
            <span className="text-sm text-slate-400 font-medium">Molecules Analyzed</span>
          </div>
          <div className="w-12 h-12 rounded-full bg-science-accent/10 border border-science-accent/20 flex items-center justify-center text-science-accent">
            <CubeIcon className="w-6 h-6" />
          </div>
        </Card>
      </div>

      {/* Activity Section */}
      <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
            <Button variant="ghost" className="text-xs">View All</Button>
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block">
            <Card className="overflow-hidden p-0 border-0 shadow-xl bg-science-900/50 ring-1 ring-white/5">
                <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-white/5 text-slate-400 text-xs font-medium uppercase tracking-wider">
                    <tr>
                        <th className="px-6 py-4">Job ID</th>
                        <th className="px-6 py-4">Molecule Name</th>
                        <th className="px-6 py-4">Date</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Score (kcal/mol)</th>
                        <th className="px-6 py-4 text-right"></th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-sm">
                    {filteredJobs.length > 0 ? (
                        filteredJobs.map((job) => (
                        <tr key={job.id} className="hover:bg-white/[0.02] transition-colors group cursor-pointer" onClick={() => onSelectJob(job)}>
                        <td className="px-6 py-4 font-mono text-science-400/80">{job.id}</td>
                        <td className="px-6 py-4 font-medium text-slate-200">{job.moleculeName}</td>
                        <td className="px-6 py-4 text-slate-500">{job.uploadDate}</td>
                        <td className="px-6 py-4">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border tracking-wide uppercase ${getStatusStyle(job.status)}`}>
                            {job.status}
                            </span>
                        </td>
                        <td className="px-6 py-4 text-slate-300 font-mono">
                            {job.stats?.dockingScore ? <span className="text-white">{job.stats.dockingScore}</span> : <span className="text-slate-600">-</span>}
                        </td>
                        <td className="px-6 py-4 text-right">
                            <div className="p-2 rounded-full hover:bg-white/5 inline-flex text-slate-500 hover:text-white transition-colors">
                            <ChevronRightIcon className="w-4 h-4" />
                            </div>
                        </td>
                        </tr>
                    ))
                    ) : (
                        <tr>
                        <td colSpan={6} className="px-6 py-16 text-center text-slate-500">
                            <div className="flex flex-col items-center gap-3">
                            <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center">
                                <SearchIcon className="w-6 h-6 opacity-50" />
                            </div>
                            <p>No matching jobs found.</p>
                            <Button variant="ghost" onClick={() => setSearchQuery('')} className="text-xs mt-2">Clear Search</Button>
                            </div>
                        </td>
                        </tr>
                    )}
                    </tbody>
                </table>
                </div>
            </Card>
          </div>

          {/* Mobile Card List View */}
          <div className="md:hidden space-y-3">
             {filteredJobs.length > 0 ? (
                filteredJobs.map((job) => (
                    <div 
                        key={job.id}
                        onClick={() => onSelectJob(job)}
                        className="bg-science-900/40 backdrop-blur-sm border border-white/5 rounded-xl p-4 shadow-sm active:bg-science-800/60 transition-colors"
                    >
                        <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-2">
                                <span className="font-mono text-[10px] text-science-400/80 bg-science-950/50 px-1.5 py-0.5 rounded border border-white/5">#{job.id}</span>
                                <span className="text-xs text-slate-500">{job.uploadDate}</span>
                            </div>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border tracking-wide uppercase ${getStatusStyle(job.status)}`}>
                                {job.status}
                            </span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                            <div>
                                <h4 className="text-base font-semibold text-slate-200 mb-0.5">{job.moleculeName}</h4>
                                <div className="text-xs flex items-center gap-2">
                                    <span className="text-slate-500">Score:</span>
                                    {job.stats?.dockingScore ? (
                                        <span className="font-mono text-science-300">{job.stats.dockingScore} kcal/mol</span>
                                    ) : (
                                        <span className="text-slate-600">-</span>
                                    )}
                                </div>
                            </div>
                            <div className="p-2 rounded-full bg-white/5 text-slate-400">
                                <ChevronRightIcon className="w-4 h-4" />
                            </div>
                        </div>
                    </div>
                ))
             ) : (
                <div className="text-center py-12 text-slate-500 border border-dashed border-white/5 rounded-xl bg-white/[0.02]">
                    <div className="flex flex-col items-center gap-3">
                        <SearchIcon className="w-8 h-8 opacity-30" />
                        <p className="text-sm">No matching jobs found.</p>
                        <Button variant="ghost" onClick={() => setSearchQuery('')} className="text-xs mt-1">Clear Search</Button>
                    </div>
                </div>
             )}
          </div>
      </div>
    </div>
  );
};