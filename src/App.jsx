import React, { useState, useMemo, useEffect } from 'react';
import {
    Users, Calendar, CheckCircle, XCircle, BarChart3, LogOut, Menu, X, Plus,
    Search, Save, BookOpen, Clock, AlertCircle, School, FileText, ChevronRight,
    Activity, GraduationCap, ArrowLeft, Leaf, Mountain, Trash2, Moon, Sun,
    AlertTriangle, UserCheck, Phone, Mail,
    // New Icons for Subjects
    Cpu, Calculator, Atom, MessageCircle, Database, Binary,
    // New Icons for Moodle Graphics
    Grid, Layers, Award
} from 'lucide-react';

// --- IMPORTANT SETUP FOR LOGO ---
// To use your local logo:
// 1. Move your 'logo.png' into the 'src/assets/' folder of your project.
// 2. Uncomment the line below:
// import logo from './assets/logo.png';

// For now, we use a placeholder variable.
// If you uncomment the import above, change this line to: const LOGO_FILENAME = logo;
const LOGO_FILENAME = "/logo.png";

// --- Configuration ---
const UNIVERSITY_NAME = "Bahra University";

const SUBJECTS_BY_COURSE = {
    'B.Tech CSE 2024-28': ['Data Structures', 'Digital Electronics', 'Mathematics-I', 'Physics', 'Communication Skills']
};

// --- Mock Data ---
const FACULTIES = [
    { id: 'f1', name: 'Harish', designation: 'Assistant Professor' },
    { id: 'f2', name: 'Pankaj', designation: 'Professor' },
    { id: 'f3', name: 'Geeta', designation: 'Lecturer' },
    { id: 'f4', name: 'Preeti', designation: 'Assistant Professor' },
];

const INITIAL_STUDENTS = [
    { id: '1', name: 'Aditya Bansal', rollNo: 'CSE-2024-001', course: 'B.Tech CSE 2024-28' },
    { id: '2', name: 'Piyush Dhiman', rollNo: 'CSE-2024-002', course: 'B.Tech CSE 2024-28' },
    { id: '3', name: 'Harman Jassal', rollNo: 'CSE-2024-003', course: 'B.Tech CSE 2024-28' },
    { id: '4', name: 'Mohit Chauhan', rollNo: 'CSE-2024-004', course: 'B.Tech CSE 2024-28' },
    { id: '5', name: 'Suvansh Sharma', rollNo: 'CSE-2024-005', course: 'B.Tech CSE 2024-28' },
    { id: '6', name: 'Arukshita', rollNo: 'CSE-2024-006', course: 'B.Tech CSE 2024-28' },
];

const INITIAL_LOGS = [
    { id: '101', studentId: '1', studentName: 'Aditya Bansal', course: 'B.Tech CSE 2024-28', subject: 'Data Structures', date: '2024-10-25', status: 'present', markedBy: 'Harish' },
    { id: '102', studentId: '1', studentName: 'Aditya Bansal', course: 'B.Tech CSE 2024-28', subject: 'Mathematics-I', date: '2024-10-25', status: 'present', markedBy: 'Pankaj' },
    { id: '103', studentId: '2', studentName: 'Piyush Dhiman', course: 'B.Tech CSE 2024-28', subject: 'Data Structures', date: '2024-10-25', status: 'absent', markedBy: 'Harish' },
    { id: '104', studentId: '2', studentName: 'Piyush Dhiman', course: 'B.Tech CSE 2024-28', subject: 'Mathematics-I', date: '2024-10-25', status: 'absent', markedBy: 'Pankaj' },
    { id: '105', studentId: '2', studentName: 'Piyush Dhiman', course: 'B.Tech CSE 2024-28', subject: 'Data Structures', date: '2024-10-24', status: 'present', markedBy: 'Harish' },
    { id: '106', studentId: '3', studentName: 'Harman Jassal', course: 'B.Tech CSE 2024-28', subject: 'Data Structures', date: '2024-10-25', status: 'present', markedBy: 'Harish' },
];

// --- Helpers ---
const calculateClassesNeeded = (present, total, threshold = 0.75) => {
    const needed = (3 * total) - (4 * present);
    return needed > 0 ? needed : 0;
};

const getSubjectIcon = (subjectName) => {
    switch (subjectName) {
        case 'Data Structures':
            return { icon: Database, color: 'text-white', bg: 'bg-purple-600' };
        case 'Digital Electronics':
            return { icon: Cpu, color: 'text-white', bg: 'bg-blue-600' };
        case 'Mathematics-I':
            return { icon: Calculator, color: 'text-white', bg: 'bg-orange-600' };
        case 'Physics':
            return { icon: Atom, color: 'text-white', bg: 'bg-cyan-600' };
        case 'Communication Skills':
            return { icon: MessageCircle, color: 'text-white', bg: 'bg-pink-600' };
        default:
            return { icon: BookOpen, color: 'text-white', bg: 'bg-stone-600' };
    }
};

// --- Components ---

