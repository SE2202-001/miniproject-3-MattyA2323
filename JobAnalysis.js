
//Job class with constructor for all variables and a get details method
class Job {
    constructor(jobNo, title, jobPageLink, posted, type, level, estimatedTime, skill, detail) {
        this.jobNo = jobNo;
        this.title = title;
        this.jobPageLink = jobPageLink;
        this.posted = parseTimeToMinutes(posted);//use helper function so we can sort by time posted later
        this.type = type;
        this.level = level;
        this.estimatedTime = estimatedTime;
        this.skill = skill;
        this.detail = detail;
    }

    getDetails() {
        return `Job No: ${this.jobNo}\nTitle: ${this.title}\nType: ${this.type}\nLevel: ${this.level}\nSkill: ${this.skill}\nDetail: ${this.detail}`;
    }
}

//Initialize an empty jobs array
let jobs = [];

//Handle file input and parse JSON data
const fileInput = document.getElementById('file-input');
fileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];

    if (file) {//Check if a file is selected by the user
        
        const reader = new FileReader();//Create a new FileReader object to read the contents of the file
        reader.onload = function (e) {
            
            try {
                const jobData = JSON.parse(e.target.result);//Parse the file content into a JavaScript object
                jobs = jobData.map(job => new Job(
                    
                    //Map each job entry from the parsed JSON into a new Job object
                    job['Job No'],
                    job['Title'],
                    job['Job Page Link'],
                    job['Posted'],
                    job['Type'],
                    job['Level'],
                    job['Estimated Time'],
                    job['Skill'],
                    job['Detail']
                ));

                //method calls to populate the filter dropdowns and display the jobs
                populateFilters(jobs);
                displayJobs(jobs);

            } catch (error) {//Handle any errors that occur during parsing
                alert('Invalid JSON file.');
                console.error(error);
            }
        };
        reader.readAsText(file);
    }
});

//Function to populate filter dropdown menus
function populateFilters(jobs) {
    
    //Creates collection of unique valeus for level, types, skill using Set
    const levels = new Set(jobs.map(job => job.level));
    const types = new Set(jobs.map(job => job.type));
    const skills = new Set(jobs.map(job => job.skill));

    //Populates the filter dropdowns with the unique values form collection
    populateDropdown('level-filter', levels);
    populateDropdown('type-filter', types);
    populateDropdown('skill-filter', skills);
}

//Function to populate a specific dropdown with given values
function populateDropdown(dropdownId, values) {

    //Get the dropdown element by its ID
    const dropdown = document.getElementById(dropdownId);

    //Set the initial dropdown content to include an "All" option
    dropdown.innerHTML = '<option value="all">All</option>';

     //for each value in the collection add it to the dropdown
    values.forEach(value => {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = value;
        dropdown.appendChild(option);
    });
}

function displayJobs(jobs) {

    const jobList = document.getElementById('job-list');//Get the HTML element where job listings will be displayed
    jobList.innerHTML = '';//Clear any existing content in the job list area

    //Check if there are any jobs to display if not display this message
    if (jobs.length === 0) {
        jobList.innerHTML = '<p class="no-jobs">No jobs to display. Please upload a JSON file or adjust filters.</p>';
        return;
    }


    jobs.forEach(job => {
        const jobItem = document.createElement('div');//Create a new <div> element for the job item
        
        jobItem.className = 'job-item';//Assign a CSS class to the job item for styling purposes
        jobItem.textContent = job.title;//Set the text content of the job item to the job's title
        
        //event listener to show job details when clicked
        jobItem.addEventListener('click', () => {
            alert(job.getDetails());
        });
        //Append the job item to the job list in the DOM
        jobList.appendChild(jobItem);
    });
}

//Filtering logic

//Select the filter button from the DOM
const filterButton = document.getElementById('filter-btn');

//event listener to filter when button is clicked
filterButton.addEventListener('click', () => {

    //Retrieve the selected filter values from the dropdowns
    const level = document.getElementById('level-filter').value;
    const type = document.getElementById('type-filter').value;
    const skill = document.getElementById('skill-filter').value;

     //Use the filter method to create a new array of jobs that match the selected criteria
    const filteredJobs = jobs.filter(job => {
        return (level === 'all' || job.level === level) &&
               (type === 'all' || job.type === type) &&
               (skill === 'all' || job.skill === skill);
    });

    //Update the displayed job listings with the filtered results
    displayJobs(filteredJobs);
});

//Sorting logic

//Select the sort button from the DOM
const sortButton = document.getElementById('sort-btn');

//event listener to sort when button is clicked 
sortButton.addEventListener('click', () => {
    const sortOption = document.getElementById('sort-options').value;//Retrieve the selected sorting option from the dropdown menu

    //Create a copy of the jobs array
    const sortedJobs = [...jobs];

    
    if (sortOption === 'title-asc') {//Sort alphabetically A-Z
        sortedJobs.sort((a, b) => a.title.localeCompare(b.title));

    } else if (sortOption === 'title-desc') {//Sort alphabetically Z-A
        sortedJobs.sort((a, b) => b.title.localeCompare(a.title));


    } else if (sortOption === 'posted-desc') {//Sort by newest first (smallest minutes)
        sortedJobs.sort((a, b) => a.posted - b.posted);

    } else if (sortOption === 'posted-asc') {
        sortedJobs.sort((a, b) => b.posted - a.posted); //Sort by oldest first largest minutes
    }

    displayJobs(sortedJobs);//Update the job listings with the sorted items
});


//Helper function to sort by time posted
function parseTimeToMinutes(postedTime) {
    const timeParts = postedTime.split(' ');//Split the string into value and unit
    const value = parseInt(timeParts[0], 10);//Extract the numeric value
    const unit = timeParts[1];//Extract the unit minutes or  hours

    if (unit.includes('minute')) {
        return value;//Time is already in minutes
    } else if (unit.includes('hour')) {
        return value * 60;//Convert hours to minutes
    }
}