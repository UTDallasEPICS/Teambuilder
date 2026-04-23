#!/usr/bin/env python3
"""
Team Generation using Google OR-Tools CP-SAT Solver
Generates optimal team assignments with constraint satisfaction
"""

import json
import sys
from ortools.sat.python import cp_model


def generate_teams(students_data, projects_data, config=None):
    """
    Generate team assignments using CP-SAT solver
    
    Args:
        students_data: List of student dictionaries
        projects_data: List of project dictionaries
        config: Configuration dictionary (optional)
    
    Returns:
        Dictionary mapping project names to lists of student IDs
    """
    
    # Default configuration
    if config is None:
        config = {
            'min_team_size': 4,
            'max_team_size': 6,
            'allow_overflow_if_needed': True,
            'overflow_per_team': 1,
            'overflow_penalty': 20000,
            'prioritize_returning_students': True,
            'prioritize_3200_first_choice': True,
            'prefer_major_diversity': True,
            'match_skills': True,
            'balance_gender': True,
            'prefer_2200_early_choices': True,  # Prefer choices 1-2 for 2200
        }
    
    model = cp_model.CpModel()
    
    # Create indices
    students = {s['id']: s for s in students_data}
    projects = {p['name']: p for p in projects_data}
    student_ids = list(students.keys())
    project_names = list(projects.keys())

    max_team_size = int(config.get('max_team_size', 6))
    max_overflow_per_team = max(0, int(config.get('overflow_per_team', 1)))
    allow_overflow_if_needed = bool(config.get('allow_overflow_if_needed', True))

    base_capacity = len(project_names) * max_team_size
    required_overflow = max(0, len(student_ids) - base_capacity)
    overflow_enabled = allow_overflow_if_needed and required_overflow > 0 and max_overflow_per_team > 0
    
    # Decision variables: x[s][p] = 1 if student s is assigned to project p
    x = {}
    for s_id in student_ids:
        x[s_id] = {}
        for p_name in project_names:
            x[s_id][p_name] = model.NewBoolVar(f'x_{s_id}_{p_name}')
    
    # CONSTRAINT 1: Each student assigned to exactly one project
    for s_id in student_ids:
        model.Add(sum(x[s_id][p_name] for p_name in project_names) == 1)
    
    # CONSTRAINT 2: Team size constraints with optional project deactivation
    # Projects can be "active" (team size 4-6) or "inactive" (team size 0)
    # This prevents forcing unwilling students onto unpopular projects
    project_active = {}
    project_overflow = {}
    for p_name in project_names:
        project_active[p_name] = model.NewBoolVar(f'active_{p_name}')
        if overflow_enabled:
            project_overflow[p_name] = model.NewIntVar(0, max_overflow_per_team, f'overflow_{p_name}')
        else:
            project_overflow[p_name] = model.NewIntVar(0, 0, f'overflow_{p_name}')

        team_size = sum(x[s_id][p_name] for s_id in student_ids)
        
        # If active: enforce min and max team size
        model.Add(team_size >= config['min_team_size']).OnlyEnforceIf(project_active[p_name])
        model.Add(team_size <= config['max_team_size'] + project_overflow[p_name]).OnlyEnforceIf(project_active[p_name])
        model.Add(project_overflow[p_name] <= max_overflow_per_team).OnlyEnforceIf(project_active[p_name])
        
        # If inactive: no students assigned
        model.Add(team_size == 0).OnlyEnforceIf(project_active[p_name].Not())
        model.Add(project_overflow[p_name] == 0).OnlyEnforceIf(project_active[p_name].Not())

    if overflow_enabled:
        total_overflow = sum(project_overflow[p_name] for p_name in project_names)
        # Cap overflow so we only use extra seats that are mathematically required.
        model.Add(total_overflow <= required_overflow)
    
    # CONSTRAINT 3: 3200 students PREFER their first choice, but allow flexibility
    # This is a SOFT constraint through objective scoring, not a hard constraint
    # Hard constraints only ensure students get SOME choice if possible
    if config.get('prioritize_3200_first_choice', True):
        for s_id in student_ids:
            student = students[s_id]
            if student['class'] == '3200' and len(student['choices']) > 0:
                # Allow all choices for 3200 students - preference handled in objective
                pass
    
    # CONSTRAINT 4: Prefer assigning students to their top choices
    # This is handled via objective scoring rather than hard constraints
    # Allow fallback to ANY project if needed for feasibility
    for s_id in student_ids:
        student = students[s_id]
        # SOFT: Prefer top 6, but allow flexibility if needed
        # Don't block - just score lower in objective
        pass
    
    # CONSTRAINT 5: Only 3200 students can be returning students
    # (Validation - returning students must be 3200)
    for s_id in student_ids:
        student = students[s_id]
        if student.get('previousProject') is not None and student['class'] != '3200':
            raise ValueError(f"Student {s_id} has previousProject but is not 3200 level")
    
    # CONSTRAINT 6: Day matching - students can only be assigned to projects on their day
    # If a student has a day and a project has a day, they must match
    for s_id in student_ids:
        student = students[s_id]
        student_day = student.get('day')
        if student_day:
            for p_name in project_names:
                project = projects[p_name]
                project_day = project.get('day')
                if project_day and project_day != student_day:
                    model.Add(x[s_id][p_name] == 0)
    
    # OBJECTIVE: Maximize satisfaction score
    objective_terms = []
    
    for s_id in student_ids:
        student = students[s_id]
        is_3200 = student['class'] == '3200'
        is_returning = student.get('previousProject') is not None
        
        for p_name in project_names:
            # Base score from preference ranking
            if p_name in student['choices']:
                pref_index = student['choices'].index(p_name)
                
                # Score decreases with preference rank
                if pref_index == 0:  # First choice
                    base_score = 1000
                elif pref_index == 1:  # Second choice
                    base_score = 500
                elif pref_index == 2:  # Third choice
                    base_score = 200
                elif pref_index == 3:  # Fourth choice
                    base_score = 100
                elif pref_index == 4:  # Fifth choice
                    base_score = 50
                elif pref_index == 5:  # Sixth choice
                    base_score = 25
                else:
                    base_score = 0
                
                # Multipliers for 3200 students (heavily prioritize first choice)
                if is_3200:
                    if config.get('prioritize_3200_first_choice', True):
                        base_score *= 100  # 100x multiplier for 3200 students
                else:
                    # For 2200 students: strongly boost early choices, use MASSIVE penalties for late
                    if config.get('prefer_2200_early_choices', True):
                        if pref_index == 0:  # First choice
                            base_score = 5000  # Very strong boost for first
                        elif pref_index == 1:  # Second choice
                            base_score = 3000  # Strong boost for second
                        elif pref_index == 2:  # Third choice
                            base_score = 1500  # Good score for third
                        elif pref_index == 3:  # Fourth choice
                            base_score = -20000  # Massive penalty: avoid at all costs
                        elif pref_index == 4:  # Fifth choice
                            base_score = -100000  # Extreme penalty: almost never
                        elif pref_index == 5:  # Sixth choice
                            base_score = -500000  # Nuclear penalty: absolute last resort
                
                # Returning student bonus: 3200 students CAN choose any project, but if they
                # include their previous project in their choices, give huge priority bonus
                # This ensures returning to same project is strongly preferred (but optional)
                if config.get('prioritize_returning_students', True) and is_returning and student['previousProject'] == p_name:
                    base_score += 500000  # Massive priority for returning to same project
                
                # Skills matching bonus
                if config.get('match_skills', True):
                    project = projects[p_name]
                    required_skills = project.get('requiredSkills', [])
                    student_skills = student.get('skills', [])
                    if required_skills and student_skills:
                        # Count matching skills
                        matching_skills = len(set(required_skills) & set(student_skills))
                        if matching_skills > 0:
                            base_score += matching_skills * 50  # Bonus per matching skill
                
                objective_terms.append(base_score * x[s_id][p_name])
    
    # SOFT CONSTRAINT: Gender balance (add penalty for imbalanced teams)
    if config.get('balance_gender', True):
        for p_name in project_names:
            # Count students of each gender on this team
            gender_vars = {'Male': [], 'Female': [], 'Non-binary': [], 'Prefer not to say': []}
            
            for s_id in student_ids:
                student = students[s_id]
                gender = student.get('gender', 'Prefer not to say')
                if gender in gender_vars:
                    gender_vars[gender].append(x[s_id][p_name])
            
            # Create variables for gender counts
            male_count = model.NewIntVar(0, config['max_team_size'], f'male_count_{p_name}')
            female_count = model.NewIntVar(0, config['max_team_size'], f'female_count_{p_name}')
            
            if gender_vars['Male']:
                model.Add(male_count == sum(gender_vars['Male']))
            else:
                model.Add(male_count == 0)
            
            if gender_vars['Female']:
                model.Add(female_count == sum(gender_vars['Female']))
            else:
                model.Add(female_count == 0)
            
            # Add penalty for isolation (1 person of one gender)
            # We want to avoid: male_count == 1 OR female_count == 1 (when team size > 1)
            team_size_var = model.NewIntVar(config['min_team_size'], config['max_team_size'], f'team_size_{p_name}')
            model.Add(team_size_var == sum(x[s_id][p_name] for s_id in student_ids))
            
            # Penalty variable for male isolation
            male_isolated = model.NewBoolVar(f'male_isolated_{p_name}')
            model.Add(male_count == 1).OnlyEnforceIf(male_isolated)
            model.Add(male_count != 1).OnlyEnforceIf(male_isolated.Not())
            
            # Penalty variable for female isolation
            female_isolated = model.NewBoolVar(f'female_isolated_{p_name}')
            model.Add(female_count == 1).OnlyEnforceIf(female_isolated)
            model.Add(female_count != 1).OnlyEnforceIf(female_isolated.Not())
            
            # Apply penalty (negative score) for isolation
            # Only penalize if team has more than 2 people
            objective_terms.append(-500 * male_isolated)  # Penalty for 1 male among others
            objective_terms.append(-500 * female_isolated)  # Penalty for 1 female among others
    
    # SOFT CONSTRAINT: Major diversity (bonus for having diverse majors)
    if config.get('prefer_major_diversity', True):
        software_majors = {'CS', 'SE', 'DS'}
        hardware_majors = {'EE', 'ME', 'BME', 'CE'}
        
        for p_name in project_names:
            project = projects[p_name]
            preferred_majors = set(project.get('preferredMajors', []))
            project_type = project.get('type', '')
            
            for s_id in student_ids:
                student = students[s_id]
                student_major = student['major']
                bonus = 0
                
                # Direct major match with project's preferred majors
                if preferred_majors and student_major in preferred_majors:
                    bonus = 100
                # "Both" projects accept all majors - give bonus to everyone
                elif project_type == 'Both':
                    bonus = 80
                # SW projects: small bonus for software-adjacent majors not explicitly listed
                elif project_type == 'SW' and student_major in software_majors:
                    bonus = 60
                # HW projects: small bonus for hardware-adjacent majors not explicitly listed
                elif project_type == 'HW' and student_major in hardware_majors:
                    bonus = 60
                
                if bonus > 0:
                    objective_terms.append(bonus * x[s_id][p_name])
    
    # SOFT CONSTRAINT: Prefer activating all projects (penalty for deactivation)
    # The penalty is moderate so the solver will deactivate a project only if it
    # saves multiple students from 4th+ choice assignments
    for p_name in project_names:
        objective_terms.append(5000 * project_active[p_name])  # Reward for being active

    if overflow_enabled:
        overflow_penalty = int(config.get('overflow_penalty', 20000))
        for p_name in project_names:
            objective_terms.append(-overflow_penalty * project_overflow[p_name])
    
    # Maximize total satisfaction
    model.Maximize(sum(objective_terms))
    
    # Solve
    solver = cp_model.CpSolver()
    
    # Set time limit (30 seconds)
    solver.parameters.max_time_in_seconds = 30.0
    
    status = solver.Solve(model)
    
    if status == cp_model.OPTIMAL or status == cp_model.FEASIBLE:
        # Extract solution
        teams = {p_name: [] for p_name in project_names}
        deactivated = []
        
        for s_id in student_ids:
            for p_name in project_names:
                if solver.Value(x[s_id][p_name]) == 1:
                    teams[p_name].append(s_id)
                    break
        
        # Track deactivated projects
        for p_name in project_names:
            if solver.Value(project_active[p_name]) == 0:
                deactivated.append(p_name)

        total_overflow_used = sum(solver.Value(project_overflow[p_name]) for p_name in project_names)
        
        # Remove empty (deactivated) projects from teams
        teams = {p: members for p, members in teams.items() if members}
        
        return {
            'success': True,
            'teams': teams,
            'score': solver.ObjectiveValue(),
            'solve_time': solver.WallTime(),
            'status': 'optimal' if status == cp_model.OPTIMAL else 'feasible',
            'deactivated_projects': deactivated,
            'warning': (
                f'Used {total_overflow_used} overflow seat(s) to satisfy capacity constraints'
                if total_overflow_used > 0
                else None
            )
        }
    else:
        # First attempt failed - try greedy fallback
        return greedy_team_assignment(students_data, projects_data, config)


