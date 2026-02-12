# Team Builder - Google OR-Tools CP-SAT Implementation

This implementation uses Google's OR-Tools CP-SAT solver (via Python) for optimal team generation with constraint satisfaction.

## Setup Instructions

### 1. Install Python 3
Make sure you have Python 3.8 or later installed:
```bash
python --version
```

### 2. Install Google OR-Tools
```bash
pip install ortools
```

### 3. Test the Implementation
```bash
cd "algorithms/CPSAT"
npx tsx test.ts
```

## How It Works

1. **TypeScript Layer** (`ortools.ts`):
   - Prepares student/project data as JSON
   - Calls Python script via `child_process`
   - Converts results back to TypeScript objects

2. **Python Layer** (`team_generator.py`):
   - Uses Google OR-Tools CP-SAT solver
   - Defines constraints and objective function
   - Returns optimal solution as JSON

## Constraints

### Hard Constraints
- ✅ Each student assigned to exactly one project
- ✅ Team sizes between min (3) and max (6)
- ✅ **3200 students can ONLY be assigned to their top 3 choices**
- ✅ All students can only be assigned to their top 6 choices

### Soft Constraints (Objective Function)
- First choice: 1000 points (5000 for 3200 students)
- Second choice: 500 points (2500 for 3200 students)
- Third choice: 200 points (1000 for 3200 students)
- Returning students: +5000 bonus points

## Architecture Benefits

✅ **Guaranteed Optimality**: OR-Tools CP-SAT finds provably optimal solutions
✅ **Fast**: Solves 150 students × 29 projects in seconds
✅ **Easy Integration**: Simple subprocess call from Node.js/TypeScript
✅ **No External Services**: Runs locally, no separate server needed
✅ **Industry Standard**: Google's production-grade solver

## Files

- `team_generator.py` - Python script using OR-Tools CP-SAT
- `ortools.ts` - TypeScript wrapper for calling Python
- `test.ts` - Test harness with 150 students and 29 projects
- `index.ts` - Old custom implementation (kept for reference)

## Troubleshooting

**Error: Python not found**
- Install Python 3.8+ and ensure it's in your PATH

**Error: No module named 'ortools'**
- Run: `pip install ortools`

**Error: Infeasible solution**
- Check that students have at least 3 choices
- Verify team size constraints allow all students to fit
