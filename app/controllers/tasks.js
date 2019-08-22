import Controller from '@ember/controller';

let user;
let self;
let usernameAndCompletedTaskCountArray = [];
let myChartData = new Array();

checkIfLoggedId();

function checkIfLoggedId() {

    user = JSON.parse(sessionStorage.getItem("user"));
    if(!user) {
        window.location.href = "/login";
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

    let getAllUsersCompletedTaskCountRequest = new XMLHttpRequest();
    getAllUsersCompletedTaskCountRequest.onreadystatechange = () => { 
        if (getAllUsersCompletedTaskCountRequest.readyState == 4 && getAllUsersCompletedTaskCountRequest.status == 200){
            let allCompletedTaskCount = JSON.parse(getAllUsersCompletedTaskCountRequest.response);
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
            backgroundColor: makeNewColor(),
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

function getCompletedTaskCount() {
    let username = user.name;
    var getCompletedTaskCountRequest = new XMLHttpRequest();
    getCompletedTaskCountRequest.onreadystatechange = () => { 
        if (getCompletedTaskCountRequest.readyState == 4 && getCompletedTaskCountRequest.status == 200){
            let completedTaskCount = getCompletedTaskCountRequest.response;
            self.set("completedTaskCount",completedTaskCount);
            user.completedTasks = completedTaskCount;
            // console.log(user);
            sessionStorage.setItem("user",JSON.stringify(user));
            getEveryonesCompletedTasks();
        }
    }
    getCompletedTaskCountRequest.open("GET","http://localhost:4040/users/completedTaskCount?username="+username, true);
    getCompletedTaskCountRequest.setRequestHeader("Content-Type", "application/json");
    getCompletedTaskCountRequest.send();
}

function getMyTasks() {
    let username = user.name;
    var getTasksRequest = new XMLHttpRequest();
    getTasksRequest.onreadystatechange = () => { 
        if (getTasksRequest.readyState == 4 && getTasksRequest.status == 200){
            let myTasks = getTasksRequest.response;
            self.set("myTasks",JSON.parse(myTasks));
            getCompletedTaskCount();
        }
    }
    getTasksRequest.open("GET","http://localhost:4040/tasks?name="+username, true);
    getTasksRequest.setRequestHeader("Content-Type", "application/json");
    getTasksRequest.send();

}


export default Controller.extend({
    init: function () {
        this._super(... arguments);
        self = this;
        self.set("username",user.name);
        getMyTasks();
    },
    actions: {
        // listAllTasks: function(){
        //     self = this;
        //     getMyTasks();
        // },
        addNewTask: function() {

            let taskContent = document.getElementById("inputTask").value;
            taskContent = taskContent.trim();

            if(!taskContent) {
                alert("Please Write A Task!");
                return;
            }

            let task = {
                "content": taskContent
            }
            let username = user.name;
            var addTaskRequest = new XMLHttpRequest();
            addTaskRequest.onreadystatechange = () => { 
                if (addTaskRequest.readyState == 4 && addTaskRequest.status == 200){
                    document.getElementById("inputTask").value = "";
                    self = this;
                    getMyTasks();
                }
            }
            addTaskRequest.open("POST","http://localhost:4040/tasks?name="+username, true);
            addTaskRequest.setRequestHeader("Content-Type", "application/json");
            addTaskRequest.send(JSON.stringify(task));
        },
        logout: function() {
            sessionStorage.removeItem("user");
            window.location.href = "/login";
        },
        deleteTask: function(task) {
            let taskID = task.id;
            var getTasksRequest = new XMLHttpRequest();
            getTasksRequest.onreadystatechange = () => { 
                if (getTasksRequest.readyState == 4 && getTasksRequest.status == 200){
                    self = this;
                    getMyTasks();
                }
            }
            getTasksRequest.open("DELETE","http://localhost:4040/tasks?id="+taskID, true);
            getTasksRequest.setRequestHeader("Content-Type", "application/json");
            getTasksRequest.send();
        },
        completeTask: function(task) {
            let taskID = task.id;
            var getTasksRequest = new XMLHttpRequest();
            getTasksRequest.onreadystatechange = () => { 
                if (getTasksRequest.readyState == 4 && getTasksRequest.status == 200){
                    self = this;
                    getMyTasks();
                }
            }
            getTasksRequest.open("DELETE","http://localhost:4040/tasks/completed?id="+taskID, true);
            getTasksRequest.setRequestHeader("Content-Type", "application/json");
            getTasksRequest.send();
        }
    },
    numberData: Ember.computed(function() {
        return {
            labels: ["2018","2019"],
            datasets: [
                {
                    label: "Completed Tasks",
                    fillColor: "#AFF",
                    strokeColor: "#AFF",
                    highlightFill: "#AFF",
                    highlightStroke: "#AFF",
                    data: [0,user.completedTasks]
                }
            ]
        }
    })
});
