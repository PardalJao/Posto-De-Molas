import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { ExtractionPage } from './pages/ExtractionPage';
import { CRMPage } from './pages/CRMPage';
import { TasksPage } from './pages/TasksPage';
import { AgendaPage } from './pages/AgendaPage';
import { ClientsPage } from './pages/ClientsPage';
import { DashboardPage } from './pages/DashboardPage';
import { AgentsPage } from './pages/AgentsPage';
import { LeadDetailModal } from './components/LeadDetailModal';
import { Lead, Task, ExtractionHistory, LeadStatus, Agent } from './types';
import { v4 as uuidv4 } from 'uuid';
import { Menu } from 'lucide-react';

// Mock Initial Data (Only used if LocalStorage is empty)
const initialLeads: Lead[] = [
    {
        id: '1',
        companyName: 'Transportadora Falcão',
        sector: 'Transporte',
        city: 'Londrina',
        country: 'Brazil',
        address: 'Av. Tiradentes, 500',
        phone: '+55 43 3333-0000',
        email: 'contato@falcao.com.br',
        website: 'falcao.com.br',
        status: 'New',
        priority: 'Medium',
        value: 0,
        rating: 4.8,
        notes: 'Frota de 50 caminhões. Potencial alto para molas.',
        source: 'Google Maps',
        createdAt: new Date().toISOString(),
        contactPerson: 'Carlos (Gerente de Frota)'
    }
];

const initialTasks: Task[] = [
    {
        id: '1',
        leadId: '1',
        title: 'Ligar para Carlos',
        description: 'Oferecer promoção de feixe de molas para frota.',
        dueDate: new Date().toISOString(),
        completed: false,
        type: 'Call'
    }
];

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Initialize state from LocalStorage or Fallback to Initial Data
  // Added try-catch to prevent white screen if local storage has invalid JSON
  const [leads, setLeads] = useState<Lead[]>(() => {
    try {
      const saved = localStorage.getItem('posto_molas_leads');
      return saved ? JSON.parse(saved) : initialLeads;
    } catch (e) {
      console.error("Error parsing leads from localStorage", e);
      return initialLeads;
    }
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const saved = localStorage.getItem('posto_molas_tasks');
      return saved ? JSON.parse(saved) : initialTasks;
    } catch (e) {
      console.error("Error parsing tasks from localStorage", e);
      return initialTasks;
    }
  });

  const [history, setHistory] = useState<ExtractionHistory[]>(() => {
    try {
      const saved = localStorage.getItem('posto_molas_history');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Error parsing history from localStorage", e);
      return [];
    }
  });

  const [agents, setAgents] = useState<Agent[]>(() => {
    try {
      const saved = localStorage.getItem('posto_molas_agents');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Error parsing agents from localStorage", e);
      return [];
    }
  });

  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  // Persistence Effects
  useEffect(() => {
    localStorage.setItem('posto_molas_leads', JSON.stringify(leads));
  }, [leads]);

  useEffect(() => {
    localStorage.setItem('posto_molas_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('posto_molas_history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
      localStorage.setItem('posto_molas_agents', JSON.stringify(agents));
  }, [agents]);

  const handleAddLeads = (newLeads: Lead[]) => {
    setLeads(prev => [...prev, ...newLeads]);
    if (newLeads.length > 0) {
        const first = newLeads[0];
        setHistory(prev => [{
            id: uuidv4(),
            date: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute:'2-digit' }),
            sector: first.sector,
            location: `${first.city}, ${first.country}`,
            count: newLeads.length
        }, ...prev]);
    }
  };

  const handleAddSingleLead = (newLead: Lead) => {
    setLeads(prev => [...prev, newLead]);
  };

  const handleUpdateLead = (updatedLead: Lead) => {
    setLeads(prev => prev.map(l => l.id === updatedLead.id ? updatedLead : l));
  };

  const handleLeadMove = (leadId: string, newStatus: LeadStatus) => {
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: newStatus } : l));
  };

  const handleDeleteLead = (id: string) => {
    setLeads(prev => prev.filter(l => l.id !== id));
    setSelectedLead(null);
  };

  const handleAddTask = (task: Task) => {
    setTasks(prev => [...prev, task]);
  };

  const handleUpdateTask = (updatedTask: Task) => {
    setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
  };

  const handleToggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  // Agent Handlers
  const handleAddAgent = (agent: Agent) => {
      setAgents(prev => [...prev, agent]);
  };

  const handleUpdateAgent = (updatedAgent: Agent) => {
      setAgents(prev => prev.map(a => a.id === updatedAgent.id ? updatedAgent : a));
  };

  const handleDeleteAgent = (id: string) => {
      setAgents(prev => prev.filter(a => a.id !== id));
  };

  const clients = leads.filter(l => l.status === 'Closed');

  return (
    <Router>
      <div className="flex bg-[#f8fafc] min-h-screen font-sans text-slate-800 relative">
        {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && (
            <div 
                className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm"
                onClick={() => setIsSidebarOpen(false)}
            />
        )}

        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        
        <main className="flex-1 md:ml-64 relative bg-[#f8fafc] w-full flex flex-col transition-all duration-300">
          {/* Mobile Header */}
          <div className="md:hidden bg-white border-b border-gray-200 p-4 flex items-center justify-between sticky top-0 z-20">
             <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-yellow-500 rounded flex items-center justify-center text-black font-black italic border border-white shadow-sm">RR</div>
                <span className="font-bold text-gray-900">Posto de Molas</span>
             </div>
             <button 
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg active:scale-95 transition-all"
             >
                <Menu size={24} />
             </button>
          </div>

          <div className="flex-1 overflow-x-hidden">
            <Routes>
                <Route path="/" element={<DashboardPage leads={leads} tasks={tasks} />} />
                <Route 
                    path="/extraction" 
                    element={<ExtractionPage onAddLeads={handleAddLeads} history={history} />} 
                />
                <Route 
                    path="/crm" 
                    element={<CRMPage leads={leads} onLeadClick={setSelectedLead} onLeadMove={handleLeadMove} onAddLead={handleAddSingleLead} />} 
                />
                <Route 
                    path="/tasks" 
                    element={<TasksPage tasks={tasks} leads={leads} onAddTask={handleAddTask} onUpdateTask={handleUpdateTask} onDeleteTask={handleDeleteTask} onToggleTask={handleToggleTask} />} 
                />
                <Route 
                    path="/agenda" 
                    element={<AgendaPage tasks={tasks} leads={leads} onAddTask={handleAddTask} onUpdateTask={handleUpdateTask} onDeleteTask={handleDeleteTask} />} 
                />
                <Route 
                    path="/clients" 
                    element={<ClientsPage clients={clients} onAddClient={handleAddSingleLead} />} 
                />
                <Route 
                    path="/agents" 
                    element={<AgentsPage agents={agents} onAddAgent={handleAddAgent} onUpdateAgent={handleUpdateAgent} onDeleteAgent={handleDeleteAgent} />} 
                />
                <Route path="*" element={<div className="p-10">Página não encontrada</div>} />
            </Routes>
          </div>
        </main>

        {selectedLead && (
          <LeadDetailModal 
            lead={selectedLead} 
            onClose={() => setSelectedLead(null)}
            onSave={handleUpdateLead}
            onDelete={handleDeleteLead}
          />
        )}
      </div>
    </Router>
  );
}