const Logo = ({ className = "h-8 w-auto" }) => {
    const [error, setError] = useState(false);

    if (error) {
        return (
            <div className={`flex items-center gap-2 ${className}`}>
                <Mountain className="text-green-700 dark:text-green-500" size={32} />
            </div>
        );
    }

    return (
        <img
            src={LOGO_FILENAME}
            alt="Bahra Logo"
            className={className}
            onError={() => setError(true)}
        />
    );
};

const StatusBadge = ({ status }) => {
    const styles = {
        present: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800',
        absent: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800',
        late: 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800',
    };
    return <span className={`px-3 py-1.5 rounded-lg text-sm font-bold uppercase tracking-wider border ${styles[status] || styles.absent}`}>{status}</span>;
};

const ThemeToggle = ({ isDarkMode, toggleTheme, className = "" }) => (
    <button
        onClick={toggleTheme}
        className={`p-3 rounded-xl hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-400 transition-colors ${className}`}
        title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
        {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
    </button>
);

// --- Student Portal ---
const StudentPortal = ({ studentId, students, logs, onLogout, toggleTheme, isDarkMode }) => {
    const student = students.find(s => s.id === studentId);

    const stats = useMemo(() => {
        if (!student) return null;
        const myLogs = logs.filter(l => l.studentId === studentId);
        const totalClasses = myLogs.length;
        const totalPresent = myLogs.filter(l => l.status === 'present' || l.status === 'late').length;
        const overallRate = totalClasses > 0 ? Math.round((totalPresent / totalClasses) * 100) : 0;

        const courseSubjects = SUBJECTS_BY_COURSE[student.course] || [];
        const subjectStats = courseSubjects.map(subject => {
            const subLogs = myLogs.filter(l => l.subject === subject);
            const total = subLogs.length;
            const present = subLogs.filter(l => l.status === 'present' || l.status === 'late').length;
            const rate = total > 0 ? Math.round((present / total) * 100) : 0;
            const needed = calculateClassesNeeded(present, total);
            return { subject, total, present, rate, needed };
        });

        return { totalClasses, totalPresent, overallRate, subjectStats };
    }, [student, logs, studentId]);

    if (!student) return <div className="p-8 text-center text-xl text-stone-600 dark:text-stone-400">Student not found</div>;

    return (
        <div className="w-full min-h-screen bg-stone-100 dark:bg-stone-950 font-sans transition-colors duration-200">
            <header className="bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 sticky top-0 z-10 shadow-md">
                <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
                    <div className="flex items-center gap-4 font-bold text-2xl text-stone-800 dark:text-stone-100">
                        <Logo className="h-12 w-auto" />
                        <span className="tracking-tight">Bahra University Portal</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <ThemeToggle isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
                        <div className="h-8 w-px bg-stone-200 dark:bg-stone-700 mx-2"></div>
                        <button
                            onClick={onLogout}
                            className="text-base font-semibold text-stone-600 dark:text-stone-400 hover:text-red-600 dark:hover:text-red-400 flex items-center gap-2 px-4 py-2 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors"
                        >
                            <LogOut size={20} />
                            <span className="hidden sm:inline">Logout</span>
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto p-6 space-y-8">
                {/* Big Moodle-Style Dashboard Card */}
                <div className="bg-gradient-to-r from-stone-900 to-stone-800 dark:from-black dark:to-stone-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden border border-stone-700">
                    <div className="absolute top-0 right-0 p-8 opacity-10 transform translate-x-12 -translate-y-12">
                        <Leaf size={240} />
                    </div>
                    <div className="absolute bottom-0 left-0 p-8 opacity-5">
                        <Grid size={200} />
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
                        <div>
                            <div className="inline-block px-4 py-1.5 bg-green-500/20 text-green-300 rounded-full text-sm font-bold mb-3 border border-green-500/30">
                                STUDENT DASHBOARD
                            </div>
                            <h1 className="text-5xl font-bold mt-2 text-white">{student.name}</h1>
                            <p className="text-stone-300 text-xl mt-3 flex items-center gap-3">
                                <GraduationCap className="text-green-400" />
                                {student.course} <span className="text-stone-500">•</span> {student.rollNo}
                            </p>
                        </div>

                        <div className="flex items-center gap-8 bg-black/40 p-6 rounded-2xl border border-white/10 backdrop-blur-md shadow-inner">
                            <div className="text-center px-4">
                                <p className="text-sm text-stone-400 mb-2 uppercase tracking-wide font-bold">Overall</p>
                                <div className="relative inline-flex items-center justify-center">
                                    <svg className="w-24 h-24 transform -rotate-90">
                                        <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-stone-700" />
                                        <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent"
                                                strokeDasharray={251.2}
                                                strokeDashoffset={251.2 - (251.2 * stats?.overallRate) / 100}
                                                className={`${stats?.overallRate < 75 ? 'text-red-500' : 'text-green-500'} transition-all duration-1000`}
                                        />
                                    </svg>
                                    <span className="absolute text-2xl font-bold text-white">{stats?.overallRate}%</span>
                                </div>
                            </div>
                            <div className="w-px h-20 bg-white/20"></div>
                            <div className="text-center px-4">
                                <p className="text-sm text-stone-400 mb-2 uppercase tracking-wide font-bold">Attendance</p>
                                <p className="text-5xl font-bold text-white">{stats?.totalPresent}<span className="text-2xl text-stone-500 font-medium">/{stats?.totalClasses}</span></p>
                            </div>
                        </div>
                    </div>
                </div>

                {stats?.overallRate < 75 && (
                    <div className="bg-red-100 dark:bg-red-900/30 border-2 border-red-200 dark:border-red-800 p-6 rounded-2xl flex items-center gap-6 shadow-sm">
                        <div className="p-4 bg-red-200 dark:bg-red-800/50 rounded-full text-red-700 dark:text-red-200">
                            <AlertTriangle size={32} />
                        </div>
                        <div>
                            <h3 className="font-bold text-xl text-red-800 dark:text-red-200">Attendance Warning Alert</h3>
                            <p className="text-lg text-red-700 dark:text-red-300 mt-1">Your overall attendance has dropped below 75%. Please attend upcoming classes to avoid detainment.</p>
                        </div>
                    </div>
                )}

                <h3 className="font-bold text-stone-800 dark:text-stone-200 text-2xl border-l-8 border-green-600 pl-4">Course Performance</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {stats?.subjectStats.map((sub) => {
                        const { icon: SubjectIcon, color, bg } = getSubjectIcon(sub.subject);
                        const isPassing = sub.rate >= 75;

                        return (
                            <div key={sub.subject} className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
                                {/* Card Header with Moodle-like graphic background */}
                                <div className={`h-32 ${bg} relative overflow-hidden flex items-center justify-center`}>
                                    <div className="absolute inset-0 bg-black/10"></div>
                                    <SubjectIcon size={64} className="text-white/20 absolute -bottom-4 -right-4 transform rotate-12" />
                                    <div className={`p-4 rounded-xl bg-white/20 backdrop-blur-sm text-white shadow-lg`}>
                                        <SubjectIcon size={40} className="text-white" />
                                    </div>
                                </div>

                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <h4 className="font-bold text-xl text-stone-800 dark:text-stone-100 line-clamp-2 h-14">{sub.subject}</h4>
                                        <span className={`text-lg font-bold px-3 py-1 rounded-lg ${
                                            isPassing
                                                ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
                                                : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
                                        }`}>
                        {sub.rate}%
                     </span>
                                    </div>

                                    <div className="flex justify-between text-sm font-medium text-stone-500 dark:text-stone-400 mb-2">
                                        <span>Progress</span>
                                        <span>{sub.present} / {sub.total} Classes</span>
                                    </div>

                                    <div className="w-full bg-stone-100 dark:bg-stone-800 rounded-full h-4 mb-6 shadow-inner">
                                        <div
                                            className={`h-4 rounded-full transition-all duration-1000 ${isPassing ? 'bg-green-500' : 'bg-red-500'}`}
                                            style={{ width: `${sub.rate}%` }}
                                        />
                                    </div>

                                    {!isPassing && sub.total > 0 ? (
                                        <div className="text-sm font-semibold text-amber-700 dark:text-amber-300 flex items-center gap-3 bg-amber-50 dark:bg-amber-900/20 p-3 rounded-xl border border-amber-100 dark:border-amber-800">
                                            <Activity size={20} className="shrink-0" />
                                            <span>Attend <strong>{sub.needed}</strong> more classes for 75%</span>
                                        </div>
                                    ) : (
                                        <div className="text-sm font-semibold text-green-700 dark:text-green-300 flex items-center gap-3 bg-green-50 dark:bg-green-900/20 p-3 rounded-xl border border-green-100 dark:border-green-800">
                                            <CheckCircle size={20} className="shrink-0" />
                                            <span>On Track</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </main>
        </div>
    );
};

// --- Faculty Sidebar ---
const Sidebar = ({ activeView, setActiveView, isMobileOpen, setIsMobileOpen, onLogout, currentFaculty }) => {
    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
        { id: 'attendance', label: 'Class Register', icon: Calendar },
        { id: 'reports', label: 'Reports', icon: FileText },
        { id: 'students', label: 'Students', icon: Users },
    ];

    return (
        <>
            {isMobileOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black/50 lg:hidden"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            <div className={`
        fixed lg:static inset-y-0 left-0 z-40 w-80 bg-stone-900 dark:bg-black text-stone-100 transform transition-transform duration-300 ease-in-out border-r border-stone-800 shadow-2xl
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
                <div className="flex flex-col h-full">
                    <div className="p-8 border-b border-stone-800 bg-stone-950 dark:bg-stone-900">
                        <div className="flex items-center gap-4 font-bold text-2xl">
                            <Logo className="h-10 w-auto" />
                            <span className="text-stone-100">Bahra</span>
                        </div>
                        <p className="text-xs text-stone-500 mt-2 uppercase tracking-widest pl-14">University</p>
                    </div>

                    <nav className="flex-1 p-6 space-y-3">
                        {menuItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => {
                                    setActiveView(item.id);
                                    setIsMobileOpen(false);
                                }}
                                className={`w-full flex items-center gap-4 px-6 py-4 rounded-xl transition-all text-lg ${
                                    activeView === item.id
                                        ? 'bg-gradient-to-r from-green-800 to-green-900 text-white shadow-lg border border-green-700/50'
                                        : 'text-stone-400 hover:bg-stone-800 hover:text-stone-100'
                                }`}
                            >
                                <item.icon size={24} className={activeView === item.id ? 'text-green-300' : ''} />
                                <span className="font-medium">{item.label}</span>
                            </button>
                        ))}
                    </nav>

                    <div className="p-6 border-t border-stone-800 bg-stone-950">
                        <div className="mb-6 px-4">
                            <p className="text-xs text-stone-500 uppercase tracking-wider mb-2">Signed in as</p>
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-amber-900/50 flex items-center justify-center text-amber-500 text-lg font-bold border border-amber-800 shadow-inner">
                                    {currentFaculty?.name.charAt(0)}
                                </div>
                                <div className="overflow-hidden">
                                    <p className="text-base font-bold truncate text-amber-500">{currentFaculty?.name}</p>
                                    <p className="text-xs truncate text-stone-500">{currentFaculty?.designation}</p>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={onLogout}
                            className="w-full flex items-center justify-center gap-3 px-6 py-3 text-stone-400 hover:text-red-400 hover:bg-stone-900 rounded-xl transition-all font-medium"
                        >
                            <LogOut size={20} />
                            <span>Sign Out</span>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

// --- Faculty Dashboard ---
const FacultyDashboard = ({ students, logs, setActiveView }) => {
    const stats = useMemo(() => {
        const totalStudents = students.length;
        const todayLogs = logs;
        const totalRecords = logs.length;
        const present = logs.filter(log => log.status === 'present' || log.status === 'late').length;
        const rate = totalRecords > 0 ? Math.round((present / totalRecords) * 100) : 0;
        const activeCourses = [...new Set(logs.map(log => log.course))].length;

        return { totalStudents, rate, activeCourses, todayLogs };
    }, [students, logs]);

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-bold text-stone-800 dark:text-stone-100">Faculty Overview</h2>
                    <p className="text-stone-500 dark:text-stone-400 text-base mt-1">Welcome back to the portal</p>
                </div>
                <span className="text-sm font-semibold text-stone-500 dark:text-stone-400 bg-white dark:bg-stone-800 px-4 py-2 rounded-lg border border-stone-200 dark:border-stone-700 shadow-sm">
          {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Moodle Style Stat Cards */}
                <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-6 rounded-2xl shadow-lg border border-blue-500/30 relative overflow-hidden group">
                    <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500"><Users size={100} className="text-white" /></div>
                    <p className="text-blue-100 font-medium text-lg relative z-10">Total Enrollment</p>
                    <h3 className="text-5xl font-bold text-white mt-2 relative z-10">{stats.totalStudents}</h3>
                </div>

                <div className="bg-gradient-to-br from-green-600 to-green-800 p-6 rounded-2xl shadow-lg border border-green-500/30 relative overflow-hidden group">
                    <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500"><Activity size={100} className="text-white" /></div>
                    <p className="text-green-100 font-medium text-lg relative z-10">Avg Attendance</p>
                    <h3 className="text-5xl font-bold text-white mt-2 relative z-10">{stats.rate}%</h3>
                </div>

                <div className="bg-gradient-to-br from-amber-600 to-amber-800 p-6 rounded-2xl shadow-lg border border-amber-500/30 relative overflow-hidden group">
                    <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500"><BookOpen size={100} className="text-white" /></div>
                    <p className="text-amber-100 font-medium text-lg relative z-10">Active Courses</p>
                    <h3 className="text-5xl font-bold text-white mt-2 relative z-10">{stats.activeCourses}</h3>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white dark:bg-stone-900 rounded-2xl shadow-md border border-stone-200 dark:border-stone-800 p-8">
                    <h3 className="font-bold text-2xl text-stone-800 dark:text-stone-100 mb-6 flex items-center gap-3">
                        <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg text-green-700 dark:text-green-400"><Mountain size={24} /></div>
                        Quick Actions
                    </h3>
                    <div className="space-y-4">
                        <button
                            onClick={() => setActiveView('attendance')}
                            className="w-full flex items-center justify-between p-6 border border-stone-200 dark:border-stone-800 rounded-xl hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all group hover:shadow-md"
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xl font-bold">
                                    <Plus size={24} />
                                </div>
                                <div className="text-left">
                                    <p className="font-bold text-lg text-stone-700 dark:text-stone-200">New Class Session</p>
                                    <p className="text-sm text-stone-500 dark:text-stone-400">Mark attendance now</p>
                                </div>
                            </div>
                            <ChevronRight size={24} className="text-stone-400 group-hover:text-green-500 transform group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button
                            onClick={() => setActiveView('students')}
                            className="w-full flex items-center justify-between p-6 border border-stone-200 dark:border-stone-800 rounded-xl hover:border-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-all group hover:shadow-md"
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-full">
                                    <Users size={24} />
                                </div>
                                <div className="text-left">
                                    <p className="font-bold text-lg text-stone-700 dark:text-stone-200">Student Database</p>
                                    <p className="text-sm text-stone-500 dark:text-stone-400">Manage enrollments</p>
                                </div>
                            </div>
                            <ChevronRight size={24} className="text-stone-400 group-hover:text-amber-500 transform group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>

                <div className="bg-white dark:bg-stone-900 rounded-2xl shadow-md border border-stone-200 dark:border-stone-800 overflow-hidden flex flex-col">
                    <div className="px-8 py-6 border-b border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/50 flex justify-between items-center">
                        <h3 className="font-bold text-xl text-stone-800 dark:text-stone-200">Recent Activity Log</h3>
                        <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">Live Feed</span>
                    </div>
                    <div className="divide-y divide-stone-100 dark:divide-stone-800 overflow-y-auto flex-1 p-2">
                        {stats.todayLogs.slice(0, 5).map((log) => (
                            <div key={log.id} className="px-6 py-4 flex items-center justify-between hover:bg-stone-50 dark:hover:bg-stone-800/50 rounded-lg transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-600 dark:text-stone-300 text-sm font-bold border border-stone-200 dark:border-stone-700 shadow-sm">
                                        {log.studentName?.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="text-base font-bold text-stone-800 dark:text-stone-200">{log.studentName}</p>
                                        <p className="text-xs font-medium text-stone-500 dark:text-stone-400 flex items-center gap-2 mt-0.5">
                                            <span className="bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded">{log.subject}</span>
                                            <span className="text-stone-400">by {log.markedBy || 'Admin'}</span>
                                        </p>
                                    </div>
                                </div>
                                <StatusBadge status={log.status} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Attendance Marker ---
const AttendanceMarker = ({ students, onSubmit, currentFaculty }) => {
    const [selectedCourse, setSelectedCourse] = useState('B.Tech CSE 2024-28');
    const [selectedSubject, setSelectedSubject] = useState('');
    const [attendanceState, setAttendanceState] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const courses = Object.keys(SUBJECTS_BY_COURSE);
    const subjects = SUBJECTS_BY_COURSE[selectedCourse] || [];

    useEffect(() => { if (subjects.length > 0) setSelectedSubject(subjects[0]); }, [selectedCourse]);
    const classStudents = useMemo(() => students.filter(s => s.course === selectedCourse), [students, selectedCourse]);
    useEffect(() => { const initial = {}; classStudents.forEach(s => { initial[s.id] = 'present'; }); setAttendanceState(initial); }, [classStudents]);

    const setStatus = (studentId, status) => { setAttendanceState(prev => ({ ...prev, [studentId]: status })); };

    const handleSave = () => {
        setIsSubmitting(true);
        setTimeout(() => {
            const records = Object.entries(attendanceState).map(([studentId, status]) => ({
                studentId, status, date: new Date().toISOString().split('T')[0],
                course: selectedCourse, subject: selectedSubject,
                studentName: students.find(s => s.id === studentId)?.name,
                markedBy: currentFaculty?.name || 'Admin'
            }));
            onSubmit(records); setIsSubmitting(false); setSubmitted(true);
            setTimeout(() => setSubmitted(false), 2000);
        }, 800);
    };

    const getStatusColor = (status, isActive) => {
        if (!isActive) return 'bg-white dark:bg-stone-800 text-stone-400 dark:text-stone-600 border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-700';
        switch (status) {
            case 'present': return 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900/40 dark:text-green-300 dark:border-green-700 shadow-sm';
            case 'absent': return 'bg-red-100 text-red-800 border-red-300 dark:bg-red-900/40 dark:text-red-300 dark:border-red-700 shadow-sm';
            case 'late': return 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/40 dark:text-amber-300 dark:border-amber-700 shadow-sm';
            default: return '';
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <div className="bg-white dark:bg-stone-900 p-8 rounded-2xl shadow-md border border-stone-200 dark:border-stone-800">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                    <div>
                        <h2 className="text-3xl font-bold text-stone-800 dark:text-stone-100">Class Register</h2>
                        <p className="text-stone-500 dark:text-stone-400 text-base mt-1">Marking as: <span className="font-bold text-green-600 dark:text-green-400">{currentFaculty?.name}</span></p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <select
                            value={selectedCourse}
                            onChange={(e) => setSelectedCourse(e.target.value)}
                            className="px-4 py-3 border border-stone-300 dark:border-stone-700 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-stone-800 dark:text-stone-200 shadow-sm"
                        >
                            {courses.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>

                        <select
                            value={selectedSubject}
                            onChange={(e) => setSelectedSubject(e.target.value)}
                            className="px-4 py-3 border border-stone-300 dark:border-stone-700 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-stone-800 dark:text-stone-200 shadow-sm"
                        >
                            {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto rounded-xl border border-stone-200 dark:border-stone-800">
                    <table className="w-full text-left border-collapse">
                        <thead>
                        <tr className="border-b border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900">
                            <th className="py-4 px-6 text-sm font-bold text-stone-600 dark:text-stone-400 uppercase tracking-wider">Student Name</th>
                            <th className="py-4 px-6 text-sm font-bold text-stone-600 dark:text-stone-400 uppercase tracking-wider">Roll No</th>
                            <th className="py-4 px-6 text-sm font-bold text-stone-600 dark:text-stone-400 uppercase tracking-wider text-center">Status</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                        {classStudents.map(student => (
                            <tr key={student.id} className="hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors">
                                <td className="py-4 px-6 text-stone-800 dark:text-stone-200 font-bold text-base">{student.name}</td>
                                <td className="py-4 px-6 text-stone-500 dark:text-stone-400 text-sm font-mono">{student.rollNo}</td>
                                <td className="py-4 px-6">
                                    <div className="flex justify-center gap-2 bg-stone-100 dark:bg-stone-800 p-1.5 rounded-xl w-fit mx-auto shadow-inner">
                                        {['present', 'late', 'absent'].map((status) => (
                                            <button
                                                key={status}
                                                onClick={() => setStatus(student.id, status)}
                                                className={`
                            px-4 py-2 text-sm font-bold rounded-lg transition-all border
                            ${getStatusColor(status, attendanceState[student.id] === status)}
                          `}
                                            >
                                                {status.charAt(0).toUpperCase() + status.slice(1)}
                                            </button>
                                        ))}
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                <div className="mt-8 flex justify-end">
                    <button
                        onClick={handleSave}
                        disabled={isSubmitting || classStudents.length === 0}
                        className={`
              flex items-center gap-3 px-8 py-3 rounded-xl font-bold text-white text-lg transition-all shadow-lg hover:shadow-xl hover:-translate-y-1
              ${submitted ? 'bg-green-600 hover:bg-green-700' : 'bg-stone-900 dark:bg-stone-700 hover:bg-stone-800'}
              ${isSubmitting ? 'opacity-70 cursor-wait' : ''}
            `}
                    >
                        {submitted ? <CheckCircle size={24} /> : <Save size={24} />}
                        {submitted ? 'Saved Successfully' : isSubmitting ? 'Saving...' : 'Save Attendance Record'}
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- Student Manager ---
const StudentManager = ({ students, onAddStudent, onDeleteStudent }) => {
    const [newStudent, setNewStudent] = useState({ name: '', rollNo: '', course: 'B.Tech CSE 2024-28' });
    const [isAdding, setIsAdding] = useState(false);
    const handleSubmit = (e) => { e.preventDefault(); if (!newStudent.name || !newStudent.rollNo) return; onAddStudent({ ...newStudent, id: Date.now().toString() }); setNewStudent({ name: '', rollNo: '', course: 'B.Tech CSE 2024-28' }); setIsAdding(false); };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center"><h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100">Student Database</h2><button onClick={() => setIsAdding(!isAdding)} className="flex items-center gap-2 bg-stone-900 dark:bg-stone-700 text-white px-4 py-2 rounded-lg hover:bg-stone-800 transition-colors">{isAdding ? <X size={18} /> : <Plus size={18} />}<span>{isAdding ? 'Cancel' : 'Add Student'}</span></button></div>
            {isAdding && (
                <div className="bg-white dark:bg-stone-900 p-6 rounded-xl shadow-sm border border-stone-200 dark:border-stone-800 animate-in fade-in slide-in-from-top-4">
                    <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 items-end">
                        <div className="flex-1 space-y-1 w-full"><label className="text-xs font-medium text-stone-500 dark:text-stone-400">Name</label><input type="text" value={newStudent.name} onChange={(e) => setNewStudent({...newStudent, name: e.target.value})} className="w-full px-3 py-2 border border-stone-300 dark:border-stone-700 dark:bg-stone-800 dark:text-white rounded-lg" placeholder="Name" /></div>
                        <div className="flex-1 space-y-1 w-full"><label className="text-xs font-medium text-stone-500 dark:text-stone-400">Roll No</label><input type="text" value={newStudent.rollNo} onChange={(e) => setNewStudent({...newStudent, rollNo: e.target.value})} className="w-full px-3 py-2 border border-stone-300 dark:border-stone-700 dark:bg-stone-800 dark:text-white rounded-lg" placeholder="Roll No" /></div>
                        <button type="submit" className="w-full md:w-auto bg-green-700 text-white px-6 py-2 rounded-lg hover:bg-green-800 font-medium">Save</button>
                    </form>
                </div>
            )}
            <div className="bg-white dark:bg-stone-900 rounded-xl shadow-sm border border-stone-200 dark:border-stone-800 overflow-hidden"><div className="overflow-x-auto"><table className="w-full text-left"><thead className="bg-stone-50 dark:bg-stone-800 text-stone-500 dark:text-stone-400 text-xs uppercase font-semibold"><tr><th className="px-6 py-3">Roll No</th><th className="px-6 py-3">Name</th><th className="px-6 py-3">Course</th><th className="px-6 py-3 text-right">Actions</th></tr></thead><tbody className="divide-y divide-stone-100 dark:divide-stone-800 text-sm">{students.map(student => (<tr key={student.id} className="hover:bg-stone-50 dark:hover:bg-stone-800/50"><td className="px-6 py-3 font-mono text-stone-600 dark:text-stone-300">{student.rollNo}</td><td className="px-6 py-3 font-medium text-stone-800 dark:text-stone-200">{student.name}</td><td className="px-6 py-3 text-stone-500 dark:text-stone-400">{student.course}</td><td className="px-6 py-3 text-right"><button onClick={() => onDeleteStudent(student.id)} className="text-stone-400 hover:text-red-600 transition-colors"><Trash2 size={16} /></button></td></tr>))}</tbody></table></div></div>
        </div>
    );
};

// --- Role Selection (Entry Point) ---
const RoleSelection = ({ onSelectFaculty, onSelectStudent, students, toggleTheme, isDarkMode }) => {
    const [selectedStudent, setSelectedStudent] = useState('');
    const [selectedFaculty, setSelectedFaculty] = useState('');

    const handleStudentLogin = (e) => { e.preventDefault(); if (selectedStudent) onSelectStudent(selectedStudent); };
    const handleFacultyLogin = (e) => { e.preventDefault(); if (selectedFaculty) onSelectFaculty(selectedFaculty); };

    return (
        <div className="w-full min-h-screen bg-stone-50 dark:bg-stone-950 flex items-center justify-center p-4 transition-colors">
            <div className="max-w-4xl w-full bg-white dark:bg-stone-900 rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden relative flex flex-col md:flex-row">

                {/* Left Side - Visual/Info */}
                <div className="w-full md:w-1/2 bg-stone-900 dark:bg-black p-12 text-white flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10"><Leaf size={300} /></div>
                    <div>
                        <div className="inline-flex items-center gap-3 mb-8">
                            <Logo className="h-10 w-auto" />
                            <span className="text-2xl font-bold tracking-tight">Bahra University</span>
                        </div>
                        <h2 className="text-4xl font-bold leading-tight mb-4">Welcome to the <br/>Attendance Portal</h2>
                        <p className="text-stone-400 text-lg">Your one-stop digital solution for academic tracking and performance analytics.</p>
                    </div>
                    <div className="mt-12 text-sm text-stone-500">
                        © 2024 Bahra University. All rights reserved.
                    </div>
                </div>

                {/* Right Side - Forms */}
                <div className="w-full md:w-1/2 p-8 md:p-12 relative bg-white dark:bg-stone-900">
                    {/* Fixed position toggle on mobile/desktop to ensure visibility */}
                    <div className="absolute top-6 right-6">
                        <ThemeToggle isDarkMode={isDarkMode} toggleTheme={toggleTheme} className="bg-stone-100 dark:bg-stone-800" />
                    </div>

                    <div className="space-y-8 mt-4">
                        <div className="p-6 bg-amber-50 dark:bg-amber-900/10 rounded-2xl border border-amber-100 dark:border-amber-900/20 shadow-sm hover:shadow-md transition-shadow">
                            <div className="font-bold text-stone-800 dark:text-stone-100 flex items-center gap-3 mb-4 text-lg">
                                <div className="p-2 bg-amber-200 dark:bg-amber-800 rounded-lg text-amber-900 dark:text-amber-100"><UserCheck size={20} /></div>
                                Faculty Login
                            </div>
                            <form onSubmit={handleFacultyLogin} className="space-y-4">
                                <select value={selectedFaculty} onChange={(e) => setSelectedFaculty(e.target.value)} className="w-full p-3 text-base border border-stone-300 dark:border-stone-600 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-200 shadow-sm" required>
                                    <option value="">Select Faculty Member...</option>
                                    {FACULTIES.map(f => (<option key={f.id} value={f.id}>{f.name}</option>))}
                                </select>
                                <button type="submit" disabled={!selectedFaculty} className="w-full bg-amber-700 text-white py-3 rounded-xl text-base font-bold hover:bg-amber-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg">Login as Faculty</button>
                            </form>
                        </div>

                        <div className="relative py-2">
                            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-stone-200 dark:border-stone-700"></div></div>
                            <div className="relative flex justify-center text-sm font-medium text-stone-400 dark:text-stone-500 uppercase tracking-widest"><span className="px-4 bg-white dark:bg-stone-900">Or continue as</span></div>
                        </div>

                        <div className="p-6 bg-stone-50 dark:bg-stone-800/50 rounded-2xl border border-stone-200 dark:border-stone-700 shadow-sm hover:shadow-md transition-shadow">
                            <div className="font-bold text-stone-800 dark:text-stone-100 flex items-center gap-3 mb-4 text-lg">
                                <div className="p-2 bg-green-200 dark:bg-green-800 rounded-lg text-green-900 dark:text-green-100"><GraduationCap size={20} /></div>
                                Student Portal
                            </div>
                            <form onSubmit={handleStudentLogin} className="space-y-4">
                                <select value={selectedStudent} onChange={(e) => setSelectedStudent(e.target.value)} className="w-full p-3 text-base border border-stone-300 dark:border-stone-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:outline-none bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-200 shadow-sm" required>
                                    <option value="">Select Student Name...</option>
                                    {students.map(s => (<option key={s.id} value={s.id}>{s.name} ({s.rollNo})</option>))}
                                </select>
                                <button type="submit" disabled={!selectedStudent} className="w-full bg-green-700 text-white py-3 rounded-xl text-base font-bold hover:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg">Login as Student</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- App Entry Point ---

export default function App() {
    const [activeView, setActiveView] = useState('dashboard');
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [viewMode, setViewMode] = useState('selection');
    const [currentStudentId, setCurrentStudentId] = useState(null);
    const [currentFaculty, setCurrentFaculty] = useState(null);
    const [darkMode, setDarkMode] = useState(false);

    // App Data State (Mock Database)
    const [students, setStudents] = useState(INITIAL_STUDENTS);
    const [logs, setLogs] = useState(INITIAL_LOGS);

    // Handlers
    const handleAddStudent = (student) => {
        setStudents(prev => [...prev, student]);
    };

    const handleDeleteStudent = (id) => {
        setStudents(prev => prev.filter(s => s.id !== id));
    };

    const handleSubmitAttendance = (newRecords) => {
        const recordsWithIds = newRecords.map((r, i) => ({ ...r, id: `log-${Date.now()}-${i}` }));
        setLogs(prev => [...recordsWithIds, ...prev]);
    };

    const handleLogout = () => {
        setViewMode('selection');
        setCurrentStudentId(null);
        setCurrentFaculty(null);
        setActiveView('dashboard');
    };

    const handleFacultySelect = (facultyId) => {
        const faculty = FACULTIES.find(f => f.id === facultyId);
        if (faculty) {
            setCurrentFaculty(faculty);
            setViewMode('faculty');
        }
    };

    const toggleTheme = () => {
        setDarkMode(prev => !prev);
    };

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [darkMode]);

    return (
        <div className={`min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 transition-colors duration-200 ${darkMode ? 'dark' : ''}`}>
            {/* View Container */}
            <div className="flex h-screen overflow-hidden">

                {viewMode === 'selection' ? (
                    <div className="flex-1 h-full overflow-y-auto">
                        <RoleSelection
                            onSelectFaculty={handleFacultySelect}
                            onSelectStudent={(id) => { setCurrentStudentId(id); setViewMode('student'); }}
                            students={students}
                            toggleTheme={toggleTheme}
                            isDarkMode={darkMode}
                        />
                    </div>
                ) : viewMode === 'student' ? (
                    <div className="flex-1 h-full overflow-y-auto">
                        <StudentPortal
                            studentId={currentStudentId}
                            students={students}
                            logs={logs}
                            onLogout={handleLogout}
                            toggleTheme={toggleTheme}
                            isDarkMode={darkMode}
                        />
                    </div>
                ) : (
                    /* Faculty View Wrapper */
                    <>
                        <Sidebar
                            activeView={activeView}
                            setActiveView={setActiveView}
                            isMobileOpen={isMobileOpen}
                            setIsMobileOpen={setIsMobileOpen}
                            onLogout={handleLogout}
                            currentFaculty={currentFaculty}
                        />

                        <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
                            <header className="lg:hidden bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 p-4 flex items-center justify-between z-10 shrink-0">
                                <div className="flex items-center gap-2 font-bold text-lg text-stone-800 dark:text-stone-100">
                                    <Logo className="h-8 w-auto" />
                                    <span>Bahra</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <ThemeToggle isDarkMode={darkMode} toggleTheme={toggleTheme} />
                                    <button onClick={() => setIsMobileOpen(true)} className="p-2 text-stone-600 dark:text-stone-400">
                                        <Menu size={24} />
                                    </button>
                                </div>
                            </header>

                            {/* Desktop Theme Toggle - Moved OUTSIDE of the scrolling main area */}
                            <div className="absolute top-6 right-8 hidden lg:block z-50">
                                <ThemeToggle isDarkMode={darkMode} toggleTheme={toggleTheme} className="bg-white dark:bg-stone-800 shadow-sm border border-stone-200 dark:border-stone-700" />
                            </div>

                            <main className="flex-1 overflow-auto p-4 lg:p-8">
                                <div className="max-w-7xl mx-auto">
                                    {activeView === 'dashboard' && (
                                        <FacultyDashboard
                                            students={students}
                                            logs={logs}
                                            setActiveView={setActiveView}
                                        />
                                    )}

                                    {activeView === 'attendance' && (
                                        <AttendanceMarker
                                            students={students}
                                            onSubmit={handleSubmitAttendance}
                                            currentFaculty={currentFaculty}
                                        />
                                    )}

                                    {activeView === 'reports' && (
                                        <div className="space-y-6">
                                            <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100">Reports</h2>
                                            <div className="bg-white dark:bg-stone-900 p-6 rounded-xl border border-stone-200 dark:border-stone-800 text-center text-stone-500 dark:text-stone-400">
                                                <FileText size={48} className="mx-auto mb-4 text-stone-300 dark:text-stone-700" />
                                                <p>Detailed reports module would go here.</p>
                                                <p className="text-xs mt-2">Export to CSV / PDF</p>
                                            </div>
                                        </div>
                                    )}

                                    {activeView === 'students' && (
                                        <StudentManager
                                            students={students}
                                            onAddStudent={handleAddStudent}
                                            onDeleteStudent={handleDeleteStudent}
                                        />
                                    )}
                                </div>
                            </main>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}