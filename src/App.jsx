import React, { useState, useEffect } from 'react';
import { Dumbbell, List, Play, Plus, Trash2, Check, X, Save, History, ChevronRight, BarChart2, Pencil, ArrowUp, ArrowDown } from 'lucide-react';

// --- MOTYWY WIZUALNE DLA PROFILI ---
const themes = {
  turtle: {
    textMain: 'text-lime-500',
    bgMain10: 'bg-lime-500/10',
    borderMain20: 'border-lime-500/20',
    ringMain50: 'focus:ring-lime-500/50',
    focusRingMain: 'focus:ring-lime-500',
    focusBorderMain: 'focus:border-lime-500',
    fillMain20: 'fill-lime-500/20',
    gradMainSec: 'from-lime-500 to-red-500',
    navGrad: 'from-lime-500/20', // Subtelny gradient paska
    
    hoverBgMain10: 'hover:bg-lime-500/10',
    hoverBgMain20: 'hover:bg-lime-500/20',
    hoverTextMain: 'hover:text-lime-500',
    hoverBorderMain50: 'hover:border-lime-500/50',
    
    groupHoverTextMain: 'group-hover:text-lime-500',
    gradHover: 'group-hover:from-lime-500 group-hover:to-red-500',
    shadowMain20: 'shadow-lime-500/20',
    groupHoverShadowMain20: 'group-hover:shadow-lime-500/20',

    textSec: 'text-red-500',
    bgSec10: 'bg-red-500/10',
    bgSec30: 'bg-red-500/30',
    borderSec: 'border-red-500',
    fillSec20: 'fill-red-500/20',
    
    hoverBgSec20: 'hover:bg-red-500/20',
    hoverFillSec40: 'hover:fill-red-500/40',
    
    chartSecFill: '#ef4444' // red-500
  },
  blonde: {
    textMain: 'text-pink-500',
    bgMain10: 'bg-pink-500/10',
    borderMain20: 'border-pink-500/20',
    ringMain50: 'focus:ring-pink-500/50',
    focusRingMain: 'focus:ring-pink-500',
    focusBorderMain: 'focus:border-pink-500',
    fillMain20: 'fill-pink-500/20',
    gradMainSec: 'from-pink-500 to-amber-400',
    navGrad: 'from-pink-500/20', // Subtelny gradient paska
    
    hoverBgMain10: 'hover:bg-pink-500/10',
    hoverBgMain20: 'hover:bg-pink-500/20',
    hoverTextMain: 'hover:text-pink-500',
    hoverBorderMain50: 'hover:border-pink-500/50',
    
    groupHoverTextMain: 'group-hover:text-pink-500',
    gradHover: 'group-hover:from-pink-500 group-hover:to-amber-400',
    shadowMain20: 'shadow-pink-500/20',
    groupHoverShadowMain20: 'group-hover:shadow-pink-500/20',

    textSec: 'text-amber-400',
    bgSec10: 'bg-amber-400/10',
    bgSec30: 'bg-amber-400/30',
    borderSec: 'border-amber-400',
    fillSec20: 'fill-amber-400/20',
    
    hoverBgSec20: 'hover:bg-amber-400/20',
    hoverFillSec40: 'hover:fill-amber-400/40',
    
    chartSecFill: '#fbbf24' // amber-400
  }
};

// --- KOMPONENT: IKONY PARTII MIĘŚNIOWYCH (SVG) ---
const MuscleIcon = ({ category, className = "w-5 h-5" }) => {
  const cat = category === 'Klatka piersiowa' ? 'Klatka' : category;

  switch (cat) {
    case 'Klatka':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 8c4-3 12-3 16 0" />
          <path d="M4 13c4 2 12 2 16 0" />
          <path d="M12 8v5" />
        </svg>
      );
    case 'Plecy':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3L5 10l1 11h12l1-11z" />
          <path d="M12 3v18" />
        </svg>
      );
    case 'Nogi':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 5v14l-2 3" />
          <path d="M15 5v14l2 3" />
          <path d="M7 5h10" />
        </svg>
      );
    case 'Ramiona':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 13a4 4 0 0 1 4-4h4a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-4a4 4 0 0 1-4-4z" />
          <path d="M8 13v-2a4 4 0 0 0-4-4H2" />
        </svg>
      );
    case 'Barki':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 11a7 7 0 0 1 14 0v4" />
          <path d="M9 15v3" />
          <path d="M15 15v3" />
        </svg>
      );
    case 'Brzuch':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="7" y="5" width="10" height="14" rx="2" />
          <path d="M7 10h10" />
          <path d="M7 14h10" />
          <path d="M12 5v14" />
        </svg>
      );
    default:
      return <Dumbbell className={className} />;
  }
};

// --- INICJALIZACJA DANYCH ---
const defaultExercises = [
  { id: '1', name: 'Wyciskanie sztangi leżąc', target: 'Klatka - Środek' },
  { id: '2', name: 'Przysiad ze sztangą', target: 'Nogi - Czworogłowy' },
  { id: '3', name: 'Martwy ciąg', target: 'Plecy - Dół' },
  { id: '4', name: 'Wyciskanie żołnierskie', target: 'Barki - Przód' }
];

