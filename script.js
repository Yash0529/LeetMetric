document.addEventListener("DOMContentLoaded",function(){
    const searchBtn=document.querySelector('#search-btn');
    const usernameInput=document.querySelector('#user-input');
    const statsContainer=document.querySelector('.stats-container');
    const mediumProgressCircle=document.querySelector('.medium-progress');
    const easyProgressCircle=document.querySelector('.easy-progress');
    const hardProgressCircle=document.querySelector('.hard-progress');
    const easyLabel=document.querySelector('#easy-label');
    const mediumLabel=document.querySelector('#medium-label');
    const hardLabel=document.querySelector('#hard-label');
    const cardStatsContainer=document.querySelector('.stats-card');
    
    function validateUsername(username){
        if(username.trim()==="")
        {
            alert("Username should not be empty");
            return false;
        }

        const regex=/^(?![-_])[a-zA-Z0-9_-]{4,16}(?<![-_])$/;

        const isMatching=regex.test(username);
        if(!isMatching){
            alert("Invalid username");
        }

        return isMatching;
    }

    async function fetchUserDetails(username){
        const url=`https://leetcode-stats-api.herokuapp.com/${username}`;

        try {
            searchBtn.textContent="Searching...";
            searchBtn.disabled=true;
            const response=await fetch(url);

            if(!response.ok){
                throw new Error("Unable to fetch User Details");
            }

            const parsedData=await response.json();

            console.log(parsedData);

            displayUserData(parsedData);
        } catch (error) {
            statsContainer.innerHTML=`<p>No data found</p>`;
        }finally{
            searchBtn.textContent="Search";
            searchBtn.disabled=false;
        }

    }

    function updateProgress(solved, total, label, circle) {
        if (total === 0) total = 1; // Prevent division by zero
        const progressPercentage = (solved / total) * 100;
        
        circle.style.setProperty("--progress-degree", `${progressPercentage}%`); // Fixed percentage formatting
        label.textContent = `${solved}/${total}`;
    }
    
    function displayUserData(parsedData) {
        const totalEasyQuestions = parsedData.totalEasy || 1;
        const totalMediumQuestions = parsedData.totalMedium || 1;
        const totalHardQuestions = parsedData.totalHard || 1;
    
        const totalSolvedEasyQuestions = parsedData.easySolved || 0;
        const totalSolvedMediumQuestions = parsedData.mediumSolved || 0;
        const totalSolvedHardQuestions = parsedData.hardSolved || 0;
    
        console.log("Total Questions:", totalEasyQuestions, totalMediumQuestions, totalHardQuestions);
        console.log("Solved Questions:", totalSolvedEasyQuestions, totalSolvedMediumQuestions, totalSolvedHardQuestions);
    
        updateProgress(totalSolvedEasyQuestions, totalEasyQuestions, easyLabel, easyProgressCircle);
        updateProgress(totalSolvedMediumQuestions, totalMediumQuestions, mediumLabel, mediumProgressCircle);
        updateProgress(totalSolvedHardQuestions, totalHardQuestions, hardLabel, hardProgressCircle);

        const cardsData=[
            {
            
                label: "Overall Acceptance Rate",
                value: parsedData.acceptanceRate
            },

            {
                label: "Ranking",
                value: parsedData.ranking
            },

            {
                label: "ContributionPoints",
                value: parsedData.contributionPoints
            }

        ];
        

        console.log(cardsData);

        cardStatsContainer.innerHTML=cardsData.map(
            data=>{
                return `
                    <div class='card'>
                      <h4>${data.label}</h4>
                      <p>${data.value}</p>
                    </div>
                `
            }
        ).join("");

         
    }
    
    searchBtn.addEventListener('click',function(){
        const username=usernameInput.value;
        console.log(username)

        if(validateUsername(username)){
            fetchUserDetails(username);
        }
    })
});
