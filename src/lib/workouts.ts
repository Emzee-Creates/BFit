// src/lib/workouts.ts

export interface Exercise {
  name: string;
  detail: string;
}

export type WorkoutDays = 'push' | 'pull' | 'legs' | 'fullA' | 'fullB';

export const workoutsData: Record<WorkoutDays, Exercise[]> = {
  push: [
    { name: 'Push-ups (feet elevated on chair)', detail: '3 sets × 8–12 reps | works chest, front shoulders, triceps' },
    { name: 'Dumbbell shoulder press (seated)', detail: '3 sets × 10 reps each arm | 10kg dumbbell' },
    { name: 'Dumbbell chest flyes (lying on floor)', detail: '3 sets × 12 reps | use 10kg, slow and controlled' },
    { name: 'Tricep overhead extension', detail: '3 sets × 12 reps | both hands on 1 dumbbell' },
    { name: 'Diamond push-ups', detail: '2 sets × max reps | bodyweight, hands close together' },
  ],
  pull: [
    { name: 'Dumbbell bent-over row (each arm)', detail: '4 sets × 10 reps each arm | 10kg, back parallel to floor' },
    { name: 'Dumbbell bicep curl', detail: '3 sets × 12 reps each arm | slow, full range' },
    { name: 'Dumbbell hammer curl', detail: '3 sets × 12 reps | targets brachialis' },
    { name: 'Superman hold (bodyweight)', detail: '3 sets × 15 reps | lie face down, raise arms & legs — hits lower back' },
    { name: 'Inverted row (under a table)', detail: '3 sets × max reps | lie under sturdy table, pull chest up' },
  ],
  legs: [
    { name: 'Goblet squat', detail: '4 sets × 15 reps | hold 10kg at chest, squat deep' },
    { name: 'Romanian deadlift (single leg)', detail: '3 sets × 10 each leg | 10kg, hinge at hip' },
    { name: 'Dumbbell lunge', detail: '3 sets × 12 each leg | 10kg in one hand for balance' },
    { name: 'Calf raises (on step)', detail: '4 sets × 20 reps | bodyweight, use a kerb or step' },
    { name: 'Plank', detail: '3 sets × 30–60 sec | squeeze everything, breathe slowly' },
  ],
  fullA: [
    { name: 'Dumbbell deadlift (both hands)', detail: '4 sets × 10 reps | 10kg, hinge from hips — biggest compound move' },
    { name: 'Dumbbell shoulder press', detail: '3 sets × 10 each arm | seated on floor or chair' },
    { name: 'Push-ups', detail: '3 sets × max reps | standard or incline' },
    { name: 'Dumbbell squat (goblet)', detail: '3 sets × 15 reps | 10kg at chest' },
    { name: 'Bent-over row', detail: '3 sets × 10 each arm' },
  ],
  fullB: [
    { name: 'Sumo squat + hold', detail: '4 sets × 12 reps | 10kg, wide stance, pause 1 sec at bottom' },
    { name: 'Push-up to renegade row', detail: '3 sets × 8 reps | push-up then row each arm with dumbbell' },
    { name: 'Dumbbell stiff-leg deadlift', detail: '3 sets × 12 reps | 10kg, feel the hamstring stretch' },
    { name: 'Dumbbell lateral raise', detail: '3 sets × 15 reps | 10kg, build those shoulders' },
    { name: 'Bicycle crunches', detail: '3 sets × 20 reps | bodyweight core' },
  ]
};