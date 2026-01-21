import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Search, Users, CheckSquare, Calendar, Briefcase, MessageSquare, X } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const navItems = [
    { name: 'Painel de Controle', icon: LayoutDashboard, path: '/' },
    { name: 'Extrair Leads', icon: Search, path: '/extraction' },
    { name: 'CRM', icon: Users, path: '/crm' },
    { name: 'Tarefas', icon: CheckSquare, path: '/tasks' },
    { name: 'Agenda', icon: Calendar, path: '/agenda' },
    { name: 'Clientes', icon: Briefcase, path: '/clients' },
    { name: 'Agentes WhatsApp', icon: MessageSquare, path: '/agents' },
  ];

  return (
    <>
      <aside 
        className={`w-64 bg-white h-screen fixed left-0 top-0 border-r border-gray-200 flex flex-col z-40 font-inter transform transition-transform duration-300 ease-in-out ${
            isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
      >
        <div className="p-6 flex items-center justify-between bg-black">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-yellow-500 rounded-md flex items-center justify-center text-black font-black italic text-xl tracking-tighter transform -skew-x-12 border-2 border-white">PM</div>
             <div className="flex flex-col justify-center">
                <span className="text-sm font-bold tracking-tight text-white leading-none">POSTO DE MOLAS</span>
                <span className="text-xs font-semibold text-yellow-500 tracking-wide leading-none uppercase mt-0.5">CRM</span>
             </div>
          </div>
          {/* Close button for mobile only */}
          <button onClick={onClose} className="md:hidden text-gray-400 hover:text-white transition-colors">
              <X size={24} />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1 bg-white overflow-y-auto">
          <div className="px-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Menu Principal</div>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => {
                  if (window.innerWidth < 768) {
                      onClose();
                  }
              }}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-bold transition-all ${
                  isActive
                    ? 'bg-black text-yellow-500 shadow-lg shadow-gray-200 translate-x-1'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-black'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                  {item.name}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100 bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-yellow-500 text-black border-2 border-black flex items-center justify-center font-bold shadow-sm">
              AD
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">Admin</p>
              <p className="text-xs text-gray-500 font-medium">Posto de Molas</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};