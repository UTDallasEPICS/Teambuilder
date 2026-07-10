# Team Formation

## 1. Shell
The navbar contains links to Database; Team Formation; Automation; User Management (admin only); and Logout.
## 2. Shared Components
These patterns are reused throughout the app. Entity-specific sections below reference them rather than re-specifying them.
### 2.1 Semester Filter
The semester filter contains:
- Semester Selection: dropdown with list of existing semesters
- Semester Clear: button to clear Semester Selection that is only present when a semester is set.
- Add Semester: button that opens the semester creation modal with fields:
    - Season (radio buttons)
    - Year
### 2.2 Table/List
The "major records" are projects, students, and partners.
All other types of records are "minor records".

A table displays a collection of records.
Clicking on the name of a major record should open the record's Item Panel.
Only tables for major records have pagination, filtering, and sorting.

The tables for minor records may be organized as a plain list of records or list of expandable cards.
#### 2.2.1 Pagination
Below the table are the pagination controls, including:
- Row per Page Selection: dropdown to with items (10, 25, 50)?
- Navigation buttons for:
    - First Page (|<)
    - Previous Page (<)
    - Next Page (>)
    - Last Page (>|)
      The table should become scrollable if it would exceed its container height.
#### 2.2.2 Filtering and Sorting
Near each column header should be:
- Filter Selection: multiselect dropdown or search bar as appropriate; when a multiselect is used, any of the options selected are allowed.
- Filter Clear: button to clear Filter Selection that is only present when a filter is set
- Sort Control: button with that cycles between three states when clicked on
    - Unset (up and down arrow)
    - Ascending (up arrow)
    - Descending (down arrow)

Sorting by one field should immediately clear all sorting by other fields.
#### 2.2.3 Row Selection
The leftmost column contains checkboxes for selecting rows for bulk operations.

The checkbox in the header should be in one of three states:
- All Selected (checkbox)
- Some Selected (minus)
- None Selected (empty)

Clicking on the header checkbox in the Some Selected or None Selected state should select all rows; clicking on it in the All Selected state should deselect all rows.
#### 2.2.4 Operations
Above the table is a toolbar with buttons for Add, Delete, Confirm and Cancel.
The confirm and cancel buttons only appear when editing fields of the table, used to save/discard the changes.

Clicking the Add button opens the Creation Panel/Model for the item.
Creation Panels are used for creating the major records: partners, projects, and students.
Creation Modals are used for the other record types.

Selecting a subset of records and then pressing the Delete button will open a Confirmation Modal for the delete operation.
### 2.3 Item Panel
Overlays the table when opened and displays full info on a single major record.

At the top right of the panel is a toolbar with buttons for Confirm, Cancel, and Delete.
These serve a similar function as in tables.
### 2.4 Creation Panel
Identical layout to Item Panel but with only Confirm / Cancel buttons.
### 2.5 Confirmation Modal
Lists the number and type of affected/cascading records in a delete operation.
Has Confirm / Cancel buttons at the bottom to determine whether deletion proceeds.
### 2.6 Record Search Inputs
Inputs for selecting a major records should be a search bar that searches by certain attributes of the linked record and displays the top results at any point for quick selection.
## 3. Database Page
There are three tabs, all sharing the Semester Filter.

### 3.1 Projects Tab
Base Columns: Name, Description, Type (Software / Hardware), Status, GitHub Link.

If a semester filter is present, only projects that have a team in the selected semester appear.
#### 3.1.1 Project Item Panel
Displays full info on a project record including teams of that project across semesters.
If a semester filter is present, only teams in the selected semester appear.

The teams are shown as a list of expandable cards, ordered from most to least recent semester. The cards show the list of mentors and list of students on the projects. The Creation Modal for mentors and students should use a Record Search Input that searches by project name and partner name.
#### 3.1.2 Team Creation Modal

| Field       | Input         |
| ----------- | ------------- |
| Semester    | Dropdown      |
| Meeting Day | Radio Buttons |

### 3.2 Students Tab
Base Columns: NetID, First Name, Last Name, Email, Discord, Mentor Status

If a semester filter is present,
- Additional Columns:
- only students that are enrolled in the selected semester or mentoring in a team in the select semester appear.
#### 3.2.1 Student Item Panel
Displays full info on a project record including info for each semester they are enrolled as a student/mentoring.
If a semester filter is present, only info the selected semester appears.

The semester info items are shown as a list of expandable cards, ordered from most to least recent semester.
The cards indicate whether they are a mentor/student for the semester.
Mentor cards are not expandable. Student cards can expand to show the list of team preferences the student submitted for that semester. The team preference Creation Modal should use a Record Search Input that searches by project name and partner name among teams available for that semester. Each team preference should have a Move Up (up arrow) and a Move Down (down arrow) button to adjust the ranking.

#### 3.2.2 Semester Info Creation Modal

|Field|Input|Condition|
|---|---|---|
|Semester|Dropdown|Always|
|Meeting Day|Dropdown|Always|
|Role|Radio _(Mentor / Student)_|Only if student has the mentor flag|

### 3.3 Partners Tab
Base Columns: Name, Email, Phone

If a semester filter is present, only partners with a team in the selected semester appear.
#### 3.3.1 Partner Item Panel

Displays full info on a partner, including list of contacts and list of projects.

If a semester filter is present, only project with a team in the selected semester appear.

#### 3.3.2 Contact Creation Modal

|Field|Input|
|---|---|
|Name|Text|
|Phone|Text|
|Email|Text|
### 3.4. Icon Reference

| Action       | Icon          |
| ------------ | ------------- |
| Add          | Plus (+)      |
| Delete       | Minus (−)     |
| Confirm      | Checkmark (✓) |
| Cancel/Clear | X (✗)         |
# 4. Team Formation
The team builder page should have three steps arranged in a stepper like component.
1. Select which semester (season and year) and meeting day to create teams for. The list of teams involved in that semester and lab day should already be entered by now.
2. Upload the appropriate student bid file. The entire sheet should be validated before any records are added to the database. Any errors such as missing fields or unrecognized values should be displayed to the user and the upload aborted.
3. Select parameters for team generation and execute. Alert the client if the algorithm was unable to obey the hard constraints and had to fallback.
