# This file contains my attempt at a CP-SAT algorithm with my take on
# the contraints and other components

#!/usr/bin/env python3

import json
import sys
from ortools.sat.python import cp_model


def generate_team_assignments(students_data, projects_data, config=None):
    """
    Generate optimal team assignments using CP-SAT constraint satisfaction solver
    
    Args:
        students_data: List of student dictionaries
        projects_data: List of project dictionaries
        config: Configuration dictionary with weights and constraints
    
    Returns:
        Dictionary with team assignments, statistics, and solver status
    """
    
    # Default configuration, student focused
    if config is None:
        config = {
            'teamSizeMin': 4,
            'teamSizeIdeal': 6,
            'teamSizeSoftMax': 7,
            'teamSizeHardMax': 10,
            'optimizationMode': 'student-first',
            'weights': {
                'upper3200FirstChoice': 100000,
                'upper3200SecondChoice': 50000,
                'upper3200ThirdChoice': 20000,
                'lower2200FirstChoice': 5000,
                'lower2200SecondChoice': 3000,
                'lower2200ThirdChoice': 1500,
                'lower2200FourthToSixth': -50000,
                'returningStudentBonus': 500000,
                'skillMatchBonus': 50,
                'majorMatchBonus': 100,
                'genderIsolationPenalty': -3000,
                'teamSizeLightPenalty': -500,
                'teamSizeHeavyPenalty': -5000,
                'projectActivationBonus': 5000,
            }
        }
    
    # Initialization
    model = cp_model.CpModel()
    
    # Create lookup dictionaries
    students = {s['id']: s for s in students_data}
    projects = {p['name']: p for p in projects_data}
    student_ids = list(students.keys())
    project_names = list(projects.keys())
    
    print(f"Initializing solver with {len(student_ids)} students and {len(project_names)} projects")
    
    # Decision variables
    
    # assignment[student_id][project_name] = 1 if student assigned to project
    assignment = {}
    for student_id in student_ids:
        assignment[student_id] = {}
        for project_name in project_names:
            assignment[student_id][project_name] = model.NewBoolVar(
                f'assign_{student_id}_{project_name}'
            )
    
    # projectIsActive[project_name] = 1 if project has students, 0 if deactivated
    project_is_active = {}
    for project_name in project_names:
        project_is_active[project_name] = model.NewBoolVar(f'active_{project_name}')
    
    # Hard COnstraints 
    
    print("Adding hard constraints...")
    
    # CONSTRAINT 1: Each student assigned to exactly ONE project
    for student_id in student_ids:
        model.Add(
            sum(assignment[student_id][project_name] for project_name in project_names) == 1
        )
    
    # CONSTRAINT 2: Team sizes must be valid (4-10 if active, 0 if deactivated)
    for project_name in project_names:
        team_size = sum(assignment[student_id][project_name] for student_id in student_ids)
        
        # If project is active: enforce min and max team size
        model.Add(team_size >= config['teamSizeMin']).OnlyEnforceIf(project_is_active[project_name])
        model.Add(team_size <= config['teamSizeHardMax']).OnlyEnforceIf(project_is_active[project_name])
        
        # If project is deactivated: no students assigned
        model.Add(team_size == 0).OnlyEnforceIf(project_is_active[project_name].Not())
    
    # CONSTRAINT 3: 3200 students can ONLY be assigned to their top 3 choices
    for student_id in student_ids:
        student = students[student_id]
        if student['classLevel'] == '3200':
            top_3_choices = student['preferences'][:3] if len(student['preferences']) >= 3 else student['preferences']
            
            # Block all projects not in top 3
            for project_name in project_names:
                if project_name not in top_3_choices:
                    model.Add(assignment[student_id][project_name] == 0)
    
    # CONSTRAINT 4: All students can ONLY be assigned to their top 6 choices
    for student_id in student_ids:
        student = students[student_id]
        top_6_choices = student['preferences'][:6]
        
        # Block all projects not in top 6
        for project_name in project_names:
            if project_name not in top_6_choices:
                model.Add(assignment[student_id][project_name] == 0)
    
    # CONSTRAINT 5: Day matching - students only assigned to projects on their day
    for student_id in student_ids:
        student = students[student_id]
        student_day = student.get('availableDay')
        
        if student_day:
            for project_name in project_names:
                project = projects[project_name]
                project_day = project.get('meetingDay')
                
                # If both have days and they don't match, block assignment
                if project_day and project_day != student_day:
                    model.Add(assignment[student_id][project_name] == 0)
    
    # CONSTRAINT 6: Major requirements - projects must get minimum count of each required major
    for project_name in project_names:
        project = projects[project_name]
        major_requirements = project.get('majorRequirements', {})
        
        if major_requirements:
            for required_major, required_count in major_requirements.items():
                # Count students of this major assigned to this project
                students_with_major = [
                    assignment[student_id][project_name]
                    for student_id in student_ids
                    if students[student_id]['major'] == required_major
                ]
                
                if students_with_major:
                    # Only enforce if project is active
                    model.Add(
                        sum(students_with_major) >= required_count
                    ).OnlyEnforceIf(project_is_active[project_name])
    
    # Assign and build objective
    
    print("Building objective function...")
    objective_terms = []
    
    # Define major categories for matching logic
    software_majors = {'Computer Science', 'Software Engineering', 'Data Science'}
    hardware_majors = {
        'Electrical Engineering', 'Mechanical Engineering', 
        'Biomedical Engineering', 'Computer Engineering', 'Systems Engineering'
    }
    
    # 4.1: PREFERENCE SATISFACTION SCORES
    for student_id in student_ids:
        student = students[student_id]
        is_upper = student['classLevel'] == '3200'
        
        for project_name in project_names:
            if project_name in student['preferences']:
                preference_rank = student['preferences'].index(project_name)
                
                # Calculate base score based on rank and class level
                if is_upper:
                    # 3200 students: only top 3 matter (constraint blocks others)
                    if preference_rank == 0:
                        base_score = config['weights']['upper3200FirstChoice']
                    elif preference_rank == 1:
                        base_score = config['weights']['upper3200SecondChoice']
                    elif preference_rank == 2:
                        base_score = config['weights']['upper3200ThirdChoice']
                    else:
                        base_score = 0  # Shouldn't happen due to constraint
                else:
                    # 2200 students: all 6 choices matter
                    if preference_rank == 0:
                        base_score = config['weights']['lower2200FirstChoice']
                    elif preference_rank == 1:
                        base_score = config['weights']['lower2200SecondChoice']
                    elif preference_rank == 2:
                        base_score = config['weights']['lower2200ThirdChoice']
                    elif preference_rank >= 3:  # 4th, 5th, 6th choice
                        base_score = config['weights']['lower2200FourthToSixth']
                    else:
                        base_score = 0
                
                objective_terms.append(base_score * assignment[student_id][project_name])
    
    # 4.2: RETURNING STUDENT BONUS
    for student_id in student_ids:
        student = students[student_id]
        returning_project = student.get('returningToProject')
        
        if returning_project and returning_project in project_names:
            bonus = config['weights']['returningStudentBonus']
            objective_terms.append(bonus * assignment[student_id][returning_project])
    
    # 4.3: SKILLS MATCHING BONUS
    for student_id in student_ids:
        student = students[student_id]
        student_skills = set(student.get('skills', []))
        
        if student_skills:
            for project_name in project_names:
                project = projects[project_name]
                required_skills = set(project.get('requiredSkills', []))
                
                if required_skills:
                    matching_skills = student_skills & required_skills
                    match_count = len(matching_skills)
                    
                    if match_count > 0:
                        bonus = match_count * config['weights']['skillMatchBonus']
                        objective_terms.append(bonus * assignment[student_id][project_name])
    
    # 4.4: MAJOR MATCHING BONUS
    for student_id in student_ids:
        student = students[student_id]
        student_major = student['major']
        
        for project_name in project_names:
            project = projects[project_name]
            preferred_majors = project.get('preferredMajors', [])
            project_type = project.get('projectType', '')
            
            bonus = 0
            
            # Direct match with preferred majors list
            if preferred_majors and student_major in preferred_majors:
                bonus = config['weights']['majorMatchBonus']
            
            # Type-based matching (software student -> software project, etc.)
            elif project_type == 'Both':
                # "Both" projects accept all majors well
                bonus = int(config['weights']['majorMatchBonus'] * 0.8)
            elif project_type == 'Software' and student_major in software_majors:
                bonus = int(config['weights']['majorMatchBonus'] * 0.6)
            elif project_type == 'Hardware' and student_major in hardware_majors:
                bonus = int(config['weights']['majorMatchBonus'] * 0.6)
            
            if bonus > 0:
                objective_terms.append(bonus * assignment[student_id][project_name])
    
    # 4.5: GENDER BALANCE PENALTY (avoid isolation)
    for project_name in project_names:
        # Count males and females on each team
        male_assignments = [
            assignment[student_id][project_name]
            for student_id in student_ids
            if students[student_id].get('gender') == 'Male'
        ]
        
        female_assignments = [
            assignment[student_id][project_name]
            for student_id in student_ids
            if students[student_id].get('gender') == 'Female'
        ]
        
        if male_assignments:
            male_count = model.NewIntVar(0, config['teamSizeHardMax'], f'male_count_{project_name}')
            model.Add(male_count == sum(male_assignments))
            
            # Create boolean for isolation (exactly 1 male)
            male_is_isolated = model.NewBoolVar(f'male_isolated_{project_name}')
            model.Add(male_count == 1).OnlyEnforceIf(male_is_isolated)
            model.Add(male_count != 1).OnlyEnforceIf(male_is_isolated.Not())
            
            # Apply penalty
            penalty = config['weights']['genderIsolationPenalty']
            objective_terms.append(penalty * male_is_isolated)
        
        if female_assignments:
            female_count = model.NewIntVar(0, config['teamSizeHardMax'], f'female_count_{project_name}')
            model.Add(female_count == sum(female_assignments))
            
            # Create boolean for isolation (exactly 1 female)
            female_is_isolated = model.NewBoolVar(f'female_isolated_{project_name}')
            model.Add(female_count == 1).OnlyEnforceIf(female_is_isolated)
            model.Add(female_count != 1).OnlyEnforceIf(female_is_isolated.Not())
            
            # Apply penalty
            penalty = config['weights']['genderIsolationPenalty']
            objective_terms.append(penalty * female_is_isolated)
    
    # 4.6: TEAM SIZE PENALTIES (for teams larger than ideal)
    for project_name in project_names:
        team_size = sum(assignment[student_id][project_name] for student_id in student_ids)
        
        # Variables to track students over ideal sizes
        # For team size 7: 1 student over 6
        # For team size 8: 1 student over 6, 1 student over 7
        # For team size 9: 1 student over 6, 2 students over 7
        
        # Create variables for excess students
        students_over_6 = model.NewIntVar(0, config['teamSizeHardMax'] - 6, f'over6_{project_name}')
        students_over_7 = model.NewIntVar(0, config['teamSizeHardMax'] - 7, f'over7_{project_name}')
        
        # Link to actual team size
        model.Add(students_over_6 == team_size - 6).OnlyEnforceIf(project_is_active[project_name])
        model.Add(students_over_6 >= 0)
        
        model.Add(students_over_7 == team_size - 7).OnlyEnforceIf(project_is_active[project_name])
        model.Add(students_over_7 >= 0)
        
        # Apply penalties
        # Light penalty for 7th student (students_over_6 when team = 7)
        objective_terms.append(config['weights']['teamSizeLightPenalty'] * students_over_6)
        
        # Heavy penalty for 8th+ students (students_over_7 when team >= 8)
        objective_terms.append(config['weights']['teamSizeHeavyPenalty'] * students_over_7)
    
    # 4.7: PROJECT ACTIVATION BONUS (encourage keeping projects active)
    for project_name in project_names:
        bonus = config['weights']['projectActivationBonus']
        objective_terms.append(bonus * project_is_active[project_name])
    
    # 4.8: SET OBJECTIVE - Maximize total score
    model.Maximize(sum(objective_terms))
    
    # ==================== SOLVE THE MODEL ====================
    
    print("Solving model...")
    solver = cp_model.CpSolver()
    
    # Set time limit (30 seconds)
    solver.parameters.max_time_in_seconds = 30.0
    
    # Solve
    status = solver.Solve(model)
    
    # Solution found, extracted for formatting
    
    if status == cp_model.OPTIMAL or status == cp_model.FEASIBLE:
        print(f"Solution found: {solver.StatusName(status)}")
        
        # Extract team assignments
        team_assignments = {p: [] for p in project_names}
        deactivated_projects = []
        
        for student_id in student_ids:
            for project_name in project_names:
                if solver.Value(assignment[student_id][project_name]) == 1:
                    team_assignments[project_name].append(student_id)
                    break
        
        # Track deactivated projects
        for project_name in project_names:
            if solver.Value(project_is_active[project_name]) == 0:
                deactivated_projects.append(project_name)
        
        # Remove empty projects from assignments
        team_assignments = {p: members for p, members in team_assignments.items() if members}
        
        return {
            'success': True,
            'teams': team_assignments,
            'score': solver.ObjectiveValue(),
            'solveTime': solver.WallTime(),
            'status': 'optimal' if status == cp_model.OPTIMAL else 'feasible',
            'deactivatedProjects': deactivated_projects
        }
    else:
        print(f"No solution found: {solver.StatusName(status)}")
        return {
            'success': False,
            'error': f'No solution found. Status: {solver.StatusName(status)}',
            'status': 'infeasible' if status == cp_model.INFEASIBLE else 'unknown'
        }


def main():
    """
    Main entry point when called from command line
    Reads JSON input from stdin and outputs JSON result to stdout
    """
    try:
        # Read JSON input from stdin
        input_data = json.loads(sys.stdin.read())
        
        students = input_data['students']
        projects = input_data['projects']
        config = input_data.get('config', None)
        
        # Generate teams
        result = generate_team_assignments(students, projects, config)
        
        # Output result as JSON to stdout
        print(json.dumps(result))
        
    except Exception as e:
        # Output error as JSON
        error_result = {
            'success': False,
            'error': str(e)
        }
        print(json.dumps(error_result))
        sys.exit(1)


if __name__ == '__main__':
    main()