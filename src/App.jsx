import React, { useState, useEffect, useRef } from 'react';
import { Dumbbell, List, Play, Plus, Trash2, Check, X, Save, History, ChevronRight, BarChart2, Pencil, ArrowUp, ArrowDown, Cloud, CloudOff, LogOut, Link } from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { getFirestore, doc, setDoc, onSnapshot } from 'firebase/firestore';

// --- MOTYWY WIZUALNE DLA PROFILI (JASNE) ---
const themes = {
  turtle: {
    textMain: 'text-emerald-600',
    bgMain10: 'bg-emerald-50',
    borderMain20: 'border-emerald-200',
    ringMain50: 'focus:ring-emerald-500/30',
    focusRingMain: 'focus:ring-emerald-500',
    focusBorderMain: 'focus:border-emerald-500',
    fillMain20: 'fill-emerald-100',
    gradMainSec: 'from-emerald-400 to-teal-500',
    navGrad: 'from-emerald-100/50',
    
    hoverBgMain10: 'hover:bg-emerald-50',
    hoverBgMain20: 'hover:bg-emerald-100',
    hoverTextMain: 'hover:text-emerald-600',
    hoverBorderMain50: 'hover:border-emerald-300',
    
    groupHoverTextMain: 'group-hover:text-emerald-600',
    gradHover: 'group-hover:from-emerald-400 group-hover:to-teal-500',
    shadowMain20: 'shadow-emerald-500/30',
    groupHoverShadowMain20: 'group-hover:shadow-emerald-500/20',

    textSec: 'text-teal-600',
    bgSec10: 'bg-teal-50',
    bgSec30: 'bg-teal-100',
    borderSec: 'border-teal-200',
    fillSec20: 'fill-teal-100',
    
    hoverBgSec20: 'hover:bg-teal-100',
    hoverFillSec40: 'hover:fill-teal-200',
    
    chartSecFill: '#0d9488'
  },
  blonde: {
    textMain: 'text-rose-500',
    bgMain10: 'bg-rose-50',
    borderMain20: 'border-rose-200',
    ringMain50: 'focus:ring-rose-500/30',
    focusRingMain: 'focus:ring-rose-500',
    focusBorderMain: 'focus:border-rose-500',
    fillMain20: 'fill-rose-100',
    gradMainSec: 'from-rose-400 to-red-400',
    navGrad: 'from-rose-100/50',
    
    hoverBgMain10: 'hover:bg-rose-50',
    hoverBgMain20: 'hover:bg-rose-100',
    hoverTextMain: 'hover:text-rose-600',
    hoverBorderMain50: 'hover:border-rose-300',
    
    groupHoverTextMain: 'group-hover:text-rose-500',
    gradHover: 'group-hover:from-rose-400 group-hover:to-red-400',
    shadowMain20: 'shadow-rose-500/30',
    groupHoverShadowMain20: 'group-hover:shadow-rose-500/20',

    textSec: 'text-red-500',
    bgSec10: 'bg-red-50',
    bgSec30: 'bg-red-100',
    borderSec: 'border-red-200',
    fillSec20: 'fill-red-100',
    
    hoverBgSec20: 'hover:bg-red-100',
    hoverFillSec40: 'hover:fill-red-200',
    
    chartSecFill: '#ef4444'
  }
};

const MuscleIcon = ({ category, className = "w-5 h-5" }) => {
  const cat = category === 'Klatka piersiowa' ? 'Klatka' : category;
  switch (cat) {
    case 'Klatka': return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 8c4-3 12-3 16 0" /><path d="M4 13c4 2 12 2 16 0" /><path d="M12 8v5" /></svg>;
    case 'Plecy': return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3L5 10l1 11h12l1-11z" /><path d="M12 3v18" /></svg>;
    case 'Nogi': return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5v14l-2 3" /><path d="M15 5v14l2 3" /><path d="M7 5h10" /></svg>;
    case 'Ramiona': return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 13a4 4 0 0 1 4-4h4a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-4a4 4 0 0 1-4-4z" /><path d="M8 13v-2a4 4 0 0 0-4-4H2" /></svg>;
    case 'Barki': return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 11a7 7 0 0 1 14 0v4" /><path d="M9 15v3" /><path d="M15 15v3" /></svg>;
    case 'Brzuch': return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="7" y="5" width="10" height="14" rx="2" /><path d="M7 10h10" /><path d="M7 14h10" /><path d="M12 5v14" /></svg>;
    default: return <Dumbbell className={className} />;
  }
};

const defaultExercises = [
  { id: '1', name: 'Wyciskanie sztangi leżąc', target: 'Klatka - Środek' },
  { id: '2', name: 'Przysiad ze sztangą', target: 'Nogi - Czworogłowy' },
  { id: '3', name: 'Martwy ciąg', target: 'Plecy - Dół' },
  { id: '4', name: 'Wyciskanie żołnierskie', target: 'Barki - Przód' }
];

const defaultRoutines = [
  { id: '1', name: 'Trening FBW (Full Body)', exercises: [{id: '2', linked: false}, {id: '1', linked: false}, {id: '3', linked: false}] }
];

