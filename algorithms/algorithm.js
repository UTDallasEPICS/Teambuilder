"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTeams = void 0;
function setup3200Students(teams, students, minimumStudents, maximumStudents) {
    // get only students of class '2200' that picked choices
    students.forEach(function (student) {
        if (student.class == '2200' && student.choices.length > 0) {
            var found = false;
            for (var _i = 0, _a = student.choices; _i < _a.length; _i++) {
                var choice = _a[_i];
                // assign student to the first choice that has room
                // for each student, for each choice, check if that choice has less than the maximum, if so assign student
                if (teams[choice].length < maximumStudents) {
                    teams[choice].push(student);
                    found = true;
                    break;
                }
            }
            // if no choice has less than maximum, assign to smallest team among choices
            if (!found)
                teams[student.choices.sort(function (a, b) { return teams[a].length - teams[b].length; })[0]].push(student);
        }
    });
}
function setup2200Students(teams, students, minimumStudents, maximumStudents) {
    // get only students of class '2200' that picked choices
    students.forEach(function (student) {
        if (student.class == '2200' && student.choices.length > 0) {
            var found = false;
            for (var _i = 0, _a = student.choices; _i < _a.length; _i++) {
                var choice = _a[_i];
                // assign student to the first choice that has room
                // for each student, for each choice, check if that choice has less than the maximum, if so assign student
                if (teams[choice].length < maximumStudents) {
                    teams[choice].push(student);
                    found = true;
                    break;
                }
            }
            // if no choice has less than maximum, assign to smallest team among choices
            if (!found)
                teams[student.choices.sort(function (a, b) { return teams[a].length - teams[b].length; })[0]].push(student);
        }
    });
}
function setupNoChoiceStudents(teams, students, minimumStudents, maximumStudents) {
    // get only students that didnt pick anything
    students.forEach(function (student) {
        if (student.choices.length === 0) {
            // assign these students only to teams that have l ess than the required minimum of students
            var found = false;
            for (var team in teams) {
                if (teams[team].length < minimumStudents) {
                    teams[team].push(student);
                    found = true;
                    break;
                }
            }
            // if no team has less than minimum, assign to smallest team
            if (!found) {
                teams[Object.keys(teams).sort(function (a, b) { return teams[a].length - teams[b].length; })[0]].push(student);
            }
        }
    });
}
/* -- TEAM SCORING --

   priority:
   1. major
   2. year
   3. choice
   score = (team avg. - class avg) * (# of team members / avg. team members)
   student 1 = 1.0
   student 2 = 0.8
   student 3 = 0.6
   student 4 = 0.3
   student 5 = 0.2
   student 6 = 0.1
   student 7 = 0.05
   maxStudents = floor(# students / # projects) + 1

----------------- */
// need to figure out what the weight for major, year, and choice is for each student (are freshman/sophomore and junior/senior a category)
// add scores of all students together on a team and divide by scores of all teams? (does it change depending on # of students on a team?)
// what score should we be aiming for for each team? what do we do in the case where the score is too far from our optimal score?
function calcTeamScore(teams, students) {
    var teamScore = 0;
    return teamScore;
}
// not sure what this function does... is this just the individual weight score for each student? 
function calcStudentImpactOnTeam(student, team) {
    //todo, get real algoirthm from max someday
    var impact = 0;
    if (student.class === '3200') {
        impact += 1.0;
    }
    else {
        impact += 0.5;
    }
    return impact;
}
function passOne(teams, students, projects, minimumStudents, maximumStudents) {
    setup3200Students(teams, students, minimumStudents, maximumStudents);
    setup2200Students(teams, students, minimumStudents, maximumStudents);
    setupNoChoiceStudents(teams, students, minimumStudents, maximumStudents);
}
function passTwo(teams, minimumStudents, maximumStudents) {
    // balancing pass - function that takes only the teams and min/max students
    // sort teams by least students to most
    var teamsArray = Object.values(teams);
    //Sort the array by the number of students in each team
    teamsArray.sort(function (a, b) { return a.length - b.length; });
    // any team with less than minimum, find a student from a team that has the most students and move the least impactful student
    teamsArray.forEach(function (team) {
        if (team.length < minimumStudents) {
            // find team with most students
            var teamWithMostStudents = teamsArray.sort(function (a, b) { return a.length - b.length; })[0];
            // find least impactful student
            var leastImpactfulStudent = teamWithMostStudents.sort(function (a, b) { return calcStudentImpactOnTeam(a, team) - calcStudentImpactOnTeam(b, team); })[0];
            // move student to team
            team.push(leastImpactfulStudent);
            teamWithMostStudents.splice(teamWithMostStudents.indexOf(leastImpactfulStudent), 1);
        }
    });
}
function generateTeams(students, projects, minimumStudents, maximumStudents) {
    var teams = projects.reduce(function (acc, current) {
        var _a;
        return __assign(__assign({}, acc), (_a = {}, _a[current.name] = [], _a));
    }, {});
    // pass 1
    passOne(teams, students, projects, minimumStudents, maximumStudents);
    // pass 2
    //passTwo(teams, minimumStudents, maximumStudents)
    // pass 3
    // can be run multiple times to achieve best average team score within 100 iterations
    // calculate average team score, if we have run less than 100 times AND avg team deviation is less than 1 std deviation then do a pass 
    // ends up being a while loop with 2 conditions
    return teams;
}
exports.generateTeams = generateTeams;