def greedy_team_assignment(students_data, projects_data, config=None):
    """
    Fallback greedy assignment when constraint solver fails.
    Uses simple heuristics to assign students to projects.
    
    Args:
        students_data: List of student dictionaries
        projects_data: List of project dictionaries
        config: Configuration dictionary (optional)
    
    Returns:
        Dictionary mapping project names to lists of student IDs
    """
    if config is None:
        config = {
            'min_team_size': 4,
            'max_team_size': 6,
        }
    
    students = {s['id']: s for s in students_data}
    projects = {p['name']: p for p in projects_data}
    project_names = list(projects.keys())
    
    # Initialize teams
    teams = {p_name: [] for p_name in project_names}
    assigned = set()
    
    # Sort students: prioritize 3200 returning students, then by choice count
    sorted_students = sorted(
        students.items(),
        key=lambda item: (
            -(item[1]['class'] == '3200'),  # Prioritize 3200
            -len(item[1].get('choices', [])),  # Then by number of choices
        )
    )
    
    # Phase 1: Assign students to their first choices
    for s_id, student in sorted_students:
        if s_id in assigned:
            continue
        
        choices = student.get('choices', [])
        assigned_project = None
        
        # Try to assign to first choice
        if choices:
            for p_name in choices[:3]:  # Try first 3 choices
                if len(teams[p_name]) < config['max_team_size']:
                    # Check day constraint
                    student_day = student.get('day')
                    project_day = projects[p_name].get('day')
                    if not (student_day and project_day and student_day != project_day):
                        teams[p_name].append(s_id)
                        assigned.add(s_id)
                        assigned_project = p_name
                        break
        
        # Phase 2: If no preferred project available, assign to any available project
        if assigned_project is None:
            for p_name in project_names:
                if len(teams[p_name]) < config['max_team_size']:
                    # Check day constraint
                    student_day = student.get('day')
                    project_day = projects[p_name].get('day')
                    if not (student_day and project_day and student_day != project_day):
                        teams[p_name].append(s_id)
                        assigned.add(s_id)
                        break
    
    # Phase 3: Assign any remaining unassigned students (force if necessary)
    unassigned = [s_id for s_id in students.keys() if s_id not in assigned]
    if unassigned:
        # Try to balance teams by assigning to least-filled projects first
        for s_id in unassigned:
            sorted_projects = sorted(project_names, key=lambda p: len(teams[p]))
            for p_name in sorted_projects:
                if len(teams[p_name]) < config['max_team_size']:
                    teams[p_name].append(s_id)
                    assigned.add(s_id)
                    break
            else:
                # Force assign to largest team if all are full
                largest_project = max(project_names, key=lambda p: len(teams[p]))
                teams[largest_project].append(s_id)
                assigned.add(s_id)
    
    # Deactivate projects that don't meet minimum size
    deactivated = []
    teams_final = {}
    for p_name, members in teams.items():
        if len(members) >= config['min_team_size']:
            teams_final[p_name] = members
        else:
            deactivated.append(p_name)
    
    return {
        'success': True,
        'teams': teams_final,
        'score': 0,
        'solve_time': 0,
        'status': 'greedy_fallback',
        'deactivated_projects': deactivated,
        'warning': f'Used greedy fallback: {len(deactivated)} projects deactivated'
    }



def main():
    """Main entry point when called from command line"""
    try:
        # Read JSON input from stdin
        input_data = json.loads(sys.stdin.read())
        
        students = input_data['students']
        projects = input_data['projects']
        config = input_data.get('config', None)
        
        # Generate teams
        result = generate_teams(students, projects, config)
        
        # Output result as JSON
        print(json.dumps(result))
        
    except Exception as e:
        print(json.dumps({
            'success': False,
            'error': str(e)
        }))
        sys.exit(1)


if __name__ == '__main__':
    main()
