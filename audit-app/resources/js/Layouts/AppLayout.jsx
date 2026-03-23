import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { LayoutDashboard, FileText, Settings, LogOut, Menu, X } from 'lucide-react';

export default function AppLayout({ children }) {
    const { url } = usePage();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

    const navItems = [
        { label: 'Tableau de Bord', href: '/', icon: LayoutDashboard },
        { label: 'Audit Interne', href: '/audit/audit', icon: FileText },
        { label: 'Conformité', href: '/audit/compliance', icon: FileText },
        { label: 'Crédit', href: '/audit/credit', icon: FileText },
        { label: 'DAF', href: '/audit/daf', icon: FileText },
        { label: 'Informatique', href: '/audit/it', icon: FileText },
        { label: 'Marketing', href: '/audit/marketing', icon: FileText },
    ];

    return (
        <div className="flex min-h-screen bg-slate-50">
            {/* Sidebar */}
            <aside className="hidden md:flex w-64 flex-col bg-white border-r border-slate-200">
                <div className="p-6">
                    <img src="/images/logo.png" alt="Exelencis Logo" className="h-12 w-auto object-contain" />
                </div>
                <nav className="flex-1 px-4 space-y-1">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                                url === item.href || (item.href !== '/' && url.startsWith(item.href))
                                    ? 'bg-blue-50 text-blue-700'
                                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                            }`}
                        >
                            <item.icon className="mr-3 h-5 w-5" />
                            {item.label}
                        </Link>
                    ))}
                </nav>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 md:hidden">
                    <img src="/images/logo.png" alt="Exelencis Logo" className="h-8 w-auto" />
                    <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                        {isMobileMenuOpen ? <X /> : <Menu />}
                    </button>
                </header>

                <main className="flex-1 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
