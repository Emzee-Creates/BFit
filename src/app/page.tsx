"use client";

import { useState, useEffect } from 'react';
import { LogOut, TrendingUp, Calendar, Utensils, Dumbbell, Lightbulb, Plus, Trash2, Check } from 'lucide-react';

// Enhanced Types for Macro Blueprint Tracking
type Tab = 'dashboard' | 'calories' | 'meals' | 'workout' | 'tips';

interface CalorieEntry {
  id: string;
  name: string;
  kcal: number;
  protein: number;
  carbs: number;
  fats: number;
  timestamp: number;
}

interface WeightEntry {
  id: string;
  weight: number;
  date: string;
}

interface WorkoutCompletion {
  date: string;
  type: string;
}

interface MealLogStatus {
  [key: string]: boolean;
}

const STORAGE_KEYS = {
  CALORIE_ENTRIES: 'naija_mass_calories_v2',
  WEIGHT_ENTRIES: 'naija_mass_weight',
  WORKOUT_COMPLETIONS: 'naija_mass_workouts',
  MEAL_LOG_STATUS: 'naija_mass_meal_status',
  CURRENT_WEIGHT: 'naija_mass_current_weight',
  PROFILE_NAME: 'naija_mass_profile_name'
};

// Helper to group calorie entries by date string
function groupEntriesByDate(entries: CalorieEntry[]) {
  return entries.reduce((groups: { [key: string]: CalorieEntry[] }, entry) => {
    const dateStr = new Date(entry.timestamp).toLocaleDateString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
    if (!groups[dateStr]) groups[dateStr] = [];
    groups[dateStr].push(entry);
    return groups;
  }, {});
}

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [calorieEntries, setCalorieEntries] = useState<CalorieEntry[]>([]);
  const [weightEntries, setWeightEntries] = useState<WeightEntry[]>([]);
  const [workoutCompletions, setWorkoutCompletions] = useState<WorkoutCompletion[]>([]);
  const [mealLogStatus, setMealLogStatus] = useState<MealLogStatus>({});
  const [currentWeight, setCurrentWeight] = useState<number>(60);
  
  // Custom Dynamic Profile
  const [profileName, setProfileName] = useState('Emmanuel');
  const [isEditingName, setIsEditingName] = useState(false);

  // Form states
  const [newWeight, setNewWeight] = useState('');
  const [customFood, setCustomFood] = useState('');
  const [customKcal, setCustomKcal] = useState('');
  const [customProtein, setCustomProtein] = useState('');
  const [customCarbs, setCustomCarbs] = useState('');
  const [customFats, setCustomFats] = useState('');
  const [selectedQuickFood, setSelectedQuickFood] = useState('');
  const [activeWorkoutDay, setActiveWorkoutDay] = useState<string>('push');

  useEffect(() => {
    const loadedCalories = localStorage.getItem(STORAGE_KEYS.CALORIE_ENTRIES);
    const loadedWeight = localStorage.getItem(STORAGE_KEYS.WEIGHT_ENTRIES);
    const loadedWorkouts = localStorage.getItem(STORAGE_KEYS.WORKOUT_COMPLETIONS);
    const loadedMealStatus = localStorage.getItem(STORAGE_KEYS.MEAL_LOG_STATUS);
    const loadedCurrentWeight = localStorage.getItem(STORAGE_KEYS.CURRENT_WEIGHT);
    const loadedName = localStorage.getItem(STORAGE_KEYS.PROFILE_NAME);

    if (loadedCalories) setCalorieEntries(JSON.parse(loadedCalories));
    if (loadedWeight) setWeightEntries(JSON.parse(loadedWeight));
    if (loadedWorkouts) setWorkoutCompletions(JSON.parse(loadedWorkouts));
    if (loadedMealStatus) setMealLogStatus(JSON.parse(loadedMealStatus));
    if (loadedCurrentWeight) setCurrentWeight(parseFloat(loadedCurrentWeight));
    if (loadedName) setProfileName(loadedName);
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CALORIE_ENTRIES, JSON.stringify(calorieEntries));
  }, [calorieEntries]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WEIGHT_ENTRIES, JSON.stringify(weightEntries));
  }, [weightEntries]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WORKOUT_COMPLETIONS, JSON.stringify(workoutCompletions));
  }, [workoutCompletions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MEAL_LOG_STATUS, JSON.stringify(mealLogStatus));
  }, [mealLogStatus]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_WEIGHT, currentWeight.toString());
  }, [currentWeight]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROFILE_NAME, profileName);
  }, [profileName]);

  // Comprehensive Local Micro/Macro Food Data Matrix
  const quickFoods = [
    { name: 'Roasted Groundnuts (100g)', kcal: 567, p: 25, c: 16, f: 49 },
    { name: 'Garri (1 cup soaked)', kcal: 360, p: 2, c: 88, f: 0 },
    { name: 'Brown Beans (1 cup)', kcal: 245, p: 15, c: 45, f: 1 },
    { name: 'Boiled Eggs (2 large)', kcal: 140, p: 13, c: 1, f: 10 },
    { name: 'Palm Oil (2 tbsp)', kcal: 240, p: 0, c: 0, f: 27 },
    { name: 'White Rice (1 cup)', kcal: 206, p: 4, c: 45, f: 0 },
    { name: 'Yam (200g)', kcal: 236, p: 3, c: 56, f: 0 },
    { name: 'Peanut Butter (2 tbsp)', kcal: 190, p: 8, c: 6, f: 16 },
  ];

  const today = new Date().toDateString();
  const todayEntries = calorieEntries.filter(entry => new Date(entry.timestamp).toDateString() === today);

  // Dynamic Multi-Macro Totals Compilation
  const totals = todayEntries.reduce((acc, entry) => {
    acc.kcal += entry.kcal;
    acc.p += entry.protein || 0;
    acc.c += entry.carbs || 0;
    acc.f += entry.fats || 0;
    return acc;
  }, { kcal: 0, p: 0, c: 0, f: 0 });

  const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const thisWeekWorkouts = workoutCompletions.filter(w => new Date(w.date).getTime() > oneWeekAgo).length;

  const handleAddCalories = (name: string, kcal: number, p: number, c: number, f: number) => {
    const newEntry: CalorieEntry = {
      id: Date.now().toString(),
      name,
      kcal,
      protein: p,
      carbs: c,
      fats: f,
      timestamp: Date.now(),
    };
    setCalorieEntries([newEntry, ...calorieEntries]);
  };

  const handleQuickAdd = () => {
    if (!selectedQuickFood) return;
    const food = quickFoods.find(f => f.name === selectedQuickFood);
    if (food) {
      handleAddCalories(food.name, food.kcal, food.p, food.c, food.f);
      setSelectedQuickFood('');
    }
  };

  const handleCustomAdd = () => {
    if (!customFood || !customKcal) return;
    handleAddCalories(
      customFood, 
      parseInt(customKcal),
      parseInt(customProtein) || 0,
      parseInt(customCarbs) || 0,
      parseInt(customFats) || 0
    );
    setCustomFood('');
    setCustomKcal('');
    setCustomProtein('');
    setCustomCarbs('');
    setCustomFats('');
  };

  const handleLogMeal = (meal: { id: string; name: string; kcal: number; p: number; c: number; f: number }) => {
    handleAddCalories(meal.name, meal.kcal, meal.p, meal.c, meal.f);
    setMealLogStatus({ ...mealLogStatus, [meal.id]: true });
  };

  const workoutRoutines = {
    push: [
      { exercise: 'Single DB Floor Press', sets: '4 x 12-15', notes: 'Alternate arms each set' },
      { exercise: 'Single DB Shoulder Press', sets: '3 x 10-12', notes: 'Standing or seated' },
      { exercise: 'Push-ups', sets: '3 x max', notes: 'Full range of motion' },
      { exercise: 'Tricep Dips', sets: '3 x 12-15', notes: 'Use chair or bench' },
    ],
    pull: [
      { exercise: 'Single DB Row', sets: '4 x 12 each', notes: 'Bent over, elbow close to pocket' },
      { exercise: 'DB Pullover', sets: '3 x 12-15', notes: 'Focus on fully stretching lats' },
      { exercise: 'DB Bicep Curl', sets: '3 x 12-15', notes: 'Keep elbows strictly pinned' },
      { exercise: 'DB Hammer Curl', sets: '3 x 12', notes: 'Develop forearm density' },
    ],
    legs: [
      { exercise: 'Goblet Squat', sets: '4 x 15-20', notes: 'Hold DB heavily at chest level' },
      { exercise: 'DB Romanian Deadlift', sets: '4 x 12-15', notes: 'Hip hinge sequence, straight back' },
      { exercise: 'DB Lunges', sets: '3 x 12 each', notes: 'Alternating patterns' },
    ],
    fullA: [
      { exercise: 'Goblet Squat', sets: '3 x 15', notes: 'Full compound leg drive' },
      { exercise: 'Single DB Floor Press', sets: '3 x 12 each', notes: 'Upper body push' },
      { exercise: 'Single DB Row', sets: '3 x 12 each', notes: 'Upper body pull' },
    ],
    fullB: [
      { exercise: 'DB Lunges', sets: '3 x 10 each', notes: 'Lower body split emphasis' },
      { exercise: 'DB Shoulder Press', sets: '3 x 12', notes: 'Overhead strength ceiling' },
      { exercise: 'Plank Hold', sets: '3 x 45s', notes: 'Core rigidity protection' },
    ],
  };

  const mealPlans = {
    breakfast: [
      { id: 'bf1', name: 'Garri + Groundnut + Milk', kcal: 620, p: 22, c: 90, f: 18 },
      { id: 'bf2', name: '3 Boiled Eggs + Agege Bread', kcal: 540, p: 24, c: 60, f: 16 },
    ],
    snack: [
      { id: 'sn1', name: 'Roasted Groundnuts (150g)', kcal: 850, p: 37, c: 24, f: 73 },
      { id: 'sn2', name: 'Banana + Peanut Butter (3tbsp)', kcal: 405, p: 13, c: 40, f: 24 },
    ],
    lunch: [
      { id: 'ln1', name: 'Rice + Beans + Palm Oil', kcal: 780, p: 21, c: 110, f: 28 },
      { id: 'ln2', name: 'Garri + Egusi Sauce + Fish', kcal: 820, p: 32, c: 80, f: 38 },
    ],
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-0 sm:p-4">
      <div className="w-full max-w-[440px] min-h-screen bg-zinc-950 border-x border-zinc-800/60 shadow-2xl flex flex-col">
        
        {/* Dynamic Inline Editable Navbar Header */}
        <header className="sticky top-0 z-50 bg-zinc-900/90 backdrop-blur-md border-b border-zinc-700/60 px-5 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-black text-white tracking-wider">NAIJA MASS SYSTEM</h1>
            <div className="flex items-center gap-1.5 mt-0.5">
              {isEditingName ? (
                <input
                  type="text"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  onBlur={() => setIsEditingName(false)}
                  onKeyDown={(e) => e.key === 'Enter' && setIsEditingName(false)}
                  autoFocus
                  className="bg-zinc-950 border border-zinc-700 rounded px-1.5 py-0.5 text-[10px] font-bold text-white uppercase tracking-widest focus:outline-none"
                />
              ) : (
                <p 
                  onClick={() => setIsEditingName(true)}
                  className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest cursor-pointer hover:text-white transition-colors"
                >
                  {profileName} • 12-Week Bulk
                </p>
              )}
            </div>
          </div>
          <button onClick={() => alert('Data safely vaulted within local tracking storage layers.')} className="p-2 hover:bg-zinc-800 rounded-xl transition-all cursor-pointer">
            <LogOut className="w-4 h-4 text-zinc-400" />
          </button>
        </header>

        {/* Dynamic Navigation Row */}
        <div className="sticky top-[69px] z-40 bg-zinc-950/95 backdrop-blur-md border-b border-zinc-900/80 px-3 py-3 overflow-x-auto scrollbar-none">
          <div className="flex gap-2 min-w-max">
            <TabButton active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} icon={<TrendingUp className="w-3.5 h-3.5" />} label="Dashboard" />
            <TabButton active={activeTab === 'calories'} onClick={() => setActiveTab('calories')} icon={<Calendar className="w-3.5 h-3.5" />} label="Log Calories" />
            <TabButton active={activeTab === 'meals'} onClick={() => setActiveTab('meals')} icon={<Utensils className="w-3.5 h-3.5" />} label="Meal Plan" />
            <TabButton active={activeTab === 'workout'} onClick={() => setActiveTab('workout')} icon={<Dumbbell className="w-3.5 h-3.5" />} label="Workout" />
            <TabButton active={activeTab === 'tips'} onClick={() => setActiveTab('tips')} icon={<Lightbulb className="w-3.5 h-3.5" />} label="Tips" />
          </div>
        </div>

        {/* Main Interface Frame Routing */}
        <main className="flex-1 px-4 py-5 pb-24">
          {activeTab === 'dashboard' && (
            <DashboardView
              totals={totals}
              currentWeight={currentWeight}
              thisWeekWorkouts={thisWeekWorkouts}
              newWeight={newWeight}
              setNewWeight={setNewWeight}
              handleSaveWeight={() => {
                if (!newWeight) return;
                const weight = parseFloat(newWeight);
                setCurrentWeight(weight);
                setWeightEntries([{ id: Date.now().toString(), weight, date: new Date().toLocaleDateString() }, ...weightEntries]);
                setNewWeight('');
              }}
              weightEntries={weightEntries}
            />
          )}

          {activeTab === 'calories' && (
  <CaloriesView
    quickFoods={quickFoods}
    selectedQuickFood={selectedQuickFood}
    setSelectedQuickFood={setSelectedQuickFood}
    handleQuickAdd={handleQuickAdd}
    customFood={customFood} setCustomFood={setCustomFood}
    customKcal={customKcal} setCustomKcal={setCustomKcal}
    customProtein={customProtein} setCustomProtein={setCustomProtein}
    customCarbs={customCarbs} setCustomCarbs={setCustomCarbs}
    customFats={customFats} setCustomFats={setCustomFats}
    handleCustomAdd={handleCustomAdd}
    todayEntries={todayEntries}
    computedTotal={totals.kcal}
    handleDeleteEntry={(id: string) => setCalorieEntries(calorieEntries.filter(e => e.id !== id))}
    handleClearToday={() => setCalorieEntries(calorieEntries.filter(e => new Date(e.timestamp).toDateString() !== today))}
    allEntries={calorieEntries} // <-- ADD THIS LINE HERE
  />
)}

          {activeTab === 'meals' && (
            <MealsView mealPlans={mealPlans} mealLogStatus={mealLogStatus} handleLogMeal={handleLogMeal} />
          )}

          {activeTab === 'workout' && (
            <WorkoutView
              activeWorkoutDay={activeWorkoutDay}
              setActiveWorkoutDay={setActiveWorkoutDay}
              workoutRoutines={workoutRoutines}
              handleMarkWorkoutComplete={() => setWorkoutCompletions([...workoutCompletions, { date: new Date().toISOString(), type: activeWorkoutDay }])}
            />
          )}

          {activeTab === 'tips' && <TipsView />}
        </main>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold tracking-wide cursor-pointer transition-all duration-150
        ${active ? 'bg-zinc-200 text-black font-bold' : 'bg-zinc-900 text-zinc-400 border border-zinc-800'}`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

// Updated Dashboard with Macro Widget Clusters
function DashboardView({ totals, currentWeight, thisWeekWorkouts, newWeight, setNewWeight, handleSaveWeight, weightEntries }: any) {
  const targetKcal = 3300;
  const targetP = 140; // High-yield muscle growth protein floor anchor
  const targetC = 450;
  const targetF = 90;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3">
        <MetricCard label="Today's Energy" value={`${totals.kcal}`} unit="kcal" subtext={`/ ${targetKcal} target`} />
        <MetricCard label="Current Mass" value={`${currentWeight}`} unit="kg" subtext="Start: 60kg" />
        <MetricCard label="Workouts Hit" value={`${thisWeekWorkouts}`} unit="this week" />
        <MetricCard label="Timeline Progress" value="Week 1" unit="of 12" />
      </div>

      {/* Advanced Hyper-Detailed Macro Counter Panel */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-4">
        <div>
          <div className="flex justify-between text-xs mb-1.5">
            <span className="font-bold text-zinc-400 uppercase tracking-wider">Total Energy Velocity</span>
            <span className="font-black text-white">{Math.min((totals.kcal / targetKcal) * 100, 100).toFixed(0)}%</span>
          </div>
          <div className="h-2 bg-zinc-950 rounded-full overflow-hidden border border-zinc-800">
            <div className="h-full bg-white transition-all duration-300" style={{ width: `${(totals.kcal / targetKcal) * 100}%` }} />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 pt-2 border-t border-zinc-800/60">
          <MacroProgressLabel label="Protein" current={totals.p} target={targetP} color="bg-zinc-300" unit="g" />
          <MacroProgressLabel label="Carbs" current={totals.c} target={targetC} color="bg-zinc-500" unit="g" />
          <MacroProgressLabel label="Fats" current={totals.f} target={targetF} color="bg-zinc-700" unit="g" />
        </div>
      </div>

      {/* Weight Logger */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
        <h3 className="text-white text-xs uppercase tracking-wider font-bold mb-3">Log Bodyweight</h3>
        <div className="flex gap-2">
          <input
            type="number" step="0.1" placeholder="Enter weight (kg)" value={newWeight}
            onChange={(e) => setNewWeight(e.target.value)}
            className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-zinc-600"
          />
          <button onClick={handleSaveWeight} className="px-5 bg-zinc-200 text-black text-xs font-black uppercase tracking-wider rounded-lg">Save</button>
        </div>
        {weightEntries.length > 0 && (
          <div className="mt-4 pt-3 border-t border-zinc-800/70 space-y-1.5">
            {weightEntries.slice(0, 3).map((entry: any) => (
              <div key={entry.id} className="flex justify-between text-xs text-zinc-500">
                <span>{entry.date}</span>
                <span className="text-zinc-300 font-bold">{entry.weight} kg</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function MetricCard({ label, value, unit, subtext }: any) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex flex-col justify-between">
      <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2">{label}</div>
      <div className="flex items-baseline gap-1">
        <div className="text-2xl font-black text-white tracking-tight">{value}</div>
        <div className="text-[10px] font-bold text-zinc-500 uppercase">{unit}</div>
      </div>
      {subtext && <div className="text-[10px] text-zinc-500 mt-1.5 border-t border-zinc-800/30 pt-1">{subtext}</div>}
    </div>
  );
}

function MacroProgressLabel({ label, current, target, color, unit }: any) {
  const pct = Math.min((current / target) * 100, 100);
  return (
    <div className="space-y-1">
      <div className="text-[9px] font-bold text-zinc-400 uppercase tracking-wide flex justify-between">
        <span>{label}</span>
        <span className="text-white font-extrabold">{current}{unit}</span>
      </div>
      <div className="h-1 bg-zinc-950 rounded-full overflow-hidden">
        <div className={`h-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

