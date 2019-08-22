import Controller from '@ember/controller';

let myColors = [];
let self;
let myChartData;
let usernameAndCompletedTaskCountArray= [];
let users;

function fillMyColors() {

    for(let i=0; i<10;i++) {
        myColors[i] = makeNewColor();
    }
}

function makeNewColor() {
    let red = Math.floor(Math.random()*255);
    let green = Math.floor(Math.random()*255);
    let blue = Math.floor(Math.random()*255);
    let newColor = "rgb("+red+","+green+","+blue+",1)";
    return newColor;
}

function getEveryonesCompletedTasks() {
    usernameAndCompletedTaskCountArray =[];
    let getAllUsersCompletedTaskCountRequest = new XMLHttpRequest();
    getAllUsersCompletedTaskCountRequest.onreadystatechange = () => { 
        if (getAllUsersCompletedTaskCountRequest.readyState == 4 && getAllUsersCompletedTaskCountRequest.status == 200){
            let allCompletedTaskCount = JSON.parse(getAllUsersCompletedTaskCountRequest.response);
            users = allCompletedTaskCount;
            self.set("users",users);
            for(let i=0;i<allCompletedTaskCount.length;i++) {
                usernameAndCompletedTaskCountArray[i] = []
                usernameAndCompletedTaskCountArray[i][0] = allCompletedTaskCount[i].name;
                usernameAndCompletedTaskCountArray[i][1] = allCompletedTaskCount[i].completedTasks;
            }
            organizeChart();
        }
    }
    getAllUsersCompletedTaskCountRequest.open("GET","http://localhost:4040/users/allCompletedTaskCount", true);
    getAllUsersCompletedTaskCountRequest.setRequestHeader("Content-Type", "application/json");
    getAllUsersCompletedTaskCountRequest.send();


}

function makeChartData() {
    myChartData = [];
    for(let i=0;i<usernameAndCompletedTaskCountArray.length;i++) {
        let newData = {
            label : usernameAndCompletedTaskCountArray[i][0],
            backgroundColor: myColors[i],
            data : [usernameAndCompletedTaskCountArray[i][1]]
        }
        myChartData.push(newData);
    }
    // console.log(myChartData);
}

function organizeChart() {

    makeChartData();

    self.set("myCompletedTaskData",{
        labels: ["2019"],
        datasets: myChartData
        }
    );

    self.set("myOptions", {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true,
                    responsive: true
                }
            }]
        }
    });


}

export default Controller.extend({

    init: function(){
        this._super(... arguments);
        self = this;
        fillMyColors();
        getEveryonesCompletedTasks();
    },
    actions: {
        deleteUser: function(user) {
            let deleteUserRequest = new XMLHttpRequest();
            deleteUserRequest.onreadystatechange = () => { 
                if (deleteUserRequest.readyState == 4 && deleteUserRequest.status == 200){
                    getEveryonesCompletedTasks();
                }
            }
            deleteUserRequest.open("DELETE","http://localhost:4040/users?adminID=5&userID="+user.id, true);
            deleteUserRequest.setRequestHeader("Content-Type", "application/json");
            deleteUserRequest.send();
        }
    }
});