const defaultRoutines = [
  { id: '1', name: 'Trening FBW (Full Body)', exercises: ['2', '1', '3'] }
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
  // --- STANY APLIKACJI I PROFILI ---
  const [currentUser, setCurrentUser] = useState(() => localStorage.getItem('gym_currentUser') || 'blonde');
  const theme = themes[currentUser];

  const [activeTab, setActiveTab] = useState('workout'); 
  
  // Wspólne dane: Ćwiczenia i Plany
  const [exercises, setExercises] = useState(() => {
    const saved = localStorage.getItem('gym_exercises');
    return saved ? JSON.parse(saved) : defaultExercises;
  });
  
  const [routines, setRoutines] = useState(() => {
    const saved = localStorage.getItem('gym_routines');
    return saved ? JSON.parse(saved) : defaultRoutines;
  });
  
  // Rozdzielone dane: Historia Treningów
  const [historyTurtle, setHistoryTurtle] = useState(() => {
    const saved = localStorage.getItem('gym_history_turtle');
    return saved ? JSON.parse(saved) : (localStorage.getItem('gym_history') ? JSON.parse(localStorage.getItem('gym_history')) : []); // Migracja
  });
  const [historyBlonde, setHistoryBlonde] = useState(() => {
    const saved = localStorage.getItem('gym_history_blonde');
    return saved ? JSON.parse(saved) : [];
  });
  const history = currentUser === 'turtle' ? historyTurtle : historyBlonde;
  const setHistory = currentUser === 'turtle' ? setHistoryTurtle : setHistoryBlonde;

  // Rozdzielone dane: Aktywny Trening
  const [activeWorkoutTurtle, setActiveWorkoutTurtle] = useState(() => {
    const saved = localStorage.getItem('gym_activeWorkout_turtle');
    return saved ? JSON.parse(saved) : (localStorage.getItem('gym_activeWorkout') ? JSON.parse(localStorage.getItem('gym_activeWorkout')) : null); // Migracja
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

  // Zapisywanie zmian w tle
  useEffect(() => { localStorage.setItem('gym_currentUser', currentUser); }, [currentUser]);
  useEffect(() => { localStorage.setItem('gym_exercises', JSON.stringify(exercises)); }, [exercises]);
  useEffect(() => { localStorage.setItem('gym_routines', JSON.stringify(routines)); }, [routines]);
  useEffect(() => { localStorage.setItem('gym_history_turtle', JSON.stringify(historyTurtle)); }, [historyTurtle]);
  useEffect(() => { localStorage.setItem('gym_history_blonde', JSON.stringify(historyBlonde)); }, [historyBlonde]);
  useEffect(() => { localStorage.setItem('gym_activeWorkout_turtle', JSON.stringify(activeWorkoutTurtle)); }, [activeWorkoutTurtle]);
  useEffect(() => { localStorage.setItem('gym_activeWorkout_blonde', JSON.stringify(activeWorkoutBlonde)); }, [activeWorkoutBlonde]);

  useEffect(() => { 
    if (activeTab !== 'history') setSelectedHistoryExercise(null); 
  }, [activeTab]);

  // --- LOGIKA: BIBLIOTEKA ĆWICZEŃ ---
  const [newExerciseName, setNewExerciseName] = useState('');
  const [newExerciseCategory, setNewExerciseCategory] = useState('');
  const [newExerciseSubcategory, setNewExerciseSubcategory] = useState('');

  const addExercise = () => {
    if (!newExerciseName.trim() || !newExerciseCategory || !newExerciseSubcategory) return;
    const newEx = {
      id: Date.now().toString(),
      name: newExerciseName,
      target: `${newExerciseCategory} - ${newExerciseSubcategory}`
    };
    setExercises([...exercises, newEx]);
    setNewExerciseName('');
    setNewExerciseCategory('');
    setNewExerciseSubcategory('');
  };

  const deleteExercise = (id) => {
    setExercises(exercises.filter(ex => ex.id !== id));
  };

  // --- LOGIKA: PLANY TRENINGOWE ---
  const [isCreatingRoutine, setIsCreatingRoutine] = useState(false);
  const [editingRoutineId, setEditingRoutineId] = useState(null); 
  const [newRoutineName, setNewRoutineName] = useState('');
  const [selectedExercisesForRoutine, setSelectedExercisesForRoutine] = useState([]);

  const openRoutineEditor = (routine = null) => {
    if (routine) {
      setEditingRoutineId(routine.id);
      setNewRoutineName(routine.name);
      setSelectedExercisesForRoutine(routine.exercises);
    } else {
      setEditingRoutineId(null);
      setNewRoutineName('');
      setSelectedExercisesForRoutine([]);
    }
    setIsCreatingRoutine(true);
  };

  const moveExercise = (index, direction) => {
    const newSelected = [...selectedExercisesForRoutine];
    if (direction === 'up' && index > 0) {
      [newSelected[index - 1], newSelected[index]] = [newSelected[index], newSelected[index - 1]];
    } else if (direction === 'down' && index < newSelected.length - 1) {
      [newSelected[index + 1], newSelected[index]] = [newSelected[index], newSelected[index + 1]];
    }
    setSelectedExercisesForRoutine(newSelected);
  };

  const saveRoutine = () => {
    if (!newRoutineName.trim() || selectedExercisesForRoutine.length === 0) return;
    
    if (editingRoutineId) {
      setRoutines(routines.map(r => 
        r.id === editingRoutineId 
          ? { ...r, name: newRoutineName, exercises: selectedExercisesForRoutine } 
          : r
      ));
    } else {
      const newRoutine = {
        id: Date.now().toString(),
        name: newRoutineName,
        exercises: selectedExercisesForRoutine
      };
      setRoutines([...routines, newRoutine]);
    }
    
    setIsCreatingRoutine(false);
    setEditingRoutineId(null);
    setNewRoutineName('');
    setSelectedExercisesForRoutine([]);
  };

  const deleteRoutine = (id) => {
    setRoutines(routines.filter(r => r.id !== id));
  };

  // --- LOGIKA: AKTYWNY TRENING ---
  const startWorkout = (routine) => {
    const workoutSession = {
      id: Date.now().toString(),
      routineName: routine.name,
      startTime: new Date().toISOString(),
      exercises: routine.exercises.map(exId => ({
        exerciseId: exId,
        sets: [{ weight: '', reps: '' }]
      }))
    };
    setActiveWorkout(workoutSession);
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
        const weightStr = String(set.weight).replace(',', '.');
        const w = parseFloat(weightStr) || 0;
        const r = parseInt(set.reps) || 0;
        if (w > 0 && r > 0) exVolume += (w * r);
      });
      
      totalVolume += exVolume;
      return { name: exerciseDetails?.name || 'Nieznane ćwiczenie', volume: exVolume };
    });

    const summary = {
      id: Date.now().toString(),
      routineName: activeWorkout.routineName,
      date: endTime.toLocaleDateString(),
      timestamp: endTime.toISOString(),
      duration: `${diffMins} min ${diffSecs} s`,
      totalVolume,
      exerciseSummaries,
      exercises: activeWorkout.exercises
    };

    setHistory([summary, ...history]);
    setSummaryData(summary);
    setActiveWorkout(null);
    setShowFinishConfirm(false);
  };

  const addSet = (exerciseIndex) => {
    const updatedWorkout = { ...activeWorkout };
    const lastSet = updatedWorkout.exercises[exerciseIndex].sets.slice(-1)[0];
    
    updatedWorkout.exercises[exerciseIndex].sets.push({
      weight: lastSet ? lastSet.weight : '',
      reps: lastSet ? lastSet.reps : ''
    });
    setActiveWorkout(updatedWorkout);
  };

  const updateSet = (exerciseIndex, setIndex, field, value) => {
    const updatedWorkout = { ...activeWorkout };
    updatedWorkout.exercises[exerciseIndex].sets[setIndex][field] = value;
    setActiveWorkout(updatedWorkout);
  };

  const removeSet = (exerciseIndex, setIndex) => {
    const updatedWorkout = { ...activeWorkout };
    updatedWorkout.exercises[exerciseIndex].sets.splice(setIndex, 1);
    setActiveWorkout(updatedWorkout);
  };

  // --- KOMPONENTY WIDOKÓW ---

  const LibraryView = () => (
    <div className="p-4 space-y-6 pb-32">
      <div className="bg-neutral-900 p-5 rounded-2xl shadow-lg border border-neutral-800">
        <h3 className="font-semibold text-lg mb-4 text-neutral-100">Dodaj nowe ćwiczenie</h3>
        <div className="space-y-3">
          <input 
            type="text" 
            placeholder="Nazwa ćwiczenia (np. Wyciskanie hantli)" 
            className={`w-full p-3 bg-neutral-950 border border-neutral-800 text-neutral-100 rounded-xl focus:ring-2 ${theme.ringMain50} ${theme.focusBorderMain} outline-none placeholder-neutral-500 transition-all`}
            value={newExerciseName}
            onChange={(e) => setNewExerciseName(e.target.value)}
          />
          
          <div className="flex items-center gap-2">
            {newExerciseCategory && (
              <div className={`w-12 h-12 shrink-0 bg-neutral-950 border border-neutral-800 rounded-xl flex items-center justify-center ${theme.textMain} animate-in fade-in zoom-in duration-300 shadow-inner`}>
                <MuscleIcon category={newExerciseCategory} className="w-6 h-6" />
              </div>
            )}
            <div className="relative flex-1">
              <select
                className={`w-full p-3 bg-neutral-950 border border-neutral-800 rounded-xl focus:ring-2 ${theme.ringMain50} ${theme.focusBorderMain} outline-none transition-all appearance-none cursor-pointer ${!newExerciseCategory ? 'text-neutral-500' : 'text-neutral-100'}`}
                value={newExerciseCategory}
                onChange={(e) => {
                  setNewExerciseCategory(e.target.value);
                  setNewExerciseSubcategory(''); 
                }}
              >
                <option value="" disabled>Partia mięśniowa...</option>
                {Object.keys(muscleGroups).map(cat => (
                  <option key={cat} value={cat} className="text-neutral-100">{cat}</option>
                ))}
              </select>
              <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none rotate-90" size={18} />
            </div>
          </div>

          {newExerciseCategory && (
            <div className="relative animate-in fade-in slide-in-from-top-2 duration-300">
              <select
                className={`w-full p-3 bg-neutral-950 border border-neutral-800 rounded-xl focus:ring-2 ${theme.ringMain50} ${theme.focusBorderMain} outline-none transition-all appearance-none cursor-pointer ${!newExerciseSubcategory ? 'text-neutral-500' : 'text-neutral-100'}`}
                value={newExerciseSubcategory}
                onChange={(e) => setNewExerciseSubcategory(e.target.value)}
              >
                <option value="" disabled>Wybierz podkategorię...</option>
                {muscleGroups[newExerciseCategory].map(sub => (
                  <option key={sub} value={sub} className="text-neutral-100">{sub}</option>
                ))}
              </select>
              <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none rotate-90" size={18} />
            </div>
          )}

          <button 
            onClick={addExercise}
            disabled={!newExerciseName.trim() || !newExerciseCategory || !newExerciseSubcategory}
            className={`w-full bg-gradient-to-r ${theme.gradMainSec} text-white p-3 rounded-xl font-medium flex items-center justify-center gap-2 mt-2 shadow-lg ${theme.shadowMain20} disabled:opacity-50 disabled:grayscale transition-all`}
          >
            <Plus size={20} /> Dodaj do biblioteki
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="font-semibold text-lg text-neutral-100">Twoje ćwiczenia</h3>
        {exercises.length === 0 ? (
          <p className="text-neutral-500 text-center py-4">Brak ćwiczeń. Dodaj jakieś powyżej!</p>
        ) : (
          exercises.map(ex => (
            <div key={ex.id} className="flex justify-between items-center bg-neutral-900 p-4 rounded-xl shadow-sm border border-neutral-800 hover:border-neutral-700 transition-colors">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-center ${theme.textMain} shadow-inner shrink-0`}>
                  <MuscleIcon category={ex.target.split(' - ')[0]} className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-medium text-neutral-200 leading-tight mb-1">{ex.name}</p>
                  <p className="text-[11px] font-bold tracking-wide text-neutral-500 uppercase">{ex.target}</p>
                </div>
              </div>
              <button onClick={() => deleteExercise(ex.id)} className="text-neutral-500 p-2 hover:bg-red-500/10 hover:text-red-400 rounded-lg transition-colors ml-2 shrink-0">
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
            className={`w-full bg-gradient-to-r ${theme.gradMainSec} text-neutral-950 p-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] shadow-lg ${theme.shadowMain20} transition-all`}
          >
            <Plus size={20} /> Stwórz nowy plan treningowy
          </button>

          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-neutral-100">Twoje plany</h3>
            {routines.length === 0 ? (
              <p className="text-neutral-500 text-center py-4">Nie masz jeszcze żadnych planów.</p>
            ) : (
              routines.map(routine => (
                <div key={routine.id} className="bg-neutral-900 p-5 rounded-2xl shadow-sm border border-neutral-800 flex justify-between items-center hover:border-neutral-700 transition-colors">
                  <div>
                    <h4 className="font-semibold text-lg text-neutral-200">{routine.name}</h4>
                    <p className="text-sm text-neutral-500 mt-1">{routine.exercises.length} ćwiczeń</p>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => openRoutineEditor(routine)} className={`text-neutral-500 p-2 ${theme.hoverBgMain10} ${theme.hoverTextMain} rounded-lg transition-colors`}>
                      <Pencil size={20} />
                    </button>
                    <button onClick={() => deleteRoutine(routine.id)} className="text-neutral-500 p-2 hover:bg-red-500/10 hover:text-red-400 rounded-lg transition-colors">
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      ) : (
        <div className="bg-neutral-900 p-5 rounded-2xl shadow-lg border border-neutral-800 space-y-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold text-lg text-neutral-100">{editingRoutineId ? "Edytuj plan" : "Nowy plan"}</h3>
            <button onClick={() => { setIsCreatingRoutine(false); setEditingRoutineId(null); }} className="text-neutral-500 hover:text-neutral-300 transition-colors">
              <X size={24} />
            </button>
          </div>
          
          <input 
            type="text" 
            placeholder="Nazwa planu (np. Push Day)" 
            className={`w-full p-3 bg-neutral-950 border border-neutral-800 text-neutral-100 rounded-xl focus:ring-2 ${theme.ringMain50} ${theme.focusBorderMain} outline-none font-medium placeholder-neutral-600 transition-all`}
            value={newRoutineName}
            onChange={(e) => setNewRoutineName(e.target.value)}
          />

          <div className="mt-4 space-y-4">
            {/* Sekcja: WYBRANE ĆWICZENIA */}
            <div>
              <p className="text-sm font-medium text-neutral-400 mb-2">Wybrane ćwiczenia (kolejność):</p>
              {selectedExercisesForRoutine.length === 0 ? (
                <p className="text-xs text-neutral-600 italic border border-dashed border-neutral-800 rounded-xl p-3 text-center">Brak wybranych ćwiczeń.</p>
              ) : (
                <div className="space-y-2">
                  {selectedExercisesForRoutine.map((exId, idx) => {
                    const ex = exercises.find(e => e.id === exId);
                    if(!ex) return null;
                    return (
                      <div key={exId + idx} className={`flex items-center justify-between ${theme.bgMain10} border ${theme.borderMain20} p-2.5 rounded-xl`}>
                        <div className="flex items-center gap-2 overflow-hidden">
                          <span className={`${theme.textMain} opacity-70 shrink-0`}><MuscleIcon category={ex.target.split(' - ')[0]} className="w-4 h-4"/></span>
                          <span className={`font-medium ${theme.textMain} text-sm truncate pr-2`}>{idx + 1}. {ex.name}</span>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <button onClick={() => moveExercise(idx, 'up')} disabled={idx === 0} className="p-1.5 text-neutral-400 hover:text-white disabled:opacity-20 transition-colors"><ArrowUp size={16}/></button>
                          <button onClick={() => moveExercise(idx, 'down')} disabled={idx === selectedExercisesForRoutine.length - 1} className="p-1.5 text-neutral-400 hover:text-white disabled:opacity-20 transition-colors"><ArrowDown size={16}/></button>
                          <div className="w-px h-4 bg-neutral-700 mx-1"></div>
                          <button onClick={() => setSelectedExercisesForRoutine(selectedExercisesForRoutine.filter((_, i) => i !== idx))} className="p-1.5 text-red-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"><Trash2 size={16}/></button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Sekcja: DOSTĘPNE ĆWICZENIA */}
            <div>
              <p className="text-sm font-medium text-neutral-400 mb-2">Kliknij, aby dodać ćwiczenie:</p>
              <div className="max-h-48 overflow-y-auto space-y-2 border border-neutral-800 rounded-xl p-2 bg-neutral-950/50 custom-scrollbar">
                {exercises.filter(ex => !selectedExercisesForRoutine.includes(ex.id)).map(ex => (
                  <div 
                    key={ex.id} 
                    onClick={() => setSelectedExercisesForRoutine([...selectedExercisesForRoutine, ex.id])} 
                    className="flex items-center justify-between bg-neutral-900 border border-transparent hover:border-neutral-700 p-3 rounded-xl cursor-pointer transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-neutral-500 bg-neutral-800 p-2 rounded-lg shrink-0">
                        <MuscleIcon category={ex.target.split(' - ')[0]} className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-neutral-300 text-sm font-medium block">{ex.name}</span>
                        <span className="text-[10px] text-neutral-500 uppercase">{ex.target}</span>
                      </div>
                    </div>
                    <div className="w-6 h-6 shrink-0 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-400 ml-2">
                      <Plus size={14} />
                    </div>
                  </div>
                ))}
                {exercises.filter(ex => !selectedExercisesForRoutine.includes(ex.id)).length === 0 && (
                  <p className="text-xs text-neutral-600 text-center py-4">Wszystkie dostępne ćwiczenia zostały już dodane do tego planu.</p>
                )}
              </div>
            </div>
          </div>

          <button 
            onClick={saveRoutine}
            disabled={!newRoutineName.trim() || selectedExercisesForRoutine.length === 0}
            className={`w-full bg-gradient-to-r ${theme.gradMainSec} text-white p-3.5 rounded-xl font-bold flex items-center justify-center gap-2 mt-6 disabled:opacity-50 disabled:grayscale transition-all shadow-lg ${theme.shadowMain20}`}
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
        <h2 className="text-2xl font-bold text-neutral-100">Witaj na treningu! 💪</h2>
        <p className="text-neutral-400">Wybierz plan, aby rozpocząć:</p>
        
        <div className="space-y-4">
          {routines.length === 0 ? (
            <div className="bg-neutral-900 border border-neutral-800 text-neutral-400 p-6 rounded-2xl text-center">
              Przejdź do zakładki "Plany", aby stworzyć swój pierwszy trening.
            </div>
          ) : (
            routines.map(routine => (
              <button 
                key={routine.id}
                onClick={() => startWorkout(routine)}
                className={`w-full bg-neutral-900 p-5 rounded-2xl shadow-md border border-neutral-800 flex justify-between items-center ${theme.hoverBorderMain50} hover:bg-neutral-800/80 transition-all group text-left`}
              >
                <div>
                  <h4 className={`font-bold text-lg text-neutral-200 ${theme.groupHoverTextMain} transition-colors`}>{routine.name}</h4>
                  <p className="text-sm text-neutral-500 mt-1">
                    {routine.exercises.length} ćwiczeń • Ostatnio: {getRoutineLastDone(routine.name)}
                  </p>
                </div>
                <div className={`bg-neutral-950 border border-neutral-800 ${theme.textMain} p-3 rounded-full group-hover:bg-gradient-to-r ${theme.gradHover} group-hover:text-neutral-900 transition-all shadow-lg shadow-transparent ${theme.groupHoverShadowMain20}`}>
                  <Play size={20} fill="currentColor" />
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
      <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center shadow-2xl shadow-emerald-500/30">
        <Check size={48} className="text-white" strokeWidth={3} />
      </div>
      
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-black text-neutral-100">Świetna robota!</h2>
        <p className="text-neutral-400">{summaryData.routineName} • {summaryData.date}</p>
      </div>

      <div className="w-full bg-neutral-900 rounded-3xl p-6 border border-neutral-800 space-y-6 shadow-xl">
        <div className="flex justify-between items-center border-b border-neutral-800 pb-5">
          <span className="text-neutral-400 font-medium">Czas trwania</span>
          <span className="font-black text-2xl text-neutral-100">{summaryData.duration}</span>
        </div>
        
        <div className="flex justify-between items-center border-b border-neutral-800 pb-5">
          <span className="text-neutral-400 font-medium">Przerzucony ciężar</span>
          <span className={`font-black text-3xl text-transparent bg-clip-text bg-gradient-to-r ${theme.gradMainSec}`}>{summaryData.totalVolume} kg</span>
        </div>

        <div className="pt-2">
          <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-4">Rozbicie na ćwiczenia</h4>
          <div className="space-y-3">
            {summaryData.exerciseSummaries.map((ex, idx) => {
              const exDetails = exercises.find(e => e.name === ex.name);
              const cat = exDetails ? exDetails.target.split(' - ')[0] : '';
              return (
                <div key={idx} className="flex justify-between items-center bg-neutral-950 p-4 rounded-2xl border border-neutral-800/50">
                  <div className="flex items-center gap-3 overflow-hidden pr-4">
                    <div className="text-neutral-500 shrink-0"><MuscleIcon category={cat} className="w-4 h-4"/></div>
                    <span className="text-neutral-300 font-medium truncate">{ex.name}</span>
                  </div>
                  <span className="text-emerald-500 font-bold whitespace-nowrap bg-emerald-500/10 px-3 py-1 rounded-lg shrink-0">{ex.volume} kg</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <button
        onClick={() => setSummaryData(null)}
        className="w-full bg-neutral-800 text-neutral-200 py-4 rounded-2xl font-bold hover:bg-neutral-700 hover:text-white transition-colors mt-4"
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
      return "Brak historii";
    };

    return (
      <div className="pb-24">
        {/* Nagłówek aktywnego treningu */}
        <div className="sticky top-0 bg-neutral-900/90 backdrop-blur-md border-b border-neutral-800 p-4 shadow-md z-10 flex justify-between items-center rounded-b-[32px]">
          <div className="flex items-center gap-3 overflow-hidden">
            <div 
              onClick={() => setShowEasterEgg(true)}
              className="w-10 h-10 rounded-full border-2 border-red-600 bg-red-950 overflow-hidden flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(220,38,38,0.5)] cursor-pointer hover:scale-105 transition-transform"
              title="Pokaż Easter Egg"
            >
              <img 
                src="image_b14c62.jpg" 
                alt="Ronnie Coleman" 
                className="w-full h-full object-cover object-[center_15%] scale-125"
              />
            </div>
            <div className="truncate">
              <p className="text-emerald-500 text-xs font-bold uppercase tracking-wider mb-1">Aktywny trening</p>
              <h2 className="text-xl font-bold text-neutral-100 truncate">{activeWorkout.routineName}</h2>
            </div>
          </div>
          <button 
            onClick={() => setShowCancelConfirm(true)}
            className="text-neutral-500 hover:text-red-400 bg-neutral-800/50 hover:bg-red-500/10 p-2 rounded-xl transition-all border border-transparent hover:border-red-500/20 shrink-0 ml-4"
            title="Wyjdź bez zapisywania"
          >
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>

        <div className="p-4 space-y-6">
          {activeWorkout.exercises.map((workoutEx, exIndex) => {
            const exerciseDetails = exercises.find(e => e.id === workoutEx.exerciseId);
            if (!exerciseDetails) return null;

            return (
              <div key={exIndex} className="bg-neutral-900 rounded-2xl shadow-lg border border-neutral-800 overflow-hidden">
                <div className="bg-neutral-800/40 p-4 border-b border-neutral-800 flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-center ${theme.textMain} shadow-inner shrink-0`}>
                      <MuscleIcon category={exerciseDetails.target.split(' - ')[0]} className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="font-bold text-neutral-200 text-lg">{exerciseDetails.name}</h3>
                        <button 
                          onClick={() => toggleChart(exerciseDetails.id)} 
                          className={`${theme.textSec} ${theme.bgSec10} p-1.5 rounded-xl ${theme.hoverBgSec20} transition-all shadow-sm shrink-0`}
                          title="Pokaż statystyki i wykres"
                        >
                          <BarChart2 size={18} strokeWidth={2.5} />
                        </button>
                      </div>
                      <p className="text-xs text-emerald-500 mt-1 font-medium">{getLastExercisePerformance(exerciseDetails.id)}</p>
                    </div>
                  </div>
                </div>
                
                {/* ROZWIJANY PANEL HISTORII I WYKRESU */}
                {expandedCharts[exerciseDetails.id] && (
                  <div className="bg-neutral-900 border-b border-neutral-800 p-4">
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
                        return <p className="text-sm text-neutral-500 text-center py-2">Brak zapisanej historii dla tego ćwiczenia.</p>;
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
                          <div className="bg-neutral-950 p-4 rounded-2xl border border-neutral-800">
                            <h4 className="text-xs font-bold text-neutral-400 uppercase mb-3 tracking-wider">Ostatnia sesja ({latest.date})</h4>
                            {latest.sets.length === 0 ? (
                              <p className="text-xs text-neutral-500">Brak zapisanych poprawnie serii.</p>
                            ) : (
                              <>
                                <div className="grid grid-cols-3 gap-2 text-[10px] text-neutral-500 font-bold border-b border-neutral-800 pb-2 mb-2 uppercase tracking-wider">
                                  <div>Seria</div>
                                  <div className="text-center">kg</div>
                                  <div className="text-center">Powt.</div>
                                </div>
                                <div className="space-y-2">
                                  {latest.sets.map((s, idx) => (
                                    <div key={idx} className="grid grid-cols-3 gap-2 text-xs text-neutral-300 py-1">
                                      <div className="font-bold text-neutral-500">#{idx + 1}</div>
                                      <div className={`text-center font-bold ${theme.textSec}`}>{s.weight}</div>
                                      <div className="text-center font-bold text-emerald-500">{s.reps}</div>
                                    </div>
                                  ))}
                                </div>
                              </>
                            )}
                          </div>

                          <div className="bg-neutral-950 p-4 rounded-2xl border border-neutral-800 relative">
                            <div className="flex justify-between items-center mb-4">
                              <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Historia (max 6)</h4>
                              <div className="flex gap-3 text-[10px] font-bold">
                                <span className={`${theme.textSec} flex items-center gap-1.5`}>
                                  <div className={`w-2.5 h-2.5 ${theme.bgSec30} border ${theme.borderSec} rounded-sm`}></div> Śr. kg
                                </span>
                                <span className="text-emerald-500 flex items-center gap-1.5">
                                  <div className="w-2.5 h-2.5 bg-emerald-500/30 border border-emerald-500 rounded-sm"></div> Śr. Powt.
                                </span>
                              </div>
                            </div>
                            
                            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible mt-2">
                              <polyline points={pointsLineW} fill="none" stroke={theme.chartSecFill} strokeWidth="1.5" strokeDasharray="4 4" className="opacity-60" />
                              <polyline points={pointsLineR} fill="none" stroke="#10b981" strokeWidth="1.5" strokeDasharray="4 4" className="opacity-60" />

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
                                    <rect x={xW - 5} y={yW} width="10" height={hW} className={`${theme.fillSec20} ${theme.hoverFillSec40} transition-colors cursor-pointer`} rx="2" />
                                    <circle cx={xW} cy={yW} r="2.5" fill={theme.chartSecFill} />
                                    <text x={xW} y={yW - 6} fontSize="9" fill={theme.chartSecFill} textAnchor="middle" fontWeight="bold">{Math.round(d.avgW)}</text>

                                    <rect x={xR - 5} y={yR} width="10" height={hR} className="fill-emerald-500/20 hover:fill-emerald-500/40 transition-colors cursor-pointer" rx="2" />
                                    <circle cx={xR} cy={yR} r="2.5" fill="#10b981" />
                                    <text x={xR} y={yR - 6} fontSize="9" fill="#10b981" textAnchor="middle" fontWeight="bold">{Math.round(d.avgR)}</text>

                                    <text x={x} y={height - 2} fontSize="9" fill="#737373" textAnchor="middle">{d.shortDate}</text>
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

                <div className="p-4">
                  <div className="grid grid-cols-12 gap-2 mb-3 text-xs font-bold text-neutral-500 uppercase tracking-wider px-2">
                    <div className="col-span-2 text-center">Seria</div>
                    <div className="col-span-5 text-center">kg</div>
                    <div className="col-span-5 text-center">Powt.</div>
                  </div>

                  <div className="space-y-3">
                    {workoutEx.sets.map((set, setIndex) => (
                      <div 
                        key={setIndex} 
                        className="grid grid-cols-12 gap-2 items-center p-2 rounded-xl transition-all border bg-transparent border-transparent hover:bg-neutral-800/50"
                      >
                        <div className="col-span-2 text-center font-bold text-neutral-500">
                          {setIndex + 1}
                        </div>
                        <div className="col-span-5">
                          <input 
                            type="number" 
                            placeholder="-"
                            value={set.weight}
                            onChange={(e) => updateSet(exIndex, setIndex, 'weight', e.target.value)}
                            className={`w-full text-center p-2 bg-neutral-950 border border-neutral-800 rounded-lg font-semibold text-neutral-200 focus:ring-1 ${theme.focusRingMain} ${theme.focusBorderMain} transition-all outline-none`}
                          />
                        </div>
                        <div className="col-span-5">
                          <input 
                            type="number" 
                            placeholder="-"
                            value={set.reps}
                            onChange={(e) => updateSet(exIndex, setIndex, 'reps', e.target.value)}
                            className={`w-full text-center p-2 bg-neutral-950 border border-neutral-800 rounded-lg font-semibold text-neutral-200 focus:ring-1 ${theme.focusRingMain} ${theme.focusBorderMain} transition-all outline-none`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <button 
                    onClick={() => addSet(exIndex)}
                    className={`mt-5 w-full py-3 text-sm font-bold ${theme.textMain} ${theme.bgMain10} border ${theme.borderMain20} ${theme.hoverBgMain20} rounded-xl flex items-center justify-center gap-2 transition-colors`}
                  >
                    <Plus size={18} /> Dodaj serię
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const HistoryView = () => {
    // Widok szczegółowy wykresu po kliknięciu w ćwiczenie
    if (selectedHistoryExercise) {
      const exerciseId = selectedHistoryExercise;
      const exerciseDetails = exercises.find(e => e.id === exerciseId);

      // Wyciągamy z historii wszystkie sesje chronologicznie
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

      // Matematyka: wyznaczanie globalnej linii trendu (Regresja liniowa ze wszystkich wyników)
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

      const chartData = allSessions.slice(-15); // max 15 na wykresie
      const listData = allSessions.slice(-10).reverse(); // 10 ostatnich (odwrócone = najnowsze na górze tabeli)

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
          <div className="flex items-center justify-between bg-neutral-900 p-4 rounded-2xl shadow-sm border border-neutral-800">
            <div>
              <h3 className="font-bold text-lg text-neutral-100">{exerciseDetails?.name}</h3>
              <p className="text-xs text-neutral-500 uppercase">{exerciseDetails?.target}</p>
            </div>
            <button onClick={() => setSelectedHistoryExercise(null)} className="text-neutral-500 hover:text-white p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 transition-colors">
              <X size={20} strokeWidth={2.5} />
            </button>
          </div>

          <div className="bg-neutral-900 p-5 rounded-2xl border border-neutral-800 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Wykres (max 15)</h4>
              <div className="flex gap-3 text-[10px] font-bold">
                <span className={`${theme.textSec} flex items-center gap-1.5`}>
                  <div className={`w-2.5 h-2.5 ${theme.bgSec30} border ${theme.borderSec} rounded-sm`}></div> Max kg
                </span>
                <span className="text-blue-500 flex items-center gap-1.5">
                  <div className="w-2.5 h-0.5 bg-blue-500"></div> Trend globalny
                </span>
              </div>
            </div>

            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible mt-2">
              {chartData.length > 1 && (
                <polyline points={trendLinePoints} fill="none" stroke="#3b82f6" strokeWidth="2" strokeDasharray="5 5" className="opacity-80" />
              )}
              {chartData.map((d, i) => {
                const x = getX(i);
                const hW = (d.maxW / maxChartW) * chartH;
                const yW = padY + chartH - hW;
                return (
                  <g key={`hist-bar-${i}`}>
                    <rect x={x - 6} y={yW} width="12" height={hW} className={`${theme.fillSec20} ${theme.hoverFillSec40} transition-colors cursor-pointer`} rx="2" />
                    <circle cx={x} cy={yW} r="2.5" fill={theme.chartSecFill} />
                    <text x={x} y={yW - 6} fontSize="9" fill={theme.chartSecFill} textAnchor="middle" fontWeight="bold">{Math.round(d.maxW)}</text>
                    <text x={x} y={height - 2} fontSize="9" fill="#737373" textAnchor="middle">{d.shortDate}</text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="space-y-3 pb-6">
            <h4 className="text-sm font-bold text-neutral-400 uppercase tracking-wider pl-2">Ostatnie 10 treningów</h4>
            {listData.map((session, idx) => (
              <div key={idx} className="bg-neutral-900 rounded-2xl border border-neutral-800 p-4">
                <p className={`text-xs font-bold ${theme.textMain} mb-3`}>{session.date}</p>
                <div className="grid grid-cols-3 gap-2 text-[10px] text-neutral-500 font-bold border-b border-neutral-800 pb-2 mb-2 uppercase tracking-wider">
                  <div>Seria</div>
                  <div className="text-center">kg</div>
                  <div className="text-center">Powt.</div>
                </div>
                <div className="space-y-2">
                  {session.sets.map((s, sIdx) => (
                    <div key={sIdx} className="grid grid-cols-3 gap-2 text-xs text-neutral-300 py-1">
                      <div className="font-bold text-neutral-500">#{sIdx + 1}</div>
                      <div className={`text-center font-bold ${theme.textSec}`}>{s.weight}</div>
                      <div className="text-center font-bold text-emerald-500">{s.reps}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // Widok listy historycznych ćwiczeń
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
        <h2 className="text-2xl font-bold text-neutral-100">Historia ćwiczeń</h2>
        <p className="text-neutral-400">Wybierz ćwiczenie, aby zobaczyć swoje postępy.</p>
        
        <div className="space-y-3">
          {performedExercises.length === 0 ? (
            <div className="bg-neutral-900 border border-neutral-800 text-neutral-400 p-6 rounded-2xl text-center">
              Brak historii. Wykonaj swój pierwszy trening!
            </div>
          ) : (
            performedExercises.map(ex => (
              <button 
                key={ex.id} 
                onClick={() => setSelectedHistoryExercise(ex.id)}
                className={`w-full flex items-center justify-between bg-neutral-900 p-4 rounded-xl shadow-sm border border-neutral-800 ${theme.hoverBorderMain50} hover:bg-neutral-800/80 transition-colors group`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-center ${theme.textMain} shadow-inner shrink-0`}>
                    <MuscleIcon category={ex.target.split(' - ')[0]} className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <p className={`font-medium text-neutral-200 leading-tight mb-1 ${theme.groupHoverTextMain} transition-colors`}>{ex.name}</p>
                    <p className="text-[11px] font-bold tracking-wide text-neutral-500 uppercase">{ex.target}</p>
                  </div>
                </div>
                <ChevronRight className="text-neutral-600 group-hover:text-neutral-400 transition-colors" size={20} />
              </button>
            ))
          )}
        </div>
      </div>
    );
  };

  // --- GŁÓWNY RENDER APLIKACJI ---
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex justify-center font-sans text-neutral-200 overflow-hidden">
      <div className="w-full max-w-md bg-neutral-950 min-h-screen relative shadow-2xl overflow-hidden flex flex-col border-x border-neutral-900">
        
        {/* LOGO I WYBÓR PROFILU - Górny pasek zaoblony nowoczesny */}
        {!activeWorkout && !summaryData && (
          <header className="bg-neutral-900/80 backdrop-blur-xl p-4 border-b border-neutral-800 flex justify-between items-center sticky top-0 z-10 rounded-b-[32px] shadow-lg shadow-black/20">
            <h1 className={`text-xl font-black flex items-center gap-3 text-transparent bg-clip-text bg-gradient-to-r ${theme.gradMainSec} italic tracking-tight uppercase`}>
              <div 
                onClick={() => setShowEasterEgg(true)}
                className="w-11 h-11 rounded-full border-2 border-red-600 bg-red-950 overflow-hidden flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(220,38,38,0.5)] cursor-pointer hover:scale-105 transition-transform"
                title="Pokaż Easter Egg"
              >
                <img 
                  src="image_b14c62.jpg" 
                  alt="Ronnie Coleman" 
                  className="w-full h-full object-cover object-[center_15%] scale-125"
                />
              </div>
              <span className="hidden sm:inline">Lightweight Babyyy</span>
              <span className="sm:hidden text-lg">RonnieGym</span>
            </h1>

            {/* KÓŁKA UŻYTKOWNIKÓW */}
            <div className="flex gap-3 shrink-0 ml-4">
              <button 
                onClick={() => setCurrentUser('turtle')} 
                className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-xl transition-all ${currentUser === 'turtle' ? 'border-lime-500 bg-lime-500/20 scale-110 shadow-[0_0_10px_rgba(132,204,22,0.5)]' : 'border-neutral-700 bg-neutral-800/50 opacity-60 hover:opacity-100'}`}
                title="Profil: Żółw"
              >
                🐢
              </button>
              <button 
                onClick={() => setCurrentUser('blonde')} 
                className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-xl transition-all ${currentUser === 'blonde' ? 'border-amber-400 bg-amber-400/20 scale-110 shadow-[0_0_10px_rgba(251,191,36,0.5)]' : 'border-neutral-700 bg-neutral-800/50 opacity-60 hover:opacity-100'}`}
                title="Profil: Blondynka"
              >
                👱‍♀️
              </button>
            </div>
          </header>
        )}

        <main className="flex-1 overflow-y-auto custom-scrollbar">
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
            <button 
              onClick={() => setShowFinishConfirm(true)}
              className="pointer-events-auto bg-gradient-to-r from-emerald-600 to-emerald-500 text-white px-8 py-4 rounded-full font-bold shadow-2xl shadow-emerald-900/40 flex items-center gap-3 hover:scale-105 hover:-translate-y-1 transition-all border border-emerald-400/30"
            >
              <Check size={24} strokeWidth={3} /> Zakończ trening
            </button>
          </div>
        )}

        {showFinishConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-3xl shadow-2xl w-full max-w-sm flex flex-col">
              <h3 className="text-xl font-bold text-neutral-100 mb-2">Zakończyć trening?</h3>
              <p className="text-neutral-400 mb-6">Czy na pewno chcesz zakończyć i podsumować obecny trening?</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowFinishConfirm(false)}
                  className="flex-1 py-3 rounded-xl font-bold text-neutral-300 bg-neutral-800 hover:bg-neutral-700 transition-colors"
                >
                  Anuluj
                </button>
                <button
                  onClick={finishWorkout}
                  className="flex-1 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 transition-colors shadow-lg shadow-emerald-900/20"
                >
                  Zakończ
                </button>
              </div>
              <button
                onClick={() => {
                  setActiveWorkout(null);
                  setShowFinishConfirm(false);
                }}
                className="mt-5 text-sm font-medium text-neutral-500 hover:text-red-400 transition-colors text-center"
              >
                wyjdź ale nie zapisuj wyników
              </button>
            </div>
          </div>
        )}

        {showCancelConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-3xl shadow-2xl w-full max-w-sm flex flex-col">
              <h3 className="text-xl font-bold text-neutral-100 mb-2">Przerwać trening?</h3>
              <p className="text-neutral-400 mb-6">Wszystkie dzisiejsze wyniki zostaną usunięte. Te operacji nie można cofnąć.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowCancelConfirm(false)}
                  className="flex-1 py-3 rounded-xl font-bold text-neutral-300 bg-neutral-800 hover:bg-neutral-700 transition-colors"
                >
                  Wróć do ćwiczeń
                </button>
                <button
                  onClick={() => {
                    setActiveWorkout(null);
                    setShowCancelConfirm(false);
                  }}
                  className="flex-1 py-3 rounded-xl font-bold text-white bg-red-600 hover:bg-red-500 transition-colors shadow-lg shadow-red-900/20"
                >
                  Przerwij
                </button>
              </div>
            </div>
          </div>
        )}

        {/* --- EASTER EGG MODAL (Z RONNIE COLEMANEM) --- */}
        {showEasterEgg && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md p-4 animate-in fade-in zoom-in duration-300">
            <button 
              onClick={() => setShowEasterEgg(false)}
              className="absolute top-6 right-6 text-neutral-400 hover:text-white bg-neutral-900/50 hover:bg-red-600 p-3 rounded-full transition-all border border-neutral-800 hover:border-red-500 z-10"
            >
              <X size={28} strokeWidth={2.5} />
            </button>
            <div className="flex flex-col items-center justify-center max-w-lg w-full">
              <img 
                src="image_b14c62.jpg" 
                alt="YEAH BUDDY" 
                className="w-full h-auto rounded-2xl shadow-[0_0_50px_rgba(220,38,38,0.3)] border border-neutral-800"
              />
              <p className="mt-8 text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-red-500 to-red-700 italic tracking-widest text-center uppercase drop-shadow-[0_0_15px_rgba(220,38,38,0.8)]">
                YEAH BUDDY! 💪
              </p>
            </div>
          </div>
        )}

        {/* Dolny pasek nawigacji - PŁYWAJĄCA PASTYLKA Z GRADIENTEM */}
        {!activeWorkout && !summaryData && (
          <div className="sticky bottom-6 left-0 right-0 z-20 flex justify-center px-4">
            <nav className={`w-full max-w-sm bg-neutral-900/40 backdrop-blur-2xl border border-white/5 rounded-full shadow-2xl shadow-black/60 overflow-hidden relative group`}>
              {/* Efekt poświaty/gradientu tła nawigacji */}
              <div className={`absolute inset-0 bg-gradient-to-t ${theme.navGrad} to-transparent opacity-30 pointer-events-none`}></div>
              
              <div className="flex justify-around p-2 relative z-10">
                <button 
                  onClick={() => setActiveTab('workout')}
                  className={`flex-1 flex flex-col items-center p-2.5 rounded-full transition-all duration-300 ${activeTab === 'workout' ? `${theme.textMain} ${theme.bgMain10} scale-105` : 'text-neutral-500 hover:text-neutral-300'}`}
                >
                  <Play size={22} className={activeTab === 'workout' ? theme.fillMain20 : ''} />
                  <span className="text-[9px] font-bold mt-1 uppercase tracking-wider">Trening</span>
                </button>
                
                <button 
                  onClick={() => setActiveTab('routines')}
                  className={`flex-1 flex flex-col items-center p-2.5 rounded-full transition-all duration-300 ${activeTab === 'routines' ? `${theme.textMain} ${theme.bgMain10} scale-105` : 'text-neutral-500 hover:text-neutral-300'}`}
                >
                  <List size={22} />
                  <span className="text-[9px] font-bold mt-1 uppercase tracking-wider">Plany</span>
                </button>

                <button 
                  onClick={() => setActiveTab('history')}
                  className={`flex-1 flex flex-col items-center p-2.5 rounded-full transition-all duration-300 ${activeTab === 'history' ? `${theme.textMain} ${theme.bgMain10} scale-105` : 'text-neutral-500 hover:text-neutral-300'}`}
                >
                  <History size={22} className={activeTab === 'history' ? theme.fillMain20 : ''} />
                  <span className="text-[9px] font-bold mt-1 uppercase tracking-wider">Historia</span>
                </button>
                
                <button 
                  onClick={() => setActiveTab('library')}
                  className={`flex-1 flex flex-col items-center p-2.5 rounded-full transition-all duration-300 ${activeTab === 'library' ? `${theme.textMain} ${theme.bgMain10} scale-105` : 'text-neutral-500 hover:text-neutral-300'}`}
                >
                  <Dumbbell size={22} className={activeTab === 'library' ? theme.fillMain20 : ''} />
                  <span className="text-[9px] font-bold mt-1 uppercase tracking-wider">Biblioteka</span>
                </button>
              </div>
            </nav>
          </div>
        )}

      </div>
    </div>
  );
}