// Updated Calories Input Grid Configuration Dashboard Layer
// Updated Calories View with Organized Historical Feed
function CaloriesView({
  quickFoods, selectedQuickFood, setSelectedQuickFood, handleQuickAdd,
  customFood, setCustomFood, customKcal, setCustomKcal,
  customProtein, setCustomProtein, customCarbs, setCustomCarbs, customFats, setCustomFats,
  handleCustomAdd, todayEntries, computedTotal, handleDeleteEntry, handleClearToday,
  allEntries // Add this new prop
}: any) {
  
  const todayStr = new Date().toDateString();
  
  // Filter out today's entries to build the historical timeline archive
  const historicalEntries = allEntries.filter(
    (e: any) => new Date(e.timestamp).toDateString() !== todayStr
  );
  
  const groupedHistory = groupEntriesByDate(historicalEntries);

  return (
    <div className="space-y-5">
      {/* Quick Add Module */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
        <h3 className="text-white text-xs uppercase tracking-wider font-bold mb-3">Quick Add Local Staples</h3>
        <div className="flex gap-2">
          <select
            value={selectedQuickFood} onChange={(e) => setSelectedQuickFood(e.target.value)}
            className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2.5 text-xs text-zinc-300 focus:outline-none"
          >
            <option value="">Select staple option...</option>
            {quickFoods.map((f: any) => (
              <option key={f.name} value={f.name}>{f.name} ({f.kcal} kcal)</option>
            ))}
          </select>
          <button onClick={handleQuickAdd} disabled={!selectedQuickFood} className="p-2.5 bg-zinc-200 text-black rounded-lg disabled:opacity-20">
            <Plus className="w-4 h-4 stroke-[3]" />
          </button>
        </div>
      </div>

      {/* Custom Blueprint Logger */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
        <h3 className="text-white text-xs uppercase tracking-wider font-bold mb-3.5">Custom Entry Blueprint</h3>
        <div className="space-y-2.5">
          <input
            type="text" placeholder="Food name" value={customFood} onChange={(e) => setCustomFood(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none"
          />
          <div className="grid grid-cols-4 gap-2">
            <input type="number" placeholder="Kcal" value={customKcal} onChange={(e) => setCustomKcal(e.target.value)} className="bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-center text-xs text-white" />
            <input type="number" placeholder="Prot (g)" value={customProtein} onChange={(e) => setCustomProtein(e.target.value)} className="bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-center text-xs text-white" />
            <input type="number" placeholder="Carb (g)" value={customCarbs} onChange={(e) => setCustomCarbs(e.target.value)} className="bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-center text-xs text-white" />
            <input type="number" placeholder="Fat (g)" value={customFats} onChange={(e) => setCustomFats(e.target.value)} className="bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-center text-xs text-white" />
          </div>
          <button onClick={handleCustomAdd} disabled={!customFood || !customKcal} className="w-full py-2 bg-zinc-200 text-black font-bold text-xs uppercase tracking-wider rounded-lg disabled:opacity-20">Log Entry</button>
        </div>
      </div>

      {/* Active Live Day Module */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
        <div className="flex justify-between border-b border-zinc-800 pb-3 mb-2">
          <h3 className="text-white text-xs uppercase tracking-wider font-bold">Today's Intake Feed</h3>
          <span className="text-sm font-black text-white">{computedTotal} <span className="text-[10px] text-zinc-500 font-medium">kcal</span></span>
        </div>
        {todayEntries.length === 0 ? (
          <p className="text-zinc-600 text-xs text-center py-6">No caloric macronutrients logged today</p>
        ) : (
          <div className="space-y-1 max-h-[220px] overflow-y-auto divide-y divide-zinc-800/40">
            {todayEntries.map((entry: any) => (
              <div key={entry.id} className="flex justify-between items-center py-2.5">
                <div>
                  <div className="text-zinc-200 text-xs font-semibold">{entry.name}</div>
                  <div className="text-[9px] text-zinc-500 font-bold mt-0.5 uppercase tracking-wide">
                    P: {entry.protein || 0}g • C: {entry.carbs || 0}g • F: {entry.fats || 0}g
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-white text-xs font-black">{entry.kcal} <span className="text-[9px] text-zinc-500 font-bold">KCAL</span></span>
                  <button onClick={() => handleDeleteEntry(entry.id)} className="p-1 text-zinc-500 hover:text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            ))}
            <button onClick={handleClearToday} className="w-full mt-2 pt-3 text-[10px] text-center font-bold text-zinc-500 uppercase tracking-widest">Clear Today's Entries</button>
          </div>
        )}
      </div>

      {/* NEW: Historical Calorie Logs Archive Panel */}
      {Object.keys(groupedHistory).length > 0 && (
        <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-xl p-5 space-y-4">
          <h3 className="text-zinc-400 text-[10px] uppercase tracking-widest font-black border-b border-zinc-800/60 pb-2">Vaulted History Log</h3>
          <div className="space-y-4 max-h-[300px] overflow-y-auto scrollbar-none pr-1">
            {Object.entries(groupedHistory).map(([date, entries]: any) => {
              // Calculate daily total metrics for this historical day block
              const dayTotalKcal = entries.reduce((sum: number, e: any) => sum + e.kcal, 0);
              const dayTotalProtein = entries.reduce((sum: number, e: any) => sum + (e.protein || 0), 0);

              return (
                <div key={date} className="bg-zinc-950 border border-zinc-900 rounded-lg p-3 space-y-2">
                  <div className="flex justify-between items-baseline border-b border-zinc-900 pb-1.5">
                    <span className="text-[10px] font-bold text-zinc-400">{date}</span>
                    <span className="text-xs font-black text-zinc-300">
                      {dayTotalKcal} kcal <span className="text-[9px] text-zinc-500 font-bold ml-1">({dayTotalProtein}g P)</span>
                    </span>
                  </div>
                  <div className="space-y-1.5 divide-y divide-zinc-900/50">
                    {entries.map((entry: any) => (
                      <div key={entry.id} className="flex justify-between items-center text-[11px] pt-1.5 first:pt-0">
                        <span className="text-zinc-500 truncate max-w-[180px]">{entry.name}</span>
                        <div className="flex items-center gap-3 shrink-0">
                          <span className="text-[9px] text-zinc-600 font-mono">P:{entry.protein || 0}g C:{entry.carbs || 0}g</span>
                          <span className="text-zinc-300 font-bold">{entry.kcal} kcal</span>
                          <button onClick={() => handleDeleteEntry(entry.id)} className="text-zinc-700 hover:text-red-400 p-0.5 transition-colors">
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function MealsView({ mealPlans, mealLogStatus, handleLogMeal }: any) {
  return (
    <div className="space-y-4">
      <div className="bg-zinc-900 border border-zinc-700/70 rounded-xl p-4">
        <h3 className="text-white text-xs uppercase tracking-wider font-bold mb-0.5">Budget Strategy Matrix</h3>
        <p className="text-xs text-zinc-400">Blueprint Range: <span className="text-white font-black">₦1,500 - ₦2,500</span> daily target</p>
      </div>
      <MealSection title="Breakfast Matrix" meals={mealPlans.breakfast} mealLogStatus={mealLogStatus} handleLogMeal={handleLogMeal} />
      <MealSection title="Mid-Morning Fast Pack" meals={mealPlans.snack} mealLogStatus={mealLogStatus} handleLogMeal={handleLogMeal} />
      <MealSection title="Heavy Lunch Stack" meals={mealPlans.lunch} mealLogStatus={mealLogStatus} handleLogMeal={handleLogMeal} />
    </div>
  );
}

function MealSection({ title, meals, mealLogStatus, handleLogMeal }: any) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
      <h3 className="text-zinc-500 text-[9px] uppercase tracking-widest font-black mb-3 border-b border-zinc-800/60 pb-1">{title}</h3>
      <div className="space-y-3">
        {meals.map((m: any) => {
          const isLogged = mealLogStatus[m.id];
          return (
            <div key={m.id} className="flex justify-between items-center text-xs">
              <div>
                <div className="text-white font-semibold">{m.name}</div>
                <div className="text-[9px] text-zinc-500 font-bold mt-0.5 uppercase tracking-wider">
                  {m.kcal} kcal • P: {m.p}g C: {m.c}g
                </div>
              </div>
              <button
                onClick={() => handleLogMeal(m)} disabled={isLogged}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase ${isLogged ? 'bg-zinc-950 text-zinc-600' : 'bg-zinc-800 text-zinc-200'}`}
              >
                {isLogged ? <span className="flex items-center gap-1"><Check className="w-3 h-3" /> Added</span> : '+ Log'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function WorkoutView({ activeWorkoutDay, setActiveWorkoutDay, workoutRoutines, handleMarkWorkoutComplete }: any) {
  const schedule = [
    { d: 'Mon', t: 'Push' }, { d: 'Tue', t: 'Pull' }, { d: 'Wed', t: 'Legs' },
    { d: 'Thu', t: 'Rest' }, { d: 'Fri', t: 'Push' }, { d: 'Sat', t: 'Pull' }, { d: 'Sun', t: 'Rest' }
  ];
  return (
    <div className="space-y-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
        <h3 className="text-white text-xs uppercase tracking-wider font-bold mb-2.5">Weekly Schedule</h3>
        <div className="grid grid-cols-7 gap-1">
          {schedule.map((s, i) => (
            <div key={i} className="text-center">
              <div className="text-[9px] font-bold text-zinc-500 mb-1">{s.d}</div>
              <div className={`text-[9px] font-bold py-1.5 rounded uppercase ${s.t === 'Rest' ? 'bg-zinc-950 text-zinc-700' : 'bg-zinc-800 text-zinc-300'}`}>{s.t}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
        <div className="flex gap-1.5 overflow-x-auto">
          {['push', 'pull', 'legs', 'fullA', 'fullB'].map((type) => (
            <button
              key={type} onClick={() => setActiveWorkoutDay(type)}
              className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase shrink-0 ${activeWorkoutDay === type ? 'bg-white text-black' : 'bg-zinc-950 text-zinc-400 border border-zinc-800'}`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        {workoutRoutines[activeWorkoutDay].map((ex: any, idx: number) => (
          <div key={idx} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <div className="flex justify-between items-start">
              <h4 className="text-white text-xs font-bold">{ex.exercise}</h4>
              <span className="text-zinc-300 text-[10px] font-black bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800">{ex.sets}</span>
            </div>
            <p className="text-zinc-500 text-[10px] mt-1.5 pt-1.5 border-t border-zinc-800/40">{ex.notes}</p>
          </div>
        ))}
      </div>

      <button onClick={() => { handleMarkWorkoutComplete(); alert('Workout executed successfully.'); }} className="w-full py-3.5 bg-zinc-200 text-black font-black text-xs uppercase tracking-widest rounded-xl">
        Mark Active Workout As Executed
      </button>
    </div>
  );
}

function TipsView() {
  const data = [
    { title: 'High-Yield Naira-to-Calorie Foods', items: ['Garri: ₦300/kg yields ~3,600 kcal', 'Roasted Groundnuts: ₦500/kg yields ~5,670 kcal', 'Palm Oil: ₦600/bottle yields ~8,000 kcal'] },
    { title: 'Recovery Laws', items: ['Sleep 7-8 hours minimum for full muscle tissue rebuilding', 'Eat within a 2-hour window post-workout for optimal absorption', 'Hydrate with 3-4 liters of water daily to support metabolic conversion cycles'] }
  ];
  return (
    <div className="space-y-4">
      {data.map((sec, idx) => (
        <div key={idx} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <h3 className="text-white text-xs uppercase tracking-wider font-bold mb-3 border-b border-zinc-800 pb-2">{sec.title}</h3>
          <ul className="space-y-2">
            {sec.items.map((item, i) => (
              <li key={i} className="text-xs text-zinc-400 flex gap-2"><div className="w-1 h-1 rounded-full bg-zinc-600 mt-2 shrink-0" />{item}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}