const muscleGroups = {
  'Barki': ['Przód', 'Bok', 'Tył'],
  'Brzuch': ['Proste', 'Skośne'],
  'Klatka': ['Góra', 'Środek', 'Dół'],
  'Nogi': ['Czworogłowy', 'Dwugłowy', 'Łydki', 'Pośladki'],
  'Plecy': ['Góra', 'Dół', 'Kapturowe'],
  'Ramiona': ['Biceps', 'Triceps']
};

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => localStorage.getItem('gym_currentUser') || 'blonde');
  const theme = themes[currentUser];

  const [activeTab, setActiveTab] = useState('workout'); 
  
  const [user, setUser] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  const [exercises, setExercises] = useState(() => {
    const saved = localStorage.getItem('gym_exercises');
    return saved ? JSON.parse(saved) : defaultExercises;
  });
  
  const [routines, setRoutines] = useState(() => {
    const saved = localStorage.getItem('gym_routines');
    return saved ? JSON.parse(saved) : defaultRoutines;
  });
  
  const [historyTurtle, setHistoryTurtle] = useState(() => {
    const saved = localStorage.getItem('gym_history_turtle');
    return saved ? JSON.parse(saved) : (localStorage.getItem('gym_history') ? JSON.parse(localStorage.getItem('gym_history')) : []);
  });
  const [historyBlonde, setHistoryBlonde] = useState(() => {
    const saved = localStorage.getItem('gym_history_blonde');
    return saved ? JSON.parse(saved) : [];
  });
  const history = currentUser === 'turtle' ? historyTurtle : historyBlonde;
  const setHistory = currentUser === 'turtle' ? setHistoryTurtle : setHistoryBlonde;

  const [activeWorkoutTurtle, setActiveWorkoutTurtle] = useState(() => {
    const saved = localStorage.getItem('gym_activeWorkout_turtle');
    return saved ? JSON.parse(saved) : null;
  });
  const [activeWorkoutBlonde, setActiveWorkoutBlonde] = useState(() => {
    const saved = localStorage.getItem('gym_activeWorkout_blonde');
    return saved ? JSON.parse(saved) : null;
  });
  const activeWorkout = currentUser === 'turtle' ? activeWorkoutTurtle : activeWorkoutBlonde;
  const setActiveWorkout = currentUser === 'turtle' ? setActiveWorkoutTurtle : setActiveWorkoutBlonde;

  const [summaryData, setSummaryData] = useState(null);
  const [showFinishConfirm, setShowFinishConfirm] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false); 
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const [expandedCharts, setExpandedCharts] = useState({});
  const [selectedHistoryExercise, setSelectedHistoryExercise] = useState(null);

  const [db, setDb] = useState(null);
  const [auth, setAuth] = useState(null);
  const isCloudUpdate = useRef(false);

  useEffect(() => {
    const config = {
      apiKey: "TWOJE_API_KEY",
      authDomain: "TWOJA_DOMENA",
      projectId: "TWOJE_ID",
      storageBucket: "TWOJE_BUCKET",
      messagingSenderId: "TWOJE_SENDER_ID",
      appId: "TWOJE_APP_ID"
    };

    if (config.apiKey !== "TWOJE_API_KEY") {
      try {
        const app = initializeApp(config);
        const authInstance = getAuth(app);
        const dbInstance = getFirestore(app);
        setAuth(authInstance);
        setDb(dbInstance);

        const unsub = onAuthStateChanged(authInstance, (u) => {
          setUser(u);
          if (!u) {
            isCloudUpdate.current = false;
          }
        });
        return () => unsub();
      } catch(e) { console.error("Firebase init error:", e); }
    }
  }, []);

  useEffect(() => {
    if (!db || !user) return;
    const userDoc = doc(db, 'users', user.uid);
    const unsub = onSnapshot(userDoc, (docSnap) => {
       if (docSnap.exists()) {
          isCloudUpdate.current = true;
          const data = docSnap.data();
          if (data.exercises) setExercises(data.exercises);
          if (data.routines) setRoutines(data.routines);
          if (data.historyTurtle) setHistoryTurtle(data.historyTurtle);
          if (data.historyBlonde) setHistoryBlonde(data.historyBlonde);
          setTimeout(() => { isCloudUpdate.current = false; }, 500);
       }
    }, (err) => console.log("Cloud Error:", err));
    return () => unsub();
  }, [db, user]);

  useEffect(() => {
    if (!db || !user || isCloudUpdate.current) return;
    const userDoc = doc(db, 'users', user.uid);
    const stateToSave = { exercises, routines, historyTurtle, historyBlonde };
    setDoc(userDoc, stateToSave, { merge: true }).catch(e => console.error(e));
  }, [exercises, routines, historyTurtle, historyBlonde, db, user]);

  useEffect(() => { localStorage.setItem('gym_currentUser', currentUser); }, [currentUser]);
  useEffect(() => { localStorage.setItem('gym_exercises', JSON.stringify(exercises)); }, [exercises]);
  useEffect(() => { localStorage.setItem('gym_routines', JSON.stringify(routines)); }, [routines]);
  useEffect(() => { localStorage.setItem('gym_history_turtle', JSON.stringify(historyTurtle)); }, [historyTurtle]);
  useEffect(() => { localStorage.setItem('gym_history_blonde', JSON.stringify(historyBlonde)); }, [historyBlonde]);
  useEffect(() => { localStorage.setItem('gym_activeWorkout_turtle', JSON.stringify(activeWorkoutTurtle)); }, [activeWorkoutTurtle]);
  useEffect(() => { localStorage.setItem('gym_activeWorkout_blonde', JSON.stringify(activeWorkoutBlonde)); }, [activeWorkoutBlonde]);

  useEffect(() => { if (activeTab !== 'history') setSelectedHistoryExercise(null); }, [activeTab]);

  const handleAuth = async (type) => {
    setAuthError('');
    try {
      if (!auth) throw new Error("Skonfiguruj klucze chmury!");
      if (type === 'login') await signInWithEmailAndPassword(auth, email, password);
      else await createUserWithEmailAndPassword(auth, email, password);
      setShowLoginModal(false);
    } catch (err) { setAuthError("Błąd: " + err.message); }
  };

  const handleLogout = () => {
    if (auth) signOut(auth);
    setUser(null);
  };

  const [newExerciseName, setNewExerciseName] = useState('');
  const [newExerciseCategory, setNewExerciseCategory] = useState('');
  const [newExerciseSubcategory, setNewExerciseSubcategory] = useState('');

  const addExercise = () => {
    if (!newExerciseName.trim() || !newExerciseCategory || !newExerciseSubcategory) return;
    const newEx = { id: Date.now().toString(), name: newExerciseName, target: `${newExerciseCategory} - ${newExerciseSubcategory}` };
    setExercises([...exercises, newEx]);
    setNewExerciseName(''); setNewExerciseCategory(''); setNewExerciseSubcategory('');
  };

  const deleteExercise = (id) => setExercises(exercises.filter(ex => ex.id !== id));

  const [isCreatingRoutine, setIsCreatingRoutine] = useState(false);
  const [editingRoutineId, setEditingRoutineId] = useState(null); 
  const [newRoutineName, setNewRoutineName] = useState('');
  const [selectedExercisesForRoutine, setSelectedExercisesForRoutine] = useState([]);

  const openRoutineEditor = (routine = null) => {
    if (routine) {
      setEditingRoutineId(routine.id); 
      setNewRoutineName(routine.name); 
      // Migracja: jeśli stare plany miały same stringi, zamień na obiekty do obsługi superserii
      setSelectedExercisesForRoutine(routine.exercises.map(ex => typeof ex === 'string' ? {id: ex, linked: false} : ex));
    } else {
      setEditingRoutineId(null); setNewRoutineName(''); setSelectedExercisesForRoutine([]);
    }
    setIsCreatingRoutine(true);
  };

  const toggleLink = (idx) => {
    const newSelected = [...selectedExercisesForRoutine];
    newSelected[idx].linked = !newSelected[idx].linked;
    setSelectedExercisesForRoutine(newSelected);
  };

  const moveExercise = (index, direction) => {
    const newSelected = [...selectedExercisesForRoutine];
    if (direction === 'up' && index > 0) [newSelected[index - 1], newSelected[index]] = [newSelected[index], newSelected[index - 1]];
    else if (direction === 'down' && index < newSelected.length - 1) [newSelected[index + 1], newSelected[index]] = [newSelected[index], newSelected[index + 1]];
    
    // Zabezpieczenie: ostatni element nie może być połączony z "niczym"
    if (newSelected.length > 0) newSelected[newSelected.length - 1].linked = false;
    setSelectedExercisesForRoutine(newSelected);
  };

  const saveRoutine = () => {
    if (!newRoutineName.trim() || selectedExercisesForRoutine.length === 0) return;
    
    const finalExercises = [...selectedExercisesForRoutine];
    if (finalExercises.length > 0) finalExercises[finalExercises.length - 1].linked = false; // bezpieczeństwo

    if (editingRoutineId) {
      setRoutines(routines.map(r => r.id === editingRoutineId ? { ...r, name: newRoutineName, exercises: finalExercises } : r));
    } else {
      setRoutines([...routines, { id: Date.now().toString(), name: newRoutineName, exercises: finalExercises }]);
    }
    setIsCreatingRoutine(false); setEditingRoutineId(null); setNewRoutineName(''); setSelectedExercisesForRoutine([]);
  };

  const deleteRoutine = (id) => setRoutines(routines.filter(r => r.id !== id));

  const startWorkout = (routine) => {
    // Migracja wsteczna dla starych planów w momencie startu
    const exList = routine.exercises.map(ex => typeof ex === 'string' ? { id: ex, linked: false } : ex);
    setActiveWorkout({
      id: Date.now().toString(), routineName: routine.name, startTime: new Date().toISOString(),
      exercises: exList.map(ex => ({ exerciseId: ex.id, linked: ex.linked || false, sets: [{ weight: '', reps: '' }] }))
    });
  };

  const finishWorkout = () => {
    const endTime = new Date();
    const startTime = new Date(activeWorkout.startTime);
    const diffMs = endTime - startTime;
    const diffMins = Math.floor(diffMs / 60000);
    const diffSecs = Math.floor((diffMs % 60000) / 1000);

    let totalVolume = 0;
    const exerciseSummaries = activeWorkout.exercises.map(workoutEx => {
      const exerciseDetails = exercises.find(e => e.id === workoutEx.exerciseId);
      let exVolume = 0;
      workoutEx.sets.forEach(set => {
        const w = parseFloat(String(set.weight).replace(',', '.')) || 0;
        const r = parseInt(set.reps) || 0;
        if (w > 0 && r > 0) exVolume += (w * r);
      });
      totalVolume += exVolume;
      return { name: exerciseDetails?.name || 'Nieznane ćwiczenie', volume: exVolume };
    });

    const summary = {
      id: Date.now().toString(), routineName: activeWorkout.routineName, date: endTime.toLocaleDateString(),
      timestamp: endTime.toISOString(), duration: `${diffMins} min ${diffSecs} s`, totalVolume, exerciseSummaries, exercises: activeWorkout.exercises
    };

    setHistory([summary, ...history]); setSummaryData(summary); setActiveWorkout(null); setShowFinishConfirm(false);
  };

  const addSet = (exerciseIndex) => {
    const updatedWorkout = { ...activeWorkout };
    const lastSet = updatedWorkout.exercises[exerciseIndex].sets.slice(-1)[0];
    updatedWorkout.exercises[exerciseIndex].sets.push({ weight: lastSet ? lastSet.weight : '', reps: lastSet ? lastSet.reps : '' });
    setActiveWorkout(updatedWorkout);
  };

  const updateSet = (exerciseIndex, setIndex, field, value) => {
    const updatedWorkout = { ...activeWorkout };
    updatedWorkout.exercises[exerciseIndex].sets[setIndex][field] = value;
    setActiveWorkout(updatedWorkout);
  };

  // --- KOMPONENTY WIDOKÓW ---

  const LibraryView = () => (
    <div className="p-4 space-y-6 pb-32">
      <div className="bg-white p-5 rounded-[32px] shadow-xl shadow-slate-200/40 border border-slate-100">
        <h3 className="font-bold text-lg mb-4 text-slate-800">Dodaj nowe ćwiczenie</h3>
        <div className="space-y-3">
          <input 
            type="text" 
            placeholder="Nazwa ćwiczenia (np. Wyciskanie hantli)" 
            className={`w-full p-3.5 bg-slate-50 border border-slate-200 text-slate-800 rounded-2xl focus:ring-2 ${theme.ringMain50} ${theme.focusBorderMain} outline-none placeholder-slate-400 transition-all font-medium`}
            value={newExerciseName}
            onChange={(e) => setNewExerciseName(e.target.value)}
          />
          
          <div className="flex items-center gap-3">
            {newExerciseCategory && (
              <div className={`w-14 h-14 shrink-0 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-center ${theme.textMain} shadow-sm animate-in fade-in zoom-in duration-300`}>
                <MuscleIcon category={newExerciseCategory} className="w-6 h-6" />
              </div>
            )}
            <div className="relative flex-1">
              <select
                className={`w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 ${theme.ringMain50} ${theme.focusBorderMain} outline-none transition-all appearance-none cursor-pointer font-medium ${!newExerciseCategory ? 'text-slate-400' : 'text-slate-800'}`}
                value={newExerciseCategory}
                onChange={(e) => { setNewExerciseCategory(e.target.value); setNewExerciseSubcategory(''); }}
              >
                <option value="" disabled>Partia mięśniowa...</option>
                {Object.keys(muscleGroups).map(cat => <option key={cat} value={cat} className="text-slate-800">{cat}</option>)}
              </select>
              <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none rotate-90" size={18} />
            </div>
          </div>

          {newExerciseCategory && (
            <div className="relative animate-in fade-in slide-in-from-top-2 duration-300">
              <select
                className={`w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 ${theme.ringMain50} ${theme.focusBorderMain} outline-none transition-all appearance-none cursor-pointer font-medium ${!newExerciseSubcategory ? 'text-slate-400' : 'text-slate-800'}`}
                value={newExerciseSubcategory}
                onChange={(e) => setNewExerciseSubcategory(e.target.value)}
              >
                <option value="" disabled>Wybierz podkategorię...</option>
                {muscleGroups[newExerciseCategory].map(sub => <option key={sub} value={sub} className="text-slate-800">{sub}</option>)}
              </select>
              <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none rotate-90" size={18} />
            </div>
          )}

          <button 
            onClick={addExercise}
            disabled={!newExerciseName.trim() || !newExerciseCategory || !newExerciseSubcategory}
            className={`w-full bg-gradient-to-r ${theme.gradMainSec} text-white p-4 rounded-2xl font-bold flex items-center justify-center gap-2 mt-4 shadow-lg ${theme.shadowMain20} disabled:opacity-50 disabled:grayscale transition-all hover:-translate-y-0.5`}
          >
            <Plus size={20} /> Dodaj do biblioteki
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="font-bold text-lg text-slate-800 pl-2">Twoje ćwiczenia</h3>
        {exercises.length === 0 ? (
          <p className="text-slate-400 text-center py-4 font-medium">Brak ćwiczeń. Dodaj jakieś powyżej!</p>
        ) : (
          exercises.map(ex => (
            <div key={ex.id} className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm shadow-slate-200/50 border border-slate-100 hover:border-slate-300 transition-colors">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center ${theme.textMain} shrink-0`}>
                  <MuscleIcon category={ex.target.split(' - ')[0]} className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-slate-800 leading-tight mb-1">{ex.name}</p>
                  <p className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">{ex.target}</p>
                </div>
              </div>
              <button onClick={() => deleteExercise(ex.id)} className="text-slate-400 p-2 hover:bg-red-50 hover:text-red-500 rounded-xl transition-colors ml-2 shrink-0">
                <Trash2 size={18} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );

  const RoutinesView = () => (
    <div className="p-4 space-y-6 pb-32">
      {!isCreatingRoutine ? (
        <>
          <button 
            onClick={() => openRoutineEditor(null)}
            className={`w-full bg-gradient-to-r ${theme.gradMainSec} text-white p-5 rounded-3xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] shadow-xl ${theme.shadowMain20} transition-all`}
          >
            <Plus size={22} strokeWidth={2.5} /> Stwórz nowy plan
          </button>

          <div className="space-y-4">
            <h3 className="font-bold text-lg text-slate-800 pl-2">Twoje plany</h3>
            {routines.length === 0 ? (
              <p className="text-slate-400 text-center py-4 font-medium">Nie masz jeszcze żadnych planów.</p>
            ) : (
              routines.map(routine => (
                <div key={routine.id} className="bg-white p-5 rounded-[32px] shadow-lg shadow-slate-200/40 border border-slate-100 flex justify-between items-center hover:border-slate-300 transition-all group">
                  <div>
                    <h4 className="font-bold text-xl text-slate-800 group-hover:text-slate-900 transition-colors">{routine.name}</h4>
                    <p className="text-sm font-medium text-slate-400 mt-1">{routine.exercises.length} ćwiczeń</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => openRoutineEditor(routine)} className={`text-slate-400 p-3 bg-slate-50 hover:bg-slate-100 ${theme.hoverTextMain} rounded-2xl transition-colors`}>
                      <Pencil size={20} />
                    </button>
                    <button onClick={() => deleteRoutine(routine.id)} className="text-slate-400 p-3 bg-slate-50 hover:bg-red-50 hover:text-red-500 rounded-2xl transition-colors">
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      ) : (
        <div className="bg-white p-6 rounded-[32px] shadow-xl shadow-slate-200/50 border border-slate-100 space-y-5">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-xl text-slate-800">{editingRoutineId ? "Edytuj plan" : "Nowy plan"}</h3>
            <button onClick={() => { setIsCreatingRoutine(false); setEditingRoutineId(null); }} className="text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 p-2 rounded-full transition-colors">
              <X size={20} strokeWidth={3} />
            </button>
          </div>
          
          <input 
            type="text" 
            placeholder="Nazwa planu (np. Push Day)" 
            className={`w-full p-4 bg-slate-50 border border-slate-200 text-slate-800 rounded-2xl focus:ring-2 ${theme.ringMain50} ${theme.focusBorderMain} outline-none font-bold placeholder-slate-400 transition-all text-lg`}
            value={newRoutineName}
            onChange={(e) => setNewRoutineName(e.target.value)}
          />

          <div className="mt-6 space-y-5">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Wybrane ćwiczenia</p>
              {selectedExercisesForRoutine.length === 0 ? (
                <p className="text-sm text-slate-400 italic border-2 border-dashed border-slate-200 rounded-2xl p-4 text-center font-medium">Brak wybranych ćwiczeń.</p>
              ) : (
                <div className="space-y-0 flex flex-col">
                  {selectedExercisesForRoutine.map((item, idx) => {
                    const ex = exercises.find(e => e.id === item.id);
                    if(!ex) return null;
                    return (
                      <React.Fragment key={item.id + idx}>
                        <div className={`flex items-center justify-between ${theme.bgMain10} border ${theme.borderMain20} p-3 rounded-2xl relative z-20 shadow-sm`}>
                          <div className="flex items-center gap-3 overflow-hidden">
                            <span className={`w-6 h-6 shrink-0 bg-white rounded-full flex items-center justify-center text-[10px] font-bold ${theme.textMain} shadow-sm`}>{idx + 1}</span>
                            <span className={`font-bold ${theme.textMain} text-sm truncate pr-2`}>{ex.name}</span>
                          </div>
                          <div className="flex items-center gap-1 shrink-0 bg-white/50 rounded-xl p-1">
                            <button onClick={() => moveExercise(idx, 'up')} disabled={idx === 0} className="p-1.5 text-slate-400 hover:text-slate-800 disabled:opacity-30 transition-colors"><ArrowUp size={16}/></button>
                            <button onClick={() => moveExercise(idx, 'down')} disabled={idx === selectedExercisesForRoutine.length - 1} className="p-1.5 text-slate-400 hover:text-slate-800 disabled:opacity-30 transition-colors"><ArrowDown size={16}/></button>
                            <div className="w-px h-4 bg-slate-200 mx-1"></div>
                            <button onClick={() => setSelectedExercisesForRoutine(selectedExercisesForRoutine.filter((_, i) => i !== idx))} className="p-1.5 text-rose-400 hover:text-rose-600 transition-colors"><Trash2 size={16}/></button>
                          </div>
                        </div>
                        
                        {/* PRZYCISK ŁĄCZENIA W SUPERSERIĘ */}
                        {idx < selectedExercisesForRoutine.length - 1 && (
                          <div className="flex justify-center -my-2.5 relative z-10">
                             <button 
                               onClick={() => toggleLink(idx)} 
                               className={`p-1.5 rounded-full border-[3px] transition-all duration-300 ${item.linked ? `bg-slate-800 border-white text-white shadow-md z-30 scale-110` : 'bg-white border-slate-100 text-slate-300 hover:text-slate-500 hover:bg-slate-50 z-10'}`} 
                               title="Połącz w superserię"
                             >
                                <Link size={14} strokeWidth={item.linked ? 3 : 2} />
                             </button>
                          </div>
                        )}
                      </React.Fragment>
                    )
                  })}
                </div>
              )}
            </div>

            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Dostępne ćwiczenia</p>
              <div className="max-h-56 overflow-y-auto space-y-2 border border-slate-100 rounded-2xl p-2 bg-slate-50/50 custom-scrollbar">
                {exercises.filter(ex => !selectedExercisesForRoutine.some(s => s.id === ex.id)).map(ex => (
                  <div 
                    key={ex.id} 
                    onClick={() => setSelectedExercisesForRoutine([...selectedExercisesForRoutine, {id: ex.id, linked: false}])} 
                    className="flex items-center justify-between bg-white border border-slate-100 shadow-sm hover:shadow-md hover:border-slate-300 p-3.5 rounded-xl cursor-pointer transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-slate-400 bg-slate-50 p-2.5 rounded-xl shrink-0">
                        <MuscleIcon category={ex.target.split(' - ')[0]} className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-slate-700 text-sm font-bold block">{ex.name}</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{ex.target}</span>
                      </div>
                    </div>
                    <div className={`w-8 h-8 shrink-0 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center ${theme.textMain} shadow-sm`}>
                      <Plus size={16} strokeWidth={3} />
                    </div>
                  </div>
                ))}
                {exercises.filter(ex => !selectedExercisesForRoutine.some(s => s.id === ex.id)).length === 0 && (
                  <p className="text-sm text-slate-400 text-center py-6 font-medium">Wszystkie ćwiczenia dodane!</p>
                )}
              </div>
            </div>
          </div>

          <button 
            onClick={saveRoutine}
            disabled={!newRoutineName.trim() || selectedExercisesForRoutine.length === 0}
            className={`w-full bg-gradient-to-r ${theme.gradMainSec} text-white p-4 rounded-2xl font-bold flex items-center justify-center gap-2 mt-6 disabled:opacity-50 disabled:grayscale transition-all shadow-lg ${theme.shadowMain20} hover:-translate-y-0.5`}
          >
            <Save size={20} /> Zapisz plan
          </button>
        </div>
      )}
    </div>
  );

  const WorkoutDashboardView = () => {
    const getRoutineLastDone = (routineName) => {
      const pastWorkouts = history.filter(h => h.routineName === routineName);
      if (pastWorkouts.length === 0) return "Nigdy";
      
      const lastDate = new Date(pastWorkouts[0].timestamp || parseInt(pastWorkouts[0].id));
      const diffTime = Math.abs(new Date() - lastDate);
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) return "Dzisiaj";
      if (diffDays === 1) return "Wczoraj";
      return `${diffDays} dni temu`;
    };

    return (
      <div className="p-4 space-y-6 pb-32">
        <div className="px-2">
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Gotowy na trening? 💪</h2>
          <p className="text-slate-500 font-medium mt-1">Wybierz plan, aby rozpocząć wyciskanie.</p>
        </div>
        
        <div className="space-y-4">
          {routines.length === 0 ? (
            <div className="bg-white border border-slate-100 shadow-sm text-slate-500 p-8 rounded-[32px] text-center font-medium">
              Przejdź do zakładki "Plany", aby stworzyć swój pierwszy trening.
            </div>
          ) : (
            routines.map(routine => (
              <button 
                key={routine.id}
                onClick={() => startWorkout(routine)}
                className={`w-full bg-white p-6 rounded-[32px] shadow-lg shadow-slate-200/50 border border-slate-100 flex justify-between items-center hover:border-slate-300 hover:shadow-xl hover:shadow-slate-200/60 transition-all group text-left`}
              >
                <div>
                  <h4 className={`font-black text-xl text-slate-800 ${theme.groupHoverTextMain} transition-colors`}>{routine.name}</h4>
                  <p className="text-sm font-bold text-slate-400 mt-1 uppercase tracking-wide">
                    {routine.exercises.length} ćwiczeń • Ostatnio: <span className="text-slate-500">{getRoutineLastDone(routine.name)}</span>
                  </p>
                </div>
                <div className={`bg-slate-50 border border-slate-100 ${theme.textMain} p-4 rounded-2xl group-hover:bg-gradient-to-r ${theme.gradHover} group-hover:text-white transition-all shadow-sm ${theme.groupHoverShadowMain20}`}>
                  <Play size={24} fill="currentColor" strokeWidth={1} />
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    );
  };

  const SummaryView = () => (
    <div className="p-6 flex flex-col items-center justify-center min-h-full space-y-8 py-12 pb-32">
      <div className={`w-28 h-28 bg-gradient-to-br ${theme.gradMainSec} rounded-full flex items-center justify-center shadow-2xl ${theme.shadowMain20} border-4 border-white`}>
        <Check size={56} className="text-white" strokeWidth={3} />
      </div>
      
      <div className="text-center space-y-2">
        <h2 className="text-4xl font-black text-slate-800 tracking-tight">Świetna robota!</h2>
        <p className="text-slate-500 font-bold text-lg">{summaryData.routineName}</p>
        <p className="text-slate-400 text-sm font-medium">{summaryData.date}</p>
      </div>

      <div className="w-full bg-white rounded-[32px] p-8 border border-slate-100 space-y-6 shadow-xl shadow-slate-200/50">
        <div className="flex justify-between items-center border-b border-slate-100 pb-5">
          <span className="text-slate-400 font-bold uppercase tracking-wide text-xs">Czas trwania</span>
          <span className="font-black text-2xl text-slate-800">{summaryData.duration}</span>
        </div>
        
        <div className="flex justify-between items-center border-b border-slate-100 pb-5">
          <span className="text-slate-400 font-bold uppercase tracking-wide text-xs">Przerzucony ciężar</span>
          <span className={`font-black text-3xl text-transparent bg-clip-text bg-gradient-to-r ${theme.gradMainSec}`}>{summaryData.totalVolume} kg</span>
        </div>

        <div className="pt-2">
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 text-center">Rozbicie na ćwiczenia</h4>
          <div className="space-y-3">
            {summaryData.exerciseSummaries.map((ex, idx) => {
              const exDetails = exercises.find(e => e.name === ex.name);
              const cat = exDetails ? exDetails.target.split(' - ')[0] : '';
              return (
                <div key={idx} className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-3 overflow-hidden pr-4">
                    <div className="text-slate-400 shrink-0 bg-white p-2 rounded-lg shadow-sm"><MuscleIcon category={cat} className="w-4 h-4"/></div>
                    <span className="text-slate-700 font-bold truncate text-sm">{ex.name}</span>
                  </div>
                  <span className={`font-black text-sm whitespace-nowrap ${theme.bgMain10} ${theme.textMain} px-3 py-1.5 rounded-xl shrink-0 border ${theme.borderMain20}`}>{ex.volume} kg</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <button
        onClick={() => setSummaryData(null)}
        className="w-full bg-slate-800 text-white py-4 rounded-2xl font-bold hover:bg-slate-900 transition-colors mt-4 shadow-lg shadow-slate-300"
      >
        Wróć do strony głównej
      </button>
    </div>
  );

  const ActiveWorkoutView = () => {
    const toggleChart = (exId) => {
      setExpandedCharts(prev => ({ ...prev, [exId]: !prev[exId] }));
    };

    const getLastExercisePerformance = (exerciseId) => {
      for (const session of history) {
        if (session.exercises) {
          const ex = session.exercises.find(e => e.exerciseId === exerciseId);
          if (ex && ex.sets && ex.sets.length > 0) {
            const validSets = ex.sets.filter(s => parseFloat(String(s.weight).replace(',', '.')) > 0 && parseInt(s.reps) > 0);
            if (validSets.length > 0) {
              const numSets = validSets.length;
              const bestSet = validSets.reduce((best, current) => {
                 const wBest = parseFloat(String(best.weight).replace(',', '.')) || 0;
                 const wCurr = parseFloat(String(current.weight).replace(',', '.')) || 0;
                 return wCurr > wBest ? current : best;
              }, validSets[0]);
              
              const serieLabel = numSets === 1 ? 'seria' : (numSets > 1 && numSets < 5 ? 'serie' : 'serii');
              return `Ostatnio: ${numSets} ${serieLabel} (max: ${bestSet.weight}kg x ${bestSet.reps})`;
            }
          }
        }
      }
      return "Brak historii dla tego ćwiczenia";
    };

    // ALGOTRYTM GRUPOWANIA SUPERSERII
    const groupedExercises = [];
    let currentGroup = [];
    activeWorkout.exercises.forEach((ex, idx) => {
      currentGroup.push({ ...ex, originalIndex: idx });
      if (!ex.linked) {
        groupedExercises.push(currentGroup);
        currentGroup = [];
      }
    });
    if (currentGroup.length > 0) groupedExercises.push(currentGroup); // Zabezpieczenie dla ostatniego elementu

    return (
      <div className="pb-32">
        <style>{`
          @keyframes shineSweep {
            0% { transform: translateX(-200%) skewX(-30deg); }
            100% { transform: translateX(200%) skewX(-30deg); }
          }
          @keyframes olympicGlow {
            0%, 100% { box-shadow: 0 0 15px rgba(250, 204, 21, 0.4), inset 0 0 20px rgba(250, 204, 21, 0.2); border-color: rgba(250, 204, 21, 0.7); }
            50% { box-shadow: 0 0 35px rgba(250, 204, 21, 0.8), inset 0 0 40px rgba(250, 204, 21, 0.4); border-color: rgba(253, 224, 71, 1); }
          }
          @keyframes intenseSparkle {
            0%, 100% { opacity: 0; transform: scale(0) rotate(0deg); }
            50% { opacity: 1; transform: scale(1.5) rotate(90deg); filter: brightness(1.5); }
          }
          .sparkle-1 { animation: intenseSparkle 2s infinite ease-in-out 0.1s; }
          .sparkle-2 { animation: intenseSparkle 3s infinite ease-in-out 1.2s; }
          .sparkle-3 { animation: intenseSparkle 2.5s infinite ease-in-out 0.5s; }
          .sparkle-4 { animation: intenseSparkle 3.2s infinite ease-in-out 1.8s; }
          .sparkle-5 { animation: intenseSparkle 2.2s infinite ease-in-out 2.5s; }
        `}</style>
        <div className="sticky top-0 bg-white/80 backdrop-blur-xl border-b border-slate-100 p-4 shadow-sm z-10 flex justify-between items-center rounded-b-[32px]">
          <div className="flex items-center gap-3 overflow-hidden">
            <div 
              onClick={() => setShowEasterEgg(true)}
              className="w-12 h-12 rounded-full border-[3px] border-white bg-slate-100 overflow-hidden flex items-center justify-center shrink-0 shadow-md cursor-pointer hover:scale-105 transition-transform"
            >
              <img 
                src="image_b14c62.jpg" 
                alt="Ronnie Coleman" 
                className="w-full h-full object-cover object-[center_15%] scale-125"
              />
            </div>
            <div className="truncate">
              <p className={`text-[10px] font-black uppercase tracking-widest mb-0.5 ${theme.textMain}`}>Aktywny trening</p>
              <h2 className="text-xl font-black text-slate-800 truncate">{activeWorkout.routineName}</h2>
            </div>
          </div>
          <button 
            onClick={() => setShowCancelConfirm(true)}
            className="text-slate-400 hover:text-red-500 bg-slate-50 hover:bg-red-50 p-3 rounded-full transition-all border border-slate-100 hover:border-red-100 shrink-0 ml-4 shadow-sm"
          >
            <X size={20} strokeWidth={3} />
          </button>
        </div>

        <div className="p-4 space-y-6">
          {groupedExercises.map((group, groupIdx) => {
            const isSuperset = group.length > 1;

            return (
              <div key={groupIdx} className={isSuperset ? "relative rounded-[36px] p-2.5 pt-9 border-[3px] border-yellow-400 bg-gradient-to-br from-yellow-100 via-amber-100 to-yellow-200 overflow-visible my-6" : ""}>
                {/* ETYKIETA SUPERSERII ORAZ ANIMACJE ZŁOTA */}
                {isSuperset && (
                  <>
                    <div className="absolute inset-0 rounded-[34px] overflow-hidden pointer-events-none z-0" style={{ animation: 'olympicGlow 3s ease-in-out infinite' }}>
                       {/* Błyszcząca fala świetlna (przesuwający się refleks) */}
                       <div className="absolute top-0 left-0 w-[50%] h-full bg-gradient-to-r from-transparent via-white/80 to-transparent pointer-events-none" style={{ animation: 'shineSweep 3s infinite linear' }}></div>
                       
                       {/* Bardzo mocne drobinki złota */}
                       <div className="absolute top-[10%] left-[10%] w-3 h-3 bg-white rounded-full sparkle-1 shadow-[0_0_15px_#fef08a]"></div>
                       <div className="absolute bottom-[20%] right-[5%] w-4 h-4 bg-yellow-100 rounded-full sparkle-2 shadow-[0_0_20px_#fde047]"></div>
                       <div className="absolute top-[50%] left-[3%] w-2 h-2 bg-white rounded-full sparkle-3 shadow-[0_0_10px_#fef08a]"></div>
                       <div className="absolute top-[25%] right-[12%] w-3 h-3 bg-yellow-50 rounded-full sparkle-4 shadow-[0_0_15px_#fde047]"></div>
                       <div className="absolute bottom-[10%] left-[40%] w-2.5 h-2.5 bg-white rounded-full sparkle-5 shadow-[0_0_12px_#fef08a]"></div>
                    </div>

                    <div className="absolute -top-5 left-6 bg-gradient-to-r from-yellow-300 via-yellow-100 to-amber-400 text-amber-900 text-[12px] font-black px-6 py-2.5 rounded-full uppercase tracking-widest shadow-[0_8px_20px_rgba(251,191,36,0.6)] flex items-center gap-2 z-20 border-[3px] border-white">
                      <Link size={16} strokeWidth={3} /> Superseria
                    </div>
                  </>
                )}
                
                <div className={isSuperset ? "relative z-10 space-y-3" : ""}>
                  {group.map((workoutEx) => {
                    const exIndex = workoutEx.originalIndex;
                    const exerciseDetails = exercises.find(e => e.id === workoutEx.exerciseId);
                    if (!exerciseDetails) return null;

                    return (
                      <div key={exIndex} className={`bg-white rounded-[32px] overflow-hidden ${isSuperset ? 'shadow-sm border border-slate-100' : 'shadow-xl shadow-slate-200/40 border border-slate-100'}`}>
                        <div className="bg-slate-50/50 p-5 border-b border-slate-100 flex justify-between items-center">
                          <div className="flex items-center gap-4">
                            <div className={`w-14 h-14 rounded-2xl bg-white border border-slate-100 flex items-center justify-center ${theme.textMain} shadow-sm shrink-0`}>
                              <MuscleIcon category={exerciseDetails.target.split(' - ')[0]} className="w-6 h-6" />
                            </div>
                            <div>
                              <div className="flex items-center gap-3">
                                <h3 className="font-black text-slate-800 text-lg">{exerciseDetails.name}</h3>
                                <button 
                                  onClick={() => toggleChart(exerciseDetails.id)} 
                                  className={`${theme.textSec} ${theme.bgSec10} p-2 rounded-xl ${theme.hoverBgSec20} transition-all shadow-sm shrink-0`}
                                >
                                  <BarChart2 size={18} strokeWidth={2.5} />
                                </button>
                              </div>
                              <p className={`text-[11px] font-bold uppercase tracking-wider mt-1 ${theme.textMain} opacity-80`}>{getLastExercisePerformance(exerciseDetails.id)}</p>
                            </div>
                          </div>
                        </div>
                        
                        {expandedCharts[exerciseDetails.id] && (
                          <div className="bg-white border-b border-slate-100 p-5">
                            {(() => {
                              const chartData = history
                                .filter(h => h.exercises?.some(e => e.exerciseId === exerciseDetails.id))
                                .slice(0, 6)
                                .map(session => {
                                  const exData = session.exercises.find(e => e.exerciseId === exerciseDetails.id);
                                  const validSets = exData.sets.filter(s => parseFloat(String(s.weight).replace(',', '.')) > 0 && parseInt(s.reps) > 0);
                                  const totalW = validSets.reduce((acc, s) => acc + parseFloat(String(s.weight).replace(',', '.')), 0);
                                  const totalR = validSets.reduce((acc, s) => acc + parseInt(s.reps), 0);
                                  return {
                                    date: session.date,
                                    shortDate: new Date(session.timestamp).toLocaleDateString('pl-PL', { day: '2-digit', month: '2-digit' }),
                                    avgW: validSets.length ? totalW / validSets.length : 0,
                                    avgR: validSets.length ? totalR / validSets.length : 0,
                                    sets: validSets
                                  };
                                })
                                .reverse();

                              if (chartData.length === 0) {
                                return <p className="text-sm text-slate-400 font-medium text-center py-4 bg-slate-50 rounded-2xl border border-slate-100">Brak zapisanej historii dla tego ćwiczenia.</p>;
                              }

                              const latest = chartData[chartData.length - 1];
                              const maxW = Math.max(...chartData.map(d => d.avgW), 10);
                              const maxR = Math.max(...chartData.map(d => d.avgR), 5);
                              
                              const width = 300;
                              const height = 150;
                              const padX = 20;
                              const padY = 25;
                              const chartW = width - padX * 2;
                              const chartH = height - padY * 2;
                              const spacing = chartData.length > 1 ? chartW / (chartData.length - 1) : 0;
                              const getX = (i) => chartData.length === 1 ? width / 2 : padX + i * spacing;
                              
                              const pointsLineW = chartData.map((d, i) => `${getX(i) - 8},${padY + chartH - (d.avgW / maxW) * chartH}`).join(' ');
                              const pointsLineR = chartData.map((d, i) => `${getX(i) + 8},${padY + chartH - (d.avgR / maxR) * chartH}`).join(' ');

                              return (
                                <div className="space-y-5">
                                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
                                    <h4 className="text-[10px] font-black text-slate-400 uppercase mb-3 tracking-widest text-center">Ostatnia sesja ({latest.date})</h4>
                                    {latest.sets.length === 0 ? (
                                      <p className="text-xs text-slate-400 text-center font-medium">Brak zapisanych poprawnie serii.</p>
                                    ) : (
                                      <>
                                        <div className="grid grid-cols-3 gap-2 text-[10px] text-slate-400 font-black border-b border-slate-200 pb-2 mb-3 uppercase tracking-widest">
                                          <div className="text-center">Seria</div>
                                          <div className="text-center">kg</div>
                                          <div className="text-center">Powt.</div>
                                        </div>
                                        <div className="space-y-2">
                                          {latest.sets.map((s, idx) => (
                                            <div key={idx} className="grid grid-cols-3 gap-2 text-xs text-slate-700 py-1 bg-white rounded-lg shadow-sm border border-slate-100">
                                              <div className="text-center font-black text-slate-400 py-1">#{idx + 1}</div>
                                              <div className={`text-center font-black ${theme.textSec} py-1`}>{s.weight}</div>
                                              <div className={`text-center font-black ${theme.textMain} py-1`}>{s.reps}</div>
                                            </div>
                                          ))}
                                        </div>
                                      </>
                                    )}
                                  </div>

                                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 relative">
                                    <div className="flex justify-between items-center mb-4">
                                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Wykres (max 6)</h4>
                                      <div className="flex gap-3 text-[9px] font-black uppercase tracking-wider">
                                        <span className={`${theme.textSec} flex items-center gap-1.5`}>
                                          <div className={`w-2.5 h-2.5 ${theme.bgSec30} border ${theme.borderSec} rounded-sm`}></div> ŚR. KG
                                        </span>
                                        <span className={`${theme.textMain} flex items-center gap-1.5`}>
                                          <div className={`w-2.5 h-2.5 ${theme.bgMain10} border ${theme.borderMain20} rounded-sm`}></div> ŚR. POWT.
                                        </span>
                                      </div>
                                    </div>
                                    
                                    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible mt-2">
                                      {/* Soft grid lines */}
                                      <line x1="0" y1={padY} x2={width} y2={padY} stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4 4" />
                                      <line x1="0" y1={padY + chartH/2} x2={width} y2={padY + chartH/2} stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4 4" />
                                      <line x1="0" y1={padY + chartH} x2={width} y2={padY + chartH} stroke="#cbd5e1" strokeWidth="1" />

                                      <polyline points={pointsLineW} fill="none" stroke={theme.chartSecFill} strokeWidth="2" strokeDasharray="4 4" className="opacity-40" />
                                      <polyline points={pointsLineR} fill="none" stroke={theme.textMain.replace('text-', '').split('-')[0] === 'emerald' ? '#10b981' : '#f43f5e'} strokeWidth="2" strokeDasharray="4 4" className="opacity-40" />

                                      {chartData.map((d, i) => {
                                        const x = getX(i);
                                        const xW = x - 8;
                                        const xR = x + 8;
                                        const hW = (d.avgW / maxW) * chartH;
                                        const yW = padY + chartH - hW;
                                        const hR = (d.avgR / maxR) * chartH;
                                        const yR = padY + chartH - hR;

                                        return (
                                          <g key={`day-${i}`}>
                                            <rect x={xW - 5} y={yW} width="10" height={hW} className={`${theme.fillSec20} ${theme.hoverFillSec40} transition-colors cursor-pointer`} rx="3" />
                                            <circle cx={xW} cy={yW} r="3" fill={theme.chartSecFill} stroke="#fff" strokeWidth="1.5" />
                                            <text x={xW} y={yW - 8} fontSize="9" fill={theme.chartSecFill} textAnchor="middle" fontWeight="bold">{Math.round(d.avgW)}</text>

                                            <rect x={xR - 5} y={yR} width="10" height={hR} className={`${theme.fillMain20} transition-colors cursor-pointer`} rx="3" />
                                            <circle cx={xR} cy={yR} r="3" fill={theme.textMain.replace('text-', '').split('-')[0] === 'emerald' ? '#10b981' : '#f43f5e'} stroke="#fff" strokeWidth="1.5" />
                                            <text x={xR} y={yR - 8} fontSize="9" fill={theme.textMain.replace('text-', '').split('-')[0] === 'emerald' ? '#10b981' : '#f43f5e'} textAnchor="middle" fontWeight="bold">{Math.round(d.avgR)}</text>

                                            <text x={x} y={height - 2} fontSize="9" fill="#94a3b8" textAnchor="middle" fontWeight="bold">{d.shortDate}</text>
                                          </g>
                                        );
                                      })}
                                    </svg>
                                  </div>
                                </div>
                              );
                            })()}
                          </div>
                        )}

                        <div className="p-5">
                          <div className="grid grid-cols-12 gap-2 mb-3 text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">
                            <div className="col-span-2 text-center">Seria</div>
                            <div className="col-span-5 text-center">kg</div>
                            <div className="col-span-5 text-center">Powt.</div>
                          </div>

                          <div className="space-y-3">
                            {workoutEx.sets.map((set, setIndex) => (
                              <div 
                                key={setIndex} 
                                className="grid grid-cols-12 gap-2 items-center p-2 bg-slate-50 rounded-2xl border border-slate-100 shadow-sm"
                              >
                                <div className="col-span-2 text-center font-black text-slate-400">
                                  {setIndex + 1}
                                </div>
                                <div className="col-span-5">
                                  <input 
                                    type="number" 
                                    placeholder="-"
                                    value={set.weight}
                                    onChange={(e) => updateSet(exIndex, setIndex, 'weight', e.target.value)}
                                    className={`w-full text-center p-2.5 bg-white border border-slate-200 rounded-xl font-black text-slate-800 focus:ring-2 ${theme.focusRingMain} ${theme.focusBorderMain} transition-all outline-none shadow-sm`}
                                  />
                                </div>
                                <div className="col-span-5">
                                  <input 
                                    type="number" 
                                    placeholder="-"
                                    value={set.reps}
                                    onChange={(e) => updateSet(exIndex, setIndex, 'reps', e.target.value)}
                                    className={`w-full text-center p-2.5 bg-white border border-slate-200 rounded-xl font-black text-slate-800 focus:ring-2 ${theme.focusRingMain} ${theme.focusBorderMain} transition-all outline-none shadow-sm`}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>

                          <button 
                            onClick={() => addSet(exIndex)}
                            className={`mt-5 w-full py-4 text-sm font-bold ${theme.textMain} bg-white border-2 border-dashed ${theme.borderMain20} hover:border-solid rounded-2xl flex items-center justify-center gap-2 transition-all shadow-sm`}
                          >
                            <Plus size={18} strokeWidth={3} /> Dodaj serię
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const HistoryView = () => {
    if (selectedHistoryExercise) {
      const exerciseId = selectedHistoryExercise;
      const exerciseDetails = exercises.find(e => e.id === exerciseId);

      const allSessions = history
        .slice()
        .reverse()
        .filter(session => session.exercises?.some(e => e.exerciseId === exerciseId))
        .map(session => {
          const exData = session.exercises.find(e => e.exerciseId === exerciseId);
          const validSets = exData.sets.filter(s => parseFloat(String(s.weight).replace(',', '.')) > 0 && parseInt(s.reps) > 0);
          return {
            date: session.date,
            shortDate: new Date(session.timestamp).toLocaleDateString('pl-PL', { day: '2-digit', month: '2-digit' }),
            maxW: validSets.length ? Math.max(...validSets.map(s => parseFloat(String(s.weight).replace(',', '.')))) : 0,
            sets: validSets
          };
        })
        .filter(s => s.sets.length > 0)
        .map((s, index) => ({ ...s, globalIndex: index }));

      const N = allSessions.length;
      let m = 0, b = 0;
      if (N > 1) {
        let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
        allSessions.forEach(s => {
          sumX += s.globalIndex;
          sumY += s.maxW;
          sumXY += s.globalIndex * s.maxW;
          sumXX += s.globalIndex * s.globalIndex;
        });
        m = (N * sumXY - sumX * sumY) / (N * sumXX - sumX * sumX);
        b = (sumY - m * sumX) / N;
      } else if (N === 1) {
        b = allSessions[0].maxW;
      }

      const chartData = allSessions.slice(-15); 
      const listData = allSessions.slice(-10).reverse(); 

      const maxChartW = Math.max(...chartData.map(d => Math.max(d.maxW, m * d.globalIndex + b)), 10);
      
      const width = 300;
      const height = 150;
      const padX = 20;
      const padY = 25;
      const chartW = width - padX * 2;
      const chartH = height - padY * 2;
      const spacing = chartData.length > 1 ? chartW / (chartData.length - 1) : 0;
      const getX = (i) => chartData.length === 1 ? width / 2 : padX + i * spacing;

      const trendLinePoints = chartData.map((d, i) => {
        const trendY = m * d.globalIndex + b;
        return `${getX(i)},${padY + chartH - (trendY / maxChartW) * chartH}`;
      }).join(' ');

      return (
        <div className="p-4 space-y-6 animate-in fade-in slide-in-from-right-4 duration-300 pb-32">
          <div className="flex items-center justify-between bg-white p-5 rounded-3xl shadow-md shadow-slate-200/50 border border-slate-100">
            <div>
              <h3 className="font-black text-xl text-slate-800">{exerciseDetails?.name}</h3>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">{exerciseDetails?.target}</p>
            </div>
            <button onClick={() => setSelectedHistoryExercise(null)} className="text-slate-400 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 p-3 rounded-2xl transition-colors">
              <X size={20} strokeWidth={3} />
            </button>
          </div>

          <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/40">
            <div className="flex justify-between items-center mb-6">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Wykres (max 15)</h4>
              <div className="flex gap-3 text-[9px] font-black uppercase tracking-wider">
                <span className={`${theme.textSec} flex items-center gap-1.5`}>
                  <div className={`w-2.5 h-2.5 ${theme.bgSec30} border ${theme.borderSec} rounded-sm`}></div> MAX KG
                </span>
                <span className={`${theme.textMain} flex items-center gap-1.5`}>
                  <div className={`w-2.5 h-0.5 ${theme.bgMain10.replace('bg-', 'bg-').split('/')[0]} border ${theme.borderMain20}`}></div> TREND
                </span>
              </div>
            </div>

            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible mt-2">
              <line x1="0" y1={padY} x2={width} y2={padY} stroke="#f1f5f9" strokeWidth="1.5" />
              <line x1="0" y1={padY + chartH/2} x2={width} y2={padY + chartH/2} stroke="#f1f5f9" strokeWidth="1.5" />
              <line x1="0" y1={padY + chartH} x2={width} y2={padY + chartH} stroke="#e2e8f0" strokeWidth="1.5" />

              {chartData.length > 1 && (
                <polyline points={trendLinePoints} fill="none" stroke={theme.textMain.replace('text-', '').split('-')[0] === 'emerald' ? '#10b981' : '#fb7185'} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="opacity-60 drop-shadow-md" />
              )}
              {chartData.map((d, i) => {
                const x = getX(i);
                const hW = (d.maxW / maxChartW) * chartH;
                const yW = padY + chartH - hW;
                return (
                  <g key={`hist-bar-${i}`}>
                    <rect x={x - 6} y={yW} width="12" height={hW} className={`${theme.fillSec20} ${theme.hoverFillSec40} transition-colors cursor-pointer`} rx="4" />
                    <circle cx={x} cy={yW} r="3.5" fill={theme.chartSecFill} stroke="#fff" strokeWidth="2" />
                    <text x={x} y={yW - 8} fontSize="9" fill={theme.chartSecFill} textAnchor="middle" fontWeight="bold">{Math.round(d.maxW)}</text>
                    <text x={x} y={height - 2} fontSize="9" fill="#94a3b8" textAnchor="middle" fontWeight="bold">{d.shortDate}</text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="space-y-4 pb-6">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-4">Ostatnie 10 treningów</h4>
            {listData.map((session, idx) => (
              <div key={idx} className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5">
                <p className={`text-xs font-black ${theme.textMain} mb-4 uppercase tracking-wider`}>{session.date}</p>
                <div className="grid grid-cols-3 gap-2 text-[10px] text-slate-400 font-black border-b border-slate-100 pb-2 mb-3 uppercase tracking-widest">
                  <div className="text-center">Seria</div>
                  <div className="text-center">kg</div>
                  <div className="text-center">Powt.</div>
                </div>
                <div className="space-y-2">
                  {session.sets.map((s, sIdx) => (
                    <div key={sIdx} className="grid grid-cols-3 gap-2 text-xs text-slate-700 py-1.5 bg-slate-50 rounded-xl">
                      <div className="text-center font-black text-slate-400">#{sIdx + 1}</div>
                      <div className={`text-center font-black ${theme.textSec}`}>{s.weight}</div>
                      <div className={`text-center font-black ${theme.textMain}`}>{s.reps}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    const exSet = new Set();
    history.forEach(session => {
      session.exercises?.forEach(ex => {
        const validSets = ex.sets.filter(s => parseFloat(String(s.weight).replace(',', '.')) > 0 && parseInt(s.reps) > 0);
        if (validSets.length > 0) exSet.add(ex.exerciseId);
      })
    });
    const performedExercises = Array.from(exSet).map(id => exercises.find(e => e.id === id)).filter(Boolean);
    performedExercises.sort((a, b) => a.name.localeCompare(b.name));

    return (
      <div className="p-4 space-y-6 pb-32">
        <div className="px-2">
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Historia</h2>
          <p className="text-slate-500 font-medium mt-1">Wybierz ćwiczenie i analizuj postępy.</p>
        </div>
        
        <div className="space-y-3">
          {performedExercises.length === 0 ? (
            <div className="bg-white border border-slate-100 text-slate-500 p-8 rounded-[32px] text-center font-medium shadow-sm">
              Brak historii. Wykonaj swój pierwszy trening!
            </div>
          ) : (
            performedExercises.map(ex => (
              <button 
                key={ex.id} 
                onClick={() => setSelectedHistoryExercise(ex.id)}
                className={`w-full flex items-center justify-between bg-white p-5 rounded-[28px] shadow-sm border border-slate-100 hover:border-slate-300 hover:shadow-md transition-all group`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center ${theme.textMain} shadow-sm shrink-0`}>
                    <MuscleIcon category={ex.target.split(' - ')[0]} className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <p className={`font-bold text-lg text-slate-800 leading-tight mb-1 ${theme.groupHoverTextMain} transition-colors`}>{ex.name}</p>
                    <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">{ex.target}</p>
                  </div>
                </div>
                <div className="bg-slate-50 p-2 rounded-xl group-hover:bg-slate-100 transition-colors">
                  <ChevronRight className="text-slate-400" size={20} strokeWidth={2.5} />
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    );
  };

  const LoginModal = () => (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-6">
      <div className="bg-white p-8 rounded-[32px] w-full max-w-sm space-y-5 shadow-2xl">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-2xl font-black text-slate-800 tracking-tight">Chmura</h3>
          <button onClick={() => setShowLoginModal(false)} className="bg-slate-50 p-2 rounded-full text-slate-400 hover:text-slate-700 transition-colors"><X size={20} strokeWidth={3} /></button>
        </div>
        <p className="text-sm font-medium text-slate-500">Zaloguj się, aby synchronizować Historię i Plany między urządzeniami.</p>
        <div className="space-y-3">
          <input type="email" placeholder="E-mail" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-800 outline-none focus:ring-2 focus:ring-slate-300 placeholder-slate-400" value={email} onChange={e => setEmail(e.target.value)} />
          <input type="password" placeholder="Hasło" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-800 outline-none focus:ring-2 focus:ring-slate-300 placeholder-slate-400" value={password} onChange={e => setPassword(e.target.value)} />
        </div>
        {authError && <p className="text-xs font-bold text-rose-500 bg-rose-50 p-3 rounded-xl">{authError}</p>}
        <div className="flex gap-3 pt-4">
          <button onClick={() => handleAuth('login')} className="flex-1 bg-slate-800 text-white p-4 rounded-2xl font-bold shadow-lg shadow-slate-300 hover:-translate-y-0.5 transition-all">Zaloguj</button>
          <button onClick={() => handleAuth('register')} className="flex-1 bg-slate-100 text-slate-700 p-4 rounded-2xl font-bold hover:bg-slate-200 transition-colors">Załóż konto</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-[100dvh] w-full bg-[#f0f4f8] flex justify-center font-sans text-slate-800 overflow-hidden">
      <div className="w-full max-w-md bg-[#fafafa] h-full relative shadow-[0_0_50px_rgba(0,0,0,0.05)] flex flex-col overflow-hidden">
        
        {showLoginModal && <LoginModal />}

        {!activeWorkout && !summaryData && (
          <header className="bg-white/80 backdrop-blur-2xl p-4 border-b border-slate-100 flex justify-between items-center shrink-0 z-10 rounded-b-[32px] shadow-sm">
            <div className="flex items-center gap-3">
              <div onClick={() => setShowEasterEgg(true)} className="w-12 h-12 rounded-full border-[3px] border-white bg-slate-100 overflow-hidden flex items-center justify-center shrink-0 shadow-md cursor-pointer hover:scale-105 transition-transform">
                <img src="image_b14c62.jpg" alt="Ronnie" className="w-full h-full object-cover object-[center_15%] scale-125" />
              </div>
              <button onClick={user ? handleLogout : () => setShowLoginModal(true)} className={`p-2.5 rounded-2xl border transition-colors ${user ? `${theme.borderMain20} ${theme.bgMain10} ${theme.textMain}` : 'border-slate-200 bg-slate-50 text-slate-400 hover:text-slate-600'}`}>
                {user ? <LogOut size={20} strokeWidth={2.5} /> : <CloudOff size={20} strokeWidth={2.5} />}
              </button>
            </div>
            <div className="flex gap-3 shrink-0 ml-4 bg-slate-50 p-1.5 rounded-full border border-slate-100">
              <button onClick={() => setCurrentUser('turtle')} className={`w-10 h-10 rounded-full flex items-center justify-center text-xl transition-all ${currentUser === 'turtle' ? 'bg-white shadow-sm scale-110' : 'opacity-50 grayscale hover:grayscale-0'}`}>🐢</button>
              <button onClick={() => setCurrentUser('blonde')} className={`w-10 h-10 rounded-full flex items-center justify-center text-xl transition-all ${currentUser === 'blonde' ? 'bg-white shadow-sm scale-110' : 'opacity-50 grayscale hover:grayscale-0'}`}>👱‍♀️</button>
            </div>
          </header>
        )}

        <main className="flex-1 overflow-y-auto custom-scrollbar touch-pan-y" style={{ WebkitOverflowScrolling: 'touch' }}>
          {summaryData ? (
            SummaryView()
          ) : activeWorkout ? (
            ActiveWorkoutView()
          ) : (
            <>
              {activeTab === 'workout' && WorkoutDashboardView()}
              {activeTab === 'routines' && RoutinesView()}
              {activeTab === 'history' && HistoryView()}
              {activeTab === 'library' && LibraryView()}
            </>
          )}
        </main>

        {activeWorkout && !summaryData && (
          <div className="fixed bottom-10 left-0 right-0 flex justify-center pointer-events-none z-30">
            <button onClick={() => setShowFinishConfirm(true)} className={`pointer-events-auto bg-gradient-to-r ${theme.gradMainSec} text-white px-8 py-5 rounded-full font-bold shadow-xl ${theme.shadowMain20} flex items-center gap-3 hover:scale-105 hover:-translate-y-1 transition-all border-4 border-white`}>
              <Check size={24} strokeWidth={3.5} /> Zakończ trening
            </button>
          </div>
        )}

        {!activeWorkout && !summaryData && (
          <div className="absolute bottom-6 left-0 right-0 z-20 flex justify-center px-6 pointer-events-none">
            <nav className="w-full max-w-sm bg-white/90 backdrop-blur-2xl border border-slate-100 rounded-[32px] shadow-[0_10px_40px_rgba(0,0,0,0.06)] pointer-events-auto p-1.5 relative overflow-hidden">
              <div className={`absolute inset-0 bg-gradient-to-t ${theme.navGrad} to-transparent opacity-20 pointer-events-none`}></div>
              <div className="flex justify-around relative z-10">
                <button onClick={() => setActiveTab('workout')} className={`flex-1 flex flex-col items-center justify-center py-3 rounded-[24px] transition-all duration-300 ${activeTab === 'workout' ? `${theme.textMain} ${theme.bgMain10} shadow-sm border border-white` : 'text-slate-400 hover:text-slate-600'}`}><Play size={24} strokeWidth={activeTab === 'workout' ? 2.5 : 2} className={activeTab === 'workout' ? theme.fillMain20 : ''} /><span className="text-[9px] font-black mt-1.5 uppercase tracking-widest">Trening</span></button>
                <button onClick={() => setActiveTab('routines')} className={`flex-1 flex flex-col items-center justify-center py-3 rounded-[24px] transition-all duration-300 ${activeTab === 'routines' ? `${theme.textMain} ${theme.bgMain10} shadow-sm border border-white` : 'text-slate-400 hover:text-slate-600'}`}><List size={24} strokeWidth={activeTab === 'routines' ? 2.5 : 2} /><span className="text-[9px] font-black mt-1.5 uppercase tracking-widest">Plany</span></button>
                <button onClick={() => setActiveTab('history')} className={`flex-1 flex flex-col items-center justify-center py-3 rounded-[24px] transition-all duration-300 ${activeTab === 'history' ? `${theme.textMain} ${theme.bgMain10} shadow-sm border border-white` : 'text-slate-400 hover:text-slate-600'}`}><History size={24} strokeWidth={activeTab === 'history' ? 2.5 : 2} className={activeTab === 'history' ? theme.fillMain20 : ''} /><span className="text-[9px] font-black mt-1.5 uppercase tracking-widest">Historia</span></button>
                <button onClick={() => setActiveTab('library')} className={`flex-1 flex flex-col items-center justify-center py-3 rounded-[24px] transition-all duration-300 ${activeTab === 'library' ? `${theme.textMain} ${theme.bgMain10} shadow-sm border border-white` : 'text-slate-400 hover:text-slate-600'}`}><Dumbbell size={24} strokeWidth={activeTab === 'library' ? 2.5 : 2} className={activeTab === 'library' ? theme.fillMain20 : ''} /><span className="text-[9px] font-black mt-1.5 uppercase tracking-widest">Biblioteka</span></button>
              </div>
            </nav>
          </div>
        )}

        {showFinishConfirm && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-6">
            <div className="bg-white p-8 rounded-[32px] w-full max-w-sm flex flex-col shadow-2xl">
              <h3 className="text-2xl font-black text-slate-800 tracking-tight mb-2">Zakończyć?</h3>
              <p className="text-slate-500 font-medium">Czy na pewno chcesz zakończyć i podsumować obecny trening?</p>
              <div className="flex gap-3 mt-6"><button onClick={() => setShowFinishConfirm(false)} className="flex-1 py-4 rounded-2xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 transition-colors">Wróć</button><button onClick={finishWorkout} className={`flex-1 py-4 rounded-2xl bg-gradient-to-r ${theme.gradMainSec} text-white font-bold shadow-lg ${theme.shadowMain20}`}>Zakończ</button></div>
              <button onClick={() => { setActiveWorkout(null); setShowFinishConfirm(false); }} className="mt-6 text-sm font-bold text-slate-400 hover:text-rose-500 transition-colors">Wyjdź bez zapisu</button>
            </div>
          </div>
        )}

        {showCancelConfirm && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-6">
            <div className="bg-white p-8 rounded-[32px] w-full max-w-sm flex flex-col shadow-2xl">
              <h3 className="text-2xl font-black text-slate-800 tracking-tight mb-2">Przerwać?</h3>
              <p className="text-slate-500 font-medium">Dzisiejsze wyniki zostaną usunięte bezpowrotnie.</p>
              <div className="flex gap-3 mt-6"><button onClick={() => setShowCancelConfirm(false)} className="flex-1 py-4 rounded-2xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 transition-colors">Wróć</button><button onClick={() => { setActiveWorkout(null); setShowCancelConfirm(false); }} className="flex-1 py-4 rounded-2xl bg-rose-500 text-white font-bold shadow-lg shadow-rose-500/30">Przerwij</button></div>
            </div>
          </div>
        )}

        {showEasterEgg && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/90 backdrop-blur-md p-6">
            <button onClick={() => setShowEasterEgg(false)} className="absolute top-8 right-8 text-white/50 hover:text-white bg-white/10 p-3 rounded-full backdrop-blur-lg"><X size={28} /></button>
            <div className="flex flex-col items-center max-w-lg w-full">
              <div className="p-2 bg-white/10 rounded-[32px] backdrop-blur-md">
                <img src="image_b14c62.jpg" alt="YEAH BUDDY" className="w-full h-auto rounded-[24px] shadow-2xl" />
              </div>
              <p className="mt-10 text-5xl font-black text-white italic text-center uppercase tracking-widest drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]">YEAH BUDDY! 💪</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
